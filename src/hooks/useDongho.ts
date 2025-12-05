/**
 * 동호 관리 React Query Hooks
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
  list: (params?: DonghoListParams) => [...donghoKeys.all, 'list', params] as const,
  detail: (id: number) => [...donghoKeys.all, 'detail', id] as const,
};

// =============================================================================
// 동호 코드 Hooks (CP-SA-07-001)
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export function useDonghos(params?: DonghoListParams) {
  return useQuery({
    queryKey: donghoKeys.list(params),
    queryFn: () => getDonghos(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 상세 조회
 */
export function useDongho(id: number) {
  return useQuery({
    queryKey: donghoKeys.detail(id),
    queryFn: () => getDongho(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동호 코드 등록
 */
export function useCreateDongho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DonghoRequest) => createDongho(data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<DonghoRequest> }) =>
      updateDongho(id, data),
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
    mutationFn: (id: number) => deleteDongho(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donghoKeys.all });
    },
  });
}
