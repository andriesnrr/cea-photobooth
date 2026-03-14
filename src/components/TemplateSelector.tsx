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
};

const templates: TemplateType[] = ['classic', 'polaroid', 'grid', 'floral'];

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
      {templates.map((template) => (
        <motion.button
          key={template}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(template)}
          className={`
            flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[80px]
            transition-all duration-200 cursor-pointer
            ${selected === template
              ? 'bg-gradient-to-b from-rose-100 to-peony-100 border-2 border-rose-300 shadow-lg shadow-rose-100'
              : 'glass hover:shadow-md'
            }
          `}
        >
          <span className="text-2xl">{TEMPLATE_PREVIEWS[template].icon}</span>
          <span className={`text-xs font-medium ${selected === template ? 'text-rose-600' : 'text-gray-500'}`}>
            {TEMPLATE_LABELS[template]}
          </span>
          <span className="text-[10px] text-gray-400">{TEMPLATE_PREVIEWS[template].desc}</span>
        </motion.button>
      ))}
    </div>
  );
}
