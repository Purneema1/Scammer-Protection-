import { MessageAnalysisResult, LinkAnalysisResult } from '../types';
import {
  extractDetailedAnalysisForMessage,
  extractDetailedAnalysisForLink,
} from './detailedAnalyzer';

export function analyzeMessageClient(text: string, lang: 'ne' | 'en'): MessageAnalysisResult {
  const isNe = lang === 'ne';
  const t = text.toLowerCase();
  const warningSigns: string[] = [];
  const tricks: string[] = [];
  let score = 10;

  // 1. Credentials / OTP / PIN
  if (/\botp\b|one[- ]?time password|verification code|password|passcode|\bpin\b|पासवर्ड|ओटिपी|पिन नम्बर|कोड दिनुहोस्/.test(t)) {
    warningSigns.push(
      isNe
        ? 'सन्देशमा OTP, गोप्य पासवर्ड वा पिन नम्बर मागिएको छ। बैंक वा डिजिटल वालेटले कहिल्यै गोप्य कोड माग्दैन।'
        : 'The message asks for an OTP, password, or PIN. Official organizations never request these credentials.'
    );
    tricks.push(isNe ? 'गोप्य विवरण चोरी (Credential Harvesting)' : 'Credential Harvesting');
    score += 35;
  }

  // 2. Urgency & Panic
  if (/urgent|immediately|within \d+ (minutes|hours)|act now|last chance|account suspended|blocked today|तुरुन्त|अहिले नै|तत्काल|२४ घण्टाभित्र|खाता बन्द/.test(t)) {
    warningSigns.push(
      isNe
        ? 'अत्यधिक हतार र त्रास देखाउने भाषा प्रयोग गरिएको छ (जस्तै: तुरुन्त नगरे खाता बन्द हुन्छ)।'
        : 'High-urgency language designed to trigger panic and bypass critical thinking.'
    );
    tricks.push(isNe ? 'कृत्रिम हतार र त्रास (Artificial Urgency)' : 'Artificial Urgency & Pressure');
    score += 25;
  }

  // 3. Prizes / Lottery / Unrealistic Rewards
  if (/won|winner|lottery|prize|reward|gift voucher|unclaimed fund|congratulations|रु\.\s*[\d,]+|चिठ्ठा|पुरस्कार|बधाई छ|उपहार|५०,०००|लाख/.test(t)) {
    warningSigns.push(
      isNe
        ? 'नचिताएको ठूलो पुरस्कार वा उपहार जितेको प्रलोभन देखाइएको छ।'
        : 'Unsolicited prize, lottery, or windfall reward claims.'
    );
    tricks.push(isNe ? 'लोभ र पुरस्कारको प्रलोभन (Greed / Bait)' : 'Greed / Reward Temptation');
    score += 25;
  }

  // 4. Money transfer / Advance fees
  if (/send money|processing fee|clearance fee|delivery charge|deposit first|wire transfer|advance payment|esewa|khalti|बैंकमा रकम|पैसा पठाउनुहोस्|शुल्क तिर्नुहोस्/.test(t)) {
    warningSigns.push(
      isNe
        ? 'काम, पार्सल वा उपहार पाउन पहिले शुल्क वा धरौटी रकम पठाउन भनिएको छ।'
        : 'Demands upfront payment or transfer before releasing prizes or completing delivery.'
    );
    tricks.push(isNe ? 'अग्रिम शुल्क असुली (Advance Fee Fraud)' : 'Advance Fee Demands');
    score += 30;
  }

  // 5. Threatening / Legal Action
  if (/arrested|police warrant|court summons|legal action|fbi|cyber bureau|carvahi|कारबाही|पक्राउ|मुद्दा दायर/.test(t)) {
    warningSigns.push(
      isNe
        ? 'प्रहरी, अदालत वा कानुनी कारबाहीको धम्की दिएर तर्साउन खोजिएको छ।'
        : 'Legal intimidation or impersonation of law enforcement agencies.'
    );
    tricks.push(isNe ? 'अधिकारको दुरुपयोग र धम्की (Authority Intimidation)' : 'Authority & Intimidation');
    score += 30;
  }

  // 6. Suspicious Job / WFH Task
  if (/work from home|telegram task|daily income|part time job|like videos|qatar visa|free visa|घर बसी बसी|दैनिक कमाइ|भिडियो लाइक गर्ने काम/.test(t)) {
    warningSigns.push(
      isNe
        ? 'घरमै बसेर सजिलै धेरै कमाइ हुने नक्कली काम वा शंकास्पद वैदेशिक रोजगारको अफर।'
        : 'Unrealistic work-from-home or Telegram task scheme offering quick cash.'
    );
    tricks.push(isNe ? 'नक्कली जागिरको प्रलोभन (Fake Employment Bait)' : 'Employment Bait');
    score += 20;
  }

  score = Math.min(100, score);
  let riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK' = 'LOW_RISK';
  if (score >= 55 || warningSigns.length >= 2) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 25 || warningSigns.length === 1) {
    riskLevel = 'CAUTION';
  }

  return {
    riskLevel,
    score,
    scamType:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'उच्च जोखिमयुक्त शंकास्पद सन्देश'
          : 'High-Risk Suspicious Message'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'सावधानी अपनाउनुपर्ने सन्देश'
          : 'Cautionary / Questionable Message'
        : isNe
          ? 'सामान्य सन्देश (कुनै स्पष्ट ठगी संकेत देखिएन)'
          : 'Standard Message (No obvious scam patterns)',
    summary:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'यस सन्देशमा ठगीसँग मिल्दाजुल्दा बलिया संकेतहरू भेटिएका छन्। यसलाई विश्वास नगर्नुहोस्, लिंक नखोल्नुहोस् र पैसा नपठाउनुहोस्।'
          : 'Multiple distinct fraud indicators detected. Avoid clicking links, sharing codes, or sending any money.'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'केही शंकास्पद ढाँचाहरू देखिएका छन्। व्यक्तिगत वा आर्थिक विवरण दिनुअघि आधिकारिक माध्यमबाट पुष्टि गर्नुहोस्।'
          : 'Some warning patterns found. Verify with official channels before responding.'
        : isNe
          ? 'हाम्रो स्वचालित ढाँचा जाँचमा स्पष्ट ठगीका संकेत फेला परेनन्। तर अपरिचित व्यक्तिसँग सधैँ सतर्क रहनुहोस्।'
          : 'No recognized fraud patterns found in text screening. Stay vigilant with unsolicited messages.',
    warningSigns:
      warningSigns.length > 0
        ? warningSigns
        : [
            isNe
              ? 'साधारण नियम परीक्षणमा कुनै ठगी ढाँचा फेला परेन।'
              : 'No obvious red flag patterns detected in primary screening.',
          ],
    psychologicalTricks: tricks,
    actionSteps: [
      isNe
        ? 'सन्देशमा आएको कुनै पनि लिंक नखोल्नुहोस्।'
        : 'Do not click on links or download attachments.',
      isNe
        ? 'OTP, बैंक पिन वा पासवर्ड कसैसँग साझा नगर्नुहोस्।'
        : 'Never disclose OTPs, banking PINs, or passwords.',
      isNe
        ? 'यदि बैंक वा परिचित संस्थाको नाम उल्लेख छ भने आधिकारिक फोन नम्बरमा फोन गरेर बुझ्नुहोस्।'
        : 'Verify claims directly with the official company or institution hotline.',
      isNe
        ? 'शंकास्पद नम्बरलाई तत्काल Block र Spam Report गर्नुहोस्।'
        : 'Block the sender and report as spam/fraud.',
    ],
    disclaimer: isNe
      ? 'यो नतिजा स्वचालित विश्लेषणमा आधारित मार्गदर्शन मात्र हो। १००% ग्यारेन्टी हुँदैन। वित्तीय निर्णय गर्नुअघि आधिकारिक निकायसँग पुष्टि गर्नुहोस्।'
      : 'This assessment is automated guidance and not an absolute legal verdict. Always verify directly with official authorities.',
    source: 'local-heuristics-engine',
    detailedAnalysis: extractDetailedAnalysisForMessage(
      text,
      riskLevel,
      score,
      warningSigns,
      tricks
    ),
  };
}

export function analyzeLinkClient(rawUrl: string, lang: 'ne' | 'en'): LinkAnalysisResult {
  const isNe = lang === 'ne';
  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = 'https://' + formatted;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(formatted);
  } catch {
    return {
      riskLevel: 'CAUTION',
      score: 50,
      protocol: 'unknown',
      hostname: rawUrl,
      summary: isNe ? 'अमान्य वा बिग्रिएको URL ठेगाना' : 'Invalid or malformed URL format',
      findings: [
        isNe
          ? 'वेबसाइटको ठेगानामा हिज्जे वा ढाँचाको त्रुटि छ।'
          : 'The URL structure does not conform to valid web address standards.',
      ],
      recommendations: [
        isNe ? 'लिंक पुन: जाँच गर्नुहोस्।' : 'Verify the link syntax carefully.',
      ],
      source: 'local-heuristics-engine',
    };
  }

  const host = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol;
  const pathname = parsedUrl.pathname.toLowerCase();
  const findings: string[] = [];
  const recommendations: string[] = [];
  let score = 15;

  if (protocol === 'http:') {
    findings.push(
      isNe
        ? 'यो वेबसाइट HTTP मा छ (असुरक्षित, यसमा डाटा इन्क्रिप्ट हुँदैन)।'
        : 'Unencrypted HTTP protocol (data can be intercepted over the network).'
    );
    score += 20;
  }

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    findings.push(
      isNe
        ? 'लिंकमा डोमेनको सट्टा सिधै IP ठेगाना प्रयोग गरिएको छ (फिसिङको प्रमुख संकेत)।'
        : 'Direct IP address hostname detected (common phishing and malware technique).'
    );
    score += 40;
  }

  if (host.startsWith('xn--') || host.includes('.xn--')) {
    findings.push(
      isNe
        ? 'Punycode / अन्तर्राष्ट्रिय क्यारेक्टर प्रयोग भएको छ (नक्कली नामलाई वास्तविक देखाउन प्रयोग गरिन्छ)।'
        : 'Punycode / IDN spoofing detected (used to simulate genuine brand domains).'
    );
    score += 35;
  }

  const suspiciousKeywords = [
    'login',
    'verify',
    'wallet',
    'esewa',
    'khalti',
    'nabil',
    'nicasiabank',
    'nepalpolice',
    'claim-bonus',
    'free-gift',
    'reward',
    'kyc-update',
    'password-reset',
  ];
  const matched = suspiciousKeywords.filter((kw) => host.includes(kw) || pathname.includes(kw));
  if (matched.length > 0) {
    findings.push(
      isNe
        ? `लिंकमा फिसिङमा धेरै प्रयोग हुने शब्दहरू भेटिए: ${matched.join(', ')}`
        : `Common phishing keywords present in URL: ${matched.join(', ')}`
    );
    score += 25;
  }

  if (host.split('.').length >= 4) {
    findings.push(
      isNe
        ? 'धेरै सब-डोमेनहरू प्रयोग भएका छन्, जसले वास्तविक डोमेन लुकाउन सक्छ।'
        : 'Excessive subdomain depth found, often disguising the destination domain.'
    );
    score += 20;
  }

  const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.buzz', '.monster'];
  if (suspiciousTlds.some((tld) => host.endsWith(tld))) {
    findings.push(
      isNe
        ? 'यो डोमेन सामान्यतया स्प्याम र ठगी वेबसाइटमा देखिने एक्सटेन्सनमा दर्ता छ।'
        : 'Domain extension frequently associated with disposable malicious campaigns.'
    );
    score += 20;
  }

  score = Math.min(100, score);
  let riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK' = 'LOW_RISK';
  if (score >= 55 || findings.length >= 2) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 25 || findings.length === 1) {
    riskLevel = 'CAUTION';
  }

  recommendations.push(
    isNe
      ? 'कुनै पनि अपरिचित वेबसाइटमा आफ्नो बैंक विवरण, पासवर्ड वा OTP कहिल्यै नदिनुहोस्।'
      : 'Never enter banking credentials, passwords, or OTPs on this page.'
  );
  recommendations.push(
    isNe
      ? 'वेबसाइटको डोमेन नाम आधिकारिक संस्थाको वेबसाइटसँग अक्षरश: रुजु गर्नुहोस्।'
      : 'Verify the domain name spelling letter-by-letter with the authentic organization.'
  );

  return {
    riskLevel,
    score,
    protocol,
    hostname: host,
    summary:
      riskLevel === 'HIGH_RISK'
        ? isNe
          ? 'यो लिंक शंकास्पद र उच्च जोखिमयुक्त देखिन्छ। यसलाई खोल्दा पासवर्ड चोरी वा मालवेयरको खतरा हुन सक्छ।'
          : 'High risk of phishing or deceptive impersonation. Do not visit this site.'
        : riskLevel === 'CAUTION'
        ? isNe
          ? 'केही शंकास्पद संकेत भेटिएका छन्। आधिकारिक स्रोतबाट पुष्टि नगरी नखोल्नुहोस्।'
          : 'Suspicious elements detected. Proceed with extreme caution.'
        : isNe
          ? 'हाम्रो स्वचालित ढाँचा जाँचमा स्पष्ट खतरा भेटिएन (तर सुरक्षित भएको पूर्ण ग्यारेन्टी छैन)।'
          : 'No overt threat patterns found in structural heuristics. Always maintain vigilance.',
    findings:
      findings.length > 0
        ? findings
        : [
            isNe
              ? 'URL को ढाँचामा कुनै पनि सामान्य फिसिङ संकेत भेटिएन।'
              : 'Standard malicious URL patterns were not triggered.',
          ],
    recommendations,
    source: 'local-heuristics-engine',
    detailedAnalysis: extractDetailedAnalysisForLink(
      rawUrl,
      riskLevel,
      score,
      protocol,
      host,
      findings
    ),
  };
}
