import type { ClubMemberResponse } from "~/lib/api";

type Props = {
  members: ClubMemberResponse[];
  /** 본인 식별용 학번(자기 자신은 역할변경·제명 불가). */
  currentStdId?: string;
  /** 처리 중인 멤버 id(버튼 비활성). */
  busyMemberId?: number | null;
  /** 편집 모드: 역할 열이 역할변경 버튼으로 바뀐다. */
  editMode?: boolean;
  onChangeRole?: (member: ClubMemberResponse) => void;
  onRemove?: (member: ClubMemberResponse) => void;
};

const HEADERS = ["이름", "학번", "역할", "출석률", "출석 횟수", "제외"];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "관리자",
  MEMBER: "동아리원",
};

/**
 * 멤버 목록 테이블. Figma(356:1652).
 * 6열(이름·학번·역할·출석률·출석 횟수·제외) · 헤더 18px gray2 · 행 20px gray3, 교대 배경.
 * 제외하기(main pill) 상시. 편집 모드에서 역할 열이 역할변경 버튼으로 전환.
 * 출석 횟수는 백엔드 미제공(rate만) → "-"로 표시(추후 연동).
 */
export function MemberTable({
  members,
  currentStdId,
  busyMemberId,
  editMode = false,
  onChangeRole,
  onRemove,
}: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[22px] bg-surface py-[40px]">
      <div className="grid grid-cols-6 px-[30px]">
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
            className={`grid grid-cols-6 items-center px-[30px] py-[20px] text-[20px] font-semibold tracking-[0.25px] text-foreground-muted ${
              i % 2 === 0 ? "bg-surface" : "bg-surface-alt"
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

            <div className="flex justify-center">
              {editMode ? (
                <button
                  type="button"
                  onClick={() => onChangeRole?.(m)}
                  disabled={isSelf || busy}
                  className="rounded-[16px] bg-border-subtle px-[16px] py-[6px] text-[15px] font-semibold text-foreground-subtle transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {m.role === "ADMIN" ? "동아리원으로" : "관리자로"}
                </button>
              ) : (
                <span>{ROLE_LABEL[m.role ?? "MEMBER"] ?? m.role}</span>
              )}
            </div>

            <span className="text-center">
              {m.rate != null ? `${Math.round(m.rate)}%` : "-"}
            </span>
            <span className="text-center">-</span>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onRemove?.(m)}
                disabled={isSelf || busy}
                className="rounded-[16px] bg-primary-hover px-[16px] py-[6px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                제외하기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
