import { RiskLevel } from '../types';

export type CheckerType = 'message' | 'link' | 'shopping' | 'photo' | 'voice';

export interface HistoryEntry<TInput = any, TResult = any> {
  id: string;
  timestamp: number;
  preview: string;
  riskLevel: RiskLevel;
  score: number;
  scamType: string;
  inputData: TInput;
  result: TResult;
}

const STORAGE_PREFIX = 'scam_guard_recent_history_';
const MAX_HISTORY_ITEMS = 3;

function getStorageKey(type: CheckerType): string {
  return `${STORAGE_PREFIX}${type}`;
}

export function getRecentChecks<TInput = any, TResult = any>(
  type: CheckerType
): HistoryEntry<TInput, TResult>[] {
  try {
    const raw = localStorage.getItem(getStorageKey(type));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_HISTORY_ITEMS);
  } catch (err) {
    console.warn(`Failed to read local history for ${type}:`, err);
    return [];
  }
}

export function saveRecentCheck<TInput = any, TResult = any>(
  type: CheckerType,
  entry: {
    preview: string;
    riskLevel: RiskLevel;
    score: number;
    scamType: string;
    inputData: TInput;
    result: TResult;
  }
): void {
  try {
    const existing = getRecentChecks<TInput, TResult>(type);
    
    // Avoid exact duplicate preview right at index 0
    const filtered = existing.filter(
      (item) => item.preview.trim() !== entry.preview.trim()
    );

    const newEntry: HistoryEntry<TInput, TResult> = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      ...entry,
    };

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
  } catch (err) {
    console.warn(`Failed to save local history for ${type}:`, err);
  }
}

export function deleteRecentCheck(type: CheckerType, id: string): void {
  try {
    const existing = getRecentChecks(type);
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
  } catch (err) {
    console.warn(`Failed to delete local history item:`, err);
  }
}

export function clearRecentChecks(type: CheckerType): void {
  try {
    localStorage.removeItem(getStorageKey(type));
  } catch (err) {
    console.warn(`Failed to clear local history for ${type}:`, err);
  }
}

export function formatRelativeTime(timestamp: number, lang: 'ne' | 'en'): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  const isNe = lang === 'ne';

  if (diffSec < 45) {
    return isNe ? 'भर्खरै' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return isNe ? `${diffMin} मिनेट अघि` : `${diffMin}m ago`;
  }
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return isNe ? `${diffHour} घण्टा अघि` : `${diffHour}h ago`;
  }
  const diffDays = Math.floor(diffHour / 24);
  return isNe ? `${diffDays} दिन अघि` : `${diffDays}d ago`;
}
