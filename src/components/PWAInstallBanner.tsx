import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ScamlyLogo } from './ScamlyLogo';
import { Language } from '../types';

interface PWAInstallBannerProps {
  lang: Language;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ lang }) => {
  const isNe = lang === 'ne';
  const { isInstallable, isInstalled, isIOS, isIframe, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>(() => {
    if (isIOS) return 'ios';
    if (/android/i.test(navigator.userAgent)) return 'android';
    return 'android';
  });
  const [dismissed, setDismissed] = useState(() => {
    try {
      return (
        localStorage.getItem('pwa_dismissed') === 'true' ||
        localStorage.getItem('pwa_installed') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(false);

  // If already running as installed standalone PWA, dismissed once, or in preview iframe, never show
  if (isInstalled || dismissed || isIframe) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('pwa_dismissed', 'true');
    } catch {}
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenDirect = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <>
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0d1f33] via-[#091524] to-[#0f243a] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ScamlyLogo size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white">Scamly</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                PWA Mobile App
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isNe
                ? 'मोबाइलमा सिधा इन्स्टल गर्नुहोस् — द्रुत गति र अफलाइन सुरक्षा।'
                : 'Install directly on your phone home screen for instant cyber defense.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {isInstallable ? (
            <button
              onClick={install}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>{isNe ? '📲 एप इन्स्टल गर्नुहोस्' : '📲 Install App'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>{isNe ? '📲 इन्स्टल गर्ने तरिका' : '📲 How to Install'}</span>
            </button>
          )}

          <button
            onClick={() => setShowGuideModal(true)}
            className="px-2.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700 transition-colors"
            title={isNe ? 'निर्देशिका हेर्नुहोस्' : 'View Guide'}
          >
            ℹ️ {isNe ? 'सहयोग' : 'Help'}
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            title={isNe ? 'हटाउनुहोस्' : 'Dismiss'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Complete PWA Installation Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c1524] border border-cyan-500/50 p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <ScamlyLogo size="md" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isNe ? 'Scamly PWA इन्स्टल गर्ने तरिका' : 'How to Install Scamly PWA'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isNe
                      ? 'प्ले स्टोर वा एप स्टोर बिना नै सिधै मोबाइलमा'
                      : 'Install directly without App Store / Play Store'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Device Tabs */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🤖 Android (Chrome)
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🍎 iPhone (Safari)
              </button>
              <button
                onClick={() => setActiveTab('pc')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'pc'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💻 PC / Laptop
              </button>
            </div>

            {/* Tab 1: Android Instructions */}
            {activeTab === 'android' && (
              <div className="space-y-3 animate-fadeIn text-xs text-slate-200">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      १
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? 'Google Chrome मा Scamly खोल्नुहोस्'
                          : 'Open Scamly in Google Chrome'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'यदि एप प्रिभ्यु फ्रेममा छ भने सिधा Chrome मा खोल्नुहोस्।'
                          : 'Ensure you are browsing in Chrome directly.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      २
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? 'दायाँ माथिल्लो कुनाको ३ वटा थोप्ला (⋮) थिच्नुहोस्'
                          : 'Tap the three dots (⋮) menu in top-right'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'वा स्क्रिनमा देखिने "एप इन्स्टल गर्नुहोस्" बटन दबाउनुहोस्।'
                          : 'Or click the "Install App" banner button if visible.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      ३
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? '"Install app" वा "Add to Home screen" छान्नुहोस्'
                          : 'Select "Install app" or "Add to Home screen"'}
                      </p>
                      <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">
                        {isNe
                          ? '✓ केही सेकेन्डमै मोबाइलको होम स्क्रिनमा Scamly एप बस्नेछ!'
                          : '✓ Scamly will appear on your mobile home screen like a native app!'}
                      </p>
                    </div>
                  </div>
                </div>

                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setShowGuideModal(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    🚀 {isNe ? 'अहिले नै इन्स्टल सुरु गर्नुहोस्' : 'Trigger Install Prompt Now'}
                  </button>
                )}
              </div>
            )}

            {/* Tab 2: iOS Safari Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3 animate-fadeIn text-xs text-slate-200">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      १
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? 'Apple Safari ब्राउजरमा लिंक खोल्नुहोस्'
                          : 'Open the link in Apple Safari'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'नोट: iOS मा PWA इन्स्टल गर्न Safari ब्राउजर अनिवार्य छ।'
                          : 'Note: iOS requires Apple Safari browser to install PWAs.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      २
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? 'तलको सेयर बटन (Share 📤) थिच्नुहोस्'
                          : 'Tap the Share icon (📤) in Safari toolbar'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'स्क्रिनको तल्लो भागमा बीचमा रहेको बाकस र तीर भएको चिन्ह।'
                          : 'Located at the bottom center of the Safari window.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      ३
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? '"Add to Home Screen" (+) मा थिच्नुहोस्'
                          : 'Tap "Add to Home Screen" (+)'}
                      </p>
                      <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">
                        {isNe
                          ? '✓ दायाँ माथिको "Add" थिचेपछि iPhone मा Scamly एप तयार हुन्छ!'
                          : '✓ Tap "Add" at top right to pin Scamly to your iPhone!'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: PC / Desktop Instructions */}
            {activeTab === 'pc' && (
              <div className="space-y-3 animate-fadeIn text-xs text-slate-200">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      १
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? 'Chrome वा Edge को Address Bar (URL बाकस) हेर्नुहोस्'
                          : 'Check Address Bar in Chrome / Edge / Brave'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'दायाँ छेउमा इन्स्टल चिन्ह (⊕ वा 💻 चिन्ह) देखिनेछ।'
                          : 'Look for the install icon (⊕ or computer icon) on the right side of the URL bar.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      २
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe
                          ? '"Install Scamly" बटन थिच्नुहोस्'
                          : 'Click "Install Scamly"'}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {isNe
                          ? 'वा ३ वटा थोप्ला (⋮) > "Save and share" > "Install Scamly"'
                          : 'Or Chrome menu (⋮) > "Save and share" > "Install Scamly"'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs shrink-0">
                      ३
                    </span>
                    <div>
                      <p className="font-bold text-white">
                        {isNe ? 'कम्प्युटरमा छुट्टै विन्डोमा चल्नेछ' : 'Launches as a Desktop App'}
                      </p>
                      <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">
                        {isNe
                          ? '✓ Desktop Icon र Start Menu मा Scamly एप सुरक्षित रहनेछ।'
                          : '✓ App icon added to Desktop & Start Menu.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Open & Link Share Utilities */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">
                  {isNe ? '🔗 एपको लिंक कपी गर्नुहोस्' : '🔗 Copy App Link to Phone'}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 cursor-pointer active:scale-95 transition-all text-[11px]"
                >
                  {copied
                    ? isNe
                      ? '✓ कपी भयो!'
                      : '✓ Copied!'
                    : isNe
                    ? 'लिंक कपी'
                    : 'Copy URL'}
                </button>
              </div>

              {isIframe && (
                <div className="pt-2 border-t border-cyan-900/50 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-400">
                    {isNe
                      ? '💡 प्रिभ्यु फ्रेम बाहिर पूर्ण ब्राउजरमा खोल्नुहोस्:'
                      : '💡 Open outside the preview frame in full browser:'}
                  </p>
                  <button
                    onClick={handleOpenDirect}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 cursor-pointer active:scale-95 transition-all text-[11px] shrink-0"
                  >
                    {isNe ? '🚀 नयाँ ट्याबमा खोल्नुहोस्' : '🚀 Open in New Tab'}
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              {isNe ? 'बन्द गर्नुहोस् (Close)' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
