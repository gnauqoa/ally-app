import { AuthStateStorage, StoredUser } from "@/@types/auth";

const AUTH_KEY = "auth_state";

const emptyAuthState: AuthStateStorage = {
  user: null,
  token: null,
  isAuthenticated: false,
  refreshToken: null,
};

/**
 * Save both user and token to localStorage
 */
export const saveAuthState = (
  user: StoredUser,
  token: string,
  refreshToken: string
): void => {
  const authState: AuthStateStorage = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    refreshToken,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
};

/**
 * Get full auth state (user + token + isAuthenticated)
 */
export const getAuthState = (): AuthStateStorage => {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) {
    return emptyAuthState;
  }

  try {
    const parsed = JSON.parse(data);
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      isAuthenticated: !!(parsed.user && parsed.token),
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return emptyAuthState;
  }
};

/**
 * Get only token
 */
export const getToken = (): string | null => getAuthState().token;

/**
 * Set / update token only
 */
export const setToken = (token: string): void => {
  const state = getAuthState();
  const updated: AuthStateStorage = {
    ...state,
    token,
    isAuthenticated: !!(state.user && token),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
};

/**
 * Get only refresh token
 */
export const getRefreshToken = (): string | null => getAuthState().refreshToken;

/**
 * Set / update refresh token only
 */
export const setRefreshToken = (refreshToken: string): void => {
  const state = getAuthState();
  const updated: AuthStateStorage = {
    ...state,
    refreshToken,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
};

/**
 * Get only user
 */
export const getUser = (): StoredUser | null => getAuthState().user;

/**
 * Update user only
 */
export const setUser = (user: StoredUser): void => {
  const state = getAuthState();
  const updated: AuthStateStorage = {
    ...state,
    user,
    isAuthenticated: !!(user && state.token),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
};

/**
 * Clear storage (logout)
 */
export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Check authentication
 */
export const isAuthenticated = (): boolean => {
  const state = getAuthState();
  return !!state.token && !!state.user;
};
