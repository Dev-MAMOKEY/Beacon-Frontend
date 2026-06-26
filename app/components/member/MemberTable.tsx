export type Member = {
  name: string;
  studentId: string;
  role: string;
  attendanceRate: string;
  attendanceCount: string;
};

type Props = {
  members: Member[];
  onExclude?: (member: Member) => void;
};

const HEADERS = ["이름", "학번", "역할", "출석률", "출석 횟수", "제외"];

/**
 * 멤버 목록 테이블.
 * Figma(199:1059): bg-surface, rounded-22, py-40. 6열 그리드(중앙 정렬).
 * 헤더(18px, foreground-subtle) + 구분선, 행은 짝/홀 교차 배경, 제외하기 버튼.
 */
export function MemberTable({ members, onExclude }: Props) {
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

      {members.map((m, i) => (
        <div
          key={m.studentId}
          className={`grid grid-cols-6 items-center py-[20px] text-[20px] font-semibold text-foreground-muted ${
            i % 2 === 0 ? "bg-[#f8f8f8]" : "bg-surface"
          }`}
        >
          <span className="text-center">{m.name}</span>
          <span className="text-center">{m.studentId}</span>
          <span className="text-center">{m.role}</span>
          <span className="text-center">{m.attendanceRate}</span>
          <span className="text-center">{m.attendanceCount}</span>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onExclude?.(m)}
              className="rounded-[16px] bg-primary-hover px-[16px] py-[4px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              제외하기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
