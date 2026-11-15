import React, { useState } from 'react';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { PageView } from '../App';
import { toNepaliDigits } from '../utils/numberFormat';

interface FAQSectionProps {
  lang: Language;
  onNavigate: (page: PageView) => void;
  onOpenFeedback?: (context: string) => void;
}

type FAQCategory = 'all' | 'scams' | 'app' | 'emergency';

interface FAQItem {
  id: string;
  category: Exclude<FAQCategory, 'all'>;
  categoryLabelNe: string;
  categoryLabelEn: string;
  questionNe: string;
  questionEn: string;
  answerNe: string;
  answerEn: string;
  actionLabelNe?: string;
  actionLabelEn?: string;
  actionPage?: PageView;
  secondaryActionLabelNe?: string;
  secondaryActionLabelEn?: string;
  secondaryActionPage?: PageView;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  lang,
  onNavigate,
  onOpenFeedback,
}) => {
  const isNe = lang === 'ne';
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openId, setOpenId] = useState<string | null>('scam-money-sent');

  const categories: { id: FAQCategory; labelNe: string; labelEn: string }[] = [
    { id: 'all', labelNe: 'सबै प्रश्नहरू', labelEn: 'All Questions' },
    { id: 'scams', labelNe: 'ठगी पहिचान र बच्ने उपाय', labelEn: 'Scam Safety' },
    { id: 'app', labelNe: 'एप र टुल प्रयोग', labelEn: 'Using the App' },
    { id: 'emergency', labelNe: 'उजुरी र गोपनीयता', labelEn: 'Reporting & Privacy' },
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'scam-money-sent',
      category: 'emergency',
      categoryLabelNe: 'आपतकालीन उद्धार',
      categoryLabelEn: 'Emergency Response',
      questionNe: 'ठगलाई पैसा पठाइसकेँ वा OTP दिइसकेँ भने तुरुन्त के गर्ने?',
      questionEn: 'What should I do immediately if I already sent money or shared my OTP?',
      answerNe:
        'पहिले २ घण्टा ("गोल्डेन आवर") अत्यन्तै महत्वपूर्ण हुन्छ। तुरुन्तै आफ्नो बैंक वा डिजिटल वालेट (eSewa / Khalti / IME Pay) को ग्राहक सेवामा फोन गरी प्राप्तकर्ताको खाता र कारोबार रोक्न (Hold / Freeze) अनुरोध गर्नुहोस्, खाताको पासवर्ड/MPIN बदल्नुहोस्, र नेपाल प्रहरी साइबर ब्युरो (०१-४२११३०४ वा आपतकालीन १००) मा खबर गर्नुहोस्। "पैसा फिर्ता ल्याइदिन्छु" भन्दै थप शुल्क माग्ने कुनै पनि अपरिचित व्यक्तिलाई विश्वास नगर्नुहोस्।',
      answerEn:
        'The first 2 hours ("Golden Hour") are critical. Immediately call your bank or digital wallet support (eSewa, Khalti, IME Pay) to request a transaction hold or recipient account freeze, change your MPIN/passwords right away, and contact Nepal Police Cyber Bureau (01-4211304 or emergency 100). Never pay any third-party "recovery agent" who promises to get your money back for a fee.',
      actionLabelNe: 'तत्काल उद्धार चेकलिस्ट खोल्नुहोस्',
      actionLabelEn: 'Open Rescue Checklist',
      actionPage: 'rescue',
      secondaryActionLabelNe: 'प्रहरी उजुरी मस्यौदा बनाउनुहोस्',
      secondaryActionLabelEn: 'Draft Police Complaint',
      secondaryActionPage: 'complaint',
    },
    {
      id: 'risk-score-meaning',
      category: 'app',
      categoryLabelNe: 'एप विश्लेषण',
      categoryLabelEn: 'Risk Analysis',
      questionNe: 'एपमा देखिने "ठगी जोखिम स्कोर (०–१००)" ले के अर्थ राख्छ र कति भरपर्दो छ?',
      questionEn: 'How does the 0–100 Scam Risk Score work and how accurate is it?',
      answerNe:
        'हाम्रो प्रणालीले सन्देश, लिंक र किनमेल अफरमा रहेका शंकास्पद शब्द, नक्कली डोमेन, अग्रिम भुक्तानीको दबाब र नेपालमा प्रचलित ठगीका ढाँचाहरू र AI विश्लेषण संयोजन गरी ० देखि १०० सम्मको स्कोर देखाउँछ। ०–२९ न्यून जोखिम, ३०–५९ मध्यम (सावधानी अपनाउनुहोस्), र ६०–१०० उच्च ठगी जोखिम हो। यद्यपि स्कोर कम देखिए पनि पैसा पठाउनुअघि सधैँ आधिकारिक नम्बर वा वेबसाइटबाट पुनः यकिन गर्नुहोस्।',
      answerEn:
        'Our scanner combines Nepal-specific fraud heuristics (urgency traps, fake wallet domains, advance-payment pressure) with AI analysis to generate a 0–100 score: 0–29 indicates Low Risk, 30–59 Medium Risk (verify independently), and 60–100 High Risk. Even if a score looks low, always confirm directly via an official phone number or verified store before transferring money.',
      actionLabelNe: 'सन्देश जाँच टुल खोल्नुहोस्',
      actionLabelEn: 'Check a Message',
      actionPage: 'message',
    },
    {
      id: 'whatsapp-lottery-kyc',
      category: 'scams',
      categoryLabelNe: 'फिसिङ र चिट्ठा',
      categoryLabelEn: 'Phishing & Lotteries',
      questionNe: 'WhatsApp/SMS मा आएको चिट्ठा, पार्सल वा "बैंक/eSewa KYC अपडेट" लिंक साँचो हुन सक्छ?',
      questionEn: 'I received a lottery, parcel fee, or "bank/eSewa KYC update" link on SMS/WhatsApp. Is it real?',
      answerNe:
        'होइन — नेपालका कुनै पनि बैंक, eSewa, Khalti वा सरकारी निकायले SMS वा WhatsApp मार्फत छोटो लिंक (जस्तै bit.ly वा अनौठो वेबसाइट) पठाएर OTP, PIN वा KYC अपडेट गर्न भन्दैनन्। त्यस्तै बिना दर्ता २५ लाख चिट्ठा वा विदेशबाट आएको उपहार छुटाउन भन्सार शुल्क पठाउन भन्नु १००% ठगी हो। लिंकमा क्लिक नगरी तुरुन्त लिंक जाँच टुलबाट परीक्षण गर्नुहोस्।',
      answerEn:
        'No. Legitimate Nepali banks, eSewa, Khalti, and government agencies never send shortened URLs or random domains via SMS/WhatsApp asking you to update KYC or enter your MPIN/OTP. Likewise, unsolicited lottery prizes or overseas parcels asking for "customs clearance fees" are classic scams. Do not tap the link—inspect it with our Link Checker first.',
      actionLabelNe: 'लिंक जाँच्नुहोस्',
      actionLabelEn: 'Inspect Link / URL',
      actionPage: 'link',
    },
    {
      id: 'social-shopping-safety',
      category: 'scams',
      categoryLabelNe: 'अनलाइन किनमेल',
      categoryLabelEn: 'Online Shopping',
      questionNe: 'Facebook, TikTok वा Instagram पसल नक्कली हो कि साँचो भनेर कसरी चिन्ने?',
      questionEn: 'How can I tell if a Facebook, TikTok, or Instagram seller is a scammer?',
      answerNe:
        'नक्कली पेजहरूले प्रायः बजार मूल्यभन्दा ४०–७०% सस्तो अफर राख्छन्, "स्टक सकिन लाग्यो" भनी हतार गराउँछन्, र सामान डेलिभरी हुनुअघि नै व्यक्तिगत मोबाइल वालेट नम्बरमा अग्रिम भुक्तानी (Advance / Delivery Charge) माग्छन्। कमेन्ट बन्द गरिएको छ कि छैन, पेजको पारदर्शिता र भौतिक पसल ठेगाना जाँच्नुहोस् — सुरक्षित रहन Cash on Delivery (COD) मात्र रोज्नुहोस्।',
      answerEn:
        'Fraudulent pages typically advertise 40–70% below market price, pressure you with "limited stock" timers, disable comments, and insist on advance payment or delivery fees to a personal wallet number before shipping. Always check page transparency, physical store location, and choose Cash on Delivery (COD) whenever possible.',
      actionLabelNe: 'किनमेल अफर जाँच्नुहोस्',
      actionLabelEn: 'Verify Shopping Offer',
      actionPage: 'shopping',
    },
    {
      id: 'photo-voice-no-typing',
      category: 'app',
      categoryLabelNe: 'फोटो र आवाज',
      categoryLabelEn: 'Photo & Voice Tools',
      questionNe: 'नेपाली वा अंग्रेजी टाइप गर्न गाह्रो लाग्छ भने कसरी ठगी जाँच्ने?',
      questionEn: 'Can I check a suspicious offer without typing long messages?',
      answerNe:
        'सक्नुहुन्छ! यदि तपाईंसँग शंकास्पद विज्ञापन, QR कोड वा च्याटको स्क्रिनसट छ भने "फोटो / स्क्रिनसट जाँच (OCR)" मा अपलोड गर्नुहोस्। अथवा "आवाजबाट जाँच" खोलेर माइक थिची नेपालीमै आफ्नो समस्या बोल्न सक्नुहुन्छ — प्रणालीले विश्लेषण गरी नेपाली आवाजमै जवाफ सुनाइदिन्छ।',
      answerEn:
        'Yes. You can upload any chat, ad, or QR screenshot directly into the Photo & Screenshot Checker (AI Vision OCR), or use the Nepali Voice Assistant to speak your concern hands-free and listen to the safety verdict aloud.',
      actionLabelNe: 'फोटो / स्क्रिनसट जाँच्नुहोस्',
      actionLabelEn: 'Open Photo Checker',
      actionPage: 'photo',
      secondaryActionLabelNe: 'आवाजबाट जाँच खोल्नुहोस्',
      secondaryActionLabelEn: 'Open Voice Assistant',
      secondaryActionPage: 'voice',
    },
    {
      id: 'privacy-data-handling',
      category: 'emergency',
      categoryLabelNe: 'डेटा र गोपनीयता',
      categoryLabelEn: 'Data & Privacy',
      questionNe: 'मैले जाँचका लागि पेस्ट गरेका सन्देश, नम्बर वा फोटो सर्भरमा सुरक्षित गरिन्छ?',
      questionEn: 'Are the messages, phone numbers, or screenshots I scan stored on a server?',
      answerNe:
        'तपाईंको गोपनीयता हाम्रो पहिलो प्राथमिकता हो। तपाईंले पेस्ट गरेका सन्देशबाट पासवर्ड, OTP र फोन नम्बर जस्ता संवेदनशील विवरणहरू ब्राउजरमै स्वतः लुकाइन्छ (Auto-Redaction) र हामी कुनै पनि व्यक्तिगत लगइन वा बैंकिङ विवरण संग्रह गर्दैनौँ। विस्तृत सुरक्षा संरचना गोपनीयता पृष्ठमा हेर्न सक्नुहुन्छ।',
      answerEn:
        'Your privacy comes first. Sensitive patterns such as OTP codes, passwords, and phone numbers are automatically redacted in your browser before deeper analysis, and we never retain personal banking credentials. You can inspect our full architecture on the Privacy page.',
      actionLabelNe: 'गोपनीयता नीति हेर्नुहोस्',
      actionLabelEn: 'View Privacy Architecture',
      actionPage: 'privacy',
    },
    {
      id: 'cyber-bureau-complaint',
      category: 'emergency',
      categoryLabelNe: 'कानुनी प्रक्रिया',
      categoryLabelEn: 'Legal Filing',
      questionNe: 'नेपाल प्रहरी साइबर ब्युरोमा आधिकारिक उजुरी दिन के-के प्रमाण चाहिन्छ?',
      questionEn: 'What evidence do I need to file a complaint with Nepal Police Cyber Bureau?',
      answerNe:
        'उजुरीका लागि कारोबार रसिद (Transaction ID / Bank Statement), ठगको वालेट वा खाता नम्बर, च्याट र प्रोफाइल लिंकको स्क्रिनसट र घटनाको संक्षिप्त विवरण तयार राख्नुहोस्। हाम्रो "उजुरी मस्यौदा" टुलले तपाईंले दिएको विवरणका आधारमा साइबर ब्युरो (भोटाहिटी / cyberbureau@nepalpolice.gov.np) मा बुझाउन मिल्ने औपचारिक नेपाली निवेदन तुरुन्त तयार पारिदिन्छ।',
      answerEn:
        'Prepare your transaction receipt or bank statement, the scammer’s wallet/account number, screenshots of the chat and profile URL, and a brief timeline. Our Complaint Drafter automatically formats a formal petition ready to submit to Nepal Police Cyber Bureau (Bhotahity or cyberbureau@nepalpolice.gov.np).',
      actionLabelNe: 'उजुरी मस्यौदा तयार गर्नुहोस्',
      actionLabelEn: 'Draft Official Complaint',
      actionPage: 'complaint',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (cat: FAQCategory) => {
    setActiveCategory(cat);
    const nextList = cat === 'all' ? faqItems : faqItems.filter((i) => i.category === cat);
    if (nextList.length > 0 && !nextList.some((i) => i.id === openId)) {
      setOpenId(nextList[0].id);
    }
  };

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="rounded-3xl border shadow-2xl p-4 sm:p-6 md:p-7 space-y-5"
      style={{
        backgroundColor: 'var(--app-card-bg)',
        borderColor: 'var(--app-border)',
      }}
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
            <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isNe ? 'सहयोग तथा प्रायः सोधिने प्रश्नहरू' : 'Help & Knowledge Base'}
            </span>
          </div>
          <h2
            id="faq-section-heading"
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            {isNe
              ? 'प्रायः सोधिने प्रश्नहरू (Frequently Asked Questions)'
              : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {isNe
              ? 'अनलाइन ठगीबाट बच्ने तरिका, जोखिम स्कोरको अर्थ, गोपनीयता र टुल प्रयोग सम्बन्धी मुख्य जिज्ञासाहरूको स्पष्ट उत्तर।'
              : 'Clear answers about spotting scams in Nepal, understanding risk scores, protecting your privacy, and using our checkers.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label={isNe ? 'प्रश्न श्रेणी छान्नुहोस्' : 'Filter FAQ topics'}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-black border border-cyan-400 shadow-sm btn-cyan'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-800'
                }`}
              >
                <span>{isNe ? cat.labelNe : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List (Single Elevation Surface with Hairline Dividers) */}
      <div className="border-t border-b border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
        {filteredItems.map((item, idx) => {
          const isOpen = openId === item.id;
          const indexLabel = String(idx + 1).padStart(2, '0');
          const displayIndex = isNe ? toNepaliDigits(indexLabel) : indexLabel;
          const panelId = `faq-panel-${item.id}`;
          const buttonId = `faq-button-${item.id}`;

          return (
            <div key={item.id} className="py-1">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full py-4 px-1 sm:px-2 flex items-start justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-400 pt-0.5 shrink-0">
                    {displayIndex}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>{isNe ? item.categoryLabelNe : item.categoryLabelEn}</span>
                    </div>
                    <span className="block text-sm sm:text-base font-bold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors leading-snug">
                      {isNe ? item.questionNe : item.questionEn}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  aria-hidden="true"
                  className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="pb-5 pl-8 sm:pl-11 pr-2 space-y-3.5 animate-fadeIn"
                >
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl">
                    {isNe ? item.answerNe : item.answerEn}
                  </p>

                  {(item.actionPage || item.secondaryActionPage) && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                      {item.actionPage && (
                        <button
                          type="button"
                          onClick={() => onNavigate(item.actionPage!)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0 btn-cyan shadow-sm"
                        >
                          <span>{isNe ? item.actionLabelNe : item.actionLabelEn}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}

                      {item.secondaryActionPage && (
                        <button
                          type="button"
                          onClick={() => onNavigate(item.secondaryActionPage!)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-xs cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
                        >
                          <span>
                            {isNe ? item.secondaryActionLabelNe : item.secondaryActionLabelEn}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Help Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
        <span className="text-slate-600 dark:text-slate-400">
          {isNe
            ? 'अझै पनि कुनै सन्देश वा लिंकबारे दोधारमा हुनुहुन्छ? हाम्रो AI सुरक्षा सल्लाहकारसँग सोध्नुहोस्।'
            : 'Still unsure about a message or offer? Ask our Cyber Advisor or submit a question.'}
        </span>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-xs cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <span>{isNe ? 'AI सल्लाहकारसँग सोध्नुहोस्' : 'Ask AI Cyber Advisor'}</span>
          </button>

          {onOpenFeedback && (
            <button
              type="button"
              onClick={() => onOpenFeedback('Home FAQ Section')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0 btn-cyan"
            >
              <span>{isNe ? 'प्रश्न / प्रतिक्रिया पठाउनुहोस्' : 'Send a Question'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
