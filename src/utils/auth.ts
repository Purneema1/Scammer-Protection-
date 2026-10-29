import { UserAccount } from '../types';

const STORAGE_KEY = 'scam_defense_current_user';

/**
 * Retrieve current logged in user from localStorage
 */
export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save or clear current user in localStorage and notify listeners
 */
export function setStoredUser(user: UserAccount | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('auth_state_changed'));
}

/**
 * Helper to get authorization and citizen user tracking headers
 */
export function getUserAuthHeaders(): Record<string, string> {
  const user = getStoredUser();
  if (!user) return {};
  return {
    'x-user-id': user.id,
    'x-user-name': user.name,
    'x-user-email': user.email,
    'x-customer-session': `${user.name} (${user.email || user.phone})`,
  };
}

/**
 * Helper to get user payload object for POST bodies
 */
export function getUserInfoPayload() {
  const user = getStoredUser();
  if (!user) return undefined;
  return {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    userRole: user.role,
  };
}
