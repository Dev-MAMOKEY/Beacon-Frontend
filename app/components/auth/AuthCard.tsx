import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

/**
 * 회원가입·로그인 화면의 가운데 정렬 카드 레이아웃.
 * Figma(221:1043): 타이틀(26px Bold, foreground-muted) 아래 gap-32,
 * 회색 카드(bg surface-sunken, rounded-22, w-500, px-40 py-36, 내부 gap-34).
 */
export function AuthCard({ title, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-[32px]">
      <h1 className="text-[26px] font-bold text-foreground-muted">{title}</h1>
      <div className="flex w-[500px] max-w-full flex-col gap-[34px] rounded-[22px] bg-surface-sunken px-[40px] py-[36px]">
        {children}
      </div>
    </div>
  );
}
