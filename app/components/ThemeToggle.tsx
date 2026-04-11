import { Monitor, Moon, Sun } from "lucide-react";
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
        {theme === "system" && <Monitor className="size-[18px]" />}
        {theme === "light" && <Sun className="size-[18px]" />}
        {theme === "dark" && <Moon className="size-[18px]" />}
      </span>
    </button>
  );
}
