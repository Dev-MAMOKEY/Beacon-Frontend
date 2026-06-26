export type AttendanceStatus = "출석" | "지각" | "결석";

export type AttendanceRow = {
  name: string;
  studentId: string;
  status: AttendanceStatus;
  checkInTime: string;
  handling: string;
  reason: string;
  statusChanged: string;
};

type Props = {
  rows: AttendanceRow[];
};

const HEADERS = [
  "이름",
  "학번",
  "출석상태",
  "체크인 시간",
  "처리 여부",
  "사유",
  "상태 변경",
];

/** 출석 상태별 색상. Figma: 출석 #22c55e, 지각 #fbbf24, 결석 #ba1a1a. */
const STATUS_COLOR: Record<AttendanceStatus, string> = {
  출석: "text-[#22c55e]",
  지각: "text-[#fbbf24]",
  결석: "text-destructive",
};

/**
 * 출석 현황 테이블.
 * Figma(199:1306): bg-surface, rounded-22, py-40, 7열 그리드(중앙 정렬).
 * 헤더(18px, foreground-subtle) + 하단 보더, 행은 짝/홀 교차 배경. 출석상태만 색상 강조.
 */
export function AttendanceTable({ rows }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[22px] bg-surface py-[40px] text-center">
      <div className="grid grid-cols-7 border-b border-foreground-subtle pb-[20px] text-[18px] font-semibold text-foreground-subtle">
        {HEADERS.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      {rows.map((r, i) => (
        <div
          key={r.studentId}
          className={`grid grid-cols-7 py-[22px] text-[20px] font-semibold ${
            i % 2 === 0 ? "bg-[#f8f8f8]" : "bg-surface"
          }`}
        >
          <span className="text-foreground-muted">{r.name}</span>
          <span className="text-foreground-muted">{r.studentId}</span>
          <span className={STATUS_COLOR[r.status]}>{r.status}</span>
          <span className="text-foreground-muted">{r.checkInTime}</span>
          <span className="text-foreground-muted">{r.handling}</span>
          <span className="text-foreground-muted">{r.reason}</span>
          <span className="text-foreground-muted">{r.statusChanged}</span>
        </div>
      ))}
    </div>
  );
}
