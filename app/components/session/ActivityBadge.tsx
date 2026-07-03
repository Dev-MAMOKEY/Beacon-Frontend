export type ActivityCategory = "동아리" | "프로젝트" | "회의";

/** 카테고리별 배경·글자 색(테마 토큰 + 불투명도). Figma(169:502~504). */
const CATEGORY_STYLE: Record<ActivityCategory, string> = {
  동아리: "bg-primary/20 text-primary-hover",
  프로젝트: "bg-accent-project/20 text-accent-project",
  회의: "bg-accent-meeting/30 text-accent-meeting",
};

type Props = {
  category: ActivityCategory;
  className?: string;
};

/**
 * 세션 활동 분류 배지. 세션 카드·수정 모달에서 공용.
 * Figma: rounded-16, px-12 py-8, 16px SemiBold.
 */
export function ActivityBadge({ category, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[16px] px-[12px] py-[8px] text-[16px] font-semibold ${CATEGORY_STYLE[category]} ${className}`}
    >
      {category}
    </span>
  );
}
