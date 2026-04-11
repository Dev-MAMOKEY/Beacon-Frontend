import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  subscribeSystemTheme,
  type Theme,
} from "~/lib/theme";

/**
 * 3가지 모드를 순환하는 토글 버튼: system → light → dark → system
 *
 * - SSR 시엔 "system"으로 시작 (클라이언트에서 hydrate 후 실제 값으로 교체)
 * - OS 설정 변경은 구독해서 system 모드일 때 아이콘만 갱신
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // hydration 이후 저장된 값 읽어서 state + DOM 둘 다 동기화
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  // system 모드일 때 OS 설정 변경 감지 (클래스는 CSS @media가 이미 처리하므로 리렌더만)
  useEffect(() => {
    if (theme !== "system") return;
    return subscribeSystemTheme(() => {
      // 아이콘 갱신을 위한 강제 리렌더 — state를 같은 값으로 다시 set
      setTheme("system");
    });
  }, [theme]);

  const cycleTheme = () => {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  const label =
    theme === "system"
      ? "테마: 시스템 설정"
      : theme === "light"
        ? "테마: 라이트"
        : "테마: 다크";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-primary/10"
    >
      <span className={mounted ? "" : "invisible"}>
        {theme === "system" && <MonitorIcon />}
        {theme === "light" && <SunIcon />}
        {theme === "dark" && <MoonIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
