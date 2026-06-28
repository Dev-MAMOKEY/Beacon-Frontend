import { request } from "../client";
import { clearTokens, setTokens } from "../token-store";
import type {
  LoginRequest,
  ReissueTokenRequest,
  SignupRequest,
  SignupResponse,
  TokenResponse,
} from "../types";

/** 로그인 후 토큰을 저장한다. */
export async function login(body: LoginRequest): Promise<TokenResponse> {
  const tokens = await request<TokenResponse>({
    method: "POST",
    url: "/api/v1/auth/login",
    data: body,
  });
  if (tokens.accessToken && tokens.refreshToken) {
    setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
  return tokens;
}

export function signup(body: SignupRequest): Promise<SignupResponse> {
  return request({ method: "POST", url: "/api/v1/auth/signup", data: body });
}

/** 로그아웃 — 서버 호출 후 로컬 토큰을 항상 제거한다. */
export async function logout(): Promise<void> {
  try {
    await request<void>({ method: "POST", url: "/api/v1/auth/logout" });
  } finally {
    clearTokens();
  }
}

export async function refresh(
  body: ReissueTokenRequest,
): Promise<TokenResponse> {
  const tokens = await request<TokenResponse>({
    method: "POST",
    url: "/api/v1/auth/refresh",
    data: body,
  });
  if (tokens.accessToken && tokens.refreshToken) {
    setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
  return tokens;
}
