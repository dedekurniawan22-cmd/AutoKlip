import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Clock, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  CheckSquare, 
  Square,
  Share2,
  FileText
} from 'lucide-react';
import { VideoClip } from '../types';
import { formatSecondsToTime, downloadFile, generateSrtContent } from '../utils/timeFormat';

interface ClipCardProps {
  clip: VideoClip;
  isActive: boolean;
  onSelect: (clip: VideoClip) => void;
  onExport: (clip: VideoClip) => void;
  onRefineHook: (clip: VideoClip) => void;
  isSelectedForBatch: boolean;
  onToggleBatchSelect: (clipId: string) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  isActive,
  onSelect,
  onExport,
  onRefineHook,
  isSelectedForBatch,
  onToggleBatchSelect,
}) => {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (score >= 90) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  };

  const getHookTypeBadge = (type: string) => {
    switch (type) {
      case 'Curiosity Gap':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'Pattern Interrupt':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Value Bomb':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Controversial Take':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'Story Climax':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleCopyCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${clip.socialCaption}\n\n${clip.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSrt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const srt = generateSrtContent(clip.captions, clip.startTime);
    downloadFile(srt, `clip-${clip.clipNumber}-subtitles.srt`, 'text/plain');
  };

  return (
    <div
      onClick={() => onSelect(clip)}
      className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
        isActive
          ? 'border-amber-400 bg-amber-500/5 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50'
          : 'border-slate-800/90 bg-[#0e1420]/80 hover:border-slate-700 hover:bg-[#121927]'
      }`}
    >
      <div>
        {/* Top Header: Checkbox + Number + Virality Score */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBatchSelect(clip.id);
              }}
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              {isSelectedForBatch ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs font-mono font-bold text-slate-400">
              #{clip.clipNumber}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getHookTypeBadge(
                clip.hookType
              )}`}
            >
              {clip.hookType}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${getScoreColor(
              clip.hookScore
            )}`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{clip.hookScore}</span>
            <span className="text-[10px] font-normal opacity-80">/100</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
          {clip.title}
        </h3>

        {/* Hook Sentence Box */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-2.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-between">
            <span>Hook 3 Detik:</span>
            <span className="text-emerald-400 text-[10px] lowercase">{clip.retentionPrediction}</span>
          </div>
          <p className="text-xs text-slate-200 font-medium italic line-clamp-2">
            "{clip.hookSentence}"
          </p>
        </div>

        {/* Why it hooks */}
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
          {clip.whyItHooks}
        </p>
      </div>

      {/* Footer Info & Quick Actions */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{formatSecondsToTime(clip.startTime)} - {formatSecondsToTime(clip.endTime)}</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-semibold">{Math.round(clip.duration)}s</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyCaption}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Salin Caption & Tag"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadSrt}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Unduh Subtitle (.SRT)"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefineHook(clip);
            }}
            className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
            title="Optimasi Hook dengan Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport(clip);
            }}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/20 transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
