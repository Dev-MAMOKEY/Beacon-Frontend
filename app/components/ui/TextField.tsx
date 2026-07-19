import type { ComponentType, InputHTMLAttributes, SVGProps } from "react";

type Props = {
  label: string;
  /** 필드 좌측 아이콘. currentColor를 상속한다. */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * 라벨이 붙은 공용 입력 필드. 회원가입·로그인 폼에서 재사용.
 * Figma(409:2504): 라벨 20px SemiBold(foreground-subtle),
 * 필드 gray4 배경 rounded-10 px-30 py-18 gap-16, 좌측 아이콘 24px,
 * placeholder 18px Medium(input). 포커스 시 링으로 강조.
 */
export function TextField({
  label,
  id,
  icon: Icon,
  className = "",
  ...inputProps
}: Props) {
  return (
    <div className="flex w-full flex-col gap-[18px]">
      <label
        htmlFor={id}
        className="text-[20px] font-semibold tracking-[0.25px] text-foreground-subtle"
      >
        {label}
      </label>
      <div className="flex w-full items-center gap-[16px] rounded-[10px] bg-border-subtle px-[30px] py-[18px] focus-within:ring-2 focus-within:ring-primary">
        {Icon && <Icon className="size-[24px] shrink-0 text-input" />}
        <input
          id={id}
          className={`w-full flex-1 bg-transparent text-[18px] text-foreground placeholder:text-input focus:outline-none ${className}`}
          {...inputProps}
        />
      </div>
    </div>
  );
}
