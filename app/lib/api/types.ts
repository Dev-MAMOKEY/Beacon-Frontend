import type { components } from "./schema";

/** OpenAPI components.schemas 단축 별칭. */
type S = components["schemas"];

// 공통
export type ErrorInfo = S["ErrorInfo"];

/** 모든 응답을 감싸는 공통 봉투. */
export type RsData<T> = {
  success: boolean;
  data: T;
  error?: ErrorInfo | null;
  timestamp?: string;
};

// 인증
export type LoginRequest = S["LoginRequest"];
export type SignupRequest = S["SignupRequest"];
export type SignupResponse = S["SignupResponse"];
export type ReissueTokenRequest = S["ReissueTokenRequest"];
export type TokenResponse = S["TokenResponse"];

// 동아리 / 초대코드
export type ClubDto = S["ClubDto"];
export type ClubResponseDto = S["ClubResponseDto"];
export type ClubCreateResponseDto = S["ClubCreateResponseDto"];
export type InviteRequestDto = S["InviteRequestDto"];
export type InviteResponseDto = S["InviteResponseDto"];

// 세션
export type Session = S["SessionResponseDto"];
export type SliceSession = S["SliceSessionResponseDto"];
export type SessionDto = S["SessionDto"];
export type SessionCreateRequestDto = S["SessionCreateRequestDto"];
export type SessionStartDto = S["SessionStartDto"];

// 출석
export type AttendanceDto = S["AttendanceDto"];
export type SliceAttendanceDto = S["SliceAttendanceDto"];
export type AttendanceCheckRequestDto = S["AttendanceCheckRequestDto"];
export type AdminAttendanceRequestDto = S["AdminAttendanceRequestDto"];
export type AttendanceStatusUpdateDto = S["AttendanceStatusUpdateDto"];
export type MyAttendanceRecordDto = S["MyAttendanceRecordDto"];

// 통계
export type TrendResponseDto = S["TrendResponseDto"];
export type TrendItem = S["TrendItem"];
export type DistributionResponseDto = S["DistributionResponseDto"];
export type MemberStatsResponseDto = S["MemberStatsResponseDto"];
export type MemberStatItem = S["MemberStatItem"];
export type ExportResponseDto = S["ExportResponseDto"];
export type ExportItem = S["ExportItem"];
export type SummaryResponseDto = S["SummaryResponseDto"];

// 비콘
export type BeaconConfigDto = S["BeaconConfigDto"];

// 회원 / 동아리 멤버
export type MemberProfileResponse = S["MemberProfileResponse"];
export type MemberProfileUpdateRequest = S["MemberProfileUpdateRequest"];
export type MemberPasswordUpdateRequest = S["MemberPaswordUpdateRequest"];
export type FcmTokenUpdateRequest = S["FcmTokenUpdateRequest"];
export type RoleUpdateRequest = S["RoleUpdateRequest"];
export type ClubMemberResponse = S["ClubMemberResponse"];
export type PartUpdateRequest = S["PartUpdateRequest"];

// 공통 enum
export type AttendanceStatus = AttendanceDto["attendanceStatus"];
export type SessionStatus = Session["status"];
