import React from 'react';
import {
  MessageSquare,
  Link as LinkIcon,
  ShoppingBag,
  Camera,
  Mic,
  LifeBuoy,
  FileText,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { t } from '../translations';
import { Language } from '../types';

export type TabType =
  | 'message'
  | 'link'
  | 'shopping'
  | 'photo'
  | 'voice'
  | 'rescue'
  | 'complaint'
  | 'library'
  | 'privacy';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab, lang }) => {
  const currentT = t[lang];

  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'message', label: currentT.navMessage, icon: MessageSquare },
    { id: 'link', label: currentT.navLink, icon: LinkIcon },
    { id: 'shopping', label: currentT.navShopping, icon: ShoppingBag },
    { id: 'photo', label: currentT.navPhoto, icon: Camera },
    { id: 'voice', label: currentT.navVoice, icon: Mic },
    { id: 'rescue', label: currentT.navRescue, icon: LifeBuoy },
    { id: 'complaint', label: currentT.navComplaint, icon: FileText },
    { id: 'library', label: currentT.navLibrary, icon: BookOpen },
    { id: 'privacy', label: currentT.navPrivacy, icon: ShieldCheck },
  ];

  return (
    <nav className="bg-white dark:bg-[#0e172a] border-b border-slate-200 dark:border-slate-800 px-4 py-2 sticky top-[57px] z-30 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRescue = item.id === 'rescue';

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isRescue
                    ? 'bg-rose-600 text-white border border-rose-500 shadow-sm'
                    : 'bg-cyan-500 text-slate-950 border border-cyan-400 shadow-sm font-black'
                  : isRescue
                  ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  : 'text-slate-800 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (isRescue ? 'text-white' : 'text-slate-950') : (isRescue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400')}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
