import React, { useState, useEffect } from 'react';
import {
  Shield,
  MessageSquare,
  Link as LinkIcon,
  ShoppingBag,
  Camera,
  Mic,
  Bot,
  LifeBuoy,
  FileText,
  BookOpen,
  PhoneCall,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Home,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Header } from './components/Header';
import { NepalScamDashboard } from './components/NepalScamDashboard';
import { MessageChecker } from './components/MessageChecker';
import { LinkChecker } from './components/LinkChecker';
import { ShoppingChecker } from './components/ShoppingChecker';
import { PhotoChecker } from './components/PhotoChecker';
import { VoiceChecker } from './components/VoiceChecker';
import { CyberDefenseChat } from './components/CyberDefenseChat';
import { EmergencyRescue } from './components/EmergencyRescue';
import { ComplaintGenerator } from './components/ComplaintGenerator';
import { ScamLibrary } from './components/ScamLibrary';
import { PrivacyView } from './components/PrivacyView';
import { FeedbackModal } from './components/FeedbackModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileQuickBar } from './components/MobileQuickBar';
import { AllToolsView } from './components/AllToolsView';
import { VideoCenter } from './components/VideoCenter';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { BANNERS, TOOL_PHOTOS } from './constants/toolImages';
import { getAppMediaSettings, AppMediaSettings } from './utils/mediaStorage';
import { getAppContentSettings, AppContentSettings } from './utils/contentStorage';
import { getAppThemeSettings, applyThemeToDOM, AppThemeSettings } from './utils/themeStorage';
import { fetchAndApplyGlobalSettings } from './utils/globalSync';
import { Language, UserAccount } from './types';
import { t } from './translations';
import { getStoredUser, setStoredUser } from './utils/auth';
import { toNepaliDigits } from './utils/numberFormat';

export type PageView =
  | 'home'
  | 'tools'
  | 'video'
  | 'message'
  | 'link'
  | 'shopping'
  | 'photo'
  | 'voice'
  | 'chat'
  | 'rescue'
  | 'complaint'
  | 'library'
  | 'privacy'
  | 'admin';

// Helper to determine initial page from URL path or hash (e.g. /admin or #/admin or ?admin)
function getInitialPageFromUrl(): PageView {
  if (typeof window === 'undefined') return 'home';
  const path = (window.location.pathname || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();
  const searchStr = (window.location.search || '').toLowerCase();
  const fullHref = (window.location.href || '').toLowerCase();
  const search = new URLSearchParams(window.location.search || '');

  // Detect admin in ANY format: /admin, /admin/, #/admin, #admin, ?admin, ?page=admin
  if (
    path === '/admin' ||
    path.startsWith('/admin') ||
    path.endsWith('/admin') ||
    path.includes('/admin') ||
    path.includes('admin') ||
    hash.includes('admin') ||
    searchStr.includes('admin') ||
    search.has('admin') ||
    search.get('page') === 'admin' ||
    fullHref.includes('/admin') ||
    fullHref.includes('#admin') ||
    fullHref.includes('?admin')
  ) {
    return 'admin';
  }

  // Support other direct routes if entered
  const validPages: PageView[] = [
    'tools',
    'video',
    'message',
    'link',
    'shopping',
    'photo',
    'voice',
    'chat',
    'rescue',
    'complaint',
    'library',
    'privacy',
    'admin',
  ];

  for (const page of validPages) {
    if (
      path.includes(`/${page}`) ||
      hash.includes(`#/${page}`) ||
      hash.includes(page) ||
      search.get('page') === page
    ) {
      return page;
    }
  }

  return 'home';
}

export default function App() {
  const [lang, setLang] = useState<Language>('ne');
  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPageFromUrl);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [mediaSettings, setMediaSettings] = useState<AppMediaSettings>(() => getAppMediaSettings());
  const [contentSettings, setContentSettings] = useState<AppContentSettings>(() => getAppContentSettings());
  const [, setThemeSettings] = useState<AppThemeSettings>(() => getAppThemeSettings());

  const currentT = t[lang];
  const isNe = lang === 'ne';

  // Listen to cross-component auth, media, content, theme state changes & URL history changes
  useEffect(() => {
    // Ensure active theme is applied to DOM on mount
    applyThemeToDOM();

    // Immediately fetch authoritative global settings from server (sync across all users)
    fetchAndApplyGlobalSettings();

    // Periodic synchronization check every 10 seconds so all active users get admin changes
    const syncTimer = setInterval(() => {
      fetchAndApplyGlobalSettings();
    }, 10000);

    const handleWindowFocus = () => {
      fetchAndApplyGlobalSettings();
    };

    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };
    const handleMediaChange = () => {
      setMediaSettings(getAppMediaSettings());
    };
    const handleContentChange = () => {
      setContentSettings(getAppContentSettings());
    };
    const handleThemeChange = () => {
      setThemeSettings(getAppThemeSettings());
    };

    const handleLocationChange = () => {
      const page = getInitialPageFromUrl();
      setCurrentPage(page);
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('auth_state_changed', handleAuthChange);
    window.addEventListener('app_media_changed', handleMediaChange);
    window.addEventListener('app_content_changed', handleContentChange);
    window.addEventListener('app_theme_changed', handleThemeChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      clearInterval(syncTimer);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('auth_state_changed', handleAuthChange);
      window.removeEventListener('app_media_changed', handleMediaChange);
      window.removeEventListener('app_content_changed', handleContentChange);
      window.removeEventListener('app_theme_changed', handleThemeChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    try {
      const targetUrl = page === 'home' ? '/' : `/${page}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page }, '', targetUrl);
      }
    } catch {
      // Ignore pushState failure in restrictive iframes
    }
    // User requested: "tools ma click garda tools ma mathi scroll hataunu hosh"
    if (page !== 'tools') {
      window.scrollTo(0, 0);
    }
  };

  const handleOpenRescue = () => {
    navigateTo('rescue');
  };

  const handleOpenComplaint = () => {
    navigateTo('complaint');
  };

  const handleOpenFeedback = (context: string) => {
    setFeedbackContext(context);
    setFeedbackOpen(true);
  };

  // Tool metadata definition for cards & dedicated page headers
  const toolsInfo: Record<
    PageView,
    {
      titleNe: string;
      titleEn: string;
      descNe: string;
      descEn: string;
      icon: React.ElementType;
      color: string;
      badgeNe: string;
      badgeEn: string;
    }
  > = {
    home: {
      titleNe: 'गृहपृष्ठ',
      titleEn: 'Home',
      descNe: '',
      descEn: '',
      icon: Home,
      color: 'cyan',
      badgeNe: '',
      badgeEn: '',
    },
    tools: {
      titleNe: 'ठगी जाँच तथा सुरक्षा सेवाहरू (All Protection Tools)',
      titleEn: 'All Scam Protection Tools & Services',
      descNe: 'आधुनिक एआई प्रणालीद्वारा सन्देश, फिसिङ लिंक, नक्कली सपिङ, स्क्रिनसट र आवाज जाँच गर्नुहोस्।',
      descEn: 'Inspect suspicious messages, phishing URLs, shopping offers, screenshots, and audio with specialized AI.',
      icon: Sparkles,
      color: 'teal',
      badgeNe: '१२+ सेवाहरू',
      badgeEn: '12+ Tools',
    },
    video: {
      titleNe: 'साइबर सुरक्षा भिडियो सचेतना केन्द्र (Video Awareness Hub)',
      titleEn: 'Cyber Security Video Awareness Hub',
      descNe: 'नेपालमा हुने मुख्य ठगीका शैली, eSewa/Khalti सुरक्षित राख्ने तरिका र प्रहरी उजुरी प्रक्रियाका भिडियो ट्युटोरियल।',
      descEn: 'Video guides and case studies on spotting digital banking traps, shopping frauds, and filing complaints.',
      icon: Sparkles,
      color: 'rose',
      badgeNe: 'सचेतना भिडियो',
      badgeEn: 'Awareness Video',
    },
    message: {
      titleNe: 'सन्देश र SMS जाँच (Message Checker)',
      titleEn: 'Suspicious Message & SMS Checker',
      descNe: 'SMS, WhatsApp, Messenger वा Telegram मा आएका अफर, बैंक चेतावनी वा चिट्ठा सन्देश यहाँ राखेर ठगीका संकेत जाँच्नुहोस्।',
      descEn: 'Inspect suspicious SMS, WhatsApp, Messenger or Telegram texts for phishing, fraud pretexts, and urgency traps.',
      icon: MessageSquare,
      color: 'cyan',
      badgeNe: 'SMS / WhatsApp',
      badgeEn: 'SMS / WhatsApp',
    },
    link: {
      titleNe: 'वेबसाइट र लिंक जाँच (Link / URL Checker)',
      titleEn: 'Suspicious Link & Phishing URL Checker',
      descNe: 'कुनै पनि शंकास्पद वेबसाइटको URL ठेगाना राखेर फिसिङ, नक्कली बैंक पोर्टल र असुरक्षित डोमेनको जोखिम जाँच्नुहोस्।',
      descEn: 'Inspect suspicious web addresses for impersonation of banking portals, unverified domains, and credential harvesters.',
      icon: LinkIcon,
      color: 'teal',
      badgeNe: 'फिसिङ / URL',
      badgeEn: 'Phishing / URL',
    },
    shopping: {
      titleNe: 'सोसल मिडिया किनमेल ठगी जाँच (Shopping Scam Checker)',
      titleEn: 'Social Media Shopping Scam Checker',
      descNe: 'Facebook Marketplace, TikTok, Instagram पसलका अस्वाभाविक सस्तो मूल्य, अग्रिम भुक्तानी (Advance Payment) र नक्कली पेज जाँच्नुहोस्।',
      descEn: 'Inspect unrealistic discounts, upfront advance payment risks, and unverified seller accounts on FB, TikTok & Insta.',
      icon: ShoppingBag,
      color: 'cyan',
      badgeNe: 'अग्रिम भुक्तानी जोखिम',
      badgeEn: 'Advance Fraud Alert',
    },
    photo: {
      titleNe: 'फोटो वा स्क्रिनसट जाँच (Photo & Screenshot OCR)',
      titleEn: 'Screenshot & Ad Photo Scam Checker',
      descNe: 'सामाजिक सञ्जालको विज्ञापन वा च्याटको स्क्रिनसट अपलोड गर्नुहोस्। AI Vision ले अक्षर र दृश्य संकेतहरू पढेर ठगी पत्ता लगाउँछ।',
      descEn: 'Upload screenshots of marketplace ads, fake payment proofs, or chats. Analyzed automatically using AI Vision & OCR.',
      icon: Camera,
      color: 'sky',
      badgeNe: 'AI Vision & OCR',
      badgeEn: 'AI Vision & OCR',
    },
    voice: {
      titleNe: 'आवाजबाट ठगी जाँच (Voice Scam Assistant)',
      titleEn: 'Nepali Voice Scam Assistant',
      descNe: 'टाइप गर्न नपर्ने! माइक बटन थिचेर नेपालीमै आफ्नो शंका बोल्नुहोस् र जवाफ पनि आवाजमै सुन्नुहोस्।',
      descEn: 'Hands-free voice assistant: Speak your concern directly in Nepali and listen to the audio verdict.',
      icon: Mic,
      color: 'amber',
      badgeNe: 'बोलेर सोध्नुहोस्',
      badgeEn: 'Audio Verdict',
    },
    chat: {
      titleNe: 'AI साइबर सुरक्षा सल्लाहकार (Gemini AI Chatbot)',
      titleEn: 'AI Cyber Fraud Defense Specialist',
      descNe: 'गुगल जेमिनाई AI सँग नेपालीमै प्रत्यक्ष च्याट गर्नुहोस् — इसेवा, खल्ती, नक्कली जागिर, अनलाइन सपिङ ठगी र साइबर ब्युरो सम्बन्धी कुनै पनि प्रश्न सोध्नुहोस् (१००% निःशुल्क)।',
      descEn: 'Chat directly in Nepali or English with Gemini AI specialist on online fraud, wallet safety, and police complaint procedures (100% Free).',
      icon: Bot,
      color: 'emerald',
      badgeNe: '१००% निःशुल्क AI',
      badgeEn: '100% Free AI',
    },
    rescue: {
      titleNe: 'ठगीमा परिसकेपछिको आपतकालीन उद्धार (Scam Rescue SOS)',
      titleEn: 'Immediate Scam Victim Rescue Checklist',
      descNe: 'पैसा पठाइसकेको, OTP दिएको वा खाता ह्याक भएको अवस्थामा थप क्षति रोक्न तत्काल चाल्नुपर्ने प्राथमिकता कदमहरू।',
      descEn: 'Urgent step-by-step checklist to freeze accounts, reverse transactions, and avoid secondary recovery scams.',
      icon: LifeBuoy,
      color: 'rose',
      badgeNe: 'तत्काल आपतकालीन',
      badgeEn: 'Urgent Action',
    },
    complaint: {
      titleNe: 'साइबर ब्युरो उजुरी मस्यौदा (Police Complaint Drafter)',
      titleEn: 'Cyber Bureau Police Complaint Drafter',
      descNe: 'नेपाल प्रहरी साइबर ब्युरोमा दर्ता गर्न आवश्यक प्रमाण, लेनदेन विवरणसहित औपचारिक उजुरी निवेदन स्वतः तयार गर्नुहोस्।',
      descEn: 'Generate an official, structured cybercrime complaint petition ready for submission to Nepal Police Cyber Bureau.',
      icon: FileText,
      color: 'emerald',
      badgeNe: 'कानुनी उजुरी',
      badgeEn: 'Official Petition',
    },
    library: {
      titleNe: 'नेपाल ठगी ज्ञान केन्द्र (Scam Directory & Red Flags)',
      titleEn: 'Nepal Scam Directory & Awareness Hub',
      descNe: 'नेपालमा सक्रिय मुख्य ठगीका शैलीहरू, प्रयोग गरिने मानसिक चालबाजी र परिवारलाई सुरक्षित राख्ने उपायहरू।',
      descEn: 'Comprehensive library of contemporary cyber fraud methods in Nepal and how to defend against them.',
      icon: BookOpen,
      color: 'indigo',
      badgeNe: 'सचेतना ज्ञान',
      badgeEn: 'Knowledge Base',
    },
    privacy: {
      titleNe: 'गोपनीयता तथा सुरक्षा नीति (Privacy & Safety)',
      titleEn: 'Privacy & Safety Architecture',
      descNe: 'तपाईंको कुनै पनि संवेदनशील विवरण सर्भरमा सुरक्षित हुँदैन। पूर्ण इन-ब्राउजर गोपनीयता ग्यारेन्टी।',
      descEn: 'We do not harvest credentials. Analysis runs client-side with minimal metadata transmission.',
      icon: Lock,
      color: 'slate',
      badgeNe: '१००% निजी',
      badgeEn: '100% Private',
    },
    admin: {
      titleNe: 'साइबर सुरक्षा व्यवस्थापक प्यानल (Admin Dashboard)',
      titleEn: 'Cyber Defense Admin Control',
      descNe: 'ग्राहकहरूले गरेको स्क्यान, एआईले दिएको समाधान, समीक्षा र दर्ता भएका समस्याहरूको प्रत्यक्ष नियन्त्रण।',
      descEn: 'Inspect real-time customer scan checks, solutions provided, user ratings, and resolve raised issues.',
      icon: Shield,
      color: 'cyan',
      badgeNe: 'Admin Control',
      badgeEn: 'Admin Control',
    },
  };

  const currentTool = toolsInfo[currentPage];

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg, #0b1220)',
        color: 'var(--app-text-main, #f8fafc)',
      }}
    >
      {/* Top Header (Public Navigation Only) */}
      {currentPage !== 'admin' && (
        <Header
          lang={lang}
          onToggleLang={toggleLanguage}
          onOpenEmergency={handleOpenRescue}
          onNavigateHome={() => navigateTo('home')}
          onNavigateAdmin={() => navigateTo('admin')}
          currentPage={currentPage}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'signin');
            setAuthModalOpen(true);
          }}
          onLogout={() => {
            setStoredUser(null);
            sessionStorage.removeItem('scam_admin_auth');
          }}
        />
      )}

      {/* Main Container with Mobile App Safe Bottom Padding */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">
        {/* PWA 1-Click Install Banner (Hides automatically in standalone mode) */}
        <PWAInstallBanner lang={lang} />

        {/* ======================================================== */}
        {/* VIEW 1: HOME PAGE (DASHBOARD OVERVIEW & SERVICE PORTAL) */}
        {/* ======================================================== */}
        {currentPage === 'home' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* 1. TOP SECTION: RECHARTS SCAM DASHBOARD FOR NEPAL */}
            <NepalScamDashboard
              lang={lang}
              onSelectScamType={(tool) => navigateTo(tool)}
            />

            {/* 2. HERO BANNER WITH HIGH-DEFINITION NEPAL CYBER DEFENSE PICTURE */}
            {/* 2. HERO BANNER WITH CLEAR HIGH-DEFINITION NEPAL CYBER DEFENSE PICTURE */}
            <section
              className="rounded-3xl border shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border)',
              }}
            >
              {/* Clear Picture Banner without icon overlays */}
              <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-slate-900">
                <img
                  src={mediaSettings.banners.hero}
                  alt={isNe ? 'नेपाल साइबर सुरक्षा रक्षा कवच' : 'Nepal Cyber Defense AI Shield'}
                  className="w-full h-full object-cover object-center filter brightness-105"
                />
              </div>

              <div className="p-4 sm:p-7 mt-0 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl space-y-2.5">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--app-text-main)' }}>
                    {isNe ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                        {contentSettings.heroHeadlineNe}
                      </span>
                    ) : (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                        {contentSettings.heroHeadlineEn}
                      </span>
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                    {isNe ? contentSettings.heroSubheadlineNe : contentSettings.heroSubheadlineEn}
                  </p>
                </div>

                {/* Hero Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-56">
                  <button
                    onClick={() => navigateTo('tools')}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isNe ? 'सबै टुलहरू खोल्नुहोस्' : 'Explore All Tools'}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => navigateTo('rescue')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm border border-rose-500 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="text-white !text-white font-bold">{isNe ? 'ठगीमा परेको छु (SOS)' : "I'm Scammed (Rescue SOS)"}</span>
                    <span className="text-white !text-white font-bold">→</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Mobile Horizontal Quick Tool Bar (Visible on Mobile Only) */}
            <MobileQuickBar
              currentPage={currentPage}
              onNavigate={navigateTo}
              lang={lang}
            />

            {/* 3. EMERGENCY POLICE HELPLINE NOTIFICATION STRIP */}
            <div
              className="p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
              style={{
                backgroundColor: 'var(--app-card-subtle)',
                borderColor: 'var(--app-border)',
              }}
            >
              <div>
                <span className="font-bold block" style={{ color: 'var(--app-text-main)' }}>
                  {isNe ? contentSettings.emergencyAlertNe : contentSettings.emergencyAlertEn}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                  {isNe
                    ? `फोन: ${contentSettings.helplinePhone} | आपतकालीन: १०० | इमेल: ${contentSettings.helplineEmail}`
                    : `Hotline: ${contentSettings.helplinePhone} | Emergency: 100 | ${contentSettings.helplineEmail}`}
                </span>
              </div>
              <a
                href={`tel:${contentSettings.helplinePhone.replace(/[^0-9]/g, '') || '014211304'}`}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white !text-white border border-emerald-500 font-bold shrink-0 transition-colors shadow-sm"
              >
                <span className="text-white !text-white font-bold">{isNe ? `फोन गर्नुहोस्: ${contentSettings.helplinePhone}` : `Call: ${contentSettings.helplinePhone}`}</span>
              </a>
            </div>

            {/* 5. CYBER SECURITY AWARENESS VIDEO CENTER ON APP HOME */}
            <section className="space-y-4">
              <VideoCenter lang={lang} onNavigateTool={navigateTo} />
            </section>

            {/* 5. TRUST PILLARS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--app-card-subtle)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <span className="font-bold block" style={{ color: 'var(--app-text-main)' }}>
                  {isNe ? '१००% निजी र इन-ब्राउजर' : '100% Private & In-Browser'}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                  {isNe ? 'कुनै पनि पासवर्ड सुरक्षित हुँदैन' : 'Zero credential retention'}
                </span>
              </div>

              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--app-card-subtle)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <span className="font-bold block" style={{ color: 'var(--app-text-main)' }}>
                  {isNe ? 'नेपाल प्रहरी साइबर ब्युरो' : 'Nepal Police Cyber Bureau'}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                  {isNe ? 'हटलाइन: ०१-४२११३०४' : 'Official Hotline: 01-4211304'}
                </span>
              </div>

              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--app-card-subtle)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <span className="font-bold block" style={{ color: 'var(--app-text-main)' }}>
                  {isNe ? 'नियम + AI विश्लेषण' : 'Heuristics + AI Vision'}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                  {isNe ? 'नेपाली सन्दर्भ र स्थानीय ठगी ढाँचा' : 'Tuned for Nepal fraud modalities'}
                </span>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: ADMIN CONTROL PANEL (ISOLATED DEDICATED BACKOFFICE) */}
        {/* ======================================================== */}
        {currentPage === 'admin' && (
          <div className="animate-fadeIn">
            <AdminDashboard
              lang={lang}
              onNavigateHome={() => navigateTo('home')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: DEDICATED SEPARATE PAGES FOR PUBLIC TOOLS       */}
        {/* ======================================================== */}
        {currentPage !== 'home' && currentPage !== 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Clean Top Navigation Bar: Back-To-Home & Breadcrumb */}
            <div
              className="p-3 sm:p-3.5 rounded-2xl border shadow-lg flex items-center justify-between gap-3 sticky top-[65px] z-30 backdrop-blur-md"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border)',
              }}
            >
              <button
                onClick={() => navigateTo('home')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400 text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 shadow-md"
                title={isNe ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}
              >
                <span className="text-slate-950 font-black">{isNe ? '← गृहपृष्ठ (Home)' : '← Back to Home'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  onClick={() => navigateTo('home')}
                  className="hover:text-cyan-300 cursor-pointer hidden sm:inline"
                >
                  {isNe ? 'गृहपृष्ठ' : 'Home'}
                </span>
                <span className="text-slate-600 hidden sm:inline">/</span>
                <span className="text-white font-semibold">
                  {isNe ? currentTool.titleNe.split('(')[0].trim() : currentTool.titleEn}
                </span>
              </div>
            </div>

            {/* Dedicated Page Heading Card with Dynamic Photo Banner (Hidden on full Chat page for direct instant access) */}
            {currentPage !== 'chat' && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#0f172a]">
                <div className="absolute inset-0 z-0">
                  <img
                    src={TOOL_PHOTOS[currentPage]?.image || BANNERS.hero}
                    alt=""
                    className="w-full h-full object-cover opacity-25 filter blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0f172a]/95 to-[#0b1220]/80" />
                </div>
                <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {isNe ? currentTool.titleNe : currentTool.titleEn}
                      </h1>
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-900/90 text-white !text-white border border-cyan-500/60 shadow-sm">
                        {isNe ? currentTool.badgeNe : currentTool.badgeEn}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                      {isNe ? currentTool.descNe : currentTool.descEn}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Render the Dedicated Component */}
            <div className="rounded-3xl">
              {currentPage === 'tools' && (
                <AllToolsView
                  lang={lang}
                  onNavigate={navigateTo}
                  currentUser={currentUser}
                  onOpenAuth={(mode) => {
                    setAuthModalMode(mode || 'signin');
                    setAuthModalOpen(true);
                  }}
                  onOpenFeedback={handleOpenFeedback}
                />
              )}

              {currentPage === 'message' && (
                <MessageChecker
                  lang={lang}
                  onOpenRescue={handleOpenRescue}
                  onOpenReportModal={handleOpenFeedback}
                />
              )}

              {currentPage === 'link' && (
                <LinkChecker lang={lang} onOpenRescue={handleOpenRescue} />
              )}

              {currentPage === 'shopping' && (
                <ShoppingChecker
                  lang={lang}
                  onOpenRescue={handleOpenRescue}
                  onOpenReportModal={handleOpenFeedback}
                />
              )}

              {currentPage === 'photo' && (
                <PhotoChecker
                  lang={lang}
                  onOpenRescue={handleOpenRescue}
                  onOpenReportModal={handleOpenFeedback}
                />
              )}

              {currentPage === 'voice' && (
                <VoiceChecker
                  lang={lang}
                  onOpenRescue={handleOpenRescue}
                  onOpenReportModal={handleOpenFeedback}
                />
              )}

              {currentPage === 'chat' && (
                <CyberDefenseChat
                  lang={lang}
                  onNavigateToRescue={handleOpenRescue}
                  onNavigateToComplaint={handleOpenComplaint}
                />
              )}

              {currentPage === 'rescue' && (
                <EmergencyRescue
                  lang={lang}
                  onOpenComplaint={handleOpenComplaint}
                />
              )}

              {currentPage === 'complaint' && <ComplaintGenerator lang={lang} />}

              {currentPage === 'library' && <ScamLibrary lang={lang} />}

              {currentPage === 'privacy' && <PrivacyView lang={lang} />}

              {currentPage === 'video' && (
                <VideoCenter lang={lang} onNavigateTool={navigateTo} />
              )}
            </div>

            {/* Bottom Navigation Return Strip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 cursor-pointer transition-colors"
              >
                <span>{isNe ? '← गृहपृष्ठमा फर्कनुहोस् (Go back to Home)' : '← Return to Main Homepage'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-700 dark:text-slate-400 font-medium">
                  {isNe ? 'कुनै समस्या वा प्रश्न छ?' : 'Need immediate assistance?'}
                </span>
                <button
                  onClick={() => handleOpenFeedback(currentTool.titleEn)}
                  className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline cursor-pointer font-bold"
                >
                  {isNe ? 'हामीलाई बताउनुहोस्' : 'Send Feedback'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Public App Footer (Hidden in Admin Control Panel) */}
        {currentPage !== 'admin' && (
          <footer className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="font-bold text-slate-300">Scamly Nepal</span>
              <span>•</span>
              <button
                onClick={() => navigateTo('privacy')}
                className="hover:text-cyan-400 cursor-pointer transition-colors"
              >
                {isNe ? 'गोपनीयता (Privacy)' : 'Privacy'}
              </button>
              <span>•</span>
              <button
                onClick={() => navigateTo('rescue')}
                className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer transition-colors"
              >
                {isNe ? '🚨 आपतकालीन उद्धार' : '🚨 Emergency SOS'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{isNe ? 'नेपाल आधिकारिक डिजिटल सुरक्षा प्रणाली' : 'Official Digital Defense Portal'}</span>
            </div>
          </footer>
        )}
      </main>

      {/* Floating Customer Feedback & Issue Button */}
      {currentPage !== 'admin' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => handleOpenFeedback('Floating Action Button')}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-2xl border border-cyan-300/40 cursor-pointer active:scale-95 transition-all"
            title={isNe ? 'प्रतिक्रिया वा समस्या पठाउनुहोस्' : 'Send Feedback or Raise Issue'}
          >
            <span className="hidden sm:inline">
              {isNe ? 'प्रतिक्रिया / समस्या दर्ता' : 'Feedback & Issue Ticket'}
            </span>
            <span className="sm:hidden">{isNe ? 'प्रतिक्रिया' : 'Feedback'}</span>
          </button>
        </div>
      )}



      {/* Feedback / False Positive Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        lang={lang}
        initialContext={feedbackContext}
      />

      {/* User Authentication Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        initialMode={authModalMode}
        onSuccess={(u) => {
          setCurrentUser(u);
        }}
      />

      {/* Mobile App Native Bottom Navigation Bar */}
      {currentPage !== 'admin' && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'signin');
            setAuthModalOpen(true);
          }}
          currentUser={currentUser}
          lang={lang}
        />
      )}
    </div>
  );
}
