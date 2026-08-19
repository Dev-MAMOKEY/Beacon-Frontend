import { useCallback, useEffect, useState } from "react";
import { useActiveClub } from "./use-active-club";
import { ApiError, type Session, type SessionStatus, sessionsApi } from "~/lib/api";

type State = {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  /** 활성 clubId 없음(동아리 미소속). */
  noClub: boolean;
  reload: () => void;
};

/**
 * 활성 동아리의 세션 목록을 조회한다(Slice의 content). status로 필터 가능.
 * reload()로 재조회(생성/시작/종료/삭제 후 갱신).
 */
export function useSessions(status?: SessionStatus): State {
  const { activeClubId } = useActiveClub();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (activeClubId === null) {
      setSessions([]);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    sessionsApi
      .getSessions(activeClubId, status ? { status } : undefined)
      .then((slice) => {
        if (active) setSessions(slice.content ?? []);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof ApiError ? err.message : "세션을 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId, status, tick]);

  return { sessions, loading, error, noClub: activeClubId === null, reload };
}
