import { request } from "../client";
import type {
  ClubMemberResponse,
  FcmTokenUpdateRequest,
  MemberPasswordUpdateRequest,
  MemberProfileResponse,
  MemberProfileUpdateRequest,
  RoleUpdateRequest,
} from "../types";

// --- 동아리 멤버 (ClubMember) ---

export function getClubMembers(
  clubId: number,
  search?: string,
): Promise<ClubMemberResponse[]> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/members`,
    params: search ? { search } : undefined,
  });
}

export function removeMember(
  clubId: number,
  memberId: number,
): Promise<unknown> {
  return request({
    method: "DELETE",
    url: `/api/v1/clubs/${clubId}/members/${memberId}`,
  });
}

export function updateMemberRole(
  clubId: number,
  memberId: number,
  body: RoleUpdateRequest,
): Promise<unknown> {
  return request({
    method: "PATCH",
    url: `/api/v1/clubs/${clubId}/members/${memberId}/role`,
    data: body,
  });
}

// --- 내 프로필 (Member) ---
export function getMyProfile(): Promise<MemberProfileResponse> {
  return request({ method: "GET", url: "/api/v1/members/me" });
}

export function updateMyProfile(
  body: MemberProfileUpdateRequest,
): Promise<MemberProfileResponse> {
  return request({ method: "PATCH", url: "/api/v1/members/me", data: body });
}

export function updatePassword(
  body: MemberPasswordUpdateRequest,
): Promise<void> {
  return request({
    method: "PATCH",
    url: "/api/v1/members/me/password",
    data: body,
  });
}

export function updateFcmToken(body: FcmTokenUpdateRequest): Promise<void> {
  return request({
    method: "PATCH",
    url: "/api/v1/members/me/fcm-token",
    data: body,
  });
}
