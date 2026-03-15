import { Photo, LayoutType, FrameStyle, Sticker, STICKER_EMOJIS, TemplateType } from './types';

// ====== Layout Configs (SIZE/SHAPE) ======
interface LayoutConfig {
  canvasWidth: number;
  canvasHeight: number;
  getPhotoPositions: (photoCount: number) => { x: number; y: number; width: number; height: number }[];
  footerY: number;
  borderRadius: number;
  padding: number;
}

const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  'strip-4': {
    canvasWidth: 400,
    canvasHeight: 1750,
    getPhotoPositions: () => [
      { x: 20, y: 20, width: 360, height: 380 },
      { x: 20, y: 420, width: 360, height: 380 },
      { x: 20, y: 820, width: 360, height: 380 },
      { x: 20, y: 1220, width: 360, height: 380 },
    ],
    footerY: 1620,
    borderRadius: 12,
    padding: 20,
  },
  'strip-3': {
    canvasWidth: 400,
    canvasHeight: 1350,
    getPhotoPositions: () => [
      { x: 20, y: 20, width: 360, height: 380 },
      { x: 20, y: 420, width: 360, height: 380 },
      { x: 20, y: 820, width: 360, height: 380 },
    ],
    footerY: 1220,
    borderRadius: 12,
    padding: 20,
  },
  'strip-2': {
    canvasWidth: 400,
    canvasHeight: 950,
    getPhotoPositions: () => [
      { x: 20, y: 20, width: 360, height: 380 },
      { x: 20, y: 420, width: 360, height: 380 },
    ],
    footerY: 820,
    borderRadius: 12,
    padding: 20,
  },
  'grid-2x2': {
    canvasWidth: 400,
    canvasHeight: 550,
    getPhotoPositions: () => [
      { x: 15, y: 15, width: 180, height: 200 },
      { x: 205, y: 15, width: 180, height: 200 },
      { x: 15, y: 225, width: 180, height: 200 },
      { x: 205, y: 225, width: 180, height: 200 },
    ],
    footerY: 440,
    borderRadius: 8,
    padding: 15,
  },
  'grid-3x2': {
    canvasWidth: 600,
    canvasHeight: 550,
    getPhotoPositions: () => [
      { x: 15, y: 15, width: 180, height: 200 },
      { x: 205, y: 15, width: 180, height: 200 },
      { x: 395, y: 15, width: 180, height: 200 },
      { x: 15, y: 225, width: 180, height: 200 },
      { x: 205, y: 225, width: 180, height: 200 },
      { x: 395, y: 225, width: 180, height: 200 },
    ],
    footerY: 440,
    borderRadius: 8,
    padding: 15,
  },
  'story': {
    canvasWidth: 1080,
    canvasHeight: 1920,
    getPhotoPositions: () => [
      { x: 60, y: 180, width: 960, height: 360 },
      { x: 60, y: 560, width: 960, height: 360 },
      { x: 60, y: 940, width: 960, height: 360 },
      { x: 60, y: 1320, width: 960, height: 360 },
    ],
    footerY: 1740,
    borderRadius: 24,
    padding: 60,
  },
  'polaroid': {
    canvasWidth: 400,
    canvasHeight: 520,
    getPhotoPositions: () => [
      { x: 25, y: 25, width: 350, height: 380 },
    ],
    footerY: 420,
    borderRadius: 0,
    padding: 25,
  },
  'wide': {
    canvasWidth: 1200,
    canvasHeight: 480,
    getPhotoPositions: () => [
      { x: 15, y: 15, width: 380, height: 350 },
      { x: 410, y: 15, width: 380, height: 350 },
      { x: 805, y: 15, width: 380, height: 350 },
    ],
    footerY: 380,
    borderRadius: 10,
    padding: 15,
  },
  'tall-2': {
    canvasWidth: 400,
    canvasHeight: 1100,
    getPhotoPositions: () => [
      { x: 20, y: 20, width: 360, height: 480 },
      { x: 20, y: 520, width: 360, height: 480 },
    ],
    footerY: 1020,
    borderRadius: 12,
    padding: 20,
  },
};

// ====== Helper functions ======

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

// ====== Frame Style Decorations ======

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawCleanDecorations(..._args: unknown[]) {
  // Clean = no extra decorations
}

function drawFloralDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const flowers = ['🌻', '🌹', '🌸', '💐', '🌷'];
  ctx.font = '20px serif';
  ctx.fillText(flowers[0], 5, 25);
  ctx.fillText(flowers[1], w - 25, 25);
  ctx.fillText(flowers[2], 5, h - 10);
  ctx.fillText(flowers[3], w - 25, h - 10);
  ctx.fillText(flowers[4], 5, h / 2);
  ctx.fillText(flowers[0], w - 25, h / 2);
}

function drawHeartsDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const hearts = ['💖', '💕', '💗', '💓', '🩷', '💝', '❤️', '🤍'];
  const positions = [
    { x: 5, y: 30, size: 18 }, { x: w - 25, y: 30, size: 18 },
    { x: w / 2 - 10, y: 25, size: 20 },
    { x: 8, y: h * 0.25, size: 14 }, { x: w - 22, y: h * 0.25, size: 14 },
    { x: 5, y: h * 0.5, size: 16 }, { x: w - 25, y: h * 0.5, size: 16 },
    { x: 8, y: h * 0.75, size: 14 }, { x: w - 22, y: h * 0.75, size: 14 },
    { x: 15, y: h - 18, size: 16 }, { x: w - 30, y: h - 18, size: 16 },
    // Extra floating
    { x: 50, y: h * 0.15, size: 10 }, { x: w - 55, y: h * 0.4, size: 10 },
    { x: 45, y: h * 0.65, size: 10 }, { x: w - 50, y: h * 0.85, size: 10 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(hearts[i % hearts.length], pos.x, pos.y);
  });
  // Dashed border
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.12)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  drawRoundedRect(ctx, 10, 10, w - 20, h - 20, 20);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPastelDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Soft pastel circles
  const circles = [
    { x: 30, y: 25, r: 20, color: 'rgba(196, 181, 253, 0.3)' },
    { x: w - 30, y: 25, r: 18, color: 'rgba(251, 191, 36, 0.2)' },
    { x: 20, y: h - 25, r: 22, color: 'rgba(167, 243, 208, 0.3)' },
    { x: w - 25, y: h - 25, r: 16, color: 'rgba(252, 165, 165, 0.3)' },
    { x: w / 2, y: 20, r: 15, color: 'rgba(196, 181, 253, 0.25)' },
  ];
  circles.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
  });
  const accents = ['🦋', '🌈', '⭐', '🫧', '✨', '🍬'];
  const accentPos = [
    { x: 5, y: 30 }, { x: w - 22, y: 30 },
    { x: 8, y: h * 0.35 }, { x: w - 22, y: h * 0.55 },
    { x: 5, y: h - 15 }, { x: w - 22, y: h - 15 },
  ];
  accentPos.forEach((pos, i) => {
    ctx.font = '16px serif';
    ctx.fillText(accents[i], pos.x, pos.y);
  });
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 8]);
  drawRoundedRect(ctx, 8, 8, w - 16, h - 16, 24);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFilmstripDecorations(ctx: CanvasRenderingContext2D, w: number, h: number, positions: { x: number; y: number; width: number; height: number }[]) {
  // Sprocket holes
  ctx.fillStyle = '#0d0d1a';
  for (let y = 20; y < h - 20; y += 35) {
    ctx.beginPath();
    ctx.roundRect(8, y, 18, 12, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(w - 26, y, 18, 12, 3);
    ctx.fill();
  }
  // Frame numbers
  ctx.fillStyle = '#ff6b35';
  ctx.font = 'bold 11px monospace';
  positions.forEach((pos, i) => {
    ctx.fillText(`${i + 1}A`, 10, pos.y + pos.height + 18);
  });
  ctx.textAlign = 'center';
  ctx.fillText('◄◄ CEA FILM ►►', w / 2, h - 8);
  ctx.textAlign = 'start';
}

function drawKawaiiDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const kawaii = ['🐰', '🐻', '🌟', '🍰', '🎀', '🧸', '🐱', '🦄', '🍩', '🎈'];
  const positions = [
    { x: 3, y: 35, size: 22 }, { x: w - 28, y: 35, size: 22 },
    { x: w / 2 - 12, y: 30, size: 24 },
    { x: 5, y: h * 0.28, size: 16 }, { x: w - 22, y: h * 0.28, size: 16 },
    { x: 8, y: h * 0.52, size: 16 }, { x: w - 22, y: h * 0.52, size: 16 },
    { x: 5, y: h * 0.76, size: 16 }, { x: w - 22, y: h * 0.76, size: 16 },
    { x: w / 2 - 10, y: h - 10, size: 18 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(kawaii[i], pos.x, pos.y);
  });
  // Polka dots
  ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
  for (let x = 15; x < w; x += 40) {
    for (let y = 15; y < h; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Wavy border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  drawRoundedRect(ctx, 6, 6, w - 12, h - 12, 22);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawDoodleDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Hand-drawn style: stars, squiggles, arrows
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  // Draw hand-drawn style stars
  const drawStar = (cx: number, cy: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  // Scattered doodle elements
  drawStar(15, 15, 8);
  drawStar(w - 15, 15, 8);
  drawStar(15, h - 15, 8);
  drawStar(w - 15, h - 15, 8);
  drawStar(w / 2, 12, 10);

  // Squiggly lines on sides
  ctx.beginPath();
  for (let y = 40; y < h - 40; y += 6) {
    const x = 6 + Math.sin(y * 0.08) * 3;
    if (y === 40) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let y = 40; y < h - 40; y += 6) {
    const x = w - 6 + Math.sin(y * 0.08 + 1) * 3;
    if (y === 40) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Doodle emojis
  const doodles = ['☆', '♡', '✿', '♪', '◇', '△'];
  ctx.font = '14px serif';
  ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
  [
    { x: w - 20, y: h * 0.3 }, { x: 5, y: h * 0.45 },
    { x: w - 20, y: h * 0.6 }, { x: 5, y: h * 0.7 },
    { x: w / 2 + 30, y: h - 15 }, { x: w / 2 - 35, y: h - 15 },
  ].forEach((pos, i) => {
    ctx.fillText(doodles[i], pos.x, pos.y);
  });

  // Dashed frame
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 16);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ====== New Frame Style Decorations ======

function drawSparkleDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sparkles = ['✨', '💫', '⭐', '🌟', '💎', '✧', '★'];
  const positions = [
    { x: 5, y: 25, size: 16 }, { x: w - 22, y: 25, size: 16 },
    { x: w / 2, y: 20, size: 18 },
    { x: 8, y: h * 0.3, size: 12 }, { x: w - 18, y: h * 0.35, size: 12 },
    { x: 5, y: h * 0.55, size: 14 }, { x: w - 20, y: h * 0.6, size: 14 },
    { x: 10, y: h * 0.8, size: 12 }, { x: w - 18, y: h * 0.85, size: 12 },
    { x: w / 2 - 30, y: h - 15, size: 14 }, { x: w / 2 + 25, y: h - 15, size: 14 },
    { x: 40, y: h * 0.15, size: 10 }, { x: w - 45, y: h * 0.45, size: 10 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(sparkles[i % sparkles.length], pos.x, pos.y);
  });
  // Glitter dots
  ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSakuraDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const petals = ['🌸', '🏵️', '💮', '🌺'];
  const positions = [
    { x: 3, y: 28, size: 20 }, { x: w - 26, y: 28, size: 20 },
    { x: w / 2 - 8, y: 22, size: 18 },
    { x: 5, y: h * 0.2, size: 14 }, { x: w - 20, y: h * 0.25, size: 14 },
    { x: 8, y: h * 0.4, size: 12 }, { x: w - 18, y: h * 0.45, size: 12 },
    { x: 5, y: h * 0.6, size: 14 }, { x: w - 20, y: h * 0.65, size: 14 },
    { x: 8, y: h * 0.8, size: 12 }, { x: w - 18, y: h * 0.82, size: 12 },
    { x: 15, y: h - 15, size: 16 }, { x: w - 30, y: h - 15, size: 16 },
    // falling petals
    { x: 50, y: h * 0.12, size: 10 }, { x: w - 60, y: h * 0.38, size: 10 },
    { x: 70, y: h * 0.58, size: 10 }, { x: w - 50, y: h * 0.72, size: 10 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(petals[i % petals.length], pos.x, pos.y);
  });
  // Petal circles
  ctx.fillStyle = 'rgba(244, 114, 182, 0.06)';
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 15 + 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawConfettiDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const confettiColors = [
    'rgba(244, 63, 94, 0.3)', 'rgba(59, 130, 246, 0.3)',
    'rgba(251, 191, 36, 0.3)', 'rgba(34, 197, 94, 0.3)',
    'rgba(168, 85, 247, 0.3)', 'rgba(251, 146, 60, 0.3)',
  ];
  // Scattered confetti rectangles
  for (let i = 0; i < 40; i++) {
    ctx.save();
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.fillRect(-4, -1.5, 8, 3);
    ctx.restore();
  }
  // Party emojis
  const party = ['🎉', '🎊', '🥳', '🎈', '🎁', '🎵'];
  [
    { x: 3, y: 25 }, { x: w - 22, y: 25 },
    { x: 5, y: h * 0.5 }, { x: w - 22, y: h * 0.5 },
    { x: 10, y: h - 15 }, { x: w - 25, y: h - 15 },
  ].forEach((pos, i) => {
    ctx.font = '16px serif';
    ctx.fillText(party[i], pos.x, pos.y);
  });
}

function drawRetroDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Retro halftone dots
  ctx.fillStyle = 'rgba(180, 120, 80, 0.06)';
  for (let x = 0; x < w; x += 20) {
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Retro border: double line
  ctx.strokeStyle = 'rgba(180, 120, 80, 0.15)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 6, 6, w - 12, h - 12, 12);
  ctx.stroke();
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 10, 10, w - 20, h - 20, 10);
  ctx.stroke();
  // Vintage corner ornaments 
  const corners = ['❋', '❋', '❋', '❋'];
  ctx.font = '14px serif';
  ctx.fillStyle = 'rgba(180, 120, 80, 0.25)';
  ctx.fillText(corners[0], 4, 18);
  ctx.fillText(corners[1], w - 16, 18);
  ctx.fillText(corners[2], 4, h - 6);
  ctx.fillText(corners[3], w - 16, h - 6);
}

function drawStarryDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Stars scattered
  const stars = ['⭐', '🌟', '✨', '💫', '🌙', '🌠'];
  const positions = [
    { x: 5, y: 25, size: 16 }, { x: w - 22, y: 25, size: 16 },
    { x: w / 2, y: 18, size: 18 },
    { x: 8, y: h * 0.3, size: 12 }, { x: w - 18, y: h * 0.35, size: 14 },
    { x: 5, y: h * 0.55, size: 14 }, { x: w - 20, y: h * 0.6, size: 12 },
    { x: 10, y: h * 0.8, size: 12 }, { x: w - 18, y: h * 0.85, size: 12 },
    { x: w / 2 + 30, y: h - 12, size: 14 }, { x: w / 2 - 35, y: h - 12, size: 14 },
  ];
  positions.forEach((pos, i) => {
    ctx.font = `${pos.size}px serif`;
    ctx.fillText(stars[i % stars.length], pos.x, pos.y);
  });
  // Tiny star dots
  ctx.fillStyle = 'rgba(253, 230, 138, 0.15)';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Glowing border
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 6]);
  drawRoundedRect(ctx, 6, 6, w - 12, h - 12, 18);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ====== REALISTIC Canvas-Drawn Frame Styles ======

function drawSunflowerCanvas(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  // Petals — two layers for depth
  const petalCount = 14;
  for (let layer = 0; layer < 2; layer++) {
    const layerSize = layer === 0 ? size : size * 0.75;
    const angleOffset = layer === 0 ? 0 : Math.PI / petalCount;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + angleOffset;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      // Petal shape — elongated ellipse
      ctx.beginPath();
      ctx.ellipse(0, -layerSize * 0.55, layerSize * 0.18, layerSize * 0.45, 0, 0, Math.PI * 2);
      // Gradient fill for each petal
      const petalGrad = ctx.createRadialGradient(0, -layerSize * 0.4, 0, 0, -layerSize * 0.4, layerSize * 0.5);
      if (layer === 0) {
        petalGrad.addColorStop(0, '#fbbf24');
        petalGrad.addColorStop(0.6, '#f59e0b');
        petalGrad.addColorStop(1, '#d97706');
      } else {
        petalGrad.addColorStop(0, '#fcd34d');
        petalGrad.addColorStop(0.6, '#fbbf24');
        petalGrad.addColorStop(1, '#f59e0b');
      }
      ctx.fillStyle = petalGrad;
      ctx.fill();
      // Petal outline
      ctx.strokeStyle = 'rgba(180, 120, 20, 0.3)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }
  }
  // Center circle — brown with seed texture
  const centerR = size * 0.28;
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR);
  centerGrad.addColorStop(0, '#78350f');
  centerGrad.addColorStop(0.5, '#92400e');
  centerGrad.addColorStop(1, '#451a03');
  ctx.beginPath();
  ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.fillStyle = centerGrad;
  ctx.fill();
  // Seed dots
  ctx.fillStyle = '#fbbf24';
  for (let ring = 1; ring <= 3; ring++) {
    const r = (ring / 4) * centerR;
    const dotCount = ring * 6;
    for (let d = 0; d < dotCount; d++) {
      const a = (d / dotCount) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, angle: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  // Leaf shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.3, -size * 0.4, size * 0.8, -size * 0.2, size, 0);
  ctx.bezierCurveTo(size * 0.8, size * 0.2, size * 0.3, size * 0.4, 0, 0);
  const leafGrad = ctx.createLinearGradient(0, 0, size, 0);
  leafGrad.addColorStop(0, '#16a34a');
  leafGrad.addColorStop(0.5, '#22c55e');
  leafGrad.addColorStop(1, '#15803d');
  ctx.fillStyle = leafGrad;
  ctx.fill();
  // Center vein
  ctx.beginPath();
  ctx.moveTo(size * 0.1, 0);
  ctx.lineTo(size * 0.85, 0);
  ctx.strokeStyle = 'rgba(21, 128, 61, 0.5)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

function drawSunflowerDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Golden border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 3, 3, w - 6, h - 6, 14);
  ctx.stroke();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 7, 7, w - 14, h - 14, 12);
  ctx.stroke();

  // Large sunflower — bottom-left (like the reference image)
  drawSunflowerCanvas(ctx, w * 0.18, h - 28, Math.min(w, h) * 0.15);
  // Smaller sunflower — bottom-left, further left
  drawSunflowerCanvas(ctx, w * 0.05, h - 15, Math.min(w, h) * 0.09);
  // Medium sunflower — bottom-right
  drawSunflowerCanvas(ctx, w * 0.85, h - 22, Math.min(w, h) * 0.11);
  // Small sunflower — top-right
  drawSunflowerCanvas(ctx, w - 20, 20, Math.min(w, h) * 0.06);

  // Leaves scattered around the sunflowers
  drawLeaf(ctx, w * 0.28, h - 18, 20, -0.3);
  drawLeaf(ctx, w * 0.1, h - 40, 16, 0.8);
  drawLeaf(ctx, w * 0.78, h - 15, 18, 2.5);
  drawLeaf(ctx, w * 0.92, h - 35, 14, 1.2);
  drawLeaf(ctx, w - 35, 15, 12, -0.5);
  drawLeaf(ctx, w * 0.03, h * 0.5, 15, 0.4);
  drawLeaf(ctx, w * 0.95, h * 0.4, 14, 2.8);

  // Ribbon bow — top-left (like reference image)
  drawRibbon(ctx, 30, 22, Math.min(w, h) * 0.08);
}

function drawRibbon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  // Left loop
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx - size, cy - size * 0.6, cx - size * 1.2, cy + size * 0.3, cx, cy);
  ctx.fillStyle = '#d4a574';
  ctx.fill();
  ctx.strokeStyle = '#b8956a';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Right loop
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx + size, cy - size * 0.6, cx + size * 1.2, cy + size * 0.3, cx, cy);
  ctx.fillStyle = '#c9a06c';
  ctx.fill();
  ctx.stroke();
  // Center knot
  ctx.beginPath();
  ctx.ellipse(cx, cy, size * 0.15, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#b8956a';
  ctx.fill();
  // Tails
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.1, cy + size * 0.15);
  ctx.bezierCurveTo(cx - size * 0.3, cy + size * 0.8, cx - size * 0.15, cy + size, cx - size * 0.35, cy + size * 1.1);
  ctx.strokeStyle = '#c9a06c';
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.1, cy + size * 0.15);
  ctx.bezierCurveTo(cx + size * 0.3, cy + size * 0.8, cx + size * 0.15, cy + size, cx + size * 0.35, cy + size * 1.1);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawRoseCanvas(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  // Layered petals for a rose
  const petalLayers = [5, 7, 9];
  const colors = color === 'pink'
    ? ['#fda4af', '#fb7185', '#f43f5e']
    : color === 'red'
    ? ['#fca5a5', '#f87171', '#ef4444']
    : ['#fef3c7', '#fde68a', '#fbbf24'];

  petalLayers.forEach((count, layer) => {
    const r = size * (1 - layer * 0.25);
    const angleOffset = layer * 0.3;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + angleOffset;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.4, r * 0.25, r * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors[layer];
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  });
  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = colors[2];
  ctx.fill();
}

function drawVine(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, leafSide: number) {
  // Curved vine stem
  const midX = (startX + endX) / 2 + leafSide * 8;
  const midY = (startY + endY) / 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(midX, midY, endX, endY);
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Small leaves along vine
  const steps = 4;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
    drawLeaf(ctx, x, y, 10, leafSide * (0.5 + i * 0.3));
  }
}

function drawGardenDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Vine border — left side
  drawVine(ctx, 8, 10, 8, h * 0.3, 1);
  drawVine(ctx, 8, h * 0.3, 8, h * 0.6, -1);
  drawVine(ctx, 8, h * 0.6, 8, h * 0.9, 1);
  // Vine border — right side
  drawVine(ctx, w - 8, 10, w - 8, h * 0.3, -1);
  drawVine(ctx, w - 8, h * 0.3, w - 8, h * 0.6, 1);
  drawVine(ctx, w - 8, h * 0.6, w - 8, h * 0.9, -1);
  // Top vine
  drawVine(ctx, 15, 8, w * 0.4, 8, 1);
  drawVine(ctx, w * 0.6, 8, w - 15, 8, -1);
  // Bottom vine
  drawVine(ctx, 15, h - 8, w * 0.4, h - 8, -1);
  drawVine(ctx, w * 0.6, h - 8, w - 15, h - 8, 1);

  // Roses at corners and edges
  drawRoseCanvas(ctx, 15, 15, 14, 'pink');
  drawRoseCanvas(ctx, w - 15, 15, 12, 'red');
  drawRoseCanvas(ctx, 15, h - 15, 12, 'pink');
  drawRoseCanvas(ctx, w - 15, h - 15, 14, 'red');
  // Mid-edge roses
  drawRoseCanvas(ctx, 12, h * 0.5, 10, 'yellow');
  drawRoseCanvas(ctx, w - 12, h * 0.5, 10, 'pink');
  drawRoseCanvas(ctx, w / 2, 12, 10, 'red');
  drawRoseCanvas(ctx, w / 2, h - 12, 10, 'yellow');

  // Extra scattered leaves
  drawLeaf(ctx, w * 0.3, 5, 10, 0.2);
  drawLeaf(ctx, w * 0.7, h - 5, 10, 3.0);
}

function drawLaceDecorations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.25)';
  ctx.fillStyle = 'rgba(180, 160, 140, 0.06)';

  // Doily corner ornaments
  const doilyCorners = [
    { x: 0, y: 0 }, { x: w, y: 0 },
    { x: 0, y: h }, { x: w, y: h },
  ];
  doilyCorners.forEach(({ x, y }) => {
    const r = Math.min(w, h) * 0.1;
    // Scallop ring
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * r * 0.65,
        y + Math.sin(angle) * r * 0.65,
        r * 0.25, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    // Center circle
    ctx.beginPath();
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 160, 140, 0.08)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(180, 160, 140, 0.06)';
  });

  // Scalloped border
  const scallSize = 12;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.2)';
  // Top
  for (let x = scallSize; x < w - scallSize; x += scallSize * 2) {
    ctx.beginPath();
    ctx.arc(x + scallSize, 6, scallSize, Math.PI, 0);
    ctx.stroke();
  }
  // Bottom
  for (let x = scallSize; x < w - scallSize; x += scallSize * 2) {
    ctx.beginPath();
    ctx.arc(x + scallSize, h - 6, scallSize, 0, Math.PI);
    ctx.stroke();
  }
  // Left
  for (let y = scallSize; y < h - scallSize; y += scallSize * 2) {
    ctx.beginPath();
    ctx.arc(6, y + scallSize, scallSize, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }
  // Right
  for (let y = scallSize; y < h - scallSize; y += scallSize * 2) {
    ctx.beginPath();
    ctx.arc(w - 6, y + scallSize, scallSize, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
  }

  // Cross-stitch dots pattern (subtle)
  ctx.fillStyle = 'rgba(180, 160, 140, 0.08)';
  for (let x = 20; x < w - 20; x += 30) {
    for (let y = 20; y < h - 20; y += 30) {
      // tiny X
      ctx.strokeStyle = 'rgba(180, 160, 140, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x - 2, y - 2); ctx.lineTo(x + 2, y + 2);
      ctx.moveTo(x + 2, y - 2); ctx.lineTo(x - 2, y + 2);
      ctx.stroke();
    }
  }

  // Inner frame line — double
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.15)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 14, 14, w - 28, h - 28, 10);
  ctx.stroke();
  drawRoundedRect(ctx, 18, 18, w - 36, h - 36, 8);
  ctx.stroke();
}

// ====== Background rendering per frame style ======

function drawFrameBackground(ctx: CanvasRenderingContext2D, style: FrameStyle, w: number, h: number, baseColor: string) {
  // Base fill with the chosen frame color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  switch (style) {
    case 'hearts': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(255, 228, 230, 0.4)');
      grad.addColorStop(0.5, 'rgba(252, 231, 243, 0.2)');
      grad.addColorStop(1, 'rgba(255, 228, 230, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'pastel': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(243, 232, 255, 0.5)');
      grad.addColorStop(0.25, 'rgba(254, 249, 195, 0.2)');
      grad.addColorStop(0.5, 'rgba(204, 251, 241, 0.3)');
      grad.addColorStop(0.75, 'rgba(252, 231, 243, 0.2)');
      grad.addColorStop(1, 'rgba(219, 234, 254, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'filmstrip': {
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      break;
    }
    case 'kawaii': {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(254, 249, 231, 0.5)');
      grad.addColorStop(0.5, 'rgba(255, 241, 242, 0.3)');
      grad.addColorStop(1, 'rgba(252, 231, 243, 0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'doodle': {
      ctx.fillStyle = 'rgba(245, 240, 230, 0.3)';
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'sparkle': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(253, 230, 138, 0.15)');
      grad.addColorStop(0.5, 'rgba(252, 231, 243, 0.1)');
      grad.addColorStop(1, 'rgba(253, 230, 138, 0.15)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'sakura': {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(252, 231, 243, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 228, 230, 0.2)');
      grad.addColorStop(1, 'rgba(252, 231, 243, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'confetti': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(254, 249, 195, 0.2)');
      grad.addColorStop(0.5, 'rgba(219, 234, 254, 0.15)');
      grad.addColorStop(1, 'rgba(252, 231, 243, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'retro': {
      ctx.fillStyle = 'rgba(245, 235, 220, 0.3)';
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'starry': {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(30, 41, 59, 0.06)');
      grad.addColorStop(0.5, 'rgba(49, 46, 129, 0.04)');
      grad.addColorStop(1, 'rgba(30, 41, 59, 0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'sunflower': {
      // Warm golden background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(254, 249, 195, 0.35)');
      grad.addColorStop(0.5, 'rgba(254, 243, 199, 0.2)');
      grad.addColorStop(1, 'rgba(253, 230, 138, 0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'garden': {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(220, 252, 231, 0.3)');
      grad.addColorStop(0.5, 'rgba(254, 249, 195, 0.15)');
      grad.addColorStop(1, 'rgba(252, 231, 243, 0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'lace': {
      ctx.fillStyle = 'rgba(245, 240, 235, 0.3)';
      ctx.fillRect(0, 0, w, h);
      break;
    }
    default: {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(254, 243, 199, 0.1)');
      gradient.addColorStop(0.5, 'rgba(252, 231, 243, 0.08)');
      gradient.addColorStop(1, 'rgba(254, 243, 199, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      break;
    }
  }
}

// ====== Main render function ======

export async function renderPhotostrip(
  photos: Photo[],
  layout: LayoutType,
  frameStyle: FrameStyle,
  frameColor: string,
  stickers: Sticker[] = [] 
): Promise<string | null> {
  const layoutConfig = LAYOUTS[layout];
  if (!layoutConfig) return null;

  const canvas = document.createElement('canvas');
  canvas.width = layoutConfig.canvasWidth;
  canvas.height = layoutConfig.canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = layoutConfig.canvasWidth;
  const h = layoutConfig.canvasHeight;
  const photoPositions = layoutConfig.getPhotoPositions(photos.length);
  const isStory = layout === 'story';
  const scaleFactor = isStory ? 2.5 : 1;

  // 1. Draw background
  drawFrameBackground(ctx, frameStyle, w, h, frameColor);

  // Story header gradient
  if (isStory) {
    const headerGrad = ctx.createLinearGradient(0, 0, w, 160);
    headerGrad.addColorStop(0, 'rgba(244, 63, 94, 0.08)');
    headerGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.06)');
    headerGrad.addColorStop(1, 'rgba(245, 158, 11, 0.08)');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, w, 160);
  }

  // 2. Draw photos
  const maxPhotos = Math.min(photos.length, photoPositions.length);
  for (let i = 0; i < maxPhotos; i++) {
    const pos = photoPositions[i];
    const photo = photos[i];
    if (!photo) continue;

    try {
      const img = await loadImage(photo.dataUrl);

      // Shadow
      ctx.shadowColor = frameStyle === 'filmstrip' ? 'rgba(255, 107, 53, 0.15)' : 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 12 * scaleFactor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4 * scaleFactor;

      // Clip & draw
      ctx.save();
      drawRoundedRect(ctx, pos.x, pos.y, pos.width, pos.height, layoutConfig.borderRadius);
      ctx.clip();

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

  // 4. Draw frame style decorations
  switch (frameStyle) {
    case 'floral': drawFloralDecorations(ctx, w, h); break;
    case 'hearts': drawHeartsDecorations(ctx, w, h); break;
    case 'pastel': drawPastelDecorations(ctx, w, h); break;
    case 'filmstrip': drawFilmstripDecorations(ctx, w, h, photoPositions); break;
    case 'kawaii': drawKawaiiDecorations(ctx, w, h); break;
    case 'doodle': drawDoodleDecorations(ctx, w, h); break;
    case 'sparkle': drawSparkleDecorations(ctx, w, h); break;
    case 'sakura': drawSakuraDecorations(ctx, w, h); break;
    case 'confetti': drawConfettiDecorations(ctx, w, h); break;
    case 'retro': drawRetroDecorations(ctx, w, h); break;
    case 'starry': drawStarryDecorations(ctx, w, h); break;
    case 'sunflower': drawSunflowerDecorations(ctx, w, h); break;
    case 'garden': drawGardenDecorations(ctx, w, h); break;
    case 'lace': drawLaceDecorations(ctx, w, h); break;
    case 'clean': drawCleanDecorations(ctx, w, h); break;
  }

  // 5. Try to load logo
  let logoLoaded = false;
  try {
    const logo = await loadImage('/logo.png');
    const logoSize = isStory ? 60 : 28;
    const logoX = w / 2 - logoSize / 2;
    const logoY = layoutConfig.footerY - (isStory ? 8 : 5);
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    logoLoaded = true;
  } catch {}

  // 6. Draw footer branding
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const brandFontSize = Math.round(20 * scaleFactor);
  const dateFontSize = Math.round(11 * scaleFactor);
  const brandY = layoutConfig.footerY + (logoLoaded ? (isStory ? 55 : 24) : 0);

  const isDark = ['#1a1a2e', '#1e293b'].includes(frameColor);
  const brandColor = frameStyle === 'filmstrip' ? '#ff6b35' : isDark ? '#f8b4c8' : '#f43f5e';
  const dateColor = isDark ? '#94a3b8' : '#9ca3af';

  ctx.font = `700 ${brandFontSize}px "Outfit", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = brandColor;
  ctx.fillText('Cea Photobooth', w / 2, brandY);

  const actualWidth = ctx.measureText('Cea Photobooth').width;
  ctx.font = `${Math.round(brandFontSize * 0.9)}px serif`;
  ctx.fillText('🌻', w / 2 + actualWidth / 2 + 5, brandY);

  ctx.font = `${dateFontSize}px "Outfit", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = dateColor;
  ctx.fillText(`${dateStr} • ${timeStr}`, w / 2, brandY + brandFontSize + 8);

  return canvas.toDataURL('image/png');
}

// Legacy compatibility wrapper
export async function renderPhotostripLegacy(
  photos: Photo[],
  template: TemplateType,
  stickers: Sticker[] = []
): Promise<string | null> {
  // Map old template to new layout + style
  const mapping: Record<TemplateType, { layout: LayoutType; style: FrameStyle; color: string }> = {
    classic: { layout: 'strip-4', style: 'clean', color: '#fefdfb' },
    polaroid: { layout: 'polaroid', style: 'clean', color: '#ffffff' },
    grid: { layout: 'grid-2x2', style: 'clean', color: '#fdf2f8' },
    floral: { layout: 'strip-4', style: 'floral', color: '#fef7f0' },
    story: { layout: 'story', style: 'clean', color: '#fefdfb' },
    hearts: { layout: 'strip-4', style: 'hearts', color: '#fff0f3' },
    pastel: { layout: 'strip-4', style: 'pastel', color: '#f3e8ff' },
    filmstrip: { layout: 'strip-4', style: 'filmstrip', color: '#1a1a2e' },
    cute: { layout: 'strip-4', style: 'kawaii', color: '#fef9e7' },
  };
  const m = mapping[template] || mapping.classic;
  return renderPhotostrip(photos, m.layout, m.style, m.color, stickers);
}

export function getLayoutConfig(layout: LayoutType) {
  return LAYOUTS[layout];
}

export async function renderPhotostripAsBlob(
  photos: Photo[],
  layout: LayoutType,
  frameStyle: FrameStyle,
  frameColor: string,
  stickers: Sticker[] = []
): Promise<Blob | null> {
  const dataUrl = await renderPhotostrip(photos, layout, frameStyle, frameColor, stickers);
  if (!dataUrl) return null;
  const response = await fetch(dataUrl);
  return response.blob();
}
