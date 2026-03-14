'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

  const handleRetake = () => {
    clearPhotos();
    router.push('/photobooth');
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col safe-area relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-rose-500 text-sm font-medium cursor-pointer hover:bg-white/70 transition-all"
          >
            ↻ Retake
          </motion.button>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>✨</span> Preview
          </h2>
          <div className="w-20" />
        </div>

        {/* Photo strip preview */}
        <div className="flex-1 flex items-center justify-center px-6 py-2">
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
              className="max-w-[280px] w-full"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-rose-200/40 ring-1 ring-white/50 ring-glow">
                <img src={previewUrl} alt="Photostrip preview" className="w-full" />
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* Individual photos thumbnail strip */}
        <div className="px-6 py-3">
          <div className="flex gap-2 justify-center">
            {state.photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg shadow-rose-100/30"
              >
                <img src={photo.dataUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Template selector */}
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400 text-center mb-2 tracking-wide uppercase">Choose a template</p>
          <TemplateSelector selected={state.selectedTemplate} onSelect={setTemplate} />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 safe-bottom">
          <Button onClick={handleContinue} size="lg" className="w-full btn-gradient !rounded-2xl !py-4" icon="✏️">
            Add Stickers
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
