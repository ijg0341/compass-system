/**
 * 이사예약 React Query Hooks
 * 화면 ID: CP-SA-03-002, CP-SA-10-002
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMoveReservations,
  downloadMoveExcel,
  createOrUpdateMoveSettings,
  type MoveReservationListParams,
  type CreateMoveSettingsRequest,
} from '../lib/api/moveApi';

// =============================================================================
// Query Keys
// =============================================================================

export const moveKeys = {
  all: ['move'] as const,
  list: (projectUuid: string, params?: MoveReservationListParams) =>
    [...moveKeys.all, 'list', projectUuid, params] as const,
  settings: (projectUuid: string) =>
    [...moveKeys.all, 'settings', projectUuid] as const,
};

// =============================================================================
// 이사예약 조회 Hooks
// =============================================================================

/**
 * 이사예약 목록 조회 (설정 정보 포함)
 */
export function useMoveReservations(projectUuid: string, params?: MoveReservationListParams) {
  return useQuery({
    queryKey: moveKeys.list(projectUuid, params),
    queryFn: () => getMoveReservations(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 이사예약 엑셀 다운로드
 */
export function useDownloadMoveExcel() {
  return useMutation({
    mutationFn: ({
      projectUuid,
      params,
    }: {
      projectUuid: string;
      params?: MoveReservationListParams;
    }) => downloadMoveExcel(projectUuid, params),
  });
}

// =============================================================================
// 이사예약 설정 Hooks (스마트넷)
// =============================================================================

/**
 * 이사예약 설정 생성/수정
 */
export function useCreateOrUpdateMoveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      data,
    }: {
      projectUuid: string;
      data: CreateMoveSettingsRequest;
    }) => createOrUpdateMoveSettings(projectUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moveKeys.all });
    },
  });
}
