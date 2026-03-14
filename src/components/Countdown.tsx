'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  count: number | null;
}

export default function Countdown({ count }: CountdownProps) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 to-sunflower-400 blur-2xl opacity-40 scale-150" />
            <div className="relative w-32 h-32 rounded-full glass flex items-center justify-center">
              <span className="text-6xl font-bold text-gradient-floral">
                {count}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
