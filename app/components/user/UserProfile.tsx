type Props = {
  name: string;
  role: string;
  avatarSrc?: string;
};

/**
 * 헤더 우측에 표시하는 유저 정보. 우측 정렬 2줄 텍스트 + 48px 원형 아바타.
 * Figma(362:1592): 이름 20px SemiBold, 소속 14px Medium, gap-21, 아바타 48px
 * avatarSrc 없으면 이름 첫 글자로 fallback.
 */
export function UserProfile({ name, role, avatarSrc }: Props) {
  return (
    <div className="flex items-center gap-[21px]">
      <div className="flex flex-col items-end gap-1">
        <span className="text-[20px] font-semibold leading-none tracking-[0.25px] text-foreground-muted">
          {name}
        </span>
        <span className="text-[14px] font-medium leading-none text-foreground-subtle">
          {role}
        </span>
      </div>
      <Avatar name={name} src={avatarSrc} />
    </div>
  );
}

/** 기본 아바타: 파란 원 + 흰 유저 아이콘(Figma 362:1585). avatarSrc 있으면 이미지. */
function Avatar({ name, src }: { name: string; src?: string }) {
  return (
    <div className="relative size-12 overflow-hidden rounded-full">
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
          <rect width="48" height="48" rx="24" fill="var(--color-primary-hover)" />
          <path
            d="M24 34C20.7 34 17.875 32.825 15.525 30.475C13.175 28.125 12 25.3 12 22C12 18.7 13.175 15.875 15.525 13.525C17.875 11.175 20.7 10 24 10C27.3 10 30.125 11.175 32.475 13.525C34.825 15.875 36 18.7 36 22C36 25.3 34.825 28.125 32.475 30.475C30.125 32.825 27.3 34 24 34ZM0 58V49.6C0 47.9 0.4375 46.3375 1.3125 44.9125C2.1875 43.4875 3.35 42.4 4.8 41.65C7.9 40.1 11.05 38.9375 14.25 38.1625C17.45 37.3875 20.7 37 24 37C27.3 37 30.55 37.3875 33.75 38.1625C36.95 38.9375 40.1 40.1 43.2 41.65C44.65 42.4 45.8125 43.4875 46.6875 44.9125C47.5625 46.3375 48 47.9 48 49.6V58H0Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
}
