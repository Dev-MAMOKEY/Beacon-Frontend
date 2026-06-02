import { GraduationCap } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
};

/**
 * 사이드바 상단의 브랜드 로고.
 * Figma: 40×40 primary 박스 아이콘 + 2줄 타이틀 (Manrope ExtraBold + uppercase subtitle)
 */
export function BrandLogo({
  title = "Mamoki Campus",
  subtitle = "The Academic Curator",
}: Props) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
        <GraduationCap className="size-[22px]" />
      </div>
      <div className="flex min-w-0 flex-col">
        <h1 className="font-display text-xl font-extrabold leading-7 tracking-tight text-primary">
          {title}
        </h1>
        <span className="text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-foreground-subtle">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
