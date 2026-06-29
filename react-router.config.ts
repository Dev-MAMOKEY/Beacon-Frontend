import type { Config } from "@react-router/dev/config";

export default {
  // SPA 모드: 서버 loader가 없고 인증이 localStorage(클라이언트) 기반이라
  // SSR은 실익이 없고 인증 가드 깜빡임만 유발한다. 클라이언트에서 라우터 부팅 시
  // clientMiddleware가 먼저 실행되어 보호 콘텐츠 렌더 전에 /login으로 가드한다.
  ssr: false,
  future: {
    // 라우트 가드용 clientMiddleware 활성화
    v8_middleware: true,
  },
} satisfies Config;
