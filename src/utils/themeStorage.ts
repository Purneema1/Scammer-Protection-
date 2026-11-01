export type ThemeId =
  | 'ujalo-himalayan' // 1. उज्यालो हिमाल (Bright Himalayan Snow)
  | 'ujalo-emerald' // 2. उज्यालो पन्ना (Bright Emerald Mint)
  | 'ujalo-amber' // 3. सुनौलो बिहानी (Golden Sunrise Amber)
  | 'ujalo-sapphire' // 4. नीलम उज्यालो (Sapphire Daylight Tech)
  | 'ujalo-rose' // 5. गुलाबी किरण (Rose Quartz Daylight)
  | 'ujalo-lavender' // 6. बैजनी प्रभात (Lavender Aura Daylight)
  | 'ujalo-arctic' // 7. आर्कटिक फ्रस्ट (Arctic Ice Glass)
  | 'ujalo-crimson' // 8. नेपाल राष्ट्रिय लालिमा (Nepal Crimson Crest)
  | 'ujalo-slate' // 9. आधुनिक स्लेट (Nordic Titanium Clean)
  | 'cyber-midnight'; // 10. क्लासिक साइबर नाइट (Classic Cyber Midnight)

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

export interface AppThemeSettings {
  activeThemeId: ThemeId;
  activeFontId: FontFamilyId;
  customPrimaryColor?: string;
  cardRoundness: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  brightnessBoost: boolean;
}

// ----------------------------------------------------
// 10 RICH DISTINCT THEMES (FEATURING UJALO / BRIGHT THEMES)
// ----------------------------------------------------
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ujalo-himalayan',
    nameNe: 'उज्यालो हिमाल',
    nameEn: 'Himalayan Snow Bright',
    taglineNe: 'सफा उज्यालो हिउँ जस्तै सेतो, आकाशे नीलो साइबर सुरक्षा',
    taglineEn: 'Pure crystal bright snow with sky blue cyber accents',
    mode: 'light',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    previewColors: {
      bg: '#f8fafc',
      card: '#ffffff',
      primary: '#0284c7',
      accent: '#0ea5e9',
      text: '#0f172a',
      border: '#cbd5e1',
    },
    cssVars: {
      '--app-bg': '#f8fafc',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#f1f5f9',
      '--app-header-bg': 'rgba(255, 255, 255, 0.95)',
      '--app-border': '#e2e8f0',
      '--app-border-highlight': 'rgba(2, 132, 199, 0.4)',
      '--app-text-main': '#0f172a',
      '--app-text-muted': '#334155',
      '--app-text-subtle': '#64748b',
      '--app-accent-primary': '#0284c7',
      '--app-accent-hover': '#0369a1',
      '--app-shadow': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
    },
  },
  {
    id: 'ujalo-emerald',
    nameNe: 'उज्यालो पन्ना (मिन्ट)',
    nameEn: 'Emerald Mint Daylight',
    taglineNe: 'ताजा मिन्ट हरियो, सकारात्मक तथा भरपर्दो नागरिक सुरक्षा',
    taglineEn: 'Fresh daylight mint with vibrant trustworthy emerald tones',
    mode: 'light',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    previewColors: {
      bg: '#f0fdf4',
      card: '#ffffff',
      primary: '#059669',
      accent: '#10b981',
      text: '#064e3b',
      border: '#bbf7d0',
    },
    cssVars: {
      '--app-bg': '#f0fdf4',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#dcfce7',
      '--app-header-bg': 'rgba(240, 253, 244, 0.96)',
      '--app-border': '#bbf7d0',
      '--app-border-highlight': 'rgba(5, 150, 105, 0.4)',
      '--app-text-main': '#064e3b',
      '--app-text-muted': '#065f46',
      '--app-text-subtle': '#047857',
      '--app-accent-primary': '#059669',
      '--app-accent-hover': '#047857',
      '--app-shadow': '0 4px 20px -2px rgba(6, 78, 59, 0.08)',
    },
  },
  {
    id: 'ujalo-amber',
    nameNe: 'सुनौलो बिहानी',
    nameEn: 'Golden Sunrise Amber',
    taglineNe: 'न्यानो बिहानीको घाम, सुनौलो सुरक्षा कवच र प्रष्ट अक्षर',
    taglineEn: 'Warm daylight cream with golden amber cyber shield',
    mode: 'light',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    previewColors: {
      bg: '#fffbeb',
      card: '#ffffff',
      primary: '#d97706',
      accent: '#f59e0b',
      text: '#451a03',
      border: '#fde68a',
    },
    cssVars: {
      '--app-bg': '#fffbeb',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#fef3c7',
      '--app-header-bg': 'rgba(255, 251, 235, 0.96)',
      '--app-border': '#fde68a',
      '--app-border-highlight': 'rgba(217, 119, 6, 0.4)',
      '--app-text-main': '#451a03',
      '--app-text-muted': '#78350f',
      '--app-text-subtle': '#92400e',
      '--app-accent-primary': '#d97706',
      '--app-accent-hover': '#b45309',
      '--app-shadow': '0 4px 20px -2px rgba(69, 26, 3, 0.08)',
    },
  },
  {
    id: 'ujalo-sapphire',
    nameNe: 'नीलम उज्यालो',
    nameEn: 'Sapphire Modern Daylight',
    taglineNe: 'शाही नीलो र स्वच्छ उज्यालो इन्टरफेस, अत्याधुनिक प्रविधि',
    taglineEn: 'Royal sapphire and ice blue clean daylight interface',
    mode: 'light',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    previewColors: {
      bg: '#f0f9ff',
      card: '#ffffff',
      primary: '#2563eb',
      accent: '#3b82f6',
      text: '#1e3a8a',
      border: '#bae6fd',
    },
    cssVars: {
      '--app-bg': '#f0f9ff',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#e0f2fe',
      '--app-header-bg': 'rgba(240, 249, 255, 0.96)',
      '--app-border': '#bae6fd',
      '--app-border-highlight': 'rgba(37, 99, 235, 0.4)',
      '--app-text-main': '#1e3a8a',
      '--app-text-muted': '#1d4ed8',
      '--app-text-subtle': '#3b82f6',
      '--app-accent-primary': '#2563eb',
      '--app-accent-hover': '#1d4ed8',
      '--app-shadow': '0 4px 20px -2px rgba(30, 58, 138, 0.08)',
    },
  },
  {
    id: 'ujalo-rose',
    nameNe: 'गुलाबी प्रभात',
    nameEn: 'Rose Quartz Daylight',
    taglineNe: 'आधुनिक रोज क्वार्ट्ज र कोरल सुरक्षा, आकर्षक र आँखालाई आराम',
    taglineEn: 'Modern soft rose quartz with coral defense accents',
    mode: 'light',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    previewColors: {
      bg: '#fff1f2',
      card: '#ffffff',
      primary: '#e11d48',
      accent: '#fb7185',
      text: '#881337',
      border: '#fecdd3',
    },
    cssVars: {
      '--app-bg': '#fff1f2',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#ffe4e6',
      '--app-header-bg': 'rgba(255, 241, 242, 0.96)',
      '--app-border': '#fecdd3',
      '--app-border-highlight': 'rgba(225, 29, 72, 0.4)',
      '--app-text-main': '#881337',
      '--app-text-muted': '#9f1239',
      '--app-text-subtle': '#be123c',
      '--app-accent-primary': '#e11d48',
      '--app-accent-hover': '#be123c',
      '--app-shadow': '0 4px 20px -2px rgba(136, 19, 55, 0.08)',
    },
  },
  {
    id: 'ujalo-lavender',
    nameNe: 'बैजनी प्रभात',
    nameEn: 'Lavender Aura Daylight',
    taglineNe: 'शान्त ल्याभेन्डर आभा, प्रिमियम र स्टाइलिश साइबर रूप',
    taglineEn: 'Gentle lavender aura with clean purple cyber contrast',
    mode: 'light',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    previewColors: {
      bg: '#f5f3ff',
      card: '#ffffff',
      primary: '#7c3aed',
      accent: '#a78bfa',
      text: '#4c1d95',
      border: '#ddd6fe',
    },
    cssVars: {
      '--app-bg': '#f5f3ff',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#ede9fe',
      '--app-header-bg': 'rgba(245, 243, 255, 0.96)',
      '--app-border': '#ddd6fe',
      '--app-border-highlight': 'rgba(124, 58, 237, 0.4)',
      '--app-text-main': '#4c1d95',
      '--app-text-muted': '#5b21b6',
      '--app-text-subtle': '#6d28d9',
      '--app-accent-primary': '#7c3aed',
      '--app-accent-hover': '#6d28d9',
      '--app-shadow': '0 4px 20px -2px rgba(76, 29, 149, 0.08)',
    },
  },
  {
    id: 'ujalo-arctic',
    nameNe: 'आर्कटिक फ्रस्ट',
    nameEn: 'Arctic Frost Glass',
    taglineNe: 'अत्यन्त सफा आइस-ग्लास, हल्का सिल्भर र टील चमक',
    taglineEn: 'Ultra-clean ice-frost glass with cyan-teal shimmer',
    mode: 'light',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    previewColors: {
      bg: '#f0fdfa',
      card: '#ffffff',
      primary: '#0891b2',
      accent: '#06b6d4',
      text: '#134e4a',
      border: '#99f6e4',
    },
    cssVars: {
      '--app-bg': '#f0fdfa',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#ccfbf1',
      '--app-header-bg': 'rgba(240, 253, 250, 0.96)',
      '--app-border': '#99f6e4',
      '--app-border-highlight': 'rgba(8, 145, 178, 0.4)',
      '--app-text-main': '#134e4a',
      '--app-text-muted': '#115e59',
      '--app-text-subtle': '#0f766e',
      '--app-accent-primary': '#0891b2',
      '--app-accent-hover': '#0e7490',
      '--app-shadow': '0 4px 20px -2px rgba(19, 78, 74, 0.08)',
    },
  },
  {
    id: 'ujalo-crimson',
    nameNe: 'नेपाल राष्ट्रिय लालिमा',
    nameEn: 'Nepal National Crimson',
    taglineNe: 'रातो र चन्द्र सूर्य — नेपालको राष्ट्रिय गौरव झल्काउने लालिमा',
    taglineEn: 'Proud Nepali national crimson & deep navy security theme',
    mode: 'light',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    previewColors: {
      bg: '#fafafa',
      card: '#ffffff',
      primary: '#dc2626',
      accent: '#ef4444',
      text: '#111827',
      border: '#fca5a5',
    },
    cssVars: {
      '--app-bg': '#fafafa',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#fee2e2',
      '--app-header-bg': 'rgba(250, 250, 250, 0.96)',
      '--app-border': '#fca5a5',
      '--app-border-highlight': 'rgba(220, 38, 38, 0.4)',
      '--app-text-main': '#111827',
      '--app-text-muted': '#374151',
      '--app-text-subtle': '#4b5563',
      '--app-accent-primary': '#dc2626',
      '--app-accent-hover': '#b91c1c',
      '--app-shadow': '0 4px 20px -2px rgba(220, 38, 38, 0.08)',
    },
  },
  {
    id: 'ujalo-slate',
    nameNe: 'आधुनिक स्लेट टाइटेनियम',
    nameEn: 'Nordic Slate Clean',
    taglineNe: 'नर्डिक शैलीको हल्का स्लेट, आधुनिक प्रविधियुक्त कार्यालय लुक',
    taglineEn: 'Nordic minimalist light slate gray with crisp corporate styling',
    mode: 'light',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-400',
    previewColors: {
      bg: '#f1f5f9',
      card: '#ffffff',
      primary: '#475569',
      accent: '#0284c7',
      text: '#0f172a',
      border: '#cbd5e1',
    },
    cssVars: {
      '--app-bg': '#f1f5f9',
      '--app-card-bg': '#ffffff',
      '--app-card-subtle': '#e2e8f0',
      '--app-header-bg': 'rgba(241, 245, 249, 0.96)',
      '--app-border': '#cbd5e1',
      '--app-border-highlight': 'rgba(71, 85, 105, 0.4)',
      '--app-text-main': '#0f172a',
      '--app-text-muted': '#334155',
      '--app-text-subtle': '#64748b',
      '--app-accent-primary': '#334155',
      '--app-accent-hover': '#1e293b',
      '--app-shadow': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
    },
  },
  {
    id: 'cyber-midnight',
    nameNe: 'क्लासिक साइबर नाइट (डार्क)',
    nameEn: 'Classic Cyber Midnight',
    taglineNe: 'गहिरो अन्तरिक्ष नीलो, नियोन साइबर ग्लो र हाई-टेक सेक्युरिटी',
    taglineEn: 'Deep obsidian space navy with neon cyan & teal cyber glow',
    mode: 'dark',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    previewColors: {
      bg: '#0b1220',
      card: '#0e1628',
      primary: '#06b6d4',
      accent: '#14b8a6',
      text: '#f8fafc',
      border: '#1e293b',
    },
    cssVars: {
      '--app-bg': '#0b1220',
      '--app-card-bg': '#0e1628',
      '--app-card-subtle': '#111c33',
      '--app-header-bg': 'rgba(11, 18, 32, 0.95)',
      '--app-border': '#1e293b',
      '--app-border-highlight': 'rgba(6, 182, 212, 0.4)',
      '--app-text-main': '#f8fafc',
      '--app-text-muted': '#cbd5e1',
      '--app-text-subtle': '#94a3b8',
      '--app-accent-primary': '#06b6d4',
      '--app-accent-hover': '#22d3ee',
      '--app-shadow': '0 8px 30px rgba(0, 0, 0, 0.6)',
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

const THEME_SETTINGS_KEY = 'scamly_theme_settings_v1';

export const DEFAULT_THEME_SETTINGS: AppThemeSettings = {
  activeThemeId: 'ujalo-himalayan', // Start with beautiful bright Himalayan Snow as requested ("ujalo theme")
  activeFontId: 'mukta-jakarta',
  cardRoundness: 'rounded-2xl',
  brightnessBoost: true,
};

// Get stored theme settings
export function getAppThemeSettings(): AppThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_THEME_SETTINGS;
  try {
    const raw = localStorage.getItem(THEME_SETTINGS_KEY);
    if (!raw) return DEFAULT_THEME_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

// Save theme settings and apply to document
export function saveAppThemeSettings(settings: AppThemeSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(settings));
    applyThemeToDOM(settings);
    window.dispatchEvent(new CustomEvent('app_theme_changed', { detail: settings }));
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
  const theme = THEME_PRESETS.find((t) => t.id === current.activeThemeId) || THEME_PRESETS[0];
  const font = FONT_OPTIONS.find((f) => f.id === current.activeFontId) || FONT_OPTIONS[0];

  const root = document.documentElement;
  const body = document.body;

  // Set theme data attributes
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-mode', theme.mode);
  body.setAttribute('data-theme-mode', theme.mode);
  body.setAttribute('data-font', font.id);

  // Apply CSS Variables
  Object.entries(theme.cssVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  // Apply custom primary color override if provided
  if (current.customPrimaryColor) {
    root.style.setProperty('--app-accent-primary', current.customPrimaryColor);
  }

  // Apply Font Family
  root.style.setProperty('--app-font-family', font.fontFamily);
  body.style.fontFamily = font.fontFamily;

  // Apply theme-color meta tag for browser chrome
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.previewColors.bg);
  }
}
