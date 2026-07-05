import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/attendance";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { MetricCard } from "~/components/dashboard/MetricCard";
import { AttendanceTable } from "~/components/attendance/AttendanceTable";
import { AttendanceStatusModal } from "~/components/attendance/AttendanceStatusModal";
import { SearchInput } from "~/components/ui/SearchInput";
import { useActiveClub } from "~/hooks/use-active-club";
import { useSessions } from "~/hooks/use-sessions";
import { useSessionAttendance } from "~/hooks/use-session-attendance";
import type { AttendanceDto } from "~/lib/api";
import {
  ATTENDANCE_STATUSES,
  type AttendanceStatusCode,
  STATUS_LABEL,
} from "~/lib/attendance";
import { formatMonthDay } from "~/lib/datetime";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "출석 현황 · Mamoki Campus" },
    { name: "description", content: "Beacon 출석 현황" },
  ];
}

type StatusFilter = "ALL" | AttendanceStatusCode;

export default function Attendance() {
  const { activeClubId } = useActiveClub();
  const { sessions } = useSessions();
  const [sessionId, setSessionId] = useState<number | null>(null);

  // 기본 세션: ACTIVE 우선, 없으면 첫 항목. 현재 선택이 유효하면 유지.
  useEffect(() => {
    if (sessions.length === 0) {
      setSessionId(null);
      return;
    }
    setSessionId((cur) => {
      if (cur !== null && sessions.some((s) => s.id === cur)) return cur;
      const active = sessions.find((s) => s.sessionStatus === "ACTIVE");
      return active?.id ?? sessions[0].id ?? null;
    });
  }, [sessions]);

  const { rows, loading, error, reload } = useSessionAttendance(
    activeClubId,
    sessionId,
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AttendanceDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<AttendanceStatusCode, number> = {
      PRESENT: 0,
      LATE: 0,
      ABSENT: 0,
      ETC: 0,
    };
    for (const r of rows) if (r.attendanceStatus) c[r.attendanceStatus]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "ALL" && r.attendanceStatus !== statusFilter)
        return false;
      if (q) {
        const name = (r.memberName ?? "").toLowerCase();
        const std = String(r.stdId ?? "");
        if (!name.includes(q) && !std.includes(q)) return false;
      }
      return true;
    });
  }, [rows, statusFilter, search]);

  function openChange(record: AttendanceDto) {
    setTarget(record);
    setModalOpen(true);
  }

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-[30px] p-[30px]">
          <div className="flex items-center justify-between">
            <h1 className="pl-[8px] text-[26px] font-bold text-foreground-subtle">
              출석 현황
            </h1>
            <select
              value={sessionId ?? ""}
              onChange={(e) =>
                setSessionId(e.target.value ? Number(e.target.value) : null)
              }
              className="rounded-[12px] border-2 border-input bg-surface px-[16px] py-[10px] text-[16px] font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              {sessions.length === 0 && <option value="">세션 없음</option>}
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatMonthDay(s.expectStartAt)} · {s.sessionName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full gap-[30px]">
            <MetricCard
              label="출석"
              value={counts.PRESENT}
              valueClassName="text-success"
            />
            <MetricCard
              label="지각"
              value={counts.LATE}
              valueClassName="text-warning"
            />
            <MetricCard
              label="결석"
              value={counts.ABSENT}
              valueClassName="text-destructive"
            />
            <MetricCard
              label="기타 수"
              value={counts.ETC}
              valueClassName="text-foreground-subtle"
            />
          </div>

          <div className="flex items-center justify-between gap-[16px]">
            <div className="flex gap-[8px]">
              {(["ALL", ...ATTENDANCE_STATUSES] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-[12px] px-[16px] py-[8px] text-[15px] font-semibold transition-colors ${
                    statusFilter === f
                      ? "bg-primary text-white"
                      : "bg-border-subtle text-foreground-subtle"
                  }`}
                >
                  {f === "ALL" ? "전체" : STATUS_LABEL[f]}
                </button>
              ))}
            </div>
            <SearchInput
              placeholder="이름·학번 검색"
              value={search}
              onChange={setSearch}
            />
          </div>

          {error && (
            <p className="text-[15px] font-medium text-destructive">{error}</p>
          )}
          {loading && rows.length === 0 && (
            <p className="text-[15px] font-medium text-foreground-subtle">
              불러오는 중...
            </p>
          )}
          {!loading && sessionId !== null && rows.length === 0 && !error && (
            <p className="text-[15px] font-medium text-foreground-subtle">
              출석 기록이 없습니다.
            </p>
          )}

          {filtered.length > 0 && (
            <AttendanceTable rows={filtered} onChangeStatus={openChange} />
          )}
        </main>
      </div>

      <AttendanceStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={target}
        clubId={activeClubId}
        sessionId={sessionId}
        onSaved={reload}
      />
    </div>
  );
}
