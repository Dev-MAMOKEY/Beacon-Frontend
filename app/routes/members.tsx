import { useMemo, useState } from "react";
import type { Route } from "./+types/members";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import { MemberTable } from "~/components/member/MemberTable";
import { StatusDonutChart } from "~/components/member/StatusDonutChart";
import { MemberRanking } from "~/components/member/MemberRanking";
import { SearchInput } from "~/components/ui/SearchInput";
import { useActiveClub } from "~/hooks/use-active-club";
import { useClubMembers } from "~/hooks/use-club-members";
import { useMyProfile } from "~/hooks/use-my-profile";
import { ApiError, type ClubMemberResponse, membersApi } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "멤버/통계 · Mamoki Campus" },
    { name: "description", content: "Beacon 멤버/통계" },
  ];
}

// 통계 탭은 목업 유지(#40에서 연동).
const RANKING = ["김민준", "이신한", "정세모", "홍길동", "박신한", "강네모"];

const TABS = ["멤버", "통계"] as const;
type Tab = (typeof TABS)[number];

export default function Members() {
  const [tab, setTab] = useState<Tab>("멤버");
  const { activeClubId } = useActiveClub();
  const { profile } = useMyProfile();
  const { members, loading, error, reload } = useClubMembers();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const currentStdId = profile?.stdId;
  const selfMemberId = useMemo(
    () => members.find((m) => m.stdId === currentStdId)?.memberId,
    [members, currentStdId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.name ?? "").toLowerCase().includes(q) ||
        String(m.stdId ?? "").includes(q),
    );
  }, [members, search]);

  async function runAction(
    memberId: number,
    fn: (clubId: number) => Promise<unknown>,
    confirmMsg: string,
  ) {
    if (activeClubId === null) return;
    if (!window.confirm(confirmMsg)) return;
    setBusyId(memberId);
    setActionError(null);
    try {
      await fn(activeClubId);
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "작업에 실패했습니다.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function handleChangeRole(m: ClubMemberResponse) {
    if (m.memberId == null) return;
    const newRole = m.role === "ADMIN" ? "MEMBER" : "ADMIN";
    const label = newRole === "ADMIN" ? "관리자" : "동아리원";
    runAction(
      m.memberId,
      (clubId) =>
        membersApi.updateMemberRole(clubId, m.memberId!, {
          clubId,
          requesterId: selfMemberId,
          targetMemberId: m.memberId,
          newRole,
        }),
      `${m.name} 님의 역할을 ${label}(으)로 변경할까요?`,
    );
  }

  function handleRemove(m: ClubMemberResponse) {
    if (m.memberId == null) return;
    runAction(
      m.memberId,
      (clubId) => membersApi.removeMember(clubId, m.memberId!),
      `${m.name} 님을 제명할까요? 제명된 멤버는 동아리 접근이 차단됩니다.`,
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-[30px] p-[30px]">
          <div className="flex w-full gap-[30px] pl-[8px]">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`pb-[4px] text-[24px] font-bold ${
                  tab === t
                    ? "border-b-[3px] border-primary-hover text-primary-hover"
                    : "text-foreground-subtle"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "멤버" ? (
            <>
              <div className="flex w-full items-center justify-end gap-[16px] pr-[8px]">
                <SearchInput
                  placeholder="이름·학번 검색"
                  value={search}
                  onChange={setSearch}
                />
              </div>

              {error && (
                <p className="text-[15px] font-medium text-destructive">
                  {error}
                </p>
              )}
              {actionError && (
                <p className="text-[15px] font-medium text-destructive">
                  {actionError}
                </p>
              )}
              {loading && members.length === 0 && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  불러오는 중...
                </p>
              )}
              {!loading && !error && members.length === 0 && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  멤버가 없습니다.
                </p>
              )}

              {filtered.length > 0 && (
                <MemberTable
                  members={filtered}
                  currentStdId={currentStdId}
                  busyMemberId={busyId}
                  onChangeRole={handleChangeRole}
                  onRemove={handleRemove}
                />
              )}
            </>
          ) : (
            <div className="flex w-full flex-col gap-[30px]">
              <div className="flex items-stretch gap-[30px]">
                <AttendanceChart />
                <div className="flex w-[360px] shrink-0">
                  <StatusDonutChart />
                </div>
              </div>
              <div className="flex items-stretch gap-[30px]">
                <div className="flex min-w-0 flex-1">
                  <MemberRanking ranking={RANKING} />
                </div>
                <div className="flex w-[300px] shrink-0 flex-col justify-center gap-[24px]">
                  <button
                    type="button"
                    className="w-full rounded-[20px] bg-surface px-[80px] py-[20px] text-[18px] font-semibold text-primary-hover transition-opacity hover:opacity-90"
                  >
                    CSV 내보내기
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-[20px] bg-primary px-[80px] py-[20px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Excel 내보내기
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
