import type { Session } from "~/lib/api";

export type SessionCategory = NonNullable<Session["category"]>;

/**
 * 세션 활동 카테고리 → 라벨·색 매핑. Figma(388-1842)의 카테고리 pill/달력 마커 색.
 * - badge: 카드 내 카테고리 pill(배경+글자색)
 * - marker: 달력 날짜 셀(보더 + 옅은 배경 틴트)
 */
export const CATEGORY_STYLE: Record<
  SessionCategory,
  { label: string; badge: string; marker: string }
> = {
  CLUB: {
    label: "동아리",
    badge: "bg-background text-primary-hover",
    marker: "border-2 border-primary-hover bg-background",
  },
  MEETING: {
    label: "회의",
    badge: "bg-[#ede6ff] text-[#6d45db]",
    marker: "border-2 border-[#6d45db] bg-[#ede6ff]",
  },
  PROJECT: {
    label: "프로젝트",
    badge: "bg-[#ffefe7] text-[#ff8243]",
    marker: "border-2 border-[#ff8243] bg-[#ffefe7]",
  },
};
