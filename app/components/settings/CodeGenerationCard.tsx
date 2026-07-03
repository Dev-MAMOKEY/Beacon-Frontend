import { useEffect, useState } from "react";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, clubsApi } from "~/lib/api";

/**
 * 코드 생성(초대코드) 설정 카드.
 * 활성 동아리의 초대코드를 조회/발급/취소하고 클립보드로 복사한다.
 * Figma(188:731): bg-surface, rounded-20, px-50 py-40, flex-1, 내부 justify-between.
 */
export function CodeGenerationCard() {
  const { activeClubId } = useActiveClub();
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 활성 동아리의 현재 초대코드 조회(미발급이면 조용히 빈 상태).
  useEffect(() => {
    if (activeClubId === null) return;
    let active = true;
    clubsApi
      .getInviteCode(activeClubId)
      .then((res) => {
        if (active) setCode(res.inviteCode ?? null);
      })
      .catch(() => {
        if (active) setCode(null);
      });
    return () => {
      active = false;
    };
  }, [activeClubId]);

  async function handleIssue() {
    if (activeClubId === null) return;
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const res = await clubsApi.issueInviteCode(activeClubId);
      setCode(res.inviteCode ?? null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "코드 생성에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke() {
    if (activeClubId === null) return;
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      await clubsApi.revokeInviteCode(activeClubId);
      setCode(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "코드 취소에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setError("복사에 실패했습니다.");
    }
  }

  const cells = code ? code.split("") : ["", "", "", ""];
  const disabled = activeClubId === null || busy;

  return (
    <div className="flex flex-1 flex-col justify-between self-stretch rounded-[20px] bg-surface px-[50px] py-[40px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">코드 생성</h2>

      <div className="flex justify-between gap-[10px]">
        {cells.map((ch, i) => (
          <div
            key={i}
            className="flex size-[64px] items-center justify-center rounded-[10px] border-2 border-input text-[24px] font-bold text-foreground"
          >
            {ch}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-[14px] font-medium text-destructive">{error}</p>
      )}

      <div className="flex justify-end gap-[14px]">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!code || disabled}
          className="flex-1 rounded-[12px] bg-foreground-subtle px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {copied ? "복사됨" : "복사하기"}
        </button>
        <button
          type="button"
          onClick={handleIssue}
          disabled={disabled}
          className="flex-1 rounded-[12px] bg-primary-hover px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "처리 중..." : "다시 만들기"}
        </button>
        <button
          type="button"
          onClick={handleRevoke}
          disabled={!code || disabled}
          className="flex-1 rounded-[12px] bg-destructive px-[20px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </div>
  );
}
