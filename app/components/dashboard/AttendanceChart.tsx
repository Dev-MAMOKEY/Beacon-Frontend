import { ChevronDown } from "lucide-react";

type Series = {
  label: string;
  /** 범례 색상 클래스 (예: "bg-success"). */
  colorClassName: string;
  /** 라인 색상 (SVG stroke). 테마 토큰 CSS 변수 사용. */
  stroke: string;
  /** 주차별 값 (0~100). */
  points: number[];
};

type Props = {
  title?: string;
  month?: string;
  weeks?: string[];
  series?: Series[];
};

const DEFAULT_WEEKS = ["1주차", "2주차", "3주차", "4주차"];

const DEFAULT_SERIES: Series[] = [
  {
    label: "출석",
    colorClassName: "bg-success",
    stroke: "var(--color-success)",
    points: [12, 18, 10, 16],
  },
  {
    label: "지각",
    colorClassName: "bg-warning",
    stroke: "var(--color-warning)",
    points: [8, 10, 9, 14],
  },
  {
    label: "결석",
    colorClassName: "bg-destructive",
    stroke: "var(--color-destructive)",
    points: [6, 5, 7, 4],
  },
  {
    label: "기타",
    colorClassName: "bg-status-other",
    stroke: "var(--color-status-other)",
    points: [3, 4, 3, 5],
  },
];

const VIEW_W = 628;
const VIEW_H = 240;

/** points(0~100)를 viewBox 좌표 polyline 문자열로 변환. */
function toPolyline(points: number[]) {
  const stepX = points.length > 1 ? VIEW_W / (points.length - 1) : 0;
  return points
    .map((p, i) => `${i * stepX},${VIEW_H - (p / 100) * VIEW_H}`)
    .join(" ");
}

/**
 * 기간별 출석률 추이 라인 차트 카드.
 * Figma(201:1488): bg-surface, rounded-22, px-50 py-40, gap-40.
 * 헤더(제목 22px + 월 선택) · 그리드/라인 · 주차 라벨 · 범례.
 */
export function AttendanceChart({
  title = "기간별 출석률 추이 라인 차트",
  month = "5월",
  weeks = DEFAULT_WEEKS,
  series = DEFAULT_SERIES,
}: Props) {
  return (
    <div className="flex h-full flex-1 flex-col gap-[40px] rounded-[22px] bg-surface px-[50px] py-[40px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-foreground-muted">
          {title}
        </h2>
        <button
          type="button"
          className="flex items-center gap-[10px] text-[18px] font-medium text-foreground-subtle"
        >
          {month}
          <ChevronDown className="size-[14px]" />
        </button>
      </div>

      <div className="flex flex-col gap-[30px]">
        <div className="relative h-[260px] w-full">
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-px w-full bg-border-subtle" />
            ))}
          </div>
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {series.map((s) => (
              <polyline
                key={s.label}
                points={toPolyline(s.points)}
                fill="none"
                style={{ stroke: s.stroke }}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <div className="flex w-full justify-between px-[8px] text-[16px] font-semibold text-foreground-subtle">
          {weeks.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-[48px]">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-[14px]">
            <span className={`size-[18px] ${s.colorClassName}`} />
            <span className="text-[18px] font-medium text-foreground-subtle">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
