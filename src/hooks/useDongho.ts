/**
 * 동호 관리 React Query Hooks
 * API 문서 기준: 2025-12-24
 *
 * 모든 hook에 projectUuid 파라미터 필요 (URL path 형식 변경)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getDonghos,
  getDongho,
  createDongho,
  updateDongho,
  deleteDongho,
  getHouseholdStatus,
  getFloorPlan,
  getHouseholdDetail,
  updateHousehold,
  getVisitHistory,
} from '../lib/api/donghoApi';

import type {
  DonghoRequest,
  DonghoListParams,
  HouseholdStatusParams,
  HouseholdUpdateRequest,
} from '../types/dongho.types';

// =============================================================================
// Query Keys
// =============================================================================

export const donghoKeys = {
  all: ['dongho'] as const,
  list: (projectUuid: string, params?: DonghoListParams) =>
    [...donghoKeys.all, 'list', projectUuid, params] as const,
  detail: (projectUuid: string, id: number) =>
    [...donghoKeys.all, 'detail', projectUuid, id] as const,
  householdStatus: (projectUuid: string, params?: HouseholdStatusParams) =>
    [...donghoKeys.all, 'household-status', projectUuid, params] as const,
  floorPlan: (projectUuid: string) =>
    [...donghoKeys.all, 'floor-plan', projectUuid] as const,
  householdDetail: (projectUuid: string, id: number) =>
    [...donghoKeys.all, 'household-detail', projectUuid, id] as const,
  visitHistory: (projectUuid: string, donghoId: number) =>
    [...donghoKeys.all, 'visit-history', projectUuid, donghoId] as const,
};

// =============================================================================
// 동호 코드 Hooks (CP-SA-07-001)
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export function useDonghos(projectUuid: string, params?: DonghoListParams) {
  return useQuery({
    queryKey: donghoKeys.list(projectUuid, params),
    queryFn: () => getDonghos(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 상세 조회
 */
export function useDongho(projectUuid: string, id: number) {
  return useQuery({
    queryKey: donghoKeys.detail(projectUuid, id),
    queryFn: () => getDongho(projectUuid, id),
    enabled: !!projectUuid && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 등록
 */
export function useCreateDongho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, data }: { projectUuid: string; data: DonghoRequest }) =>
      createDongho(projectUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}

/**
 * 동호 코드 수정
 */
export function useUpdateDongho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<DonghoRequest>;
    }) => updateDongho(projectUuid, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}

/**
 * 동호 코드 삭제
 */
export function useDeleteDongho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      deleteDongho(projectUuid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}

// =============================================================================
// 세대현황 Hooks (CP-SA-04-001, CP-SA-04-002)
// =============================================================================

/**
 * 세대현황 목록 조회
 */
export function useHouseholdStatus(projectUuid: string, params?: HouseholdStatusParams) {
  return useQuery({
    queryKey: donghoKeys.householdStatus(projectUuid, params),
    queryFn: () => getHouseholdStatus(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 현황입면도 조회
 */
export function useFloorPlan(projectUuid: string) {
  return useQuery({
    queryKey: donghoKeys.floorPlan(projectUuid),
    queryFn: () => getFloorPlan(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// =============================================================================
// 세대정보 상세 Hooks (CP-SA-99-001)
// =============================================================================

/**
 * 세대정보 상세 조회
 */
export function useHouseholdDetail(projectUuid: string, id: number) {
  return useQuery({
    queryKey: donghoKeys.householdDetail(projectUuid, id),
    queryFn: () => getHouseholdDetail(projectUuid, id),
    enabled: !!projectUuid && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 세대정보 수정
 */
export function useUpdateHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: HouseholdUpdateRequest;
    }) => updateHousehold(projectUuid, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}

// =============================================================================
// 입주 방문이력 Hooks (CP-SA-99-002)
// =============================================================================

/**
 * 특정 세대의 입주 방문이력 조회
 */
export function useVisitHistory(projectUuid: string, donghoId: number) {
  return useQuery({
    queryKey: donghoKeys.visitHistory(projectUuid, donghoId),
    queryFn: () => getVisitHistory(projectUuid, donghoId),
    enabled: !!projectUuid && !!donghoId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
