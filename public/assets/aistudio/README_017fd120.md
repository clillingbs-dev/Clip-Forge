# ClipForge

Turns a long video (podcast, interview, your own streams) into ranked 9:16 clips with
face-following crop, word-by-word captions, loudness-normalised audio, and a title plus
hashtags for each clip. It runs on your own computer, so it is free with no credits, no
watermark, and no time limits.

> Only clip videos you own or have permission to use (your own content, creator-approved
> content, licensed campaign footage, Creative Commons). Clipping random videos without
> permission gets accounts struck.

## Why local is the right "free hosting"

- GitHub Pages hosts static websites only. It cannot run video processing.
- Free cloud notebooks (Colab, Kaggle) have session limits and disconnect, so they
  cannot give "no interruptions" (check their current limits).
- Your own PC has no limits and nothing to disconnect. GitHub is still useful as a
  private backup of this code.

## Setup (Windows, one time, about 15 minutes)

1. Install Python 3.11 or 3.12 from python.org. Tick "Add python.exe to PATH".
2. Open PowerShell and install ffmpeg: `winget install Gyan.FFmpeg`. Then close and reopen PowerShell.
3. Put this folder somewhere, e.g. `C:\clipforge`, then:
   ```
   cd C:\clipforge
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. Get a free Gemini key (this is what picks the best moments; it makes results far
   better than the built-in fallback): go to aistudio.google.com, sign in, click
   "Get API key", create one. Free-tier limits change, so check the page.
   Then in PowerShell: `setx GEMINI_API_KEY "paste-key-here"` and reopen PowerShell
   (and re-run `venv\Scripts\activate`).

## Use it

```
python clipper.py "C:\videos\podcast.mp4" -n 5
```

Clips appear in `output\` as `clip_01.mp4` (best) onward, each with a `.txt` caption and
a summary in `clips.json`.

Useful options:

| Option | What it does |
|---|---|
| `-n 8` | number of clips |
| `--min 30 --max 70` | clip length range in seconds |
| `--whisper medium` | more accurate subtitles (slower). Try `large-v3` only with an NVIDIA GPU |
| `--language hi` | force a language (default: auto-detect) |
| `--layout fit` | whole video on blurred background (good for wide or multi-person shots) |
| `--no-ai` | skip Gemini, use the built-in picker |
| `--crf 16 --preset slow` | higher quality encode, slower |

A URL also works (`python clipper.py "https://..."`), but YouTube often blocks downloaders.
If it fails, download the video yourself and pass the file path instead.

## Posting to all your accounts

Start by uploading manually from your phone. It is the safest for new accounts. When you
are ready to automate, use the free tier of Upload-Post or self-hosted Postiz.

## Getting better results than the default

- Use a good source: clear audio and one or two people talking. Music or noisy video hurts.
- Use `--whisper medium` for accurate captions, especially in Hindi or mixed languages.
- Generate more clips than you need (`-n 10`) and post only the best 3 to 4.
- Watch each clip before posting. Trim bad ones, fix caption spelling in the `.ass` file
  inside `output\_work` and re-render if needed.
- Use `--layout fit` when the face-follow crop cuts people off.

## Honest limits

- Face tracking follows the largest front-facing face. Profile views and several speakers
  talking in turn can be off. Use `--layout fit` for those.
- Gemini's free tier has rate limits. The tool retries and falls back automatically.
- "Better than Opus Clip" depends on your source video and your picks. This gives you the
  same pipeline with full control and no cost. Review every clip.
- Captions are in the style of burned-in karaoke text (white, active word yellow). Edit
  the `Style:` line in `clipper.py` to change font, size, or colour.

## Troubleshooting

- `'ffmpeg' not found`: reopen PowerShell after installing, or run `ffmpeg -version`.
- First run is slow: Whisper downloads its model once (small is about 500 MB).
- Transcribing is slow on CPU: use `--whisper base`, or a shorter video.
- Gemini step failed: check the key is set (`echo $env:GEMINI_API_KEY`), or use `--no-ai`.
