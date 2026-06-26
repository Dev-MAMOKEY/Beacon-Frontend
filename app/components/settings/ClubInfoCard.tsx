import { SettingsField } from "./SettingsField";

/**
 * 동아리 정보 설정 카드.
 * Figma(188:751): bg-surface, rounded-20, px-50 py-40, gap-30.
 * 제목(22px Bold) + 동아리명 / 설명 입력.
 */
export function ClubInfoCard() {
  return (
    <div className="flex shrink-0 flex-col gap-[30px] rounded-[20px] bg-surface px-[50px] py-[40px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">동아리 정보</h2>
      <SettingsField
        label="동아리명"
        placeholder="동아리명을 입력해주세요"
        className="w-[530px]"
      />
      <SettingsField
        label="설명"
        placeholder="동아리에 대한 설명을 입력해주세요"
        className="w-[530px]"
      />
    </div>
  );
}
