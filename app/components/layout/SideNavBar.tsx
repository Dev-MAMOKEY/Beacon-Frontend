import {
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  type LucideIcon,
  Settings,
  Users,
} from "lucide-react";
import { useLocation } from "react-router";
import { BrandLogo } from "~/components/brand/BrandLogo";
import { NavLink } from "~/components/nav/NavLink";
import { Button } from "~/components/ui/Button";

type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
};

const MAIN_NAV: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sessions", icon: CalendarClock, label: "Session Management" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attendance Status" },
  { to: "/members", icon: Users, label: "Members & Stats" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const FOOTER_NAV: NavItem[] = [
  { to: "/support", icon: LifeBuoy, label: "Support" },
  { to: "/logout", icon: LogOut, label: "Sign Out" },
];

/**
 * 대시보드 좌측 사이드바.
 * Figma: w-64, bg surface-muted, 3단(로고 / 네비 / 하단 CTA+링크)
 * 현재 URL과 매칭해 NavLink의 active 상태를 자동 결정한다.
 */
export function SideNavBar() {
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-border-subtle bg-surface-muted px-4 py-8">
      <div className="flex flex-col">
        <BrandLogo />
        <nav className="mt-10 flex flex-col gap-1">
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
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-6">
        <Button as="link" to="/sessions/new" variant="gradient" className="w-full py-3">
          New Session
        </Button>
        <div className="mt-4 flex flex-col">
          {FOOTER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
