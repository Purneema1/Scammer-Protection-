import { AppThemeSettings, applyThemeToDOM, THEME_SETTINGS_KEY } from './themeStorage';
import { AppContentSettings, STORAGE_CONTENT_KEY } from './contentStorage';
import { AppMediaSettings, ScamVideoItem, STORAGE_MEDIA_KEY, STORAGE_VIDEOS_KEY } from './mediaStorage';

export interface AppServerSettingsPayload {
  content?: AppContentSettings;
  media?: AppMediaSettings;
  videos?: ScamVideoItem[];
  theme?: AppThemeSettings;
}

// Push local changes made by Admin to server for global synchronization
export async function pushSettingsToServer(payload: AppServerSettingsPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn('Failed to persist global settings to server');
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Network error pushing settings to server:', err);
    return false;
  }
}

// Fetch authoritative server settings and synchronize with local application state
export async function fetchAndApplyGlobalSettings(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;

    const data = await res.json();
    if (!data?.success || !data?.settings) return;

    const { theme, content, media, videos } = data.settings;

    // 1. Sync Theme
    if (theme && typeof theme === 'object') {
      try {
        localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(theme));
        applyThemeToDOM(theme);
        window.dispatchEvent(new CustomEvent('app_theme_changed', { detail: theme }));
      } catch (e) {
        console.error('Error applying synced theme:', e);
      }
    }

    // 2. Sync Content
    if (content && typeof content === 'object') {
      try {
        localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(content));
        window.dispatchEvent(new CustomEvent('app_content_changed', { detail: content }));
      } catch (e) {
        console.error('Error applying synced content:', e);
      }
    }

    // 3. Sync Media
    if (media && typeof media === 'object') {
      try {
        localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(media));
        window.dispatchEvent(new CustomEvent('app_media_changed', { detail: media }));
      } catch (e) {
        console.error('Error applying synced media:', e);
      }
    }

    // 4. Sync Videos
    if (videos && Array.isArray(videos)) {
      try {
        localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(videos));
        window.dispatchEvent(new CustomEvent('app_videos_changed', { detail: videos }));
      } catch (e) {
        console.error('Error applying synced videos:', e);
      }
    }
  } catch (err) {
    // Silent catch on offline/network hiccup
  }
}
