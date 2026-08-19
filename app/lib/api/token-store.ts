/**
 * JWT 토큰 저장소. 브라우저(localStorage)에만 보관하며,
 * SSR(서버) 환경에서는 항상 null/no-op으로 동작한다.
 */
const ACCESS_KEY = "beacon.accessToken";
const REFRESH_KEY = "beacon.refreshToken";

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  return isBrowser ? window.localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken(): string | null {
  return isBrowser ? window.localStorage.getItem(REFRESH_KEY) : null;
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
