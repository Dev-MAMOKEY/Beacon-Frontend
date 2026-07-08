import type { Session } from "~/lib/api";
import { toLocalYmd } from "~/lib/datetime";

type SessionStatus = NonNullable<Session["status"]>;

type Props = {
  /** 표시할 세션들. expectStartAt 날짜에 상태별 마커를 찍는다. */
  sessions?: Session[];
  /** 표시 연도. 기본 오늘. */
  year?: number;
  /** 표시 월(1~12). 기본 오늘. */
  month?: number;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 상태별 날짜 마커 배경(테마 토큰 + 불투명도). */
const STATUS_MARKER: Record<SessionStatus, string> = {
  SCHEDULED: "bg-border-subtle",
  ACTIVE: "bg-success/50",
  ENDED: "bg-destructive/40",
};

/**
 * 월간 세션 표시 달력.
 * Figma(158:607): bg-surface, rounded-24, p-40, gap-24.
 * 요일(일=휴일 빨강), 세션이 있는 날짜에 상태색 마커 / 오늘은 테두리 강조.
 */
export function SessionCalendar({ sessions = [], year, month }: Props) {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  const today =
    now.getFullYear() === y && now.getMonth() + 1 === m
      ? now.getDate()
      : undefined;

  // 해당 월의 날짜 → 세션 상태 마커.
  const markers = new Map<number, SessionStatus>();
  for (const s of sessions) {
    const ymd = toLocalYmd(s.expectStartAt);
    if (ymd && ymd.year === y && ymd.month === m) {
      markers.set(ymd.day, s.status ?? "SCHEDULED");
    }
  }

  const firstWeekday = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex w-full flex-col gap-[24px] rounded-[24px] bg-surface p-[40px]">
      <div className="flex items-end gap-[10px]">
        <p className="text-[38px] font-semibold text-foreground">{m}월</p>
        <p className="text-[18px] font-medium text-foreground-subtle">{y}년</p>
      </div>

      <div className="grid grid-cols-7 gap-x-[40px] gap-y-[20px]">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`flex items-center justify-center px-[10px] py-[8px] text-[20px] font-semibold ${
              i === 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            {w}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const status = markers.get(day);
          const isToday = day === today;
          const bg = status ? STATUS_MARKER[status] : "";
          const ring = isToday ? "border-[3px] border-accent-project" : "";
          return (
            <div key={day} className="flex items-center justify-center py-[4px]">
              <span
                className={`flex size-[44px] items-center justify-center rounded-full text-[20px] font-semibold text-foreground ${bg} ${ring}`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
