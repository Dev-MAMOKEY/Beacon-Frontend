import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { TextField } from "~/components/ui/TextField";
import { IdCardIcon, LockIcon } from "./field-icons";
import { ApiError, authApi } from "~/lib/api";

/**
 * 로그인 폼. 학번·비밀번호 입력 + 비밀번호 찾기 링크 + 로그인 버튼 + 회원가입 안내.
 * 제출 시 authApi.login 호출 → 토큰 저장(레이어 내장) 후 대시보드로 이동.
 * Figma(221:1063).
 */
export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 모든 조건 충족 시 버튼 활성(파랑) 표시.
  const isValid =
    studentId.trim() !== "" &&
    !Number.isNaN(Number(studentId.trim())) &&
    password !== "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const stdId = studentId.trim();
    if (!stdId || Number.isNaN(Number(stdId))) {
      setError("학번을 숫자로 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.login({ stdId, password });
      navigate(searchParams.get("redirectTo") ?? "/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
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
          icon={IdCardIcon}
          inputMode="numeric"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={submitting}
        />
        <div className="flex flex-col gap-[18px]">
          <TextField
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            icon={LockIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Link
              to="/find-password"
              className="text-[16px] text-foreground-muted hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-[14px] font-medium text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full rounded-[20px] px-[80px] py-[16px] text-[18px] font-semibold transition-colors disabled:opacity-60 ${
          isValid
            ? "bg-primary-hover text-white hover:opacity-90"
            : "bg-border-subtle text-foreground-subtle"
        }`}
      >
        {submitting ? "로그인 중..." : "로그인"}
      </button>

      <div className="flex items-center justify-center gap-[10px]">
        <span className="text-[16px] text-foreground-subtle">아직 회원이 아니신가요?</span>
        <Link to="/signup" className="text-[16px] text-foreground underline">
          회원가입 시작하기
        </Link>
      </div>
    </form>
  );
}
