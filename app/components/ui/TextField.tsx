import {
  type ComponentType,
  type InputHTMLAttributes,
  type SVGProps,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  label: string;
  /** 필드 좌측 아이콘. currentColor를 상속한다. */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * 라벨이 붙은 공용 입력 필드. 로그인 폼 등에서 재사용.
 * Figma(409:2504): 라벨 20px SemiBold(foreground-subtle),
 * 필드 gray4 배경 rounded-10 px-30 py-18 gap-16, 좌측 아이콘 24px,
 * placeholder 18px Medium(input). 포커스 시 링으로 강조.
 * type=password면 우측에 표시/숨기기(눈 아이콘) 토글을 제공해 입력값을 확인할 수 있다.
 */
export function TextField({
  label,
  id,
  icon: Icon,
  className = "",
  type,
  ...inputProps
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (revealed ? "text" : "password") : type;

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
          type={inputType}
          className={`w-full flex-1 bg-transparent text-[18px] text-foreground placeholder:text-input focus:outline-none ${className}`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "비밀번호 숨기기" : "비밀번호 표시"}
            title={revealed ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="shrink-0 text-input transition-colors hover:text-foreground"
          >
            {revealed ? (
              <EyeOff className="size-[24px]" />
            ) : (
              <Eye className="size-[24px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
