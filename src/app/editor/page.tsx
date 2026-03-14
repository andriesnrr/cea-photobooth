'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { renderPhotostrip, getTemplateConfig } from '@/lib/photostrip';
import StickerEditor from '@/components/StickerEditor';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import FlowerBackground from '@/components/FlowerBackground';

export default function EditorPage() {
  const router = useRouter();
  const { state, addSticker, updateSticker, removeSticker, setPhotostrip } = useStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(state.photostripDataUrl);

  const config = getTemplateConfig(state.selectedTemplate);

  const renderPreview = useCallback(async () => {
    const url = await renderPhotostrip(state.photos, state.selectedTemplate, state.stickers);
    setPreviewUrl(url);
    setPhotostrip(url);
  }, [state.photos, state.selectedTemplate, state.stickers, setPhotostrip]);

  useEffect(() => {
    if (state.photos.length > 0) {
      renderPreview();
    }
  }, [renderPreview, state.photos.length]);

  useEffect(() => {
    if (state.photos.length === 0) {
      router.push('/photobooth');
    }
  }, [state.photos, router]);

  const handleDone = () => {
    router.push('/result');
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col safe-area relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/preview')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-rose-500 text-sm font-medium cursor-pointer hover:bg-white/70 transition-all"
          >
            ← Back
          </motion.button>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🎨</span> Stickers
          </h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDone}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 text-white text-sm font-bold cursor-pointer shadow-md shadow-rose-200/50"
          >
            Done ✓
          </motion.button>
        </div>

        {/* Editor area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
          <div className="relative max-w-[280px] w-full">
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden shadow-2xl shadow-rose-200/30 ring-1 ring-white/50"
              >
                <img src={previewUrl} alt="Photostrip" className="w-full" />
              </motion.div>
            )}
            <StickerEditor
              stickers={state.stickers}
              onAddSticker={addSticker}
              onUpdateSticker={updateSticker}
              onRemoveSticker={removeSticker}
              canvasWidth={config.canvasWidth}
              canvasHeight={config.canvasHeight}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-400 mt-5 text-center glass-card px-4 py-2 rounded-full"
          >
            🌸 Tap to add • Drag to move • ✕ to remove
          </motion.p>
        </div>

        {/* Done button */}
        <div className="px-6 py-4 safe-bottom">
          <Button onClick={handleDone} size="lg" className="w-full btn-gradient !rounded-2xl !py-4" icon="🎉">
            See Result
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
