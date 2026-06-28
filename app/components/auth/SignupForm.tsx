import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { TextField } from "~/components/ui/TextField";
import { ApiError, authApi } from "~/lib/api";

/**
 * 회원가입 폼. 학번·이름·비밀번호·비밀번호 확인 입력 + 회원가입 버튼 + 로그인 안내.
 * 제출 시 비밀번호 일치 검증 후 authApi.signup 호출 → 성공 시 로그인 화면으로 이동.
 * Figma(221:789).
 */
export function SignupForm() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const stdId = Number(studentId.trim());
    if (!studentId.trim() || Number.isNaN(stdId)) {
      setError("학번을 숫자로 입력해주세요.");
      return;
    }
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.signup({ stdId, password, name: name.trim() });
      navigate("/login");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-[34px]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[18px]">
        <TextField
          id="studentId"
          name="studentId"
          label="학번"
          placeholder="학번을 입력해주세요"
          inputMode="numeric"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={submitting}
        />
        <TextField
          id="name"
          name="name"
          label="이름"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
        <TextField
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 입력해주세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="text-[14px] font-medium text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-[16px] bg-border-subtle px-[80px] py-[18px] text-[18px] font-medium text-foreground-subtle transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "가입 중..." : "회원가입"}
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
