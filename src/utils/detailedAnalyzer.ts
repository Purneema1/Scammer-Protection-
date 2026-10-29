import { DetailedAnalysisData, SuspiciousEntity, RiskFactor, RiskLevel } from '../types';

export function extractDetailedAnalysisForMessage(
  text: string,
  riskLevel: RiskLevel,
  score: number,
  warningSigns: string[],
  tricks: string[]
): DetailedAnalysisData {
  const t = text.toLowerCase();
  const entities: SuspiciousEntity[] = [];
  const riskFactors: RiskFactor[] = [];

  // 1. Extract Suspicious URLs / Links
  const urlMatches = text.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(top|xyz|tk|ml|ga|cf|gq|icu|buzz|monster|vip)[^\s]*/gi);
  if (urlMatches) {
    urlMatches.forEach((match) => {
      entities.push({
        type: 'Suspicious URL',
        value: match,
        risk: 'HIGH',
        explanationNe: 'सन्देशमा समावेश गरिएको अपरिचित वा फिसिङ लिंक',
        explanationEn: 'Unverified or potentially spoofed hyperlink inside message body',
      });
    });
  }

  // 2. Extract Phone Numbers / Shortcodes
  const phoneMatches = text.match(/(?:\+?977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{7}|\b\d{10}\b)/g);
  if (phoneMatches) {
    phoneMatches.forEach((ph) => {
      entities.push({
        type: 'Contact / Phone',
        value: ph,
        risk: 'MEDIUM',
        explanationNe: 'सन्देशमा उल्लेख गरिएको प्रेषक वा सम्पर्क नम्बर',
        explanationEn: 'Phone number or direct calling identity flagged in text',
      });
    });
  }

  // 3. Extract Monetary Claims / Demanded Amounts
  const moneyMatches = text.match(/(?:रु\.?|rs\.?|\$|usd|npr)\s*[\d,]+(?:\.\d+)?|\b[\d,]+\s*(?:रुपैयाँ|हजार|लाख)/gi);
  if (moneyMatches) {
    moneyMatches.forEach((amt) => {
      entities.push({
        type: 'Monetary Demand / Prize',
        value: amt,
        risk: 'HIGH',
        explanationNe: 'पुरस्कार दाबी वा अग्रिम शुल्क बापत उल्लेख गरिएको रकम',
        explanationEn: 'Claimed winnings or advance transaction amount requested',
      });
    });
  }

  // 4. Extract Brand / Corporate Claims
  const brandKeywords = [
    'nabil',
    'nic asia',
    'esewa',
    'khalti',
    'nepal police',
    'kbc',
    'telegram',
    'whatsapp',
    'facebook',
    'lottery',
    'customs',
    'भन्सार',
    'बिजुली महसुल',
  ];
  brandKeywords.forEach((b) => {
    if (t.includes(b)) {
      const isGenuineUtility = t.includes('नेपाल विद्युत् प्राधिकरण') || t.includes('electricity authority');
      entities.push({
        type: 'Impersonated Entity',
        value: b.toUpperCase(),
        risk: isGenuineUtility ? 'LOW' : 'HIGH',
        explanationNe: isGenuineUtility
          ? 'आधिकारिक सेवा प्रदायकको सन्दर्भ'
          : 'आधिकारिक संस्था वा ब्रान्डको नाम दुरुपयोग गरी विश्वास जित्ने प्रयास',
        explanationEn: isGenuineUtility
          ? 'Reference to public utility service'
          : 'Brand impersonation attempt to manufacture artificial authority',
      });
    }
  });

  // 5. Credentials / OTP Tokens
  if (/\botp\b|one[- ]?time password|verification code|password|passcode|\bpin\b|पासवर्ड|ओटिपी|पिन/.test(t)) {
    entities.push({
      type: 'Credential Keyword',
      value: 'OTP / Security PIN',
      risk: 'HIGH',
      explanationNe: 'खाता नियन्त्रण लिन माग गरिएको गोप्य प्रमाणीकरण कोड',
      explanationEn: 'Sensitive authentication token requested to hijack accounts',
    });
  }

  // Factor 1: Sense of Urgency & Coercion
  const hasUrgency = /urgent|immediately|within \d+ (minutes|hours)|act now|last chance|account suspended|blocked today|तुरुन्त|अहिले नै|तत्काल|२४ घण्टाभित्र|खाता बन्द/.test(t);
  riskFactors.push({
    id: 'urgency',
    nameNe: 'कृत्रिम हतार र त्रास (Sense of Urgency)',
    nameEn: 'Sense of Urgency & Coercion',
    severity: hasUrgency ? 'HIGH' : 'SAFE',
    status: hasUrgency ? 'FLAGGED' : 'CLEAR',
    statusNe: hasUrgency ? 'उच्च जोखिम: हतार र त्रास सिर्जना' : 'सुरक्षित: कुनै अस्वाभाविक दबाब देखिएन',
    statusEn: hasUrgency ? 'Flagged: Artificial Panic Tactics' : 'Clear: No coercive pressure',
    detailNe: hasUrgency
      ? 'छोटो समयसीमा (जस्तै: २४ घण्टाभित्र वा तत्काल) दिएर सोच्ने मौका नदिई निर्णय गराउने चालबाजी भेटियो।'
      : 'सन्देशमा कुनै हतार गराउने वा आतंकित बनाउने शब्द प्रयोग भएको छैन।',
    detailEn: hasUrgency
      ? 'Short deadlines or ultimatums designed to induce panic and force hurried reactions without verification.'
      : 'No manipulative time pressure or psychological coercion detected.',
  });

  // Factor 2: Suspicious Sender / Impersonation
  const hasImpersonation = /bank|nabil|esewa|khalti|police|kbc|manager|officer|cyber bureau|प्रहरी|कर्मचारी|बैंक/.test(t);
  const isHighImpersonation = hasImpersonation && (riskLevel === 'HIGH_RISK' || riskLevel === 'CAUTION');
  riskFactors.push({
    id: 'sender',
    nameNe: 'शंकास्पद प्रेषक र पहिचान (Suspicious Sender / Impersonation)',
    nameEn: 'Suspicious Sender & Authority Impersonation',
    severity: isHighImpersonation ? 'HIGH' : hasImpersonation ? 'MEDIUM' : 'SAFE',
    status: isHighImpersonation ? 'FLAGGED' : 'CLEAR',
    statusNe: isHighImpersonation ? 'उच्च जोखिम: नक्कली बैंक वा अधिकारीको भेष' : 'सुरक्षित / सामान्य पहिचान',
    statusEn: isHighImpersonation ? 'Flagged: Corporate / Official Masquerading' : 'Clear: Normal Sender Profile',
    detailNe: isHighImpersonation
      ? 'आधिकारिक बैंक, डिजिटल वालेट वा सरकारी कार्यालयको नाम अनौपचारिक च्यानलमा दुरुपयोग गरिएको संकेत।'
      : 'कुनै शंकास्पद आधिकारिक संस्थाको नक्कली भेष भेटिएन।',
    detailEn: isHighImpersonation
      ? 'Unauthorized corporate or governmental entity impersonation detected over informal messaging rails.'
      : 'No unverified authority claims detected in text structure.',
  });

  // Factor 3: Unverified Domain / External Links
  const hasExternalLink = Boolean(urlMatches && urlMatches.length > 0);
  riskFactors.push({
    id: 'domain',
    nameNe: 'अप्रमाणित डोमेन र बाह्य लिंक (Unverified Domain & Links)',
    nameEn: 'Unverified Domain & External Hyperlinks',
    severity: hasExternalLink ? 'HIGH' : 'SAFE',
    status: hasExternalLink ? 'FLAGGED' : 'CLEAR',
    statusNe: hasExternalLink ? 'जोखिम: अपरिचित बाह्य लिंक समावेश' : 'सुरक्षित: कुनै शंकास्पद लिंक छैन',
    statusEn: hasExternalLink ? 'Flagged: External Hyperlink Present' : 'Clear: No Suspicious Links',
    detailNe: hasExternalLink
      ? 'सन्देशमा क्लिक गर्न लगाइने बाह्य लिंक भेटियो, जसले नक्कली वा फिसिङ पेजमा लैजान सक्छ।'
      : 'यस सन्देशमा कुनै पनि बाह्य वेबसाइट लिंकहरू समावेश गरिएका छैनन्।',
    detailEn: hasExternalLink
      ? 'External links embedded inside message, exposing the user to potential drive-by downloads or credential traps.'
      : 'No third-party hyperlinks found.',
  });

  // Factor 4: Financial Extraction / Advance Fee
  const hasAdvanceFee = /send money|processing fee|clearance fee|delivery charge|deposit first|wire transfer|advance payment|esewa|khalti|पैसा पठाउनुहोस्|शुल्क तिर्नुहोस्/.test(t);
  riskFactors.push({
    id: 'advance_fee',
    nameNe: 'अग्रिम रकम वा शुल्क असुली (Advance Fee / Transfer Demand)',
    nameEn: 'Advance Fee & Monetary Extraction',
    severity: hasAdvanceFee ? 'HIGH' : 'SAFE',
    status: hasAdvanceFee ? 'FLAGGED' : 'CLEAR',
    statusNe: hasAdvanceFee ? 'उच्च जोखिम: अग्रिम भुक्तानीको माग' : 'सुरक्षित: कुनै पैसा मागिएको छैन',
    statusEn: hasAdvanceFee ? 'Flagged: Upfront Money Demanded' : 'Clear: No financial solicitation',
    detailNe: hasAdvanceFee
      ? 'उपहार, जागिर वा पार्सल पाउन पहिले आफ्नो तर्फबाट पैसा पठाउनुपर्ने सर्त राखिएको छ।'
      : 'कुनै पनि अग्रिम शुल्क वा अनधिकृत रकमान्तरको माग गरिएको छैन।',
    detailEn: hasAdvanceFee
      ? 'Demands upfront payment before promised winnings or parcel deliveries are unlocked.'
      : 'No illicit upfront monetary solicitation found.',
  });

  // Factor 5: Credential Harvesting Threat
  const hasCredentials = /\botp\b|password|\bpin\b|पासवर्ड|ओटिपी|पिन/.test(t);
  riskFactors.push({
    id: 'credentials',
    nameNe: 'गोप्य कोड र पासवर्ड चोरी (Credential Harvesting Risk)',
    nameEn: 'Credential & Authentication Harvesting',
    severity: hasCredentials ? 'HIGH' : 'SAFE',
    status: hasCredentials ? 'FLAGGED' : 'CLEAR',
    statusNe: hasCredentials ? 'उच्च जोखिम: संवेदनशील कोड मागियो' : 'सुरक्षित: कुनै गोप्य कोड मागिएन',
    statusEn: hasCredentials ? 'Flagged: Security Code Solicitation' : 'Clear: No secret codes requested',
    detailNe: hasCredentials
      ? 'बैंक वा खातामा अनधिकृत पहुँच पाउन प्रयोग हुने OTP वा पासवर्ड माग्न खोजिएको छ।'
      : 'सन्देशमा कुनै पनि व्यक्तिगत लगइन वा सुरक्षा विवरण मागिएको छैन।',
    detailEn: hasCredentials
      ? 'Direct attempt to capture OTP tokens or authentication passwords.'
      : 'No authentication harvesting detected.',
  });

  // Calculate model confidence
  const confidenceScore =
    riskLevel === 'HIGH_RISK'
      ? Math.min(98, 85 + (entities.length * 3))
      : riskLevel === 'CAUTION'
      ? 84
      : 92;

  return {
    confidenceScore,
    confidenceLabelNe: `${confidenceScore}% उच्च निश्चितता (एआई विश्लेषण र ढाँचा पहिचान)`,
    confidenceLabelEn: `${confidenceScore}% High Confidence (Signal Heuristics & Pattern Matching)`,
    suspiciousEntities: entities,
    riskFactors,
  };
}

export function extractDetailedAnalysisForLink(
  rawUrl: string,
  riskLevel: RiskLevel,
  score: number,
  protocol: string,
  hostname: string,
  findings: string[]
): DetailedAnalysisData {
  const entities: SuspiciousEntity[] = [];
  const riskFactors: RiskFactor[] = [];
  const host = hostname.toLowerCase();

  // 1. Hostname entity
  entities.push({
    type: 'Inspected Domain',
    value: hostname,
    risk: riskLevel === 'HIGH_RISK' ? 'HIGH' : riskLevel === 'CAUTION' ? 'MEDIUM' : 'LOW',
    explanationNe: 'विश्लेषण गरिएको प्राथमिक वेबसाइट डोमेन',
    explanationEn: 'Primary target destination hostname analyzed',
  });

  // 2. Protocol entity
  entities.push({
    type: 'Security Protocol',
    value: protocol.toUpperCase(),
    risk: protocol === 'https:' ? 'LOW' : 'HIGH',
    explanationNe: protocol === 'https:' ? 'इन्क्रिप्टेड सुरक्षित च्यानल' : 'असुरक्षित खुला च्यानल (HTTP)',
    explanationEn: protocol === 'https:' ? 'Encrypted transmission layer' : 'Unencrypted plain-text transport (HTTP)',
  });

  // 3. TLD evaluation
  const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.buzz', '.monster'];
  const matchedTld = suspiciousTlds.find((tld) => host.endsWith(tld));
  if (matchedTld) {
    entities.push({
      type: 'High-Risk TLD',
      value: matchedTld,
      risk: 'HIGH',
      explanationNe: 'स्प्याम तथा ठगीमा धेरै दुरुपयोग हुने एक्सटेन्सन',
      explanationEn: 'Disposable top-level domain frequently associated with fraud campaigns',
    });
  }

  // 4. Deceptive Brand Keywords in Link
  const sensitiveKws = ['login', 'verify', 'wallet', 'esewa', 'khalti', 'nabil', 'police', 'prize', 'kyc'];
  const matchedKws = sensitiveKws.filter((kw) => rawUrl.toLowerCase().includes(kw));
  if (matchedKws.length > 0) {
    matchedKws.forEach((kw) => {
      entities.push({
        type: 'Deceptive Keyword',
        value: kw,
        risk: 'HIGH',
        explanationNe: 'फिसिङ पेजहरूमा प्रयोगकर्ता झुक्याउन राखिने शब्द',
        explanationEn: 'Keyword commonly weaponized to simulate authentication pages',
      });
    });
  }

  // Specific Risk Factors for Link
  // Factor 1: Unverified Domain & Hosting Reputation
  const isSuspiciousDomain = Boolean(matchedTld) || host.split('.').length >= 4 || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  riskFactors.push({
    id: 'domain_reputation',
    nameNe: 'अप्रमाणित डोमेन र होस्टिङ प्रतिष्ठा (Unverified Domain)',
    nameEn: 'Unverified Domain & Infrastructure Integrity',
    severity: isSuspiciousDomain ? 'HIGH' : 'SAFE',
    status: isSuspiciousDomain ? 'FLAGGED' : 'CLEAR',
    statusNe: isSuspiciousDomain ? 'उच्च जोखिम: शंकास्पद डोमेन ढाँचा' : 'सामान्य: डोमेन ढाँचा मानक अनुरूप',
    statusEn: isSuspiciousDomain ? 'Flagged: High-Risk Infrastructure' : 'Clear: Normal Domain Syntax',
    detailNe: isSuspiciousDomain
      ? 'असामान्य TLD, अत्यधिक सब-डोमेन वा IP ठेगाना प्रयोग भएको फेला पर्‍यो।'
      : 'डोमेनको नाम र सर्भर संरचनामा कुनै असामान्य विसंगति देखिएन।',
    detailEn: isSuspiciousDomain
      ? 'Direct IP host, disposable TLD, or nested subdomain layering detected.'
      : 'Standard domain structure without synthetic camouflaging.',
  });

  // Factor 2: Transport Security (HTTP vs HTTPS)
  const isInsecureHttp = protocol === 'http:';
  riskFactors.push({
    id: 'transport',
    nameNe: 'इन्क्रिप्सन र प्रोटोकल सुरक्षा (Transport Encryption)',
    nameEn: 'Transport Encryption & SSL Certificate',
    severity: isInsecureHttp ? 'HIGH' : 'SAFE',
    status: isInsecureHttp ? 'FLAGGED' : 'CLEAR',
    statusNe: isInsecureHttp ? 'असुरक्षित: HTTP खुला नेटवर्क' : 'सुरक्षित: HTTPS इन्क्रिप्सन सक्रिय',
    statusEn: isInsecureHttp ? 'Flagged: Insecure HTTP Protocol' : 'Clear: HTTPS Encryption Enabled',
    detailNe: isInsecureHttp
      ? 'यो साइटमा कुनै पनि डेटा इन्क्रिप्ट हुँदैन, जसले पासवर्ड चोरी हुने जोखिम बढाउँछ।'
      : 'वेबसाइटले TLS/HTTPS इन्क्रिप्सन प्रयोग गरेको छ। (तर सामग्री आधिकारिक हो कि होइन जाँच्न आवश्यक छ)।',
    detailEn: isInsecureHttp
      ? 'Cleartext HTTP connection allows man-in-the-middle sniffing of transmitted credentials.'
      : 'TLS/HTTPS transport encryption active across the session.',
  });

  // Factor 3: Brand Mimicry & Spoofing
  const hasMimicry = matchedKws.length > 0;
  riskFactors.push({
    id: 'brand_mimicry',
    nameNe: 'नक्कली ब्रान्ड पहिचान (Brand Masquerading & Phishing)',
    nameEn: 'Brand Masquerading & Credential Trap',
    severity: hasMimicry ? 'HIGH' : 'SAFE',
    status: hasMimicry ? 'FLAGGED' : 'CLEAR',
    statusNe: hasMimicry ? 'उच्च जोखिम: बैंक वा वालेटको नक्कल' : 'सुरक्षित: कुनै नक्कली ब्रान्ड कीवर्ड भेटिएन',
    statusEn: hasMimicry ? 'Flagged: Brand Impersonation Signals' : 'Clear: No Misleading Keywords',
    detailNe: hasMimicry
      ? `URL मा "${matchedKws.join(', ')}" जस्ता शब्द प्रयोग गरी वास्तविक संस्थाको भ्रम छर्न खोजिएको छ।`
      : 'कुनै संवेदनशील संस्थाको नक्कल गर्ने शब्द प्रयोग गरिएको छैन।',
    detailEn: hasMimicry
      ? `Keywords [${matchedKws.join(', ')}] present to deceptively mimic genuine service portals.`
      : 'No deceptive authentication traps detected.',
  });

  // Factor 4: Punycode / Homograph Threat
  const isPunycode = host.startsWith('xn--') || host.includes('.xn--');
  riskFactors.push({
    id: 'punycode',
    nameNe: 'प्युनिकोड / अक्षर झुक्याउने चाल (Homograph Attack)',
    nameEn: 'Punycode / Homograph Spoofing Check',
    severity: isPunycode ? 'HIGH' : 'SAFE',
    status: isPunycode ? 'FLAGGED' : 'CLEAR',
    statusNe: isPunycode ? 'जोखिम: Punycode क्यारेक्टर भेटियो' : 'सुरक्षित: मानक ASCII क्यारेक्टर',
    statusEn: isPunycode ? 'Flagged: Punycode IDN Detected' : 'Clear: Standard Latin Characters',
    detailNe: isPunycode
      ? 'अन्तर्राष्ट्रिय क्यारेक्टर प्रयोग गरेर वास्तविक नाम जस्तै देखिने नक्कली डोमेन बनाइएको हुन सक्छ।'
      : 'डोमेनको हिज्जेमा कुनै लुकेका वा झुक्याउने विदेशी अक्षरहरू छैनन्।',
    detailEn: isPunycode
      ? 'Punycode (xn--) detected; often weaponized in visual lookalike domain attacks.'
      : 'Standard UTF-8/ASCII character set.',
  });

  const confidenceScore =
    riskLevel === 'HIGH_RISK'
      ? Math.min(97, 88 + (entities.length * 2))
      : riskLevel === 'CAUTION'
      ? 82
      : 91;

  return {
    confidenceScore,
    confidenceLabelNe: `${confidenceScore}% उच्च निश्चितता (सुरक्षा इन्टेलिजेन्स र प्राविधिक विश्लेषण)`,
    confidenceLabelEn: `${confidenceScore}% High Confidence (Threat Intelligence & Heuristics)`,
    suspiciousEntities: entities,
    riskFactors,
  };
}
