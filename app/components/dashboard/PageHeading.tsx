type Props = {
  title: string;
  date: string;
  sessionStatus: string;
};

/**
 * 대시보드 상단 페이지명 + 날짜 + 세션 상태.
 * Figma(169:659): 제목 26px Bold(foreground-muted),
 * 날짜 38px SemiBold(foreground), 세션 상태 24px SemiBold(primary-hover).
 */
export function PageHeading({ title, date, sessionStatus }: Props) {
  return (
    <div className="flex w-full flex-col gap-[20px]">
      <h1 className="text-[26px] font-bold text-foreground-muted">{title}</h1>
      <div className="flex flex-col gap-[10px] pl-[8px] pr-[7px] font-semibold">
        <p className="text-[38px] text-foreground">{date}</p>
        <p className="text-[24px] text-primary-hover">{sessionStatus}</p>
      </div>
    </div>
  );
}
