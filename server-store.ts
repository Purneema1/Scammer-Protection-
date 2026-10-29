import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface CustomerCheckRecord {
  id: string;
  timestamp: string;
  toolType: 'message' | 'link' | 'shopping' | 'photo' | 'voice' | 'chat';
  toolNameNe: string;
  toolNameEn: string;
  customerSession: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  customerIp?: string;
  location?: string;
  inputSummary: string;
  fullInput: any;
  riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK';
  score: number;
  scamType?: string;
  solutionSummary: string;
  warningSigns: string[];
  actionSteps: string[];
  source: string;
}

export interface UserAccountServer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'citizen' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  totalChecks: number;
}

export interface CustomerFeedback {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5
  feedbackType: 'accuracy' | 'false_positive' | 'missed_scam' | 'app_experience' | 'feature_request' | 'general';
  checkContext?: string;
  comment: string;
  adminReply?: string;
  status: 'PENDING' | 'REVIEWED';
}

export interface CustomerIssue {
  id: string;
  ticketNumber: string;
  timestamp: string;
  customerName: string;
  customerContact: string; // Phone or Email
  category: 'new_scam_pattern' | 'wrong_verdict' | 'emergency_escalation' | 'app_bug' | 'wallet_reversal';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  adminNotes?: string;
  adminReply?: string;
  resolvedAt?: string;
}

export interface CustomerComment {
  id: string;
  timestamp: string;
  authorName: string;
  isVerifiedVictim?: boolean;
  topic: string;
  content: string;
  likes: number;
  replies?: Array<{
    id: string;
    author: string;
    isAdmin?: boolean;
    text: string;
    timestamp: string;
  }>;
}

const CHECKS_FILE = path.join(DATA_DIR, 'customer_checks.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'customer_feedback.json');
const ISSUES_FILE = path.join(DATA_DIR, 'customer_issues.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'customer_comments.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESETS_FILE = path.join(DATA_DIR, 'password_resets.json');

function readJsonFile<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial seed data representing realistic Nepal cyber checks
const initialChecksSeed: CustomerCheckRecord[] = [
  {
    id: 'chk-1001',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    toolType: 'shopping',
    toolNameNe: 'सोसल मिडिया किनमेल जाँच',
    toolNameEn: 'Social Media Shopping Check',
    customerSession: 'User-KTM-4829',
    userId: 'usr-101',
    userName: 'उमेश शर्मा',
    userEmail: 'umeshprovidhy@gmail.com',
    userPhone: '9812345678',
    userRole: 'citizen',
    location: 'Kathmandu, Nepal',
    inputSummary: 'iPhone 15 Pro Max advertised for Rs. 42,000, 50% advance requested',
    fullInput: {
      productName: 'iPhone 15 Pro Max',
      marketPrice: 195000,
      advertisedPrice: 42000,
      advancePayment: 21000,
      sellerPlatform: 'Facebook Marketplace',
      paymentMethod: 'Personal eSewa QR',
      commentsDisabled: true,
    },
    riskLevel: 'HIGH_RISK',
    score: 95,
    scamType: 'अस्वाभाविक सस्तो मूल्य र अग्रिम रकम ठगी (Marketplace Advance Scam)',
    solutionSummary: 'बजार मूल्य रु. १,९५,००० को फोन रु. ४२,००० मा देखाएर २१,००० अग्रिम मागिएको छ। यो ९९% ठगीको जाल हो।',
    warningSigns: [
      'बजार मूल्यभन्दा ७८% अस्वाभाविक सस्तो मूल्य',
      'सामान हात नपरी ५०% अग्रिम रकम व्यक्तिगत इसेवामा मागिएको',
      'सोसल मिडिया विज्ञापनमा कमेन्ट बन्द गरिएको',
    ],
    actionSteps: [
      'कुनै पनि अग्रिम रकम इसेवा वा बैंक खातामा नपठाउनुहोस्।',
      'Cash on Delivery (COD) विकल्प माग्नुहोस्।',
      'विक्रेताको आधिकारिक पसल ठेगाना र PAN/VAT माग गर्नुहोस्।',
    ],
    source: 'gemini-3.8-flash',
  },
  {
    id: 'chk-1002',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    toolType: 'message',
    toolNameNe: 'सन्देश र SMS जाँच',
    toolNameEn: 'Message & SMS Check',
    customerSession: 'User-PKR-9120',
    userId: 'usr-102',
    userName: 'रमेश अधिकारी',
    userEmail: 'ramesh@example.com',
    userPhone: '9841234567',
    userRole: 'citizen',
    location: 'Pokhara, Nepal',
    inputSummary: 'तपाईंको eSewa खाता KYC अपडेट गर्न तलको लिंक खोल्नुहोस् OTP आवश्यक छ',
    fullInput: {
      message: 'तपाईंको eSewa खाता KYC समय सकिएको छ, २४ घण्टाभित्र अपडेट नगरे खाता रोक्का हुनेछ। तुरुन्त http://esewa-update-kyc.top मा गएर OTP हाल्नुहोस्।',
    },
    riskLevel: 'HIGH_RISK',
    score: 98,
    scamType: 'बैंक तथा वालेट फिसिङ र OTP चोरी (KYC Impersonation Phishing)',
    solutionSummary: 'eSewa को नाममा नक्कली सन्देश पठाएर पासवर्ड र OTP चोर्ने प्रयास गरिएको छ।',
    warningSigns: [
      '२४ घण्टाभित्र खाता बन्द हुने कृत्रिम त्रास र हतार',
      'असुरक्षित र नक्कली डोमेन (.top)',
      'गोप्य OTP र प्रमाण माग गरिएको',
    ],
    actionSteps: [
      'लिंकमा क्लिक नगर्नुहोस् र कसैलाई OTP नदिनुहोस्।',
      'eSewa को आधिकारिक एप खोलेर मात्र आफ्नो खाताको अवस्था हेर्नुहोस्।',
      'शंकास्पद नम्बरलाई तत्काल ब्लक र रिपोर्ट गर्नुहोस्।',
    ],
    source: 'gemini-3.8-flash',
  },
  {
    id: 'chk-1003',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    toolType: 'link',
    toolNameNe: 'लिंक जाँच',
    toolNameEn: 'Link / URL Check',
    customerSession: 'User-BTL-1422',
    userId: 'usr-103',
    userName: 'सीता श्रेष्ठ',
    userEmail: 'sita.shrestha@gmail.com',
    userPhone: '9851122334',
    userRole: 'citizen',
    location: 'Butwal, Nepal',
    inputSummary: 'http://192.168.1.10/nabil-smart-login/claim-bonus',
    fullInput: {
      url: 'http://192.168.1.10/nabil-smart-login/claim-bonus',
    },
    riskLevel: 'HIGH_RISK',
    score: 92,
    scamType: 'नक्कली बैंक लगइन फिसिङ (Raw IP Banking Spoof)',
    solutionSummary: 'नबिल बैंकको नाम प्रयोग गरी सिधै IP ठेगानामा खोलिएको असुरक्षित फिसिङ लिंक।',
    warningSigns: [
      'डोमेन नामको सट्टा सिधै संख्यात्मक IP ठेगाना प्रयोग भएको',
      'HTTP असुरक्षित प्रोटोकल (डाटा इन्क्रिप्ट नहुने)',
      'बोनसको प्रलोभन देखाएर लगइन विवरण माग्ने ढाँचा',
    ],
    actionSteps: [
      'यो लिंकमा कुनै पनि बैंक युजरनेम वा पासवर्ड नराख्नुहोस्।',
      'बैंकको आधिकारिक वेबसाइट (nabilbank.com) वा आधिकारिक मोबाइल एप मात्र प्रयोग गर्नुहोस्।',
    ],
    source: 'gemini-3.8-flash',
  },
  {
    id: 'chk-1004',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    toolType: 'voice',
    toolNameNe: 'आवाजबाट जाँच',
    toolNameEn: 'Voice Scam Assistant',
    customerSession: 'User-BRT-3310',
    userId: 'usr-101',
    userName: 'उमेश शर्मा',
    userEmail: 'umeshprovidhy@gmail.com',
    userPhone: '9812345678',
    userRole: 'citizen',
    location: 'Biratnagar, Nepal',
    inputSummary: 'कसैले फोन गरेर २५ लाख चिठ्ठा पर्यो, कर तिर्न ५० हजार पठाउ भन्यो',
    fullInput: {
      transcript: 'नमस्ते, मलाई वाट्सएपमा फोन आयो र २५ लाखको चिठ्ठा परेको छ भन्यो। त्यो रकम पाउन पहिले ५० हजार ट्याक्स शुल्क इसेवा गर्नुपर्छ रे। के म पैसा पठाउँ?',
    },
    riskLevel: 'HIGH_RISK',
    score: 99,
    scamType: 'चिठ्ठा तथा पार्सल शुल्क ठगी (Lottery Advance Fee Scam)',
    solutionSummary: 'क्लासिक चिट्ठा ठगी हो। कुनै पनि आधिकारिक संस्थाले चिट्ठाको पैसा पाउन पहिले अग्रिम रकम माग्दैन।',
    warningSigns: [
      'नकिनेको चिट्ठामा २५ लाख जितेको झुटो दाबी',
      'रकम प्राप्त गर्न पहिले ५० हजार अग्रिम शुल्क माग',
      'व्यक्तिगत वालेटमा रकम स्थानान्तरण गर्न दबाब',
    ],
    actionSteps: [
      'एक रुपैयाँ पनि पैसा नपठाउनुहोस्।',
      'सम्बन्धित नम्बरलाई तुरुन्त ब्लक गर्नुहोस्।',
      'परिवार र साथीभाइलाई पनि यस्तो फोनबाट जोगिन सचेत गराउनुहोस्।',
    ],
    source: 'gemini-3.8-flash',
  },
  {
    id: 'chk-1005',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    toolType: 'photo',
    toolNameNe: 'फोटो / स्क्रिनसट जाँच',
    toolNameEn: 'Photo & Screenshot Check',
    customerSession: 'User-DHK-5511',
    userId: 'usr-102',
    userName: 'रमेश अधिकारी',
    userEmail: 'ramesh@example.com',
    userPhone: '9841234567',
    userRole: 'citizen',
    location: 'Dhankuta, Nepal',
    inputSummary: 'TikTok भिडियो लाइक गरेर दैनिक रु. ५००० कमाउने स्क्रिनसट',
    fullInput: {
      notes: 'टिकटकमा भिडियो लाइक गर्दा पैसा दिने र पछि भिआइपी टास्कका लागि रु. १५ हजार डिपोजिट गर्न भनेको च्याट',
    },
    riskLevel: 'HIGH_RISK',
    score: 94,
    scamType: 'टेलिग्राम जब / टास्क ठगी (Telegram Part-time Job Ponzi)',
    solutionSummary: 'सुरुमा केही सय रुपैयाँ दिएर विश्वास जित्ने र पछि ठूलो रकम डिपोजिट गराएर सम्पर्कविहीन हुने टास्क ठगी।',
    warningSigns: [
      'अस्वाभाविक र अवास्तविक दैनिक आम्दानी (रु. ५०००)',
      'टेलिग्राम च्यानलमा बोलाएर टास्क दिने शैली',
      'पैसा निकाल्न पहिले धरौटी वा अपग्रेड रकम माग्ने ढाँचा',
    ],
    actionSteps: [
      'कुनै पनि धरौटी वा भिआइपी रकम डिपोजिट नगर्नुहोस्।',
      'टेलिग्राम ग्रुपबाट तुरुन्त बाहिर निस्कनुहोस्।',
    ],
    source: 'gemini-3.8-flash-vision',
  },
];

const initialFeedbackSeed: CustomerFeedback[] = [
  {
    id: 'fb-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customerName: 'रमेश अधिकारी (Ramesh Adhikari)',
    customerEmail: 'ramesh.adh@gmail.com',
    rating: 5,
    feedbackType: 'accuracy',
    checkContext: 'Shopping Scam Check (iPhone deal on Facebook)',
    comment: 'म ठगिनै लागेको थिएँ, फेसबुकको एउटा पसलले २० हजार एडभान्स मागेको थियो। यो एपले तुरुन्तै ९५% ठगी भनेर चेतावनी दियो र मेरो पैसा जोगियो! धेरै धन्यवाद।',
    adminReply: 'नमस्ते रमेशजी, तपाईंको पैसा जोगिएकोमा खुसी लाग्यो! कहिल्यै पनि सोसल मिडियामा अग्रिम रकम नपठाउनुहोला।',
    status: 'REVIEWED',
  },
  {
    id: 'fb-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customerName: 'सुमन श्रेष्ठ (Suman Shrestha)',
    customerEmail: 'suman.shrestha@outlook.com',
    rating: 5,
    feedbackType: 'app_experience',
    checkContext: 'Nepali Voice Scam Assistant',
    comment: 'नेपालीमै बोल्न मिल्ने र जवाफ पनि आवाजमै आउने सुविधा साह्रै गजब लाग्यो। मेरो आमाबुबाले पनि सजिलै चलाउन सक्नुभयो।',
    adminReply: 'प्रतिक्रियाका लागि धन्यवाद सुमनजी! आवाज सुविधालाई अझ सहज बनाउन हामी निरन्तर काम गरिरहेका छौँ।',
    status: 'REVIEWED',
  },
  {
    id: 'fb-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    customerName: 'अन्जली कार्की (Anjali Karki)',
    customerEmail: 'anjali.karki@gmail.com',
    rating: 4,
    feedbackType: 'feature_request',
    comment: 'नेपाल प्रहरी साइबर ब्युरोको निवेदन फारम बनाइदिने सुविधा धेरै राम्रो छ। यसमा उजुरी डाउनलोड गर्दा PDF मा पनि डाउनलोड हुने बनाए अझ सजिलो हुन्थ्यो।',
    status: 'PENDING',
  },
];

const initialIssuesSeed: CustomerIssue[] = [
  {
    id: 'iss-201',
    ticketNumber: 'NCB-TK-8812',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    customerName: 'प्रदिप गुरुङ (Pradip Gurung)',
    customerContact: '9841****** / WhatsApp',
    category: 'new_scam_pattern',
    title: 'नयाँ शैलीको विद्युत महसुल नतिरेको भन्दै लाइन काट्ने चेतावनी SMS',
    description: 'मलाई आज नेपाल विद्युत प्राधिकरणको नाममा SMS आयो— "तपाईंको आज राति ९:३० बजे विद्युत लाइन काटिँदैछ, तुरुन्त 9801****** मा सम्पर्क गर्नुहोस्"। यसबारे एपमा थप विवरण राख्नुहोला।',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    adminNotes: 'NEA impersonation scam spreading across Bagmati province. Updating regex keywords and advisory notes.',
    adminReply: 'नमस्ते प्रदिपजी, यो विद्युत प्राधिकरणको नाममा भइरहेको नयाँ ठगी हो। हामीले यसलाई सन्देश जाँच प्रणालीमा अपडेट गरिसकेका छौँ।',
  },
  {
    id: 'iss-202',
    ticketNumber: 'NCB-TK-8809',
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    customerName: 'बिनोद थापा (Binod Thapa)',
    customerContact: 'binod.thapa89@gmail.com',
    category: 'wallet_reversal',
    title: 'मैले २ घण्टा अघि रु. १५,००० पठाएँ, इसेवामा खाता रोक्का भएन',
    description: 'ठगले सामान पठाउँछु भनेर १५ हजार इसेवा गरायो र ब्लक गर्यो। मैले इसेवामा फोन गर्दा प्रहरीको उजुरी चाहिन्छ भन्यो। के यो एपबाट तयार भएको निवेदन प्रहरीले स्वीकार गर्छ?',
    severity: 'CRITICAL',
    status: 'OPEN',
    adminNotes: 'User needs urgent guidance for physical submission at Cyber Bureau Bhotahity.',
    adminReply: 'हो बिनोदजी, यो एपबाट प्रिन्ट गरिएको उजुरी निवेदन नेपाल प्रहरी साइबर ब्युरो तथा नजिकको जिल्ला प्रहरी परिसरमा १००% मान्य हुन्छ। तुरुन्त हस्ताक्षर गरी बुझाउनुहोस्।',
  },
  {
    id: 'iss-203',
    ticketNumber: 'NCB-TK-8801',
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    customerName: 'सरिता मगर (Sarita Magar)',
    customerContact: '9813******',
    category: 'wrong_verdict',
    title: 'कलेजको आधिकारिक फि तिर्ने सूचनालाई शंकास्पद देखायो',
    description: 'हाम्रो कलेजको बैंकिङ खातामा फि तिर्ने सन्देशलाई एपले मध्यम जोखिम देखायो। यसमा कलेजको नाम पहिचान गर्ने सुविधा सुधार गर्नुपर्ने देखियो।',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    adminNotes: 'Verified genuine college circular. Added whitelisting heuristic for registered educational institutions.',
    adminReply: 'नमस्ते सरिताजी, जानकारीका लागि धन्यवाद। कलेज तथा शैक्षिक संस्थाका शुल्क सूचनालाई सही पहिचान गर्न नियम अद्यावधिक गरिएको छ।',
  },
];

const initialCommentsSeed: CustomerComment[] = [
  {
    id: 'cmt-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    authorName: 'सुरज केसी (Suraj KC)',
    isVerifiedVictim: false,
    topic: 'फेसबुकमा सस्तो सुन र आइफोनको विज्ञापन',
    content: 'फेसबुकमा अचेल ९०% बजार मूल्यभन्दा सस्तो देखाएर अग्रिम रकम माग्ने पेजहरू धेरै सक्रिय छन्। डेलिभरी अघि कहिल्यै पैसा नपठाउनुहोला साथीहरू!',
    likes: 14,
    replies: [
      {
        id: 'rep-1',
        author: 'Admin Support',
        isAdmin: true,
        text: 'सही भन्नुभयो सुरजजी! हाम्रो सपिङ ठगी जाँच टुलमा अफर राखेर जोखिम जाँच गर्न सबैलाई अनुरोध गर्दछौँ।',
        timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      },
    ],
  },
  {
    id: 'cmt-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    authorName: 'दिपक शर्मा (Deepak Sharma)',
    isVerifiedVictim: true,
    topic: 'टेलिग्राम जबमा मेरो ३० हजार फसेको अनुभव',
    content: 'सुरुमा युट्युब भिडियो लाइक गर्दा रु. ८०० खातामै हाल्दिए। त्यसपछि ५० हजारको भिआइपी टास्क भन्यो। मैले ३० हजार हालेपछि टेलिग्राम ग्रुपबाटै हटाइदियो। कोही पनि यस्तो लोभमा नफस्नुहोला।',
    likes: 27,
  },
];

const initialUsersSeed: UserAccountServer[] = [
  {
    id: 'usr-admin-1',
    name: 'इन्स्पेक्टर सन्तोष थापा (Cyber Bureau Admin)',
    email: 'admin@scamdefense.gov.np',
    phone: '9801234567',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastLoginAt: new Date().toISOString(),
    totalChecks: 12,
  },
  {
    id: 'usr-101',
    name: 'उमेश शर्मा (Umesh Sharma)',
    email: 'umeshprovidhy@gmail.com',
    phone: '9812345678',
    password: 'Nepal@123',
    role: 'citizen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    totalChecks: 3,
  },
  {
    id: 'usr-102',
    name: 'रमेश अधिकारी (Ramesh Adhikari)',
    email: 'ramesh@example.com',
    phone: '9841234567',
    password: 'Nepal@123',
    role: 'citizen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    totalChecks: 4,
  },
  {
    id: 'usr-103',
    name: 'सीता श्रेष्ठ (Sita Shrestha)',
    email: 'sita.shrestha@gmail.com',
    phone: '9851122334',
    password: 'Nepal@123',
    role: 'citizen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    totalChecks: 2,
  },
];

// Initialize datasets
let customerChecks: CustomerCheckRecord[] = readJsonFile(CHECKS_FILE, initialChecksSeed);
let customerFeedbacks: CustomerFeedback[] = readJsonFile(FEEDBACK_FILE, initialFeedbackSeed);
let customerIssues: CustomerIssue[] = readJsonFile(ISSUES_FILE, initialIssuesSeed);
let customerComments: CustomerComment[] = readJsonFile(COMMENTS_FILE, initialCommentsSeed);
let customerUsers: UserAccountServer[] = readJsonFile(USERS_FILE, initialUsersSeed);

// Helper functions for logging checks
export function recordCustomerCheck(data: Omit<CustomerCheckRecord, 'id' | 'timestamp'>): CustomerCheckRecord {
  const newRecord: CustomerCheckRecord = {
    id: `chk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...data,
  };
  customerChecks.unshift(newRecord);
  // Keep last 300 checks in memory/disk
  if (customerChecks.length > 300) {
    customerChecks = customerChecks.slice(0, 300);
  }
  writeJsonFile(CHECKS_FILE, customerChecks);

  // If check has userId, increment their check count
  if (data.userId) {
    incrementUserCheckCount(data.userId);
  }

  return newRecord;
}

export function getCustomerChecks(filter?: {
  toolType?: string;
  riskLevel?: string;
  search?: string;
  userId?: string;
  limit?: number;
}) {
  let list = [...customerChecks];
  if (filter?.toolType && filter.toolType !== 'all') {
    list = list.filter((c) => c.toolType === filter.toolType);
  }
  if (filter?.riskLevel && filter.riskLevel !== 'all') {
    list = list.filter((c) => c.riskLevel === filter.riskLevel);
  }
  if (filter?.userId && filter.userId !== 'all') {
    list = list.filter((c) => c.userId === filter.userId);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.inputSummary.toLowerCase().includes(q) ||
        (c.scamType && c.scamType.toLowerCase().includes(q)) ||
        c.customerSession.toLowerCase().includes(q) ||
        c.solutionSummary.toLowerCase().includes(q)
    );
  }
  const limit = filter?.limit || 100;
  return list.slice(0, limit);
}

export function deleteCustomerCheck(id: string): boolean {
  const initLen = customerChecks.length;
  customerChecks = customerChecks.filter((c) => c.id !== id);
  if (customerChecks.length !== initLen) {
    writeJsonFile(CHECKS_FILE, customerChecks);
    return true;
  }
  return false;
}

export function clearAllCustomerChecks() {
  customerChecks = [];
  writeJsonFile(CHECKS_FILE, customerChecks);
}

// Feedback handlers
export function addCustomerFeedback(feedback: Omit<CustomerFeedback, 'id' | 'timestamp' | 'status'>): CustomerFeedback {
  const newFb: CustomerFeedback = {
    id: `fb-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'PENDING',
    ...feedback,
  };
  customerFeedbacks.unshift(newFb);
  writeJsonFile(FEEDBACK_FILE, customerFeedbacks);
  return newFb;
}

export function getCustomerFeedbacks() {
  return customerFeedbacks;
}

export function replyToFeedback(id: string, reply: string): boolean {
  const fb = customerFeedbacks.find((f) => f.id === id);
  if (fb) {
    fb.adminReply = reply;
    fb.status = 'REVIEWED';
    writeJsonFile(FEEDBACK_FILE, customerFeedbacks);
    return true;
  }
  return false;
}

// Issue handlers
export function createCustomerIssue(issue: Omit<CustomerIssue, 'id' | 'ticketNumber' | 'timestamp' | 'status'>): CustomerIssue {
  const ticketNumber = `NCB-TK-${Math.floor(1000 + Math.random() * 9000)}`;
  const newIssue: CustomerIssue = {
    id: `iss-${Date.now()}`,
    ticketNumber,
    timestamp: new Date().toISOString(),
    status: 'OPEN',
    ...issue,
  };
  customerIssues.unshift(newIssue);
  writeJsonFile(ISSUES_FILE, customerIssues);
  return newIssue;
}

export function getCustomerIssues() {
  return customerIssues;
}

export function updateCustomerIssue(
  id: string,
  updates: Partial<Pick<CustomerIssue, 'status' | 'severity' | 'adminNotes' | 'adminReply'>>
): CustomerIssue | null {
  const issue = customerIssues.find((i) => i.id === id);
  if (issue) {
    if (updates.status) issue.status = updates.status;
    if (updates.severity) issue.severity = updates.severity;
    if (updates.adminNotes !== undefined) issue.adminNotes = updates.adminNotes;
    if (updates.adminReply !== undefined) issue.adminReply = updates.adminReply;
    if (updates.status === 'RESOLVED' && !issue.resolvedAt) {
      issue.resolvedAt = new Date().toISOString();
    }
    writeJsonFile(ISSUES_FILE, customerIssues);
    return issue;
  }
  return null;
}

// Comments handlers
export function getCustomerComments() {
  return customerComments;
}

export function addCustomerComment(comment: { authorName: string; topic: string; content: string; isVerifiedVictim?: boolean }): CustomerComment {
  const newComment: CustomerComment = {
    id: `cmt-${Date.now()}`,
    timestamp: new Date().toISOString(),
    likes: 1,
    ...comment,
    replies: [],
  };
  customerComments.unshift(newComment);
  writeJsonFile(COMMENTS_FILE, customerComments);
  return newComment;
}

export function replyToCustomerComment(commentId: string, reply: { author: string; text: string; isAdmin?: boolean }) {
  const comment = customerComments.find((c) => c.id === commentId);
  if (comment) {
    if (!comment.replies) comment.replies = [];
    comment.replies.push({
      id: `rep-${Date.now()}`,
      author: reply.author,
      isAdmin: reply.isAdmin,
      text: reply.text,
      timestamp: new Date().toISOString(),
    });
    writeJsonFile(COMMENTS_FILE, customerComments);
    return comment;
  }
  return null;
}

export function likeCustomerComment(commentId: string): number {
  const comment = customerComments.find((c) => c.id === commentId);
  if (comment) {
    comment.likes = (comment.likes || 0) + 1;
    writeJsonFile(COMMENTS_FILE, customerComments);
    return comment.likes;
  }
  return 0;
}

// Stats for dashboard
export function getAdminDashboardStats() {
  const totalChecks = customerChecks.length;
  const highRiskCount = customerChecks.filter((c) => c.riskLevel === 'HIGH_RISK').length;
  const cautionCount = customerChecks.filter((c) => c.riskLevel === 'CAUTION').length;
  const lowRiskCount = customerChecks.filter((c) => c.riskLevel === 'LOW_RISK').length;

  const toolBreakdown: Record<string, number> = {};
  customerChecks.forEach((c) => {
    toolBreakdown[c.toolType] = (toolBreakdown[c.toolType] || 0) + 1;
  });

  const totalFeedback = customerFeedbacks.length;
  const avgRating =
    totalFeedback > 0
      ? (
          customerFeedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
          totalFeedback
        ).toFixed(1)
      : '5.0';

  const openIssues = customerIssues.filter((i) => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;
  const resolvedIssues = customerIssues.filter((i) => i.status === 'RESOLVED').length;

  return {
    totalChecks,
    highRiskCount,
    cautionCount,
    lowRiskCount,
    toolBreakdown,
    totalFeedback,
    avgRating: Number(avgRating),
    openIssues,
    resolvedIssues,
    totalComments: customerComments.length,
    totalUsers: customerUsers.length,
    lastActivity: customerChecks[0]?.timestamp || new Date().toISOString(),
  };
}

// User Management & Authentication Functions
export function getAllUsers(): Omit<UserAccountServer, 'password'>[] {
  return customerUsers.map(({ password, ...u }) => u);
}

export function getUserById(id: string): UserAccountServer | undefined {
  return customerUsers.find((u) => u.id === id);
}

export function getUserByEmailOrPhone(identifier: string): UserAccountServer | undefined {
  const clean = identifier.trim().toLowerCase();
  return customerUsers.find(
    (u) => u.email.toLowerCase() === clean || u.phone.replace(/[^0-9]/g, '') === identifier.trim().replace(/[^0-9]/g, '')
  );
}

export function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'citizen' | 'admin';
}): Omit<UserAccountServer, 'password'> {
  const existing = getUserByEmailOrPhone(data.email) || getUserByEmailOrPhone(data.phone);
  if (existing) {
    throw new Error('यो इमेल वा फोन नम्बर पहिले नै दर्ता भइसकेको छ (Email/Phone already exists)');
  }

  const role = data.role || (data.email.toLowerCase().includes('admin') ? 'admin' : 'citizen');
  const newUser: UserAccountServer = {
    id: `usr-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    password: data.password.trim(),
    role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    totalChecks: 0,
  };

  customerUsers.unshift(newUser);
  writeJsonFile(USERS_FILE, customerUsers);
  const { password, ...safeUser } = newUser;
  return safeUser;
}

export function authenticateUser(
  emailOrPhone: string,
  passwordAttempt: string
): Omit<UserAccountServer, 'password'> | null {
  const user = getUserByEmailOrPhone(emailOrPhone);
  if (!user) return null;
  if (user.password === passwordAttempt.trim()) {
    user.lastLoginAt = new Date().toISOString();
    writeJsonFile(USERS_FILE, customerUsers);
    const { password, ...safeUser } = user;
    return safeUser;
  }
  return null;
}

// Password Reset OTP Tracking
interface ResetOtpRecord {
  identifier: string;
  code: string;
  expiresAt: number;
}
let resetCodes: ResetOtpRecord[] = [];

export function requestPasswordReset(emailOrPhone: string): {
  success: boolean;
  code?: string;
  message: string;
  email?: string;
} {
  const user = getUserByEmailOrPhone(emailOrPhone);
  if (!user) {
    return {
      success: false,
      message: 'यस इमेल वा फोन नम्बर भएको प्रयोगकर्ता भेटिएन (No user found with this email/phone)',
    };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodes = resetCodes.filter(
    (r) => r.identifier !== user.email && r.identifier !== user.phone
  );
  resetCodes.push({
    identifier: user.email,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {
    success: true,
    code,
    email: user.email,
    message: `प्रमाणीकरण कोड तयार भयो। परीक्षणका लागि OTP: ${code}`,
  };
}

export function resetUserPassword(
  emailOrPhone: string,
  code: string,
  newPassword: string
): { success: boolean; message: string; user?: Omit<UserAccountServer, 'password'> } {
  const user = getUserByEmailOrPhone(emailOrPhone);
  if (!user) {
    return { success: false, message: 'प्रयोगकर्ता फेला परेन (User not found)' };
  }

  const validOtp = resetCodes.find(
    (r) =>
      (r.identifier === user.email || r.identifier === user.phone) &&
      r.code === code.trim() &&
      r.expiresAt > Date.now()
  );

  // Accept generated OTP or demo bypass 123456
  if (!validOtp && code.trim() !== '123456') {
    return {
      success: false,
      message: 'गलत वा म्याद सकिएको कोड। कृपया पुनः प्रयास गर्नुहोस् (Invalid or expired verification code)',
    };
  }

  user.password = newPassword.trim();
  writeJsonFile(USERS_FILE, customerUsers);
  resetCodes = resetCodes.filter((r) => r.identifier !== user.email);

  const { password, ...safeUser } = user;
  return {
    success: true,
    message: 'पासवर्ड सफलतापूर्वक परिवर्तन भयो! (Password updated successfully)',
    user: safeUser,
  };
}

export function incrementUserCheckCount(userId?: string) {
  if (!userId) return;
  const user = customerUsers.find((u) => u.id === userId);
  if (user) {
    user.totalChecks = (user.totalChecks || 0) + 1;
    user.lastLoginAt = new Date().toISOString();
    writeJsonFile(USERS_FILE, customerUsers);
  }
}

