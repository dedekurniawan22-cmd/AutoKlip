import React, { useState } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Layers, 
  FileArchive, 
  Copy, 
  Check, 
  Sparkles,
  Smartphone,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoClip, VideoSource } from '../types';
import { formatSecondsToTime, downloadFile, generateSrtContent } from '../utils/timeFormat';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClips: VideoClip[];
  videoSource: VideoSource;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  selectedClips,
  videoSource,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedIndex, setProcessedIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalDuration = selectedClips.reduce((acc, c) => acc + c.duration, 0);

  const handleStartBatchProcessing = () => {
    setIsProcessing(true);
    setProcessedIndex(0);
    setIsDone(false);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setProcessedIndex(current);
      if (current >= selectedClips.length) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsDone(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 400);
  };

  const handleDownloadAllCaptionsSrt = () => {
    let combined = '';
    selectedClips.forEach((clip) => {
      combined += `===============================================\n`;
      combined += `KLIP #${clip.clipNumber} - ${clip.title} (Skor Hook: ${clip.hookScore}%)\n`;
      combined += `Durasi: ${formatSecondsToTime(clip.startTime)} - ${formatSecondsToTime(clip.endTime)}\n`;
      combined += `Opening Hook: "${clip.hookSentence}"\n`;
      combined += `Caption:\n${clip.socialCaption}\n${clip.hashtags.join(' ')}\n\n`;
      combined += `--- SUBTITLES (.SRT) ---\n`;
      combined += generateSrtContent(clip.captions, clip.startTime);
      combined += `\n\n`;
    });

    downloadFile(combined, `paket-stok-konten-${selectedClips.length}-klip.txt`, 'text/plain');
  };

  const handleCopyAllSocialPack = () => {
    let text = `📦 BATCH STOK KONTEN VIRAL (${selectedClips.length} KLIP HOOK)\n\n`;
    selectedClips.forEach((clip) => {
      text += `--- [KLIP #${clip.clipNumber}] ${clip.title} ---\n`;
      text += `Hook: "${clip.hookSentence}"\n`;
      text += `${clip.socialCaption}\n`;
      text += `${clip.hashtags.join(' ')}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Batch Ekspor ({selectedClips.length} Klip Hook Terpilih)
              </h2>
              <p className="text-xs text-slate-400">
                Ekspor sekaligus seluruh klip pendek 9:16 untuk persediaan posting harian.
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

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Quick stats summary */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-500 block mb-1">Total Klip:</span>
              <span className="font-extrabold text-amber-400 text-base">{selectedClips.length} Klip</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-500 block mb-1">Total Durasi Konten:</span>
              <span className="font-extrabold text-slate-200 text-base">{Math.round(totalDuration / 60)} Menit</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-500 block mb-1">Rata-rata Hook:</span>
              <span className="font-extrabold text-emerald-400 text-base flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                {Math.round(selectedClips.reduce((a, b) => a + b.hookScore, 0) / Math.max(1, selectedClips.length))}%
              </span>
            </div>
          </div>

          {/* List preview of selected clips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Daftar Klip yang Akan Diproses:</label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
              {selectedClips.map((clip, i) => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span className="font-mono text-amber-400 font-bold shrink-0">#{clip.clipNumber}</span>
                    <span className="truncate text-slate-200">{clip.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {Math.round(clip.duration)}s
                    </span>
                    <span className="text-emerald-400 font-bold">{clip.hookScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Progress Bar */}
          {isProcessing && (
            <div className="space-y-2 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  Memproses Klip {processedIndex} dari {selectedClips.length}...
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round((processedIndex / selectedClips.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(processedIndex / selectedClips.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed State Actions */}
          {isDone && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Seluruh {selectedClips.length} Klip Siap Dipakai!</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={handleDownloadAllCaptionsSrt}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Unduh Paket Lengkap (.SRT + Naskah)</span>
                </button>

                <button
                  onClick={handleCopyAllSocialPack}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAll ? 'Semua Tersalin!' : 'Salin Semua Caption 30 Klip'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200"
          >
            Tutup
          </button>

          {!isDone && (
            <button
              onClick={handleStartBatchProcessing}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isProcessing ? 'Sedang Memproses...' : `Mulai Batch Ekspor (${selectedClips.length} Klip)`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
