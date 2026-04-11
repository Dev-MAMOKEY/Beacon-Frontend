/**
  * 테마 관련 유틸리티.
 * - "system": OS의 prefers-color-scheme 따름 (기본값)
 * - "light": 강제 라이트
 * - "dark": 강제 다크
 */

export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "beacon-theme";
export const THEMES: readonly Theme[] = ["system", "light", "dark"] as const;

const isBrowser = () => typeof window !== "undefined";

/** localStorage에서 사용자 선택 읽기. 없으면 "system". */
export function getStoredTheme(): Theme {
  if (!isBrowser()) return "system";
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

/** localStorage에 사용자 선택 저장. "system"은 키 자체를 제거. */
export function setStoredTheme(theme: Theme): void {
  if (!isBrowser()) return;
  if (theme === "system") {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

/** OS의 현재 color scheme 감지. */
export function getSystemTheme(): ResolvedTheme {
  if (!isBrowser()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Theme → 실제로 그려질 light/dark 확정. */
export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

/** html 엘리먼트에 클래스 적용. system 모드면 클래스를 제거해 CSS @media에 위임. */
export function applyTheme(theme: Theme): void {
  if (!isBrowser()) return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light" || theme === "dark") {
    root.classList.add(theme);
  }
}

/** 저장된 선택을 읽어 DOM에 적용. 앱 부팅 시 1회 호출. */
export function initTheme(): Theme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

/** OS 설정 변경 구독 (유저가 system 모드일 때 즉시 반영용). */
export function subscribeSystemTheme(
  callback: (theme: ResolvedTheme) => void,
): () => void {
  if (!isBrowser()) return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
