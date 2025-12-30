/**
 * 통계 API 서비스
 * API 문서 기준: admin-stats-api.http
 */
import { api } from './client';
import type { ApiResponse } from '@/src/types/api';
import type {
  PrevisitByDongStats,
  PrevisitByTimeStats,
  PrevisitOccupancyStats,
  PrevisitInspectionStats,
  ASByDongStats,
  ASByWorkTypeStats,
  ASDetailStats,
  ASCompletionRateStats,
  OccupancyRateStats,
  HouseholdStatusStats,
  DashboardStats,
  PrevisitStatsParams,
  StatsDateRangeParams,
  ASDetailStatsParams,
} from '@/src/types/stats.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getStatsBasePath = (projectUuid: string) =>
  `/adm/project/${projectUuid}/stats`;

// =============================================================================
// 1. 사전방문 통계 (CP-SA-05-001 ~ 004)
// =============================================================================

/**
 * 1-1. 방문현황 (동별) - CP-SA-05-001
 */
export async function getPrevisitByDong(
  projectUuid: string,
  params?: PrevisitStatsParams
): Promise<PrevisitByDongStats> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<ApiResponse<any>>(
    `${getStatsBasePath(projectUuid)}/previsit/by-dong`,
    { params }
  );
  const data = response.data.data;
  // API에서 dates가 객체로 오면 배열로 변환
  if (data.dates && !Array.isArray(data.dates)) {
    data.dates = Object.keys(data.dates).sort();
  }
  return data as PrevisitByDongStats;
}

/**
 * 1-2. 방문현황 (요일/시간대별) - CP-SA-05-002
 */
export async function getPrevisitByTime(
  projectUuid: string,
  params?: PrevisitStatsParams
): Promise<PrevisitByTimeStats> {
  const response = await api.get<ApiResponse<PrevisitByTimeStats>>(
    `${getStatsBasePath(projectUuid)}/previsit/by-time`,
    { params }
  );
  return response.data.data;
}

/**
 * 1-3. 입주현황 - CP-SA-05-003
 */
export async function getPrevisitOccupancy(
  projectUuid: string
): Promise<PrevisitOccupancyStats> {
  const response = await api.get<ApiResponse<PrevisitOccupancyStats>>(
    `${getStatsBasePath(projectUuid)}/previsit/occupancy`
  );
  return response.data.data;
}

/**
 * 1-4. 점검세대 - CP-SA-05-004
 */
export async function getPrevisitInspection(
  projectUuid: string,
  params?: PrevisitStatsParams
): Promise<PrevisitInspectionStats> {
  const response = await api.get<ApiResponse<PrevisitInspectionStats>>(
    `${getStatsBasePath(projectUuid)}/previsit/inspection`,
    { params }
  );
  return response.data.data;
}

// =============================================================================
// 2. A/S 통계 (CP-SA-05-005 ~ 008)
// =============================================================================

/**
 * 2-1. 동별 A/S 건수 - CP-SA-05-005
 */
export async function getASByDong(
  projectUuid: string,
  params?: StatsDateRangeParams
): Promise<ASByDongStats> {
  const response = await api.get<ApiResponse<ASByDongStats>>(
    `${getStatsBasePath(projectUuid)}/afterservice/by-dong`,
    { params }
  );
  return response.data.data;
}

/**
 * 2-2. 공종별 A/S 건수 - CP-SA-05-006
 */
export async function getASByWorkType(
  projectUuid: string,
  params?: StatsDateRangeParams
): Promise<ASByWorkTypeStats> {
  const response = await api.get<ApiResponse<ASByWorkTypeStats>>(
    `${getStatsBasePath(projectUuid)}/afterservice/by-worktype`,
    { params }
  );
  return response.data.data;
}

/**
 * 2-3. 상세 A/S 건수 - CP-SA-05-007
 */
export async function getASDetail(
  projectUuid: string,
  params?: ASDetailStatsParams
): Promise<ASDetailStats> {
  const response = await api.get<ApiResponse<ASDetailStats>>(
    `${getStatsBasePath(projectUuid)}/afterservice/detail`,
    { params }
  );
  return response.data.data;
}

/**
 * 2-4. 전체 처리율 - CP-SA-05-008
 */
export async function getASCompletionRate(
  projectUuid: string,
  params?: StatsDateRangeParams
): Promise<ASCompletionRateStats> {
  const response = await api.get<ApiResponse<ASCompletionRateStats>>(
    `${getStatsBasePath(projectUuid)}/afterservice/completion-rate`,
    { params }
  );
  return response.data.data;
}

// =============================================================================
// 3. 입주관리 통계 (CP-SA-05-009 ~ 010)
// =============================================================================

/**
 * 3-1. 입주율 - CP-SA-05-009
 */
export async function getOccupancyRate(
  projectUuid: string,
  params?: StatsDateRangeParams
): Promise<OccupancyRateStats> {
  const response = await api.get<ApiResponse<OccupancyRateStats>>(
    `${getStatsBasePath(projectUuid)}/occupancy/rate`,
    { params }
  );
  return response.data.data;
}

/**
 * 3-2. 세대현황 - CP-SA-05-010
 */
export async function getHouseholdStatus(
  projectUuid: string
): Promise<HouseholdStatusStats> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<ApiResponse<any>>(
    `${getStatsBasePath(projectUuid)}/occupancy/household`
  );
  const data = response.data.data;
  // resident_date가 객체로 오면 문자열로 변환
  Object.keys(data).forEach((dong) => {
    data[dong] = data[dong].map((line: unknown[]) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      line.map((item: any) => ({
        ...item,
        resident_date:
          item.resident_date && typeof item.resident_date === 'object'
            ? item.resident_date.date?.split(' ')[0] || null
            : item.resident_date,
      }))
    );
  });
  return data as HouseholdStatusStats;
}

// =============================================================================
// 4. 현장관리 대시보드 (CP-SA-05-011)
// =============================================================================

/**
 * 통합 대시보드
 */
export async function getDashboard(
  projectUuid: string
): Promise<DashboardStats> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<ApiResponse<any>>(
    `${getStatsBasePath(projectUuid)}/dashboard`
  );
  const data = response.data.data;
  // yearly_graph의 year를 period로 변환
  if (data.yearly_graph) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.yearly_graph = data.yearly_graph.map((item: any) => ({
      period: item.year || item.period,
      received: item.received,
      completed: item.completed,
    }));
  }
  // monthly_graph의 month를 period로 변환
  if (data.monthly_graph) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.monthly_graph = data.monthly_graph.map((item: any) => ({
      period: item.month || item.period,
      received: item.received,
      completed: item.completed,
    }));
  }
  // daily_graph의 date를 period로 변환
  if (data.daily_graph) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.daily_graph = data.daily_graph.map((item: any) => ({
      period: item.date || item.period,
      received: item.received,
      completed: item.completed,
    }));
  }
  return data as DashboardStats;
}
