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
    <nav className="bg-[#0e172a] border-b border-slate-800 px-4 py-2 sticky top-[57px] z-30 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRescue = item.id === 'rescue';

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isRescue
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : isRescue
                  ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (isRescue ? 'text-rose-400' : 'text-cyan-400') : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
