import { useState } from "react";
import { Plus, Repeat } from "lucide-react";
import type { Route } from "./+types/sessions";
import { Header } from "~/components/layout/Header";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { PageHeading } from "~/components/dashboard/PageHeading";
import { SessionCalendar } from "~/components/session/SessionCalendar";
import { SessionCard, type Session } from "~/components/session/SessionCard";
import { SessionEditModal } from "~/components/session/SessionEditModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "세션 관리 · Mamoki Campus" },
    { name: "description", content: "Beacon 세션 관리" },
  ];
}

const SESSIONS: Session[] = [
  {
    date: "5월 14일",
    time: "PM 03:00",
    category: "프로젝트",
    title: "아이디어톤 제출일",
    location: "팀 마모키",
    isToday: true,
  },
  {
    date: "5월 18일",
    time: "PM 06:20",
    category: "동아리",
    title: "10주차 정기 모임",
    location: "기도관 2110",
  },
  {
    date: "5월 22일",
    time: "PM 10:00",
    category: "회의",
    title: "프로젝트 회의",
    location: "디스코드",
  },
];

/** 최신 항목일수록 진하고, 이후 항목은 흐려진다. Figma(169:380). */
const DIM = ["opacity-100", "opacity-50", "opacity-30"];

export default function Sessions() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <Header user={{ name: "김신한님", role: "마모키 팀원" }} />
        <main className="flex flex-1 justify-center gap-[30px] p-[30px]">
          <div className="flex flex-col gap-[32px]">
            <PageHeading
              title="세션 관리"
              date="2026년 5월 16일"
              titleClassName="text-foreground-subtle"
            />
            <SessionCalendar />
          </div>

          <div className="flex flex-1 flex-col gap-[34px]">
            <div className="flex flex-col gap-[24px]">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex w-[300px] items-center justify-center gap-[12px] rounded-[20px] bg-surface px-[80px] py-[20px] text-[18px] font-semibold text-primary-hover transition-opacity hover:opacity-90"
              >
                <Plus className="size-[16px]" />새 세션 만들기
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex w-[300px] items-center justify-center gap-[12px] rounded-[20px] bg-primary px-[80px] py-[20px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Repeat className="size-[18px]" />반복 세션 만들기
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-[24px] rounded-[22px] bg-[#f3f4f5] p-[18px]">
              {SESSIONS.map((session, i) => (
                <SessionCard
                  key={`${session.date}-${session.title}`}
                  {...session}
                  className={DIM[i] ?? "opacity-30"}
                  onEdit={() => setEditOpen(true)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <SessionEditModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
