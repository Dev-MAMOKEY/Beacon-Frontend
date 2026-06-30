import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  align?: "left" | "right";
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * 설정 페이지 공용 라벨 입력 필드.
 * Figma: 라벨 18px SemiBold(foreground-subtle),
 * 인풋 border-2(input) rounded-10, placeholder input.
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
        className={`rounded-[10px] border-2 border-input bg-transparent px-[20px] py-[12px] text-[18px] text-foreground placeholder:text-input focus:border-primary focus:outline-none ${
          align === "right" ? "text-right" : ""
        } ${className}`}
        {...inputProps}
      />
    </div>
  );
}
