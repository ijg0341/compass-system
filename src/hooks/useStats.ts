/**
 * 통계 관련 React Query hooks
 * API 문서 기준: admin-stats-api.http
 */

import { useQuery } from '@tanstack/react-query';
import {
  getPrevisitByDong,
  getPrevisitByTime,
  getPrevisitOccupancy,
  getPrevisitInspection,
  getASByDong,
  getASByWorkType,
  getASDetail,
  getASCompletionRate,
  getOccupancyRate,
  getHouseholdStatus,
  getDashboard,
} from '@/src/lib/api/statsApi';
import type {
  PrevisitStatsParams,
  StatsDateRangeParams,
  ASDetailStatsParams,
} from '@/src/types/stats.types';

// =============================================================================
// Query Keys
// =============================================================================

export const statsKeys = {
  all: ['stats'] as const,
  // 사전방문 통계
  previsitByDong: (projectUuid: string, params?: PrevisitStatsParams) =>
    [...statsKeys.all, 'previsit', 'by-dong', projectUuid, params] as const,
  previsitByTime: (projectUuid: string, params?: PrevisitStatsParams) =>
    [...statsKeys.all, 'previsit', 'by-time', projectUuid, params] as const,
  previsitOccupancy: (projectUuid: string) =>
    [...statsKeys.all, 'previsit', 'occupancy', projectUuid] as const,
  previsitInspection: (projectUuid: string, params?: PrevisitStatsParams) =>
    [...statsKeys.all, 'previsit', 'inspection', projectUuid, params] as const,
  // A/S 통계
  asByDong: (projectUuid: string, params?: StatsDateRangeParams) =>
    [...statsKeys.all, 'as', 'by-dong', projectUuid, params] as const,
  asByWorkType: (projectUuid: string, params?: StatsDateRangeParams) =>
    [...statsKeys.all, 'as', 'by-worktype', projectUuid, params] as const,
  asDetail: (projectUuid: string, params?: ASDetailStatsParams) =>
    [...statsKeys.all, 'as', 'detail', projectUuid, params] as const,
  asCompletionRate: (projectUuid: string, params?: StatsDateRangeParams) =>
    [...statsKeys.all, 'as', 'completion-rate', projectUuid, params] as const,
  // 입주관리 통계
  occupancyRate: (projectUuid: string, params?: StatsDateRangeParams) =>
    [...statsKeys.all, 'occupancy', 'rate', projectUuid, params] as const,
  householdStatus: (projectUuid: string) =>
    [...statsKeys.all, 'occupancy', 'household', projectUuid] as const,
  // 대시보드
  dashboard: (projectUuid: string) =>
    [...statsKeys.all, 'dashboard', projectUuid] as const,
};

// =============================================================================
// 1. 사전방문 통계 Hooks (CP-SA-05-001 ~ 004)
// =============================================================================

/**
 * 방문현황 (동별) - CP-SA-05-001
 */
export function usePrevisitByDong(
  projectUuid: string,
  params?: PrevisitStatsParams
) {
  return useQuery({
    queryKey: statsKeys.previsitByDong(projectUuid, params),
    queryFn: () => getPrevisitByDong(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 방문현황 (요일/시간대별) - CP-SA-05-002
 */
export function usePrevisitByTime(
  projectUuid: string,
  params?: PrevisitStatsParams
) {
  return useQuery({
    queryKey: statsKeys.previsitByTime(projectUuid, params),
    queryFn: () => getPrevisitByTime(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 입주현황 - CP-SA-05-003
 */
export function usePrevisitOccupancy(projectUuid: string) {
  return useQuery({
    queryKey: statsKeys.previsitOccupancy(projectUuid),
    queryFn: () => getPrevisitOccupancy(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 점검세대 - CP-SA-05-004
 */
export function usePrevisitInspection(
  projectUuid: string,
  params?: PrevisitStatsParams
) {
  return useQuery({
    queryKey: statsKeys.previsitInspection(projectUuid, params),
    queryFn: () => getPrevisitInspection(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

// =============================================================================
// 2. A/S 통계 Hooks (CP-SA-05-005 ~ 008)
// =============================================================================

/**
 * 동별 A/S 건수 - CP-SA-05-005
 */
export function useASByDong(
  projectUuid: string,
  params?: StatsDateRangeParams
) {
  return useQuery({
    queryKey: statsKeys.asByDong(projectUuid, params),
    queryFn: () => getASByDong(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 공종별 A/S 건수 - CP-SA-05-006
 */
export function useASByWorkType(
  projectUuid: string,
  params?: StatsDateRangeParams
) {
  return useQuery({
    queryKey: statsKeys.asByWorkType(projectUuid, params),
    queryFn: () => getASByWorkType(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 상세 A/S 건수 - CP-SA-05-007
 */
export function useASDetail(
  projectUuid: string,
  params?: ASDetailStatsParams
) {
  return useQuery({
    queryKey: statsKeys.asDetail(projectUuid, params),
    queryFn: () => getASDetail(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 전체 처리율 - CP-SA-05-008
 */
export function useASCompletionRate(
  projectUuid: string,
  params?: StatsDateRangeParams
) {
  return useQuery({
    queryKey: statsKeys.asCompletionRate(projectUuid, params),
    queryFn: () => getASCompletionRate(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

// =============================================================================
// 3. 입주관리 통계 Hooks (CP-SA-05-009 ~ 010)
// =============================================================================

/**
 * 입주율 - CP-SA-05-009
 */
export function useOccupancyRate(
  projectUuid: string,
  params?: StatsDateRangeParams
) {
  return useQuery({
    queryKey: statsKeys.occupancyRate(projectUuid, params),
    queryFn: () => getOccupancyRate(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 세대현황 - CP-SA-05-010
 */
export function useHouseholdStatus(projectUuid: string) {
  return useQuery({
    queryKey: statsKeys.householdStatus(projectUuid),
    queryFn: () => getHouseholdStatus(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}

// =============================================================================
// 4. 대시보드 Hook (CP-SA-05-011)
// =============================================================================

/**
 * 통합 대시보드
 */
export function useDashboard(projectUuid: string) {
  return useQuery({
    queryKey: statsKeys.dashboard(projectUuid),
    queryFn: () => getDashboard(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5,
  });
}
