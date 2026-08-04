import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { RsData, TokenResponse } from "./types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-store";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://43.203.209.87:8081";

/** 서버 에러 정보를 담는 예외. RsData.error 또는 HTTP 에러에서 생성된다. */
export class ApiError extends Error {
  readonly code?: string;
  readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// 서버가 응답하지 않을 때 UI가 무한 대기하지 않도록 상한을 둔다.
// 서버 DB 커넥션 타임아웃(30초)보다 짧게 잡아 사용자를 먼저 풀어준다.
const TIMEOUT_MS = 10_000;

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// 인증 필터 예외 경로: 토큰을 받기 위한 요청이라 Authorization을 붙이면 안 된다.
// 낡은 토큰이 실려 가면 서버 JWT 필터에서 불필요한 검증 실패를 유발한다.
// 로그아웃은 토큰이 필요하므로 제외 대상이 아니다.
const NO_AUTH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/signup",
  "/api/v1/auth/refresh",
];

// 요청마다 Bearer 토큰 주입(예외 경로 제외).
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? "";
  if (NO_AUTH_PATHS.some((path) => url.startsWith(path))) return config;
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** accessToken 만료 시 refreshToken으로 재발급. 동시 401은 한 번만 갱신(single-flight). */
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    // `http`가 아닌 맨 axios를 쓰는 이유: `http`의 401 인터셉터가 이 요청에서 다시 발동하면
    // 실행 중인 `refreshing` 프라미스를 스스로 await 하게 되어 데드락이 된다.
    // 이 API는 명세대로 refreshToken만 받는다(인증 필터 예외 경로).
    const res = await axios.post<RsData<TokenResponse>>(
      `${BASE_URL}/api/v1/auth/refresh`,
      { refreshToken },
      {
        timeout: TIMEOUT_MS,
        headers: { "Content-Type": "application/json" },
      },
    );
    const { accessToken, refreshToken: newRefresh } = res.data.data ?? {};
    if (!res.data.success || !accessToken || !newRefresh) return null;
    setTokens({ accessToken, refreshToken: newRefresh });
    return accessToken;
  } catch {
    return null;
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshing) {
        refreshing = refreshAccessToken().finally(() => {
          refreshing = null;
        });
      }
      const newToken = await refreshing;
      if (newToken) {
        // 재시도 시 요청 인터셉터가 갱신된 토큰을 다시 주입한다.
        return http.request(original);
      }
      clearTokens();
    }
    return Promise.reject(error);
  },
);

/**
 * RsData 봉투를 언랩하는 요청 헬퍼.
 * success=false거나 HTTP 에러면 ApiError를 throw하고, 성공 시 data를 반환한다.
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await http.request<RsData<T>>(config);
    const body = res.data;
    if (body && body.success === false) {
      throw new ApiError(
        body.error?.message ?? "요청에 실패했습니다.",
        body.error?.code,
        res.status,
      );
    }
    return body.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const ax = err as AxiosError<RsData<unknown>>;
    // 타임아웃은 axios 원문("timeout of 10000ms exceeded")이 그대로 노출되지 않게 치환한다.
    if (ax.code === "ECONNABORTED" || ax.code === "ETIMEDOUT") {
      throw new ApiError(
        "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
        ax.code,
      );
    }
    const info = ax.response?.data?.error;
    throw new ApiError(
      info?.message ?? ax.message ?? "네트워크 오류가 발생했습니다.",
      info?.code,
      ax.response?.status,
    );
  }
}
