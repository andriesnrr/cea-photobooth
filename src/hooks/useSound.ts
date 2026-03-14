'use client';

import { useRef, useCallback } from 'react';

export function useSound() {
  const audioMap = useRef<Map<string, HTMLAudioElement>>(new Map());

  const play = useCallback((src: string, volume: number = 0.5) => {
    try {
      let audio = audioMap.current.get(src);
      if (!audio) {
        audio = new Audio(src);
        audioMap.current.set(src, audio);
      }
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  const playBeep = useCallback(() => {
    // Generate a beep using Web Audio API as fallback
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gain.gain.value = 0.15;
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch {}
  }, []);

  const playShutter = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.3;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }, []);

  return { play, playBeep, playShutter };
}
