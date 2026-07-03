import { useCallback, useEffect, useState } from "react";
import { useMyProfile } from "./use-my-profile";
import {
  getStoredActiveClubId,
  resolveActiveClubId,
  setStoredActiveClubId,
} from "~/lib/club/active-club";

type State = {
  /** 내가 속한 동아리 id 목록. */
  clubIds: number[];
  /** 현재 활성 동아리 id. 소속이 없으면 null. */
  activeClubId: number | null;
  loading: boolean;
  error: string | null;
  /** 활성 동아리를 전환한다(localStorage 영속). */
  setActiveClub: (clubId: number) => void;
};

/**
 * members/me의 clubIds와 localStorage 선택을 조합해 활성 동아리를 제공한다.
 * 저장값이 목록에 없으면 첫 항목으로 폴백하고 저장값을 동기화한다.
 */
export function useActiveClub(): State {
  const { profile, loading, error } = useMyProfile();
  const clubIds = profile?.clubIds ?? [];
  const clubKey = clubIds.join(",");

  const [activeClubId, setActiveClubId] = useState<number | null>(() =>
    resolveActiveClubId(profile?.clubIds),
  );

  // 프로필(clubIds) 변경 시 활성 clubId 재확정 + 폴백 결과 저장 동기화.
  useEffect(() => {
    const resolved = resolveActiveClubId(clubIds);
    setActiveClubId(resolved);
    if (resolved !== null && resolved !== getStoredActiveClubId()) {
      setStoredActiveClubId(resolved);
    }
    // clubKey로 목록 변화만 추적(배열 identity 변화 무시).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubKey]);

  const setActiveClub = useCallback((clubId: number) => {
    setStoredActiveClubId(clubId);
    setActiveClubId(clubId);
  }, []);

  return { clubIds, activeClubId, loading, error, setActiveClub };
}
