import { Link } from "react-router";
import { TextField } from "~/components/ui/TextField";

/**
 * 로그인 폼. 학번·비밀번호 입력 + 비밀번호 찾기 링크 + 로그인 버튼 + 회원가입 안내.
 * Figma(221:1063).
 */
export function LoginForm() {
  return (
    <form className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[18px]">
        <TextField
          id="studentId"
          name="studentId"
          label="학번"
          placeholder="학번을 입력해주세요"
        />
        <div className="flex flex-col gap-[18px]">
          <TextField
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
          />
          <div className="flex justify-end">
            <Link
              to="/find-password"
              className="text-[16px] text-[#787878] hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-[16px] bg-border-subtle px-[80px] py-[18px] text-[18px] font-medium text-foreground-subtle transition-opacity hover:opacity-90"
      >
        로그인
      </button>

      <div className="flex items-center justify-center gap-[10px]">
        <span className="text-[16px] text-[#787878]">아직 회원이 아니신가요?</span>
        <Link
          to="/signup"
          className="text-[16px] text-foreground underline"
        >
          회원가입 시작하기
        </Link>
      </div>
    </form>
  );
}
