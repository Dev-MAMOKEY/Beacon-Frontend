import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

type Props = {
  to: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

/**
 * 사이드바의 단일 네비 링크. 아이콘 + 라벨.
 * Figma Active: bg-border-subtle/50 + border-r-4 primary + text-primary
 * Inactive:     text-foreground-subtle + hover:bg-border-subtle/30
 *
 * 보이지 않는 투명 right border를 inactive에도 두어 active 토글 시 폭이 안 밀린다.
 */
export function NavLink({ to, icon: Icon, label, active = false }: Props) {
  const base =
    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-r-4";
  const state = active
    ? "bg-border-subtle/50 border-primary text-primary"
    : "border-transparent text-foreground-subtle hover:bg-border-subtle/30 hover:text-foreground";

  return (
    <Link to={to} className={`${base} ${state}`}>
      <Icon className="size-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
