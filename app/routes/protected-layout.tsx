import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/protected-layout";
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

export default function ProtectedLayout() {
  return <Outlet />;
}
