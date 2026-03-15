'use client';

import { motion } from 'framer-motion';
import { TemplateType, TEMPLATE_LABELS } from '@/lib/types';

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
}

const TEMPLATE_PREVIEWS: Record<TemplateType, { icon: string; desc: string }> = {
  classic: { icon: '📸', desc: '4 vertical' },
  polaroid: { icon: '🖼️', desc: '1 large' },
  grid: { icon: '⬜', desc: '2×2 grid' },
  floral: { icon: '🌸', desc: 'Decorated' },
  story: { icon: '📱', desc: '9:16 IG' },
  hearts: { icon: '💕', desc: 'Love theme' },
  pastel: { icon: '🦋', desc: 'Soft colors' },
  filmstrip: { icon: '🎬', desc: 'Retro film' },
  cute: { icon: '🐰', desc: 'Kawaii!' },
};

const templates: TemplateType[] = ['classic', 'polaroid', 'grid', 'floral', 'story', 'hearts', 'pastel', 'filmstrip', 'cute'];

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-2 pb-1">
      {templates.map((template) => (
        <motion.button
          key={template}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(template)}
          className={`
            flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-2xl min-w-[72px]
            transition-all duration-200 cursor-pointer
            ${selected === template
              ? 'bg-gradient-to-b from-rose-100 to-peony-100 border-2 border-rose-300 shadow-lg shadow-rose-100'
              : 'glass hover:shadow-md'
            }
          `}
        >
          <span className="text-xl">{TEMPLATE_PREVIEWS[template].icon}</span>
          <span className={`text-[10px] font-medium leading-tight ${selected === template ? 'text-rose-600' : 'text-gray-500'}`}>
            {TEMPLATE_LABELS[template]}
          </span>
          <span className="text-[9px] text-gray-400 leading-tight">{TEMPLATE_PREVIEWS[template].desc}</span>
        </motion.button>
      ))}
    </div>
  );
}
