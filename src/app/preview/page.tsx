'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import TemplateSelector from '@/components/TemplateSelector';
import FlowerBackground from '@/components/FlowerBackground';
import { useEffect, useState } from 'react';
import { renderPhotostrip } from '@/lib/photostrip';

export default function PreviewPage() {
  const router = useRouter();
  const { state, setTemplate, clearPhotos, setPhotostrip } = useStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (state.photos.length === 0) {
      router.push('/photobooth');
      return;
    }

    async function render() {
      setIsRendering(true);
      const url = await renderPhotostrip(state.photos, state.selectedTemplate);
      setPreviewUrl(url);
      setIsRendering(false);
    }
    render();
  }, [state.photos, state.selectedTemplate]);

  const handleContinue = () => {
    if (previewUrl) {
      setPhotostrip(previewUrl);
    }
    router.push('/editor');
  };

  const handleRetakeAll = () => {
    clearPhotos();
    router.push('/photobooth');
  };

  const handleRetakeOne = (index: number) => {
    router.push(`/retake?index=${index}`);
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col safe-area relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRetakeAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-rose-500 text-sm font-medium cursor-pointer hover:bg-white/70 transition-all"
          >
            ↻ Retake All
          </motion.button>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>✨</span> Preview
          </h2>
          <div className="w-24" />
        </div>

        {/* Main content — portrait: stacked, landscape: side-by-side */}
        <div className="flex-1 flex flex-col landscape:flex-row landscape:items-center landscape:gap-8 landscape:px-8">
          {/* Photo strip preview */}
          <div className="flex-1 flex items-center justify-center px-6 py-2 landscape:px-0">
            {isRendering ? (
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity } }}
                  className="text-5xl inline-block mb-4"
                >
                  🌻
                </motion.div>
                <p className="text-gray-400 text-sm">Rendering your photostrip...</p>
              </div>
            ) : previewUrl ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotateZ: -2 }}
                animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="max-w-[280px] landscape:max-w-[240px] w-full"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-rose-200/40 ring-1 ring-white/50 ring-glow">
                  <img src={previewUrl} alt="Photostrip preview" className="w-full" />
                </div>
              </motion.div>
            ) : null}
          </div>

          {/* Right panel (landscape) / bottom panel (portrait) */}
          <div className="landscape:flex-1 landscape:max-w-sm">
            {/* Individual photos — tappable for retake */}
            <div className="px-6 py-3 landscape:px-0">
              <p className="text-xs text-gray-400 text-center mb-2 tracking-wide">Tap a photo to retake 📸</p>
              <div className="flex gap-2 justify-center">
                {state.photos.map((photo, i) => (
                  <motion.button
                    key={photo.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg cursor-pointer transition-all ${
                      selectedPhotoIndex === i
                        ? 'border-rose-400 shadow-rose-200/50 ring-2 ring-rose-300'
                        : 'border-white shadow-rose-100/30 hover:border-rose-200'
                    }`}
                  >
                    <img src={photo.dataUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {/* Retake overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                      <span className="text-white text-lg opacity-0 hover:opacity-100 transition-opacity">🔄</span>
                    </div>
                    {/* Photo number badge */}
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{i + 1}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected photo retake confirmation */}
            <AnimatePresence>
              {selectedPhotoIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-6 py-2 landscape:px-0"
                >
                  <div className="flex gap-2 justify-center">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRetakeOne(selectedPhotoIndex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold cursor-pointer shadow-md shadow-amber-200/50"
                    >
                      🔄 Retake Photo {selectedPhotoIndex + 1}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPhotoIndex(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-gray-500 text-sm cursor-pointer"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Template selector */}
            <div className="px-4 py-3 landscape:px-0">
              <p className="text-xs text-gray-400 text-center mb-2 tracking-wide uppercase">Choose a template</p>
              <TemplateSelector selected={state.selectedTemplate} onSelect={setTemplate} />
            </div>

            {/* Actions */}
            <div className="px-6 py-4 safe-bottom landscape:px-0">
              <Button onClick={handleContinue} size="lg" className="w-full btn-gradient !rounded-2xl !py-4" icon="✏️">
                Add Stickers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
