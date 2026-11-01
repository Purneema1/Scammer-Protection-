import { BANNERS, TOOL_PHOTOS } from '../constants/toolImages';

export interface AppMediaSettings {
  banners: {
    hero: string;
    rescue: string;
    complaint: string;
    stats: string;
  };
  tools: Record<string, string>;
}

export interface ScamVideoItem {
  id: string;
  titleNe: string;
  titleEn: string;
  descNe: string;
  descEn: string;
  youtubeId: string; // YouTube video ID or full embed URL
  category: 'wallet' | 'shopping' | 'telegram' | 'police' | 'ai';
  duration: string;
  thumbnail: string;
  relatedTool?: string;
}

const STORAGE_MEDIA_KEY = 'scam_app_media_settings_v1';
const STORAGE_VIDEOS_KEY = 'scam_app_videos_v1';

// Default initial video library curated for Nepali cyber awareness
export const DEFAULT_VIDEOS: ScamVideoItem[] = [
  {
    id: 'vid-1',
    titleNe: 'eSewa, Khalti र मोबाइल बैंकिङ OTP ठगीबाट जोगिने आधिकारिक उपाय',
    titleEn: 'Preventing eSewa, Khalti & Mobile Banking OTP Fraud',
    descNe: 'नक्कली बैंक प्रतिनिधि बनेर OTP माग्ने र खाता खाली गर्ने तरिका तथा त्यसबाट जोगिने नियमहरू।',
    descEn: 'How scammers impersonate bank officers to extract OTPs and drain digital wallets.',
    youtubeId: 'bB_UfRCOi-4', // Real informative cybersecurity clip
    category: 'wallet',
    duration: '०४:१२',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'message',
  },
  {
    id: 'vid-2',
    titleNe: 'फेसबुक, टिकटक र इन्स्टाका नक्कली सपिङ पेज चिन्ने तरिका',
    titleEn: 'Spotting Fake Shopping Pages on Facebook & TikTok',
    descNe: 'अत्यधिक छुटको लोभ देखाएर डेलिभरी शुल्क अग्रिम माग्ने गिरोहबाट कसरी जोगिने?',
    descEn: 'Avoid upfront payment traps on Instagram, TikTok & Facebook fake storefronts.',
    youtubeId: 'W1k20h6C5gU',
    category: 'shopping',
    duration: '०५:३०',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'shopping',
  },
  {
    id: 'vid-3',
    titleNe: 'टेलिग्राम पार्ट-टाइम जब, युट्युब लाइक र टास्क ठगीको भित्री रहस्य',
    titleEn: 'Telegram Part-Time Job & Task Scam Exposed',
    descNe: 'घरमै बसेर दिनको ५००० कमाउने प्रलोभन देखाएर लाखौँ असुल्ने टेलिग्राम नेटवर्कको विश्लेषण।',
    descEn: 'Exposing daily return tasks, fake cryptocurrency investments, and Telegram groups.',
    youtubeId: 'xPjF2qHhC_Y',
    category: 'telegram',
    duration: '०६:४५',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'link',
  },
  {
    id: 'vid-4',
    titleNe: 'नेपाल प्रहरी साइबर ब्युरोमा उजुरी दिने र प्रमाण संकलन गर्ने तरिका',
    titleEn: 'How to File a Cybercrime Report to Nepal Police',
    descNe: 'भोटाहिटी साइबर ब्युरो वा अनलाइन उजुरी गर्दा पेश गर्नुपर्ने प्रमाण, बैंक स्टेटमेन्ट र निवेदन ढाँचा।',
    descEn: 'Essential evidence checklist, transaction IDs, and formal complaint procedure.',
    youtubeId: 'U2u5m3WqB50',
    category: 'police',
    duration: '०३:५०',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'complaint',
  },
  {
    id: 'vid-5',
    titleNe: 'AI भ्वाइस क्लोनिङ र भिडिओ कलमा नक्कली साथी बनेर गरिने ठगी',
    titleEn: 'Defending Against AI Voice Cloning & Deepfake Scams',
    descNe: 'आफन्तको आवाज दुरुस्तै बनाएर आपत परेको भन्दै पैसा माग्ने नयाँ एआई अपराधबाट कसरी सुरक्षित रहने?',
    descEn: 'Real-time vocal cloning fraud and secret emergency safe-word techniques.',
    youtubeId: 'h7n1UoVjK1E',
    category: 'ai',
    duration: '०५:१५',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'voice',
  },
];

export function getDefaultMediaSettings(): AppMediaSettings {
  const defaultTools: Record<string, string> = {};
  Object.keys(TOOL_PHOTOS).forEach((key) => {
    defaultTools[key] = TOOL_PHOTOS[key].image;
  });

  return {
    banners: {
      hero: BANNERS.hero,
      rescue: BANNERS.rescue,
      complaint: BANNERS.complaint,
      stats: BANNERS.stats,
    },
    tools: defaultTools,
  };
}

export function getAppMediaSettings(): AppMediaSettings {
  try {
    const raw = localStorage.getItem(STORAGE_MEDIA_KEY);
    if (!raw) return getDefaultMediaSettings();
    const parsed = JSON.parse(raw);
    const defaults = getDefaultMediaSettings();
    return {
      banners: { ...defaults.banners, ...(parsed.banners || {}) },
      tools: { ...defaults.tools, ...(parsed.tools || {}) },
    };
  } catch (err) {
    console.error('Failed to load media settings', err);
    return getDefaultMediaSettings();
  }
}

export function saveAppMediaSettings(settings: AppMediaSettings): void {
  try {
    localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('app_media_changed'));
  } catch (err) {
    console.error('Failed to save media settings', err);
  }
}

export function resetAppMediaSettings(): AppMediaSettings {
  const defaults = getDefaultMediaSettings();
  saveAppMediaSettings(defaults);
  return defaults;
}

export function getAppVideos(): ScamVideoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_VIDEOS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(DEFAULT_VIDEOS));
      return DEFAULT_VIDEOS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load videos', err);
    return DEFAULT_VIDEOS;
  }
}

export function saveAppVideos(videos: ScamVideoItem[]): void {
  try {
    localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(videos));
    window.dispatchEvent(new Event('app_videos_changed'));
  } catch (err) {
    console.error('Failed to save videos', err);
  }
}

export function addOrUpdateVideo(video: ScamVideoItem): ScamVideoItem[] {
  const current = getAppVideos();
  const index = current.findIndex((v) => v.id === video.id);
  let updated: ScamVideoItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = video;
  } else {
    updated = [video, ...current];
  }
  saveAppVideos(updated);
  return updated;
}

export function deleteVideo(id: string): ScamVideoItem[] {
  const current = getAppVideos();
  const updated = current.filter((v) => v.id !== id);
  saveAppVideos(updated);
  return updated;
}

export function resetAppVideos(): ScamVideoItem[] {
  saveAppVideos(DEFAULT_VIDEOS);
  return DEFAULT_VIDEOS;
}
