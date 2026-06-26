type Props = {
  /** 높은 순으로 정렬된 멤버 이름 목록. */
  ranking: string[];
  title?: string;
  sortLabel?: string;
  /** 강조(파란색)할 상위 순위 수. */
  topCount?: number;
};

/**
 * 멤버별 출석률 비교(순위) 차트.
 * Figma(186:1201): bg-surface, rounded-22, px-50 py-40, gap-45.
 * 상위 3명은 primary-hover 강조, 나머지는 foreground-muted.
 */
export function MemberRanking({
  ranking,
  title = "멤버별 출석률 비교 차트",
  sortLabel = "높은 순 정렬",
  topCount = 3,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-[45px] rounded-[22px] bg-surface px-[50px] py-[40px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold text-foreground-muted">
          {title}
        </h2>
        <span className="text-[16px] font-medium text-[#94a3b8]">
          {sortLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-[20px]">
        {ranking.map((name, i) => {
          const rank = i + 1;
          const isTop = rank <= topCount;
          return (
            <div
              key={name}
              className={`flex items-center gap-[8px] ${
                isTop
                  ? "font-semibold text-primary-hover"
                  : "font-medium text-foreground-muted"
              }`}
            >
              <span className={isTop ? "text-[22px]" : "text-[20px]"}>
                {rank}
              </span>
              <span className={isTop ? "text-[20px]" : "text-[18px]"}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
