import type { AttendanceStatus } from "~/lib/api";

/** null 아닌 출석 상태 코드. */
export type AttendanceStatusCode = NonNullable<AttendanceStatus>;

/** 선택 순서(라디오/필터용). */
export const ATTENDANCE_STATUSES: AttendanceStatusCode[] = [
  "PRESENT",
  "LATE",
  "ABSENT",
  "ETC",
];

/** 상태 코드 → 한글 라벨. */
export const STATUS_LABEL: Record<AttendanceStatusCode, string> = {
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
  ETC: "기타",
};

/** 상태 코드 → 텍스트 색상 토큰 클래스. */
export const STATUS_TEXT_COLOR: Record<AttendanceStatusCode, string> = {
  PRESENT: "text-success",
  LATE: "text-warning",
  ABSENT: "text-destructive",
  ETC: "text-foreground-subtle",
};
