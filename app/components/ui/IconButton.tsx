import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  /** 우상단 알림 닷 표시 */
  badge?: boolean;
  "aria-label": string;
  title?: string;
};

/**
 * 원형 아이콘 버튼. 내부에 <SearchIcon /> 등 아이콘 컴포넌트를 children으로 전달.
 * Figma: p-2, rounded-full, 알림 뱃지는 우상단 8px 빨간 닷 (destructive)
 */
export function IconButton({
  children,
  onClick,
  badge = false,
  title,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rest["aria-label"]}
      title={title ?? rest["aria-label"]}
      className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-border-subtle/60 hover:text-foreground"
    >
      {children}
      {badge && (
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-surface" />
      )}
    </button>
  );
}
