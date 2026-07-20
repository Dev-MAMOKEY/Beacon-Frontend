import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  align?: "left" | "right";
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * 설정 페이지 공용 라벨 입력 필드.
 * Figma(356:2149): 라벨 18px SemiBold(foreground-subtle),
 * 인풋 채움형 gray4(border-subtle) rounded-10, placeholder input, 포커스 링.
 */
export function SettingsField({
  label,
  align = "left",
  className = "",
  ...inputProps
}: Props) {
  return (
    <div className="flex flex-col gap-[14px]">
      <label className="text-[18px] font-semibold text-foreground-subtle">
        {label}
      </label>
      <input
        className={`rounded-[10px] bg-border-subtle px-[20px] py-[14px] text-[18px] text-foreground placeholder:text-input focus:outline-none focus:ring-2 focus:ring-primary ${
          align === "right" ? "text-right" : ""
        } ${className}`}
        {...inputProps}
      />
    </div>
  );
}
