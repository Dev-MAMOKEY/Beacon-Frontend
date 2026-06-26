type Props = {
  label: string;
  value: string | number;
  /** 값 텍스트 색상 클래스 (예: "text-[#16a34a]"). 기본 foreground. */
  valueClassName?: string;
  /** 값 뒤에 붙는 단위 (예: "%"). */
  unit?: string;
};

/**
 * 대시보드 상단 요약 지표 카드.
 * Figma(142:333): bg-surface, rounded-20, pl-34 pr-50 py-24, gap-14.
 * 라벨 18px(foreground-muted) + 값 36px, 단위 23px.
 */
export function MetricCard({
  label,
  value,
  valueClassName = "text-foreground",
  unit,
}: Props) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-[14px] rounded-[20px] bg-surface py-[24px] pl-[34px] pr-[50px]">
      <p className="text-[18px] font-semibold text-foreground-muted">{label}</p>
      <div className={`flex items-center gap-[4px] font-semibold ${valueClassName}`}>
        <span className="text-[36px]">{value}</span>
        {unit && <span className="text-[23px]">{unit}</span>}
      </div>
    </div>
  );
}
