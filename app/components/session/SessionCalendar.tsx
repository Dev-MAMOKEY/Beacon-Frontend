import { ChevronDown } from "lucide-react";
import type { Session } from "~/lib/api";
import { toLocalYmd } from "~/lib/datetime";
import { CATEGORY_STYLE, type SessionCategory } from "./session-category";

type Props = {
  /** 표시할 세션들. expectStartAt 날짜에 카테고리별 마커를 찍는다. */
  sessions?: Session[];
  /** 표시 연도. 기본 오늘. */
  year?: number;
  /** 표시 월(1~12). 기본 오늘. */
  month?: number;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 카테고리 없는 세션의 기본 마커(보더 + 옅은 배경 틴트). */
const DEFAULT_MARKER = "border-2 border-primary-hover bg-background";

/**
 * 월간 세션 표시 달력.
 * Figma(384:1900): bg-surface, rounded-24, px-40 py-46, gap-34.
 * 헤더(월 28px + 연도 우측), 요일(일=빨강, 그 외 gray3),
 * 날짜는 rounded-20 셀 / 세션·오늘은 카테고리 색 보더+틴트로 강조.
 */
export function SessionCalendar({ sessions = [], year, month }: Props) {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  const today =
    now.getFullYear() === y && now.getMonth() + 1 === m
      ? now.getDate()
      : undefined;

  // 해당 월의 날짜 → 세션 카테고리 마커(카테고리 없으면 null).
  const markers = new Map<number, SessionCategory | null>();
  for (const s of sessions) {
    const ymd = toLocalYmd(s.expectStartAt);
    if (ymd && ymd.year === y && ymd.month === m) {
      markers.set(ymd.day, s.category ?? null);
    }
  }

  const firstWeekday = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex w-full flex-col gap-[34px] rounded-[24px] bg-surface px-[40px] py-[46px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <p className="text-[28px] font-semibold text-foreground-muted">
            {m}월
          </p>
          <ChevronDown className="size-[28px] text-foreground-muted" />
        </div>
        <p className="text-[18px] font-semibold text-foreground-subtle">{y}년</p>
      </div>

      <div className="grid grid-cols-7 gap-[10px]">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`flex items-center justify-center px-[10px] py-[8px] text-[20px] font-semibold tracking-[0.25px] ${
              i === 0 ? "text-[#ff5d5d]" : "text-foreground-muted"
            }`}
          >
            {w}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const hasSession = markers.has(day);
          const category = markers.get(day);
          const isToday = day === today;
          const marker = isToday
            ? DEFAULT_MARKER
            : hasSession
              ? category
                ? CATEGORY_STYLE[category].marker
                : DEFAULT_MARKER
              : "";
          return (
            <div key={day} className="flex items-center justify-center">
              <span
                className={`flex h-[44px] w-[44px] items-center justify-center rounded-[20px] text-[20px] font-semibold tracking-[0.25px] text-foreground-muted ${marker}`}
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
