import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

/**
 * 회원가입·로그인 화면의 가운데 정렬 카드 레이아웃.
 * Figma(368:2815): 타이틀(24px SemiBold, foreground-muted, 트래킹 0.5) 아래 gap-32,
 * 흰 카드(bg surface, rounded-22, w-500, px-40 py-36, 내부 gap-34).
 * 연회색 페이지 위에서 카드가 떠 보이도록 soft shadow를 준다.
 */
export function AuthCard({ title, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-[32px]">
      <h1 className="text-[24px] font-semibold uppercase tracking-[0.5px] text-foreground-muted">
        {title}
      </h1>
      <div className="flex w-[500px] max-w-full flex-col gap-[34px] rounded-[22px] bg-surface px-[40px] py-[36px] shadow-sm">
        {children}
      </div>
    </div>
  );
}
