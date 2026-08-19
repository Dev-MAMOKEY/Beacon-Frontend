import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/auth-layout";
import { hasActiveSession } from "~/lib/auth/session";

/**
 * 인증 페이지(로그인) 가드.
 * 이미 로그인된 상태면 대시보드(/)로 리다이렉트한다.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ request }, next) => {
    if (hasActiveSession()) {
      const redirectTo = new URL(request.url).searchParams.get("redirectTo");
      throw redirect(redirectTo ?? "/");
    }
    return next();
  },
];

export default function AuthLayout() {
  return <Outlet />;
}
