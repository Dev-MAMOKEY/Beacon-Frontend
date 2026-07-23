import type { Route } from "./+types/sessions";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { PageHeading } from "~/components/dashboard/PageHeading";
import { SessionCalendar } from "~/components/session/SessionCalendar";
import { SessionCard } from "~/components/session/SessionCard";
import { useSessions } from "~/hooks/use-sessions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "세션 관리 · Mamoki Campus" },
    { name: "description", content: "Beacon 세션 조회" },
  ];
}

const TODAY = new Date();
const TODAY_LABEL = `${TODAY.getFullYear()}년 ${TODAY.getMonth() + 1}월 ${TODAY.getDate()}일`;

/** 첫 항목(가장 가까운 세션)은 진하고 이후 항목은 흐려진다. Figma(388:1842). */
const DIM = ["opacity-100", "opacity-50", "opacity-50"];

/**
 * 세션 관리 페이지(조회 전용). 웹에서는 세션을 생성/수정하지 않고 달력·목록으로 조회만 한다.
 * Figma(388:1842): 좌측 페이지명/날짜 + 달력, 우측 세션 리스트 패널.
 */
export default function Sessions() {
  const { sessions, loading, error } = useSessions();

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 gap-[30px] p-[30px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[30px]">
            <PageHeading
              title="세션 관리"
              date={TODAY_LABEL}
              titleClassName="text-foreground-subtle"
            />
            <SessionCalendar sessions={sessions} />
          </div>

          <div className="flex w-[300px] shrink-0 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-[24px] rounded-t-[22px] bg-surface-sunken px-[18px] pb-[18px] pt-[26px]">
              {error && (
                <p className="text-[15px] font-medium text-destructive">{error}</p>
              )}
              {loading && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  불러오는 중...
                </p>
              )}
              {!loading && !error && sessions.length === 0 && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  세션이 없습니다.
                </p>
              )}
              {sessions.map((s, i) => (
                <SessionCard
                  key={s.sessionId ?? i}
                  session={s}
                  className={DIM[i] ?? "opacity-50"}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
