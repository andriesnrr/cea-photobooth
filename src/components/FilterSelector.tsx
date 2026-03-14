'use client';

import { FilterType, FILTER_OPTIONS } from '@/lib/types';
import { motion } from 'framer-motion';

interface FilterSelectorProps {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

export default function FilterSelector({ selected, onSelect }: FilterSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
      {FILTER_OPTIONS.map((filter) => (
        <motion.button
          key={filter.type}
          whileTap={{ scale: 0.92 }}
          onClick={() => onSelect(filter.type)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${selected === filter.type
              ? 'bg-gradient-to-r from-rose-400 to-peony-400 text-white shadow-lg shadow-rose-200/50'
              : 'glass text-gray-600 hover:text-rose-500'
            }
          `}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}
