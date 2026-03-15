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

export type StickerType =
  | 'sunflower' | 'rose' | 'peony' | 'heart' | 'sparkle'
  // Animals
  | 'bear' | 'bunny' | 'cat' | 'dog' | 'panda' | 'unicorn' | 'butterfly' | 'chick'
  // Food & Drinks
  | 'cake' | 'donut' | 'icecream' | 'candy' | 'cherry' | 'lollipop' | 'cookie' | 'boba'
  // Accessories & Fun
  | 'ribbon' | 'crown' | 'star' | 'rainbow' | 'cloud' | 'moon' | 'kiss' | 'balloon'
  // Extra cute
  | 'gift' | 'diamond' | 'music' | 'camera' | 'letter' | 'clover' | 'fairy' | 'magic';

// Layout = frame SIZE/SHAPE (how many photos, how arranged)
export type LayoutType = 'strip-4' | 'strip-3' | 'strip-2' | 'grid-2x2' | 'grid-3x2' | 'story' | 'polaroid' | 'wide' | 'tall-2';

// Frame Style = DECORATION/DESIGN (how it looks)
export type FrameStyle = 'clean' | 'floral' | 'hearts' | 'pastel' | 'filmstrip' | 'kawaii' | 'doodle' | 'sparkle' | 'sakura' | 'confetti' | 'retro' | 'starry';

// Legacy TemplateType for backward compat
export type TemplateType = 'classic' | 'polaroid' | 'grid' | 'floral' | 'story' | 'hearts' | 'pastel' | 'filmstrip' | 'cute';

export interface AppState {
  photos: Photo[];
  selectedLayout: LayoutType;
  selectedFrameStyle: FrameStyle;
  frameColor: string;
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
  // Nature
  sunflower: '🌻', rose: '🌹', peony: '🌸', heart: '💖', sparkle: '✨',
  // Animals
  bear: '🐻', bunny: '🐰', cat: '🐱', dog: '🐶', panda: '🐼', unicorn: '🦄', butterfly: '🦋', chick: '🐥',
  // Food & Drinks
  cake: '🎂', donut: '🍩', icecream: '🍦', candy: '🍬', cherry: '🍒', lollipop: '🍭', cookie: '🍪', boba: '🧋',
  // Accessories & Fun
  ribbon: '🎀', crown: '👑', star: '⭐', rainbow: '🌈', cloud: '☁️', moon: '🌙', kiss: '💋', balloon: '🎈',
  // Extra cute
  gift: '🎁', diamond: '💎', music: '🎵', camera: '📸', letter: '💌', clover: '🍀', fairy: '🧚', magic: '🪄',
};

export const STICKER_CATEGORIES: { name: string; icon: string; types: StickerType[] }[] = [
  { name: 'Nature', icon: '🌸', types: ['sunflower', 'rose', 'peony', 'heart', 'sparkle', 'butterfly', 'clover'] },
  { name: 'Animals', icon: '🐰', types: ['bear', 'bunny', 'cat', 'dog', 'panda', 'unicorn', 'chick', 'fairy'] },
  { name: 'Food', icon: '🍩', types: ['cake', 'donut', 'icecream', 'candy', 'cherry', 'lollipop', 'cookie', 'boba'] },
  { name: 'Fun', icon: '🎀', types: ['ribbon', 'crown', 'star', 'rainbow', 'cloud', 'moon', 'kiss', 'balloon', 'gift', 'diamond', 'music', 'camera', 'letter', 'magic'] },
];

// Layout info
export const LAYOUT_INFO: Record<LayoutType, { label: string; icon: string; desc: string; photoCount: number }> = {
  'strip-4': { label: '4 Strip', icon: '📸', desc: '4 photos vertical', photoCount: 4 },
  'strip-3': { label: '3 Strip', icon: '🎞️', desc: '3 photos vertical', photoCount: 3 },
  'strip-2': { label: '2 Strip', icon: '🎭', desc: '2 photos vertical', photoCount: 2 },
  'grid-2x2': { label: '2×2 Grid', icon: '⬜', desc: '4 photos grid', photoCount: 4 },
  'grid-3x2': { label: '3×2 Grid', icon: '🔲', desc: '6 photos grid', photoCount: 6 },
  'story': { label: 'IG Story', icon: '📱', desc: '9:16 format', photoCount: 4 },
  'polaroid': { label: 'Polaroid', icon: '🖼️', desc: '1 large photo', photoCount: 1 },
  'wide': { label: 'Wide', icon: '🖥️', desc: '3 photos horizontal', photoCount: 3 },
  'tall-2': { label: 'Tall 2', icon: '📏', desc: '2 photos tall', photoCount: 2 },
};

// Frame style info
export const FRAME_STYLE_INFO: Record<FrameStyle, { label: string; icon: string; desc: string }> = {
  'clean': { label: 'Clean', icon: '✨', desc: 'Minimal' },
  'floral': { label: 'Floral', icon: '🌸', desc: 'Flowers' },
  'hearts': { label: 'Love', icon: '💕', desc: 'Hearts' },
  'pastel': { label: 'Pastel', icon: '🦋', desc: 'Soft colors' },
  'filmstrip': { label: 'Film', icon: '🎬', desc: 'Retro cinema' },
  'kawaii': { label: 'Kawaii', icon: '🐰', desc: 'Cute & fun' },
  'doodle': { label: 'Doodle', icon: '✏️', desc: 'Hand-drawn' },
  'sparkle': { label: 'Sparkle', icon: '💫', desc: 'Glitter' },
  'sakura': { label: 'Sakura', icon: '🌸', desc: 'Cherry blossom' },
  'confetti': { label: 'Party', icon: '🎉', desc: 'Confetti' },
  'retro': { label: 'Retro', icon: '📺', desc: 'Vintage' },
  'starry': { label: 'Starry', icon: '🌟', desc: 'Night sky' },
};

// Frame color presets — expanded with more cute colors
export const FRAME_COLORS = [
  { name: 'White', value: '#fefdfb' },
  { name: 'Cream', value: '#fef7f0' },
  { name: 'Pink', value: '#fff0f3' },
  { name: 'Hot Pink', value: '#fce4ec' },
  { name: 'Rose', value: '#fce7f3' },
  { name: 'Lavender', value: '#f3e8ff' },
  { name: 'Lilac', value: '#ede9fe' },
  { name: 'Mint', value: '#ecfdf5' },
  { name: 'Sage', value: '#dcfce7' },
  { name: 'Sky', value: '#e0f2fe' },
  { name: 'Baby Blue', value: '#dbeafe' },
  { name: 'Peach', value: '#fff1e6' },
  { name: 'Coral', value: '#ffe4e6' },
  { name: 'Sunset', value: '#ffedd5' },
  { name: 'Lemon', value: '#fef9c3' },
  { name: 'Butter', value: '#fef3c7' },
  { name: 'Mocha', value: '#fde8d8' },
  { name: 'Black', value: '#1a1a2e' },
  { name: 'Navy', value: '#1e293b' },
  { name: 'Charcoal', value: '#374151' },
  { name: 'Berry', value: '#4c1d95' },
  { name: 'Forest', value: '#14532d' },
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
