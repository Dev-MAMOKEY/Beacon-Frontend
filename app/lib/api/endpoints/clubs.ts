import { request } from "../client";
import type {
  ClubCreateResponseDto,
  ClubDto,
  ClubResponseDto,
  InviteRequestDto,
  InviteResponseDto,
} from "../types";

export function createClub(body: ClubDto): Promise<ClubCreateResponseDto> {
  return request({ method: "POST", url: "/api/v1/clubs/create", data: body });
}

export function getClub(clubId: number): Promise<ClubResponseDto> {
  return request({ method: "GET", url: `/api/v1/clubs/${clubId}` });
}

export function updateClub(clubId: number, body: ClubDto): Promise<string> {
  return request({
    method: "PATCH",
    url: `/api/v1/clubs/${clubId}`,
    data: body,
  });
}

export function softDeleteClub(clubId: number): Promise<string> {
  return request({
    method: "PATCH",
    url: `/api/v1/clubs/soft-delete/${clubId}`,
  });
}

// 초대코드
export function joinByInvite(body: InviteRequestDto): Promise<void> {
  return request({ method: "POST", url: "/api/v1/clubs/join", data: body });
}

export function getInviteCode(clubId: number): Promise<InviteResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/invite-code`,
  });
}

export function issueInviteCode(clubId: number): Promise<InviteResponseDto> {
  return request({
    method: "POST",
    url: `/api/v1/clubs/${clubId}/invite-code`,
  });
}

export function revokeInviteCode(clubId: number): Promise<void> {
  return request({
    method: "DELETE",
    url: `/api/v1/clubs/${clubId}/invite-code`,
  });
}
