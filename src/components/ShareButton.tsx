import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, MessageCircle, Send, X } from 'lucide-react';
import { Language } from '../types';

interface ShareButtonProps {
  lang: Language;
  title?: string;
  text?: string;
  url?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  lang,
  title,
  text,
  url,
  label,
  variant = 'secondary',
  className = '',
}) => {
  const isNe = lang === 'ne';
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://scamly.nepal');

  const shareTitle =
    title ||
    (isNe
      ? 'Scamly — नेपाल अनलाइन ठगी सुरक्षा तथा साइबर सहयोग पोर्टल'
      : 'Scamly — Nepal Online Scam Protection & Cyber Defense Portal');

  const shareText =
    text ||
    (isNe
      ? 'शंकास्पद SMS, नक्कली लिंक, अनलाइन सपिङ र फोन ठगीबाट बच्न यो निःशुल्क AI टुल प्रयोग गर्नुहोस् र साथीहरूलाई पनि सेयर गर्नुहोस्:'
      : 'Protect yourself and your friends from SMS phishing, fake online shopping, and digital wallet scams with this free scam prevention portal:');

  // Close popover on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const copyToClipboard = async (content: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleShareClick = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setSharedStatus(true);
        setTimeout(() => setSharedStatus(false), 2500);
        return;
      } catch (err: any) {
        // User explicitly cancelled the native share sheet
        if (err && err.name === 'AbortError') {
          return;
        }
        // Web Share API blocked (e.g. iframe policy or unsupported desktop context): open direct channel menu
      }
    }
    setMenuOpen((prev) => !prev);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`)}`;
  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const messengerHref = isMobileDevice
    ? `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`
    : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`${shareTitle} — ${shareText}`)}`;

  const buttonStyles =
    variant === 'primary'
      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400 font-black shadow-md shadow-cyan-500/20 btn-cyan'
      : variant === 'subtle'
      ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 border border-cyan-600/40 dark:border-cyan-500/40 font-bold shadow-xs'
      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold shadow-xs';

  const buttonLabel =
    sharedStatus
      ? isNe
        ? 'सेयर भयो!'
        : 'Shared!'
      : label || (isNe ? 'सेयर गर्नुहोस्' : 'Share');

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleShareClick}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0 ${buttonStyles}`}
        title={isNe ? 'साथीहरूलाई सेयर गर्नुहोस् (WhatsApp / Messenger / Link)' : 'Share scam prevention resources'}
      >
        {sharedStatus ? (
          <Check className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Share2 className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{buttonLabel}</span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 shadow-2xl p-3.5 z-50 animate-fadeIn space-y-3 text-left"
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-extrabold text-slate-950 dark:text-white">
                {isNe ? 'सचेतना तथा नतिजा सेयर गर्नुहोस्' : 'Share Scam Prevention Resource'}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isNe ? 'परिवार र साथीहरूलाई सुरक्षित राख्नुहोस्' : 'Help friends stay safe from online scams'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label={isNe ? 'बन्द गर्नुहोस्' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* WhatsApp Share */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => setMenuOpen(false), 300)}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isNe ? 'WhatsApp मा पठाउनुहोस्' : 'Share via WhatsApp'}</span>
              </span>
              <span className="text-[11px] opacity-75">→</span>
            </a>

            {/* Messenger Share */}
            <a
              href={messengerHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                copyToClipboard(`${shareTitle}\n${shareText}\n${shareUrl}`);
                setTimeout(() => setMenuOpen(false), 300);
              }}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{isNe ? 'Messenger / Facebook मा सेयर' : 'Share via Messenger'}</span>
              </span>
              <span className="text-[11px] opacity-75">→</span>
            </a>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={() => copyToClipboard(shareUrl)}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                )}
                <span>
                  {copied
                    ? isNe
                      ? 'लिंक कपी भयो!'
                      : 'Link Copied!'
                    : isNe
                    ? 'लिंक कपी गर्नुहोस् (Copy Link)'
                    : 'Copy Link'}
                </span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                {shareUrl.replace(/^https?:\/\//, '')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
