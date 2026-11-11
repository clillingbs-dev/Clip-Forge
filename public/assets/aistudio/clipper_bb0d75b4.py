#!/usr/bin/env python3
"""
ClipForge - turn a long video into ranked, captioned 9:16 clips.

Pipeline:
  download (optional) -> transcribe (faster-whisper, local) -> pick highlights
  (Gemini free tier, or built-in heuristic fallback) -> snap to sentence edges
  -> face-aware vertical crop -> word-by-word captions -> encode (ffmpeg)

Only use videos you own or have permission to clip.
"""
import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from statistics import median

OUT_W, OUT_H = 1080, 1920


# --------------------------------------------------------------------------- utils
def log(msg):
    print(f"[clipforge] {msg}", flush=True)


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(
            "Command failed: " + " ".join(str(c) for c in cmd) + "\n" + r.stderr[-2500:]
        )
    return r


def check_tools():
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(
                f"'{tool}' not found. Install ffmpeg first "
                "(Windows: winget install Gyan.FFmpeg, then reopen the terminal)."
            )


def probe(path):
    r = run([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height:format=duration",
        "-of", "json", path,
    ])
    d = json.loads(r.stdout)
    st = d["streams"][0]
    return int(st["width"]), int(st["height"]), float(d["format"]["duration"])


# ------------------------------------------------------------------------ download
def download(url, work):
    out_tpl = str(work / "source.%(ext)s")
    log("Downloading video with yt-dlp ...")
    run([
        sys.executable, "-m", "yt_dlp",
        "-f", "bv*[height<=1080]+ba/b[height<=1080]/b",
        "--merge-output-format", "mp4",
        "--no-playlist", "-o", out_tpl, url,
    ])
    for p in work.glob("source.*"):
        if p.suffix.lower() in (".mp4", ".mkv", ".webm", ".mov"):
            return p
    raise RuntimeError("Download finished but no video file was found.")


# ------------------------------------------------------------------- transcription
def transcribe(video, work, model_size, language):
    cache = work / "transcript.json"
    if cache.exists():
        log("Using cached transcript.")
        return json.loads(cache.read_text(encoding="utf-8"))

    from faster_whisper import WhisperModel  # lazy import

    audio = work / "audio.wav"
    run(["ffmpeg", "-y", "-i", video, "-vn", "-ac", "1", "-ar", "16000", audio])

    try:
        import ctranslate2
        cuda = ctranslate2.get_cuda_device_count() > 0
    except Exception:
        cuda = False
    device, ctype = ("cuda", "float16") if cuda else ("cpu", "int8")
    log(f"Transcribing with Whisper '{model_size}' on {device} (first run downloads the model) ...")
    model = WhisperModel(model_size, device=device, compute_type=ctype)
    seg_iter, info = model.transcribe(
        str(audio), word_timestamps=True, vad_filter=True,
        language=language, beam_size=5,
    )
    total = info.duration or 1
    segments = []
    last_pct = -10
    for s in seg_iter:
        words = [
            {"w": w.word.strip(), "start": float(w.start), "end": float(w.end)}
            for w in (s.words or []) if w.word.strip()
        ]
        segments.append({
            "start": float(s.start), "end": float(s.end),
            "text": s.text.strip(), "words": words,
        })
        pct = int(100 * s.end / total)
        if pct >= last_pct + 10:
            log(f"  transcribed {pct}%")
            last_pct = pct
    cache.write_text(json.dumps(segments, ensure_ascii=False), encoding="utf-8")
    return segments


# ---------------------------------------------------------------- highlight picking
LLM_PROMPT = """You are an expert short-form video editor who picks clips that go viral on TikTok, Instagram Reels and YouTube Shorts.

Below is a timestamped transcript. Each line starts with [start-second].
Find up to {k} of the BEST self-contained moments to clip.

Rules for every clip:
- Length between {min_d} and {max_d} seconds. start/end are in seconds taken from the transcript timestamps.
- The FIRST sentence must be a strong hook (surprising claim, bold opinion, question, story opening, or strong emotion).
- It must make sense with zero outside context and end on a finished thought (a payoff, punchline or conclusion).
- Prefer: stories with a payoff, contrarian takes, concrete advice, emotional or funny moments, memorable one-liners.
- Avoid: intros, outros, sponsor reads, small talk, rambling, anything that needs earlier context.
- Clips must not overlap each other.
- score is 0-100: how likely this is to hold viewers to the end.

Return ONLY a JSON array, no markdown. Each item:
{{"start": number, "end": number, "title": "short punchy title under 70 chars", "hook": "the opening line", "score": number, "reason": "one sentence", "hashtags": ["#a", "#b", "#c"]}}

TRANSCRIPT:
{transcript}
"""


def gemini_call(prompt, api_key, model):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"},
    }).encode()
    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.loads(resp.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="ignore")[:300]
            if e.code in (429, 500, 503) and attempt < 3:
                wait = 20 * (attempt + 1)
                log(f"  Gemini busy/rate-limited ({e.code}); waiting {wait}s ...")
                time.sleep(wait)
                continue
            raise RuntimeError(f"Gemini error {e.code}: {detail}")
        except (urllib.error.URLError, TimeoutError):
            if attempt < 3:
                time.sleep(5)
                continue
            raise
    raise RuntimeError("Gemini failed after retries.")


def parse_json_list(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.M).strip()
    data = json.loads(text)
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list):
                data = v
                break
    return [d for d in data if isinstance(d, dict)]


def llm_candidates(segments, n, min_d, max_d, api_key, model):
    chunk_len, overlap = 1500.0, 90.0
    total = segments[-1]["end"]
    cands, a = [], 0.0
    while a < total:
        b = a + chunk_len
        part = [s for s in segments if a <= s["start"] < b]
        if part:
            lines = "\n".join(f"[{s['start']:.0f}] {s['text']}" for s in part)
            k = max(4, n * 2) if total <= chunk_len else max(4, n)
            log(f"Asking Gemini for highlights in {a/60:.0f}-{min(b,total)/60:.0f} min ...")
            raw = gemini_call(
                LLM_PROMPT.format(k=k, min_d=min_d, max_d=max_d, transcript=lines),
                api_key, model,
            )
            try:
                for d in parse_json_list(raw):
                    try:
                        cands.append({
                            "start": float(d["start"]), "end": float(d["end"]),
                            "title": str(d.get("title", ""))[:90],
                            "hook": str(d.get("hook", "")),
                            "score": float(d.get("score", 50)),
                            "reason": str(d.get("reason", "")),
                            "hashtags": [str(h) for h in d.get("hashtags", [])][:6],
                        })
                    except (KeyError, ValueError, TypeError):
                        continue
            except json.JSONDecodeError:
                log("  Could not parse one Gemini reply; skipping that chunk.")
        a += chunk_len - overlap
    return cands


HOOK_WORDS = {
    "secret", "mistake", "never", "always", "nobody", "everyone", "truth", "actually",
    "biggest", "worst", "best", "stop", "why", "how", "million", "free", "crazy",
    "insane", "shocking", "problem", "lesson", "learned", "wrong", "myth", "hack",
}
FILLER_START = ("and ", "so ", "but ", "because ", "or ", "yeah", "um", "uh", "like ")


def heuristic_candidates(segments, min_d, max_d):
    target = min_d + (max_d - min_d) * 0.45
    cands = []
    for i, s in enumerate(segments):
        j = i
        while j + 1 < len(segments) and segments[j]["end"] - s["start"] < target:
            j += 1
        dur = segments[j]["end"] - s["start"]
        if dur < min_d * 0.8:
            continue
        text = " ".join(x["text"] for x in segments[i:j + 1])
        words = text.split()
        if not words:
            continue
        density = min(len(words) / dur, 3.5) / 3.5
        lw = [w.strip(".,!?\"'").lower() for w in words]
        score = 35 * density
        score += min(text.count("?"), 3) * 5
        score += min(text.count("!"), 3) * 2
        score += min(sum(w in HOOK_WORDS for w in lw), 5) * 4
        score += min(len(re.findall(r"\d", text)), 4) * 1.5
        first = s["text"].lower().lstrip()
        if first.startswith(FILLER_START):
            score -= 8
        if s["text"][:1].isupper():
            score += 4
        if segments[j]["text"].rstrip().endswith((".", "!", "?")):
            score += 5
        sentence = re.split(r"(?<=[.!?])\s", s["text"].strip())[0]
        cands.append({
            "start": s["start"], "end": segments[j]["end"],
            "title": sentence[:70], "hook": sentence,
            "score": max(0.0, min(100.0, score)),
            "reason": "heuristic pick (speech density, hook words, questions)",
            "hashtags": [],
        })
    return cands


def snap_and_filter(cands, segments, n, min_d, max_d, total_dur):
    starts = [s["start"] for s in segments]
    ends = [s["end"] for s in segments]
    fixed = []
    for c in cands:
        st = min(starts, key=lambda x: abs(x - c["start"]))
        if abs(st - c["start"]) > 6:
            st = c["start"]
        en = min(ends, key=lambda x: abs(x - c["end"]))
        if abs(en - c["end"]) > 6:
            en = c["end"]
        if en - st > max_d:
            ok = [e for e in ends if st + min_d <= e <= st + max_d]
            en = max(ok) if ok else st + max_d
        if en - st < min_d:
            ok = [e for e in ends if e >= st + min_d]
            en = min(ok) if ok else st + min_d
        st = max(0.0, st - 0.15)
        en = min(total_dur, en + 0.25)
        if en - st < min_d * 0.7:
            continue
        d = dict(c)
        d["start"], d["end"] = st, en
        fixed.append(d)

    fixed.sort(key=lambda c: c["score"], reverse=True)
    picked = []
    for c in fixed:
        clash = False
        for p in picked:
            ov = min(c["end"], p["end"]) - max(c["start"], p["start"])
            if ov > 0.25 * min(c["end"] - c["start"], p["end"] - p["start"]):
                clash = True
                break
        if not clash:
            picked.append(c)
        if len(picked) >= n:
            break
    return picked


# ------------------------------------------------------------------ face-aware crop
def face_track(video, start, end, src_w, crop_w, sample=0.5):
    """Return [(t, left_x)] keypoints (t relative to clip start)."""
    center = (src_w - crop_w) // 2
    dur = end - start
    try:
        import cv2
    except ImportError:
        log("  opencv not installed; using center crop.")
        return [(0.0, center), (dur, center)]

    if not hasattr(cv2, "CascadeClassifier"):
        log("  this OpenCV build has no face detector (install opencv-python-headless<5); using center crop.")
        return [(0.0, center), (dur, center)]
    cap = cv2.VideoCapture(str(video))
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    if cascade.empty():
        log("  face model file missing; using center crop.")
        return [(0.0, center), (dur, center)]
    raw, t = [], 0.0
    while t <= dur:
        cap.set(cv2.CAP_PROP_POS_MSEC, (start + t) * 1000)
        ok, frame = cap.read()
        cx = None
        if ok:
            h, w = frame.shape[:2]
            scale = 640.0 / w if w > 640 else 1.0
            small = cv2.resize(frame, None, fx=scale, fy=scale) if scale != 1.0 else frame
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            faces = cascade.detectMultiScale(gray, 1.1, 5, minSize=(40, 40))
            if len(faces):
                x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
                cx = (x + fw / 2) / scale
        raw.append(cx)
        t += sample
    cap.release()

    if all(v is None for v in raw):
        return [(0.0, center), (dur, center)]
    # fill gaps
    last = next(v for v in raw if v is not None)
    filled = []
    for v in raw:
        last = v if v is not None else last
        filled.append(last)
    # median smoothing
    sm = []
    for i in range(len(filled)):
        win = filled[max(0, i - 2): i + 3]
        sm.append(median(win))
    # hysteresis: only move the camera when the subject really moved
    step = max(1, int(round(1.0 / sample)))
    cur = None
    pts = []
    for i in range(0, len(sm), step):
        target = min(max(sm[i] - crop_w / 2, 0), src_w - crop_w)
        if cur is None or abs(target - cur) > 0.12 * crop_w:
            cur = target
        pts.append((i * sample, int(cur) // 2 * 2))
    if pts[-1][0] < dur:
        pts.append((dur, pts[-1][1]))
    return pts


def crop_x_expr(pts):
    xs = {p[1] for p in pts}
    if len(xs) == 1:
        return str(pts[0][1])
    expr = str(pts[-1][1])
    for (t0, x0), (t1, x1) in reversed(list(zip(pts[:-1], pts[1:]))):
        if t1 <= t0:
            continue
        seg = f"{x0}+({x1}-{x0})*(t-{t0:.2f})/{t1 - t0:.2f}"
        expr = f"if(lt(t,{t1:.2f}),{seg},{expr})"
    return expr


# ------------------------------------------------------------------------- captions
def ass_time(t):
    cs = int(round(max(t, 0) * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


ASS_HEAD = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {OUT_W}
PlayResY: {OUT_H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,8,2,2,90,90,520,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def build_ass(segments, c_start, c_end, path):
    words = []
    for s in segments:
        for w in s["words"]:
            if w["start"] >= c_start - 0.05 and w["end"] <= c_end + 0.3:
                words.append({
                    "w": re.sub(r"[{}\\]", "", w["w"]).upper(),
                    "start": w["start"] - c_start,
                    "end": w["end"] - c_start,
                })
    groups, cur = [], []
    for w in words:
        if cur and (
            len(cur) >= 4
            or sum(len(x["w"]) for x in cur) + len(w["w"]) > 24
            or w["start"] - cur[-1]["end"] > 0.7
            or re.search(r"[.!?]$", cur[-1]["w"])
        ):
            groups.append(cur)
            cur = []
        cur.append(w)
    if cur:
        groups.append(cur)

    lines = [ASS_HEAD]
    for gi, g in enumerate(groups):
        next_group_start = groups[gi + 1][0]["start"] if gi + 1 < len(groups) else None
        for i, w in enumerate(g):
            start = w["start"]
            if i + 1 < len(g):
                end = g[i + 1]["start"]
            else:
                end = w["end"] + 0.2
                if next_group_start is not None:
                    end = min(end, next_group_start)
            if end <= start:
                end = start + 0.08
            parts = []
            for k, x in enumerate(g):
                if k == i:
                    parts.append("{\\1c&H00D7FF&\\fscx110\\fscy110}" + x["w"] + "{\\1c&HFFFFFF&\\fscx100\\fscy100}")
                else:
                    parts.append(x["w"])
            lines.append(
                f"Dialogue: 0,{ass_time(start)},{ass_time(end)},Cap,,0,0,0,,{' '.join(parts)}"
            )
    Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------- render
def render_clip(src, src_w, src_h, c, idx, out_dir, work, layout, loudnorm, crf, preset):
    name = f"clip_{idx:02d}"
    ass_name = f"{name}.ass"
    build_ass(c["segments"], c["start"], c["end"], work / ass_name)

    crop_w = int(src_h * OUT_W / OUT_H) // 2 * 2
    if layout == "fit" or crop_w >= src_w:
        vf = (
            f"split[a][b];"
            f"[a]scale={OUT_W}:{OUT_H}:force_original_aspect_ratio=increase,"
            f"crop={OUT_W}:{OUT_H},boxblur=35:6[bg];"
            f"[b]scale={OUT_W}:-2:flags=lanczos[fg];"
            f"[bg][fg]overlay=(W-w)/2:(H-h)/2,subtitles={ass_name},setsar=1"
        )
    else:
        pts = face_track(src, c["start"], c["end"], src_w, crop_w)
        expr = crop_x_expr(pts)
        vf = (
            f"crop=w={crop_w}:h={src_h}:x='{expr}':y=0,"
            f"scale={OUT_W}:{OUT_H}:flags=lanczos,subtitles={ass_name},setsar=1"
        )
    script = work / f"{name}.vf"
    script.write_text(vf, encoding="utf-8")

    out = out_dir / f"{name}.mp4"
    cmd = [
        "ffmpeg", "-y", "-ss", f"{c['start']:.3f}", "-i", src,
        "-t", f"{c['end'] - c['start']:.3f}",
        "-filter_script:v", script.name,
    ]
    if loudnorm:
        cmd += ["-af", "loudnorm=I=-16:TP=-1.5:LRA=11"]
    cmd += [
        "-c:v", "libx264", "-preset", preset, "-crf", str(crf),
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart", out,
    ]
    run(cmd, cwd=str(work))
    return out


def write_meta(c, out_path):
    tags = " ".join(c.get("hashtags") or [])
    caption = f"{c['title']}\n\n{tags}".strip()
    out_path.with_suffix(".txt").write_text(caption + "\n", encoding="utf-8")


# ------------------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description="ClipForge: long video -> ranked vertical clips")
    ap.add_argument("source", help="video file path or a URL (only content you may use!)")
    ap.add_argument("-n", "--clips", type=int, default=5, help="number of clips (default 5)")
    ap.add_argument("--min", type=float, default=25, dest="min_d", help="min clip seconds")
    ap.add_argument("--max", type=float, default=60, dest="max_d", help="max clip seconds")
    ap.add_argument("-o", "--out", default="output", help="output folder")
    ap.add_argument("--whisper", default="small",
                    help="whisper model: tiny/base/small/medium/large-v3 (bigger = better, slower)")
    ap.add_argument("--language", default=None, help="e.g. en, hi (default: auto-detect)")
    ap.add_argument("--layout", choices=["face", "fit"], default="face",
                    help="face = face-following crop, fit = full video on blurred background")
    ap.add_argument("--no-ai", action="store_true", help="skip Gemini, use heuristic picker")
    ap.add_argument("--gemini-model", default=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"))
    ap.add_argument("--crf", type=int, default=18, help="quality 14-23, lower = better/larger")
    ap.add_argument("--preset", default="medium", help="x264 preset (slow = smaller/better)")
    ap.add_argument("--no-loudnorm", action="store_true", help="skip audio loudness normalising")
    args = ap.parse_args()

    check_tools()
    out_dir = Path(args.out).resolve()
    work = out_dir / "_work"
    work.mkdir(parents=True, exist_ok=True)

    if re.match(r"^https?://", args.source):
        src = download(args.source, work)
    else:
        src = Path(args.source).resolve()
        if not src.exists():
            sys.exit(f"File not found: {src}")

    src_w, src_h, total = probe(src)
    log(f"Source: {src_w}x{src_h}, {total/60:.1f} min")

    segments = transcribe(src, work, args.whisper, args.language)
    if not segments:
        sys.exit("No speech detected - this tool needs a video with talking.")

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    cands = []
    if api_key and not args.no_ai:
        try:
            cands = llm_candidates(segments, args.clips, args.min_d, args.max_d,
                                   api_key, args.gemini_model)
        except Exception as e:  # network/API problem -> still produce clips
            log(f"AI step failed ({e}). Falling back to heuristic picker.")
    elif not args.no_ai:
        log("No GEMINI_API_KEY set - using heuristic picker (AI picks are noticeably better).")
    if not cands:
        cands = heuristic_candidates(segments, args.min_d, args.max_d)

    picked = snap_and_filter(cands, segments, args.clips, args.min_d, args.max_d, total)
    if not picked:
        sys.exit("Could not find any suitable clips.")
    log(f"Rendering {len(picked)} clip(s) ...")

    results = []
    for i, c in enumerate(picked, 1):
        c["segments"] = segments
        log(f"  clip {i}/{len(picked)}: {c['start']:.0f}s-{c['end']:.0f}s  \"{c['title']}\"")
        out = render_clip(src, src_w, src_h, c, i, out_dir, work, args.layout,
                          not args.no_loudnorm, args.crf, args.preset)
        write_meta(c, out)
        results.append({
            "file": out.name, "start": round(c["start"], 2), "end": round(c["end"], 2),
            "score": c["score"], "title": c["title"], "hook": c["hook"],
            "reason": c["reason"], "hashtags": c["hashtags"],
        })
    (out_dir / "clips.json").write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    log(f"Done! Clips are in: {out_dir}")


if __name__ == "__main__":
    main()
