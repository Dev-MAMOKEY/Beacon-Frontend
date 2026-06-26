import type { Route } from "./+types/signup";
import { Header } from "~/components/layout/Header";
import { SideNavBar } from "~/components/layout/SideNavBar";
import { AuthCard } from "~/components/auth/AuthCard";
import { SignupForm } from "~/components/auth/SignupForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "회원가입 · Mamoki Campus" },
    { name: "description", content: "Beacon 회원가입" },
  ];
}

export default function Signup() {
  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <div className="flex flex-1 flex-col">
        <Header user={{ name: "비회원", role: "로그인 해주세요" }} />
        <main className="flex flex-1 flex-col items-center px-[30px] pb-[30px] pt-[160px]">
          <AuthCard title="회원가입">
            <SignupForm />
          </AuthCard>
        </main>
      </div>
    </div>
  );
}
