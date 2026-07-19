import { X } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ApiError,
  type Session,
  type SessionCreateRequestDto,
  sessionsApi,
} from "~/lib/api";
import { isoToLocalInput, localInputToIso } from "~/lib/datetime";

type DayOfWeek = NonNullable<SessionCreateRequestDto["dayOfWeek"]>;

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "월" },
  { value: "TUESDAY", label: "화" },
  { value: "WEDNESDAY", label: "수" },
  { value: "THURSDAY", label: "목" },
  { value: "FRIDAY", label: "금" },
  { value: "SATURDAY", label: "토" },
  { value: "SUNDAY", label: "일" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  /** 활성 clubId. null이면 저장 불가. */
  clubId: number | null;
  /** 있으면 수정 모드(반복 옵션 없음). */
  session?: Session | null;
  /** 생성 시 반복 기본값(반복 세션 만들기 버튼). */
  repeatDefault?: boolean;
  /** 저장 성공 시(목록 갱신). */
  onSaved?: () => void;
};

/** 흰 카드 섹션. Figma(368:3332): rounded-20, pt-20 px-26 pb-24, 라벨 16px gray2. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-[12px] rounded-[20px] bg-surface px-[26px] pb-[24px] pt-[20px]">
      <p className="text-[16px] font-semibold text-foreground-subtle">{title}</p>
      {children}
    </div>
  );
}

// 채움형 입력(Figma: gray4 배경 rounded-10, 보더 없음, 포커스 링).
const inputCls =
  "rounded-[10px] bg-border-subtle px-[24px] py-[10px] text-[16px] text-foreground placeholder:text-input focus:outline-none focus:ring-2 focus:ring-primary";

/**
 * 세션 생성/수정 모달.
 * session이 있으면 수정(updateSession), 없으면 생성(createSession, 반복 지원).
 */
export function SessionEditModal({
  open,
  onClose,
  clubId,
  session = null,
  repeatDefault = false,
  onSaved,
}: Props) {
  const isEdit = session != null;
  const [sessionName, setSessionName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 열릴 때 초기화(수정=기존 값, 생성=빈 값 + 반복 기본).
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSessionName(session?.sessionName ?? "");
    setStart(isoToLocalInput(session?.expectStartAt));
    setEnd(isoToLocalInput(session?.expectEndAt));
    setIsRepeat(repeatDefault);
    setDayOfWeek("MONDAY");
    setRepeatEndDate("");
  }, [open, session, repeatDefault]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!sessionName.trim()) return setError("세션 이름을 입력해주세요.");
    const startIso = localInputToIso(start);
    const endIso = localInputToIso(end);
    if (!startIso || !endIso) return setError("시작·종료 시간을 입력해주세요.");
    if (new Date(startIso) >= new Date(endIso))
      return setError("종료 시간은 시작 시간 이후여야 합니다.");
    if (clubId === null) return setError("활성 동아리가 없습니다.");
    if (isEdit && session?.sessionId == null)
      return setError("세션 정보를 찾을 수 없습니다.");

    setSubmitting(true);
    try {
      if (isEdit && session?.sessionId != null) {
        await sessionsApi.updateSession(clubId, session.sessionId, {
          sessionName: sessionName.trim(),
          expectStartAt: startIso,
          expectEndAt: endIso,
        });
      } else {
        const body: SessionCreateRequestDto = {
          sessionName: sessionName.trim(),
          expectStartAt: startIso,
          expectEndAt: endIso,
        };
        if (isRepeat) {
          body.isRepeat = true;
          body.dayOfWeek = dayOfWeek;
          if (repeatEndDate) body.repeatEndDate = repeatEndDate;
        }
        await sessionsApi.createSession(clubId, body);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-[40px]"
      onClick={onClose}
      role="presentation"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-[700px] max-w-full flex-col gap-[14px] rounded-[22px] bg-surface-sunken px-[40px] py-[30px]"
        onClick={(e) => e.stopPropagation()}
        aria-label={isEdit ? "세션 수정" : "세션 생성"}
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[24px] font-semibold uppercase tracking-[0.5px] text-foreground-muted">
            {isEdit ? "세션 수정" : "세션 생성"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-full p-[8px] text-foreground-muted hover:bg-border-subtle"
          >
            <X className="size-[14px]" />
          </button>
        </div>

        <Section title="세션 이름">
          <input
            className={inputCls}
            placeholder="예: 3월 20일 정기모임"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            disabled={submitting}
          />
        </Section>

        <div className="flex w-full gap-[14px]">
          <Section title="시작">
            <input
              type="datetime-local"
              className={inputCls}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              disabled={submitting}
            />
          </Section>
          <Section title="종료">
            <input
              type="datetime-local"
              className={inputCls}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              disabled={submitting}
            />
          </Section>
        </div>

        {!isEdit && (
          <Section title="반복">
            <label className="flex items-center gap-[10px] text-[16px] font-medium text-foreground">
              <input
                type="checkbox"
                checked={isRepeat}
                onChange={(e) => setIsRepeat(e.target.checked)}
                disabled={submitting}
              />
              매주 반복
            </label>
            {isRepeat && (
              <div className="flex flex-wrap items-center gap-[12px]">
                <div className="flex gap-[10px]">
                  {DAYS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDayOfWeek(d.value)}
                      disabled={submitting}
                      className={`min-w-[44px] rounded-[10px] px-[14px] py-[10px] text-[15px] font-semibold transition-colors ${
                        dayOfWeek === d.value
                          ? "bg-primary-hover text-white"
                          : "bg-background text-foreground-subtle"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  aria-label="반복 종료일"
                  className={inputCls}
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                  disabled={submitting}
                />
              </div>
            )}
          </Section>
        )}

        {error && (
          <p className="text-[14px] font-medium text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[20px] bg-primary-hover px-[26px] py-[16px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "저장 중..." : isEdit ? "수정 완료" : "생성하기"}
        </button>
      </form>
    </div>
  );
}
