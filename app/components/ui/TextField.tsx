import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * 라벨이 붙은 공용 입력 필드. 회원가입·로그인 폼에서 재사용.
 * Figma(221:823): 라벨 20px SemiBold(foreground-subtle),
 * 인풋 h-57 rounded-10 border-2(border-subtle) px-20 18px, placeholder #c1c6d6.
 */
export function TextField({ label, id, className = "", ...inputProps }: Props) {
  return (
    <div className="flex w-full flex-col gap-[18px]">
      <label
        htmlFor={id}
        className="text-[20px] font-semibold text-foreground-subtle"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-[57px] w-full rounded-[10px] border-2 border-border-subtle bg-surface px-5 text-[18px] text-foreground placeholder:text-[#c1c6d6] focus:border-primary focus:outline-none ${className}`}
        {...inputProps}
      />
    </div>
  );
}
