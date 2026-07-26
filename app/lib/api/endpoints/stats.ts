import { request } from "../client";
import type {
  DistributionResponseDto,
  ExportResponseDto,
  MemberStatsResponseDto,
  SummaryResponseDto,
  TrendResponseDto,
} from "../types";

type DateRange = { startDate: string; endDate: string };

/** 대시보드 요약(오늘 출석·지각·전체 멤버·평균 출석률). */
export function getSummary(clubId: number): Promise<SummaryResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/stats/summary`,
  });
}

/** 기간별 출석 트렌드 (라인 차트). */
export function getTrend(
  clubId: number,
  range: DateRange,
): Promise<TrendResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/stats/trend`,
    params: range,
  });
}

/** 출석 상태별 분포 (도넛 차트). */
export function getDistribution(
  clubId: number,
  range: DateRange,
): Promise<DistributionResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/stats/distribution`,
    params: range,
  });
}

/** 멤버별 출석률. */
export function getMemberStats(
  clubId: number,
): Promise<MemberStatsResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/stats/members`,
  });
}

/** 출석 데이터 내보내기. */
export function exportAttendance(
  clubId: number,
  range: DateRange & { memberId?: number },
): Promise<ExportResponseDto> {
  return request({
    method: "GET",
    url: `/api/v1/clubs/${clubId}/export`,
    params: range,
  });
}
