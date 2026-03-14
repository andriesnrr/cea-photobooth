'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FilterType, FILTER_OPTIONS } from '@/lib/types';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  // Helper to wait for videoRef to be available
  const waitForVideoRef = useCallback((): Promise<HTMLVideoElement> => {
    return new Promise((resolve) => {
      const check = () => {
        if (videoRef.current) {
          resolve(videoRef.current);
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }, []);

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = currentFacingMode) => {
    try {
      setError(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // Wait for videoRef to be available (React may not have mounted the <video> element yet)
      const video = await waitForVideoRef();
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      await video.play();
      setIsCameraReady(true);
      setCurrentFacingMode(facingMode);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access denied';
      setError(message);
      setIsCameraReady(false);
    }
  }, [currentFacingMode, waitForVideoRef]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  const flipCamera = useCallback(async () => {
    const newMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await startCamera(newMode);
  }, [currentFacingMode, startCamera]);

  const captureFrame = useCallback((filter: FilterType = 'normal'): string | null => {
    const video = videoRef.current;
    if (!video || !isCameraReady) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Mirror correction for front camera
    if (currentFacingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Apply filter
    const filterOption = FILTER_OPTIONS.find(f => f.type === filter);
    if (filterOption && filterOption.style !== 'none') {
      ctx.filter = filterOption.style;
    }

    ctx.drawImage(video, 0, 0);

    // Resize to target resolution (1200px width)
    const targetWidth = 1200;
    const scale = targetWidth / canvas.width;
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = canvas.height * scale;
    const resizedCtx = resizedCanvas.getContext('2d');
    if (!resizedCtx) return canvas.toDataURL('image/jpeg', 0.9);

    resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
    return resizedCanvas.toDataURL('image/jpeg', 0.9);
  }, [isCameraReady, currentFacingMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    isCameraReady,
    currentFacingMode,
    error,
    startCamera,
    stopCamera,
    flipCamera,
    captureFrame,
  };
}
