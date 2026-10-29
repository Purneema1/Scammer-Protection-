export interface PrivacyDetectionResult {
  hasSensitiveData: boolean;
  detectedTypes: string[];
  sanitizedText: string;
}

export function detectAndSanitizeText(rawText: string, lang: 'ne' | 'en'): PrivacyDetectionResult {
  const isNe = lang === 'ne';
  const detectedTypes: string[] = [];
  let sanitized = rawText;

  // 1. Credit / Debit card numbers (13 to 19 digits with or without spaces/dashes)
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{15,16}\b/g;
  if (cardRegex.test(sanitized)) {
    detectedTypes.push(isNe ? 'बैंक कार्ड नम्बर (Bank Card)' : 'Bank Card Number');
    sanitized = sanitized.replace(cardRegex, '[CARD-NUMBER-REDACTED]');
  }

  // 2. Nepali / International phone numbers
  const phoneRegex = /(?:\+?977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{7}|\b\d{10}\b)/g;
  if (phoneRegex.test(sanitized)) {
    detectedTypes.push(isNe ? 'फोन नम्बर (Phone Number)' : 'Phone Number');
    sanitized = sanitized.replace(phoneRegex, '[PHONE-NUMBER-REDACTED]');
  }

  // 3. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  if (emailRegex.test(sanitized)) {
    detectedTypes.push(isNe ? 'इमेल ठेगाना (Email Address)' : 'Email Address');
    sanitized = sanitized.replace(emailRegex, '[EMAIL-REDACTED]');
  }

  // 4. Exact 4 to 8 digit OTP/PIN codes following keywords
  const otpRegex = /(?:otp|code|pin|पासवर्ड|कोड)\s*[:=is-]*\s*([0-9]{4,8})/gi;
  if (otpRegex.test(sanitized)) {
    detectedTypes.push(isNe ? 'ओटिपी वा पिन (OTP/PIN)' : 'OTP or PIN Code');
    sanitized = sanitized.replace(otpRegex, (match, p1) => match.replace(p1, '[OTP-REDACTED]'));
  }

  return {
    hasSensitiveData: detectedTypes.length > 0,
    detectedTypes,
    sanitizedText: sanitized,
  };
}
