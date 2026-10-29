import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2, Database, AlertCircle } from 'lucide-react';
import { t } from '../translations';
import { Language } from '../types';

interface PrivacyViewProps {
  lang: Language;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ lang }) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const principles = [
    {
      icon: EyeOff,
      title: isNe
        ? '१. पासवर्ड र गोप्य कोड कहिल्यै मागिँदैन'
        : '1. Zero Password / OTP Ingestion',
      desc: isNe
        ? 'हाम्रो प्रणालीले तपाईंको व्यक्तिगत पासवर्ड, बैंक पिन, OTP वा रिकभरी कोड कहिल्यै माग्दैन र सोध्न पनि अनुमति दिँदैन।'
        : 'We never solicit, store, or process your personal bank PINs, passwords, OTP tokens, or recovery secrets.',
    },
    {
      icon: Lock,
      title: isNe
        ? '२. ग्राहकको उपकरणमै स्वतः विवरण लुकाउने सुविधा (Client-Side Redaction)'
        : '2. Client-Side Sensitive Data Scrubbing',
      desc: isNe
        ? 'तपाईंले सन्देश पेस्ट गर्दा फोन नम्बर, बैंक कार्ड वा इमेल भएमा एपले तुरुन्त चेतावनी दिन्छ र १-क्लिकमा त्यसलाई [REDACTED] बनाउँछ।'
        : 'Our in-browser privacy guard warns you if sensitive phone or card numbers are detected and auto-redacts them before submission.',
    },
    {
      icon: Database,
      title: isNe
        ? '३. सन्देशको स्थायी भण्डारण गरिँदैन (No Permanent Storage)'
        : '3. No Permanent Database Storage',
      desc: isNe
        ? 'तपाईंले जाँचेको सन्देश वा लिंक हाम्रो सर्भरमा स्थायी रूपमा सुरक्षित राखिँदैन। विश्लेषण सकिनासाथ मेमोरीबाट सफा गरिन्छ।'
        : 'Submitted texts and URLs are processed ephemerally for scanning and are not retained in permanent user databases.',
    },
    {
      icon: Trash2,
      title: isNe
        ? '४. कुनै पनि विज्ञापन वा तेस्रो पक्षलाई डेटा बेचिँदैन'
        : '4. No Ad-Tracking or Data Monetization',
      desc: isNe
        ? 'तपाईंको डेटा कुनै विज्ञापनदाता वा डेटा ब्रोकरलाई बेच्ने काम कहिल्यै हुँदैन। यो विशुद्ध रूपमा प्रयोगकर्ता सुरक्षा उपकरण हो।'
        : 'Your inputs are strictly confidential. We never monetize, package, or sell user scan queries to ad brokers.',
    },
    {
      icon: AlertCircle,
      title: isNe
        ? '५. नतिजाको सीमितता र कानुनी दायित्व'
        : '5. Automated Guidance Disclaimer',
      desc: isNe
        ? 'कुनै पनि एआई वा सुरक्षा सफ्टवेयरले १००% नयाँ ठगी पत्ता लगाउन सक्दैन। त्यसैले हाम्रो नतिजालाई अन्तिम कानुनी फैसला नभई सतर्कताको मार्गदर्शन मान्नुपर्छ।'
        : 'Automated threat heuristics offer safety guidance, not absolute legal verdicts. Users should always verify with official institutions.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {currentT.privacyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.privacySubtitle}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Icon className="w-5 h-5 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Victim Empathy Note */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
          <span className="font-bold text-cyan-300 block">
            {isNe ? 'हाम्रो मानवीय दृष्टिकोण (Empathy):' : 'Our Empathy Commitment:'}
          </span>
          <p className="text-slate-400 text-xs leading-relaxed">
            {isNe
              ? 'ठगीमा परेका जो-कोही पनि अपराधको शिकार भएका हुन्, उनीहरूको दोष होइन। आधुनिक ठगहरूले अत्यन्त चलाखीपूर्ण मनोवैज्ञानिक प्रविधि प्रयोग गर्छन्। हाम्रो एपले पीडितलाई दोष नदिई सही कानुनी तथा वित्तीय सुरक्षा कदम चाल्न सघाउँछ।'
              : 'Victims of fraud are never at fault—modern cyber syndicates use sophisticated psychological coercion and engineering. We are dedicated to supporting victims with respectful, prompt, and empowering guidance.'}
          </p>
        </div>
      </div>
    </div>
  );
};
