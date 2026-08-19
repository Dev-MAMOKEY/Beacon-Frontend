import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  align?: "left" | "center" | "right";
  /** 인풋 패딩. 시안마다 달라서(동아리 정보 px-20/py-14, 비콘 px-10·px-30/py-12) 열어둔다. */
  padding?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/**
 * 설정 페이지 공용 라벨 입력 필드.
 * Figma(356:2149): 라벨 18px SemiBold(foreground-subtle),
 * 인풋 채움형 gray4(border-subtle) rounded-10, placeholder input, 포커스 링.
 */
export function SettingsField({
  label,
  align = "left",
  padding = "px-[20px] py-[14px]",
  className = "",
  ...inputProps
}: Props) {
  return (
    <div className="flex flex-col gap-[14px]">
      <label className="text-[18px] font-semibold text-foreground-subtle">
        {label}
      </label>
      <input
        className={`rounded-[10px] bg-border-subtle text-[18px] text-foreground placeholder:text-input focus:outline-none focus:ring-2 focus:ring-primary ${padding} ${ALIGN_CLASS[align]} ${className}`}
        {...inputProps}
      />
    </div>
  );
}
