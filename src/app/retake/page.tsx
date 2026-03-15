'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCamera } from '@/hooks/useCamera';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/lib/store';
import Countdown from '@/components/Countdown';
import FlashEffect from '@/components/FlashEffect';
import Button from '@/components/ui/Button';
import { Photo } from '@/lib/types';

export default function RetakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const photoIndex = parseInt(searchParams.get('index') || '0', 10);
  const { state, replacePhoto } = useStore();
  const { playBeep, playShutter } = useSound();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const {
    videoRef,
    isCameraReady,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    currentFacingMode,
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const originalPhoto = state.photos[photoIndex];

  const handleCapture = useCallback(() => {
    if (!isCameraReady || countdown !== null) return;

    // Start 3s countdown
    let count = 3;
    setCountdown(count);
    if (state.isSoundEnabled) playBeep();

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        if (state.isSoundEnabled) playBeep();
      } else {
        clearInterval(timer);
        setCountdown(null);

        // Capture the frame
        const dataUrl = captureFrame(state.selectedFilter);
        if (dataUrl) {
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 200);
          if (state.isSoundEnabled) playShutter();

          setCapturedPhoto(dataUrl);
          setCaptured(true);
        }
      }
    }, 1000);
  }, [isCameraReady, countdown, state.isSoundEnabled, state.selectedFilter, playBeep, playShutter, captureFrame]);

  const handleConfirm = () => {
    if (capturedPhoto) {
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(2, 9),
        dataUrl: capturedPhoto,
        timestamp: Date.now(),
        filter: state.selectedFilter,
      };
      replacePhoto(photoIndex, newPhoto);
      stopCamera();
      router.push('/preview');
    }
  };

  const handleRetry = () => {
    setCaptured(false);
    setCapturedPhoto(null);
  };

  const handleCancel = () => {
    stopCamera();
    router.push('/preview');
  };

  const filterClass = {
    normal: '',
    warm: 'filter-warm',
    vintage: 'filter-vintage',
    bw: 'filter-bw',
    'soft-pink': 'filter-soft-pink',
  }[state.selectedFilter];

  return (
    <div className="min-h-dvh bg-black flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCancel}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm font-medium cursor-pointer border border-white/10"
        >
          ← Back
        </motion.button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span className="text-sm">📸</span>
          <span className="text-white/80 text-xs font-medium">Retake Photo {photoIndex + 1}</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Camera / Captured preview */}
      <div className="flex-1 relative overflow-hidden">
        {!captured ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'mirror' : ''} ${filterClass}`}
            />

            {/* Original photo comparison — small overlay */}
            {originalPhoto && (
              <div className="absolute top-16 right-4 z-20">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                  <img src={originalPhoto.dataUrl} alt="Original" className="w-full h-full object-cover opacity-80" />
                </div>
                <p className="text-white/50 text-[10px] text-center mt-1">Original</p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            {capturedPhoto && (
              <motion.img
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        <Countdown count={countdown} />
        <FlashEffect show={showFlash} />

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
            <div className="text-center p-8 glass-card max-w-xs mx-4">
              <p className="text-gray-800 text-lg mb-4">📷 {error}</p>
              <Button onClick={() => startCamera()} className="btn-gradient">
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative bg-gradient-to-t from-black via-black/95 to-black/70 safe-bottom">
        {!captured ? (
          <div className="flex items-center justify-center gap-8 py-5 px-6">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleCancel}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center cursor-pointer text-lg border border-white/10"
            >
              ✕
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCapture}
              disabled={!isCameraReady}
              className="relative w-24 h-24 rounded-full disabled:opacity-50 cursor-pointer group"
            >
              <div className="absolute inset-0 rounded-full border-[3px] border-amber-400/50 group-hover:border-amber-400/80 transition-colors" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-md"
              />
            </motion.button>

            <div className="w-14 h-14" /> {/* Spacer */}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 py-5 px-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="flex-1 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-medium cursor-pointer border border-white/10 text-center"
            >
              🔄 Retry
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold cursor-pointer shadow-lg shadow-emerald-500/30 text-center"
            >
              ✓ Use This
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
