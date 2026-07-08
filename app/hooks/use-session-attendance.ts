import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, type AttendanceDto, attendanceApi } from "~/lib/api";

const POLL_MS = 30_000;

type State = {
  rows: AttendanceDto[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * 특정 세션의 출석 현황을 조회한다. 30초 폴링으로 자동 갱신(§11-2).
 * 폴링(silent) 시엔 로딩 표시 없이 조용히 갱신하고, 최신 요청만 반영한다.
 */
export function useSessionAttendance(
  clubId: number | null,
  sessionId: number | null,
): State {
  const [rows, setRows] = useState<AttendanceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqRef = useRef(0);

  const fetchData = useCallback(
    async (silent: boolean) => {
      if (clubId === null || sessionId === null) {
        setRows([]);
        return;
      }
      const req = ++reqRef.current;
      if (!silent) setLoading(true);
      try {
        const slice = await attendanceApi.getSessionAttendance(
          clubId,
          sessionId,
        );
        if (req !== reqRef.current) return;
        setRows(slice.content ?? []);
        setError(null);
      } catch (err) {
        if (req !== reqRef.current) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "출석 현황을 불러오지 못했습니다.",
        );
      } finally {
        if (req === reqRef.current && !silent) setLoading(false);
      }
    },
    [clubId, sessionId],
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    if (clubId === null || sessionId === null) return;
    const id = setInterval(() => fetchData(true), POLL_MS);
    return () => clearInterval(id);
  }, [fetchData, clubId, sessionId]);

  const reload = useCallback(() => {
    void fetchData(false);
  }, [fetchData]);

  return { rows, loading, error, reload };
}
