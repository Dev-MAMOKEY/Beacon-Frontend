import type { Route } from "./+types/home";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { PageHeading } from "~/components/dashboard/PageHeading";
import { MetricCard } from "~/components/dashboard/MetricCard";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import {
  AttendanceFeed,
  type FeedEntry,
} from "~/components/dashboard/AttendanceFeed";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mamoki Campus" },
    { name: "description", content: "The Academic Curator" },
  ];
}

const FEED: FeedEntry[] = [
  { name: "김민준", date: "05월 10일", status: "출석", time: "오후 06:20" },
  { name: "이신한", date: "05월 10일", status: "지각", time: "오후 06:25" },
  { name: "김민준", date: "04월 12일", status: "출석", time: "오후 06:20" },
  { name: "김민준", date: "03월 16일", status: "결석", time: "오후 06:35" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-[32px] px-[30px] pb-[30px] pt-[16px]">
          <PageHeading
            title="대시 보드"
            date="2026년 5월 16일"
            sessionStatus="진행 중인 세션 없음"
          />

          <div className="flex w-full gap-[30px]">
            <MetricCard
              label="오늘 출석 수"
              value={10}
              valueClassName="text-success"
            />
            <MetricCard
              label="오늘 지각 수"
              value={2}
              valueClassName="text-warning"
            />
            <MetricCard label="전체 멤버 수" value={14} />
            <MetricCard
              label="평균 출석률"
              value={96}
              unit="%"
              valueClassName="text-primary"
            />
          </div>

          <div className="flex items-stretch gap-[34px]">
            <AttendanceChart />
            <AttendanceFeed entries={FEED} moreCount={12} />
          </div>
        </main>
      </div>
    </div>
  );
}
