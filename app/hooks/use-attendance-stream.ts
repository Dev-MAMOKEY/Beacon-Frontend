import { useEffect, useRef } from "react";
import { subscribeSse } from "~/lib/sse";

/**
 * 활성 동아리의 실시간 출석 스트림(SSE)을 구독한다.
 * 이벤트 수신 시 onEvent 콜백을 호출한다. 이벤트 페이로드 형태는 백엔드에서 확정되지
 * 않았으므로, 여기서는 "출석이 갱신됐다"는 신호로만 사용해 관련 데이터를 재조회한다.
 */
export function useAttendanceStream(
  clubId: number | null,
  onEvent: () => void,
): void {
  const cb = useRef(onEvent);
  cb.current = onEvent;

  useEffect(() => {
    if (clubId === null) return;
    return subscribeSse(`/api/v1/clubs/${clubId}/attendance/stream`, {
      onEvent: () => cb.current(),
    });
  }, [clubId]);
}
