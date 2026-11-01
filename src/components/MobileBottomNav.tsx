import React from 'react';
import {
  Home,
  Shield,
  Bot,
  LifeBuoy,
  User,
  Grid,
} from 'lucide-react';
import { PageView } from '../App';
import { Language, UserAccount } from '../types';

interface MobileBottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser: UserAccount | null;
  lang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  currentUser,
  lang,
}) => {
  const isNe = lang === 'ne';

  const isToolsActive = [
    'tools',
    'message',
    'link',
    'shopping',
    'photo',
    'voice',
    'complaint',
    'library',
  ].includes(currentPage);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090f1d]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-2 pt-1 pb-[calc(env(safe-area-inset-bottom,6px)+6px)] transition-all"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home Tab */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-90 ${
            currentPage === 'home'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 transition-transform" />
            {currentPage === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {isNe ? 'गृहपृष्ठ' : 'Home'}
          </span>
        </button>

        {/* 2. Tools Dedicated Directory (1-Click Open) */}
        <button
          onClick={() => onNavigate('tools')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-90 ${
            currentPage === 'tools' || isToolsActive
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Grid className="w-5 h-5 transition-transform" />
            {(currentPage === 'tools' || isToolsActive) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {isNe ? 'टुलहरू' : 'Tools'}
          </span>
        </button>

        {/* 3. AI Gemini Chat (Centerpiece Floating Action) */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center justify-center -mt-3 py-1 px-2 rounded-xl transition-all cursor-pointer select-none active:scale-90 group`}
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              currentPage === 'chat'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-tr from-[#132238] to-[#1e3456] border border-cyan-500/40 text-cyan-300 shadow-cyan-900/40'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-semibold ${
              currentPage === 'chat' ? 'text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            {isNe ? 'AI च्याट' : 'AI Chat'}
          </span>
        </button>

        {/* 4. Scam SOS Emergency Rescue */}
        <button
          onClick={() => onNavigate('rescue')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-90 ${
            currentPage === 'rescue'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-rose-300 font-medium'
          }`}
        >
          <div className="relative">
            <LifeBuoy className={`w-5 h-5 transition-transform ${currentPage === 'rescue' ? 'animate-pulse' : ''}`} />
            {currentPage === 'rescue' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            )}
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping opacity-75" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight text-rose-300 font-bold">
            {isNe ? '🆘 उद्धार' : 'SOS'}
          </span>
        </button>

        {/* 5. Citizen Account / Profile */}
        <button
          onClick={() => {
            if (currentUser) {
              onOpenAuth('signin');
            } else {
              onOpenAuth('signin');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-90 ${
            currentUser
              ? 'text-cyan-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            {currentUser ? (
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
            {currentUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0b1220]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight line-clamp-1 max-w-[50px]">
            {currentUser
              ? currentUser.name.split(' ')[0]
              : isNe ? 'खाता' : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
