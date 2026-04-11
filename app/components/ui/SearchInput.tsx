import { Search } from "lucide-react";

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/**
 * Pill-shaped 검색 인풋. 좌측 아이콘 고정.
 * Figma: bg #e7e8e9, placeholder #6b7280, rounded-full, w-64
 */
export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: Props) {
  return (
    <div
      className={`relative flex h-9 w-64 items-center rounded-full bg-border-subtle/60 ${className}`}
    >
      <Search className="pointer-events-none absolute left-3 size-[14px] text-foreground-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent pl-9 pr-4 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
      />
    </div>
  );
}
