import { useMemo } from "react";
import { useActiveClub } from "./use-active-club";
import { useClubMembers } from "./use-club-members";
import { useClubs } from "./use-clubs";
import { useMyProfile } from "./use-my-profile";

/** 역할 코드 → 시안 표기. 시안의 "마모키 팀원"에서 뒷부분에 해당한다. */
const ROLE_LABEL: Record<"ADMIN" | "MEMBER", string> = {
  ADMIN: "관리자",
  MEMBER: "팀원",
};

/**
 * 헤더 프로필의 소속줄 문구를 만든다. 시안(409:2568)은 "{동아리명} {역할}" 형식이다.
 *
 * 서버가 title을 내려주면 그대로 쓰고, 없으면 활성 동아리명 + 역할로 조합한다.
 * 역할은 멤버 목록에서 내 stdId로 찾는데, 이 목록은 ADMIN 전용이라 일반 멤버는
 * 조회에 실패한다. 조회가 실패하는 사용자는 곧 관리자가 아니므로 기본값 "팀원"이 정답이 된다.
 */
export function useMyAffiliation(): string {
  const { profile } = useMyProfile();
  const { activeClubId } = useActiveClub();
  const { clubs } = useClubs();
  const { members } = useClubMembers();

  return useMemo(() => {
    if (profile?.title) return profile.title;
    if (!profile) return "";

    const clubName = clubs.find((c) => c.clubId === activeClubId)?.clubName;
    // 동아리가 없거나 이름을 아직 못 받았으면 학번으로 폴백한다(레이아웃 유지).
    if (!clubName) return `학번 ${profile.stdId}`;

    const role = members.find((m) => m.stdId === profile.stdId)?.role;
    return `${clubName} ${ROLE_LABEL[role ?? "MEMBER"]}`;
  }, [profile, activeClubId, clubs, members]);
}
