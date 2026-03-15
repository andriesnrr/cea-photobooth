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

export type TemplateType = 'classic' | 'polaroid' | 'grid' | 'floral' | 'story' | 'hearts' | 'pastel' | 'filmstrip' | 'cute';

export interface AppState {
  photos: Photo[];
  selectedTemplate: TemplateType;
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
