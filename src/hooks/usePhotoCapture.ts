'use client';

import { useState, useCallback, useRef } from 'react';
import { Photo, FilterType, POSE_SUGGESTIONS } from '@/lib/types';

interface UseCaptureOptions {
  totalPhotos?: number;
  countdownFrom?: number;
  delayBetween?: number;
  onPhotoCapture?: (photo: Photo) => void;
  onSessionComplete?: (photos: Photo[]) => void;
  captureFrame: (filter: FilterType) => string | null;
  filter: FilterType;
}

export function usePhotoCapture({
  totalPhotos = 4,
  countdownFrom = 3,
  delayBetween = 1000,
  onPhotoCapture,
  onSessionComplete,
  captureFrame,
  filter,
}: UseCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [frozenFrame, setFrozenFrame] = useState<string | null>(null);
  const [currentPose, setCurrentPose] = useState<string>('');
  const capturedPhotos = useRef<Photo[]>([]);
  const isRunning = useRef(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runCountdown = useCallback(async (from: number): Promise<void> => {
    for (let i = from; i > 0; i--) {
      if (!isRunning.current) return;
      setCountdown(i);
      await sleep(1000);
    }
    setCountdown(null);
  }, []);

  const captureOnePhoto = useCallback(async (index: number): Promise<Photo | null> => {
    const dataUrl = captureFrame(filter);
    if (!dataUrl) return null;

    // Flash
    setShowFlash(true);
    await sleep(150);
    setShowFlash(false);

    // Freeze frame
    setFrozenFrame(dataUrl);
    await sleep(500);
    setFrozenFrame(null);

    const photo: Photo = {
      id: `photo-${Date.now()}-${index}`,
      dataUrl,
      timestamp: Date.now(),
      filter,
    };

    return photo;
  }, [captureFrame, filter]);

  const startSession = useCallback(async () => {
    if (isRunning.current) return;
    isRunning.current = true;
    setIsCapturing(true);
    capturedPhotos.current = [];

    for (let i = 0; i < totalPhotos; i++) {
      if (!isRunning.current) break;

      setCurrentPhotoIndex(i);
      setCurrentPose(POSE_SUGGESTIONS[i] || '');

      await runCountdown(countdownFrom);
      if (!isRunning.current) break;

      const photo = await captureOnePhoto(i);
      if (photo) {
        capturedPhotos.current.push(photo);
        onPhotoCapture?.(photo);
      }

      if (i < totalPhotos - 1) {
        await sleep(delayBetween);
      }
    }

    isRunning.current = false;
    setIsCapturing(false);
    setCurrentPhotoIndex(0);
    setCountdown(null);
    setCurrentPose('');

    if (capturedPhotos.current.length > 0) {
      onSessionComplete?.(capturedPhotos.current);
    }
  }, [totalPhotos, countdownFrom, delayBetween, onPhotoCapture, onSessionComplete, runCountdown, captureOnePhoto]);

  const cancelSession = useCallback(() => {
    isRunning.current = false;
    setIsCapturing(false);
    setCountdown(null);
    setShowFlash(false);
    setFrozenFrame(null);
    setCurrentPhotoIndex(0);
    setCurrentPose('');
  }, []);

  return {
    isCapturing,
    currentPhotoIndex,
    countdown,
    showFlash,
    frozenFrame,
    currentPose,
    totalPhotos,
    startSession,
    cancelSession,
  };
}
