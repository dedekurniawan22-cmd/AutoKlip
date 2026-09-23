import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Scissors, 
  Sparkles, 
  Download, 
  Smartphone, 
  Maximize2, 
  Copy, 
  Check, 
  Flame, 
  Clock, 
  Sliders, 
  Type, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { VideoClip, VideoSource, SubtitleStyle, ReframeMode } from '../types';
import { formatSecondsToTime, formatTimeWithMs } from '../utils/timeFormat';

interface StudioPlayerProps {
  videoSource: VideoSource;
  activeClip: VideoClip | null;
  onClipChange: (clip: VideoClip) => void;
  allClips: VideoClip[];
  onOpenExportModal: (clip: VideoClip) => void;
  onOpenRefineModal: (clip: VideoClip) => void;
  subtitleStyle: SubtitleStyle;
  onChangeSubtitleStyle: (style: SubtitleStyle) => void;
  reframeMode: ReframeMode;
  onChangeReframeMode: (mode: ReframeMode) => void;
}

export const StudioPlayer: React.FC<StudioPlayerProps> = ({
  videoSource,
  activeClip,
  onClipChange,
  allClips,
  onOpenExportModal,
  onOpenRefineModal,
  subtitleStyle,
  onChangeSubtitleStyle,
  reframeMode,
  onChangeReframeMode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const blurVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [phoneFrame, setPhoneFrame] = useState<boolean>(true);
  
  // Reframe pan offset (-50 to 50)
  const [panOffset, setPanOffset] = useState<number>(activeClip?.reframeOffset || 0);
  
  // Subtitle position & styling
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [subPosition, setSubPosition] = useState<'bottom' | 'center' | 'top'>('bottom');
  const [fontSize, setFontSize] = useState<number>(24);

  // Copy caption feedback
  const [hasCopiedCaption, setHasCopiedCaption] = useState<boolean>(false);

  // Trim adjustments
  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [trimStart, setTrimStart] = useState<number>(activeClip?.startTime || 0);
  const [trimEnd, setTrimEnd] = useState<number>(activeClip?.endTime || 30);

  // Sync state when activeClip changes
  useEffect(() => {
    if (activeClip) {
      setTrimStart(activeClip.startTime);
      setTrimEnd(activeClip.endTime);
      setPanOffset(activeClip.reframeOffset || 0);
      if (videoRef.current) {
        videoRef.current.currentTime = activeClip.startTime;
        if (blurVideoRef.current) blurVideoRef.current.currentTime = activeClip.startTime;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [activeClip?.id]);

  // Video time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeClip) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Keep background blur synced
    if (blurVideoRef.current && Math.abs(blurVideoRef.current.currentTime - time) > 0.3) {
      blurVideoRef.current.currentTime = time;
    }

    // Loop clip region
    const clipEnd = isTrimming ? trimEnd : activeClip.endTime;
    const clipStart = isTrimming ? trimStart : activeClip.startTime;

    if (time >= clipEnd) {
      videoRef.current.currentTime = clipStart;
      if (blurVideoRef.current) blurVideoRef.current.currentTime = clipStart;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (blurVideoRef.current) blurVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      if (blurVideoRef.current) blurVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestartClip = () => {
    if (!videoRef.current || !activeClip) return;
    const start = isTrimming ? trimStart : activeClip.startTime;
    videoRef.current.currentTime = start;
    if (blurVideoRef.current) blurVideoRef.current.currentTime = start;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleApplyTrim = () => {
    if (!activeClip) return;
    const updated: VideoClip = {
      ...activeClip,
      startTime: trimStart,
      endTime: trimEnd,
      duration: Math.max(5, trimEnd - trimStart),
      reframeOffset: panOffset,
    };
    onClipChange(updated);
    setIsTrimming(false);
  };

  const handleCopyCaption = () => {
    if (!activeClip) return;
    const textToCopy = `${activeClip.socialCaption}\n\n${activeClip.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopiedCaption(true);
    setTimeout(() => setHasCopiedCaption(false), 2200);
  };

  // Find active caption word
  const activeWord = activeClip?.captions.find(
    (cap) => currentTime >= cap.start && currentTime <= cap.end
  );

  // Previous and next clip navigators
  const currentIndex = allClips.findIndex(c => c.id === activeClip?.id);
  const prevClip = currentIndex > 0 ? allClips[currentIndex - 1] : null;
  const nextClip = currentIndex < allClips.length - 1 ? allClips[currentIndex + 1] : null;

  if (!activeClip) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        Pilih klip dari daftar di sebelah kanan untuk melihat pratinjau.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Studio Header & Clip Stats */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-black text-black text-sm shadow-md">
            #{activeClip.clipNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-100 max-w-md truncate">
                {activeClip.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {activeClip.hookType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5" /> {activeClip.hookScore}% Hook Score
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatSecondsToTime(activeClip.startTime)} - {formatSecondsToTime(activeClip.endTime)} ({Math.round(activeClip.duration)}s)
              </span>
            </div>
          </div>
        </div>

        {/* Clip Prev/Next Selector & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => prevClip && onClipChange(prevClip)}
              disabled={!prevClip}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors"
              title="Klip Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-400">
              {currentIndex + 1} / {allClips.length}
            </span>
            <button
              onClick={() => nextClip && onClipChange(nextClip)}
              disabled={!nextClip}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors"
              title="Klip Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenRefineModal(activeClip)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5"
            title="Tulis ulang opening hook dengan Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Optimasi Hook AI</span>
          </button>

          <button
            onClick={() => onOpenExportModal(activeClip)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-black shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Klip</span>
          </button>
        </div>
      </div>

      {/* Main Studio Center Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: 9:16 Video Player Container */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-xl overflow-hidden min-h-[460px]">
          {/* Quick Player Bar (Format & Frame toggles) */}
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
              {(['9:16', '1:1', '16:9'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                    aspectRatio === ratio
                      ? 'bg-amber-500 text-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhoneFrame(!phoneFrame)}
                className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  phoneFrame
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
                title="Bingkai Handphone TikTok"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mockup HP</span>
              </button>
            </div>
          </div>

          {/* Video Mockup Frame */}
          <div
            className={`relative transition-all duration-300 overflow-hidden bg-black flex items-center justify-center ${
              aspectRatio === '9:16'
                ? phoneFrame
                  ? 'w-[260px] sm:w-[290px] aspect-[9/16] rounded-[36px] border-[8px] border-slate-800 shadow-2xl ring-1 ring-slate-700/50'
                  : 'w-[270px] sm:w-[300px] aspect-[9/16] rounded-2xl border border-slate-800 shadow-2xl'
                : aspectRatio === '1:1'
                ? 'w-[320px] sm:w-[360px] aspect-square rounded-2xl border border-slate-800 shadow-2xl'
                : 'w-full aspect-video rounded-2xl border border-slate-800 shadow-2xl'
            }`}
          >
            {/* Ambient Blurred Background Video (for 9:16 reframe) */}
            {reframeMode === 'blur-stack' && (
              <video
                ref={blurVideoRef}
                src={videoSource.url}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-70 pointer-events-none"
              />
            )}

            {/* Main Crisp Video */}
            <video
              ref={videoRef}
              src={videoSource.url}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              muted={isMuted}
              playsInline
              className={`relative z-10 cursor-pointer transition-transform ${
                reframeMode === 'blur-stack'
                  ? 'w-full object-contain'
                  : reframeMode === 'smart-crop'
                  ? 'h-full w-auto object-cover max-w-none'
                  : 'w-full object-contain'
              }`}
              style={
                reframeMode === 'smart-crop'
                  ? { transform: `translateX(${panOffset}%) scale(1.65)` }
                  : undefined
              }
            />

            {/* Live Subtitle Overlay */}
            {showSubtitles && (
              <div
                className={`absolute z-20 left-4 right-4 pointer-events-none text-center transition-all ${
                  subPosition === 'top'
                    ? 'top-12'
                    : subPosition === 'center'
                    ? 'top-1/2 -translate-y-1/2'
                    : 'bottom-16'
                }`}
              >
                {/* Active Subtitle Box */}
                <div className="inline-block max-w-[90%] px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs">
                  <div
                    className={`leading-tight font-extrabold ${
                      subtitleStyle === 'hormozi'
                        ? 'subtitle-hormozi text-white'
                        : subtitleStyle === 'mrbeast'
                        ? 'subtitle-mrbeast text-yellow-300'
                        : subtitleStyle === 'neon'
                        ? 'subtitle-neon text-cyan-300'
                        : 'text-white'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {activeWord ? (
                      <span>
                        <span className="text-amber-400 scale-110 inline-block font-black underline decoration-amber-400 underline-offset-4">
                          {activeWord.text}
                        </span>
                      </span>
                    ) : (
                      <span className="opacity-90">{activeClip.hookSentence}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Play/Pause center overlay indicator */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute z-30 inset-0 flex items-center justify-center bg-black/35 cursor-pointer backdrop-blur-[1px]"
              >
                <div className="h-16 w-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl pl-1 transform hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-black" />
                </div>
              </div>
            )}

            {/* Top Phone Notch / Cam (in phone mockup mode) */}
            {phoneFrame && aspectRatio === '9:16' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-1.5 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            )}
          </div>

          {/* In-Player Media Controls Bar */}
          <div className="w-full mt-4 flex items-center justify-between gap-2 px-2 text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-400" />}
              </button>

              <button
                onClick={handleRestartClip}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Ulangi Klip dari Awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 ml-1">
                <span className="text-amber-300 font-bold">{formatSecondsToTime(currentTime)}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">{formatSecondsToTime(activeClip.endTime)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (videoRef.current) videoRef.current.muted = newMuted;
                }}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = val === 0;
                  }
                }}
                className="w-16 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Studio Customizer (Subtitles, Reframe, Trimming, Hook Breakdown) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hook Analysis & Why it went viral */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  🔥
                </div>
                <span className="font-extrabold text-xs text-amber-300 uppercase tracking-wider">
                  Analisis Hook 3 Detik Pertama
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {activeClip.retentionPrediction}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                Opening Hook Line:
              </div>
              <p className="text-sm font-bold text-slate-100 italic">
                "{activeClip.hookSentence}"
              </p>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <strong className="text-amber-400">Kenapa Momen Ini Hook: </strong>
              {activeClip.whyItHooks}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopyCaption}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {hasCopiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedCaption ? 'Caption Disalin!' : 'Salin Caption & Tags'}</span>
              </button>

              <button
                onClick={() => onOpenRefineModal(activeClip)}
                className="text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ganti Variasi Hook</span>
              </button>
            </div>
          </div>

          {/* Reframe & Smart Crop Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                Auto-Reframe 9:16 Vertikal
              </h3>
              <span className="text-[11px] text-slate-500">Optimasi Wajah & Pembicara</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'blur-stack', label: 'Blur Ambient', desc: 'Latar Belakang Blur' },
                { id: 'smart-crop', label: 'Smart Crop', desc: 'Zoom & Potong Penuh' },
                { id: 'fit-bars', label: 'Fit Bar', desc: 'Kotak Standar' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onChangeReframeMode(mode.id as ReframeMode)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    reframeMode === mode.id
                      ? 'border-rose-400 bg-rose-500/10 text-rose-300 font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{mode.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{mode.desc}</div>
                </button>
              ))}
            </div>

            {reframeMode === 'smart-crop' && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Geser Posisi Wajah Pembicara (Pan X):</span>
                  <span className="font-mono text-amber-400">{panOffset}%</span>
                </div>
                <input
                  type="range"
                  min={-40}
                  max={40}
                  step={1}
                  value={panOffset}
                  onChange={(e) => setPanOffset(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Subtitle & Caption Styler */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                Gaya Subtitle Dinamis
              </h3>
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                  showSubtitles
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {showSubtitles ? 'Subtitle Aktif' : 'Nonaktif'}
              </button>
            </div>

            {/* Subtitle Style Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'hormozi', label: 'Hormozi', color: 'text-amber-400' },
                { id: 'mrbeast', label: 'MrBeast', color: 'text-yellow-400' },
                { id: 'neon', label: 'Cyber Neon', color: 'text-cyan-400' },
                { id: 'minimal', label: 'Minimal', color: 'text-slate-300' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => onChangeSubtitleStyle(style.id as SubtitleStyle)}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    subtitleStyle === style.id
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={style.color}>{style.label}</span>
                </button>
              ))}
            </div>

            {/* Position & Size */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-1 text-[11px]">Posisi Teks:</span>
                <div className="flex gap-1">
                  {(['bottom', 'center', 'top'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setSubPosition(pos)}
                      className={`flex-1 py-1 rounded border text-[11px] font-medium capitalize ${
                        subPosition === pos
                          ? 'bg-slate-700 text-white border-slate-600'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {pos === 'bottom' ? 'Bawah' : pos === 'center' ? 'Tengah' : 'Atas'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 text-[11px]">Ukuran Font: {fontSize}px</span>
                <input
                  type="range"
                  min={16}
                  max={34}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Clip Boundaries Trimmer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                Fine-Tune Batas Klip (Detik Masuk & Keluar)
              </h3>
              <button
                onClick={() => setIsTrimming(!isTrimming)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                  isTrimming
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isTrimming ? 'Selesai Edit' : 'Edit Detik'}
              </button>
            </div>

            {isTrimming ? (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Mulai (In Point):</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTrimStart(Math.max(0, trimStart - 1))}
                        className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700"
                      >
                        -1s
                      </button>
                      <input
                        type="number"
                        value={Math.round(trimStart)}
                        onChange={(e) => setTrimStart(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-mono text-xs text-amber-400"
                      />
                      <button
                        onClick={() => setTrimStart(Math.min(trimEnd - 5, trimStart + 1))}
                        className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700"
                      >
                        +1s
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Selesai (Out Point):</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTrimEnd(Math.max(trimStart + 5, trimEnd - 1))}
                        className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700"
                      >
                        -1s
                      </button>
                      <input
                        type="number"
                        value={Math.round(trimEnd)}
                        onChange={(e) => setTrimEnd(Math.max(trimStart + 5, parseInt(e.target.value, 10) || trimStart + 5))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-mono text-xs text-amber-400"
                      />
                      <button
                        onClick={() => setTrimEnd(trimEnd + 1)}
                        className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700"
                      >
                        +1s
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">
                    Durasi Baru: <strong className="text-emerald-400 font-mono">{Math.round(trimEnd - trimStart)} detik</strong>
                  </span>
                  <button
                    onClick={handleApplyTrim}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-colors"
                  >
                    Terapkan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                AI telah memotong otomatis pada interval <strong className="text-slate-200 font-mono">{formatSecondsToTime(activeClip.startTime)}</strong> sampai <strong className="text-slate-200 font-mono">{formatSecondsToTime(activeClip.endTime)}</strong> untuk retensi maksimal.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
