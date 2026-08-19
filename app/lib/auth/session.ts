/**
 * 클라이언트 인증 세션 유틸리티.
 * 토큰은 localStorage에만 있으므로(SSR 불가) 모든 검사는 브라우저에서만 의미가 있다.
 * 라우트 가드(clientMiddleware)에서 사용한다.
 */
import {
  authApi,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "~/lib/api";

/** 만료 60초 이내면 만료로 간주(시계 오차·네트워크 여유). */
const EXPIRY_SKEW_SEC = 60;

/** JWT payload의 exp(초)를 디코드한다. 디코드 실패 시 null. */
function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

/** exp 기준 만료 여부. exp가 없는 토큰은 만료 판단을 보류한다(서버 401 처리에 위임). */
function isExpired(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (exp === null) return false;
  return exp - EXPIRY_SKEW_SEC <= Date.now() / 1000;
}

/**
 * 만료되지 않은 accessToken을 보유했는지(동기).
 * 인증 페이지(로그인/회원가입) 차단 판단에 사용한다.
 */
export function hasActiveSession(): boolean {
  const accessToken = getAccessToken();
  return accessToken !== null && !isExpired(accessToken);
}

/**
 * 인증 상태를 보장한다(비동기).
 * - 유효한 accessToken 보유 → true
 * - accessToken 만료/부재 + refreshToken 보유 → 재발급 시도
 * - 재발급 실패 또는 refreshToken 부재 → 토큰 정리 후 false
 *
 * 보호 라우트 가드에서 사용한다.
 */
export async function ensureAuthenticated(): Promise<boolean> {
  const accessToken = getAccessToken();
  if (accessToken && !isExpired(accessToken)) return true;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  try {
    await authApi.refresh({ refreshToken });
    return true;
  } catch {
    clearTokens();
    return false;
  }
}
