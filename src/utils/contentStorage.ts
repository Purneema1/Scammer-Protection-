// Persistent storage and live synchronization for editable app content

export interface AppContentSettings {
  appTitle: string;
  appSubtitle: string;
  heroHeadlineNe: string;
  heroHeadlineEn: string;
  heroSubheadlineNe: string;
  heroSubheadlineEn: string;
  helplinePhone: string;
  helplineEmail: string;
  emergencyAlertNe: string;
  emergencyAlertEn: string;
  complaintNoticeNe: string;
  complaintNoticeEn: string;
}

const STORAGE_CONTENT_KEY = 'scam_app_content_settings_v1';

export const DEFAULT_CONTENT: AppContentSettings = {
  appTitle: 'Scamly',
  appSubtitle: 'नेपाल डिजिटल ठगी रोकथाम तथा आधिकारिक सुरक्षा कवच',
  heroHeadlineNe: 'शंकास्पद अफर वा सन्देश पैसा पठाउनुअघि नै जाँच्नुहोस्',
  heroHeadlineEn: 'Verify Questionable Offers Before Transferring Money',
  heroSubheadlineNe: 'SMS, नक्कली सपिङ पेज, फिसिङ लिंक, च्याटको स्क्रिनसट वा आवाज राखेर १ सेकेन्डमै आधिकारिक सुरक्षा विश्लेषण लिनुहोस्।',
  heroSubheadlineEn: 'Scan SMS, fake store offers, phishing links, chat screenshots, or audio notes in real time before sending money.',
  helplinePhone: '०१-४२११३०४',
  helplineEmail: 'cyberbureau@nepalpolice.gov.np',
  emergencyAlertNe: 'नेपाल प्रहरी साइबर ब्युरो आधिकारिक आपतकालीन हटलाइन: ०१-४२११३०४ | आपतकालीन: १००',
  emergencyAlertEn: 'Nepal Police Cyber Bureau Official Emergency Hotline: 01-4211304 | Emergency: 100',
  complaintNoticeNe: 'नेपाल प्रहरी साइबर ब्युरो, भोटाहिटी/काठमाडौँमा उजुरी दिन आवश्यक औपचारिक निवेदन मस्यौदा।',
  complaintNoticeEn: 'Official legal petition draft ready to submit at Nepal Police Cyber Bureau, Bhotahity, Kathmandu.',
};

export function getAppContentSettings(): AppContentSettings {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem(STORAGE_CONTENT_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveAppContentSettings(content: AppContentSettings): void {
  try {
    localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('app_content_changed'));
  } catch (err) {
    console.error('Failed to save app content settings:', err);
  }
}

export function resetAppContentSettings(): AppContentSettings {
  try {
    localStorage.removeItem(STORAGE_CONTENT_KEY);
    window.dispatchEvent(new CustomEvent('app_content_changed'));
  } catch (err) {
    console.error('Failed to reset app content settings:', err);
  }
  return DEFAULT_CONTENT;
}
