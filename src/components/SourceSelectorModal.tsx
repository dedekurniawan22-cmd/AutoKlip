import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Film, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  Play, 
  FileVideo,
  Languages,
  Zap,
  Info
} from 'lucide-react';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';
import { VideoSource, ClipperSettings } from '../types';
import { formatSecondsToTime } from '../utils/timeFormat';

interface SourceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideo: VideoSource | null;
  onSelectVideoAndExtract: (video: VideoSource, settings: ClipperSettings) => void;
  isAnalyzing: boolean;
}

export const SourceSelectorModal: React.FC<SourceSelectorModalProps> = ({
  isOpen,
  onClose,
  currentVideo,
  onSelectVideoAndExtract,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'upload' | 'transcript'>('sample');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(currentVideo?.id || SAMPLE_VIDEOS[0].id);
  
  // Custom video upload state
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(1800);
  const [customTitle, setCustomTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom transcript
  const [customTranscript, setCustomTranscript] = useState<string>('');

  // Settings
  const [targetClipCount, setTargetClipCount] = useState<number>(20);
  const [durationMode, setDurationMode] = useState<'short' | 'medium' | 'long' | 'mixed'>('short');
  const [niche, setNiche] = useState<string>('Podcast & Edukasi');
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile(file);
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));

      // Read duration
      const tempVideo = document.createElement('video');
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration && !isNaN(tempVideo.duration)) {
          setCustomDuration(Math.round(tempVideo.duration));
        }
      };
    }
  };

  const handleSubmit = () => {
    const settings: ClipperSettings = {
      targetClipCount,
      durationMode,
      niche,
      language,
      autoSubtitles: true,
      subtitleStyle: 'hormozi',
      reframeMode: 'blur-stack',
    };

    if (activeTab === 'sample') {
      const sample = SAMPLE_VIDEOS.find(s => s.id === selectedSampleId) || SAMPLE_VIDEOS[0];
      onSelectVideoAndExtract(sample, settings);
    } else if (activeTab === 'upload' && customFileUrl) {
      const customSource: VideoSource = {
        id: `upload-${Date.now()}`,
        title: customTitle || customFile?.name || 'Video Unggahan Saya',
        duration: customDuration,
        url: customFileUrl,
        thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        description: 'Video kustom yang diunggah dari komputer lokal.',
        category: niche,
        transcriptSample: customTranscript || undefined,
        isCustomUpload: true,
      };
      onSelectVideoAndExtract(customSource, settings);
    } else if (activeTab === 'transcript') {
      const sample = SAMPLE_VIDEOS.find(s => s.id === selectedSampleId) || SAMPLE_VIDEOS[0];
      const customSource: VideoSource = {
        ...sample,
        id: `transcript-${Date.now()}`,
        title: customTitle || sample.title,
        transcriptSample: customTranscript || sample.transcriptSample,
      };
      onSelectVideoAndExtract(customSource, settings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Pilih Sumber Video & Konfigurasi Hook
              </h2>
              <p className="text-xs text-slate-400">
                AI akan memindai seluruh rekaman panjang dan mengambil 15 hingga 30 klip paling hook!
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('sample')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'sample'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Sampel Video Panjang (Siap Pakai)</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Unggah File Video (MP4 / WebM)</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'transcript'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileVideo className="w-4 h-4" />
              <span>Tempel Transkrip / Teks</span>
            </button>
          </div>

          {/* Tab Content: Sample Videos */}
          {activeTab === 'sample' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pilih salah satu video podcast/talkshow berdurasi 30-55 menit:</span>
                <span className="text-amber-400 font-medium">Bisa langsung dites dalam 3 detik!</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SAMPLE_VIDEOS.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedSampleId(sample.id)}
                      className={`group relative rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-950">
                          <img
                            src={sample.thumbnailUrl}
                            alt={sample.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-[10px] font-semibold text-amber-300 px-2 py-0.5 rounded">
                            {sample.category}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono text-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatSecondsToTime(sample.duration)}
                          </div>
                        </div>

                        <h3 className="font-semibold text-xs sm:text-sm text-slate-200 line-clamp-2 mb-1 group-hover:text-amber-300 transition-colors">
                          {sample.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {sample.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">Format: 16:9 Landscape</span>
                        {isSelected ? (
                          <span className="text-amber-400 flex items-center gap-1 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" /> Terpilih
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-slate-200">Klik untuk pilih</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Content: Upload Custom Video */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {!customFileUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-8 text-center cursor-pointer bg-slate-900/30 hover:bg-amber-500/5 transition-all group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-1">
                    Klik untuk memilih file video panjang Anda
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                    Mendukung format MP4, WebM, atau MOV. Rekaman podcast, webinar, live stream, atau video YouTube panjang.
                  </p>
                  <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">
                    Video diproses langsung di browser secara privat & aman
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <FileVideo className="w-5 h-5" />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="Beri judul video..."
                          className="bg-transparent font-bold text-sm text-slate-100 border-b border-slate-700 focus:border-amber-400 outline-none pb-0.5"
                        />
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>Ukuran: {(customFile!.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <span>•</span>
                          <span>Durasi Terdeteksi: ~{formatSecondsToTime(customDuration)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCustomFile(null);
                        setCustomFileUrl(null);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 underline"
                    >
                      Ganti File
                    </button>
                  </div>

                  <div className="aspect-video max-h-48 rounded-lg overflow-hidden bg-black mx-auto">
                    <video src={customFileUrl} controls className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Transcript input */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Tempel transkrip percakapan atau timestamp video:</span>
                <span className="text-amber-400">Membantu AI menemukan hook dengan akurasi 99%</span>
              </div>
              <textarea
                value={customTranscript}
                onChange={(e) => setCustomTranscript(e.target.value)}
                placeholder="Contoh:&#10;00:01:10 - Host: Banyak orang gagal di 3 detik pertama karena tidak punya hook...&#10;00:04:20 - Tamu: Ini formula 3 detik yang saya gunakan untuk dapat 1 juta views..."
                rows={5}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-amber-500 outline-none font-mono"
              />
            </div>
          )}

          {/* Target Clip Count & Hook Configuration */}
          <div className="border-t border-slate-800 pt-5 space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Pengaturan Ekstraksi Klip Hook (15-30 Klip)
              </h3>
            </div>

            {/* Target Clips Selector */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Target Jumlah Klip Hook yang Dihasilkan:
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Sesuai permintaan Anda: pilih antara 15 hingga 30 klip video terbaik.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-extrabold text-sm border border-amber-500/20">
                  {targetClipCount} Klip
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 25, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTargetClipCount(count)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      targetClipCount === count
                        ? 'border-amber-400 bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${targetClipCount === count ? 'text-black' : 'text-amber-400'}`} />
                    <span>{count} Klip</span>
                  </button>
                ))}
              </div>

              {/* Slider for fine adjustment */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min={15}
                  max={30}
                  step={1}
                  value={targetClipCount}
                  onChange={(e) => setTargetClipCount(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>15 Klip (Minimum Rekomendasi)</span>
                  <span>20 Klip</span>
                  <span>25 Klip</span>
                  <span>30 Klip (Maksimal Stok 1 Bulan)</span>
                </div>
              </div>
            </div>

            {/* Grid of secondary controls: Duration & Niche */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Duration Preference */}
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Preferensi Durasi Tiap Klip:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'short', label: '15-30s', desc: 'TikTok Fast Hook' },
                    { id: 'medium', label: '30-60s', desc: 'Reels / Shorts' },
                    { id: 'long', label: '60-90s', desc: 'Deep Story' },
                    { id: 'mixed', label: 'Smart Mix', desc: 'Otomatis AI' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDurationMode(item.id as any)}
                      className={`p-1.5 text-left rounded-lg border text-xs transition-all ${
                        durationMode === item.id
                          ? 'border-rose-400/80 bg-rose-500/10 text-rose-300 font-bold'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche & Hook Strategy */}
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  Kategori Video & Bahasa:
                </label>
                <div className="space-y-2">
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:border-amber-400 outline-none"
                  >
                    <option value="Podcast & Edukasi">🎙️ Podcast & Wawancara Edukatif</option>
                    <option value="Bisnis, Marketing & Finansial">💰 Bisnis, Marketing & Finansial</option>
                    <option value="Teknologi, Coding & AI">🤖 Teknologi, Gadget & AI</option>
                    <option value="Motivasi, Mindset & Self-Help">🔥 Motivasi & Mindset Sukses</option>
                    <option value="Gaming & Entertainment">🎮 Gaming & Hiburan</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage('id')}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition-all ${
                        language === 'id'
                          ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 font-bold'
                          : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      🇮🇩 Bahasa Indonesia
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition-all ${
                        language === 'en'
                          ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 font-bold'
                          : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            <span>AI akan mengekstrak <strong>{targetClipCount} klip</strong> berpotensi viral tinggi.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || (activeTab === 'upload' && !customFileUrl)}
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-black bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 hover:opacity-95 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Sedang Menganalisis...' : `⚡ Ekstraksi ${targetClipCount} Klip Hook`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
