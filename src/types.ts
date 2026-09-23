export type HookType = 
  | 'Curiosity Gap' 
  | 'Pattern Interrupt' 
  | 'Value Bomb' 
  | 'Controversial Take' 
  | 'Story Climax' 
  | 'Actionable Tip'
  | 'Relatable Humor';

export interface CaptionWord {
  start: number;
  end: number;
  text: string;
  highlight?: boolean;
}

export interface VideoClip {
  id: string;
  clipNumber: number;
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  hookScore: number; // 0 - 100
  hookType: HookType;
  hookSentence: string; // The opening 3-second line
  whyItHooks: string; // Indonesian explanation of why this part retains viewers
  retentionPrediction: string; // e.g. "93% retensi di atas 5 detik"
  socialCaption: string; // Copy-ready TikTok/Reels caption
  hashtags: string[];
  captions: CaptionWord[];
  reframeOffset?: number; // -50 to 50 for smart crop
  aspectRatioPreference?: '9:16' | '1:1' | '16:9';
}

export interface VideoSource {
  id: string;
  title: string;
  duration: number; // in seconds
  url: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  transcriptSample?: string;
  isCustomUpload?: boolean;
}

export type SubtitleStyle = 'hormozi' | 'mrbeast' | 'neon' | 'karaoke' | 'minimal';

export type ReframeMode = 'blur-stack' | 'smart-crop' | 'fit-bars';

export interface ClipperSettings {
  targetClipCount: number; // 15 to 30
  durationMode: 'short' | 'medium' | 'long' | 'mixed'; // 15-30s, 30-60s, 60-90s, mix
  niche: string;
  language: 'id' | 'en';
  autoSubtitles: boolean;
  subtitleStyle: SubtitleStyle;
  reframeMode: ReframeMode;
}
