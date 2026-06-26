type Segment = {
  label: string;
  /** 세그먼트 색상 (SVG stroke). */
  color: string;
  value: number;
};

type Props = {
  title?: string;
  segments?: Segment[];
};

/** Figma(186:1235~): 출석 #0fa245, 지각 #fbbf24, 결석 #ba1a1a, 기타 #dae2fd. */
const DEFAULT_SEGMENTS: Segment[] = [
  { label: "출석", color: "#0fa245", value: 80 },
  { label: "지각", color: "#fbbf24", value: 8 },
  { label: "결석", color: "#ba1a1a", value: 6 },
  { label: "기타", color: "#dae2fd", value: 6 },
];

const R = 80;
const STROKE = 30;
const C = 2 * Math.PI * R;

/**
 * 전체 상태 분포 도넛 차트.
 * Figma(186:1221): bg-surface, rounded-22, px-50 py-40.
 * 제목 · 도넛(size-210) · 2×2 범례.
 */
export function StatusDonutChart({
  title = "전체 상태 분포 차트",
  segments = DEFAULT_SEGMENTS,
}: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-[40px] rounded-[22px] bg-surface px-[50px] py-[40px]">
      <h2 className="w-full text-[22px] font-semibold text-foreground-muted">
        {title}
      </h2>

      <svg viewBox="0 0 210 210" className="size-[210px]" aria-hidden="true">
        <g transform="rotate(-90 105 105)">
          {segments.map((s) => {
            const dash = (s.value / total) * C;
            const circle = (
              <circle
                key={s.label}
                cx={105}
                cy={105}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
      </svg>

      <div className="flex w-full flex-col gap-[22px]">
        <div className="grid grid-cols-2 gap-[22px]">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-[14px]">
              <span
                className="size-[18px] shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[18px] font-medium text-foreground-subtle">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
