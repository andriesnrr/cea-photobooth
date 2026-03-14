'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  opacity: number;
  rotation: number;
}

const EMOJIS = ['🌸', '🌹', '🌻', '🌷', '✨', '💐', '🌺', '💮'];
const SMALL_EMOJIS = ['✿', '❀', '✾', '❋', '·'];

function createParticle(id: number): Particle {
  return {
    id,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size: 14 + Math.random() * 22,
    duration: 12 + Math.random() * 10,
    delay: Math.random() * 8,
    swayAmount: 30 + Math.random() * 60,
    opacity: 0.3 + Math.random() * 0.5,
    rotation: Math.random() * 360,
  };
}

function createSmallParticle(id: number): Particle {
  return {
    id,
    emoji: SMALL_EMOJIS[Math.floor(Math.random() * SMALL_EMOJIS.length)],
    x: Math.random() * 100,
    y: -5 - Math.random() * 10,
    size: 8 + Math.random() * 10,
    duration: 16 + Math.random() * 12,
    delay: Math.random() * 10,
    swayAmount: 15 + Math.random() * 30,
    opacity: 0.15 + Math.random() * 0.25,
    rotation: Math.random() * 360,
  };
}

export default function FlowerBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [smallParticles, setSmallParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const bigOnes = Array.from({ length: 15 }, (_, i) => createParticle(i));
    const smallOnes = Array.from({ length: 20 }, (_, i) => createSmallParticle(i + 100));
    setParticles(bigOnes);
    setSmallParticles(smallOnes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Corner floral decorations */}
      <div className="absolute top-0 left-0 text-6xl opacity-10 -translate-x-4 -translate-y-2 rotate-12">🌸</div>
      <div className="absolute top-0 right-0 text-5xl opacity-10 translate-x-3 -translate-y-1 -rotate-12">🌻</div>
      <div className="absolute bottom-0 left-0 text-5xl opacity-8 -translate-x-2 translate-y-2 rotate-45">🌹</div>
      <div className="absolute bottom-0 right-0 text-6xl opacity-8 translate-x-4 translate-y-3 -rotate-45">🌷</div>

      {/* Floating glow orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 10, -30, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, -10, 0],
          y: [0, 15, -25, 20, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, 20, -15, 25, 0],
          y: [0, -15, 20, -10, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Big falling particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            rotate: p.rotation,
            opacity: 0,
          }}
          animate={{
            y: '110vh',
            x: [`${p.x}vw`, `${p.x + p.swayAmount / 5}vw`, `${p.x - p.swayAmount / 5}vw`, `${p.x}vw`],
            rotate: p.rotation + 360,
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ fontSize: `${p.size}px`, position: 'absolute' }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Small accent particles */}
      {smallParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: '105vh',
            x: [`${p.x}vw`, `${p.x + p.swayAmount / 8}vw`, `${p.x - p.swayAmount / 8}vw`],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-rose-300"
          style={{ fontSize: `${p.size}px`, position: 'absolute' }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
