import React from 'react';
import { X, Flame, Zap, Layers, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Panduan Ekstraksi 15-30 Klip Hook Viral
              </h2>
              <p className="text-xs text-slate-400">
                Cara memaksimalkan retensi penonton dan konversi followers dari video panjang.
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
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm text-slate-300">
          {/* Step by step */}
          <div className="space-y-3">
            <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Alur Kerja Aplikasi (Workflow 3 Langkah)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-100 text-xs">Pilih Video Panjang</h4>
                <p className="text-[11px] text-slate-400">
                  Gunakan video podcast atau webinar (30-60 menit) siap pakai, atau upload file MP4 Anda sendiri.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-100 text-xs">AI Scan Hook (15-30 Klip)</h4>
                <p className="text-[11px] text-slate-400">
                  Gemini 3.8 Flash memindai kurva retensi, mendeteksi intonasi dan kata pembuka yang memicu rasa penasaran.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-100 text-xs">Reframe & Ekspor 9:16</h4>
                <p className="text-[11px] text-slate-400">
                  Otomatis potong ke rasio 9:16 dengan teks subtitle dinamis gaya Alex Hormozi atau MrBeast.
                </p>
              </div>
            </div>
          </div>

          {/* Hook Types */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              6 Formula Hook Paling Viral yang Dideteksi AI:
            </h3>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                  Pattern Interrupt
                </span>
                <p className="text-xs text-slate-300">
                  Menghentikan scroll penonton dengan pernyataan tegas atau suara/gerakan tak terduga ("Stop buang uang beli ini...").
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                  Curiosity Gap
                </span>
                <p className="text-xs text-slate-300">
                  Membuka misteri yang hanya terjawab di akhir video ("Alasan kenapa 99% orang gagal di 30 hari pertama...").
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  Value Bomb
                </span>
                <p className="text-xs text-slate-300">
                  Informasi teknis tingkat tinggi yang jarang diungkap orang lain secara gratis ("Ini formula 3 langkah monetisasi...").
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
                  Controversial Take
                </span>
                <p className="text-xs text-slate-300">
                  Opini berlawanan arus yang memicu perdebatan masif di kolom komentar, mendorong sinyal algoritma.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm transition-colors"
          >
            Mengerti, Siap Mulai
          </button>
        </div>
      </div>
    </div>
  );
};
