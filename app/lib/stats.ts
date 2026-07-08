/**
 * 출석률 값을 0~100 퍼센트로 정규화한다.
 * 백엔드가 0~1 비율 또는 0~100 중 무엇으로 주든 대응(스케일 미확정 대비).
 */
export function toPercent(rate?: number): number {
  if (rate == null || Number.isNaN(rate)) return 0;
  return rate <= 1 ? rate * 100 : rate;
}
