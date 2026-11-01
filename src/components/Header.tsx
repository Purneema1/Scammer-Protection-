import React, { useState, useRef, useEffect } from 'react';
import { Language, UserAccount } from '../types';
import { ScamlyLogo } from './ScamlyLogo';

interface HeaderProps {
  lang?: Language;
  onToggleLang?: () => void;
  onOpenEmergency?: () => void;
  onNavigateHome?: () => void;
  onNavigateAdmin?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang = 'ne',
  onToggleLang,
  onNavigateHome,
  onNavigateAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const isNe = lang === 'ne';
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0b1220]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side: Only Logo - No app name or description */}
        <button
          onClick={onNavigateHome}
          className="flex items-center justify-center group cursor-pointer focus:outline-none p-1"
          title="Scamly - गृहपृष्ठ (Home)"
          aria-label="Scamly Home"
        >
          <ScamlyLogo size="header" />
        </button>

        {/* Right Side: English / Nepali language switcher and User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Language Switcher (नेपाली / English) */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 transition-all active:scale-95 cursor-pointer shadow-sm select-none"
            title={isNe ? 'Switch language to English' : 'नेपाली भाषामा बदल्नुहोस्'}
            aria-label="Switch Language"
          >
            <span className={isNe ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}>
              नेपाली
            </span>
            <span className="text-slate-600 text-[10px]">/</span>
            <span className={!isNe ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}>
              EN
            </span>
          </button>

          {/* 2. User Button (Profile if logged in / Sign in if not) */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-xs font-bold text-slate-200 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-black text-[11px] flex items-center justify-center">
                  {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[75px] sm:max-w-[120px] truncate text-cyan-300 font-bold">
                  {currentUser.name ? currentUser.name.split(' ')[0] : (isNe ? 'प्रयोगकर्ता' : 'User')}
                </span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0e1628] border border-slate-700 shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {currentUser.phone || currentUser.email}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {currentUser.role === 'admin'
                        ? isNe
                          ? 'व्यवस्थापक'
                          : 'Admin'
                        : isNe
                        ? 'नागरिक खाता'
                        : 'Citizen Account'}
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onNavigateAdmin) onNavigateAdmin();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{isNe ? 'व्यवस्थापक (Admin)' : 'Admin Portal'}</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{isNe ? 'लगआउट (Sign Out)' : 'Sign Out'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              title={isNe ? 'साइन इन गर्नुहोस्' : 'Sign In'}
            >
              <span>{isNe ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
