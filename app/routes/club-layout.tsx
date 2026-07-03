import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/club-layout";
import { loadMyProfile } from "~/hooks/use-my-profile";

/**
 * 동아리 가드. 소속 동아리(clubIds)가 없으면 /onboarding으로 유도한다.
 * protected-layout(인증 가드) 하위에서 실행되어 토큰은 이미 보장된다.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_args, next) => {
    try {
      const profile = await loadMyProfile();
      if (!profile.clubIds || profile.clubIds.length === 0) {
        throw redirect("/onboarding");
      }
    } catch (err) {
      // redirect(Response)는 재전파, 프로필 조회 실패는 통과시켜 하위에서 처리.
      if (err instanceof Response) throw err;
    }
    return next();
  },
];

export default function ClubLayout() {
  return <Outlet />;
}
