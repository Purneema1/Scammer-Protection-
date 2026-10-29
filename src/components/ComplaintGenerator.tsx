import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Download,
  Check,
  ShieldAlert,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { t } from '../translations';
import { Language, ComplaintData } from '../types';

interface ComplaintGeneratorProps {
  lang: Language;
}

export const ComplaintGenerator: React.FC<ComplaintGeneratorProps> = ({ lang }) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const [formData, setFormData] = useState<ComplaintData>({
    applicantName: '',
    applicantPhone: '',
    applicantAddress: '',
    applicantCitizenship: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '14:30',
    platformUsed: 'WhatsApp / Facebook',
    scammerPhone: '',
    scammerAccount: '',
    scammerNameOrHandle: '',
    amountLost: '',
    transactionId: '',
    paymentMedium: 'eSewa',
    description: '',
    evidenceItems: [
      'कुराकानीको स्क्रिनसट (Chat Screenshots)',
      'बैंक/वालेटको भुक्तानी रसिद (Payment Receipt Voucher)',
      'फोन नम्बर तथा सामाजिक सञ्जालको प्रोफाइल लिंक (Profile Link & Number)',
    ],
  });

  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof ComplaintData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEvidenceToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.evidenceItems.includes(item);
      return {
        ...prev,
        evidenceItems: exists
          ? prev.evidenceItems.filter((i) => i !== item)
          : [...prev.evidenceItems, item],
      };
    });
  };

  // Prefill realistic test data
  const handlePrefillSample = () => {
    setFormData({
      applicantName: 'राम प्रसाद शर्मा',
      applicantPhone: '9841234567',
      applicantAddress: 'काठमाडौँ महानगरपालिका-३२, कोटेश्वर',
      applicantCitizenship: '२७-०१-७५-१२३४५',
      incidentDate: '२०८३-०७-१२',
      incidentTime: '१५:००',
      platformUsed: 'WhatsApp / Telegram',
      scammerPhone: '9801299999',
      scammerAccount: 'eSewa ID: 9801299999 / Nabil Bank A/C: 0192837465001',
      scammerNameOrHandle: '“KBC Lottery Officer Rahul” / Telegram @WinEasy2026',
      amountLost: 'रु. ५०,००० (पचास हजार रुपैयाँ मात्र)',
      transactionId: 'TXN-982348719283',
      paymentMedium: 'eSewa & Mobile Banking',
      description:
        'मिति २०८३/०७/१२ गते मलाई अज्ञात नम्बरबाट फोन गरी तपाईंले KBC लक्की ड्र मार्फत रु. २५ लाखको पुरस्कार जित्नुभएको छ भनी प्रोसेसिङ शुल्क र भन्सार कर बापत रकम जम्मा गर्न दबाब दिइयो। मैले विश्वासमा परी रु. ५०,००० निजको eSewa र बैंक खातामा पठाएपछि निजले फोन स्विच अफ गरी मलाई ब्लक गर्‍यो। अतः आवश्यक कानुनी अनुसन्धान गरी रकम रोक्का तथा फिर्ता दिलाई पाउँ।',
      evidenceItems: [
        'कुराकानीको स्क्रिनसट (Chat Screenshots)',
        'बैंक/वालेटको भुक्तानी रसिद (Payment Receipt Voucher)',
        'फोन नम्बर तथा सामाजिक सञ्जालको प्रोफाइल लिंक (Profile Link & Number)',
      ],
    });
  };

  const handleGenerate = () => {
    const today = new Date().toLocaleDateString(isNe ? 'ne-NP' : 'en-US');

    let petition = '';

    if (isNe) {
      petition = `मिति: ${today}

श्रीमान् प्रमुखज्यू,
नेपाल प्रहरी साइबर ब्युरो,
भोटाहिटी, काठमाडौँ।

विषय: अनलाइन ठगी तथा विद्युतीय वित्तीय अपराध सम्बन्धी उजुरी / निवेदन।

महोदय,
उपरोक्त सम्बन्धमा म निवेदक ${formData.applicantName || '................................'} (ठेगाना: ${
        formData.applicantAddress || '................................'
      }, फोन नं: ${
        formData.applicantPhone || '................................'
      }, नागरिकता नं: ${
        formData.applicantCitizenship || '................................'
      }) ले अनलाइन माध्यमबाट भएको ठगी तथा आर्थिक क्षतिको सम्बन्धमा यो उजुरी निवेदन पेश गर्दछु।

१. घटनाको विवरण:
- घटना भएको मिति र समय: ${formData.incidentDate || '...............'} समय: ${
        formData.incidentTime || '...............'
      }
- प्रयोग गरिएको प्लेटफर्म / माध्यम: ${formData.platformUsed || '...............'}

२. ठगी गर्ने व्यक्ति / खाता सम्बन्धी विवरण:
- ठगी गर्ने व्यक्तिको नाम वा प्रोफाइल: ${formData.scammerNameOrHandle || 'थाहा नभएको'}
- प्रयोग गरिएको फोन नम्बर: ${formData.scammerPhone || 'उपलब्ध नभएको'}
- रकम पठाइएको बैंक खाता वा वालेट विवरण: ${formData.scammerAccount || 'उपलब्ध नभएको'}

३. आर्थिक क्षतिको विवरण:
- ठगिएको कुल रकम: ${formData.amountLost || '........................'}
- भुक्तानीको माध्यम: ${formData.paymentMedium || '........................'}
- कारोबार नम्बर (Transaction ID): ${formData.transactionId || '........................'}

४. घटनाको विस्तृत व्यहोरा:
${formData.description || 'विस्तृत विवरण यहाँ उल्लेख गर्नुहोस्...'}

५. संलग्न प्रमाण तथा कागजातहरू:
${formData.evidenceItems.map((e, idx) => `  ${idx + 1}. ${e}`).join('\n')}

अतः निज विपक्षीलाई विद्युतीय कारोबार ऐन, २०६३ तथा प्रचलित कानुन बमोजिम खोजी अनुसन्धान गरी मेरो ठगिएको रकम सम्बन्धित बैंक/वालेटबाट रोक्का गरी फिर्ता गराइदिनुहुन र दोषी उपर कडा कानुनी कारबाही गरिपाउन सादर अनुरोध गर्दछु।

निवेदक:
नाम: ${formData.applicantName || '................................'}
हस्ताक्षर: ................................
सम्पर्क नम्बर: ${formData.applicantPhone || '................................'}`;
    } else {
      petition = `Date: ${today}

To:
The Chief of Police / Investigating Officer,
Cyber Crime Investigation Bureau / Police Department.

Subject: Formal Complaint Petition Regarding Online Cyber Fraud & Financial Theft.

Respected Sir/Madam,

I, the undersigned applicant ${formData.applicantName || '[Your Name]'} (Address: ${
        formData.applicantAddress || '[Your Address]'
      }, Contact: ${formData.applicantPhone || '[Phone Number]'}, ID/Citizenship: ${
        formData.applicantCitizenship || '[National ID/Passport]'
      }), hereby lodge this formal petition regarding an incident of digital fraud and illegal monetary extortion.

1. INCIDENT DETAILS:
- Date & Time: ${formData.incidentDate || '[Date]'} at ${formData.incidentTime || '[Time]'}
- Communication Platform: ${formData.platformUsed || '[Platform]'}

2. SUSPECT / SCAMMER PARTICULARS:
- Suspect Name / Online Identity: ${formData.scammerNameOrHandle || 'Unknown'}
- Suspect Contact / Phone: ${formData.scammerPhone || 'Unknown'}
- Destination Bank Account / Wallet ID: ${formData.scammerAccount || 'Unknown'}

3. FINANCIAL LOSS DETAILS:
- Total Amount Defrauded: ${formData.amountLost || '[Amount]'}
- Payment Channel: ${formData.paymentMedium || '[Bank / Wallet / Wire]'}
- Transaction ID / Reference No: ${formData.transactionId || '[Transaction ID]'}

4. SUMMARY OF EVENTS:
${formData.description || '[Please describe the chronological sequence of events.]'}

5. LIST OF ATTACHED EVIDENCE:
${formData.evidenceItems.map((e, idx) => `  ${idx + 1}. ${e}`).join('\n')}

I kindly request your esteemed bureau to initiate an urgent investigation, instruct the receiving bank/wallet institution to freeze the illicit account, recover my funds, and prosecute the perpetrator under the prevailing Cyber Electronic Transactions Act.

Sincerely,
Applicant: ${formData.applicantName || '[Signature]'}
Contact: ${formData.applicantPhone || '[Phone]'}`;
    }

    setGeneratedDraft(petition);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cybercrime Complaint Draft</title>
            <style>
              body { font-family: monospace, sans-serif; padding: 40px; line-height: 1.6; color: #111; }
              pre { white-space: pre-wrap; word-break: break-word; font-size: 13px; }
            </style>
          </head>
          <body>
            <pre>${generatedDraft}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cyber_Complaint_Draft_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const availableEvidence = [
    isNe ? 'कुराकानीको स्क्रिनसट (Chat Screenshots)' : 'Chat Screenshots',
    isNe ? 'बैंक/वालेटको भुक्तानी रसिद (Payment Receipt Voucher)' : 'Official Payment Receipt',
    isNe ? 'फोन नम्बर तथा सामाजिक सञ्जालको प्रोफाइल लिंक' : 'Phone Numbers & Profile URLs',
    isNe ? 'अडियो कल रेकर्डिङ (Audio Call Recording)' : 'Call Recording Audio Files',
    isNe ? 'नक्कली वेबसाइट वा फिसिङ लिंकको स्क्रिनसट' : 'Screenshots of Phishing Links',
    isNe ? 'नागरिकता / परिचयपत्रको प्रतिलिपि (ID Copy)' : 'Copy of National ID / Passport',
  ];

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              {currentT.complaintTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.complaintSubtitle}
            </p>
          </div>
          <button
            onClick={handlePrefillSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isNe ? 'नमुना विवरण भर्नुहोस् (Prefill Demo)' : 'Prefill Demo Sample'}</span>
          </button>
        </div>

        {/* The Input Form */}
        <div className="mt-5 space-y-6">
          {/* Section 1: Applicant Details */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
              {currentT.formPersonalSection}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'निवेदकको पूरा नाम *' : 'Applicant Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder="उदा: राम प्रसाद शर्मा"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'सम्पर्क फोन नम्बर *' : 'Contact Phone Number *'}
                </label>
                <input
                  type="text"
                  value={formData.applicantPhone}
                  onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                  placeholder="9841XXXXXX"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'स्थायी / हालको ठेगाना' : 'Current Address'}
                </label>
                <input
                  type="text"
                  value={formData.applicantAddress}
                  onChange={(e) => handleInputChange('applicantAddress', e.target.value)}
                  placeholder="उदा: काठमाडौँ-३२, कोटेश्वर"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'नागरिकता नं / परिचयपत्र नं' : 'National ID / Citizenship No'}
                </label>
                <input
                  type="text"
                  value={formData.applicantCitizenship}
                  onChange={(e) => handleInputChange('applicantCitizenship', e.target.value)}
                  placeholder="उदा: २७-०१-७५-१२३४५"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Incident Details */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
              {currentT.formIncidentSection}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'घटना भएको मिति' : 'Incident Date'}
                </label>
                <input
                  type="text"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'समय' : 'Approximate Time'}
                </label>
                <input
                  type="text"
                  value={formData.incidentTime}
                  onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'माध्यम / प्लेटफर्म' : 'Platform Used'}
                </label>
                <input
                  type="text"
                  value={formData.platformUsed}
                  onChange={(e) => handleInputChange('platformUsed', e.target.value)}
                  placeholder="WhatsApp, Facebook, Phone Call, Telegram..."
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Scammer Details */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
              {currentT.formSuspectSection}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'ठगको नाम वा प्रोफाइल' : 'Scammer Name / Handle'}
                </label>
                <input
                  type="text"
                  value={formData.scammerNameOrHandle}
                  onChange={(e) => handleInputChange('scammerNameOrHandle', e.target.value)}
                  placeholder="उदा: Rahul Kumar / @WinEasy"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'ठगको फोन नम्बर' : 'Scammer Phone / Contact'}
                </label>
                <input
                  type="text"
                  value={formData.scammerPhone}
                  onChange={(e) => handleInputChange('scammerPhone', e.target.value)}
                  placeholder="उदा: 98012XXXXX"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'रकम पठाइएको बैंक/वालेट खाता' : 'Recipient Account / Wallet ID'}
                </label>
                <input
                  type="text"
                  value={formData.scammerAccount}
                  onChange={(e) => handleInputChange('scammerAccount', e.target.value)}
                  placeholder="उदा: eSewa 9800000000 / Bank A/C"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Money details & Description */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
              {isNe ? '४. ठगिएको रकम र कारोबार विवरण' : '4. Defrauded Amount & Transaction'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'ठगिएको रकम *' : 'Total Amount Lost *'}
                </label>
                <input
                  type="text"
                  value={formData.amountLost}
                  onChange={(e) => handleInputChange('amountLost', e.target.value)}
                  placeholder="उदा: रु. ५०,०००"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'भुक्तानीको माध्यम' : 'Payment Medium'}
                </label>
                <input
                  type="text"
                  value={formData.paymentMedium}
                  onChange={(e) => handleInputChange('paymentMedium', e.target.value)}
                  placeholder="eSewa, Khalti, Mobile Banking, IPS..."
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isNe ? 'कारोबार नम्बर (Transaction ID)' : 'Transaction ID / Reference'}
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="TXN-1234567890"
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs text-slate-400 block mb-1">
                {isNe
                  ? 'घटनाको विस्तृत व्यहोरा (कसरी ठगी भयो, के के भनियो?) *'
                  : 'Event Chronology (How the fraud happened, what was said) *'}
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={
                  isNe
                    ? 'जस्तै: मलाई लक्की ड्र परेको भन्दै फोन आयो र कर तिर्नुपर्छ भनी ५०,००० पठाउन लगाइयो...'
                    : 'Describe step-by-step how the scammer contacted you and what promises or threats were made...'
                }
                className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Section 5: Available Evidence Checklist */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
              {currentT.formEvidenceSection}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {isNe
                ? 'तपाईंसँग उपलब्ध रहेका प्रमाणहरू छान्नुहोस् (उजुरीमा स्वतः समावेश हुनेछ):'
                : 'Select evidence items in your possession:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {availableEvidence.map((item, idx) => {
                const checked = formData.evidenceItems.includes(item);
                return (
                  <label
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      checked
                        ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                        : 'bg-[#0b1220] border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleEvidenceToggle(item)}
                      className="rounded text-cyan-500 focus:ring-0"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Generate Draft Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>{currentT.generateDraftBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Formal Draft Card */}
      {generatedDraft && (
        <div className="bg-[#121c33] border border-cyan-800/60 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                {isNe ? 'तयार भएको आधिकारिक उजुरी मस्यौदा' : 'Generated Official Petition Draft'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentT.draftNotice}
              </p>
            </div>

            {/* Actions: Copy, Print, Download */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{currentT.copiedText}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentT.copyDraftBtn}</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentT.printDraftBtn}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {/* Render Draft in Clean Paper-like Layout */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#080d1a] border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30 overflow-x-auto">
            {generatedDraft}
          </div>

          {/* Submission Instructions */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              {isNe ? 'उजुरी दर्ता गर्ने तरिका:' : 'How to file this complaint:'}
            </span>
            <ul className="space-y-1 text-slate-400 list-disc list-inside">
              <li>
                {isNe
                  ? 'यो मस्यौदा प्रिन्ट गर्नुहोस् वा प्रतिलिपि बनाएर हस्ताक्षर गर्नुहोस्।'
                  : 'Print this draft and sign the bottom.'}
              </li>
              <li>
                {isNe
                  ? 'आफ्नो नागरिकताको फोटोकपी र बैंक/eSewa को भुक्तानी स्टेटमेन्ट रसिद संलग्न गर्नुहोस्।'
                  : 'Attach a photocopy of your ID card and the official transaction receipt.'}
              </li>
              <li>
                {isNe
                  ? 'काठमाडौँ भोटाहिटीस्थित नेपाल प्रहरी साइबर ब्युरोमा वा नजिकको जिल्ला प्रहरी कार्यालयको साइबर शाखामा दर्ता गर्नुहोस्।'
                  : 'Submit directly to Nepal Police Cyber Bureau, Bhotahity, Kathmandu or your local district police station.'}
              </li>
              <li>
                {isNe
                  ? 'तत्काल इमेलमार्फत सूचना पठाउन: cyberbureau@nepalpolice.gov.np मा पनि पठाउन सक्नुहुन्छ।'
                  : 'For immediate email filing: you can also email cyberbureau@nepalpolice.gov.np.'}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
