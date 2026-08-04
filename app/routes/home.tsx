import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { PageHeading } from "~/components/dashboard/PageHeading";
import { MetricCard } from "~/components/dashboard/MetricCard";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import {
  AttendanceFeed,
  type FeedEntry,
} from "~/components/dashboard/AttendanceFeed";
import { useActiveClub } from "~/hooks/use-active-club";
import { useClubMembers } from "~/hooks/use-club-members";
import { useClubStats } from "~/hooks/use-club-stats";
import { useClubSummary } from "~/hooks/use-club-summary";
import { useSessions } from "~/hooks/use-sessions";
import { useSessionAttendance } from "~/hooks/use-session-attendance";
import { useAttendanceStream } from "~/hooks/use-attendance-stream";
import type { AttendanceDto } from "~/lib/api";
import { toPercent } from "~/lib/stats";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mamoki Campus" },
    { name: "description", content: "The Academic Curator" },
  ];
}

type ApiStatus = NonNullable<AttendanceDto["attendanceStatus"]>;

/** 출석 상태 코드를 피드 라벨로 매핑. ETC는 피드에서 제외. */
const STATUS_KR: Partial<Record<ApiStatus, FeedEntry["status"]>> = {
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → "YYYY-MM-DD". */
function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 기본 기간: 최근 6개월(추이 차트용). */
function defaultRange() {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(end.getMonth() - 6);
  return { startDate: toDateInput(start), endDate: toDateInput(end) };
}

/** ISO date-time → "MM월 DD일". */
function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}월 ${pad(d.getDate())}일`;
}

/** ISO date-time → "오후 06:20". */
function fmtTime(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const { activeClubId } = useActiveClub();
  const { members } = useClubMembers();

  // 진행 중인 세션(피드·상태의 기준). 없으면 null.
  const { sessions: activeSessions } = useSessions("ACTIVE");
  const activeSession = activeSessions[0] ?? null;

  // 진행 중 세션의 출석 현황(피드용). SSE 이벤트 + 30초 폴링 폴백으로 갱신.
  const { rows, reload: reloadAttendance } = useSessionAttendance(
    activeClubId,
    activeSession?.sessionId ?? null,
  );

  // 대시보드 요약 지표(오늘 출석·지각·전체 멤버·평균 출석률).
  const { summary, reload: reloadSummary } = useClubSummary();

  // 실시간 출석 스트림(SSE) 수신 시 요약·출석 현황 재조회.
  useAttendanceStream(activeClubId, () => {
    reloadSummary();
    reloadAttendance();
  });

  // 추이 차트(최근 6개월 기준).
  const [range] = useState(defaultRange);
  const { trend } = useClubStats(range.startDate, range.endDate);

  const todayPresent = summary?.todayPresent ?? 0;
  const todayLate = summary?.todayLate ?? 0;
  const totalMembers = summary?.totalMembers ?? members.length;
  const avgRate = Math.round(toPercent(summary?.avgRate));

  const trendSeries = useMemo(
    () => [
      {
        label: "출석률",
        colorClassName: "bg-primary-hover",
        stroke: "var(--color-primary-hover)",
        points: trend.map((t) => toPercent(t.attendanceRate)),
      },
    ],
    [trend],
  );
  const trendLabels = useMemo(
    () =>
      trend.map((t) => {
        if (!t.date) return "";
        const [, mo, da] = t.date.split("-");
        return `${Number(mo)}/${Number(da)}`;
      }),
    [trend],
  );

  // 최신 체크인 순 피드. ETC 상태는 제외.
  const feed = useMemo<FeedEntry[]>(
    () =>
      [...rows]
        .filter((r) => r.attendanceStatus && STATUS_KR[r.attendanceStatus])
        .sort((a, b) => (b.checkedAt ?? "").localeCompare(a.checkedAt ?? ""))
        .map((r) => ({
          name: r.memberName ?? "-",
          date: fmtDate(r.checkedAt),
          status: STATUS_KR[r.attendanceStatus as ApiStatus]!,
          time: fmtTime(r.checkedAt),
        })),
    [rows],
  );
  const feedTop = feed.slice(0, 4);
  const moreCount = Math.max(0, feed.length - feedTop.length);

  const today = new Date();
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const sessionStatus = activeSession
    ? `진행 중: ${activeSession.sessionName ?? "세션"}`
    : "진행 중인 세션 없음";

  return (
    <main className="flex flex-1 flex-col gap-[32px] px-[30px] pb-[30px] pt-[16px]">
      <PageHeading
        title="대시 보드"
        date={dateLabel}
        sessionStatus={sessionStatus}
      />

      <div className="flex w-full gap-[30px]">
        <MetricCard
          label="오늘 출석 수"
          value={todayPresent}
          valueClassName="text-primary-hover"
        />
        <MetricCard
          label="오늘 지각 수"
          value={todayLate}
          valueClassName="text-warning"
        />
        <MetricCard label="전체 멤버 수" value={totalMembers} />
        <MetricCard
          label="평균 출석률"
          value={avgRate}
          unit="%"
          valueClassName="text-primary-hover"
        />
      </div>

      <div className="flex items-stretch gap-[34px]">
        <AttendanceChart
          title="기간별 출석률 추이"
          month=""
          weeks={trendLabels}
          series={trendSeries}
        />
        <AttendanceFeed entries={feedTop} moreCount={moreCount} />
      </div>
    </main>
  );
}
