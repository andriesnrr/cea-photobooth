export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
  filter: FilterType;
}

export type FilterType = 'normal' | 'warm' | 'vintage' | 'bw' | 'soft-pink';

export interface Sticker {
  id: string;
  type: StickerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type StickerType = 'sunflower' | 'rose' | 'peony' | 'heart' | 'sparkle';

// Layout = frame SIZE/SHAPE (how many photos, how arranged)
export type LayoutType = 'strip-4' | 'strip-3' | 'strip-2' | 'grid-2x2' | 'grid-3x2' | 'story' | 'polaroid';

// Frame Style = DECORATION/DESIGN (how it looks)
export type FrameStyle = 'clean' | 'floral' | 'hearts' | 'pastel' | 'filmstrip' | 'kawaii' | 'doodle';

// Legacy TemplateType for backward compat (mapped from layout + style)
export type TemplateType = 'classic' | 'polaroid' | 'grid' | 'floral' | 'story' | 'hearts' | 'pastel' | 'filmstrip' | 'cute';

export interface AppState {
  photos: Photo[];
  selectedLayout: LayoutType;
  selectedFrameStyle: FrameStyle;
  frameColor: string;
  selectedTemplate: TemplateType; // kept for backward compat
  selectedFilter: FilterType;
  stickers: Sticker[];
  sessionId: string;
  sessionCount: number;
  photostripDataUrl: string | null;
  isSoundEnabled: boolean;
}

export interface FlowerParticle {
  id: number;
  type: 'sunflower' | 'rose' | 'peony';
  x: number;
  y: number;
  speed: number;
  rotation: number;
  size: number;
  delay: number;
}

export const POSE_SUGGESTIONS = [
  "Smile 🙂",
  "Peace ✌️",
  "Heart ❤️",
  "Funny face 😆",
  "Cute pose 🥰",
  "Think 🤔",
] as const;

export const FILTER_OPTIONS: { type: FilterType; label: string; style: string }[] = [
  { type: 'normal', label: 'Normal', style: 'none' },
  { type: 'warm', label: 'Warm', style: 'brightness(1.05) saturate(1.3) sepia(0.15)' },
  { type: 'vintage', label: 'Vintage', style: 'sepia(0.4) contrast(1.1) brightness(0.95)' },
  { type: 'bw', label: 'B&W', style: 'grayscale(1) contrast(1.1)' },
  { type: 'soft-pink', label: 'Soft Pink', style: 'brightness(1.05) saturate(1.1) hue-rotate(-10deg)' },
];

export const STICKER_EMOJIS: Record<StickerType, string> = {
  sunflower: '🌻',
  rose: '🌹',
  peony: '🌸',
  heart: '💖',
  sparkle: '✨',
};

// Layout info
export const LAYOUT_INFO: Record<LayoutType, { label: string; icon: string; desc: string; photoCount: number }> = {
  'strip-4': { label: '4 Strip', icon: '📸', desc: '4 photos vertical', photoCount: 4 },
  'strip-3': { label: '3 Strip', icon: '🎞️', desc: '3 photos vertical', photoCount: 3 },
  'strip-2': { label: '2 Strip', icon: '🎭', desc: '2 photos vertical', photoCount: 2 },
  'grid-2x2': { label: '2×2 Grid', icon: '⬜', desc: '4 photos grid', photoCount: 4 },
  'grid-3x2': { label: '3×2 Grid', icon: '🔲', desc: '6 photos grid', photoCount: 6 },
  'story': { label: 'IG Story', icon: '📱', desc: '9:16 format', photoCount: 4 },
  'polaroid': { label: 'Polaroid', icon: '🖼️', desc: '1 large photo', photoCount: 1 },
};

// Frame style info
export const FRAME_STYLE_INFO: Record<FrameStyle, { label: string; icon: string; desc: string }> = {
  'clean': { label: 'Clean', icon: '✨', desc: 'Minimal white' },
  'floral': { label: 'Floral', icon: '🌸', desc: 'Flower accents' },
  'hearts': { label: 'Love', icon: '💕', desc: 'Hearts pattern' },
  'pastel': { label: 'Pastel', icon: '🦋', desc: 'Soft colors' },
  'filmstrip': { label: 'Film', icon: '🎬', desc: 'Retro cinema' },
  'kawaii': { label: 'Kawaii', icon: '🐰', desc: 'Cute & fun' },
  'doodle': { label: 'Doodle', icon: '✏️', desc: 'Hand-drawn' },
};

// Frame color presets
export const FRAME_COLORS = [
  { name: 'White', value: '#fefdfb' },
  { name: 'Cream', value: '#fef7f0' },
  { name: 'Pink', value: '#fff0f3' },
  { name: 'Lavender', value: '#f3e8ff' },
  { name: 'Mint', value: '#ecfdf5' },
  { name: 'Sky', value: '#e0f2fe' },
  { name: 'Peach', value: '#fff1e6' },
  { name: 'Black', value: '#1a1a2e' },
  { name: 'Navy', value: '#1e293b' },
  { name: 'Rose', value: '#fce7f3' },
  { name: 'Lemon', value: '#fef9c3' },
  { name: 'Coral', value: '#ffe4e6' },
];

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  classic: 'Classic Strip',
  polaroid: 'Polaroid',
  grid: 'Grid',
  floral: 'Floral Frame',
  story: 'IG Story',
  hearts: 'Love Hearts',
  pastel: 'Pastel Dream',
  filmstrip: 'Film Strip',
  cute: 'Kawaii',
};
