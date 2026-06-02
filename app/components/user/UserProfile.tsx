type Props = {
  name: string;
  role: string;
  avatarSrc?: string;
};

/**
 * 헤더 우측에 표시하는 유저 정보. 우측 정렬 2줄 텍스트 + 48px 원형 아바타.
 * Figma(223:1140): 이름 18px SemiBold, 소속 12px Medium, gap-21, 아바타 48px
 * avatarSrc 없으면 이름 첫 글자로 fallback.
 */
export function UserProfile({ name, role, avatarSrc }: Props) {
  return (
    <div className="flex items-center gap-[21px]">
      <div className="flex flex-col items-end gap-1">
        <span className="text-lg font-semibold leading-none text-foreground">
          {name}
        </span>
        <span className="text-xs font-medium leading-none text-foreground-subtle">
          {role}
        </span>
      </div>
      <Avatar name={name} src={avatarSrc} />
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="relative size-12 overflow-hidden rounded-full border-2 border-surface bg-border-subtle">
      {src ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-sm font-bold text-foreground-muted">
          {initial}
        </div>
      )}
    </div>
  );
}
