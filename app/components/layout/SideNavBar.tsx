import type { ComponentType, SVGProps } from "react";
import { useLocation } from "react-router";
import { BrandLogo } from "~/components/brand/BrandLogo";
import { NavLink } from "~/components/nav/NavLink";
import {
  AttendanceIcon,
  DashboardIcon,
  MembersIcon,
  SessionIcon,
  SettingsIcon,
} from "~/components/nav/nav-icons";

type NavItem = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

const MAIN_NAV: NavItem[] = [
  { to: "/", icon: DashboardIcon, label: "대시 보드" },
  { to: "/sessions", icon: SessionIcon, label: "세션 관리" },
  { to: "/members", icon: MembersIcon, label: "멤버/통계" },
  { to: "/attendance", icon: AttendanceIcon, label: "출석 현황" },
  { to: "/settings", icon: SettingsIcon, label: "설정 메뉴" },
];

/**
 * 대시보드 좌측 사이드바.
 * Figma(node 142:327): 흰색 배경, px-30 py-40, 로고와 네비 사이 gap-50.
 * 네비 항목은 gap-16, active 항목은 상하 보더(main)로 강조(NavLink, node 355:1880).
 * 현재 URL과 매칭해 NavLink의 active 상태를 자동 결정한다.
 */
export function SideNavBar() {
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <aside className="sticky top-0 flex h-screen w-[297px] shrink-0 flex-col gap-[50px] border-r border-border-subtle bg-surface px-[30px] py-[40px]">
      <BrandLogo />
      <nav className="flex flex-col gap-4">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item.to)}
          />
        ))}
      </nav>
    </aside>
  );
}
