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

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 요청마다 Bearer 토큰 주입.
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
    const res = await axios.post<RsData<TokenResponse>>(
      `${BASE_URL}/api/v1/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
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
    const info = ax.response?.data?.error;
    throw new ApiError(
      info?.message ?? ax.message ?? "네트워크 오류가 발생했습니다.",
      info?.code,
      ax.response?.status,
    );
  }
}
