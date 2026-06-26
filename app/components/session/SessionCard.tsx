import { ActivityBadge, type ActivityCategory } from "./ActivityBadge";

export type Session = {
  date: string;
  time: string;
  category: ActivityCategory;
  title: string;
  location: string;
  isToday?: boolean;
};

type Props = Session & {
  onEdit?: () => void;
  className?: string;
};

/**
 * 세션 사이드 카드. 날짜 헤더(+오늘 배지) · 시간/배지 · 제목/장소 · 수정하기 버튼.
 * Figma(169:536).
 */
export function SessionCard({
  date,
  time,
  category,
  title,
  location,
  isToday = false,
  onEdit,
  className = "",
}: Props) {
  return (
    <div className={`flex w-full flex-col gap-[16px] ${className}`}>
      <div className="flex items-center justify-between">
        <span className="pl-[8px] text-[22px] font-semibold text-foreground">
          {date}
        </span>
        {isToday && (
          <span className="px-[12px] text-[18px] font-semibold text-foreground-subtle">
            오늘
          </span>
        )}
      </div>

      <div className="flex flex-col gap-[16px] rounded-[20px] bg-surface px-[26px] pb-[28px] pt-[20px]">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-semibold text-[#727785]">{time}</span>
          <ActivityBadge category={category} />
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[18px] font-semibold text-foreground">{title}</p>
          <p className="text-[16px] font-medium text-[#8b909f]">{location}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="w-full rounded-[16px] bg-border-subtle px-[26px] py-[12px] text-[16px] font-medium text-foreground-subtle transition-opacity hover:opacity-90"
      >
        수정하기
      </button>
    </div>
  );
}
