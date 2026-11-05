export type ThemeId =
  | 'ujalo-himalayan' // 1. उज्यालो हिमाल (Himalayan Crystal Pearl - Light)
  | 'ujalo-emerald' // 2. उज्यालो पन्ना (Imperial Emerald Mint - Light)
  | 'ujalo-amber' // 3. सुनौलो बिहानी (Royal Amber Gold - Light)
  | 'ujalo-sapphire' // 4. नीलम उज्यालो (Sapphire Daylight Tech - Light)
  | 'ujalo-rose' // 5. गुलाबी प्रभात (Rose Quartz Elegance - Light)
  | 'ujalo-arctic' // 6. आर्कटिक फ्रस्ट (Arctic Ice Glass - Light)
  | 'ujalo-slate' // 7. आधुनिक टाइटेनियम (Nordic Titanium Slate - Light)
  | 'cyber-midnight' // 8. क्लासिक साइबर नाइट (Obsidian Cyber Midnight - Dark)
  | 'dark-sapphire' // 9. रोयल नीलम डार्क (Royal Sapphire Night - Dark)
  | 'dark-emerald' // 10. गहिरो पन्ना नाइट (Deep Emerald Stealth - Dark)
  | 'ujalo-lavender' // backward compat
  | 'ujalo-crimson'; // backward compat

export type FontFamilyId =
  | 'mukta-jakarta' // Modern Cyber Sans
  | 'inter' // Tech Crisp Inter
  | 'outfit' // Bold Modern Geometric Outfit
  | 'poppins' // Friendly Rounded Poppins
  | 'merriweather'; // Formal Editorial Serif

export interface ThemePreset {
  id: ThemeId;
  nameNe: string;
  nameEn: string;
  taglineNe: string;
  taglineEn: string;
  mode: 'light' | 'dark';
  badgeColor: string;
  previewColors: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
    border: string;
  };
  cssVars: {
    '--app-bg': string;
    '--app-card-bg': string;
    '--app-card-subtle': string;
    '--app-header-bg': string;
    '--app-border': string;
    '--app-border-highlight': string;
    '--app-text-main': string;
    '--app-text-muted': string;
    '--app-text-subtle': string;
    '--app-accent-primary': string;
    '--app-accent-hover': string;
    '--app-shadow': string;
  };
}

export interface FontOption {
  id: FontFamilyId;
  nameNe: string;
  nameEn: string;
  fontFamily: string;
  sampleNe: string;
  sampleEn: string;
}

export type BackgroundVariantId = 'default' | 'soft-tinted' | 'pure-clean' | 'high-contrast';

export interface BackgroundVariantOption {
  id: BackgroundVariantId;
  nameNe: string;
  nameEn: string;
  descriptionNe: string;
  descriptionEn: string;
}

export const BACKGROUND_VARIANTS: BackgroundVariantOption[] = [
  {
    id: 'default',
    nameNe: 'थिम पूर्वनिर्धारित (Preset Balanced)',
    nameEn: 'Preset Default Balanced',
    descriptionNe: 'थिमको प्राकृतिक सन्तुलित रङ संयोजन',
    descriptionEn: 'The original balanced palette designed for this theme',
  },
  {
    id: 'soft-tinted',
    nameNe: 'सफ्ट टिन्टेड (Soft Tinted Ambient)',
    nameEn: 'Soft Tinted Ambient',
    descriptionNe: 'हल्का शान्त र आँखालाई आराम दिने टिन्टेड पृष्ठभूमि',
    descriptionEn: 'Gentle atmospheric tint matching the theme primary hue',
  },
  {
    id: 'pure-clean',
    nameNe: 'एकदम सफा क्यानभास (Pure Clean Minimal)',
    nameEn: 'Pure Clean Minimalist',
    descriptionNe: 'उज्यालोमा पूर्ण सेतो वा डार्कमा शुद्ध गहिरो जेट कालो',
    descriptionEn: 'Pure solid canvas (crystal white for light, obsidian jet for dark)',
  },
  {
    id: 'high-contrast',
    nameNe: 'उच्च कन्ट्रास्ट (High Contrast Pro)',
    nameEn: 'High Contrast Pro',
    descriptionNe: 'घाममा वा कमजोर आँखाका लागि स्पष्ट किनारा र गहिरो अक्षर',
    descriptionEn: 'Crisp defined borders and maximum readability in all lighting',
  },
];

export interface AppThemeSettings {
  activeThemeId: ThemeId;
  activeFontId: FontFamilyId;
  customPrimaryColor?: string;
  backgroundVariant: BackgroundVariantId;
  cardRoundness: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  brightnessBoost: boolean;
}

// ----------------------------------------------------
// 10 RICH DISTINCT PREMIUM THEMES
// Strict contrast: Light bg -> Dark letters (#090d16 / #022c22 / #261502)
//                  Dark bg -> White letters (#ffffff / #f8fafc)
// ----------------------------------------------------
export const THEME_PRESETS: ThemePreset[] = [
  // 1. UJALO HIMALAYAN (LIGHT) - Crystal Pearl & Royal Sapphire
  {
    id: 'ujalo-himalayan',
    nameNe: 'उज्यालो हिमाल (क्रिस्टल पर्ल)',
    nameEn: 'Himalayan Crystal Pearl',
    taglineNe: 'सफा हिउँ जस्तै सेतो क्यानभास, प्रष्ट गाढा कालो अक्षर र रोयल निलो साइबर सुरक्षा',
    taglineEn: 'Pure snow-white crystal canvas with deep obsidian letters and royal sapphire shield',
    mode: 'light',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    previewColors: {
      bg: '#f8fafc',
      card: '#ffffff',
      primary: '#0284c7',
      accent: '#0ea5e9',
      text: '#000000',
      border: '#e2e8f0',
    },
    cssVars: {
      '--app-bg': '#f8fafc',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#f1f5f9',
      '--app-header-bg': 'rgba(255, 255, 255, 0.98)',
      '--app-border': '#e2e8f0',
      '--app-border-highlight': 'rgba(2, 132, 199, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#0284c7',
      '--app-accent-hover': '#0369a1',
      '--app-shadow': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
    },
  },

  // 2. UJALO EMERALD (LIGHT) - Mint Daylight & Deep Forest Jade
  {
    id: 'ujalo-emerald',
    nameNe: 'उज्यालो पन्ना (इम्पेरियल मिन्ट)',
    nameEn: 'Imperial Emerald Mint',
    taglineNe: 'ताजा मिन्ट क्यानभास, प्रष्ट गाढा कालो अक्षर र भरपर्दो पन्ना नागरिक सुरक्षा',
    taglineEn: 'Fresh daylight mint canvas with deep black letters and vivid emerald accents',
    mode: 'light',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    previewColors: {
      bg: '#f0fdf4',
      card: '#ffffff',
      primary: '#059669',
      accent: '#10b981',
      text: '#000000',
      border: '#bbf7d0',
    },
    cssVars: {
      '--app-bg': '#f0fdf4',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#dcfce7',
      '--app-header-bg': 'rgba(240, 253, 244, 0.98)',
      '--app-border': '#bbf7d0',
      '--app-border-highlight': 'rgba(5, 150, 105, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#059669',
      '--app-accent-hover': '#047857',
      '--app-shadow': '0 4px 20px -2px rgba(2, 44, 34, 0.08)',
    },
  },

  // 3. UJALO AMBER (LIGHT) - Royal Champagne & 24K Gold
  {
    id: 'ujalo-amber',
    nameNe: 'सुनौलो बिहानी (च्याम्पेन गोल्ड)',
    nameEn: 'Royal Champagne & Gold',
    taglineNe: 'न्यानो च्याम्पेन क्यानभास, प्रष्ट गाढा कालो अक्षर र शाही २४ क्यारेट सुनौलो चमक',
    taglineEn: 'Warm champagne alabaster with deep black text and 24K gold cyber shield',
    mode: 'light',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    previewColors: {
      bg: '#fffbeb',
      card: '#ffffff',
      primary: '#d97706',
      accent: '#f59e0b',
      text: '#000000',
      border: '#fde68a',
    },
    cssVars: {
      '--app-bg': '#fffbeb',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#fef3c7',
      '--app-header-bg': 'rgba(255, 251, 235, 0.98)',
      '--app-border': '#fde68a',
      '--app-border-highlight': 'rgba(217, 119, 6, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#d97706',
      '--app-accent-hover': '#b45309',
      '--app-shadow': '0 4px 20px -2px rgba(38, 21, 2, 0.08)',
    },
  },

  // 4. UJALO SAPPHIRE (LIGHT) - Modern Ice Blue & Cobalt Daylight
  {
    id: 'ujalo-sapphire',
    nameNe: 'नीलम उज्यालो (इम्पेरियल कोबाल्ट)',
    nameEn: 'Sapphire Modern Daylight',
    taglineNe: 'शाही नीलो र स्वच्छ उज्यालो क्यानभास, प्रष्ट गाढा कालो अक्षर र आधुनिक कोबाल्ट',
    taglineEn: 'Royal sapphire and ice blue clean interface with deep black typography',
    mode: 'light',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    previewColors: {
      bg: '#f0f9ff',
      card: '#ffffff',
      primary: '#2563eb',
      accent: '#3b82f6',
      text: '#000000',
      border: '#bae6fd',
    },
    cssVars: {
      '--app-bg': '#f0f9ff',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#e0f2fe',
      '--app-header-bg': 'rgba(240, 249, 255, 0.98)',
      '--app-border': '#bae6fd',
      '--app-border-highlight': 'rgba(37, 99, 235, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#2563eb',
      '--app-accent-hover': '#1d4ed8',
      '--app-shadow': '0 4px 20px -2px rgba(8, 28, 59, 0.08)',
    },
  },

  // 5. UJALO ROSE (LIGHT) - Rose Quartz & Coral Ruby
  {
    id: 'ujalo-rose',
    nameNe: 'गुलाबी प्रभात (रोज क्वार्ट्ज)',
    nameEn: 'Rose Quartz & Coral Elegance',
    taglineNe: 'आधुनिक रोज क्वार्ट्ज क्यानभास, प्रष्ट गाढा कालो अक्षर र कोरल सुरक्षा',
    taglineEn: 'Refined rose quartz daylight canvas with deep black text and coral accents',
    mode: 'light',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    previewColors: {
      bg: '#fff1f2',
      card: '#ffffff',
      primary: '#e11d48',
      accent: '#fb7185',
      text: '#000000',
      border: '#fecdd3',
    },
    cssVars: {
      '--app-bg': '#fff1f2',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#ffe4e6',
      '--app-header-bg': 'rgba(255, 241, 242, 0.98)',
      '--app-border': '#fecdd3',
      '--app-border-highlight': 'rgba(225, 29, 72, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#e11d48',
      '--app-accent-hover': '#be123c',
      '--app-shadow': '0 4px 20px -2px rgba(76, 5, 25, 0.08)',
    },
  },

  // 6. UJALO ARCTIC (LIGHT) - Arctic Ice Glass & Cyan
  {
    id: 'ujalo-arctic',
    nameNe: 'आर्कटिक फ्रस्ट (आइस ग्लास)',
    nameEn: 'Arctic Cyan Ice Glass',
    taglineNe: 'अत्यन्त सफा आइस-ग्लास क्यानभास, प्रष्ट गाढा कालो अक्षर र चम्किलो सायन चमक',
    taglineEn: 'Ultra-clean ice-frost glass with deep black typography and electric cyan glow',
    mode: 'light',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    previewColors: {
      bg: '#f0fdfa',
      card: '#ffffff',
      primary: '#0891b2',
      accent: '#06b6d4',
      text: '#000000',
      border: '#99f6e4',
    },
    cssVars: {
      '--app-bg': '#f0fdfa',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#ccfbf1',
      '--app-header-bg': 'rgba(240, 253, 250, 0.98)',
      '--app-border': '#99f6e4',
      '--app-border-highlight': 'rgba(8, 145, 178, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#0891b2',
      '--app-accent-hover': '#0e7490',
      '--app-shadow': '0 4px 20px -2px rgba(4, 47, 46, 0.08)',
    },
  },

  // 7. UJALO SLATE (LIGHT) - Nordic Titanium Platinum Minimal
  {
    id: 'ujalo-slate',
    nameNe: 'आधुनिक टाइटेनियम (नर्डिक स्लेट)',
    nameEn: 'Nordic Titanium Slate',
    taglineNe: 'नर्डिक शैलीको हल्का टाइटेनियम स्लेट, शुद्ध जेट कालो अक्षर र आधुनिक लुक',
    taglineEn: 'Nordic minimalist titanium gray with pure jet-black typography and corporate slate',
    mode: 'light',
    badgeColor: 'bg-slate-200 text-slate-900 border-slate-400',
    previewColors: {
      bg: '#f1f5f9',
      card: '#ffffff',
      primary: '#334155',
      accent: '#0284c7',
      text: '#000000',
      border: '#cbd5e1',
    },
    cssVars: {
      '--app-bg': '#f1f5f9',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#e2e8f0',
      '--app-header-bg': 'rgba(241, 245, 249, 0.98)',
      '--app-border': '#cbd5e1',
      '--app-border-highlight': 'rgba(51, 65, 85, 0.5)',
      '--app-text-main': '#000000', // Pure Jet Black
      '--app-text-muted': '#000000', // Pure Jet Black
      '--app-text-subtle': '#111827',
      '--app-accent-primary': '#334155',
      '--app-accent-hover': '#1e293b',
      '--app-shadow': '0 4px 20px -2px rgba(9, 13, 22, 0.08)',
    },
  },

  // 8. CYBER MIDNIGHT (DARK) - Deep Obsidian Space Navy & Neon Cyan
  {
    id: 'cyber-midnight',
    nameNe: 'क्लासिक साइबर नाइट (अब्सिडियन डार्क)',
    nameEn: 'Obsidian Cyber Midnight',
    taglineNe: 'गहिरो अन्तरिक्ष अब्सिडियन क्यानभास, शुद्ध चम्किलो सेतो अक्षर र नियोन सायन सुरक्षा',
    taglineEn: 'Deep obsidian space navy with pure crystal-white typography and neon cyan glow',
    mode: 'dark',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
    previewColors: {
      bg: '#050811',
      card: '#0b1220',
      primary: '#06b6d4',
      accent: '#14b8a6',
      text: '#ffffff',
      border: '#1e293b',
    },
    cssVars: {
      '--app-bg': '#050811',
      '--app-card-bg': '#0b1220',
      '--app-card-subtle': '#111c33',
      '--app-header-bg': 'rgba(5, 8, 17, 0.96)',
      '--app-border': '#1e293b',
      '--app-border-highlight': 'rgba(6, 182, 212, 0.5)',
      '--app-text-main': '#ffffff', // Pure Crystal White
      '--app-text-muted': '#ffffff', // Pure Crystal White
      '--app-text-subtle': '#ffffff',
      '--app-accent-primary': '#06b6d4',
      '--app-accent-hover': '#22d3ee',
      '--app-shadow': '0 8px 32px rgba(0, 0, 0, 0.7)',
    },
  },

  // 9. DARK SAPPHIRE (DARK) - Royal Midnight Navy & Vivid Blue
  {
    id: 'dark-sapphire',
    nameNe: 'रोयल नीलम डार्क (शाही मध्यरात)',
    nameEn: 'Royal Sapphire Night',
    taglineNe: 'गहिरो शाही नीलो रात्रि क्यानभास, शुद्ध चम्किलो सेतो अक्षर र इलेक्ट्रिक निलो आभा',
    taglineEn: 'Deep imperial midnight navy with pure crystal-white typography and electric blue accents',
    mode: 'dark',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-700',
    previewColors: {
      bg: '#060d1f',
      card: '#0b1530',
      primary: '#3b82f6',
      accent: '#60a5fa',
      text: '#ffffff',
      border: '#1e305e',
    },
    cssVars: {
      '--app-bg': '#060d1f',
      '--app-card-bg': '#0b1530',
      '--app-card-subtle': '#12224d',
      '--app-header-bg': 'rgba(6, 13, 31, 0.96)',
      '--app-border': '#1e305e',
      '--app-border-highlight': 'rgba(59, 130, 246, 0.5)',
      '--app-text-main': '#ffffff', // Pure Crystal White
      '--app-text-muted': '#ffffff', // Pure Crystal White
      '--app-text-subtle': '#ffffff',
      '--app-accent-primary': '#3b82f6',
      '--app-accent-hover': '#60a5fa',
      '--app-shadow': '0 8px 32px rgba(0, 0, 0, 0.7)',
    },
  },

  // 10. DARK EMERALD (DARK) - Deep Jade Stealth & Neon Emerald
  {
    id: 'dark-emerald',
    nameNe: 'गहिरो पन्ना नाइट (जेड स्टेल्थ)',
    nameEn: 'Deep Emerald Stealth',
    taglineNe: 'गहिरो जेड-कालो स्टेल्थ क्यानभास, शुद्ध चम्किलो सेतो अक्षर र इलेक्ट्रिक पन्ना चमक',
    taglineEn: 'Stealth deep jade onyx canvas with pure crystal-white typography and electric emerald glow',
    mode: 'dark',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    previewColors: {
      bg: '#02140e',
      card: '#062118',
      primary: '#10b981',
      accent: '#34d399',
      text: '#ffffff',
      border: '#0d3a2b',
    },
    cssVars: {
      '--app-bg': '#02140e',
      '--app-card-bg': '#062118',
      '--app-card-subtle': '#0a3326',
      '--app-header-bg': 'rgba(2, 20, 14, 0.96)',
      '--app-border': '#0d3a2b',
      '--app-border-highlight': 'rgba(16, 185, 129, 0.5)',
      '--app-text-main': '#ffffff', // Pure Crystal White
      '--app-text-muted': '#ffffff', // Pure Crystal White
      '--app-text-subtle': '#ffffff',
      '--app-accent-primary': '#10b981',
      '--app-accent-hover': '#34d399',
      '--app-shadow': '0 8px 32px rgba(0, 0, 0, 0.7)',
    },
  },
];

// ----------------------------------------------------
// 5 DISTINCT TYPOGRAPHY OPTIONS (FONT FAMILIES)
// ----------------------------------------------------
export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'mukta-jakarta',
    nameNe: 'मुक्ता र जकार्ता (नेपाली आधुनिक)',
    nameEn: 'Mukta & Plus Jakarta Sans',
    fontFamily: "'Mukta', 'Plus Jakarta Sans', system-ui, sans-serif",
    sampleNe: 'साइबर सुरक्षा हाम्रो साझा कर्तव्य हो।',
    sampleEn: 'Modern, balanced and crystal legible across all devices.',
  },
  {
    id: 'inter',
    nameNe: 'इन्टर (अन्तर्राष्ट्रिय टेक स्यान्स)',
    nameEn: 'Inter Modern Tech',
    fontFamily: "'Inter', 'Mukta', system-ui, sans-serif",
    sampleNe: 'आधुनिक प्रविधि र उच्च गति सुरक्षा प्रणाली।',
    sampleEn: 'Ultra-crisp Silicon Valley tech standard typography.',
  },
  {
    id: 'outfit',
    nameNe: 'आउटफिट (बोल्ड ज्यामितीय)',
    nameEn: 'Outfit Bold Geometric',
    fontFamily: "'Outfit', 'Mukta', system-ui, sans-serif",
    sampleNe: 'सशक्त, बोल्ड र आकर्षक डिजिटल प्रस्तुतीकरण।',
    sampleEn: 'Geometric, stylish and confident display styling.',
  },
  {
    id: 'poppins',
    nameNe: 'पपिन्स (गोलो तथा सुलभ)',
    nameEn: 'Poppins Friendly Soft',
    fontFamily: "'Poppins', 'Mukta', system-ui, sans-serif",
    sampleNe: 'सबै नागरिकका लागि सरल र आँखालाई प्रिय ढाँचा।',
    sampleEn: 'Friendly, rounded and pleasant reading experience.',
  },
  {
    id: 'merriweather',
    nameNe: 'मेरिवेदर (औपचारिक क्लासिक सेरिफ)',
    nameEn: 'Merriweather Formal Serif',
    fontFamily: "'Merriweather', 'Mukta', serif",
    sampleNe: 'कानूनी, अनुसन्धान र आधिकारिक प्रतिवेदन स्वरूप।',
    sampleEn: 'Authoritative, editorial and legal grade elegance.',
  },
];

export const THEME_SETTINGS_KEY = 'scamly_theme_settings_v2';

export const DEFAULT_THEME_SETTINGS: AppThemeSettings = {
  activeThemeId: 'cyber-midnight', // High contrast cyber midnight default: crystal clear white & neon text on obsidian navy
  activeFontId: 'mukta-jakarta',
  backgroundVariant: 'default',
  cardRoundness: 'rounded-2xl',
  brightnessBoost: true,
};

// Get stored theme settings
export function getAppThemeSettings(): AppThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_THEME_SETTINGS;
  try {
    const raw = localStorage.getItem(THEME_SETTINGS_KEY);
    if (!raw) {
      // Check legacy key if exists, but fallback to cyber-midnight if contrast was broken
      const legacy = localStorage.getItem('scamly_theme_settings_v1');
      if (legacy) {
        try {
          const legacyParsed = JSON.parse(legacy);
          if (legacyParsed.activeThemeId && legacyParsed.activeThemeId !== 'ujalo-himalayan') {
            return { ...DEFAULT_THEME_SETTINGS, ...legacyParsed, backgroundVariant: legacyParsed.backgroundVariant || 'default' };
          }
        } catch {
          // fallback
        }
      }
      return DEFAULT_THEME_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_THEME_SETTINGS,
      ...parsed,
      backgroundVariant: parsed.backgroundVariant || 'default',
    };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

// Save theme settings, apply to document, and sync to server globally
export function saveAppThemeSettings(settings: AppThemeSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(settings));
    applyThemeToDOM(settings);
    window.dispatchEvent(new CustomEvent('app_theme_changed', { detail: settings }));
    // Asynchronously push to backend so change applies to ALL users globally
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: settings }),
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to save theme settings:', e);
  }
}

// Reset theme settings
export function resetAppThemeSettings(): AppThemeSettings {
  saveAppThemeSettings(DEFAULT_THEME_SETTINGS);
  return DEFAULT_THEME_SETTINGS;
}

// Apply theme CSS variables and classes to the root document
export function applyThemeToDOM(settings?: AppThemeSettings): void {
  if (typeof document === 'undefined') return;
  const current = settings || getAppThemeSettings();
  const theme =
    THEME_PRESETS.find((t) => t.id === current.activeThemeId) ||
    THEME_PRESETS.find((t) => t.id === 'cyber-midnight') ||
    THEME_PRESETS[0];
  const font = FONT_OPTIONS.find((f) => f.id === current.activeFontId) || FONT_OPTIONS[0];

  const root = document.documentElement;
  const body = document.body;

  // Set theme data attributes & classes
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-mode', theme.mode);
  root.setAttribute('data-bg-variant', current.backgroundVariant || 'default');
  body.setAttribute('data-theme-mode', theme.mode);
  body.setAttribute('data-bg-variant', current.backgroundVariant || 'default');
  body.setAttribute('data-font', font.id);

  if (theme.mode === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    body.classList.add('light');
    body.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    body.classList.add('dark');
    body.classList.remove('light');
  }

  // Clone base theme css variables
  const finalCssVars = { ...theme.cssVars };

  // Adjust variables based on Background Variant
  const bgVariant = current.backgroundVariant || 'default';
  if (theme.mode === 'light') {
    finalCssVars['--app-text-main'] = '#000000';
    finalCssVars['--app-text-muted'] = '#000000';
    finalCssVars['--app-text-subtle'] = '#0a0a0a';

    if (bgVariant === 'pure-clean') {
      finalCssVars['--app-bg'] = '#ffffff';
      finalCssVars['--app-card-bg'] = '#f8fafc';
      finalCssVars['--app-card-subtle'] = '#f1f5f9';
      finalCssVars['--app-header-bg'] = 'rgba(255, 255, 255, 0.98)';
      finalCssVars['--app-border'] = '#e2e8f0';
    } else if (bgVariant === 'high-contrast') {
      finalCssVars['--app-bg'] = '#ffffff';
      finalCssVars['--app-card-bg'] = '#ffffff';
      finalCssVars['--app-card-subtle'] = '#f8fafc';
      finalCssVars['--app-border'] = '#475569';
      finalCssVars['--app-text-main'] = '#000000';
      finalCssVars['--app-text-muted'] = '#000000';
      finalCssVars['--app-header-bg'] = '#ffffff';
    }
  } else {
    // Dark mode variants: ALL text is pure crystal white
    finalCssVars['--app-text-main'] = '#ffffff';
    finalCssVars['--app-text-muted'] = '#ffffff';
    finalCssVars['--app-text-subtle'] = '#ffffff';

    if (bgVariant === 'pure-clean') {
      finalCssVars['--app-bg'] = '#040711';
      finalCssVars['--app-card-bg'] = '#0a0f1d';
      finalCssVars['--app-card-subtle'] = '#10172a';
      finalCssVars['--app-header-bg'] = 'rgba(4, 7, 17, 0.96)';
      finalCssVars['--app-border'] = '#1e293b';
    } else if (bgVariant === 'soft-tinted') {
      finalCssVars['--app-bg'] = '#0d172c';
      finalCssVars['--app-card-bg'] = '#111f3b';
      finalCssVars['--app-card-subtle'] = '#17294d';
      finalCssVars['--app-header-bg'] = 'rgba(13, 23, 44, 0.96)';
      finalCssVars['--app-border'] = '#223964';
    } else if (bgVariant === 'high-contrast') {
      finalCssVars['--app-bg'] = '#000000';
      finalCssVars['--app-card-bg'] = '#0a0a0c';
      finalCssVars['--app-card-subtle'] = '#141419';
      finalCssVars['--app-header-bg'] = 'rgba(0, 0, 0, 0.98)';
      finalCssVars['--app-border'] = '#475569';
      finalCssVars['--app-text-main'] = '#ffffff';
      finalCssVars['--app-text-muted'] = '#ffffff';
    }
  }

  // Override primary color if customized
  if (current.customPrimaryColor) {
    finalCssVars['--app-accent-primary'] = current.customPrimaryColor;
    finalCssVars['--app-accent-hover'] = current.customPrimaryColor;
    finalCssVars['--app-border-highlight'] = `${current.customPrimaryColor}66`;
  }

  // Apply all calculated CSS Variables to root
  Object.entries(finalCssVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  // Apply body inline styles for immediate non-flashing theme rendering
  body.style.backgroundColor = finalCssVars['--app-bg'];
  body.style.color = finalCssVars['--app-text-main'];

  // Apply Font Family
  root.style.setProperty('--app-font-family', font.fontFamily);
  body.style.fontFamily = font.fontFamily;

  // Apply theme-color meta tag for mobile browser address bar chrome
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', finalCssVars['--app-bg']);
  }
}
