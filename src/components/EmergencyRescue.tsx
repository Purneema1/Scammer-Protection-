import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertOctagon,
  CreditCard,
  KeyRound,
  UserX,
  Smartphone,
  PhoneCall,
  Mail,
  ShieldAlert,
  CheckCircle,
  Circle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { t } from '../translations';
import { Language } from '../types';

interface EmergencyRescueProps {
  lang: Language;
  onOpenComplaint: () => void;
}

type ScenarioKey = 'money' | 'otp' | 'hacked' | 'app';

export const EmergencyRescue: React.FC<EmergencyRescueProps> = ({
  lang,
  onOpenComplaint,
}) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('money');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const scenarios = {
    money: {
      title: currentT.scenarioTab1,
      icon: CreditCard,
      color: 'rose',
      urgentSummary: isNe
        ? 'तुरुन्त सम्बन्धित बैंक वा डिजिटल वालेट (eSewa/Khalti) मा सम्पर्क गरी कारोबार रोक्का गर्न अनुरोध गर्नुहोस्।'
        : 'Immediately contact your bank or wallet support to freeze the transaction before cash-out.',
      steps: [
        {
          id: 'm1',
          title: isNe
            ? '१. सम्बन्धित बैंक वा डिजिटल वालेटको हेल्पलाइनमा तुरुन्त फोन गर्नुहोस्'
            : '1. Call your bank / payment provider official hotline immediately',
          desc: isNe
            ? 'पैसा पठाएको १०-३० मिनेटभित्र खबर गरेमा ठगले रकम झिक्नुअघि नै बैंक वा वालेटले प्रापकको खाता फ्रिज गर्न सक्ने सम्भावना रहन्छ।'
            : 'If notified within minutes, providers may freeze recipient accounts before funds are withdrawn or transferred.',
        },
        {
          id: 'm2',
          title: isNe
            ? '२. कारोबार विवरण (Transaction ID) र रसिद सुरक्षित गर्नुहोस्'
            : '2. Save the Transaction ID, receipt screenshot, and timestamp',
          desc: isNe
            ? 'eSewa/Khalti वा मोबाइल बैंकिङको स्टेटमेन्ट, Transaction ID, प्रापकको खाता नम्बर र समय स्पष्ट देखिने स्क्रिनसट लिनुहोस्।'
            : 'Export or screenshot the official transaction statement showing reference numbers and destination details.',
        },
        {
          id: 'm3',
          title: isNe
            ? '३. ठगसँग भएका सबै च्याट र फोन कल रेकर्ड सुरक्षित राख्नुहोस्'
            : '3. Preserve all chat messages, numbers, and profiles',
          desc: isNe
            ? 'च्याट डिलिट नगर्नुहोस्। ठगको मोबाइल नम्बर, प्रोफाइल लिंक, बैंक खाता र म्यासेजहरूको स्क्रिनसट सुरक्षित गर्नुहोस्।'
            : 'Do NOT delete chats. Capture full screenshots with sender phone numbers, handles, and dates.',
        },
        {
          id: 'm4',
          title: isNe
            ? '४. नेपाल प्रहरी साइबर ब्युरो वा नजिकको प्रहरी कार्यालयमा उजुरी दर्ता गर्नुहोस्'
            : '4. File a formal cybercrime report at the Police Cyber Bureau',
          desc: isNe
            ? 'काठमाडौँको भोटाहिटीस्थित साइबर ब्युरो वा नजिकको जिल्ला प्रहरी कार्यालयमा उजुरी दिनुहोस्। हाम्रो उजुरी मस्यौदा टुल प्रयोग गर्न सक्नुहुन्छ।'
            : 'Submit a formal petition to the Cyber Bureau or local police. Use our Complaint Drafter tool below.',
        },
      ],
    },
    otp: {
      title: currentT.scenarioTab2,
      icon: KeyRound,
      color: 'amber',
      urgentSummary: isNe
        ? 'तुरुन्त आफ्नो मोबाइल बैंकिङ वा वालेटको पासवर्ड परिवर्तन गर्नुहोस् र बैंकलाई खाता अस्थायी रूपमा ब्लक गर्न लगाउनुहोस्।'
        : 'Immediately reset passwords from a clean device and call your bank to freeze mobile banking.',
      steps: [
        {
          id: 'o1',
          title: isNe
            ? '१. बैंकलाई फोन गरी मोबाइल बैंकिङ / कार्ड तुरुन्त ब्लक गर्नुहोस्'
            : '1. Instruct your bank to block online banking and cards',
          desc: isNe
            ? 'ठगले OTP प्रयोग गरेर थप कारोबार गर्न नपाओस् भन्नाका लागि बैंकको कार्ड तथा डिजिटल बैंकिङ सेवा तत्काल निष्कृय गराउनुहोस्।'
            : 'Block compromised cards and internet access immediately to prevent further unauthorized fund drain.',
        },
        {
          id: 'o2',
          title: isNe
            ? '२. अन्य उपकरणबाट सबै पासवर्ड परिवर्तन गर्नुहोस्'
            : '2. Change passwords on a trusted, safe device',
          desc: isNe
            ? 'मोबाइल बैंकिङ, इमेल र सामाजिक सञ्जालका पासवर्ड नयाँ र कडा राख्नुहोस्। कहिल्यै पुरानो वा सजिलो पासवर्ड नराख्नुहोस्।'
            : 'Set strong, unique passwords on banking, email, and social profiles from a secure device.',
        },
        {
          id: 'o3',
          title: isNe
            ? '३. अन्य सबै लगइन सेसनहरू (Active Sessions) बन्द गर्नुहोस्'
            : '3. Log out of all active devices (Log out all sessions)',
          desc: isNe
            ? 'इमेल वा सामाजिक सञ्जालको सेक्युरिटी सेटिङमा गई "Log out of all devices" थिच्नुहोस्।'
            : 'Terminate all active background sessions from security settings of Google/Facebook/bank.',
        },
        {
          id: 'o4',
          title: isNe
            ? '४. २-चरण प्रमाणीकरण (Two-Factor Authentication - 2FA) सक्रिय गर्नुहोस्'
            : '4. Enable Two-Factor Authentication (2FA)',
          desc: isNe
            ? 'Google Authenticator जस्ता सुरक्षित एपमार्फत 2FA सक्रिय गर्नुहोस् ताकि पासवर्ड थाहा पाए पनि लगइन हुन नसकोस्।'
            : 'Use authenticator apps (like Google Authenticator) rather than SMS where possible.',
        },
      ],
    },
    hacked: {
      title: currentT.scenarioTab3,
      icon: UserX,
      color: 'purple',
      urgentSummary: isNe
        ? 'साथीभाइलाई तुरुन्त खबर गर्नुहोस् कि तपाईंको नामबाट आउने पैसा माग्ने कुनै पनि म्यासेजलाई विश्वास नगर्नूस्।'
        : 'Warn contacts immediately not to send money to anyone impersonating your compromised profile.',
      steps: [
        {
          id: 'h1',
          title: isNe
            ? '१. साथीभाइ तथा आफन्तलाई तुरुन्त सतर्क गराउनुहोस्'
            : '1. Alert friends, family, and colleagues immediately',
          desc: isNe
            ? 'ठगहरूले ह्याक गरिएको प्रोफाइलबाट "म आपतमा छु, तुरुन्त eSewa मा ५,००० हाल्दिनुहोस्" भनी ठगी गर्छन्।'
            : 'Hackers frequently message victims’ friends demanding urgent emergency wallet transfers.',
        },
        {
          id: 'h2',
          title: isNe
            ? '२. आधिकारिक Account Recovery प्रक्रिया प्रयोग गर्नुहोस्'
            : '2. Use official account recovery mechanisms',
          desc: isNe
            ? 'Facebook (facebook.com/hacked), Google वा WhatsApp को आधिकारिक रिकभरी लिंकमार्फत खाता फिर्ता लिने प्रयास गर्नुहोस्।'
            : 'Visit official portals (e.g. facebook.com/hacked or accounts.google.com/signin/recovery).',
        },
        {
          id: 'h3',
          title: isNe
            ? '३. रिकभरी इमेल र फोन नम्बर परिवर्तन भएको छ कि जाँच्नुहोस्'
            : '3. Inspect linked recovery email and phone numbers',
          desc: isNe
            ? 'यदि खातामा पहुँच प्राप्त भयो भने तुरुन्त ठगले थपेको शंकास्पद इमेल वा फोन नम्बर हटाउनुहोस्।'
            : 'Remove any unauthorized backup emails or unknown phone numbers added by the hacker.',
        },
        {
          id: 'h4',
          title: isNe
            ? '४. साइबर ब्युरोमा प्रोफाईल दुरुपयोगको उजुरी दिनुहोस्'
            : '4. Report identity theft & abuse to Cyber Bureau',
          desc: isNe
            ? 'तपाईंको नक्कली वा ह्याक गरिएको खाताबाट गैरकानुनी काम नहोस् भन्नका लागि प्रहरीमा उजुरी दिनुहोस्।'
            : 'File a report with law enforcement to prevent misuse of your identity for other frauds.',
        },
      ],
    },
    app: {
      title: currentT.scenarioTab4,
      icon: Smartphone,
      color: 'blue',
      urgentSummary: isNe
        ? 'तुरुन्त फोनको इन्टरनेट (Wi-Fi र Data) बन्द गर्नुहोस् ताकि डाटा चोरी रोक्न सकियोस्।'
        : 'Disconnect Wi-Fi and mobile data immediately to stop the malware from communicating.',
      steps: [
        {
          id: 'a1',
          title: isNe
            ? '१. मोबाइलको इन्टरनेट (Wi-Fi / Mobile Data) तुरुन्त बन्द गर्नुहोस्'
            : '1. Disconnect Wi-Fi and Mobile Data immediately',
          desc: isNe
            ? 'यसो गर्दा उक्त नक्कली एपले तपाईंको OTP, कन्ट्याक्ट वा फोटोहरू ठगको सर्भरमा पठाउन पाउँदैन।'
            : 'Isolating the phone prevents background trojans from streaming screen recordings or stolen OTPs.',
        },
        {
          id: 'a2',
          title: isNe
            ? '२. उक्त अपरिचित वा नक्कली APK एप तुरुन्त अनइन्स्टल गर्नुहोस्'
            : '2. Uninstall the suspicious APK or malicious application',
          desc: isNe
            ? 'Settings > Apps मा जानुहोस् र भर्खरै इन्स्टल गरिएको वा शंकास्पद नाम नभएको एप हटाउनुहोस्।'
            : 'Navigate to Settings > Apps and uninstall the unrecognized or sideloaded APK.',
        },
        {
          id: 'a3',
          title: isNe
            ? '३. गुगल प्ले प्रोटेक्ट (Google Play Protect) स्क्यान चलाउनुहोस्'
            : '3. Run a Google Play Protect scan',
          desc: isNe
            ? 'Play Store > Play Protect मा गई फोन पूर्ण रूपमा स्क्यान गर्नुहोस्।'
            : 'Open Google Play Store, tap your profile avatar, and run a full Play Protect device scan.',
        },
        {
          id: 'a4',
          title: isNe
            ? '४. अन्य फोन वा कम्प्युटरबाट सबै महत्त्वपूर्ण पासवर्ड फेर्नुहोस्'
            : '4. Change critical credentials from another clean device',
          desc: isNe
            ? 'संक्रमित फोनबाट होइन, अर्को सुरक्षित फोन वा कम्प्युटरबाट मात्र बैंक र इमेल पासवर्ड परिवर्तन गर्नुहोस्।'
            : 'Update banking, email, and social passwords strictly from a separate, uncompromised device.',
        },
      ],
    },
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const currentScenarioData = scenarios[activeScenario];
  const stepsList = currentScenarioData.steps;
  const completedCount = stepsList.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / stepsList.length) * 100);

  return (
    <div className="space-y-6">
      {/* Recovery Scam Warning Box - Prominent */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-red-950/60 to-rose-950/80 border-2 border-rose-600/70 shadow-2xl animate-pulse-slow">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-500/50 text-rose-300 shrink-0">
            <AlertOctagon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-rose-200 uppercase tracking-wide">
              {currentT.recoveryScamAlertTitle}
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1 leading-relaxed">
              {currentT.recoveryScamAlertDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Checklist Card */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-400" />
            {currentT.rescueTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentT.rescueSubtitle}
          </p>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {(Object.keys(scenarios) as ScenarioKey[]).map((key) => {
            const sc = scenarios[key];
            const Icon = sc.icon;
            const isSelected = activeScenario === key;

            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/60 text-white shadow-lg'
                    : 'bg-[#0b1220] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? 'text-rose-400' : 'text-slate-500'
                    }`}
                  />
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold line-clamp-1">
                  {sc.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Priority Directive Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-rose-200">
            {currentScenarioData.urgentSummary}
          </p>
        </div>

        {/* Checklist Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {completedCount} / {stepsList.length} {currentT.progressCompleted}
            </span>
            <span className="font-bold text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-step Interactive Checklist */}
        <div className="space-y-3">
          {stepsList.map((step) => {
            const isDone = Boolean(completedSteps[step.id]);

            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-600/40 opacity-80'
                    : 'bg-[#0b1220] border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                  aria-label="Toggle step"
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                  )}
                </button>

                <div className="space-y-1">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button to generate Police Complaint */}
        <div className="pt-2">
          <button
            onClick={onOpenComplaint}
            className="w-full py-3 px-4 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>
              {isNe
                ? 'नेपाल प्रहरी साइबर ब्युरोका लागि औपचारिक उजुरी पत्र (मस्यौदा) तयार गर्नुहोस्'
                : 'Draft an Official Cyber Bureau Police Complaint Petition Now'}
            </span>
          </button>
        </div>
      </div>

      {/* Official Emergency Contact Directory */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
          {currentT.officialContactsTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
          {/* Cyber Bureau Card */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300">
                {isNe ? 'नेपाल प्रहरी साइबर ब्युरो' : 'Nepal Police Cyber Bureau'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
                24/7 Official
              </span>
            </div>
            <p className="text-xs text-slate-400">
              भोटाहिटी, काठमाडौँ (नेपालभरका अनलाइन ठगी तथा साइबर अपराधको अनुसन्धान केन्द्र)
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="tel:014211304"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-mono font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                ०१-४२११३०४
              </a>
              <a
                href="mailto:cyberbureau@nepalpolice.gov.np"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Bureau
              </a>
            </div>
          </div>

          {/* eSewa / Khalti Fraud Desk */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300">
                {isNe ? 'डिजिटल वालेट फ्रड डेस्क' : 'Digital Wallets Fraud Desk'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                eSewa / Khalti
              </span>
            </div>
            <p className="text-xs text-slate-400">
              वालेटबाट अनधिकृत रकम स्थानान्तरण भएको अवस्थामा तत्काल खाता रोक्का गर्न सम्पर्क गर्नुहोस्।
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <a
                href="tel:16600102121"
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700"
              >
                eSewa Toll-Free: 1660-01-02121
              </a>
              <a
                href="tel:16600158888"
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700"
              >
                Khalti Toll-Free: 1660-01-58888
              </a>
            </div>
          </div>

          {/* International Reporting (US / Global) */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-2 md:col-span-2">
            <span className="font-bold text-slate-300">
              {isNe ? 'अन्तर्राष्ट्रिय साइबर अपराध रिपोर्टिङ' : 'Global & US Cyber Crime Portals'}
            </span>
            <p className="text-xs text-slate-400">
              यदि ठगी विदेशी नागरिक वा अन्तर्राष्ट्रिय प्लेटफर्मबाट भएको छ भने यी निकायमा उजुरी दर्ता गर्न सकिन्छ:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <span>FBI Internet Crime Complaint Center (IC3)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <span>FTC Report Fraud (USA)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
