'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamera } from '@/hooks/useCamera';
import { usePhotoCapture } from '@/hooks/usePhotoCapture';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/lib/store';
import Countdown from '@/components/Countdown';
import PoseGuide from '@/components/PoseGuide';
import FlashEffect from '@/components/FlashEffect';
import FilterSelector from '@/components/FilterSelector';
import Button from '@/components/ui/Button';
import { Photo } from '@/lib/types';

export default function PhotoboothPage() {
  const router = useRouter();
  const { state, addPhoto, setFilter } = useStore();
  const { playBeep, playShutter } = useSound();

  const {
    videoRef,
    isCameraReady,
    error,
    startCamera,
    stopCamera,
    flipCamera,
    captureFrame,
    currentFacingMode,
  } = useCamera();

  const onPhotoCapture = useCallback((photo: Photo) => {
    addPhoto(photo);
    if (state.isSoundEnabled) playShutter();
  }, [addPhoto, state.isSoundEnabled, playShutter]);

  const onSessionComplete = useCallback(() => {
    router.push('/preview');
  }, [router]);

  const {
    isCapturing,
    currentPhotoIndex,
    countdown,
    showFlash,
    frozenFrame,
    currentPose,
    totalPhotos,
    startSession,
    cancelSession,
  } = usePhotoCapture({
    captureFrame,
    filter: state.selectedFilter,
    onPhotoCapture,
    onSessionComplete,
  });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (countdown !== null && state.isSoundEnabled) {
      playBeep();
    }
  }, [countdown, state.isSoundEnabled, playBeep]);

  const filterClass = {
    normal: '',
    warm: 'filter-warm',
    vintage: 'filter-vintage',
    bw: 'filter-bw',
    'soft-pink': 'filter-soft-pink',
  }[state.selectedFilter];

  return (
    <div className="min-h-dvh bg-black flex flex-col landscape:flex-row relative overflow-hidden">
      {/* Camera viewport */}
      <div className="flex-1 relative overflow-hidden">
        {/* Decorative frame border */}
        <div className="absolute inset-0 z-20 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)',
            borderRadius: '0',
          }}
        />

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'mirror' : ''} ${filterClass}`}
        />

        {/* Frozen frame overlay */}
        <AnimatePresence>
          {frozenFrame && (
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <img src={frozenFrame} alt="Captured" className="w-full h-full object-cover" />
              {/* Capture indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-24 h-24 rounded-full border-4 border-white/40 flex items-center justify-center">
                  <span className="text-white text-5xl">✓</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo counter — premium pill */}
        {isCapturing && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 right-4 z-30"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              <div className="flex gap-1.5">
                {Array.from({ length: totalPhotos }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < currentPhotoIndex ? 'bg-rose-400 scale-110' :
                      i === currentPhotoIndex ? 'bg-white animate-pulse' :
                      'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/80 text-xs font-medium ml-1">
                {currentPhotoIndex + 1}/{totalPhotos}
              </span>
            </div>
          </motion.div>
        )}

        {/* Top left — floral badge */}
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <span className="text-sm">🌻</span>
            <span className="text-white/70 text-xs font-medium">Cea Booth</span>
          </div>
        </div>

        <PoseGuide pose={currentPose} photoIndex={currentPhotoIndex} totalPhotos={totalPhotos} />
        <Countdown count={countdown} />
        <FlashEffect show={showFlash} />

        {/* Camera error */}
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

      {/* Bottom controls — becomes side panel in landscape */}
      <div className="relative bg-gradient-to-t from-black via-black/95 to-black/70 safe-bottom landscape:bg-gradient-to-l landscape:from-black landscape:via-black/95 landscape:to-black/70 landscape:w-28 landscape:flex landscape:flex-col landscape:justify-center landscape:items-center landscape:py-6">
        {/* Filter selector */}
        <AnimatePresence>
          {!isCapturing && isCameraReady && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="py-3 landscape:py-2 landscape:hidden"
            >
              <FilterSelector selected={state.selectedFilter} onSelect={setFilter} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-8 landscape:gap-5 py-5 landscape:py-0 px-6 landscape:px-0 landscape:flex-col">
          {/* Back / Cancel */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              if (isCapturing) {
                cancelSession();
              } else {
                stopCamera();
                router.push('/');
              }
            }}
            className="w-14 h-14 landscape:w-12 landscape:h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center cursor-pointer text-lg border border-white/10 hover:bg-white/20 transition-colors"
          >
            {isCapturing ? '✕' : '←'}
          </motion.button>

          {/* Main capture button */}
          {!isCapturing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={startSession}
              disabled={!isCameraReady}
              className="relative w-24 h-24 landscape:w-20 landscape:h-20 rounded-full disabled:opacity-50 cursor-pointer group"
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-white/40 group-hover:border-white/60 transition-colors" />
              {/* Inner gradient */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-amber-400 shadow-lg shadow-rose-500/30 flex items-center justify-center">
                <span className="text-3xl landscape:text-2xl">📸</span>
              </div>
              {/* Glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-rose-400/20 blur-md"
              />
            </motion.button>
          ) : (
            <div className="relative w-24 h-24 landscape:w-20 landscape:h-20 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500/20 blur-md"
              />
              <div className="w-20 h-20 landscape:w-16 landscape:h-16 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center border-2 border-red-400/50">
                <div className="w-4 h-4 rounded-sm bg-white animate-pulse" />
              </div>
            </div>
          )}

          {/* Flip camera */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={flipCamera}
            disabled={isCapturing}
            className="w-14 h-14 landscape:w-12 landscape:h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center cursor-pointer text-lg border border-white/10 disabled:opacity-50 hover:bg-white/20 transition-colors"
          >
            🔄
          </motion.button>
        </div>
      </div>
    </div>
  );
}
