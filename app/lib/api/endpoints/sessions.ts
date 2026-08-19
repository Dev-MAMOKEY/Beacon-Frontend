import { request } from "../client";
import type {
  Session,
  SessionCreateRequestDto,
  SessionDto,
  SessionStartDto,
  SliceSession,
} from "../types";

type ListParams = {
  status?: "SCHEDULED" | "ACTIVE" | "ENDED";
  page?: number;
  size?: number;
};

export function getSessions(
  clubId: number,
  params?: ListParams,
): Promise<SliceSession> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/sessions`,
    params,
  });
}

export function getActiveSession(clubId: number): Promise<Session> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/sessions/active`,
  });
}

export function getSession(
  clubId: number,
  sessionId: number,
): Promise<Session> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}`,
  });
}

export function createSession(
  clubId: number,
  body: SessionCreateRequestDto,
): Promise<void> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/sessions`,
    data: body,
  });
}

export function updateSession(
  clubId: number,
  sessionId: number,
  body: SessionDto,
): Promise<string> {
  return request({
    method: "PATCH",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}`,
    data: body,
  });
}

export function deleteSession(
  clubId: number,
  sessionId: number,
): Promise<string> {
  return request({
    method: "DELETE",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}`,
  });
}

/** 세션 시작 — OTP 코드/UUID 반환. */
export function startSession(
  clubId: number,
  sessionId: number,
): Promise<SessionStartDto> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/start`,
  });
}

export function endSession(
  clubId: number,
  sessionId: number,
): Promise<string> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/sessions/${sessionId}/end`,
  });
}
