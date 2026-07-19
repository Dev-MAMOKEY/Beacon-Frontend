type Props = {
  title: string;
  date: string;
  /** 날짜 아래 세션 상태 줄. 생략 시 표시하지 않음(예: 세션 관리 페이지). */
  sessionStatus?: string;
  /** 제목 색상 클래스. 대시보드=foreground-muted, 세션 관리=foreground-subtle. */
  titleClassName?: string;
};

/**
 * 페이지 상단 페이지명 + 날짜 (+ 선택적 세션 상태).
 * Figma(355:2151 / 388:1859): 제목 24px SemiBold(foreground-subtle, 대문자 트래킹 0.5),
 * 날짜 38px Bold(foreground-muted), 세션 상태 24px SemiBold(primary-hover, 대문자 트래킹 0.5).
 */
export function PageHeading({
  title,
  date,
  sessionStatus,
  titleClassName = "text-foreground-subtle",
}: Props) {
  return (
    <div className="flex w-full flex-col gap-[20px]">
      <h1
        className={`text-[24px] font-semibold uppercase tracking-[0.5px] ${titleClassName}`}
      >
        {title}
      </h1>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[38px] font-bold text-foreground-muted">{date}</p>
        {sessionStatus && (
          <p className="text-[24px] font-semibold uppercase tracking-[0.5px] text-primary-hover">
            {sessionStatus}
          </p>
        )}
      </div>
    </div>
  );
}
