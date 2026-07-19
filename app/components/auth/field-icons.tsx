import type { SVGProps } from "react";

/**
 * 로그인·회원가입 입력 필드의 좌측 아이콘 3종.
 * Figma(로그인 368:2799 / 회원가입 355:1757)의 벡터를 인라인 SVG로 옮겼다.
 * fill을 currentColor로 두어 필드의 텍스트/플레이스홀더 색을 상속한다.
 */
type IconProps = SVGProps<SVGSVGElement>;

/** 학번 필드(id-card). */
export function IdCardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 22 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 2H20V14H2V2ZM1 0C0.44772 0 0 0.44772 0 1V15C0 15.5523 0.44772 16 1 16H21C21.5523 16 22 15.5523 22 15V1C22 0.44772 21.5523 0 21 0H1ZM12 4H18V6H12V4ZM17 8H12V10H17V8ZM9.5 6C9.5 7.3807 8.38071 8.5 7 8.5C5.61929 8.5 4.5 7.3807 4.5 6C4.5 4.61929 5.61929 3.5 7 3.5C8.38071 3.5 9.5 4.61929 9.5 6ZM7 9.5C5.067 9.5 3.5 11.067 3.5 13H10.5C10.5 11.067 8.933 9.5 7 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 이름 필드(user). */
export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 21" fill="none" aria-hidden="true" {...props}>
      <path
        d="M0 21C0 16.5817 3.58172 13 8 13C12.4183 13 16 16.5817 16 21H14C14 17.6863 11.3137 15 8 15C4.68629 15 2 17.6863 2 21H0ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 비밀번호 필드(lock). */
export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 8H17C17.5523 8 18 8.4477 18 9V19C18 19.5523 17.5523 20 17 20H1C0.44772 20 0 19.5523 0 19V9C0 8.4477 0.44772 8 1 8H2V7C2 3.13401 5.13401 0 9 0C12.866 0 16 3.13401 16 7V8ZM2 10V18H16V10H2ZM8 12H10V16H8V12ZM14 8V7C14 4.23858 11.7614 2 9 2C6.23858 2 4 4.23858 4 7V8H14Z"
        fill="currentColor"
      />
    </svg>
  );
}
