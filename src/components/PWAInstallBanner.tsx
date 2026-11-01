import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ScamlyLogo } from './ScamlyLogo';
import { Language } from '../types';

interface PWAInstallBannerProps {
  lang: Language;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ lang }) => {
  const isNe = lang === 'ne';
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed or dismissed, do not display
  if (isInstalled || dismissed) {
    return null;
  }

  // Show if either installable (Android/Chromium) or iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0d1f33] via-[#091524] to-[#0f243a] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ScamlyLogo size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white">Scamly</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                PWA Mobile App
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {isNe
                ? 'मोबाइलमा सिधा इन्स्टल गर्नुहोस् — द्रुत गति र अफलाइन सुरक्षा।'
                : 'Install directly on your phone home screen for fast cyber defense.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isInstallable && (
            <button
              onClick={install}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>{isNe ? '📲 एप इन्स्टल गर्नुहोस्' : '📲 Install App'}</span>
            </button>
          )}

          {isIOS && !isInstallable && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>{isNe ? '📲 iPhone मा इन्स्टल' : '📲 Install on iOS'}</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            title={isNe ? 'हटाउनुहोस्' : 'Dismiss'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0c1524] border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <ScamlyLogo size="md" />
              <div>
                <h3 className="text-base font-black text-white">
                  {isNe ? 'Scamly लाई iPhone मा राख्नुहोस्' : 'Install Scamly on iPhone'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isNe ? 'Safari ब्राउजरबाट २ सेकेन्डमै' : 'Via Safari in 2 quick steps'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                  १
                </span>
                <p>
                  {isNe
                    ? 'तल रहेको Safari को Share बटन (📤) थिच्नुहोस्।'
                    : 'Tap the Share icon (📤) in the Safari toolbar.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                  २
                </span>
                <p>
                  {isNe
                    ? 'तल सारेर "Add to Home Screen" (+) छान्नुहोस्।'
                    : 'Scroll down and select "Add to Home Screen" (+).'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 transition-all"
            >
              {isNe ? 'बुझेँ (Done)' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
