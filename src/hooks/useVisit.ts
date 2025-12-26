/**
 * 입주방문등록 React Query Hooks
 * 화면 ID: CP-SA-03-001
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVisits,
  createVisit,
  downloadVisitExcel,
  uploadVisitExcel,
  type VisitListParams,
  type CreateVisitRequest,
} from '../lib/api/visitApi';

// =============================================================================
// Query Keys
// =============================================================================

export const visitKeys = {
  all: ['visit'] as const,
  list: (projectUuid: string, params?: VisitListParams) =>
    [...visitKeys.all, 'list', projectUuid, params] as const,
};

// =============================================================================
// 입주방문 Hooks
// =============================================================================

/**
 * 입주방문 목록 조회
 */
export function useVisits(projectUuid: string, params?: VisitListParams) {
  return useQuery({
    queryKey: visitKeys.list(projectUuid, params),
    queryFn: () => getVisits(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 입주방문 등록
 */
export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      data,
    }: {
      projectUuid: string;
      data: CreateVisitRequest;
    }) => createVisit(projectUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

/**
 * 입주방문 엑셀 다운로드
 */
export function useDownloadVisitExcel() {
  return useMutation({
    mutationFn: ({
      projectUuid,
      params,
    }: {
      projectUuid: string;
      params?: VisitListParams;
    }) => downloadVisitExcel(projectUuid, params),
  });
}

/**
 * 입주방문 엑셀 업로드
 */
export function useUploadVisitExcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, file }: { projectUuid: string; file: File }) =>
      uploadVisitExcel(projectUuid, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}
