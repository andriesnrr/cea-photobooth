'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FlowerBackground from '@/components/FlowerBackground';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import { useStore } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const { state, newSession } = useStore();

  const handleStart = () => {
    newSession();
    router.push('/setup');
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area relative z-10 px-6">

        {/* Main content card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative"
        >
          {/* Floating decorative elements */}
          <motion.span
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-16 -left-8 text-4xl opacity-60"
          >🌸</motion.span>
          <motion.span
            animate={{ y: [0, -6, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-12 -right-6 text-3xl opacity-50"
          >🌷</motion.span>
          <motion.span
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-8 -left-10 text-3xl opacity-40"
          >🌹</motion.span>
          <motion.span
            animate={{ y: [0, -7, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute -bottom-10 -right-8 text-4xl opacity-50"
          >✨</motion.span>

          {/* Main sunflower */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-8xl mb-6 drop-shadow-lg"
          >
            🌻
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl font-bold font-[family-name:var(--font-dancing)] text-gradient-floral mb-3 text-shadow-soft underline-glow"
          >
            Cea Photobooth
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-gray-500 font-light mb-12 tracking-wide"
          >
            A little photobooth, just for you ✨
          </motion.p>

          {/* Start Button — big, bold, premium */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="w-full max-w-xs mx-auto"
          >
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full text-lg btn-gradient !rounded-2xl !py-5"
              icon="📸"
            >
              Start Photobooth
            </Button>
          </motion.div>

          {/* Session counter */}
          {state.sessionCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <button
                onClick={() => router.push('/memories')}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-card text-sm text-rose-500 hover:text-rose-600 transition-all cursor-pointer hover:shadow-lg"
              >
                <span className="text-base">📸</span>
                <span className="font-medium">{state.sessionCount} sessions</span>
                <span className="text-gray-400">•</span>
                <span className="group-hover:underline">View Memories</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Hidden note link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          onClick={() => router.push('/note')}
          className="absolute bottom-8 text-lg cursor-pointer"
        >
          🌸
        </motion.button>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-16 text-xs text-gray-400 tracking-wider"
        >
          Made with 💖 for Cea
        </motion.div>
      </div>
    </PageTransition>
  );
}
