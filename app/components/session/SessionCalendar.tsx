import type { ActivityCategory } from "./ActivityBadge";

type Props = {
  year?: number;
  /** 1~12 */
  month?: number;
  /** 날짜(일) → 활동 분류. 해당 날짜에 색 마커를 표시. */
  markers?: Record<number, ActivityCategory>;
  /** 오늘(선택) 날짜. 주황 테두리 강조. */
  today?: number;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 분류별 날짜 마커 배경. Figma(163:357). */
const MARKER_BG: Record<ActivityCategory, string> = {
  동아리: "bg-[rgba(26,115,232,0.5)]",
  회의: "bg-[rgba(160,126,255,0.5)]",
  프로젝트: "bg-[rgba(255,182,145,0.5)]",
};

const DEFAULT_MARKERS: Record<number, ActivityCategory> = {
  4: "동아리",
  11: "동아리",
  14: "프로젝트",
  18: "동아리",
  22: "회의",
  25: "동아리",
};

/**
 * 월간 세션 표시 달력.
 * Figma(158:607): bg-surface, rounded-24, p-40, gap-24.
 * 요일(일=휴일 빨강), 날짜 셀은 분류별 색 마커 / 오늘은 주황 테두리.
 */
export function SessionCalendar({
  year = 2026,
  month = 5,
  markers = DEFAULT_MARKERS,
  today = 14,
}: Props) {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-[24px] rounded-[24px] bg-surface p-[40px]">
      <div className="flex items-end gap-[10px]">
        <p className="text-[38px] font-semibold text-foreground">{month}월</p>
        <p className="text-[18px] font-medium text-foreground-subtle">{year}년</p>
      </div>

      <div className="grid grid-cols-7 gap-x-[40px] gap-y-[20px]">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`flex items-center justify-center px-[10px] py-[8px] text-[20px] font-semibold ${
              i === 0 ? "text-[#ce2121]" : "text-foreground"
            }`}
          >
            {w}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const marker = markers[day];
          const isToday = day === today;
          const pill = marker
            ? `rounded-[20px] ${MARKER_BG[marker]}`
            : "";
          const ring = isToday ? "rounded-[20px] border-[3px] border-[#ff894d]" : "";
          return (
            <div
              key={day}
              className={`flex items-center justify-center px-[10px] py-[8px] text-[20px] font-semibold text-foreground ${pill} ${ring}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
