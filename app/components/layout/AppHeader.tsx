import { Header } from "./Header";
import { ClubSwitcher } from "./ClubSwitcher";
import { useMyAffiliation } from "~/hooks/use-my-affiliation";
import { useMyProfile } from "~/hooks/use-my-profile";

/**
 * 인증된 페이지용 헤더. GET /members/me로 실제 로그인 사용자 정보를 조회해 표시한다.
 * 보조 줄은 시안(409:2568)대로 소속을 "{동아리명} {역할}"(예: "마모키 팀원") 형식으로 노출한다.
 * 활성 동아리 스위처는 시안대로 헤더 우측 끝(알림·테마·로그아웃 뒤)에 배치한다.
 * 로딩/실패 시에도 레이아웃이 유지되도록 폴백 값을 사용한다.
 */
export function AppHeader() {
  const { profile } = useMyProfile();
  const affiliation = useMyAffiliation();

  return (
    <Header
      user={{
        name: profile?.name ?? "사용자",
        role: affiliation,
      }}
      clubSwitcher={<ClubSwitcher />}
    />
  );
}
