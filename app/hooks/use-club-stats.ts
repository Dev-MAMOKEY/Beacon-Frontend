import { useEffect, useState } from "react";
import { useActiveClub } from "./use-active-club";
import {
  ApiError,
  type DistributionResponseDto,
  type MemberStatItem,
  statsApi,
  type TrendItem,
} from "~/lib/api";

type State = {
  trend: TrendItem[];
  distribution: DistributionResponseDto | null;
  memberStats: MemberStatItem[];
  loading: boolean;
  error: string | null;
};

/**
 * 활성 동아리의 통계(추이·분포·멤버별)를 기간 기준으로 함께 조회한다.
 * trend/distribution은 기간을 받고, memberStats는 전체다.
 */
export function useClubStats(startDate: string, endDate: string): State {
  const { activeClubId } = useActiveClub();
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [distribution, setDistribution] =
    useState<DistributionResponseDto | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeClubId === null || !startDate || !endDate) return;
    let active = true;
    const range = { startDate, endDate };
    setLoading(true);
    setError(null);
    Promise.all([
      statsApi.getTrend(activeClubId, range),
      statsApi.getDistribution(activeClubId, range),
      statsApi.getMemberStats(activeClubId),
    ])
      .then(([t, d, m]) => {
        if (!active) return;
        setTrend(t.trend ?? []);
        setDistribution(d);
        setMemberStats(m.members ?? []);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof ApiError ? err.message : "통계를 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId, startDate, endDate]);

  return { trend, distribution, memberStats, loading, error };
}
