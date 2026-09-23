import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Film, 
  Flame, 
  Layers, 
  Clock, 
  RefreshCw, 
  Download, 
  Play, 
  HelpCircle,
  Video,
  FileCheck2,
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_VIDEOS } from './data/sampleVideos';
import { VideoClip, VideoSource, ClipperSettings, SubtitleStyle, ReframeMode } from './types';
import { Navbar } from './components/Navbar';
import { StudioPlayer } from './components/StudioPlayer';
import { ClipList } from './components/ClipList';
import { SourceSelectorModal } from './components/SourceSelectorModal';
import { ExportModal } from './components/ExportModal';
import { HookRefineModal } from './components/HookRefineModal';
import { GuideModal } from './components/GuideModal';
import { BatchExportModal } from './components/BatchExportModal';
import { formatSecondsToTime } from './utils/timeFormat';

export default function App() {
  const [videoSource, setVideoSource] = useState<VideoSource>(SAMPLE_VIDEOS[0]);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [activeClip, setActiveClip] = useState<VideoClip | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisMessage, setAnalysisMessage] = useState<string>('');

  // Modals state
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [clipToExport, setClipToExport] = useState<VideoClip | null>(null);
  const [clipToRefine, setClipToRefine] = useState<VideoClip | null>(null);

  // Batch selection
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  // Studio styling settings
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>('hormozi');
  const [reframeMode, setReframeMode] = useState<ReframeMode>('blur-stack');

  // Trigger analysis to extract 15-30 clips
  const extractClips = async (source: VideoSource, count: number = 20, durationMode: string = 'short') => {
    setIsAnalyzing(true);
    setAnalysisMessage(`Memindai timeline ${formatSecondsToTime(source.duration)} untuk mendeteksi ${count} hook viral...`);

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: source.title,
          videoDuration: source.duration,
          clipCount: count,
          durationPreference: durationMode,
          niche: source.category,
          language: 'id',
          transcript: source.transcriptSample,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.clips) && data.clips.length > 0) {
        setClips(data.clips);
        setActiveClip(data.clips[0]);
        setSelectedBatchIds(data.clips.slice(0, 5).map((c: VideoClip) => c.id));
      }
    } catch (error) {
      console.error('Failed to analyze video:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisMessage('');
    }
  };

  // Initial load: automatically load 20 hook clips for the default sample podcast
  useEffect(() => {
    extractClips(SAMPLE_VIDEOS[0], 20, 'short');
  }, []);

  const handleSelectVideoAndExtract = (source: VideoSource, settings: ClipperSettings) => {
    setVideoSource(source);
    setIsSourceModalOpen(false);
    setSubtitleStyle(settings.subtitleStyle);
    setReframeMode(settings.reframeMode);
    extractClips(source, settings.targetClipCount, settings.durationMode);
  };

  const handleOpenExport = (clip: VideoClip) => {
    setClipToExport(clip);
    setIsExportModalOpen(true);
  };

  const handleOpenRefine = (clip: VideoClip) => {
    setClipToRefine(clip);
    setIsRefineModalOpen(true);
  };

  const handleApplyRefinedHook = (newHookText: string) => {
    if (!clipToRefine) return;
    const updatedClips = clips.map((c) => {
      if (c.id === clipToRefine.id) {
        return {
          ...c,
          hookSentence: newHookText,
          hookScore: Math.min(99, c.hookScore + 2),
        };
      }
      return c;
    });
    setClips(updatedClips);
    if (activeClip?.id === clipToRefine.id) {
      setActiveClip({
        ...activeClip,
        hookSentence: newHookText,
        hookScore: Math.min(99, activeClip.hookScore + 2),
      });
    }
  };

  const handleUpdateActiveClip = (updated: VideoClip) => {
    setActiveClip(updated);
    setClips(clips.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleToggleBatchSelect = (clipId: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(clipId) ? prev.filter((id) => id !== clipId) : [...prev, clipId]
    );
  };

  const handleSelectAllBatch = () => {
    setSelectedBatchIds(clips.map((c) => c.id));
  };

  const handleClearBatch = () => {
    setSelectedBatchIds([]);
  };

  const selectedBatchClips = clips.filter((c) => selectedBatchIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        clipCount={clips.length}
        totalDuration={videoSource.duration}
        onBatchExport={() => setIsBatchModalOpen(true)}
        selectedClipsCount={selectedBatchIds.length}
        isAnalyzing={isAnalyzing}
        onShowGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Hero / Active Project Status Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Active Video Info */}
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
              <img
                src={videoSource.thumbnailUrl}
                alt={videoSource.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white/80" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 line-clamp-1 max-w-sm sm:max-w-md">
                  {videoSource.title}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {videoSource.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Durasi Sumber: {formatSecondsToTime(videoSource.duration)}
                </span>
                <span>•</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {clips.length} Klip Hook Viral Siap Pakai
                </span>
              </div>
            </div>
          </div>

          {/* Quick Target Clips Pill Selectors */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 p-1.5 rounded-xl">
            <span className="text-xs text-slate-400 hidden sm:inline px-1">Ekstrak Klip:</span>
            {[15, 20, 25, 30].map((count) => (
              <button
                key={count}
                onClick={() => extractClips(videoSource, count, 'short')}
                disabled={isAnalyzing}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  clips.length === count
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {count} Klip
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Loading Banner */}
      {isAnalyzing && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
          <span>{analysisMessage || 'Gemini 3.8 Flash sedang menganalisis video panjang & mengekstrak hook viral...'}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Studio Player Section */}
        <section>
          <StudioPlayer
            videoSource={videoSource}
            activeClip={activeClip}
            onClipChange={handleUpdateActiveClip}
            allClips={clips}
            onOpenExportModal={handleOpenExport}
            onOpenRefineModal={handleOpenRefine}
            subtitleStyle={subtitleStyle}
            onChangeSubtitleStyle={setSubtitleStyle}
            reframeMode={reframeMode}
            onChangeReframeMode={setReframeMode}
          />
        </section>

        {/* 15-30 Clips Grid Section */}
        <section>
          <ClipList
            clips={clips}
            activeClipId={activeClip?.id || null}
            onSelectClip={(clip) => {
              setActiveClip(clip);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            onExportClip={handleOpenExport}
            onRefineHook={handleOpenRefine}
            selectedBatchIds={selectedBatchIds}
            onToggleBatchSelect={handleToggleBatchSelect}
            onSelectAllBatch={handleSelectAllBatch}
            onClearBatch={handleClearBatch}
            onBatchExport={() => setIsBatchModalOpen(true)}
            isAnalyzing={isAnalyzing}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            HookClip AI — Pembuat Klip Otomatis dari Video Panjang dengan 15-30 Hook Viral.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Didukung oleh</span>
            <strong className="text-amber-400 font-bold">Google Gemini 3.8 Flash</strong>
            <span>• 9:16 Reframe & Auto Subtitles</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SourceSelectorModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        currentVideo={videoSource}
        onSelectVideoAndExtract={handleSelectVideoAndExtract}
        isAnalyzing={isAnalyzing}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        clip={clipToExport}
        videoSource={videoSource}
        subtitleStyle={subtitleStyle}
        reframeMode={reframeMode}
      />

      <HookRefineModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        clip={clipToRefine}
        onApplyNewHook={handleApplyRefinedHook}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <BatchExportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        selectedClips={selectedBatchClips.length > 0 ? selectedBatchClips : clips.slice(0, 15)}
        videoSource={videoSource}
      />
    </div>
  );
}
