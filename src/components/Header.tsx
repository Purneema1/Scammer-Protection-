import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  PhoneCall,
  Globe,
  AlertOctagon,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Lock,
} from 'lucide-react';
import { t } from '../translations';
import { Language, UserAccount } from '../types';
import { toNepaliDigits } from '../utils/numberFormat';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenEmergency: () => void;
  onNavigateHome?: () => void;
  onNavigateAdmin?: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenEmergency,
  onNavigateHome,
  onNavigateAdmin,
  onOpenAuth,
  currentUser,
  onLogout,
  currentPage,
}) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0b1220]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
          title={isNe ? 'गृहपृष्ठमा जानुहोस्' : 'Go to Homepage'}
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1627] rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0b1220] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1 group-hover:text-cyan-200 transition-colors">
                Scam Protection <span className="text-cyan-400 font-extrabold">AI</span>
              </h1>
              <span className="hidden md:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300">
                {currentT.badge}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 hidden sm:block">
              {currentT.appSubtitle}
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            title={isNe ? 'ठगीमा परिसकेपछि आपतकालीन उद्धार' : 'Emergency Scam Assistance'}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">{isNe ? 'ठगी उद्धार' : 'Scam Rescue'}</span>
            <span className="sm:hidden font-bold">SOS</span>
          </button>

          {/* Quick Helpline Hotline with bilingual digits */}
          <a
            href="tel:014211304"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors font-mono"
            title="नेपाल प्रहरी साइबर ब्युरो हटलाइन (०१-४२११३०४)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isNe ? '०१-४२११३०४' : '01-4211304'}</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            aria-label="Toggle Language"
            title={isNe ? 'Switch to English' : 'नेपाली भाषामा बदल्नुहोस्'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentT.switchLang}</span>
          </button>

          {/* Admin Control Button - ONLY VISIBLE IF LOGGED IN USER IS AN ADMIN */}
          {currentUser?.role === 'admin' && onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
                currentPage === 'admin'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-700/60'
              }`}
              title={isNe ? 'व्यवस्थापक नियन्त्रण कक्ष' : 'Admin Control Panel'}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{isNe ? 'एडमिन' : 'Admin'}</span>
            </button>
          )}

          {/* User Authentication Profile Button */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block max-w-[100px] truncate">
                  <span className="text-xs font-bold text-white block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-cyan-300 block">
                    {currentUser.role === 'admin'
                      ? isNe ? 'व्यवस्थापक' : 'Admin'
                      : isNe ? 'नागरिक खाता' : 'Citizen'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-cyan-800/80 rounded-2xl shadow-2xl p-3 text-xs space-y-3 z-50 animate-fadeIn">
                  <div className="pb-2.5 border-b border-slate-800">
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    {currentUser.phone && (
                      <p className="text-slate-400 text-[11px]">{currentUser.phone}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded-lg border border-cyan-800/50">
                      <span>{isNe ? 'कुल सुरक्षा जाँच:' : 'Total Checks Run:'}</span>
                      <span className="font-bold font-mono">
                        {isNe ? toNepaliDigits(currentUser.totalChecks || 0) : (currentUser.totalChecks || 0)}
                      </span>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && onNavigateAdmin && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigateAdmin();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isNe ? 'व्यवस्थापक पोर्टल खोल्नुहोस्' : 'Open Admin Portal'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isNe ? 'लगआउट (Log Out)' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 transition-all cursor-pointer active:scale-95 shrink-0"
              title={isNe ? 'साइन इन वा नयाँ खाता खोल्नुहोस्' : 'Sign in or create account'}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isNe ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
