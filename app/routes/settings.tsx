import type { Route } from "./+types/settings";
import { Header } from "~/components/layout/Header";
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
        <Header user={{ name: "김신한님", role: "마모키 팀원" }} />
        <main className="flex flex-1 flex-col gap-[30px] p-[30px]">
          <h1 className="pl-[8px] text-[26px] font-bold text-foreground-subtle">
            설정
          </h1>

          <div className="flex w-full items-stretch gap-[32px]">
            <ClubInfoCard />
            <CodeGenerationCard />
          </div>

          <BeaconSettingsCard />
        </main>
      </div>
    </div>
  );
}
