import React, { useState } from 'react';
import { X, Sparkles, Check, Flame, RefreshCw, Wand2 } from 'lucide-react';
import { VideoClip } from '../types';

interface HookRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip | null;
  onApplyNewHook: (newHook: string) => void;
}

export const HookRefineModal: React.FC<HookRefineModalProps> = ({
  isOpen,
  onClose,
  clip,
  onApplyNewHook,
}) => {
  const [style, setStyle] = useState<'provocative' | 'curiosity' | 'numerical' | 'story'>('provocative');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedHooks, setSuggestedHooks] = useState<string[]>([]);
  const [psychologicalNote, setPsychologicalNote] = useState<string>('');
  const [selectedHookText, setSelectedHookText] = useState<string>('');

  if (!isOpen || !clip) return null;

  const handleGenerateVariations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/refine-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalHook: clip.hookSentence,
          clipTitle: clip.title,
          style,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const list = [data.enhancedHook, ...(data.altHooks || [])].filter(Boolean);
        setSuggestedHooks(list);
        setPsychologicalNote(data.psychologicalTrigger || 'Memicu pelepasan dopamin dan menghentikan kebiasaan scrolling penonton.');
        setSelectedHookText(data.enhancedHook || list[0] || '');
      }
    } catch (err) {
      console.error(err);
      setSuggestedHooks([
        `Jangan pernah lakukan ini kalau tidak mau menyesal seumur hidup: "${clip.hookSentence}"`,
        `99% orang tidak tahu satu trik rahasia ini!`,
        `Ini alasan kenapa kamu masih gagal mencapai target tahun ini...`,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (selectedHookText) {
      onApplyNewHook(selectedHookText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                AI Hook Optimizer (Gemini 3.8 Flash)
              </h2>
              <p className="text-xs text-slate-400">
                Tulis ulang 3 detik pertama agar 10x lebih memikat penonton.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Current Hook */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Hook Saat Ini:</label>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium italic">
              "{clip.hookSentence}"
            </div>
          </div>

          {/* Style selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pilih Pendekatan Psikologi Hook:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'provocative', label: '⚡ Provokatif & Berani', desc: 'Menentang keyakinan umum' },
                { id: 'curiosity', label: '🧠 Curiosity Gap', desc: 'Misteri & rahasia tersembunyi' },
                { id: 'numerical', label: '📊 Angka & Bukti Konkret', desc: 'Data statistik yang mengejutkan' },
                { id: 'story', label: '📖 Storytelling Mini', desc: 'Emosi personal & titik balik' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStyle(item.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    style === item.id
                      ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 font-bold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateVariations}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Sedang Meracik Hook Viral...' : 'Buat Variasi Hook Baru dengan AI'}</span>
          </button>

          {/* Suggested List */}
          {suggestedHooks.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Pilih Variasi Hook Terbaik:</span>
                <span className="text-[11px] text-amber-400 font-normal">Klik untuk memilih</span>
              </label>

              <div className="space-y-2">
                {suggestedHooks.map((hook, idx) => {
                  const isSelected = selectedHookText === hook;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedHookText(hook)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 text-xs ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-slate-100 font-semibold shadow-md'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="italic">"{hook}"</p>
                      </div>

                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {psychologicalNote && (
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  <strong className="text-indigo-400">Catatan Retensi: </strong>
                  {psychologicalNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Batal
          </button>

          <button
            onClick={handleApply}
            disabled={!selectedHookText}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-black font-extrabold text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Hook Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
