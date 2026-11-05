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
  }> = [
    { id: 'tools', titleNe: 'सबै टुलहरू', titleEn: 'All Tools' },
    { id: 'message', titleNe: 'मेसेज जाँच', titleEn: 'SMS & Chat' },
    { id: 'link', titleNe: 'लिंक जाँच', titleEn: 'Link & URL' },
    { id: 'shopping', titleNe: 'सपिङ अफर', titleEn: 'Shopping' },
    { id: 'photo', titleNe: 'फोटो जाँच', titleEn: 'Photo OCR' },
    { id: 'voice', titleNe: 'बोलेर जाँच', titleEn: 'Voice AI' },
    { id: 'chat', titleNe: 'AI सल्लाहकार', titleEn: 'AI Advisor' },
    { id: 'rescue', titleNe: 'ठगी उद्धार (SOS)', titleEn: 'Rescue SOS' },
    { id: 'complaint', titleNe: 'प्रहरी उजुरी', titleEn: 'Petition' },
    { id: 'library', titleNe: 'ज्ञान केन्द्र', titleEn: 'Directory' },
    { id: 'video', titleNe: 'सचेतना भिडियो', titleEn: 'Awareness Videos' },
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
              className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm font-bold ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`font-bold ${isActive ? 'text-slate-950' : 'text-slate-950 dark:text-white'}`}>
                {isNe ? item.titleNe : item.titleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
