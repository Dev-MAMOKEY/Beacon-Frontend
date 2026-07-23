import type { Session } from "~/lib/api";
import { formatAmPmTime, formatMonthDay } from "~/lib/datetime";

type SessionStatus = NonNullable<Session["status"]>;

/** 상태 배지 라벨/색(Figma 388:1842의 pill 스타일). */
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
};

/**
 * 세션 사이드 카드(조회 전용). 날짜·상태 배지 + 흰 카드(시간/이름).
 * 웹은 세션을 생성/수정하지 않고 조회만 하므로 액션 버튼이 없다.
 * Figma(388:1842): 헤더(날짜 20px + 배지), 카드 rounded-20 pt-20 px-26 pb-28.
 */
export function SessionCard({ session, className = "" }: Props) {
  const status: SessionStatus = session.status ?? "SCHEDULED";
  const badge = STATUS_BADGE[status];

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
    </div>
  );
}
