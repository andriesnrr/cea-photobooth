'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PoseGuideProps {
  pose: string;
  photoIndex: number;
  totalPhotos: number;
}

export default function PoseGuide({ pose, photoIndex, totalPhotos }: PoseGuideProps) {
  if (!pose) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={pose}
        initial={{ y: 30, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="glass rounded-2xl px-5 py-3 text-center">
          <div className="text-xs text-rose-400 font-medium mb-1">
            Photo {photoIndex + 1} of {totalPhotos}
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {pose}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
