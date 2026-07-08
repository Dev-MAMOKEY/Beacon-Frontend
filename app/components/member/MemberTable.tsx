import type { ClubMemberResponse } from "~/lib/api";

type Props = {
  members: ClubMemberResponse[];
  /** 본인 식별용 학번(자기 자신은 역할변경·제명 불가). */
  currentStdId?: string;
  /** 처리 중인 멤버 id(버튼 비활성). */
  busyMemberId?: number | null;
  onChangeRole?: (member: ClubMemberResponse) => void;
  onRemove?: (member: ClubMemberResponse) => void;
};

const HEADERS = ["이름", "학번", "역할", "출석률", "역할 변경", "제명"];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "관리자",
  MEMBER: "동아리원",
};

/**
 * 멤버 목록 테이블(§17-20 멤버 탭).
 * 이름·학번·역할·출석률 + 역할변경/제명. 본인 행은 액션 비활성 + "(나)" 표시.
 */
export function MemberTable({
  members,
  currentStdId,
  busyMemberId,
  onChangeRole,
  onRemove,
}: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[22px] bg-surface py-[40px]">
      <div className="grid grid-cols-6">
        {HEADERS.map((h) => (
          <div
            key={h}
            className="flex justify-center text-[18px] font-semibold text-foreground-subtle"
          >
            {h}
          </div>
        ))}
      </div>
      <div className="mt-[20px] h-px w-full bg-border-subtle" />

      {members.map((m, i) => {
        const isSelf = currentStdId != null && m.stdId === currentStdId;
        const busy = busyMemberId != null && busyMemberId === m.memberId;
        return (
          <div
            key={m.memberId ?? i}
            className={`grid grid-cols-6 items-center py-[20px] text-[20px] font-semibold text-foreground-muted ${
              i % 2 === 0 ? "bg-surface-alt" : "bg-surface"
            }`}
          >
            <span className="text-center">
              {m.name}
              {isSelf && (
                <span className="ml-[6px] text-[15px] text-foreground-subtle">
                  (나)
                </span>
              )}
            </span>
            <span className="text-center">{m.stdId}</span>
            <span className="text-center">
              {ROLE_LABEL[m.role ?? "MEMBER"] ?? m.role}
            </span>
            <span className="text-center">
              {m.rate != null ? `${Math.round(m.rate)}%` : "-"}
            </span>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onChangeRole?.(m)}
                disabled={isSelf || busy}
                className="rounded-[14px] bg-border-subtle px-[16px] py-[6px] text-[15px] font-semibold text-foreground-subtle transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {m.role === "ADMIN" ? "동아리원으로" : "관리자로"}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onRemove?.(m)}
                disabled={isSelf || busy}
                className="rounded-[14px] bg-border-subtle px-[16px] py-[6px] text-[15px] font-semibold text-destructive transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                제명
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
