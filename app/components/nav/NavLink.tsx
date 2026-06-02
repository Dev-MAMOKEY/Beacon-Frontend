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
 * Figma Active:   bg-border-subtle + border primary-hover + text-primary-hover, rounded pill
 * Inactive:       text-foreground-subtle, 투명 border
 *
 * inactive에도 투명 border를 두어 active 토글 시 폭이 안 밀린다.
 */
export function NavLink({ to, icon: Icon, label, active = false }: Props) {
  const base =
    "flex w-[237px] items-center gap-[18px] rounded-[20px] border py-[14px] pl-[30px] pr-3 text-base transition-colors";
  const state = active
    ? "border-primary-hover bg-border-subtle font-semibold text-primary-hover"
    : "border-transparent font-medium text-foreground-subtle hover:bg-border-subtle/40 hover:text-foreground";

  return (
    <Link to={to} className={`${base} ${state}`}>
      <Icon className="size-[18px] shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}
