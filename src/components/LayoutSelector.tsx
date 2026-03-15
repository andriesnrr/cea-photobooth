'use client';

import { motion } from 'framer-motion';
import { LayoutType, LAYOUT_INFO } from '@/lib/types';

interface LayoutSelectorProps {
  selected: LayoutType;
  onSelect: (layout: LayoutType) => void;
}

const layouts: LayoutType[] = ['strip-4', 'strip-3', 'strip-2', 'grid-2x2', 'grid-3x2', 'story', 'polaroid', 'wide', 'tall-2'];

export default function LayoutSelector({ selected, onSelect }: LayoutSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
      {layouts.map((layout) => {
        const info = LAYOUT_INFO[layout];
        return (
          <motion.button
            key={layout}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(layout)}
            className={`
              flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-2xl min-w-[68px]
              transition-all duration-200 cursor-pointer
              ${selected === layout
                ? 'bg-gradient-to-b from-rose-100 to-pink-100 border-2 border-rose-300 shadow-lg shadow-rose-100'
                : 'glass hover:shadow-md border border-transparent'
              }
            `}
          >
            <span className="text-xl">{info.icon}</span>
            <span className={`text-[10px] font-medium leading-tight ${selected === layout ? 'text-rose-600' : 'text-gray-500'}`}>
              {info.label}
            </span>
            <span className="text-[9px] text-gray-400 leading-tight">{info.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
