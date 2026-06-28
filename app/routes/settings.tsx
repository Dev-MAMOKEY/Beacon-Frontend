import type { Route } from "./+types/settings";
import { AppHeader } from "~/components/layout/AppHeader";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { ClubInfoCard } from "~/components/settings/ClubInfoCard";
import { CodeGenerationCard } from "~/components/settings/CodeGenerationCard";
import { BeaconSettingsCard } from "~/components/settings/BeaconSettingsCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "설정 · Mamoki Campus" },
    { name: "description", content: "Beacon 설정" },
  ];
}

export default function Settings() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col p-[30px]">
          <div className="flex w-full max-w-[1083px] flex-col gap-[30px]">
            <h1 className="pl-[8px] text-[26px] font-bold text-foreground-subtle">
              설정
            </h1>

            <div className="flex items-stretch gap-[32px]">
              <ClubInfoCard />
              <CodeGenerationCard />
            </div>

            <BeaconSettingsCard />
          </div>
        </main>
      </div>
    </div>
  );
}
