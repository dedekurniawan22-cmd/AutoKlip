import React from 'react';
import { Sparkles, Video, Film, Download, RefreshCw, HelpCircle, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenSourceModal: () => void;
  clipCount: number;
  totalDuration: number;
  onBatchExport: () => void;
  selectedClipsCount: number;
  isAnalyzing: boolean;
  onShowGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSourceModal,
  clipCount,
  onBatchExport,
  selectedClipsCount,
  isAnalyzing,
  onShowGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] shadow-lg shadow-amber-500/10">
            <div className="h-full w-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                HookClip AI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                15-30 Hook Clips
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pembuat Klip Otomatis dari Video Panjang dengan Deteksi Hook Viral
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI: <strong className="text-amber-300">Gemini 3.8 Flash</strong></span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Klip Aktif: <strong className="text-rose-300">{clipCount} Klip</strong></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onShowGuide}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="Panduan Cara Kerja"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline text-xs">Panduan</span>
          </button>

          <button
            onClick={onOpenSourceModal}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Ganti / Analisis Ulang</span>
          </button>

          {selectedClipsCount > 0 && (
            <button
              onClick={onBatchExport}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor ({selectedClipsCount})</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
