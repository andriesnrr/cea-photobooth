'use client';

import { motion } from 'framer-motion';
import { FrameStyle, FRAME_STYLE_INFO } from '@/lib/types';

interface FrameStyleSelectorProps {
  selected: FrameStyle;
  onSelect: (style: FrameStyle) => void;
}

const styles: FrameStyle[] = ['clean', 'floral', 'hearts', 'pastel', 'filmstrip', 'kawaii', 'doodle', 'sparkle', 'sakura', 'confetti', 'retro', 'starry'];

export default function FrameStyleSelector({ selected, onSelect }: FrameStyleSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
      {styles.map((style) => {
        const info = FRAME_STYLE_INFO[style];
        return (
          <motion.button
            key={style}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(style)}
            className={`
              flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-2xl min-w-[64px]
              transition-all duration-200 cursor-pointer
              ${selected === style
                ? 'bg-gradient-to-b from-amber-100 to-orange-100 border-2 border-amber-300 shadow-lg shadow-amber-100'
                : 'glass hover:shadow-md border border-transparent'
              }
            `}
          >
            <span className="text-xl">{info.icon}</span>
            <span className={`text-[10px] font-medium leading-tight ${selected === style ? 'text-amber-700' : 'text-gray-500'}`}>
              {info.label}
            </span>
            <span className="text-[9px] text-gray-400 leading-tight">{info.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
