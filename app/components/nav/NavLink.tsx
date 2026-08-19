import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router";

type Props = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;
};

/**
 * 사이드바의 단일 네비 링크. 아이콘(24px) + 라벨(SemiBold 16px).
 * Figma(node 355:1880):
 *   선택:   상하 2px 보더(main) + text-main, 아이콘도 currentColor로 main
 *   미선택: 투명 보더 + text-foreground-subtle
 *
 * 미선택에도 상하 투명 보더(border-y-2)를 두어 선택 토글 시 높이가 안 밀린다.
 */
export function NavLink({ to, icon: Icon, label, active = false }: Props) {
  const base =
    "flex w-[237px] items-center gap-[15px] border-y-2 py-[14px] pl-[20px] pr-[120px] text-[16px] font-semibold transition-colors";
  const state = active
    ? "border-primary-hover text-primary-hover"
    : "border-transparent text-foreground-subtle hover:text-foreground";

  return (
    <Link to={to} className={`${base} ${state}`}>
      <Icon className="size-[24px] shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}
