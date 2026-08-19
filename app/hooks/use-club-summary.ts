import { useCallback, useEffect, useState } from "react";
import { useActiveClub } from "./use-active-club";
import { ApiError, type SummaryResponseDto, statsApi } from "~/lib/api";

type State = {
  summary: SummaryResponseDto | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * 활성 동아리의 대시보드 요약(오늘 출석·지각·전체 멤버·평균 출석률)을 조회한다.
 * reload()로 재조회(실시간 이벤트 수신 시 갱신).
 */
export function useClubSummary(): State {
  const { activeClubId } = useActiveClub();
  const [summary, setSummary] = useState<SummaryResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (activeClubId === null) {
      setSummary(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    statsApi
      .getSummary(activeClubId)
      .then((s) => {
        if (active) setSummary(s);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof ApiError ? err.message : "요약을 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId, tick]);

  return { summary, loading, error, reload };
}
