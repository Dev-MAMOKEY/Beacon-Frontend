import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "~/components/ui/IconButton";
import { SearchInput } from "~/components/ui/SearchInput";
import { UserProfile } from "~/components/user/UserProfile";
import { ThemeToggle } from "~/components/ThemeToggle";
import { LogoutButton } from "~/components/layout/LogoutButton";

type Props = {
  user: {
    name: string;
    role: string;
    avatarSrc?: string;
  };
  searchPlaceholder?: string;
  /** 우측 끝에 노출할 동아리 스위처 등 슬롯. */
  clubSwitcher?: ReactNode;
};

/**
 * 대시보드 상단 고정 헤더.
 * Figma(node 221:987): 흰 배경, pt-20 pb-14 px-30.
 * 좌측 검색 / 우측 프로필(이름·소속·아바타) · 구분선 · 알림 · 테마 토글 · 로그아웃 · 동아리 스위처
 * 시안(409:2568)대로 우측은 프로필 묶음(gap 26)과 동아리 스위처를 gap 24로 나눈다.
 */
export function Header({
  user,
  searchPlaceholder = "검색어를 입력하세요",
  clubSwitcher,
}: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-surface px-[30px] pb-[14px] pt-[20px]">
      <SearchInput placeholder={searchPlaceholder} />

      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[26px]">
          <UserProfile
            name={user.name}
            role={user.role}
            avatarSrc={user.avatarSrc}
          />
          <div className="h-12 w-px bg-border-subtle" />
          <div className="flex items-center gap-2">
            <IconButton aria-label="알림">
              <Bell className="size-[18px]" />
            </IconButton>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        {clubSwitcher}
      </div>
    </header>
  );
}
