import { request } from "../client";
import type { BeaconConfigDto } from "../types";

/** 동아리 비콘 설정 조회. 설정이 없으면 서버가 기본값으로 생성 후 반환한다. */
export function getBeaconConfig(clubId: number): Promise<BeaconConfigDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/beacon`,
  });
}

/** 동아리 비콘 설정 수정(ADMIN). UUID·지각 기준·안정화 시간·RSSI 임계값. */
export function updateBeaconConfig(
  clubId: number,
  body: BeaconConfigDto,
): Promise<BeaconConfigDto> {
  return request({
    method: "PUT",
    url: `/api/v1/clubs/${clubId}/beacon`,
    data: body,
  });
}
