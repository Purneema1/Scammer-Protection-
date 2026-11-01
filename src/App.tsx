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

export default function App() {
  const [lang, setLang] = useState<Language>('ne');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [mediaSettings, setMediaSettings] = useState<AppMediaSettings>(() => getAppMediaSettings());
  const [contentSettings, setContentSettings] = useState<AppContentSettings>(() => getAppContentSettings());

  const currentT = t[lang];
  const isNe = lang === 'ne';

  // Listen to cross-component auth, media, and content state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };
    const handleMediaChange = () => {
      setMediaSettings(getAppMediaSettings());
    };
    const handleContentChange = () => {
      setContentSettings(getAppContentSettings());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    window.addEventListener('app_media_changed', handleMediaChange);
    window.addEventListener('app_content_changed', handleContentChange);
    return () => {
      window.removeEventListener('auth_state_changed', handleAuthChange);
      window.removeEventListener('app_media_changed', handleMediaChange);
      window.removeEventListener('app_content_changed', handleContentChange);
    };
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
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
    <div className="min-h-screen bg-[#0b1220] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
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
          if (currentPage === 'admin') {
            navigateTo('home');
          }
        }}
      />

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
            <section className="rounded-3xl border border-cyan-800/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#101b33] to-[#0c1322]">
              {/* Clear Picture Banner without icon overlays */}
              <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-slate-900">
                <img
                  src={mediaSettings.banners.hero}
                  alt={isNe ? 'नेपाल साइबर सुरक्षा रक्षा कवच' : 'Nepal Cyber Defense AI Shield'}
                  className="w-full h-full object-cover object-center filter brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-black/20" />
              </div>

              <div className="p-4 sm:p-7 -mt-6 sm:-mt-10 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl space-y-2.5">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
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
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isNe ? contentSettings.heroSubheadlineNe : contentSettings.heroSubheadlineEn}
                  </p>
                </div>

                {/* Banner CTA Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-64">
                  <button
                    onClick={() => navigateTo('tools')}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isNe ? 'सबै टुलहरू हेर्नुहोस्' : 'Explore All Tools'}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => navigateTo('chat')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isNe ? 'AI सुरक्षा च्याटबट' : 'Ask AI Chatbot'}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => navigateTo('message')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isNe ? 'सन्देश / SMS जाँच्नुहोस्' : 'Check Message / SMS'}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => navigateTo('rescue')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/70 text-rose-300 font-semibold text-xs sm:text-sm border border-rose-800/60 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isNe ? 'ठगीमा परेको छु (SOS)' : "I'm Scammed (Rescue SOS)"}</span>
                    <span>→</span>
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
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0e1b2f] to-rose-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-white block">
                  {isNe ? contentSettings.emergencyAlertNe : contentSettings.emergencyAlertEn}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {isNe
                    ? `फोन: ${contentSettings.helplinePhone} | आपतकालीन: १०० | इमेल: ${contentSettings.helplineEmail}`
                    : `Hotline: ${contentSettings.helplinePhone} | Emergency: 100 | ${contentSettings.helplineEmail}`}
                </span>
              </div>
              <a
                href={`tel:${contentSettings.helplinePhone.replace(/[^0-9]/g, '') || '014211304'}`}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold shrink-0 transition-colors"
              >
                {isNe ? `फोन गर्नुहोस्: ${contentSettings.helplinePhone}` : `Call: ${contentSettings.helplinePhone}`}
              </a>
            </div>

            {/* 4. DEDICATED ALL TOOLS ACCESS CARD */}
            <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#101c34] via-[#142340] to-[#101c34] border border-cyan-800/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {isNe ? "साइबर सुरक्षा टुलहरू" : "Scam Protection Tools"}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {isNe ? "सबै ठगी जाँच तथा सुरक्षा सेवाहरू" : "All Scam Protection Tools"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {isNe
                    ? "SMS, फिसिङ लिंक, सपिङ अफर, फोटो स्क्रिनसट, नेपाली आवाज तथा AI सुरक्षा टुलहरू १-क्लिकमा टुल पृष्ठमा उपलब्ध छन्।"
                    : "Access SMS, phishing links, shopping, photo OCR, voice & AI cybersecurity tools in the dedicated tools portal."}
                </p>
              </div>
              <button
                onClick={() => navigateTo("tools")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/25 shrink-0 text-center"
              >
                {isNe ? "सबै टुलहरू खोल्नुहोस् →" : "Open All Tools →"}
              </button>
            </section>

            {/* 5. CYBER SECURITY AWARENESS VIDEO CENTER ON APP HOME */}
            <section className="space-y-4">
              <VideoCenter lang={lang} onNavigateTool={navigateTo} />
            </section>

            {/* 5. TRUST PILLARS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800">
                <span className="font-bold text-slate-200 block">
                  {isNe ? '१००% निजी र इन-ब्राउजर' : '100% Private & In-Browser'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isNe ? 'कुनै पनि पासवर्ड सुरक्षित हुँदैन' : 'Zero credential retention'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800">
                <span className="font-bold text-slate-200 block">
                  {isNe ? 'नेपाल प्रहरी साइबर ब्युरो' : 'Nepal Police Cyber Bureau'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isNe ? 'हटलाइन: ०१-४२११३०४' : 'Official Hotline: 01-4211304'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800">
                <span className="font-bold text-slate-200 block">
                  {isNe ? 'नियम + AI विश्लेषण' : 'Heuristics + AI Vision'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isNe ? 'नेपाली सन्दर्भ र स्थानीय ठगी ढाँचा' : 'Tuned for Nepal fraud modalities'}
                </span>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: DEDICATED SEPARATE PAGES FOR EACH TOOL          */}
        {/* ======================================================== */}
        {currentPage !== 'home' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Back-To-Home Bar & Breadcrumb Navigation */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0f172a]/95 border border-slate-800/90 shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-[65px] z-30 backdrop-blur-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigateTo('home')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-600/50 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                  title={isNe ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}
                >
                  <span>{isNe ? '← गृहपृष्ठ (Home)' : '← Back to Home'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                  <span
                    onClick={() => navigateTo('home')}
                    className="hover:text-cyan-300 cursor-pointer"
                  >
                    {isNe ? 'गृहपृष्ठ' : 'Home'}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-white font-semibold">
                    {isNe ? currentTool.titleNe.split('(')[0] : currentTool.titleEn}
                  </span>
                </div>
              </div>

              {/* Quick Jump to Other Tools */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[11px] text-slate-400 hidden md:inline">
                  {isNe ? 'अन्य सेवाहरू:' : 'Other Tools:'}
                </span>
                {currentPage !== 'message' && (
                  <button
                    onClick={() => navigateTo('message')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'सन्देश' : 'Message'}
                  </button>
                )}
                {currentPage !== 'link' && (
                  <button
                    onClick={() => navigateTo('link')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'लिंक' : 'Link'}
                  </button>
                )}
                {currentPage !== 'shopping' && (
                  <button
                    onClick={() => navigateTo('shopping')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'किनमेल' : 'Shopping'}
                  </button>
                )}
                {currentPage !== 'photo' && (
                  <button
                    onClick={() => navigateTo('photo')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'फोटो' : 'Photo'}
                  </button>
                )}
                {currentPage !== 'voice' && (
                  <button
                    onClick={() => navigateTo('voice')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'आवाज' : 'Voice'}
                  </button>
                )}
                {currentPage !== 'chat' && (
                  <button
                    onClick={() => navigateTo('chat')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'AI च्याट' : 'AI Chat'}
                  </button>
                )}
                {currentPage !== 'rescue' && (
                  <button
                    onClick={() => navigateTo('rescue')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'उद्धार' : 'Rescue'}
                  </button>
                )}
                {currentUser?.role === 'admin' && currentPage !== 'admin' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {isNe ? 'एडमिन' : 'Admin'}
                  </button>
                )}
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
                      <span className="hidden sm:inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800/60 shadow-sm">
                        {isNe ? currentTool.badgeNe : currentTool.badgeEn}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                      {isNe ? currentTool.descNe : currentTool.descEn}
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('home')}
                    className="hidden md:flex items-center text-xs text-slate-300 hover:text-cyan-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors shrink-0 cursor-pointer font-bold"
                  >
                    <span>{isNe ? 'गृहपृष्ठ' : 'Home'}</span>
                  </button>
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

              {currentPage === 'admin' && (
                <AdminDashboard
                  lang={lang}
                  onNavigateHome={() => navigateTo('home')}
                />
              )}
            </div>

            {/* Bottom Navigation Return Strip */}
            <div className="p-4 rounded-2xl bg-[#0e1628] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
              >
                <span>{isNe ? '← गृहपृष्ठमा फर्कनुहोस् (Go back to Home)' : '← Return to Main Homepage'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                  {isNe ? 'कुनै समस्या वा प्रश्न छ?' : 'Need immediate assistance?'}
                </span>
                <button
                  onClick={() => handleOpenFeedback(currentTool.titleEn)}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  {isNe ? 'हामीलाई बताउनुहोस्' : 'Send Feedback'}
                </button>
              </div>
            </div>
          </div>
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
    </div>
  );
}
