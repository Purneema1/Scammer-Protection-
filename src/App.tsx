import React, { useState } from 'react';
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
import { Language } from './types';
import { t } from './translations';

export type PageView =
  | 'home'
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

  const currentT = t[lang];
  const isNe = lang === 'ne';

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* ======================================================== */}
        {/* VIEW 1: HOME PAGE (DASHBOARD OVERVIEW & SERVICE PORTAL) */}
        {/* ======================================================== */}
        {currentPage === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. TOP SECTION: RECHARTS SCAM DASHBOARD FOR NEPAL */}
            <NepalScamDashboard
              lang={lang}
              onSelectScamType={(tool) => navigateTo(tool)}
            />

            {/* 2. HERO BANNER WITH QUICK ACCESS CTA BUTTONS */}
            <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#131f37] via-[#0e172b] to-[#121c33] border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-[11px] font-semibold text-cyan-300">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isNe ? 'अनलाइन ठगी रोकथाम पोर्टल' : 'AI-Powered Scam Defense Portal'}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {isNe ? (
                      <>
                        शंकास्पद अफर वा सन्देश <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                          पैसा पठाउनुअघि नै जाँच्नुहोस्
                        </span>
                      </>
                    ) : (
                      <>
                        Verify Questionable Offers <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                          Before Transferring Money
                        </span>
                      </>
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isNe
                      ? 'तलका सेवाहरू मध्ये कुनै पनि छान्नुहोस्। छुट्टै पेजमा आफ्नो सन्देश, लिंक, सपिङ अफर, फोटो वा आवाजको विवरण राखेर तत्काल जोखिम विश्लेषण प्राप्त गर्नुहोस्।'
                      : 'Choose any tool below to open its dedicated checker page. Inspect SMS, URLs, marketplace offers, screenshots, or voice recordings.'}
                  </p>
                </div>

                {/* Banner CTA Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-64">
                  <button
                    onClick={() => navigateTo('chat')}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>{isNe ? '🤖 AI सुरक्षा च्याटबट (Free)' : '🤖 Ask AI Cyber Chatbot'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigateTo('message')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span>{isNe ? 'सन्देश / SMS जाँच्नुहोस्' : 'Check Message'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => navigateTo('shopping')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      <span>{isNe ? 'किनमेल ठगी जाँच्नुहोस्' : 'Check Shopping Scam'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => navigateTo('rescue')}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs sm:text-sm border border-rose-800/50 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <LifeBuoy className="w-4 h-4 text-rose-400" />
                      <span>{isNe ? 'ठगीमा परेको छु (SOS)' : "I'm Scammed (Rescue)"}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3. EMERGENCY POLICE HELPLINE NOTIFICATION STRIP */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0e1b2f] to-rose-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-900/60 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {isNe
                      ? 'नेपाल प्रहरी साइबर ब्युरो आधिकारिक आपतकालीन हटलाइन'
                      : 'Nepal Police Cyber Bureau Official Helpline'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {isNe
                      ? 'फोन: ०१-४२११३०४ | आपतकालीन: १०० | इमेल: cyberbureau@nepalpolice.gov.np'
                      : 'Hotline: +977-1-4211304 | Emergency: 100 | cyberbureau@nepalpolice.gov.np'}
                  </span>
                </div>
              </div>
              <a
                href="tel:014211304"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold shrink-0 transition-colors"
              >
                {isNe ? '📞 फोन गर्नुहोस् (०१-४२११३०४)' : '📞 Call 01-4211304'}
              </a>
            </div>

            {/* 4. PRIMARY ALL TOOLS PORTAL GRID (DEDICATED PAGES) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>{isNe ? 'ठगी जाँच तथा सुरक्षा सेवाहरू' : 'All Scam Protection Tools'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {isNe
                      ? 'तलको कुनै पनि कार्ड थिच्नुहोस् — छुट्टै पेज खुलेर विवरण राखी तुरुन्त जाँच गर्न सकिनेछ।'
                      : 'Click any tool to open its dedicated page and submit details for analysis.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Message Checker Card */}
                <div
                  onClick={() => navigateTo('message')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-cyan-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
                        {isNe ? 'SMS / WhatsApp' : 'SMS / WhatsApp'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {isNe ? '💬 सन्देश र SMS जाँच' : 'Check Message / SMS'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'SMS, WhatsApp वा च्याटमा आएका शंकास्पद सन्देश, बैंक चेतावनी वा पुरस्कार अफर पेस्ट गरी ठगीका संकेत जाँच्नुहोस्।'
                          : 'Inspect texts, prize lottery notices, urgent bank alerts, or WhatsApp messages for fraud red flags.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>{isNe ? 'छुट्टै पेजमा जाँच्नुहोस्' : 'Open Dedicated Page'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Link Checker Card */}
                <div
                  onClick={() => navigateTo('link')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-teal-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-950/70 text-teal-300 border border-teal-800/40">
                        {isNe ? 'फिसिङ / URL' : 'Phishing URL'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        {isNe ? '🔗 वेबसाइट वा लिंक जाँच' : 'Check Link / URL'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'बैंक, इसेवा वा वालेटका नक्कली फिसिङ वेबसाइट र शंकास्पद लिंक राखेर सुरक्षा अवस्था जाँच्नुहोस्।'
                          : 'Check fake banking logins, cloned payment gateways, and deceptive domain names.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                    <span>{isNe ? 'छुट्टै पेजमा जाँच्नुहोस्' : 'Open Dedicated Page'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Shopping Scam Checker Card */}
                <div
                  onClick={() => navigateTo('shopping')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-cyan-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
                        {isNe ? '३२% ठगी हिस्सा' : '#1 Risk Type'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {isNe ? '🛍️ किनमेल ठगी जाँच (Shopping)' : 'Shopping Scam Checker'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'Facebook Marketplace, TikTok र Instagram का सस्तो अफर, अग्रिम भुक्तानी (Advance) र नक्कली पेज जाँच्नुहोस्।'
                          : 'Verify extreme discounts, upfront delivery charges, and seller legitimacy before buying.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>{isNe ? 'छुट्टै पेजमा जाँच्नुहोस्' : 'Open Dedicated Page'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Photo / Screenshot Checker Card */}
                <div
                  onClick={() => navigateTo('photo')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-sky-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-700/50 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-950/70 text-sky-300 border border-sky-800/40">
                        {isNe ? 'AI Vision & OCR' : 'AI Vision & OCR'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {isNe ? '📸 फोटो वा स्क्रिनसट जाँच' : 'Photo & Screenshot Check'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'विज्ञापन वा च्याटको स्क्रिनसट अपलोड गर्नुहोस्। AI Vision ले अक्षर र संकेतहरू पढेर ठगी जोखिम देखाउँछ।'
                          : 'Upload screenshots of suspicious chats, ads, or QR codes. Text and visual clues extracted.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                    <span>{isNe ? 'छुट्टै पेजमा जाँच्नुहोस्' : 'Open Dedicated Page'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 5. Voice Scam Assistant Card */}
                <div
                  onClick={() => navigateTo('voice')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-amber-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Mic className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/40">
                        {isNe ? 'नेपाली बोली + आवाज' : 'Nepali Voice'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {isNe ? '🎙️ आवाजबाट जाँच (Voice Assistant)' : 'Voice Scam Assistant'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'लेख्न नपर्ने! माइक बटन थिचेर नेपालीमै बोल्नुहोस् र नतिजा पनि नेपाली आवाजमै सुन्नुहोस्।'
                          : 'Hands-free scam checking: Speak your situation in Nepali and listen to real-time audio analysis.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    <span>{isNe ? 'छुट्टै पेजमा जाँच्नुहोस्' : 'Open Dedicated Page'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 6. AI Cyber Defense Chatbot Card */}
                <div
                  onClick={() => navigateTo('chat')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-emerald-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden ring-1 ring-emerald-500/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <Bot className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                        {isNe ? '१००% निःशुल्क AI' : '100% Free AI'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {isNe ? '🤖 AI साइबर सुरक्षा सल्लाहकार' : 'AI Cyber Defense Chatbot'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'गुगल जेमिनाई AI सँग नेपालीमै प्रत्यक्ष कुराकानी गर्नुहोस् — इसेवा, खल्ती, नक्कली अफर र साइबर ब्युरोबारे कुनै पनि प्रश्न सोध्नुहोस्।'
                          : 'Chat directly in Nepali or English with Gemini AI specialist on online scams, wallet security, and recovery advice.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                    <span>{isNe ? 'छुट्टै च्याट पेज खोल्नुहोस्' : 'Open Dedicated Chat'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 7. Emergency Rescue Card */}
                <div
                  onClick={() => navigateTo('rescue')}
                  className="p-5 rounded-2xl bg-[#131728] hover:bg-[#1b1c35] border border-rose-900/50 hover:border-rose-500/70 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                        <LifeBuoy className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 animate-pulse">
                        {isNe ? 'तत्काल उद्धार (SOS)' : 'Emergency Help'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                        {isNe ? '🆘 ठगीमा परिसक्नुभयो? (Rescue)' : "I'm Scammed (Rescue Checklist)"}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {isNe
                          ? 'पैसा पठाइसकेको, पासवर्ड दिएको वा खाता ह्याक भएको अवस्थामा थप क्षति रोक्न तत्काल चाल्नुपर्ने कदमहरू।'
                          : 'Immediate damage mitigation steps: Freezing wallets, reversing transactions, and locking compromised accounts.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                    <span>{isNe ? 'उद्धार चेकलिस्ट हेर्नुहोस्' : 'Open Rescue Checklist'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 7. Cyber Bureau Complaint Drafter */}
                <div
                  onClick={() => navigateTo('complaint')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-emerald-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                        {isNe ? 'प्रहरी उजुरी' : 'Police Petition'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {isNe ? '📄 उजुरी मस्यौदा (Police Complaint)' : 'Police Complaint Drafter'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'नेपाल प्रहरी साइबर ब्युरोमा दर्ता गर्न आवश्यक औपचारिक उजुरी निवेदन, प्रमाण सूचीसहित स्वतः तयार गर्नुहोस्।'
                          : 'Generate an official written complaint petition ready to file at Nepal Police Cyber Bureau.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                    <span>{isNe ? 'उजुरी फारम भर्नुहोस्' : 'Draft Police Complaint'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 8. Scam Encyclopedia Card */}
                <div
                  onClick={() => navigateTo('library')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-indigo-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">
                        {isNe ? 'ज्ञान केन्द्र' : 'Scam Library'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {isNe ? '📚 नेपाल ठगी ज्ञान केन्द्र' : 'Nepal Scam Encyclopedia'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'टेलिग्राम जब टास्क, चिट्ठा, नक्कली पार्सल र ब्ल्याकमेलिङ जस्ता ठगीका शैली र बच्ने उपायहरू।'
                          : 'Browse real-world scams active in Nepal with common templates, psychological tricks, and defenses.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>{isNe ? 'ज्ञान केन्द्र पढ्नुहोस्' : 'Explore Directory'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 9. Privacy & Safe Practices */}
                <div
                  onClick={() => navigateTo('privacy')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-slate-600 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                        {isNe ? '१००% निजी' : '100% Private'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {isNe ? '🔒 गोपनीयता र सुरक्षा प्रतिवद्धता' : 'Privacy & Security Guarantee'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'तपाईंको सन्देश वा फोन नम्बर सर्भरमा सुरक्षित हुँदैन। ब्राउजरमै विश्लेषण र गोपनीयताको पूर्ण प्रत्याभूति।'
                          : 'Zero persistent storage of credentials. Safe auto-redaction of passwords and phone numbers.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300">
                    <span>{isNe ? 'नीति हेर्नुहोस्' : 'View Privacy Policy'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 10. Admin Portal Card (Requested by User) */}
                <div
                  onClick={() => navigateTo('admin')}
                  className="p-5 rounded-2xl bg-[#121c33] hover:bg-[#162444] border border-cyan-800/60 hover:border-cyan-400 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden ring-1 ring-cyan-500/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-600/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                        {isNe ? 'व्यवस्थापक कक्ष' : 'Admin Panel'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {isNe ? '🛡️ व्यवस्थापक प्यानल (Admin Dashboard)' : 'Admin Control Dashboard'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {isNe
                          ? 'ग्राहकहरूले कुन-कुन सन्देश वा लिंक जाँचे, एआईले कस्तो समाधान दियो, र प्रयोगकर्ताका प्रतिक्रिया तथा समस्याहरूको सम्पूर्ण नियन्त्रण।'
                          : 'Inspect customer scan records, AI verdicts and solutions, user feedback, and resolve customer support tickets.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-cyan-800/60 flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                    <span>{isNe ? 'एडमिन प्यानल खोल्नुहोस्' : 'Open Admin Portal'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 11. Customer Feedback & Issue Reporting Card */}
                <div
                  onClick={() => handleOpenFeedback('Home Tool Grid')}
                  className="p-5 rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-amber-900/40 hover:border-amber-500/60 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/40">
                        {isNe ? 'प्रतिक्रिया / समस्या' : 'User Feedback'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {isNe ? '⭐ प्रतिक्रिया, समस्या दर्ता र छलफल' : 'Feedback, Issues & Forum'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isNe
                          ? 'एपलाई ५-तारे रेटिङ दिनुहोस्, नयाँ ठगीको समस्या टिकट दर्ता गर्नुहोस् वा नागरिक सचेतना फोरममा कमेन्ट गर्नुहोस्।'
                          : 'Submit star ratings, report new scam tactics with support tickets, and participate in the community scam discussion.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    <span>{isNe ? 'प्रतिक्रिया वा समस्या पठाउनुहोस्' : 'Submit Feedback / Issue'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. TRUST PILLARS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800 flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">
                    {isNe ? '१००% निजी र इन-ब्राउजर' : '100% Private & In-Browser'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isNe ? 'कुनै पनि पासवर्ड सुरक्षित हुँदैन' : 'Zero credential retention'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800 flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">
                    {isNe ? 'नेपाल प्रहरी साइबर ब्युरो' : 'Nepal Police Cyber Bureau'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isNe ? 'हटलाइन: ०१-४२११३०४' : 'Official Hotline: 01-4211304'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121c33]/70 border border-slate-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">
                    {isNe ? 'नियम + AI विश्लेषण' : 'Heuristics + AI Vision'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isNe ? 'नेपाली सन्दर्भ र स्थानीय ठगी ढाँचा' : 'Tuned for Nepal fraud modalities'}
                  </span>
                </div>
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
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-600/50 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                  title={isNe ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isNe ? '← गृहपृष्ठ (Home)' : '← Back to Home'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                  <span
                    onClick={() => navigateTo('home')}
                    className="hover:text-cyan-300 cursor-pointer"
                  >
                    {isNe ? 'गृहपृष्ठ' : 'Home'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
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
                    💬 {isNe ? 'सन्देश' : 'Message'}
                  </button>
                )}
                {currentPage !== 'link' && (
                  <button
                    onClick={() => navigateTo('link')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🔗 {isNe ? 'लिंक' : 'Link'}
                  </button>
                )}
                {currentPage !== 'shopping' && (
                  <button
                    onClick={() => navigateTo('shopping')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🛍️ {isNe ? 'किनमेल' : 'Shopping'}
                  </button>
                )}
                {currentPage !== 'photo' && (
                  <button
                    onClick={() => navigateTo('photo')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    📸 {isNe ? 'फोटो' : 'Photo'}
                  </button>
                )}
                {currentPage !== 'voice' && (
                  <button
                    onClick={() => navigateTo('voice')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🎙️ {isNe ? 'आवाज' : 'Voice'}
                  </button>
                )}
                {currentPage !== 'chat' && (
                  <button
                    onClick={() => navigateTo('chat')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🤖 {isNe ? 'AI च्याट' : 'AI Chat'}
                  </button>
                )}
                {currentPage !== 'rescue' && (
                  <button
                    onClick={() => navigateTo('rescue')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🆘 {isNe ? 'उद्धार' : 'Rescue'}
                  </button>
                )}
                {currentPage !== 'admin' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    🛡️ {isNe ? 'एडमिन' : 'Admin'}
                  </button>
                )}
              </div>
            </div>

            {/* Dedicated Page Heading Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121c33] to-[#0e1628] border border-slate-800/90 shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                  {React.createElement(currentTool.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {isNe ? currentTool.titleNe : currentTool.titleEn}
                    </h1>
                    <span className="hidden sm:inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      {isNe ? currentTool.badgeNe : currentTool.badgeEn}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                    {isNe ? currentTool.descNe : currentTool.descEn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('home')}
                className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{isNe ? 'गृहपृष्ठ' : 'Home'}</span>
              </button>
            </div>

            {/* Render the Dedicated Component */}
            <div className="rounded-3xl">
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
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-2xl border border-cyan-300/40 cursor-pointer active:scale-95 transition-all group"
            title={isNe ? 'प्रतिक्रिया वा समस्या पठाउनुहोस्' : 'Send Feedback or Raise Issue'}
          >
            <MessageSquare className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">
              {isNe ? 'प्रतिक्रिया / समस्या दर्ता' : 'Feedback & Issue Ticket'}
            </span>
            <span className="sm:hidden">{isNe ? 'प्रतिक्रिया' : 'Feedback'}</span>
          </button>
        </div>
      )}

      {/* Global Footer */}
      <footer className="mt-auto bg-[#080d1a] border-t border-slate-800/80 px-4 py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">Scam Protection AI (ठगी सुरक्षा)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              v1.2 Nepal
            </span>
          </div>

          <p className="text-center md:text-right text-[11px] max-w-md text-slate-400">
            {isNe
              ? 'कुनै पनि AI ले १००% ठगी पत्ता लगाउने ग्यारेन्टी दिन सक्दैन। आर्थिक कारोबार गर्नुअघि सधैँ आधिकारिक निकायबाट पुष्टि गर्नुहोस्।'
              : 'Automated guidance tool. Always confirm directly through official banking or law enforcement channels.'}
          </p>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => navigateTo('home')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isNe ? 'गृहपृष्ठ' : 'Home'}
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('privacy')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isNe ? 'गोपनीयता' : 'Privacy'}
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer font-semibold"
            >
              {isNe ? 'व्यवस्थापक (Admin)' : 'Admin'}
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenFeedback('Footer')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isNe ? 'प्रतिक्रिया' : 'Feedback'}
            </button>
          </div>
        </div>
      </footer>

      {/* Feedback / False Positive Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        lang={lang}
        initialContext={feedbackContext}
      />
    </div>
  );
}
