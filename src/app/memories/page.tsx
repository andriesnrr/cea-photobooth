'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMemories, deleteMemory } from '@/lib/download';
import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import FlowerBackground from '@/components/FlowerBackground';

interface Memory {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    setMemories(getMemories());
  }, []);

  const handleDelete = (id: string) => {
    deleteMemory(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) setSelectedMemory(null);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <PageTransition>
      <FlowerBackground />
      <div className="min-h-dvh flex flex-col safe-area relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-rose-500 text-sm font-medium cursor-pointer"
          >
            ← Home
          </motion.button>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📸</span> Memories
          </h2>
          <div className="w-20" />
        </div>

        {/* Gallery */}
        {memories.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-10 max-w-xs mx-auto"
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-5"
              >
                📷
              </motion.div>
              <p className="text-gray-500 mb-2 font-medium">No memories yet!</p>
              <p className="text-gray-400 text-sm mb-6">Take some photos and they&apos;ll appear here</p>
              <Button onClick={() => router.push('/setup')} className="btn-gradient !rounded-2xl" icon="🌻">
                Start Photobooth
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                  className="relative group"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedMemory(memory)}
                    className="w-full rounded-2xl overflow-hidden shadow-lg shadow-rose-100/30 ring-1 ring-white/50 cursor-pointer"
                  >
                    <img src={memory.dataUrl} alt={`Memory ${index + 1}`} className="w-full" />
                  </motion.button>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-[10px] text-white bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 font-medium">
                      {formatDate(memory.timestamp)}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(memory.id);
                      }}
                      className="w-7 h-7 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                    >
                      ×
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <img src={selectedMemory.dataUrl} alt="Memory" className="w-full" />
                </div>
                <div className="flex gap-3 mt-5 justify-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedMemory.dataUrl;
                      a.download = 'cea-photobooth.png';
                      a.click();
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-sm font-medium text-white cursor-pointer border border-white/10 hover:bg-white/20 transition-all"
                  >
                    📥 Download
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMemory(null)}
                    className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-sm font-medium text-white cursor-pointer border border-white/10 hover:bg-white/20 transition-all"
                  >
                    ✕ Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
