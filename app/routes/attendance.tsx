import type { Route } from "./+types/attendance";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { MetricCard } from "~/components/dashboard/MetricCard";
import {
  AttendanceTable,
  type AttendanceRow,
} from "~/components/attendance/AttendanceTable";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "출석 현황 · Mamoki Campus" },
    { name: "description", content: "Beacon 출석 현황" },
  ];
}

const ROWS: AttendanceRow[] = [
  {
    name: "강네모",
    studentId: "20251149",
    status: "출석",
    checkInTime: "6:20",
    handling: "자동",
    reason: "-",
    statusChanged: "X",
  },
  {
    name: "김민준",
    studentId: "20250916",
    status: "출석",
    checkInTime: "6:20",
    handling: "자동",
    reason: "-",
    statusChanged: "X",
  },
  {
    name: "김별",
    studentId: "20241410",
    status: "출석",
    checkInTime: "6:20",
    handling: "자동",
    reason: "-",
    statusChanged: "X",
  },
  {
    name: "박신한",
    studentId: "20220245",
    status: "결석",
    checkInTime: "-",
    handling: "수동",
    reason: "-",
    statusChanged: "O",
  },
  {
    name: "이신한",
    studentId: "20240112",
    status: "출석",
    checkInTime: "6:20",
    handling: "자동",
    reason: "-",
    statusChanged: "X",
  },
  {
    name: "정세모",
    studentId: "20260808",
    status: "출석",
    checkInTime: "6:20",
    handling: "자동",
    reason: "-",
    statusChanged: "X",
  },
  {
    name: "홍길동",
    studentId: "20230711",
    status: "지각",
    checkInTime: "6:40",
    handling: "수동",
    reason: "-",
    statusChanged: "O",
  },
];

export default function Attendance() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-[30px] p-[30px]">
          <h1 className="pl-[8px] text-[26px] font-bold text-foreground-subtle">
            출석 현황
          </h1>

          <div className="flex w-full gap-[30px]">
            <MetricCard
              label="출석"
              value={5}
              valueClassName="text-[#16a34a]"
            />
            <MetricCard
              label="지각"
              value={1}
              valueClassName="text-[#fbbf24]"
            />
            <MetricCard
              label="결석"
              value={1}
              valueClassName="text-destructive"
            />
            <MetricCard
              label="기타 수"
              value={0}
              valueClassName="text-foreground-subtle"
            />
          </div>

          <AttendanceTable rows={ROWS} />
        </main>
      </div>
    </div>
  );
}
