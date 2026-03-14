'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import FlowerBackground from '@/components/FlowerBackground';

export default function NotePage() {
  const router = useRouter();

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area relative z-10 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-sm w-full text-center relative"
        >
          {/* Floating decorations */}
          <motion.span
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 text-6xl"
          >
            💌
          </motion.span>

          <motion.span
            animate={{ y: [0, -6, 0], x: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-8 -left-6 text-2xl opacity-60"
          >🌸</motion.span>
          <motion.span
            animate={{ y: [0, -8, 0], x: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-6 -right-4 text-2xl opacity-50"
          >🌷</motion.span>

          {/* Card */}
          <div className="glass-card p-10 space-y-6 mt-8 relative overflow-hidden">
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 text-2xl opacity-20 rotate-12">🌸</div>
            <div className="absolute -top-1 -right-2 text-xl opacity-15 -rotate-12">✨</div>
            <div className="absolute -bottom-1 -left-1 text-xl opacity-15 rotate-45">🌹</div>
            <div className="absolute -bottom-2 -right-2 text-2xl opacity-20 -rotate-45">🌻</div>

            <h2 className="text-4xl font-bold font-[family-name:var(--font-dancing)] text-gradient-floral text-shadow-soft">
              For You, Cea
            </h2>

            <div className="space-y-5 text-gray-500 leading-relaxed text-[15px]">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                I made this little photobooth just for you. 
                Every flower here reminds me of your smile — 
                bright like a sunflower 🌻
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                I hope this makes you smile.
                Take lots of photos, be silly, be yourself.
                You&apos;re beautiful in every one of them. ✨
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-4" />
                <p className="text-xl font-[family-name:var(--font-dancing)] text-rose-400">
                  — With love 💖
                </p>
              </motion.div>
            </div>
          </div>

          {/* Decorative flowers below */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            {['🌸', '🌻', '🌹', '🌷', '🌸'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5 - i * 2, 0] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/')}
            className="mt-8 text-sm text-rose-300 hover:text-rose-500 transition-all cursor-pointer hover:tracking-wider"
          >
            ← Back to photobooth
          </motion.button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
