import { useCallback, useEffect, useState } from "react";
import { useActiveClub } from "./use-active-club";
import { ApiError, type ClubMemberResponse, membersApi } from "~/lib/api";

type State = {
  members: ClubMemberResponse[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * 활성 동아리의 멤버 목록을 조회한다(ADMIN 전용 엔드포인트).
 * 검색은 호출측에서 클라이언트 필터로 처리한다.
 */
export function useClubMembers(): State {
  const { activeClubId } = useActiveClub();
  const [members, setMembers] = useState<ClubMemberResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (activeClubId === null) {
      setMembers([]);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    membersApi
      .getClubMembers(activeClubId)
      .then((list) => {
        if (active) setMembers(list ?? []);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof ApiError ? err.message : "멤버를 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId, tick]);

  return { members, loading, error, reload };
}
