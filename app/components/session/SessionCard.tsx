import type { Session } from "~/lib/api";
import { formatAmPmTime, formatMonthDay } from "~/lib/datetime";

type SessionStatus = NonNullable<Session["sessionStatus"]>;

/** 상태 배지 라벨/색(테마 토큰). */
const STATUS_BADGE: Record<SessionStatus, { label: string; className: string }> =
  {
    SCHEDULED: {
      label: "예정",
      className: "bg-border-subtle text-foreground-subtle",
    },
    ACTIVE: { label: "진행 중", className: "bg-success/20 text-success" },
    ENDED: { label: "종료", className: "bg-destructive/15 text-destructive" },
  };

type Props = {
  session: Session;
  className?: string;
  busy?: boolean;
  onEdit?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onDelete?: () => void;
};

/**
 * 세션 사이드 카드. 날짜 · 상태 배지 · 시간/이름 · 상태별 액션.
 * SCHEDULED: 시작/수정/삭제, ACTIVE: 종료/수정, ENDED: 삭제.
 */
export function SessionCard({
  session,
  className = "",
  busy = false,
  onEdit,
  onStart,
  onEnd,
  onDelete,
}: Props) {
  const status: SessionStatus = session.sessionStatus ?? "SCHEDULED";
  const badge = STATUS_BADGE[status];

  const btn =
    "flex-1 rounded-[14px] px-[16px] py-[10px] text-[15px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50";

  return (
    <div className={`flex w-full flex-col gap-[16px] ${className}`}>
      <div className="flex items-center justify-between pl-[8px]">
        <span className="text-[22px] font-semibold text-foreground">
          {formatMonthDay(session.expectStartAt)}
        </span>
        <span
          className={`rounded-[16px] px-[12px] py-[6px] text-[15px] font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex flex-col gap-[10px] rounded-[20px] bg-surface px-[26px] pb-[24px] pt-[20px]">
        <span className="text-[20px] font-semibold text-foreground-subtle">
          {formatAmPmTime(session.expectStartAt)}
        </span>
        <p className="text-[18px] font-semibold text-foreground">
          {session.sessionName}
        </p>
      </div>

      <div className="flex gap-[10px]">
        {status === "SCHEDULED" && (
          <button
            type="button"
            onClick={onStart}
            disabled={busy}
            className={`${btn} bg-primary text-white`}
          >
            시작
          </button>
        )}
        {status === "ACTIVE" && (
          <button
            type="button"
            onClick={onEnd}
            disabled={busy}
            className={`${btn} bg-destructive text-white`}
          >
            종료
          </button>
        )}
        {status !== "ENDED" && (
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            className={`${btn} bg-border-subtle text-foreground-subtle`}
          >
            수정
          </button>
        )}
        {status !== "ACTIVE" && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className={`${btn} bg-border-subtle text-destructive`}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
