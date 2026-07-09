import type { Route } from "./+types/settings";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { ClubInfoCard } from "~/components/settings/ClubInfoCard";
import { CodeGenerationCard } from "~/components/settings/CodeGenerationCard";
import { BeaconSettingsCard } from "~/components/settings/BeaconSettingsCard";
import { useActiveClub } from "~/hooks/use-active-club";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "설정 · Mamoki Campus" },
    { name: "description", content: "Beacon 설정" },
  ];
}

export default function Settings() {
  const { activeClubId, loading } = useActiveClub();

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col p-[30px]">
          <div className="mx-auto flex w-full max-w-[1083px] flex-col gap-[30px]">
            <h1 className="pl-[8px] text-[26px] font-bold text-foreground-subtle">
              설정
            </h1>

            {loading ? null : activeClubId === null ? (
              <div className="flex flex-col items-center gap-[12px] rounded-[20px] bg-surface px-[50px] py-[60px] text-center">
                <p className="text-[20px] font-semibold text-foreground">
                  소속된 동아리가 없습니다
                </p>
                <p className="text-[16px] font-medium text-foreground-subtle">
                  관리자에게 문의하거나 모바일 앱에서 초대코드로 동아리에
                  가입해주세요.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-stretch gap-[32px]">
                  <ClubInfoCard />
                  <CodeGenerationCard />
                </div>
                <BeaconSettingsCard />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
