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
 * Figma 대시보드(169:659): 제목 26px Bold(foreground-muted) + 세션 상태(primary-hover).
 * Figma 세션 관리(169:654): 제목 26px Bold(foreground-subtle), 세션 상태 없음.
 * 날짜는 38px SemiBold(foreground) 공통.
 */
export function PageHeading({
  title,
  date,
  sessionStatus,
  titleClassName = "text-foreground-muted",
}: Props) {
  return (
    <div className="flex w-full flex-col gap-[20px]">
      <h1 className={`text-[26px] font-bold ${titleClassName}`}>{title}</h1>
      <div className="flex flex-col gap-[10px] pl-[8px] pr-[7px] font-semibold">
        <p className="text-[38px] text-foreground">{date}</p>
        {sessionStatus && (
          <p className="text-[24px] text-primary-hover">{sessionStatus}</p>
        )}
      </div>
    </div>
  );
}
