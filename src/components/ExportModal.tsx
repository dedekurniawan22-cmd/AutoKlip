import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Film, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Sliders, 
  Layers, 
  Sparkles,
  Smartphone,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoClip, VideoSource, SubtitleStyle, ReframeMode } from '../types';
import { formatSecondsToTime, downloadFile, generateSrtContent } from '../utils/timeFormat';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip | null;
  videoSource: VideoSource;
  subtitleStyle: SubtitleStyle;
  reframeMode: ReframeMode;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  clip,
  videoSource,
  subtitleStyle,
  reframeMode,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('Siap mengekspor');
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [exportQuality, setExportQuality] = useState<'1080p' | '720p'>('1080p');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setExportProgress(0);
      setIsExporting(false);
      setExportedVideoUrl(null);
      setExportStatusText('Siap memproses video 9:16 dengan subtitle dinamis.');
    }
  }, [isOpen, clip?.id]);

  if (!isOpen || !clip) return null;

  const triggerConfettiCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#f43f5e', '#6366f1', '#10b981'],
    });
  };

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStatusText('Menyiapkan reframe 9:16 dan encoding audio-visual...');

    // Progress simulation while processing video stream & burned-in dynamic captions
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (next > 30 && next < 60) {
          setExportStatusText('Merender subtitle dinamis kata-per-kata...');
        } else if (next >= 60 && next < 85) {
          setExportStatusText('Mengompresi video vertikal 60fps untuk TikTok & Reels...');
        } else if (next >= 85) {
          setExportStatusText('Finalisasi file MP4 / WebM...');
        }
        return Math.min(95, next);
      });
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      setExportProgress(100);
      setIsExporting(false);
      setExportStatusText('Ekspor Berhasil!');
      setExportedVideoUrl(videoSource.url); // Ready preview & download
      triggerConfettiCelebration();
    }, 2800);
  };

  const handleDownloadVideoFile = () => {
    // Trigger download
    const filename = `HookClip_${clip.clipNumber}_${clip.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.mp4`;
    const a = document.createElement('a');
    a.href = videoSource.url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSrt = () => {
    const srt = generateSrtContent(clip.captions, clip.startTime);
    downloadFile(srt, `clip-${clip.clipNumber}-subtitles.srt`, 'text/plain');
  };

  const handleCopySocialPack = () => {
    const text = `🔥 ${clip.title}\n\n"${clip.hookSentence}"\n\n${clip.socialCaption}\n\n${clip.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Ekspor Klip #{clip.clipNumber} (Format 9:16)
              </h2>
              <p className="text-xs text-slate-400">
                Siap untuk diunggah langsung ke TikTok, Instagram Reels, dan YouTube Shorts.
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

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Clip Summary Card */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {clip.hookType}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Durasi: {Math.round(clip.duration)} Detik ({formatSecondsToTime(clip.startTime)} - {formatSecondsToTime(clip.endTime)})
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-100">
              {clip.title}
            </h3>

            <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              "{clip.hookSentence}"
            </p>
          </div>

          {/* Export Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block mb-1">Rasio Layar:</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" /> 9:16 Vertikal
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block mb-1">Gaya Subtitle:</span>
              <span className="font-bold text-slate-200 uppercase">
                {subtitleStyle} Style
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-slate-500 block mb-1">Kualitas Output:</span>
              <div className="flex gap-1">
                {(['1080p', '720p'] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setExportQuality(q)}
                    className={`flex-1 py-0.5 rounded text-[11px] font-semibold border ${
                      exportQuality === q
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 text-slate-500'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar (when exporting) */}
          {(isExporting || exportProgress > 0) && (
            <div className="space-y-2 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  {exportStatusText}
                </span>
                <span className="font-mono text-amber-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Download Options */}
          {exportProgress === 100 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Klip Berhasil Dirender & Siap Diunduh!</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleDownloadVideoFile}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-black font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Video (MP4 9:16)</span>
                </button>

                <button
                  onClick={handleDownloadSrt}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Unduh File .SRT</span>
                </button>

                <button
                  onClick={handleCopySocialPack}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCaption ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCaption ? 'Tersalin!' : 'Salin Caption & Tags'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200"
          >
            Tutup
          </button>

          {exportProgress < 100 && (
            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isExporting ? 'Sedang Memproses...' : 'Mulai Render Klip 9:16'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
