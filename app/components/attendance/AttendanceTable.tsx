import type { AttendanceDto } from "~/lib/api";
import { STATUS_LABEL, STATUS_TEXT_COLOR } from "~/lib/attendance";
import { formatAmPmTime } from "~/lib/datetime";

type Props = {
  rows: AttendanceDto[];
  onChangeStatus?: (record: AttendanceDto) => void;
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

/**
 * 출석 현황 테이블(§17-19).
 * 이름·학번·상태배지·체크인·수동여부·사유·상태변경 버튼. 7열 그리드(중앙 정렬).
 */
export function AttendanceTable({ rows, onChangeStatus }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[22px] bg-surface py-[40px] text-center">
      <div className="grid grid-cols-7 border-b border-foreground-subtle pb-[20px] text-[18px] font-semibold text-foreground-subtle">
        {HEADERS.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      {rows.map((r, i) => {
        const status = r.attendanceStatus ?? "ABSENT";
        return (
          <div
            key={r.recordId ?? i}
            className={`grid grid-cols-7 items-center py-[22px] text-[20px] font-semibold ${
              i % 2 === 0 ? "bg-surface-alt" : "bg-surface"
            }`}
          >
            <span className="text-foreground-muted">{r.memberName ?? "-"}</span>
            <span className="text-foreground-muted">{r.stdId ?? "-"}</span>
            <span className={STATUS_TEXT_COLOR[status]}>
              {STATUS_LABEL[status]}
            </span>
            <span className="text-foreground-muted">
              {r.checkedAt ? formatAmPmTime(r.checkedAt) : "-"}
            </span>
            <span className="text-foreground-muted">
              {r.isManual ? "수동" : "자동"}
            </span>
            <span className="text-foreground-muted">{r.adminNote || "-"}</span>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onChangeStatus?.(r)}
                className="rounded-[12px] bg-border-subtle px-[16px] py-[6px] text-[15px] font-semibold text-foreground-subtle transition-opacity hover:opacity-90"
              >
                변경
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
