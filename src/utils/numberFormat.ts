/**
 * Utility functions for bilingual number, currency, percent, and phone formatting.
 * Ensures that when English mode is selected, numbers are ALWAYS displayed in
 * standard Western Arabic digits (0-9) with commas and proper symbols, and
 * in Devanagari numerals (०-९) only when Nepali mode is selected.
 */

const NEP_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

const NEP_TO_ENG_MAP: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

/**
 * Converts any Arabic digits in a string or number to Nepali Devanagari digits.
 */
export function toNepaliDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (d) => NEP_DIGITS[parseInt(d, 10)]);
}

/**
 * Converts any Nepali Devanagari digits in a string to standard Western Arabic digits (0-9).
 */
export function toEnglishDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[०-९]/g, (d) => NEP_TO_ENG_MAP[d] || d);
}

/**
 * Formats a number with comma groupings based on the selected language.
 * In English: "12,000", "4.7", "21,750"
 * In Nepali: "१२,०००", "४.७", "२१,७५०"
 */
export function formatNumber(
  num: number | string | null | undefined,
  lang: 'ne' | 'en'
): string {
  if (num === null || num === undefined || num === '') return '';
  const engStr = toEnglishDigits(num);
  const n = Number(engStr);

  if (!isNaN(n)) {
    const formattedEn = n.toLocaleString('en-US');
    return lang === 'ne' ? toNepaliDigits(formattedEn) : formattedEn;
  }

  return lang === 'ne' ? toNepaliDigits(engStr) : engStr;
}

/**
 * Formats a currency amount into Nepali Rupees.
 * In English: "Rs. 12,000" or "Rs. 0"
 * In Nepali: "रु. १२,०००" or "रु. ०"
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  lang: 'ne' | 'en'
): string {
  if (amount === null || amount === undefined || amount === '' || amount === 0) {
    return lang === 'ne' ? 'रु. ०' : 'Rs. 0';
  }

  const engStr = toEnglishDigits(amount);
  const n = Number(engStr);

  if (!isNaN(n)) {
    const formattedEn = n.toLocaleString('en-US');
    if (lang === 'ne') {
      return `रु. ${toNepaliDigits(formattedEn)}`;
    }
    return `Rs. ${formattedEn}`;
  }

  return lang === 'ne' ? `रु. ${toNepaliDigits(engStr)}` : `Rs. ${engStr}`;
}

/**
 * Formats a percentage value.
 * In English: "95%"
 * In Nepali: "९५%"
 */
export function formatPercent(
  percent: number | string | null | undefined,
  lang: 'ne' | 'en'
): string {
  if (percent === null || percent === undefined) return lang === 'ne' ? '०%' : '0%';
  const engStr = toEnglishDigits(percent);
  return lang === 'ne' ? `${toNepaliDigits(engStr)}%` : `${engStr}%`;
}

/**
 * Formats phone numbers or contact digits.
 * In English: "01-4211304", "9841234567"
 * In Nepali: "०१-४२११३०४", "९८४१२३४५६७"
 */
export function formatPhone(phone: string | null | undefined, lang: 'ne' | 'en'): string {
  if (!phone) return '';
  return lang === 'ne' ? toNepaliDigits(phone) : toEnglishDigits(phone);
}
