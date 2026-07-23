import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { IconButton } from "~/components/ui/IconButton";
import { authApi } from "~/lib/api";
import { hasActiveSession } from "~/lib/auth/session";
import { clearMyProfileCache } from "~/hooks/use-my-profile";

/**
 * 상단 바 로그아웃 버튼. 로그인 상태에서만 노출한다(비로그인 시 렌더 안 함).
 * 클릭 시 서버 로그아웃 + 로컬 토큰/프로필 캐시 정리 후 로그인 페이지로 이동한다.
 * Figma(362:1592) 상단 바 우측 아이콘.
 */
export function LogoutButton() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!hasActiveSession()) return null;

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await authApi.logout();
    } finally {
      clearMyProfileCache();
      navigate("/login", { replace: true });
    }
  }

  return (
    <IconButton aria-label="로그아웃" onClick={handleLogout}>
      <LogOut className="size-[18px]" />
    </IconButton>
  );
}
