import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Flame, 
  SlidersHorizontal, 
  CheckSquare, 
  Square, 
  Download, 
  Sparkles, 
  Layers,
  FileArchive
} from 'lucide-react';
import { VideoClip } from '../types';
import { ClipCard } from './ClipCard';
import { downloadFile, generateSrtContent } from '../utils/timeFormat';

interface ClipListProps {
  clips: VideoClip[];
  activeClipId: string | null;
  onSelectClip: (clip: VideoClip) => void;
  onExportClip: (clip: VideoClip) => void;
  onRefineHook: (clip: VideoClip) => void;
  selectedBatchIds: string[];
  onToggleBatchSelect: (clipId: string) => void;
  onSelectAllBatch: () => void;
  onClearBatch: () => void;
  onBatchExport: () => void;
  isAnalyzing: boolean;
}

export const ClipList: React.FC<ClipListProps> = ({
  clips,
  activeClipId,
  onSelectClip,
  onExportClip,
  onRefineHook,
  selectedBatchIds,
  onToggleBatchSelect,
  onSelectAllBatch,
  onClearBatch,
  onBatchExport,
  isAnalyzing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHookType, setSelectedHookType] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'duration'>('score');

  // Filter and sort clips
  const filteredClips = useMemo(() => {
    return clips
      .filter((clip) => {
        const matchesSearch =
          clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clip.hookSentence.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clip.whyItHooks.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          selectedHookType === 'all' || clip.hookType === selectedHookType;

        const matchesScore = clip.hookScore >= minScore;

        return matchesSearch && matchesType && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.hookScore - a.hookScore;
        if (sortBy === 'time') return a.startTime - b.startTime;
        if (sortBy === 'duration') return b.duration - a.duration;
        return 0;
      });
  }, [clips, searchQuery, selectedHookType, minScore, sortBy]);

  const allSelected = clips.length > 0 && selectedBatchIds.length === clips.length;

  const handleDownloadAllSrt = () => {
    let combinedSrt = '';
    clips.forEach((clip) => {
      combinedSrt += `=== KLIP #${clip.clipNumber}: ${clip.title} ===\n`;
      combinedSrt += generateSrtContent(clip.captions, clip.startTime);
      combinedSrt += '\n\n';
    });
    downloadFile(combinedSrt, `semua-${clips.length}-klip-subtitles.txt`, 'text/plain');
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Daftar Klip Hook ({clips.length} Klip Dihasilkan)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              15-30 Klip Siap Posting
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Diurutkan berdasarkan virality hook rating tertinggi untuk TikTok, Reels, & Shorts.
          </p>
        </div>

        {/* Batch actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={allSelected ? onClearBatch : onSelectAllBatch}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {allSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
            <span>{allSelected ? 'Batal Pilih Semua' : 'Pilih Semua'}</span>
          </button>

          {selectedBatchIds.length > 0 && (
            <button
              onClick={onBatchExport}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-rose-400 hover:opacity-90 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor {selectedBatchIds.length} Klip</span>
            </button>
          )}

          <button
            onClick={handleDownloadAllSrt}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl border border-slate-700"
            title="Unduh Seluruh Subtitle .SRT"
          >
            <FileArchive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau kalimat hook..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 outline-none"
          />
        </div>

        {/* Hook Type Filter */}
        <div className="md:col-span-4">
          <select
            value={selectedHookType}
            onChange={(e) => setSelectedHookType(e.target.value)}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-amber-400 outline-none"
          >
            <option value="all">Semua Tipe Hook ({clips.length})</option>
            <option value="Curiosity Gap">🧠 Curiosity Gap</option>
            <option value="Pattern Interrupt">⚡ Pattern Interrupt</option>
            <option value="Value Bomb">💡 Value Bomb / Rahasia</option>
            <option value="Controversial Take">🔥 Controversial Take</option>
            <option value="Story Climax">📖 Story Climax</option>
            <option value="Actionable Tip">🛠️ Actionable Tip</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-amber-400 outline-none"
          >
            <option value="score">🔥 Skor Viral Tertinggi</option>
            <option value="time">⏱️ Urutan Timeline Video</option>
            <option value="duration">⌛ Durasi Terpanjang</option>
          </select>
        </div>
      </div>

      {/* Quick Hook Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 text-[11px] whitespace-nowrap">Filter Cepat:</span>
        {[
          { label: 'Semua', val: 'all' },
          { label: '🔥 S-Tier (90%+)', val: 'score90' },
          { label: '⚡ Pattern Interrupt', val: 'Pattern Interrupt' },
          { label: '🧠 Curiosity Gap', val: 'Curiosity Gap' },
          { label: '💡 Value Bomb', val: 'Value Bomb' },
        ].map((tag) => (
          <button
            key={tag.val}
            onClick={() => {
              if (tag.val === 'score90') {
                setMinScore(minScore === 90 ? 0 : 90);
              } else {
                setSelectedHookType(tag.val);
              }
            }}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] font-semibold border transition-all ${
              (tag.val === 'score90' && minScore === 90) || selectedHookType === tag.val
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Clips Grid */}
      {filteredClips.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800/80 text-slate-400">
          <p className="text-sm font-semibold mb-1">Tidak ada klip yang cocok dengan pencarian.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedHookType('all');
              setMinScore(0);
            }}
            className="text-xs text-amber-400 hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              isActive={activeClipId === clip.id}
              onSelect={onSelectClip}
              onExport={onExportClip}
              onRefineHook={onRefineHook}
              isSelectedForBatch={selectedBatchIds.includes(clip.id)}
              onToggleBatchSelect={onToggleBatchSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
