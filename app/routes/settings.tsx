import { useCallback, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/settings";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { ClubInfoCard } from "~/components/settings/ClubInfoCard";
import { CodeGenerationCard } from "~/components/settings/CodeGenerationCard";
import { BeaconSettingsCard } from "~/components/settings/BeaconSettingsCard";
import {
  type SaveFn,
  SettingsSaveContext,
} from "~/components/settings/settings-save";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "설정 · Mamoki Campus" },
    { name: "description", content: "Beacon 설정" },
  ];
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Settings() {
  const { activeClubId, loading } = useActiveClub();

  // 각 카드가 등록한 저장 함수. 상단 "저장하기"가 한 번에 실행한다.
  const saversRef = useRef(new Set<SaveFn>());
  const register = useCallback((fn: SaveFn) => {
    saversRef.current.add(fn);
    return () => {
      saversRef.current.delete(fn);
    };
  }, []);
  const saveContext = useMemo(() => ({ register }), [register]);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSaveAll() {
    setSaveState("saving");
    setSaveError(null);
    try {
      // 카드별 저장은 서로 독립이므로 병렬로 보낸다.
      await Promise.all([...saversRef.current].map((save) => save()));
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setSaveError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "저장에 실패했습니다.",
      );
    }
  }

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col p-[30px]">
          {/*
            시안(356:2142)은 콘텐츠 1143px(안쪽 1083px) 고정 폭에 items-start다.
            폭을 풀면 코드 칸이 사방으로 벌어지고 비콘 카드가 가로로 늘어나 비율이 깨진다.
            넓은 화면에서 왼쪽에만 붙지 않도록 가운데 정렬한다.
          */}
          <div className="mx-auto flex w-full max-w-[1083px] flex-1 flex-col items-start gap-[30px]">
            {/* 시안 485:907 — 제목과 저장 버튼을 양끝으로 */}
            <div className="flex w-full items-start justify-between pr-[30px]">
              <h1 className="pl-[8px] text-[24px] font-semibold uppercase tracking-[0.5px] text-foreground-subtle">
                설정
              </h1>
              {activeClubId !== null && (
                <div className="flex items-center gap-[16px]">
                  {saveState === "saved" && (
                    <span className="text-[15px] font-medium text-success">
                      저장되었습니다.
                    </span>
                  )}
                  {saveState === "error" && saveError && (
                    <span className="text-[15px] font-medium text-destructive">
                      {saveError}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    disabled={saveState === "saving"}
                    className="rounded-[16px] bg-primary-hover px-[32px] py-[10px] text-[18px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {saveState === "saving" ? "저장 중..." : "저장하기"}
                  </button>
                </div>
              )}
            </div>

            {loading ? null : activeClubId === null ? (
              <div className="flex w-full flex-col items-center gap-[12px] rounded-[20px] bg-surface px-[50px] py-[60px] text-center">
                <p className="text-[20px] font-semibold text-foreground">
                  소속된 동아리가 없습니다
                </p>
                <p className="text-[16px] font-medium text-foreground-subtle">
                  관리자에게 문의하거나 모바일 앱에서 초대코드로 동아리에
                  가입해주세요.
                </p>
              </div>
            ) : (
              <SettingsSaveContext.Provider value={saveContext}>
                {/* 시안 356:2145 — 이 행만 w-full, 아래 비콘 카드는 콘텐츠 폭에 맞춘다 */}
                <div className="flex w-full items-stretch gap-[32px]">
                  <ClubInfoCard />
                  <CodeGenerationCard />
                </div>
                <BeaconSettingsCard />
              </SettingsSaveContext.Provider>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
