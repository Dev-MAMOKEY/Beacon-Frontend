import type { Route } from "./+types/home";
import { TopNavBar } from "~/components/layout/TopNavBar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mamoki Campus" },
    { name: "description", content: "The Academic Curator" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopNavBar
        user={{ name: "Admin User", role: "Campus Director" }}
      />
      <main className="p-8">
        <p className="text-foreground-muted">페이지 콘텐츠 영역</p>
      </main>
    </div>
  );
}
