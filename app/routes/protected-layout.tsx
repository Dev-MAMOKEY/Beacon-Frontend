import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/protected-layout";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { ensureAuthenticated } from "~/lib/auth/session";

/**
 * 보호 라우트 가드.
 * 미인증(토큰 부재·만료 + 재발급 실패) 시 /login으로 리다이렉트한다.
 * 토큰이 localStorage에만 있어 SSR에서 알 수 없으므로 clientMiddleware로 가드한다.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ request }, next) => {
    if (!(await ensureAuthenticated())) {
      const { pathname, search } = new URL(request.url);
      const redirectTo = encodeURIComponent(`${pathname}${search}`);
      throw redirect(`/login?redirectTo=${redirectTo}`);
    }
    return next();
  },
];

/**
 * 앱 셸(사이드바 + 상단바)을 여기서 렌더해 페이지 이동 간 마운트를 유지한다.
 * 페이지 안에 두면 라우트가 바뀔 때마다 헤더가 언마운트/마운트되어
 * 동아리 스위처가 깜빡이고 프로필·멤버 조회가 매번 재요청된다.
 * 각 페이지는 <main>만 반환한다(패딩·정렬이 화면마다 달라 main은 페이지가 소유).
 */
export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  );
}
