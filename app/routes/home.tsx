import type { Route } from "./+types/home";
import { Header } from "~/components/layout/Header";
import { SideNavBar } from "~/components/layout/SideNavBar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mamoki Campus" },
    { name: "description", content: "The Academic Curator" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <Header user={{ name: "Admin User", role: "Campus Director" }} />
        <main className="p-8">
          <p className="text-foreground-muted">페이지 콘텐츠 영역</p>
        </main>
      </div>
    </div>
  );
}
