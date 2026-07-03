import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // 보호 라우트: 미인증 시 /login으로 가드(protected-layout의 clientMiddleware)
  layout("routes/protected-layout.tsx", [
    // 온보딩: 인증만 필요(동아리 불필요) — 동아리 없으면 여기로 유도됨
    route("onboarding", "routes/onboarding.tsx"),
    // 동아리 가드: clubIds 비면 /onboarding으로(club-layout의 clientMiddleware)
    layout("routes/club-layout.tsx", [
      index("routes/home.tsx"),
      route("sessions", "routes/sessions.tsx"),
      route("members", "routes/members.tsx"),
      route("attendance", "routes/attendance.tsx"),
      route("settings", "routes/settings.tsx"),
    ]),
  ]),
  // 인증 페이지: 로그인 상태면 /로 가드(auth-layout의 clientMiddleware)
  layout("routes/auth-layout.tsx", [
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
  ]),
] satisfies RouteConfig;
