/**
 * 동호 관리 React Query Hooks
 * API 문서 기준: 2025-12-05
 *
 * 모든 hook에 projectId 파라미터 필요 (URL path 형식 변경)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getDonghos,
  getDongho,
  createDongho,
  updateDongho,
  deleteDongho,
} from '../lib/api/donghoApi';

import type { DonghoRequest, DonghoListParams } from '../types/dongho.types';

// =============================================================================
// Query Keys
// =============================================================================

export const donghoKeys = {
  all: ['dongho'] as const,
  list: (projectId: number, params?: DonghoListParams) =>
    [...donghoKeys.all, 'list', projectId, params] as const,
  detail: (projectId: number, id: number) =>
    [...donghoKeys.all, 'detail', projectId, id] as const,
};

// =============================================================================
// 동호 코드 Hooks (CP-SA-07-001)
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export function useDonghos(projectId: number, params?: DonghoListParams) {
  return useQuery({
    queryKey: donghoKeys.list(projectId, params),
    queryFn: () => getDonghos(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 상세 조회
 */
export function useDongho(projectId: number, id: number) {
  return useQuery({
    queryKey: donghoKeys.detail(projectId, id),
    queryFn: () => getDongho(projectId, id),
    enabled: !!projectId && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 등록
 */
export function useCreateDongho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: DonghoRequest }) =>
      createDongho(projectId, data),
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
      projectId,
      id,
      data,
    }: {
      projectId: number;
      id: number;
      data: Partial<DonghoRequest>;
    }) => updateDongho(projectId, id, data),
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
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      deleteDongho(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}
