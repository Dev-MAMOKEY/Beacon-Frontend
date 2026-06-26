type AttendanceStatus = "출석" | "지각" | "결석";

export type FeedEntry = {
  name: string;
  date: string;
  status: AttendanceStatus;
  time: string;
};

type Props = {
  entries: FeedEntry[];
  /** 더 있는 이벤트 수. 0이면 안내 문구 숨김. */
  moreCount?: number;
};

/** 상태별 강조 색상. Figma: 출석 #0fa245, 지각 #f4b000, 결석 destructive. */
const STATUS_COLOR: Record<AttendanceStatus, string> = {
  출석: "text-[#0fa245]",
  지각: "text-[#f4b000]",
  결석: "text-destructive",
};

/** 최신 항목일수록 진하고, 오래된 항목은 흐려진다. */
const OPACITY = ["opacity-100", "opacity-100", "opacity-70", "opacity-40"];

/**
 * 실시간 출석 피드.
 * Figma(147:324): 카드 bg-surface, rounded-20, pl-34 pr-50 py-22, gap-7.
 * 메시지(18px) + 시각(14px, foreground-subtle). 마지막에 추가 이벤트 안내.
 */
export function AttendanceFeed({ entries, moreCount = 0 }: Props) {
  return (
    <div className="flex h-full w-[330px] flex-col gap-[20px]">
      {entries.map((entry, i) => (
        <div
          key={`${entry.name}-${entry.time}-${i}`}
          className={`flex flex-col justify-center gap-[7px] rounded-[20px] bg-surface py-[22px] pl-[34px] pr-[50px] ${OPACITY[i] ?? "opacity-40"}`}
        >
          <p className="text-[18px] font-medium text-foreground">
            {`${entry.name} 님 ${entry.date} `}
            <span className={STATUS_COLOR[entry.status]}>{entry.status}</span>
            했습니다
          </p>
          <p className="text-[14px] font-medium text-foreground-subtle">
            {entry.time}
          </p>
        </div>
      ))}

      {moreCount > 0 && (
        <div className="flex flex-col justify-center rounded-[20px] bg-surface py-[22px] pl-[34px] pr-[50px]">
          <p className="text-[18px] font-medium text-foreground-subtle">
            {`${moreCount}개의 이벤트가 더 있습니다... `}
          </p>
        </div>
      )}
    </div>
  );
}
