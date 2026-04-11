import { Bell, Settings } from "lucide-react";
import { IconButton } from "~/components/ui/IconButton";
import { SearchInput } from "~/components/ui/SearchInput";
import { UserProfile } from "~/components/user/UserProfile";
import { ThemeToggle } from "~/components/ThemeToggle";

type Props = {
  user: {
    name: string;
    role: string;
    avatarSrc?: string;
  };
  searchPlaceholder?: string;
};

/**
 * 대시보드 상단 고정 헤더.
 * Figma: h-16, backdrop-blur, 좌측 검색 / 우측 알림·설정·(구분선)·프로필
 */
export function TopNavBar({
  user,
  searchPlaceholder = "Search students, sessions...",
}: Props) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-8 backdrop-blur-[12px]">
      <SearchInput placeholder={searchPlaceholder} />

      <div className="flex items-center gap-4">
        <IconButton aria-label="Notifications" badge>
          <Bell className="size-[18px]" />
        </IconButton>
        <IconButton aria-label="Settings">
          <Settings className="size-[18px]" />
        </IconButton>
        <ThemeToggle />
        <div className="h-8 w-px bg-border-subtle" />
        <UserProfile
          name={user.name}
          role={user.role}
          avatarSrc={user.avatarSrc}
        />
      </div>
    </header>
  );
}
