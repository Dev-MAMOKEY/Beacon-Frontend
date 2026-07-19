import type { Session } from "~/lib/api";
import { formatAmPmTime, formatMonthDay } from "~/lib/datetime";

type SessionStatus = NonNullable<Session["status"]>;

/** 상태 배지 라벨/색(Figma 388:1900의 pill 스타일). */
const STATUS_BADGE: Record<SessionStatus, { label: string; className: string }> =
  {
    SCHEDULED: {
      label: "예정",
      className: "bg-background text-primary-hover",
    },
    ACTIVE: { label: "진행 중", className: "bg-success/15 text-success" },
    ENDED: {
      label: "종료",
      className: "bg-surface-sunken text-foreground-subtle",
    },
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
 * 세션 사이드 카드. 날짜·상태 배지 · 흰 카드(시간/이름) · 상태별 액션.
 * Figma(355:3109): 헤더(날짜 20px + 배지), 카드 rounded-20 pt-20 px-26 pb-28,
 * 액션은 수정하기 아웃라인(main) 등 시안 버튼 언어를 따른다.
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
  const status: SessionStatus = session.status ?? "SCHEDULED";
  const badge = STATUS_BADGE[status];

  const btn =
    "flex-1 rounded-[16px] px-[16px] py-[12px] text-[16px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50";

  return (
    <div className={`flex w-[260px] flex-col gap-[16px] ${className}`}>
      <div className="flex items-center justify-between pl-[8px]">
        <span className="text-[20px] font-semibold tracking-[0.25px] text-foreground-muted">
          {formatMonthDay(session.expectStartAt)}
        </span>
        <span
          className={`rounded-[16px] px-[12px] py-[8px] text-[16px] font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex flex-col gap-[16px] rounded-[20px] bg-surface px-[26px] pb-[28px] pt-[20px]">
        <span className="text-[20px] font-semibold tracking-[0.25px] text-foreground-subtle">
          {formatAmPmTime(session.expectStartAt)}
        </span>
        <p className="text-[18px] font-semibold text-foreground-muted">
          {session.sessionName}
        </p>
      </div>

      <div className="flex gap-[10px]">
        {status === "SCHEDULED" && (
          <button
            type="button"
            onClick={onStart}
            disabled={busy}
            className={`${btn} bg-primary-hover text-white`}
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
            className={`${btn} border-2 border-primary-hover bg-background text-primary-hover`}
          >
            수정하기
          </button>
        )}
        {status !== "ACTIVE" && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className={`${btn} border-2 border-foreground-subtle text-foreground-subtle`}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
