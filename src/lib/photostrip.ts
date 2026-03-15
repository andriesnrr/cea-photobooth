import { Photo, TemplateType, Sticker, STICKER_EMOJIS } from './types';

interface TemplateConfig {
  canvasWidth: number;
  canvasHeight: number;
  photoPositions: { x: number; y: number; width: number; height: number }[];
  backgroundColor: string;
  footerY: number;
  borderRadius: number;
  padding: number;
}

const TEMPLATES: Record<TemplateType, TemplateConfig> = {
  classic: {
    canvasWidth: 400,
    canvasHeight: 1750,
    photoPositions: [
      { x: 20, y: 20, width: 360, height: 380 },
      { x: 20, y: 420, width: 360, height: 380 },
      { x: 20, y: 820, width: 360, height: 380 },
      { x: 20, y: 1220, width: 360, height: 380 },
    ],
    backgroundColor: '#fefdfb',
    footerY: 1620,
    borderRadius: 12,
    padding: 20,
  },
  polaroid: {
    canvasWidth: 400,
    canvasHeight: 520,
    photoPositions: [
      { x: 25, y: 25, width: 350, height: 380 },
    ],
    backgroundColor: '#ffffff',
    footerY: 420,
    borderRadius: 0,
    padding: 25,
  },
  grid: {
    canvasWidth: 400,
    canvasHeight: 550,
    photoPositions: [
      { x: 15, y: 15, width: 180, height: 200 },
      { x: 205, y: 15, width: 180, height: 200 },
      { x: 15, y: 225, width: 180, height: 200 },
      { x: 205, y: 225, width: 180, height: 200 },
    ],
    backgroundColor: '#fdf2f8',
    footerY: 440,
    borderRadius: 8,
    padding: 15,
  },
  floral: {
    canvasWidth: 440,
    canvasHeight: 1850,
    photoPositions: [
      { x: 40, y: 40, width: 360, height: 380 },
      { x: 40, y: 440, width: 360, height: 380 },
      { x: 40, y: 840, width: 360, height: 380 },
      { x: 40, y: 1240, width: 360, height: 380 },
    ],
    backgroundColor: '#fef7f0',
    footerY: 1650,
    borderRadius: 16,
    padding: 40,
  },
  story: {
    canvasWidth: 1080,
    canvasHeight: 1920,
    photoPositions: [
      { x: 60, y: 180, width: 960, height: 360 },
      { x: 60, y: 560, width: 960, height: 360 },
      { x: 60, y: 940, width: 960, height: 360 },
      { x: 60, y: 1320, width: 960, height: 360 },
    ],
    backgroundColor: '#fefdfb',
    footerY: 1740,
    borderRadius: 24,
    padding: 60,
  },
  // 💕 Love Hearts — pink with hearts everywhere
  hearts: {
    canvasWidth: 420,
    canvasHeight: 1800,
    photoPositions: [
      { x: 30, y: 50, width: 360, height: 370 },
      { x: 30, y: 440, width: 360, height: 370 },
      { x: 30, y: 830, width: 360, height: 370 },
      { x: 30, y: 1220, width: 360, height: 370 },
    ],
    backgroundColor: '#fff0f3',
    footerY: 1620,
    borderRadius: 20,
    padding: 30,
  },
  // 🦋 Pastel Dream — soft gradient pastels 
  pastel: {
    canvasWidth: 420,
    canvasHeight: 1800,
    photoPositions: [
      { x: 25, y: 45, width: 370, height: 375 },
      { x: 25, y: 440, width: 370, height: 375 },
      { x: 25, y: 835, width: 370, height: 375 },
      { x: 25, y: 1230, width: 370, height: 375 },
    ],
    backgroundColor: '#f3e8ff',
    footerY: 1630,
    borderRadius: 24,
    padding: 25,
  },
  // 🎬 Film Strip — retro film look with sprocket holes
  filmstrip: {
    canvasWidth: 440,
    canvasHeight: 1850,
    photoPositions: [
      { x: 50, y: 40, width: 340, height: 370 },
      { x: 50, y: 430, width: 340, height: 370 },
      { x: 50, y: 820, width: 340, height: 370 },
      { x: 50, y: 1210, width: 340, height: 370 },
    ],
    backgroundColor: '#1a1a2e',
    footerY: 1620,
    borderRadius: 4,
    padding: 50,
  },
  // 🐰 Kawaii — cute pastel with emoji characters
  cute: {
    canvasWidth: 430,
    canvasHeight: 1850,
    photoPositions: [
      { x: 35, y: 70, width: 360, height: 370 },
      { x: 35, y: 460, width: 360, height: 370 },
      { x: 35, y: 850, width: 360, height: 370 },
      { x: 35, y: 1240, width: 360, height: 370 },
    ],
    backgroundColor: '#fef9e7',
    footerY: 1640,
    borderRadius: 22,
    padding: 35,
  },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ====== Decoration functions per template ======

function drawFloralDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  const flowers = ['🌻', '🌹', '🌸', '💐', '🌷'];
  ctx.font = '20px serif';
  ctx.fillText(flowers[0], 5, 25);
  ctx.fillText(flowers[1], config.canvasWidth - 25, 25);
  ctx.fillText(flowers[2], 5, config.canvasHeight - 10);
  ctx.fillText(flowers[3], config.canvasWidth - 25, config.canvasHeight - 10);
  const midY = config.canvasHeight / 2;
  ctx.fillText(flowers[4], 5, midY);
  ctx.fillText(flowers[0], config.canvasWidth - 25, midY);
}

function drawStoryDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  const flowers = ['🌻', '🌹', '🌸', '🌷', '💐', '✨'];
  ctx.font = '40px serif';
  ctx.fillText(flowers[0], 15, 55);
  ctx.fillText(flowers[1], config.canvasWidth - 55, 55);
  ctx.fillText(flowers[5], config.canvasWidth / 2 - 20, 60);
  ctx.fillText(flowers[2], 15, config.canvasHeight - 20);
  ctx.fillText(flowers[3], config.canvasWidth - 55, config.canvasHeight - 20);
  ctx.font = '28px serif';
  ctx.fillText(flowers[4], 10, 600);
  ctx.fillText(flowers[5], config.canvasWidth - 40, 900);
  ctx.fillText(flowers[0], 10, 1200);
}

function drawHeartsDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  const hearts = ['💖', '💕', '💗', '💓', '🩷', '♡', '❤️‍🔥', '💝'];
  // Scatter hearts around the frame
  const positions = [
    { x: 5, y: 30, size: 18 },
    { x: config.canvasWidth - 25, y: 30, size: 18 },
    { x: 10, y: 420, size: 14 },
    { x: config.canvasWidth - 22, y: 420, size: 14 },
    { x: 5, y: 810, size: 16 },
    { x: config.canvasWidth - 25, y: 810, size: 16 },
    { x: 8, y: 1200, size: 14 },
    { x: config.canvasWidth - 22, y: 1200, size: 14 },
    { x: config.canvasWidth / 2 - 10, y: 25, size: 20 },
    { x: 15, y: config.canvasHeight - 18, size: 16 },
    { x: config.canvasWidth - 30, y: config.canvasHeight - 18, size: 16 },
    // Extra floating hearts
    { x: 50, y: 220, size: 10 },
    { x: config.canvasWidth - 55, y: 650, size: 10 },
    { x: 45, y: 1050, size: 10 },
    { x: config.canvasWidth - 50, y: 1400, size: 10 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(hearts[i % hearts.length], pos.x, pos.y);
  });

  // Draw a heart border line (subtle)
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.12)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  drawRoundedRect(ctx, 10, 10, config.canvasWidth - 20, config.canvasHeight - 20, 20);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPastelDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  // Soft pastel gradient circles as decoration
  const circles = [
    { x: 30, y: 25, r: 20, color: 'rgba(196, 181, 253, 0.3)' },
    { x: config.canvasWidth - 30, y: 25, r: 18, color: 'rgba(251, 191, 36, 0.2)' },
    { x: 20, y: config.canvasHeight - 25, r: 22, color: 'rgba(167, 243, 208, 0.3)' },
    { x: config.canvasWidth - 25, y: config.canvasHeight - 25, r: 16, color: 'rgba(252, 165, 165, 0.3)' },
    { x: config.canvasWidth / 2, y: 20, r: 15, color: 'rgba(196, 181, 253, 0.25)' },
  ];
  circles.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
  });

  // Cute emoji accents
  const accents = ['🦋', '🌈', '⭐', '🫧', '✨', '🍬'];
  const accentPos = [
    { x: 5, y: 30 }, { x: config.canvasWidth - 22, y: 30 },
    { x: 8, y: 550 }, { x: config.canvasWidth - 22, y: 900 },
    { x: 5, y: config.canvasHeight - 15 }, { x: config.canvasWidth - 22, y: config.canvasHeight - 15 },
  ];
  accentPos.forEach((pos, i) => {
    ctx.font = '16px serif';
    ctx.fillText(accents[i], pos.x, pos.y);
  });

  // Subtle dashed border
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 8]);
  drawRoundedRect(ctx, 8, 8, config.canvasWidth - 16, config.canvasHeight - 16, 24);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFilmstripDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  // Draw sprocket holes on left and right
  const holeRadius = 8;
  const holeSpacing = 35;
  ctx.fillStyle = '#0d0d1a';
  
  for (let y = 20; y < config.canvasHeight - 20; y += holeSpacing) {
    // Left sprocket holes
    ctx.beginPath();
    ctx.roundRect(12, y, 18, 12, 3);
    ctx.fill();
    // Right sprocket holes
    ctx.beginPath();
    ctx.roundRect(config.canvasWidth - 30, y, 18, 12, 3);
    ctx.fill();
  }

  // Film frame numbers
  ctx.fillStyle = '#ff6b35';
  ctx.font = 'bold 11px monospace';
  config.photoPositions.forEach((pos, i) => {
    ctx.fillText(`${i + 1}A`, 14, pos.y + pos.height + 18);
    ctx.fillText(`→`, config.canvasWidth - 28, pos.y + pos.height / 2);
  });

  // "KODAK" style text at top and bottom
  ctx.fillStyle = '#ff6b35';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('◄◄ CEA FILM ►►', config.canvasWidth / 2, config.canvasHeight - 8);
  ctx.textAlign = 'start';
}

function drawCuteDecorations(ctx: CanvasRenderingContext2D, config: TemplateConfig) {
  // Kawaii characters scattered around
  const kawaii = ['🐰', '🐻', '🌟', '🍰', '🎀', '🧸', '🐱', '🦄', '🍩', '🎈'];
  const positions = [
    { x: 3, y: 45, size: 22 },
    { x: config.canvasWidth - 28, y: 45, size: 22 },
    { x: config.canvasWidth / 2 - 12, y: 40, size: 24 },
    { x: 5, y: 440, size: 16 },
    { x: config.canvasWidth - 22, y: 440, size: 16 },
    { x: 8, y: 830, size: 16 },
    { x: config.canvasWidth - 22, y: 830, size: 16 },
    { x: 5, y: 1220, size: 16 },
    { x: config.canvasWidth - 22, y: 1220, size: 16 },
    { x: config.canvasWidth / 2 - 10, y: config.canvasHeight - 10, size: 18 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(kawaii[i], pos.x, pos.y);
  });

  // Polka dot pattern (subtle)
  ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
  for (let x = 15; x < config.canvasWidth; x += 40) {
    for (let y = 15; y < config.canvasHeight; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cute wavy border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  drawRoundedRect(ctx, 6, 6, config.canvasWidth - 12, config.canvasHeight - 12, 22);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ====== Background rendering per template ======

function drawTemplateBackground(ctx: CanvasRenderingContext2D, template: TemplateType, config: TemplateConfig) {
  // Base fill
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

  switch (template) {
    case 'hearts': {
      // Pink gradient with sparkle
      const grad = ctx.createLinearGradient(0, 0, config.canvasWidth, config.canvasHeight);
      grad.addColorStop(0, 'rgba(255, 228, 230, 0.6)');
      grad.addColorStop(0.3, 'rgba(255, 240, 243, 0.3)');
      grad.addColorStop(0.7, 'rgba(252, 231, 243, 0.4)');
      grad.addColorStop(1, 'rgba(255, 228, 230, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
      break;
    }
    case 'pastel': {
      // Multi-color pastel gradient
      const grad = ctx.createLinearGradient(0, 0, config.canvasWidth, config.canvasHeight);
      grad.addColorStop(0, 'rgba(243, 232, 255, 0.8)'); // lavender
      grad.addColorStop(0.25, 'rgba(254, 249, 195, 0.4)'); // yellow
      grad.addColorStop(0.5, 'rgba(204, 251, 241, 0.5)'); // mint
      grad.addColorStop(0.75, 'rgba(252, 231, 243, 0.4)'); // pink
      grad.addColorStop(1, 'rgba(219, 234, 254, 0.6)'); // blue
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
      break;
    }
    case 'filmstrip': {
      // Dark film background — already set by backgroundColor
      // Add subtle grain texture
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * config.canvasWidth;
        const y = Math.random() * config.canvasHeight;
        ctx.fillRect(x, y, 1, 1);
      }
      break;
    }
    case 'cute': {
      // Warm yellow-pink gradient
      const grad = ctx.createLinearGradient(0, 0, 0, config.canvasHeight);
      grad.addColorStop(0, 'rgba(254, 249, 231, 0.8)');
      grad.addColorStop(0.4, 'rgba(255, 241, 242, 0.5)');
      grad.addColorStop(0.7, 'rgba(254, 249, 231, 0.6)');
      grad.addColorStop(1, 'rgba(252, 231, 243, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
      break;
    }
    case 'story': {
      // Gradient header band
      const headerGrad = ctx.createLinearGradient(0, 0, config.canvasWidth, 160);
      headerGrad.addColorStop(0, 'rgba(244, 63, 94, 0.08)');
      headerGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.06)');
      headerGrad.addColorStop(1, 'rgba(245, 158, 11, 0.08)');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, config.canvasWidth, 160);
      break;
    }
    default: {
      // Classic/default subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, config.canvasHeight);
      gradient.addColorStop(0, 'rgba(254, 243, 199, 0.15)');
      gradient.addColorStop(0.5, 'rgba(252, 231, 243, 0.1)');
      gradient.addColorStop(1, 'rgba(254, 243, 199, 0.15)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
      break;
    }
  }
}

// ====== Main render function ======

export async function renderPhotostrip(
  photos: Photo[],
  template: TemplateType,
  stickers: Sticker[] = []
): Promise<string | null> {
  const config = TEMPLATES[template];
  if (!config) return null;

  const canvas = document.createElement('canvas');
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const scaleFactor = template === 'story' ? 2.5 : 1;

  // 1. Draw background
  drawTemplateBackground(ctx, template, config);

  // 2. Draw photos
  const photosToRender = template === 'polaroid' ? [photos[0]] : photos;
  for (let i = 0; i < Math.min(photosToRender.length, config.photoPositions.length); i++) {
    const pos = config.photoPositions[i];
    const photo = photosToRender[i];
    if (!photo) continue;

    try {
      const img = await loadImage(photo.dataUrl);

      // Draw photo shadow
      ctx.shadowColor = template === 'filmstrip' ? 'rgba(255, 107, 53, 0.15)' : 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 12 * scaleFactor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4 * scaleFactor;

      // Clip rounded rectangle
      ctx.save();
      drawRoundedRect(ctx, pos.x, pos.y, pos.width, pos.height, config.borderRadius);
      ctx.clip();

      // Draw image (cover fit)
      const imgRatio = img.width / img.height;
      const posRatio = pos.width / pos.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > posRatio) {
        sw = img.height * posRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / posRatio;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, pos.width, pos.height);
      ctx.restore();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } catch (e) {
      console.error('Failed to load photo:', e);
    }
  }

  // 3. Draw stickers
  for (const sticker of stickers) {
    const emoji = STICKER_EMOJIS[sticker.type];
    if (!emoji) continue;
    ctx.save();
    ctx.translate(sticker.x, sticker.y);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${32 * sticker.scale}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }

  // 4. Draw template-specific decorations
  switch (template) {
    case 'floral':
      drawFloralDecorations(ctx, config);
      break;
    case 'story':
      drawStoryDecorations(ctx, config);
      break;
    case 'hearts':
      drawHeartsDecorations(ctx, config);
      break;
    case 'pastel':
      drawPastelDecorations(ctx, config);
      break;
    case 'filmstrip':
      drawFilmstripDecorations(ctx, config);
      break;
    case 'cute':
      drawCuteDecorations(ctx, config);
      break;
  }

  // 5. Try to load and draw the logo
  let logoLoaded = false;
  try {
    const logo = await loadImage('/logo.png');
    const logoSize = template === 'story' ? 60 : 28;
    const logoX = canvas.width / 2 - logoSize / 2;
    const logoY = config.footerY - (template === 'story' ? 8 : 5);
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    logoLoaded = true;
  } catch {
    // Logo not available, skip
  }

  // 6. Draw footer branding
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const brandFontSize = Math.round(20 * scaleFactor);
  const dateFontSize = Math.round(11 * scaleFactor);
  const brandY = config.footerY + (logoLoaded ? (template === 'story' ? 55 : 24) : 0);

  // Brand name color based on template
  const brandColor = template === 'filmstrip' ? '#ff6b35' : '#f43f5e';
  const dateColor = template === 'filmstrip' ? '#666680' : '#9ca3af';

  ctx.font = `700 ${brandFontSize}px "Outfit", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = brandColor;
  ctx.fillText('Cea Photobooth', canvas.width / 2, brandY);

  // Sunflower accent
  const actualWidth = ctx.measureText('Cea Photobooth').width;
  ctx.font = `${Math.round(brandFontSize * 0.9)}px serif`;
  ctx.fillText('🌻', canvas.width / 2 + actualWidth / 2 + 5, brandY);

  // Date/time
  ctx.font = `${dateFontSize}px "Outfit", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = dateColor;
  ctx.fillText(`${dateStr} • ${timeStr}`, canvas.width / 2, brandY + brandFontSize + 8);

  // 7. Export PNG
  return canvas.toDataURL('image/png');
}

export function getTemplateConfig(template: TemplateType): TemplateConfig {
  return TEMPLATES[template];
}

export async function renderPhotostripAsBlob(
  photos: Photo[],
  template: TemplateType,
  stickers: Sticker[] = []
): Promise<Blob | null> {
  const config = TEMPLATES[template];
  if (!config) return null;

  const dataUrl = await renderPhotostrip(photos, template, stickers);
  if (!dataUrl) return null;

  const response = await fetch(dataUrl);
  return response.blob();
}
