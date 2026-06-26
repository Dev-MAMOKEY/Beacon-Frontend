import { Link } from "react-router";
import { TextField } from "~/components/ui/TextField";

/**
 * 회원가입 폼. 학번·이름·비밀번호·비밀번호 확인 입력 + 회원가입 버튼 + 로그인 안내.
 * Figma(221:789).
 */
export function SignupForm() {
  return (
    <form className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[18px]">
        <TextField
          id="studentId"
          name="studentId"
          label="학번"
          placeholder="학번을 입력해주세요"
        />
        <TextField
          id="name"
          name="name"
          label="이름"
          placeholder="이름을 입력해주세요"
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
        />
        <TextField
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-[16px] bg-border-subtle px-[80px] py-[18px] text-[18px] font-medium text-foreground-subtle transition-opacity hover:opacity-90"
      >
        회원가입
      </button>

      <div className="flex items-center justify-center gap-[10px]">
        <span className="text-[16px] text-[#787878]">이미 계정이 있으신가요?</span>
        <Link to="/login" className="text-[16px] text-foreground underline">
          로그인하기
        </Link>
      </div>
    </form>
  );
}
