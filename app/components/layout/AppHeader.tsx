import { Header } from "./Header";
import { ClubSwitcher } from "./ClubSwitcher";
import { useMyProfile } from "~/hooks/use-my-profile";

/**
 * 인증된 페이지용 헤더. GET /members/me로 실제 로그인 사용자 정보를 조회해 표시한다.
 * 보조 줄은 소속(title, 예: "마모키 팀원")을 노출하고, title이 없으면 학번으로 폴백한다.
 * 활성 동아리 스위처를 프로필 좌측에 배치한다.
 * 로딩/실패 시에도 레이아웃이 유지되도록 폴백 값을 사용한다.
 */
export function AppHeader() {
  const { profile } = useMyProfile();

  const role = profile?.title || (profile ? `학번 ${profile.stdId}` : "");

  return (
    <Header
      user={{
        name: profile?.name ?? "사용자",
        role,
      }}
      clubSwitcher={<ClubSwitcher />}
    />
  );
}
