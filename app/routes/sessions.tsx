import { useState } from "react";
import { Plus, Repeat } from "lucide-react";
import type { Route } from "./+types/sessions";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { PageHeading } from "~/components/dashboard/PageHeading";
import { SessionCalendar } from "~/components/session/SessionCalendar";
import { SessionCard } from "~/components/session/SessionCard";
import { SessionEditModal } from "~/components/session/SessionEditModal";
import { useSessions } from "~/hooks/use-sessions";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, sessionsApi } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "세션 관리 · Mamoki Campus" },
    { name: "description", content: "Beacon 세션 관리" },
  ];
}

const TODAY = new Date();
const TODAY_LABEL = `${TODAY.getFullYear()}년 ${TODAY.getMonth() + 1}월 ${TODAY.getDate()}일`;

/** 최신 항목일수록 진하고, 이후 항목은 흐려진다. Figma(169:380). */
const DIM = ["opacity-100", "opacity-80", "opacity-60"];

export default function Sessions() {
  const { activeClubId } = useActiveClub();
  const { sessions, loading, error, reload } = useSessions();
  const [editOpen, setEditOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function runAction(id: number, fn: (clubId: number) => Promise<unknown>) {
    if (activeClubId === null) return;
    setBusyId(id);
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

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 gap-[30px] p-[30px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[32px]">
            <PageHeading
              title="세션 관리"
              date={TODAY_LABEL}
              titleClassName="text-foreground-subtle"
            />
            <SessionCalendar sessions={sessions} />
          </div>

          <div className="flex w-[333px] shrink-0 flex-col gap-[34px]">
            <div className="flex flex-col gap-[24px]">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex w-full items-center justify-center gap-[12px] whitespace-nowrap rounded-[20px] bg-surface px-[80px] py-[20px] text-[18px] font-semibold text-primary-hover transition-opacity hover:opacity-90"
              >
                <Plus className="size-[16px]" />새 세션 만들기
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex w-full items-center justify-center gap-[12px] whitespace-nowrap rounded-[20px] bg-primary px-[80px] py-[20px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Repeat className="size-[18px]" />
                반복 세션 만들기
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-[24px] rounded-[22px] bg-surface-sunken p-[18px]">
              {error && (
                <p className="text-[15px] font-medium text-destructive">{error}</p>
              )}
              {actionError && (
                <p className="text-[15px] font-medium text-destructive">
                  {actionError}
                </p>
              )}
              {loading && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  불러오는 중...
                </p>
              )}
              {!loading && !error && sessions.length === 0 && (
                <p className="text-[15px] font-medium text-foreground-subtle">
                  세션이 없습니다. 새 세션을 만들어보세요.
                </p>
              )}
              {sessions.map((s, i) => (
                <SessionCard
                  key={s.id ?? i}
                  session={s}
                  className={DIM[i] ?? "opacity-60"}
                  busy={busyId === s.id}
                  onEdit={() => setEditOpen(true)}
                  onStart={() =>
                    s.id != null &&
                    runAction(s.id, (c) => sessionsApi.startSession(c, s.id!))
                  }
                  onEnd={() =>
                    s.id != null &&
                    runAction(s.id, (c) => sessionsApi.endSession(c, s.id!))
                  }
                  onDelete={() =>
                    s.id != null &&
                    runAction(s.id, (c) => sessionsApi.deleteSession(c, s.id!))
                  }
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
