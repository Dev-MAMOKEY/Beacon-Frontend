import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    // 라우트 가드용 clientMiddleware 활성화
    v8_middleware: true,
  },
} satisfies Config;
