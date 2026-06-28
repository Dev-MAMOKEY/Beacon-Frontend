import { request } from "../client";
import type {
  AdminAttendanceRequestDto,
  AttendanceCheckRequestDto,
  AttendanceStatusUpdateDto,
  MyAttendanceRecordDto,
  SliceAttendanceDto,
} from "../types";

export function getSessionAttendance(
  clubId: number,
  sessionId: number,
  params?: { page?: number; size?: number },
): Promise<SliceAttendanceDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/attendance`,
    params,
  });
}

/** OTP 코드로 본인 출석 체크. */
export function checkAttendance(
  clubId: number,
  sessionId: number,
  body: AttendanceCheckRequestDto,
): Promise<string> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/attendance`,
    data: body,
  });
}

/** 관리자 수동 출석 처리. */
export function manualAttendance(
  clubId: number,
  sessionId: number,
  body: AdminAttendanceRequestDto,
): Promise<string> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/attendance/manual`,
    data: body,
  });
}

export function updateAttendanceStatus(
  clubId: number,
  sessionId: number,
  recordId: number,
  body: AttendanceStatusUpdateDto,
): Promise<string> {
  return request({
    method: "PATCH",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/attendance/${recordId}`,
    data: body,
  });
}

export function getMyAttendanceRecords(
  clubId: number,
  params?: { year?: number; month?: number },
): Promise<MyAttendanceRecordDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/members/me/records`,
    params,
  });
}
