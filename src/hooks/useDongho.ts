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
} from '../lib/api/donghoApi';

import type { DonghoRequest, DonghoListParams } from '../types/dongho.types';

// =============================================================================
// Query Keys
// =============================================================================

export const donghoKeys = {
  all: ['dongho'] as const,
  list: (projectUuid: string, params?: DonghoListParams) =>
    [...donghoKeys.all, 'list', projectUuid, params] as const,
  detail: (projectUuid: string, id: number) =>
    [...donghoKeys.all, 'detail', projectUuid, id] as const,
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
