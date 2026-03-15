'use client';

import { motion } from 'framer-motion';
import { FRAME_COLORS } from '@/lib/types';

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
      {FRAME_COLORS.map((color) => (
        <motion.button
          key={color.value}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(color.value)}
          className={`
            flex-shrink-0 w-9 h-9 rounded-full border-2 cursor-pointer transition-all
            ${selected === color.value
              ? 'ring-2 ring-rose-400 ring-offset-2 border-rose-300 scale-110'
              : 'border-gray-200/60 hover:border-gray-300'
            }
          `}
          style={{ backgroundColor: color.value }}
          title={color.name}
        >
          {selected === color.value && (
            <span className={`text-xs ${['#1a1a2e', '#1e293b'].includes(color.value) ? 'text-white' : 'text-rose-500'}`}>✓</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
