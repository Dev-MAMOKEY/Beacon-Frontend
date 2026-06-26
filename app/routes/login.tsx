import type { Route } from "./+types/login";
import { Header } from "~/components/layout/Header";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { AuthCard } from "~/components/auth/AuthCard";
import { LoginForm } from "~/components/auth/LoginForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "로그인 · Mamoki Campus" },
    { name: "description", content: "Beacon 로그인" },
  ];
}

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <Header user={{ name: "비회원", role: "로그인 해주세요" }} />
        <main className="flex flex-1 flex-col items-center px-[30px] pb-[30px] pt-[160px]">
          <AuthCard title="로그인">
            <LoginForm />
          </AuthCard>
        </main>
      </div>
    </div>
  );
}
