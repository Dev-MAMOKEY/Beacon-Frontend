import { Header } from "./Header";
import { useMyProfile } from "~/hooks/use-my-profile";

/**
 * 인증된 페이지용 헤더. GET /members/me로 실제 로그인 사용자 정보를 조회해 표시한다.
 * 보조 줄은 학번을 노출한다(소속/직책은 clubId 기반이라 별도).
 * 로딩/실패 시에도 레이아웃이 유지되도록 폴백 값을 사용한다.
 */
export function AppHeader() {
  const { profile } = useMyProfile();

  return (
    <Header
      user={{
        name: profile?.name ?? "사용자",
        role: profile ? `학번 ${profile.stdId}` : "",
      }}
    />
  );
}
