import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useActiveClub } from "~/hooks/use-active-club";
import { useClubs } from "~/hooks/use-clubs";

/**
 * 활성 동아리 스위처. 현재 동아리명 + 드롭다운으로 전환.
 * 동아리가 1개면 이름만 표시하고, 없으면 렌더하지 않는다.
 */
export function ClubSwitcher() {
  const { clubs } = useClubs();
  const { activeClubId, setActiveClub } = useActiveClub();
  const [open, setOpen] = useState(false);

  if (clubs.length === 0) return null;

  const active = clubs.find((c) => c.clubId === activeClubId) ?? clubs[0];
  const single = clubs.length === 1;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !single && setOpen((v) => !v)}
        aria-haspopup={single ? undefined : "listbox"}
        aria-expanded={single ? undefined : open}
        className="flex items-center gap-[8px] rounded-[12px] bg-border-subtle px-[16px] py-[8px] text-[16px] font-semibold text-foreground transition-colors hover:bg-border-subtle/70"
      >
        <span className="max-w-[180px] truncate">{active.clubName}</span>
        {!single && <ChevronDown className="size-[16px] text-foreground-subtle" />}
      </button>

      {open && !single && (
        <>
          <button
            type="button"
            aria-label="닫기"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-full overflow-hidden rounded-[12px] border border-border-subtle bg-surface py-[6px] shadow-lg"
          >
            {clubs.map((c) => (
              <li key={c.clubId}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.clubId === active.clubId}
                  onClick={() => {
                    setActiveClub(c.clubId);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-[10px] whitespace-nowrap px-[16px] py-[10px] text-left text-[16px] font-medium text-foreground hover:bg-border-subtle"
                >
                  <Check
                    className={`size-[16px] ${
                      c.clubId === active.clubId
                        ? "text-primary-hover"
                        : "invisible"
                    }`}
                  />
                  {c.clubName}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
