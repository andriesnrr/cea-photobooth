'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import FlowerBackground from '@/components/FlowerBackground';

export default function SetupPage() {
  const router = useRouter();
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        if (result.state === 'granted') {
          setPermissionState('granted');
          // Auto-navigate when permission already granted
          setTimeout(() => router.push('/photobooth'), 800);
        }
      }).catch(() => {});
    }
  }, [router]);

  const requestPermission = async () => {
    setPermissionState('requesting');
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
      });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionState('granted');
      setTimeout(() => router.push('/photobooth'), 800);
    } catch (err) {
      setPermissionState('denied');
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please enable camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      }
    }
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area relative z-10 px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="glass-card p-10 text-center relative overflow-hidden">
            {/* Decorative corner flowers */}
            <div className="absolute -top-3 -left-3 text-3xl opacity-30 rotate-12">🌸</div>
            <div className="absolute -top-2 -right-3 text-2xl opacity-25 -rotate-12">🌷</div>
            <div className="absolute -bottom-2 -left-2 text-2xl opacity-20 rotate-45">✨</div>
            <div className="absolute -bottom-3 -right-3 text-3xl opacity-25 -rotate-45">🌻</div>

            {/* Glow behind camera icon */}
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.15, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(244,63,94,0.2), transparent 70%)',
                  transform: 'scale(2.5)',
                }}
              />
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl relative"
              >
                📷
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Camera Access</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              We need your camera to take photos.<br />
              Your photos stay on your device only! 🔒
            </p>

            {/* Error state */}
            {permissionState === 'denied' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-200/50 text-red-500 text-sm leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            {/* Permission state UI */}
            {permissionState === 'granted' ? (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/50">
                  <span className="text-white text-3xl">✓</span>
                </div>
                <p className="text-emerald-600 font-semibold text-lg">Camera ready!</p>
                <p className="text-gray-400 text-xs mt-1">Redirecting to photobooth...</p>
              </motion.div>
            ) : (
              <Button
                onClick={requestPermission}
                isLoading={permissionState === 'requesting'}
                size="lg"
                className="w-full btn-gradient !rounded-2xl !py-4"
                icon="🌟"
              >
                {permissionState === 'denied' ? 'Try Again' : 'Enable Camera'}
              </Button>
            )}
          </div>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push('/')}
            className="mt-6 text-sm text-gray-400 hover:text-rose-400 transition-all w-full text-center cursor-pointer hover:tracking-wider"
          >
            ← Back to home
          </motion.button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
