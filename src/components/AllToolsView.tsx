import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { PageView } from '../App';
import { TOOL_PHOTOS } from '../constants/toolImages';
import { getAppMediaSettings, AppMediaSettings } from '../utils/mediaStorage';
import { toNepaliDigits } from '../utils/numberFormat';

interface AllToolsViewProps {
  lang: Language;
  onNavigate: (page: PageView) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenFeedback: (context: string) => void;
}

type CategoryFilter = 'all' | 'message' | 'link' | 'shopping' | 'ai' | 'emergency';

export const AllToolsView: React.FC<AllToolsViewProps> = ({
  lang,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenFeedback,
}) => {
  const isNe = lang === 'ne';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [mediaSettings, setMediaSettings] = useState<AppMediaSettings>(getAppMediaSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setMediaSettings(getAppMediaSettings());
    };
    window.addEventListener('app_media_changed', handleUpdate);
    return () => window.removeEventListener('app_media_changed', handleUpdate);
  }, []);

  const categories = [
    { id: 'all' as const, labelNe: 'सबै टुलहरू', labelEn: 'All Tools' },
    { id: 'message' as const, labelNe: 'सन्देश र SMS', labelEn: 'SMS & Chat' },
    { id: 'link' as const, labelNe: 'वेबसाइट र लिंक', labelEn: 'Links & URLs' },
    { id: 'shopping' as const, labelNe: 'अनलाइन किनमेल', labelEn: 'Shopping' },
    { id: 'ai' as const, labelNe: 'AI र आवाज', labelEn: 'AI & Voice' },
    { id: 'emergency' as const, labelNe: 'आपतकालीन र कानुनी', labelEn: 'Emergency & Legal' },
  ];

  const tools = [
    {
      id: 'message' as PageView,
      category: 'message' as CategoryFilter,
      titleNe: 'सन्देश र SMS जाँच (Message Checker)',
      titleEn: 'Suspicious Message & SMS Checker',
      descNe: 'SMS, WhatsApp वा च्याटमा आएका शंकास्पद सन्देश, बैंक चेतावनी वा पुरस्कार अफर पेस्ट गरी ठगीका संकेत जाँच्नुहोस्।',
      descEn: 'Inspect texts, prize lottery notices, urgent bank alerts, or WhatsApp messages for fraud red flags.',
      badgeNe: 'SMS / WhatsApp',
      badgeEn: 'SMS / WhatsApp',
      accent: 'cyan',
      photoKey: 'message',
      keywords: ['sms', 'whatsapp', 'viber', 'telegram', 'otp', 'lottery', 'prize', 'bank', 'text', 'chat', 'सन्देश', 'मेसेज', 'चिठ्ठा'],
    },
    {
      id: 'link' as PageView,
      category: 'link' as CategoryFilter,
      titleNe: 'वेबसाइट वा लिंक जाँच (Link Checker)',
      titleEn: 'Phishing URL & Link Safety Check',
      descNe: 'बैंक, इसेवा वा वालेटका नक्कली फिसिङ वेबसाइट र शंकास्पद लिंक राखेर सुरक्षा अवस्था जाँच्नुहोस्।',
      descEn: 'Check fake banking logins, cloned payment gateways, and deceptive domain names.',
      badgeNe: 'फिसिङ / URL',
      badgeEn: 'Phishing URL',
      accent: 'teal',
      photoKey: 'link',
      keywords: ['link', 'url', 'website', 'phishing', 'domain', 'esewa', 'khalti', 'bank', 'लिंक', 'वेबसाइट', 'फिसिङ', 'इसेवा', 'खल्ती'],
    },
    {
      id: 'shopping' as PageView,
      category: 'shopping' as CategoryFilter,
      titleNe: 'किनमेल ठगी जाँच (Shopping Scam Checker)',
      titleEn: 'Social Media Shopping Scam Verifier',
      descNe: 'Facebook Marketplace, TikTok र Instagram का सस्तो अफर, अग्रिम भुक्तानी (Advance) र नक्कली पेज जाँच्नुहोस्।',
      descEn: 'Verify extreme discounts, upfront delivery charges, and seller legitimacy before buying.',
      badgeNe: '३२% ठगी हिस्सा',
      badgeEn: '#1 Risk Type',
      accent: 'cyan',
      photoKey: 'shopping',
      keywords: ['shopping', 'facebook', 'marketplace', 'tiktok', 'instagram', 'advance', 'cod', 'seller', 'deal', 'delivery', 'सपिङ', 'किनमेल', 'अफर'],
    },
    {
      id: 'photo' as PageView,
      category: 'ai' as CategoryFilter,
      titleNe: 'फोटो वा स्क्रिनसट जाँच (Photo OCR Check)',
      titleEn: 'Photo & Screenshot AI Vision Check',
      descNe: 'विज्ञापन वा च्याटको स्क्रिनसट अपलोड गर्नुहोस्। AI Vision ले अक्षर र संकेतहरू पढेर ठगी जोखिम देखाउँछ।',
      descEn: 'Upload screenshots of suspicious chats, ads, or QR codes. Text and visual clues extracted.',
      badgeNe: 'AI Vision & OCR',
      badgeEn: 'AI Vision & OCR',
      accent: 'sky',
      photoKey: 'photo',
      keywords: ['photo', 'image', 'screenshot', 'ocr', 'qr', 'receipt', 'vision', 'camera', 'फोटो', 'स्क्रिनसट', 'चित्र'],
    },
    {
      id: 'voice' as PageView,
      category: 'ai' as CategoryFilter,
      titleNe: 'आवाजबाट जाँच (Nepali Voice Assistant)',
      titleEn: 'Nepali Audio & Voice Scam Assistant',
      descNe: 'लेख्न नपर्ने! माइक बटन थिचेर नेपालीमै बोल्नुहोस् र नतिजा पनि नेपाली आवाजमै सुन्नुहोस्।',
      descEn: 'Hands-free scam checking: Speak your situation in Nepali and listen to real-time audio analysis.',
      badgeNe: 'नेपाली बोली + आवाज',
      badgeEn: 'Nepali Voice',
      accent: 'amber',
      photoKey: 'voice',
      keywords: ['voice', 'audio', 'call', 'phone', 'mic', 'speech', 'nepali', 'recording', 'आवाज', 'अडियो', 'बोली', 'फोन'],
    },
    {
      id: 'chat' as PageView,
      category: 'ai' as CategoryFilter,
      titleNe: 'AI साइबर सुरक्षा सल्लाहकार (Gemini AI Chat)',
      titleEn: 'AI Cyber Defense Specialist Chatbot',
      descNe: 'गुगल जेमिनाई AI सँग नेपालीमै प्रत्यक्ष कुराकानी गर्नुहोस् — इसेवा, खल्ती, नक्कली अफर र साइबर ब्युरोबारे कुनै पनि प्रश्न सोध्नुहोस्।',
      descEn: 'Chat directly in Nepali or English with Gemini AI specialist on online scams, wallet security, and recovery advice.',
      badgeNe: '१००% निःशुल्क AI',
      badgeEn: '100% Free AI',
      accent: 'emerald',
      photoKey: 'chat',
      keywords: ['ai', 'chat', 'chatbot', 'advisor', 'question', 'help', 'esewa', 'khalti', 'cyber', 'सल्लाहकार', 'च्याट', 'प्रश्न'],
    },
    {
      id: 'rescue' as PageView,
      category: 'emergency' as CategoryFilter,
      titleNe: '🆘 ठगीमा परिसक्नुभयो? (Rescue Checklist)',
      titleEn: "I'm Scammed (Immediate Rescue SOS)",
      descNe: 'पैसा पठाइसकेको, पासवर्ड दिएको वा खाता ह्याक भएको अवस्थामा थप क्षति रोक्न तत्काल चाल्नुपर्ने कदमहरू।',
      descEn: 'Immediate damage mitigation steps: Freezing wallets, reversing transactions, and locking compromised accounts.',
      badgeNe: 'तत्काल उद्धार (SOS)',
      badgeEn: 'Emergency Help',
      accent: 'rose',
      photoKey: 'rescue',
      keywords: ['rescue', 'sos', 'emergency', 'scammed', 'hacked', 'freeze', 'wallet', 'bank', 'otp', 'money', 'उद्धार', 'आपतकालीन', 'ह्याक'],
    },
    {
      id: 'complaint' as PageView,
      category: 'emergency' as CategoryFilter,
      titleNe: 'उजुरी मस्यौदा (Police Complaint Drafter)',
      titleEn: 'Cyber Bureau Police Complaint Drafter',
      descNe: 'नेपाल प्रहरी साइबर ब्युरोमा दर्ता गर्न आवश्यक औपचारिक उजुरी निवेदन, प्रमाण सूचीसहित स्वतः तयार गर्नुहोस्।',
      descEn: 'Generate an official written complaint petition ready to file at Nepal Police Cyber Bureau.',
      badgeNe: 'प्रहरी उजुरी',
      badgeEn: 'Police Petition',
      accent: 'emerald',
      photoKey: 'complaint',
      keywords: ['complaint', 'police', 'cyber bureau', 'petition', 'report', 'fir', 'legal', 'उजुरी', 'प्रहरी', 'निवेदन', 'साइबर ब्युरो'],
    },
    {
      id: 'library' as PageView,
      category: 'emergency' as CategoryFilter,
      titleNe: 'नेपाल ठगी ज्ञान केन्द्र (Scam Encyclopedia)',
      titleEn: 'Nepal Scam Directory & Awareness Hub',
      descNe: 'टेलिग्राम जब टास्क, चिट्ठा, नक्कली पार्सल र ब्ल्याकमेलिङ जस्ता ठगीका शैली र बच्ने उपायहरू।',
      descEn: 'Browse real-world scams active in Nepal with common templates, psychological tricks, and defenses.',
      badgeNe: 'ज्ञान केन्द्र',
      badgeEn: 'Scam Library',
      accent: 'indigo',
      photoKey: 'library',
      keywords: ['library', 'encyclopedia', 'directory', 'awareness', 'telegram', 'parcel', 'blackmail', 'job', 'ज्ञान', 'सचेतना', 'प्रकार'],
    },
    {
      id: 'privacy' as PageView,
      category: 'emergency' as CategoryFilter,
      titleNe: 'गोपनीयता र सुरक्षा प्रतिवद्धता (Privacy)',
      titleEn: 'Privacy & Security Guarantee',
      descNe: 'तपाईंको सन्देश वा फोन नम्बर सर्भरमा सुरक्षित हुँदैन। ब्राउजरमै विश्लेषण र गोपनीयताको पूर्ण प्रत्याभूति।',
      descEn: 'Zero persistent storage of credentials. Safe auto-redaction of passwords and phone numbers.',
      badgeNe: '१००% निजी',
      badgeEn: '100% Private',
      accent: 'slate',
      photoKey: 'privacy',
      keywords: ['privacy', 'security', 'safe', 'redact', 'data', 'private', 'गोपनीयता', 'निजी', 'सुरक्षा'],
    },
    {
      id: 'video' as PageView,
      category: 'emergency' as CategoryFilter,
      titleNe: 'साइबर सचेतना भिडियो ट्युटोरियल (Awareness Videos)',
      titleEn: 'Cyber Awareness Video Tutorials Hub',
      descNe: 'बैंकिङ OTP, नक्कली अनलाइन पसल, टेलिग्राम जब र साइबर ब्युरो उजुरीसम्बन्धी आधिकारिक भिडियो हेर्नुहोस्।',
      descEn: 'Watch video guides on OTP scams, fake online stores, Telegram tasks, and filing police petitions.',
      badgeNe: '🎥 भिडियो केन्द्र',
      badgeEn: 'Video Center',
      accent: 'rose',
      photoKey: 'videos',
      keywords: ['video', 'tutorial', 'youtube', 'guide', 'watch', 'awareness', 'भिडियो', 'ट्युटोरियल'],
    },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTools = tools.filter((t) => {
    const matchesCategory =
      activeCategory === 'all' || t.category === activeCategory;
    if (!normalizedQuery) return matchesCategory;
    const matchesSearch =
      t.titleNe.toLowerCase().includes(normalizedQuery) ||
      t.titleEn.toLowerCase().includes(normalizedQuery) ||
      t.descNe.toLowerCase().includes(normalizedQuery) ||
      t.descEn.toLowerCase().includes(normalizedQuery) ||
      t.badgeNe.toLowerCase().includes(normalizedQuery) ||
      t.badgeEn.toLowerCase().includes(normalizedQuery) ||
      t.keywords.some((kw) => kw.toLowerCase().includes(normalizedQuery));
    return matchesCategory && matchesSearch;
  });

  const accountSearchHaystack = [
    'citizen account',
    'my account',
    'sign in',
    'register',
    'login',
    'profile',
    'नागरिक खाता',
    'मेरो खाता',
    'साइन इन',
    'दर्ता',
    'लगइन',
    currentUser?.name || '',
  ]
    .join(' ')
    .toLowerCase();

  const feedbackSearchHaystack = [
    'feedback & issue reporting',
    'submit feedback',
    'report',
    'rating',
    'problem',
    'प्रतिक्रिया तथा नयाँ ठगी रिपोर्ट',
    'प्रतिक्रिया',
    'रिपोर्ट',
    'गुनासो',
  ]
    .join(' ')
    .toLowerCase();

  const showAccountCard =
    activeCategory === 'all' &&
    (!normalizedQuery || accountSearchHaystack.includes(normalizedQuery));
  const showFeedbackCard =
    activeCategory === 'all' &&
    (!normalizedQuery || feedbackSearchHaystack.includes(normalizedQuery));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Search and Category Bar */}
      <div
        className="p-4 sm:p-6 rounded-3xl border shadow-xl space-y-4"
        style={{
          backgroundColor: 'var(--app-card-bg)',
          borderColor: 'var(--app-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--app-text-main)' }}>
              <span>{isNe ? 'सबै ठगी जाँच तथा सुरक्षा टुलहरू' : 'All Scam Protection Tools'}</span>
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--app-text-muted)' }}>
              {isNe
                ? '१-क्लिकमा जुनसुकै टुल खोल्नुहोस् — विस्तृत विश्लेषण गरी तुरुन्त सुरक्षित रहनुहोस्।'
                : 'Open any tool in a single click for instant fraud detection and expert advice.'}
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-950 dark:text-white border border-cyan-300 dark:border-cyan-700 self-start sm:self-auto shrink-0 shadow-sm">
            <span className="text-cyan-950 dark:text-white font-black">
              {isNe ? `${toNepaliDigits(filteredTools.length)} वटा सेवाहरू उपलब्ध` : `${filteredTools.length} Tools Available`}
            </span>
          </span>
        </div>

        {/* Live Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isNe ? 'सुरक्षा टुल नाम वा कीवर्ड खोज्नुहोस्' : 'Search protection tools by name or keyword'}
              placeholder={
                isNe
                  ? 'टुल खोज्नुहोस् (उदा: SMS, eSewa, लिंक, सपिङ, पुलिस उजुरी, आवाज, QR)...'
                  : 'Search tools by name or keyword (e.g. SMS, eSewa, WhatsApp, bank, shopping, photo OCR, petition)...'
              }
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0b1220] border border-slate-300 dark:border-slate-700/80 text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={isNe ? 'खोज मेटाउनुहोस्' : 'Clear search'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {normalizedQuery && (
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-1">
              <span>
                {isNe
                  ? `"${searchQuery.trim()}" का लागि ${toNepaliDigits(filteredTools.length)} वटा टुल भेटिए`
                  : `Showing ${filteredTools.length} matching tool${filteredTools.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="font-bold text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                {isNe ? 'सबै देखाउनुहोस्' : 'Reset'}
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 border border-cyan-400 btn-cyan'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 shadow-xs'
              }`}
            >
              <span className={`font-bold ${activeCategory === cat.id ? 'text-slate-950 font-black' : 'text-slate-950 dark:text-white'}`}>
                {isNe ? cat.labelNe : cat.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State when search or filter yields 0 tools */}
      {filteredTools.length === 0 && !showAccountCard && !showFeedbackCard ? (
        <div
          className="p-8 sm:p-12 rounded-3xl border text-center space-y-3"
          style={{
            backgroundColor: 'var(--app-card-bg)',
            borderColor: 'var(--app-border)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
            {isNe ? 'कुनै मिल्दो टुल भेटिएन' : 'No matching tools found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {isNe
              ? `"${searchQuery.trim()}" सँग मिल्ने सुरक्षा टुल फेला परेन। अर्को शब्द राख्नुहोस् वा सबै टुल हेर्नुहोस्।`
              : `No protection tool matched "${searchQuery.trim()}". Try another keyword like SMS, URL, eSewa, shopping, or police.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-all btn-cyan"
          >
            <span>{isNe ? 'खोज र फिल्टर हटाउनुहोस्' : 'Show All Tools'}</span>
          </button>
        </div>
      ) : (
        /* Tools Cards Grid (1-Click Launch) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const photo = TOOL_PHOTOS[tool.photoKey];
            const displayImage = mediaSettings.tools[tool.photoKey] || photo?.image;

            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="rounded-2xl bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#131f37] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 shadow-lg transition-all duration-150 cursor-pointer group flex flex-col justify-between overflow-hidden active:scale-[0.98]"
              >
                {/* Clean, unobstructed high-definition photo without icon overlays */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={displayImage}
                    alt={isNe ? photo?.altNe : photo?.altEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-100 filter brightness-105 contrast-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white border border-slate-700 shadow-sm">
                      {isNe ? tool.badgeNe : tool.badgeEn}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                      {isNe ? tool.titleNe : tool.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {isNe ? tool.descNe : tool.descEn}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
                    <span>{isNe ? '१-क्लिकमा खोल्नुहोस् →' : 'Open in 1 Click →'}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Citizen Account Quick Card */}
          {showAccountCard && (
            <div
              onClick={() => onOpenAuth('signin')}
              className="rounded-2xl bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#131f37] border border-slate-200 dark:border-cyan-800/40 hover:border-cyan-400/80 shadow-lg transition-all duration-150 cursor-pointer group flex flex-col justify-between overflow-hidden active:scale-[0.98]"
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={mediaSettings.tools.account || TOOL_PHOTOS.account.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-100 filter brightness-105 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white border border-slate-700 shadow-sm">
                    {currentUser ? (isNe ? 'खाता सक्रिय' : 'Logged In') : (isNe ? 'नागरिक खाता' : 'Citizen Portal')}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    {currentUser
                      ? (isNe ? `मेरो खाता (${currentUser.name})` : `My Account (${currentUser.name})`)
                      : (isNe ? 'नागरिक खाता (Sign In / Register)' : 'Citizen Account')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {isNe
                      ? 'सुरक्षा स्क्यान इतिहास हेर्नुहोस्, पासवर्ड रिसेट गर्नुहोस् वा नयाँ खाता खोल्नुहोस्।'
                      : 'Track your safety scan history, reset password, or sign up for free.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
                  <span>{currentUser ? (isNe ? 'खाता हेर्नुहोस् →' : 'Manage →') : (isNe ? 'साइन इन / दर्ता →' : 'Sign In →')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Feedback Card */}
          {showFeedbackCard && (
            <div
              onClick={() => onOpenFeedback('All Tools View')}
              className="rounded-2xl bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#131f37] border border-slate-200 dark:border-amber-900/40 hover:border-amber-500/60 shadow-lg transition-all duration-150 cursor-pointer group flex flex-col justify-between overflow-hidden active:scale-[0.98]"
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={mediaSettings.tools.feedback || TOOL_PHOTOS.feedback.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-100 filter brightness-105 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-300 border border-amber-800/60 shadow-sm">
                    {isNe ? 'प्रतिक्रिया' : 'Feedback'}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {isNe ? 'प्रतिक्रिया तथा नयाँ ठगी रिपोर्ट' : 'Feedback & Issue Reporting'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {isNe
                      ? 'एपलाई ५-तारे रेटिङ दिनुहोस् वा नयाँ ठगीको समस्या दर्ता गर्नुहोस्।'
                      : 'Submit feedback ratings or report new suspicious tactics to our team.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300">
                  <span>{isNe ? 'प्रतिक्रिया पठाउनुहोस् →' : 'Submit Feedback →'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
