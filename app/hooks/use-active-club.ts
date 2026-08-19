import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useMyProfile } from "./use-my-profile";
import {
  getStoredActiveClubId,
  setStoredActiveClubId,
  subscribeActiveClub,
} from "~/lib/club/active-club";

type State = {
  /** 내가 속한 동아리 id 목록. */
  clubIds: number[];
  /** 현재 활성 동아리 id. 소속이 없으면 null. */
  activeClubId: number | null;
  loading: boolean;
  error: string | null;
  /** 활성 동아리를 전환한다(전역 전파 + localStorage 영속). */
  setActiveClub: (clubId: number) => void;
};

/** 저장값과 clubIds로 활성 clubId 결정. 저장값이 목록에 없으면 첫 항목 폴백. */
function resolve(clubIds: number[], stored: number | null): number | null {
  if (clubIds.length === 0) return null;
  if (stored !== null && clubIds.includes(stored)) return stored;
  return clubIds[0];
}

/**
 * members/me의 clubIds와 공유 활성 선택을 조합해 활성 동아리를 제공한다.
 * 활성 clubId는 useSyncExternalStore로 구독되어, 어느 컴포넌트에서 전환하든
 * 모든 소비자가 함께 갱신된다.
 */
export function useActiveClub(): State {
  const { profile, loading, error } = useMyProfile();
  const clubIds = profile?.clubIds ?? [];

  const stored = useSyncExternalStore(
    subscribeActiveClub,
    getStoredActiveClubId,
    () => null,
  );

  const activeClubId = resolve(clubIds, stored);

  // 폴백으로 결정된 활성값을 저장에 동기화(전역 전파).
  useEffect(() => {
    if (activeClubId !== null && activeClubId !== stored) {
      setStoredActiveClubId(activeClubId);
    }
  }, [activeClubId, stored]);

  const setActiveClub = useCallback((clubId: number) => {
    setStoredActiveClubId(clubId);
  }, []);

  return { clubIds, activeClubId, loading, error, setActiveClub };
}
