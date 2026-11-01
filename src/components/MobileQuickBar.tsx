import React from 'react';
import { PageView } from '../App';
import { Language } from '../types';

interface MobileQuickBarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  lang: Language;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  currentPage,
  onNavigate,
  lang,
}) => {
  const isNe = lang === 'ne';

  const quickItems: Array<{
    id: PageView;
    titleNe: string;
    titleEn: string;
    color: string;
    activeBorder: string;
  }> = [
    {
      id: 'tools',
      titleNe: 'सबै टुलहरू',
      titleEn: 'All Tools',
      color: 'from-cyan-600/30 to-teal-900/40 text-cyan-300 border-cyan-500/40',
      activeBorder: 'border-cyan-400 bg-cyan-950/80 text-white font-bold',
    },
    {
      id: 'message',
      titleNe: 'मेसेज जाँच',
      titleEn: 'SMS & Chat',
      color: 'from-blue-600/30 to-blue-900/40 text-blue-300 border-blue-500/40',
      activeBorder: 'border-blue-400 bg-blue-950/80 text-white font-bold',
    },
    {
      id: 'link',
      titleNe: 'लिंक जाँच',
      titleEn: 'Link & URL',
      color: 'from-teal-600/30 to-teal-900/40 text-teal-300 border-teal-500/40',
      activeBorder: 'border-teal-400 bg-teal-950/80 text-white font-bold',
    },
    {
      id: 'shopping',
      titleNe: 'सपिङ अफर',
      titleEn: 'Shopping',
      color: 'from-cyan-600/30 to-cyan-900/40 text-cyan-300 border-cyan-500/40',
      activeBorder: 'border-cyan-400 bg-cyan-950/80 text-white font-bold',
    },
    {
      id: 'photo',
      titleNe: 'फोटो जाँच',
      titleEn: 'Photo OCR',
      color: 'from-sky-600/30 to-sky-900/40 text-sky-300 border-sky-500/40',
      activeBorder: 'border-sky-400 bg-sky-950/80 text-white font-bold',
    },
    {
      id: 'voice',
      titleNe: 'बोलेर जाँच',
      titleEn: 'Voice AI',
      color: 'from-amber-600/30 to-amber-900/40 text-amber-300 border-amber-500/40',
      activeBorder: 'border-amber-400 bg-amber-950/80 text-white font-bold',
    },
    {
      id: 'chat',
      titleNe: 'AI सल्लाहकार',
      titleEn: 'AI Advisor',
      color: 'from-emerald-600/30 to-emerald-900/40 text-emerald-300 border-emerald-500/40',
      activeBorder: 'border-emerald-400 bg-emerald-950/80 text-white font-bold',
    },
    {
      id: 'rescue',
      titleNe: 'ठगी उद्धार (SOS)',
      titleEn: 'Rescue SOS',
      color: 'from-rose-600/40 to-rose-950/60 text-rose-300 border-rose-500/50',
      activeBorder: 'border-rose-400 bg-rose-950 text-white font-bold',
    },
    {
      id: 'complaint',
      titleNe: 'प्रहरी उजुरी',
      titleEn: 'Petition',
      color: 'from-indigo-600/30 to-indigo-900/40 text-indigo-300 border-indigo-500/40',
      activeBorder: 'border-indigo-400 bg-indigo-950/80 text-white font-bold',
    },
    {
      id: 'library',
      titleNe: 'ज्ञान केन्द्र',
      titleEn: 'Directory',
      color: 'from-purple-600/30 to-purple-900/40 text-purple-300 border-purple-500/40',
      activeBorder: 'border-purple-400 bg-purple-950/80 text-white font-bold',
    },
    {
      id: 'video',
      titleNe: 'सचेतना भिडियो',
      titleEn: 'Awareness Videos',
      color: 'from-red-600/30 to-red-900/40 text-red-300 border-red-500/40',
      activeBorder: 'border-red-400 bg-red-950/80 text-white font-bold',
    },
  ];

  return (
    <div className="md:hidden py-1">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 py-1 -mx-1">
        {quickItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm ${
                isActive
                  ? item.activeBorder
                  : `bg-slate-900/90 hover:bg-slate-800 ${item.color}`
              }`}
            >
              <span className="font-semibold">
                {isNe ? item.titleNe : item.titleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
