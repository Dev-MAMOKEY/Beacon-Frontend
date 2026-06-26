/**
 * 코드 생성 설정 카드.
 * Figma(188:731): bg-surface, rounded-20, px-50 py-40, flex-1, 내부 justify-between.
 * 제목(22px Bold) + 코드 4칸 + 복사하기/다시 만들기/취소 버튼.
 */
export function CodeGenerationCard() {
  return (
    <div className="flex flex-1 flex-col justify-between self-stretch rounded-[20px] bg-surface px-[50px] py-[40px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">코드 생성</h2>

      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="size-[64px] rounded-[10px] border-2 border-[#c1c6d6]"
          />
        ))}
      </div>

      <div className="flex justify-end gap-[14px]">
        <button
          type="button"
          className="flex-1 rounded-[12px] bg-foreground-subtle px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          복사하기
        </button>
        <button
          type="button"
          className="flex-1 rounded-[12px] bg-primary-hover px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          다시 만들기
        </button>
        <button
          type="button"
          className="flex-1 rounded-[12px] bg-destructive px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          취소
        </button>
      </div>
    </div>
  );
}
