import { Search } from "lucide-react";

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/**
 * Pill-shaped 검색 인풋. 좌측 아이콘 고정.
 * Figma(221:988): bg border-subtle, rounded-[20px], w-237, pl-20 gap-12, placeholder foreground-subtle 14px
 */
export function SearchInput({
  placeholder = "검색어를 입력하세요",
  value,
  onChange,
  className = "",
}: Props) {
  return (
    <div
      className={`relative flex w-[237px] items-center rounded-[20px] bg-border-subtle ${className}`}
    >
      <Search className="pointer-events-none absolute left-5 size-[14px] text-foreground-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent py-[14px] pl-[46px] pr-4 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
      />
    </div>
  );
}
