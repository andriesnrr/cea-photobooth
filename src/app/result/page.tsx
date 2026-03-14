'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { downloadPhotostrip, sharePhotostrip, saveToMemories } from '@/lib/download';
import CelebrationAnimation from '@/components/CelebrationAnimation';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import FlowerBackground from '@/components/FlowerBackground';

export default function ResultPage() {
  const router = useRouter();
  const { state, newSession } = useStore();
  const [showCelebration, setShowCelebration] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.photos.length === 0) {
      router.push('/');
      return;
    }

    if (state.photostripDataUrl && !saved) {
      saveToMemories(state.photostripDataUrl);
      setSaved(true);
    }

    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadPhotostrip(state.photos, state.selectedTemplate, state.stickers);
    setIsDownloading(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    await sharePhotostrip(state.photos, state.selectedTemplate, state.stickers);
    setIsSharing(false);
  };

  const handleNewSession = () => {
    newSession();
    router.push('/setup');
  };

  return (
    <PageTransition>
      <FlowerBackground />
      {showCelebration && <CelebrationAnimation />}

      <div className="min-h-dvh flex flex-col safe-area relative z-10">
        {/* Header */}
        <div className="text-center px-6 pt-8 pb-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-3"
            >
              🌻
            </motion.div>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-dancing)] text-gradient-floral mb-2 text-shadow-soft">
              Beautiful!
            </h2>
            <p className="text-gray-400 text-sm tracking-wide">Your photostrip is ready ✨</p>
          </motion.div>
        </div>

        {/* Photostrip */}
        <div className="flex-1 flex items-center justify-center px-6">
          {state.photostripDataUrl && (
            <motion.div
              initial={{ y: 60, opacity: 0, rotateZ: -3 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring', damping: 20 }}
              className="max-w-[280px] w-full"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-rose-200/40 ring-1 ring-white/50 ring-glow">
                <img src={state.photostripDataUrl} alt="Your photostrip" className="w-full" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="px-6 py-5 space-y-3 safe-bottom"
        >
          {/* Primary actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              isLoading={isDownloading}
              size="lg"
              className="flex-1 btn-gradient !rounded-2xl"
              icon="📥"
            >
              Download
            </Button>
            <Button
              onClick={handleShare}
              isLoading={isSharing}
              variant="secondary"
              size="lg"
              className="flex-1 !rounded-2xl glass-card !border-rose-100"
              icon="📤"
            >
              Share
            </Button>
          </div>

          {/* Secondary actions */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/editor')}
              className="flex-1 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 text-gray-600 text-sm font-medium cursor-pointer hover:bg-white/60 transition-all"
            >
              ← Edit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNewSession}
              className="flex-1 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 text-gray-600 text-sm font-medium cursor-pointer hover:bg-white/60 transition-all"
            >
              New Session 📸
            </motion.button>
          </div>

          {/* Memories link */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/memories')}
            className="block w-full text-center text-sm text-gray-400 hover:text-rose-400 transition-all cursor-pointer py-2 hover:tracking-wider"
          >
            View All Memories →
          </motion.button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
