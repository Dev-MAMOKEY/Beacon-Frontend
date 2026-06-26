import { useState } from "react";
import type { Route } from "./+types/members";
import { Header } from "~/components/layout/Header";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import { MemberTable, type Member } from "~/components/member/MemberTable";
import { StatusDonutChart } from "~/components/member/StatusDonutChart";
import { MemberRanking } from "~/components/member/MemberRanking";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "멤버/통계 · Mamoki Campus" },
    { name: "description", content: "Beacon 멤버/통계" },
  ];
}

const MEMBERS: Member[] = [
  {
    name: "강네모",
    studentId: "20251149",
    role: "프론트엔드",
    attendanceRate: "100%",
    attendanceCount: "출석 8회",
  },
  {
    name: "김민준",
    studentId: "20250916",
    role: "기획",
    attendanceRate: "100%",
    attendanceCount: "출석 8회",
  },
  {
    name: "김별",
    studentId: "20241410",
    role: "백엔드",
    attendanceRate: "100%",
    attendanceCount: "출석 8회",
  },
  {
    name: "박신한",
    studentId: "20220245",
    role: "프론트엔드",
    attendanceRate: "100%",
    attendanceCount: "출석 7회",
  },
  {
    name: "이신한",
    studentId: "20240112",
    role: "디자인",
    attendanceRate: "100%",
    attendanceCount: "출석 8회",
  },
  {
    name: "정세모",
    studentId: "20260808",
    role: "백엔드",
    attendanceRate: "100%",
    attendanceCount: "출석 8회",
  },
  {
    name: "홍길동",
    studentId: "20230711",
    role: "디자인",
    attendanceRate: "92%",
    attendanceCount: "출석 7회",
  },
];

const RANKING = ["김민준", "이신한", "정세모", "홍길동", "박신한", "강네모"];

const TABS = ["멤버", "통계"] as const;
type Tab = (typeof TABS)[number];

export default function Members() {
  const [tab, setTab] = useState<Tab>("멤버");

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <Header user={{ name: "김신한님", role: "마모키 팀원" }} />
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
                    : "text-[#94a3b8]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "멤버" ? (
            <>
              <div className="flex w-full justify-end pr-[30px]">
                <button
                  type="button"
                  className="rounded-[16px] bg-[#adc7ff] px-[32px] py-[10px] text-[18px] font-semibold text-foreground-muted transition-opacity hover:opacity-90"
                >
                  편집하기
                </button>
              </div>
              <MemberTable members={MEMBERS} />
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
