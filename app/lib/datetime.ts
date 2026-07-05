/**
 * 날짜/시간 표시 유틸. 서버는 UTC ISO로 주고, 브라우저 로컬(KST)로 변환해 표시한다.
 */

/** ISO → "5월 14일". */
export function formatMonthDay(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** ISO → "PM 03:00" (12시간제). */
export function formatAmPmTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** ISO의 로컬 연/월/일. 캘린더 매칭용. null 반환 시 무효. */
export function toLocalYmd(
  iso?: string,
): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}
