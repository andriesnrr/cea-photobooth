'use client';

import { motion } from 'framer-motion';

export default function CelebrationAnimation() {
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    emoji: ['🌻', '🌹', '🌸', '✨', '💖', '🎉'][i % 6],
    left: Math.random() * 100,
    delay: Math.random() * 1,
    duration: 1.5 + Math.random() * 1.5,
    size: 16 + Math.random() * 20,
  }));

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            top: '-5%',
          }}
          initial={{ y: '-10vh', rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: [0, 180, 360],
            x: [0, 20, -20, 0],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeIn',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
