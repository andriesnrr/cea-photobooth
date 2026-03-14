'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FlashEffectProps {
  show: boolean;
}

export default function FlashEffect({ show }: FlashEffectProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] bg-white pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}
