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

function drawFloralDecorations(ctx: CanvasRenderingContext2D, template: TemplateConfig) {
  const flowers = ['🌻', '🌹', '🌸', '💐', '🌷'];
  ctx.font = '20px serif';

  // Top corners
  ctx.fillText(flowers[0], 5, 25);
  ctx.fillText(flowers[1], template.canvasWidth - 25, 25);

  // Bottom corners
  ctx.fillText(flowers[2], 5, template.canvasHeight - 10);
  ctx.fillText(flowers[3], template.canvasWidth - 25, template.canvasHeight - 10);

  // Side decorations
  const midY = template.canvasHeight / 2;
  ctx.fillText(flowers[4], 5, midY);
  ctx.fillText(flowers[0], template.canvasWidth - 25, midY);
}

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

  // 1. Draw background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(254, 243, 199, 0.15)');
  gradient.addColorStop(0.5, 'rgba(252, 231, 243, 0.1)');
  gradient.addColorStop(1, 'rgba(254, 243, 199, 0.15)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw photos
  const photosToRender = template === 'polaroid' ? [photos[0]] : photos;
  for (let i = 0; i < Math.min(photosToRender.length, config.photoPositions.length); i++) {
    const pos = config.photoPositions[i];
    const photo = photosToRender[i];
    if (!photo) continue;

    try {
      const img = await loadImage(photo.dataUrl);

      // Draw photo shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

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

  // 4. Draw decorations
  if (template === 'floral') {
    drawFloralDecorations(ctx, config);
  }

  // 5. Draw footer
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Footer text: "For Cea 🌻"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.font = 'bold 22px "Dancing Script", cursive, serif';
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('For Cea 🌻', canvas.width / 2, config.footerY);

  ctx.font = '12px "Outfit", sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText(`${dateStr} • ${timeStr}`, canvas.width / 2, config.footerY + 35);

  // 6. Export PNG
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

  // Convert data URL to blob
  const response = await fetch(dataUrl);
  return response.blob();
}
