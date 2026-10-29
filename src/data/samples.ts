import { SampleMessage, SampleLink, SampleShoppingItem } from '../types';

export const sampleMessages: SampleMessage[] = [
  {
    id: 'lottery-nepal',
    titleNe: 'चिठ्ठा / ५० हजार पुरस्कार',
    titleEn: 'Lottery / 50k Prize Scam',
    categoryNe: 'नक्कली पुरस्कार',
    categoryEn: 'Fake Prize',
    textNe: 'बधाई छ! तपाईंले लक्की ड्र मार्फत रु. ५०,००० को नगद पुरस्कार जित्नुभएको छ। आजै रकम दाबी गर्न तलको लिंक खोल्नुहोस् र आफ्नो बैंक खाता विवरण तथा प्रोसेसिङ शुल्क रु. ५०० तत्काल पठाउनुहोस्। म्याद २४ घण्टा मात्र!',
    textEn: 'Congratulations! You have been selected to win Rs. 50,000 cash prize in our Lucky Draw. To claim your reward today, click the link below, fill your bank details and pay a processing fee of Rs. 500 immediately. Offer valid for 24 hours only!',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'bank-otp-alert',
    titleNe: 'बैंक अलर्ट / OTP चोरी',
    titleEn: 'Bank Alert & OTP Phishing',
    categoryNe: 'बैंक फिसिङ',
    categoryEn: 'Bank Phishing',
    textNe: 'प्रिय ग्राहक, तपाईंको बैंक खातामा असामान्य गतिविधिको कारण आजैदेखि मोबाइल बैंकिङ निलम्बित हुन सक्छ। खाता सुचारु राख्न तुरुन्तै यो लिंक खोल्नुहोस् र तपाईंको मोबाइलमा आएको ६ अंकको OTP कोड यहाँ टाइप गर्नुहोस्।',
    textEn: 'Dear Customer, your mobile banking is scheduled for suspension due to unverified KYC. Click this link immediately to verify your identity and enter the 6-digit OTP code sent to your phone. Failure to do so within 10 minutes will freeze your account.',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'wfh-telegram-job',
    titleNe: 'घर बसी ५ हजार कमाइ (Telegram Job)',
    titleEn: 'Work From Home Telegram Task Scam',
    categoryNe: 'नक्कली जागिर',
    categoryEn: 'Fake Job',
    textNe: 'घरमै बसी बसी दैनिक रु. ३,००० देखि ५,००० सम्म कमाउनुहोस्! केवल युट्युब भिडियो लाइक गर्ने र स्क्रिनसट पठाउने काम। कुनै अनुभव चाहिँदैन। अहिले नै हाम्रो टेलिग्राम च्यानल जोइन गर्नुहोस् र पहिलो टास्क पूरा गरी तुरुन्तै बोनस लिनुहोस्।',
    textEn: 'Part-time opportunity! Earn $100 - $300 daily working from home just by liking YouTube videos and rating hotels. No experience required. Daily payout. Contact our manager on Telegram @EarnFast2026 to start with a $20 sign-up bonus.',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'parcel-customs-fee',
    titleNe: 'पार्सल तथा डेलिभरी शुल्क',
    titleEn: 'Parcel Customs Advance Fee',
    categoryNe: 'डेलिभरी ठगी',
    categoryEn: 'Delivery Fraud',
    textNe: 'तपाईंको नाममा विदेशबाट बहुमूल्य उपहार पार्सल त्रिभुवन विमानस्थल भन्सारमा आइपुगेको छ। भन्सार पास गराउन रु. ४,५०० तुरुन्त यो eSewa खातामा पठाउनुहोस्, नत्र पार्सल जफत गरिनेछ र प्रहरी कारबाही हुनेछ।',
    textEn: 'Your high-value international parcel is currently held at customs clearance. An unpaid handling fee of $65 is required immediately to avoid package destruction and legal penalties. Pay via gift card or wire transfer now.',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'crypto-investment',
    titleNe: 'दैनिक २०% ग्यारेन्टी फाइदा (Crypto)',
    titleEn: 'Guaranteed 20% Daily ROI Crypto',
    categoryNe: 'नक्कली लगानी',
    categoryEn: 'Crypto Ponzi',
    textNe: 'क्रिप्टो ट्रेडिंगमा दैनिक २०% ग्यारेन्टी नाफा! रु. १०,००० लगानी गर्नुहोस् र भोलि नै १२,००० फिर्ता पाउनुहोस्। १००% जोखिमरहित, एआई अटो-बट प्रविधि। सीमित सिट बाँकी छ, अहिले नै सुरु गर्नुहोस्।',
    textEn: 'Guaranteed 20% daily returns on automated AI crypto arbitrage! Deposit $500 and withdraw $600 within 24 hours. 100% risk-free VIP trading group. Only 5 slots left for new investors today.',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'genuine-utility',
    titleNe: 'वास्तविक विद्युत् महसुल सन्देश (सुरक्षित)',
    titleEn: 'Genuine Utility Bill SMS (Safe)',
    categoryNe: 'सुरक्षित सन्देश',
    categoryEn: 'Genuine Safe',
    textNe: 'नेपाल विद्युत् प्राधिकरण: ग्राहक नं ०४२.१५.००९ को फागुन महिनाको बिजुली महसुल रु. ६८० बाँकी रहेको छ। नजिकैको काउन्टर वा आधिकारिक डिजिटल वालेटबाट समयमै भुक्तानी गर्नुहोला। धन्यवाद।',
    textEn: 'Electricity Authority Alert: Bill for consumer #042.15.009 for March is Rs. 680. Due date is March 15. Pay via authorized utility counters or official banking apps. Thank you.',
    expectedRisk: 'LOW_RISK',
  },
];

export const sampleLinks: SampleLink[] = [
  {
    id: 'fake-bank',
    titleNe: 'नक्कली बैंक लगइन (.top)',
    titleEn: 'Fake Bank Login (.top)',
    url: 'http://nabil-bank-online-verify.top/ebank/login.php',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'fake-wallet',
    titleNe: 'नक्कली वालेट पुरस्कार लिंक',
    titleEn: 'Fake Wallet Bonus (.xyz)',
    url: 'https://esewa-bonus-cash-reward.xyz/claim-prize',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'ip-address',
    titleNe: 'सिधै IP ठेगाना भएको लिंक',
    titleEn: 'Raw IP Host Link',
    url: 'http://185.220.101.5/secure/password-reset',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'police-typo',
    titleNe: 'नक्कली प्रहरी साइबर डोमेन',
    titleEn: 'Spoofed Police Domain (.tk)',
    url: 'https://nepallpolice-cyber-notice.tk/case-check',
    expectedRisk: 'HIGH_RISK',
  },
  {
    id: 'genuine-gov',
    titleNe: 'आधिकारिक सरकारी वेबसाइट',
    titleEn: 'Official Government Website',
    url: 'https://nepalpolice.gov.np',
    expectedRisk: 'LOW_RISK',
  },
];

export const sampleShoppingItems: SampleShoppingItem[] = [
  {
    id: 'user-sample-phone',
    titleNe: 'रु. ३० हजारको फोन १२ हजारमा (६ हजार अग्रिम)',
    titleEn: 'Rs. 30k Phone for 12k (Rs. 6k Advance)',
    data: {
      productName: 'Android Smartphone (8GB/128GB)',
      marketPrice: 30000,
      advertisedPrice: 12000,
      advancePayment: 6000,
      sellerName: 'Mega Gadgets Clearance Nepal',
      sellerPlatform: 'Facebook Marketplace',
      sellerProfileUrl: 'https://facebook.com/marketplace/item/928374829',
      paymentMethod: 'Personal eSewa / QR',
      hasReturnPolicy: false,
      hasPhysicalStore: false,
      commentsDisabled: true,
      adDescription: 'नयाँ सिल प्याक फोन ५०% भन्दा बढी छुटमा! आजै अर्डर गर्नुहोस्, नेपालभर डेलिभरी। डेलिभरी चार्ज र आधा रकम रु. ६००० अग्रिम इसेवा गर्नुपर्नेछ। सामान २ दिनमा आइपुग्नेछ।',
      screenshotNotes: 'विज्ञापनमा कमेन्ट बक्स बन्द गरिएको छ। फोन नम्बर मोबाइल मात्र छ।',
    },
  },
  {
    id: 'iphone-clearance-scam',
    titleNe: 'iPhone 15 Pro रु. ३५,००० मा (TikTok Ad)',
    titleEn: 'iPhone 15 Pro for Rs. 35k (TikTok Ad)',
    data: {
      productName: 'iPhone 15 Pro Max 256GB',
      marketPrice: 165000,
      advertisedPrice: 35000,
      advancePayment: 15000,
      sellerName: 'Apple Store Nepal Customs Clearance',
      sellerPlatform: 'TikTok Shop / Video Ad',
      sellerProfileUrl: 'https://tiktok.com/@apple_nepal_clearance',
      paymentMethod: 'Personal eSewa / Bank Transfer',
      hasReturnPolicy: false,
      hasPhysicalStore: false,
      commentsDisabled: true,
      adDescription: 'भन्सार जफत भएको सक्कली आइफोन जम्मा रु. ३५,००० मा! सीमित १० थान मात्र बाँकी। आधा रकम अग्रिम पठाएर सिट सुरक्षित गर्नुहोस्।',
      screenshotNotes: 'भिडियो विदेशको स्टोरबाट चोरी गरिएको जस्तो देखिन्छ। कमेन्टहरू सबै हाइड गरिएको छ।',
    },
  },
  {
    id: 'genuine-local-cod',
    titleNe: 'नेपाली ढाका टोपी तथा खादा (Cash on Delivery - सुरक्षित)',
    titleEn: 'Authentic Dhaka Topi (COD Available - Safe)',
    data: {
      productName: 'पाल्पाली ढाका टोपी र हस्तकला',
      marketPrice: 1500,
      advertisedPrice: 1250,
      advancePayment: 0,
      sellerName: 'Palpali Craft Emporium (PAN: 601239845)',
      sellerPlatform: 'Instagram Shop / Hamrobazar',
      sellerProfileUrl: 'https://instagram.com/palpalicrafts',
      paymentMethod: 'Cash on Delivery (COD) / Official Store QR',
      hasReturnPolicy: true,
      hasPhysicalStore: true,
      commentsDisabled: false,
      adDescription: 'हातले बुनिएको मौलिक पाल्पाली ढाका टोपी। काठमाडौँ उपत्यकाभित्र निःशुल्क क्यास अन डेलिभरी (सामान हेरेर मात्र पैसा दिनुहोस्)। ७ दिनभित्र साट्न मिल्ने। भौतिक पसल: असन, काठमाडौँ।',
      screenshotNotes: 'पसलको वास्तविक बोर्डको फोटो र ग्राहकका खुला समीक्षाहरू छन्।',
    },
  },
];

// Helper to create clean SVG data URL for realistic screenshots
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const sampleScreenshots = [
  {
    id: 'sample-fb-phone',
    titleNe: 'फेसबुक: रु. ३० हजारको फोन १२ हजारमा (६ हजार अग्रिम)',
    titleEn: 'Facebook: Rs 30k Phone for 12k (Rs 6k Advance)',
    categoryNe: 'सोसल मिडिया विज्ञापन',
    categoryEn: 'Social Media Ad',
    descriptionNe: '६०% अस्वाभाविक छुट, कमेन्ट बन्द र अग्रिम इसेवा रकम मागिएको विज्ञापन',
    descriptionEn: '60% steep discount, comments disabled, demanding upfront eSewa payment',
    sampleText: 'Facebook Marketplace Ad: Brand new Smartphone 128GB Rs. 12,000 (Market price Rs. 30,000). 60% discount! Delivery all Nepal. Must send Rs. 6,000 advance payment via personal eSewa. Comments turned off by seller.',
    imageUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" rx="16" fill="#182234"/>
        <rect x="20" y="20" width="560" height="48" rx="8" fill="#0f172a"/>
        <circle cx="44" cy="44" r="16" fill="#1877f2"/>
        <text x="44" y="50" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">f</text>
        <text x="72" y="42" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">Facebook Marketplace • Mega Clearance Deal</text>
        <text x="72" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">Kathmandu • Posted 1 hour ago</text>
        
        <rect x="20" y="78" width="560" height="190" rx="12" fill="#1e293b"/>
        <rect x="40" y="98" width="140" height="150" rx="8" fill="#334155"/>
        <text x="110" y="180" font-family="system-ui, sans-serif" font-size="32" text-anchor="middle" fill="#94a3b8">📱</text>
        <text x="200" y="116" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#f8fafc">Android Smartphone 128GB (Box Pack)</text>
        <text x="200" y="148" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#ef4444">रु. १२,००० <tspan font-size="14" fill="#64748b" text-decoration="line-through">रु. ३०,०००</tspan> <tspan font-size="12" fill="#10b981">(६०% छुट)</tspan></text>
        <rect x="200" y="165" width="220" height="26" rx="6" fill="#7f1d1d"/>
        <text x="208" y="182" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#fca5a5">⚠️ अग्रिम रकम रु. ६००० इसेवा गर्नुपर्ने</text>
        <text x="200" y="212" font-family="system-ui, sans-serif" font-size="12" fill="#cbd5e1">सामान नेपालभर २ दिनमा डेलिभरी। सीमित १० पिस मात्र।</text>
        <text x="200" y="232" font-family="system-ui, sans-serif" font-size="11" fill="#f59e0b">🔒 विक्रेताले कमेन्ट बन्द गरेको छ (Comments Disabled)</text>

        <rect x="20" y="280" width="560" height="120" rx="12" fill="#0f172a" stroke="#334155"/>
        <text x="36" y="308" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">💬 मेसेज कुराकानी (Chat with Seller):</text>
        <rect x="36" y="322" width="420" height="32" rx="8" fill="#334155"/>
        <text x="48" y="342" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0">विक्रेता: "अग्रिम ६ हजार ९८०१xxxx इसेवा गर्नुहोस्, अनि पार्सल निस्कन्छ।"</text>
        <rect x="36" y="360" width="380" height="30" rx="8" fill="#1e293b"/>
        <text x="48" y="379" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">ग्राहक: "सामान हेरेर दिन मिल्दैन?" ❌ विक्रेता: "मिल्दैन, नियम यही हो।"</text>
      </svg>
    `),
  },
  {
    id: 'sample-whatsapp-bank',
    titleNe: 'वाट्सएप: नक्कली बैंक अलर्ट र OTP माग',
    titleEn: 'WhatsApp: Fake Bank Warning & OTP Demand',
    categoryNe: 'च्याट स्क्रिनसट',
    categoryEn: 'Chat Screenshot',
    descriptionNe: 'बैंकको नक्कली लोगो प्रयोग गरी तुरुन्त ६ अंकको OTP मागिएको च्याट',
    descriptionEn: 'Fake banking chat with logo demanding 6-digit OTP code to unblock account',
    sampleText: 'WhatsApp Alert from +977-9812345678: "Nepal Rastra Bank Support: Your mobile banking will be suspended in 10 minutes due to expired KYC. Reply with the 6-digit OTP received on your SMS immediately to avoid permanent account block."',
    imageUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" rx="16" fill="#0b141a"/>
        <rect x="20" y="20" width="560" height="50" rx="8" fill="#202c33"/>
        <circle cx="48" cy="45" r="16" fill="#25d366"/>
        <text x="48" y="51" font-family="system-ui, sans-serif" font-size="18" fill="white" text-anchor="middle">🏛️</text>
        <text x="76" y="42" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#e9edef">Nepal Bank Official Support (Unverified)</text>
        <text x="76" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#8696a0">+977 9812345678 • WhatsApp Business</text>
        
        <rect x="50" y="90" width="500" height="150" rx="12" fill="#1f2c34"/>
        <text x="70" y="120" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ef4444">⚠️ URGENT BANK ACCOUNT SECURITY ALERT</text>
        <text x="70" y="145" font-family="system-ui, sans-serif" font-size="12" fill="#d1d7db">प्रिय ग्राहक, तपाईंको मोबाइल बैंकिङ १० मिनेटभित्र निलम्बित हुँदैछ।</text>
        <text x="70" y="170" font-family="system-ui, sans-serif" font-size="12" fill="#d1d7db">खाता जोगाउन तपाईंको मोबाइलमा आएको ६ अंकको गोप्य OTP कोड</text>
        <text x="70" y="195" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">यहाँ तुरुन्त रिप्लाई पठाउनुहोस्। म्याद: १० मिनेट मात्र!</text>
        <text x="490" y="225" font-family="system-ui, sans-serif" font-size="10" fill="#8696a0">10:42 AM ✓✓</text>

        <rect x="20" y="260" width="560" height="140" rx="12" fill="#18222d" stroke="#ef4444" stroke-width="1.5"/>
        <text x="40" y="290" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fca5a5">🚨 AI Detection Flags:</text>
        <text x="40" y="315" font-family="system-ui, sans-serif" font-size="12" fill="#fecaca">• बैंकले कहिल्यै पनि WhatsApp वा फोनमा OTP कोड माग्दैन।</text>
        <text x="40" y="340" font-family="system-ui, sans-serif" font-size="12" fill="#fecaca">• व्यक्तिगत मोबाइल नम्बर (+977 9812...) बाट आएको नक्कली दाबी।</text>
        <text x="40" y="365" font-family="system-ui, sans-serif" font-size="12" fill="#fecaca">• १० मिनेटको नक्कली हतार (Artificial Urgency Tactic)।</text>
      </svg>
    `),
  },
  {
    id: 'sample-tiktok-customs',
    titleNe: 'टिकटक: भन्सार जफत iPhone 15 Pro रु. ३५,०००',
    titleEn: 'TikTok: Customs Clearance iPhone Rs 35k',
    categoryNe: 'भिडियो स्क्रिनसट',
    categoryEn: 'Video Screenshot',
    descriptionNe: 'विमानस्थल भन्सार जफतको नाममा सस्तो फोन र १५ हजार बुकिङ मागिएको अफर',
    descriptionEn: 'Customs seized iPhone 15 clearance sale asking 15k advance wire',
    sampleText: 'TikTok Ad: Tribhuvan Airport Customs Clearance iPhone 15 Pro Max 256GB Rs. 35,000 only! 5 units left. Must pay Rs. 15,000 advance booking charge to private account before parcel dispatch.',
    imageUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" rx="16" fill="#010101"/>
        <rect x="20" y="20" width="560" height="380" rx="14" fill="#111827"/>
        
        <circle cx="50" cy="50" r="18" fill="#fe2c55"/>
        <text x="50" y="56" font-family="system-ui, sans-serif" font-size="16" fill="white" text-anchor="middle">🎵</text>
        <text x="80" y="46" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">@nepal_customs_clearance_sale</text>
        <text x="80" y="62" font-family="system-ui, sans-serif" font-size="11" fill="#9ca3af">Sponsored • 120.4K views</text>

        <rect x="40" y="85" width="520" height="180" rx="10" fill="#1f2937"/>
        <text x="60" y="125" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#38bdf8">✈️ भन्सार जफत सक्कली iPhone 15 Pro Max</text>
        <text x="60" y="160" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#22c55e">रु. ३५,००० मात्र! <tspan font-size="14" fill="#9ca3af">(बजार मूल्य: रु. १,६५,०००)</tspan></text>
        <text x="60" y="195" font-family="system-ui, sans-serif" font-size="13" fill="#fca5a5">🔴 अग्रिम बुकिङ रु. १५,००० व्यक्तिगत खातामा अनिवार्य</text>
        <text x="60" y="225" font-family="system-ui, sans-serif" font-size="12" fill="#e5e7eb">भिडियोमा विदेशी एप्पल स्टोरको फुटेज प्रयोग गरिएको छ।</text>

        <rect x="40" y="280" width="520" height="100" rx="10" fill="#030712" stroke="#374151"/>
        <text x="60" y="310" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fbbf24">📌 भन्सार कार्यालयको आधिकारिक सूचना:</text>
        <text x="60" y="335" font-family="system-ui, sans-serif" font-size="12" fill="#d1d5db">भन्सार कार्यालयले कुनै पनि सामान सोसल मिडिया वा टिकटकमा व्यक्तिगत खातामा पैसा मगाएर लिलाम गर्दैन। यो १००% ठगी हो!</text>
      </svg>
    `),
  },
];

export interface SampleVoiceQuery {
  id: string;
  queryNe: string;
  queryEn: string;
  categoryNe: string;
  categoryEn: string;
}

export const sampleVoiceQueries: SampleVoiceQuery[] = [
  {
    id: 'vq-advance-phone',
    queryNe: 'यो मान्छेले मोबाइल आधा पैसा अगाडि मागेको छ, पैसा पठाउँदा सुरक्षित हुन्छ?',
    queryEn: 'This seller is asking for half payment upfront for a phone, is it safe to send money?',
    categoryNe: 'किनमेल / अग्रिम भुक्तानी',
    categoryEn: 'Shopping Advance',
  },
  {
    id: 'vq-lottery-tax',
    queryNe: 'मलाई ५० हजार रुपैयाँ पुरस्कार पर्यो भन्यो, अनि करको लागि ५०० रुपैयाँ मागेको छ। के यो ठगी हो?',
    queryEn: 'I received a message saying I won a 50,000 rupee lottery, but they ask for 500 rupees tax fee. Is it a scam?',
    categoryNe: 'नक्कली पुरस्कार',
    categoryEn: 'Fake Lottery',
  },
  {
    id: 'vq-bank-otp',
    queryNe: 'बैंकको मान्छे हुँ भन्दै फोन आयो र खाता बन्द हुन लागेकोले मेरो मोबाइलमा आएको कोड मागेको छ, के दिऊँ?',
    queryEn: 'Someone called claiming to be from my bank saying my account is expiring and asking for my OTP code, should I share it?',
    categoryNe: 'बैंक फिसिङ / OTP',
    categoryEn: 'Bank OTP Phishing',
  },
  {
    id: 'vq-work-from-home',
    queryNe: 'युट्युब भिडियो लाइक गर्दा दैनिक ३ हजार रुपैयाँ कमाइ हुन्छ भन्छ, टेलिग्राम जोइन गरूँ त?',
    queryEn: 'They say I can earn 3000 rupees daily just by liking YouTube videos, should I join their Telegram group?',
    categoryNe: 'नक्कली जागिर',
    categoryEn: 'Job Scam',
  },
];

