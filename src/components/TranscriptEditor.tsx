import React, { useState } from 'react';
import { Type, Play, Sparkles, Check, Edit2, RotateCcw } from 'lucide-react';
import { Clip, WordTimestamp } from '../types/clip';

interface TranscriptEditorProps {
  clip: Clip;
  onUpdateWords: (newWords: WordTimestamp[]) => void;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({ clip, onUpdateWords }) => {
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  // Flatten words for editing
  const words: WordTimestamp[] = [];
  clip.segments.forEach((seg) => {
    seg.words.forEach((w) => words.push({ ...w }));
  });

  const handleStartEdit = (index: number, currentWord: string) => {
    setEditingWordIndex(index);
    setEditingValue(currentWord);
  };

  const handleSaveWord = (index: number) => {
    if (editingValue.trim() && words[index]) {
      words[index].w = editingValue.trim();
      onUpdateWords(words);
    }
    setEditingWordIndex(null);
  };

  const handleToggleEmphasis = (index: number) => {
    if (words[index]) {
      words[index].emphasis = !words[index].emphasis;
      onUpdateWords(words);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Word Transcript</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            Click any word to edit spelling or toggle karaoke emphasis.
          </p>
        </div>
        <span className="text-[10px] font-mono-num text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          {words.length} Words
        </span>
      </div>

      {/* Words grid / text flow */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap gap-1.5 leading-loose">
          {words.map((item, idx) => {
            const isEditing = editingWordIndex === idx;

            if (isEditing) {
              return (
                <div key={idx} className="inline-flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5">
                  <input
                    type="text"
                    value={editingValue}
                    autoFocus
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveWord(idx);
                      if (e.key === 'Escape') setEditingWordIndex(null);
                    }}
                    className="w-20 bg-slate-950 text-xs text-white px-1 py-0.5 rounded border border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSaveWord(idx)}
                    className="p-1 text-emerald-400 hover:text-emerald-300"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              );
            }

            return (
              <span
                key={idx}
                onDoubleClick={() => handleStartEdit(idx, item.w)}
                onClick={() => handleToggleEmphasis(idx)}
                className={`inline-block px-1.5 py-0.5 rounded text-xs cursor-pointer transition-all ${
                  item.emphasis
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={`Timestamp: ${item.start.toFixed(1)}s - Double click to edit text, click to toggle emphasis`}
              >
                {item.w}
              </span>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
          <span>Tip: Double click to correct typo · Single click to highlight</span>
          <span className="text-amber-400 font-medium">Highlighted = Karaoke pop</span>
        </div>
      </div>
    </div>
  );
};
