'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sticker, StickerType, STICKER_EMOJIS, STICKER_CATEGORIES } from '@/lib/types';

interface StickerEditorProps {
  stickers: Sticker[];
  onAddSticker: (sticker: Sticker) => void;
  onUpdateSticker: (sticker: Sticker) => void;
  onRemoveSticker: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export default function StickerEditor({
  stickers,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
  canvasWidth,
  canvasHeight,
}: StickerEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const handleAddSticker = useCallback((type: StickerType) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      type,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      scale: 1,
      rotation: 0,
    };
    onAddSticker(newSticker);
    setSelectedSticker(newSticker.id);
  }, [canvasWidth, canvasHeight, onAddSticker]);

  const handleDragEnd = useCallback(
    (stickerId: string, info: { point: { x: number; y: number } }) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const sticker = stickers.find((s) => s.id === stickerId);
      if (!sticker) return;

      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      
      const x = (info.point.x - rect.left) * scaleX;
      const y = (info.point.y - rect.top) * scaleY;

      onUpdateSticker({
        ...sticker,
        x: Math.max(0, Math.min(canvasWidth, x)),
        y: Math.max(0, Math.min(canvasHeight, y)),
      });
    },
    [stickers, canvasWidth, canvasHeight, onUpdateSticker]
  );

  const currentCategory = STICKER_CATEGORIES[activeCategory];

  return (
    <div className="relative w-full">
      {/* Canvas overlay for placed stickers */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{ aspectRatio: `${canvasWidth}/${canvasHeight}` }}
      >
        <AnimatePresence>
          {stickers.map((sticker) => {
            const containerEl = containerRef.current;
            const rect = containerEl?.getBoundingClientRect();
            const scaleX = rect ? rect.width / canvasWidth : 1;
            const scaleY = rect ? rect.height / canvasHeight : 1;

            return (
              <motion.div
                key={sticker.id}
                className={`absolute cursor-grab active:cursor-grabbing z-20 select-none
                  ${selectedSticker === sticker.id ? 'ring-2 ring-rose-400 rounded-full' : ''}`}
                style={{
                  left: sticker.x * scaleX - 18,
                  top: sticker.y * scaleY - 18,
                  fontSize: `${32 * sticker.scale}px`,
                  transform: `rotate(${sticker.rotation}deg)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                drag
                dragMomentum={false}
                onDragStart={() => {
                  setSelectedSticker(sticker.id);
                }}
                onDragEnd={(_, info) => handleDragEnd(sticker.id, info)}
                onClick={() => setSelectedSticker(
                  selectedSticker === sticker.id ? null : sticker.id
                )}
              >
                {STICKER_EMOJIS[sticker.type]}
                {selectedSticker === sticker.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSticker(sticker.id);
                      setSelectedSticker(null);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow-md cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sticker palette with categories */}
      <div className="mt-4 space-y-2">
        {/* Category tabs */}
        <div className="flex gap-1.5 justify-center">
          {STICKER_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
                activeCategory === i
                  ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-rose-200/50'
                  : 'bg-white/50 text-gray-500 hover:bg-white/70'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Sticker grid for active category */}
        <div className="flex flex-wrap gap-2 justify-center px-2">
          {currentCategory.types.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleAddSticker(type)}
              className="w-11 h-11 rounded-xl glass flex items-center justify-center text-2xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              {STICKER_EMOJIS[type]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
