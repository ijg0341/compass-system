/**
 * 사전방문 관련 React Query hooks
 * API 문서 기준: 2025-12-05
 *
 * 모든 hook에 projectId 파라미터 필요 (URL path 형식 변경)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // 사전방문 행사
  getPrevisits,
  getPrevisit,
  createPrevisit,
  updatePrevisit,
  deletePrevisit,
  // 사전방문 예약
  getPrevisitReservations,
  getPrevisitReservation,
  createPrevisitReservation,
  updatePrevisitReservation,
  deletePrevisitReservation,
  getPrevisitAvailableSlots,
  getPrevisitDongs,
  getPrevisitDonghos,
  // 사전방문 등록 (실제 방문 기록)
  getPrevisitDataList,
  getPrevisitData,
  createPrevisitData,
  updatePrevisitData,
  deletePrevisitData,
  returnDevice,
} from '@/src/lib/api/previsitApi';
import type {
  PrevisitRequest,
  PrevisitListParams,
  PrevisitReservationRequest,
  PrevisitReservationListParams,
  PrevisitDataRequest,
  PrevisitDataListParams,
} from '@/src/types/previsit.types';

// =============================================================================
// Query Keys
// =============================================================================

export const previsitKeys = {
  all: ['previsit'] as const,

  // 사전방문 행사
  list: (projectId: number, params?: PrevisitListParams) =>
    [...previsitKeys.all, 'list', projectId, params] as const,
  detail: (projectId: number, id: number) =>
    [...previsitKeys.all, 'detail', projectId, id] as const,

  // 사전방문 예약
  reservations: (projectId: number, params?: PrevisitReservationListParams) =>
    [...previsitKeys.all, 'reservations', projectId, params] as const,
  reservation: (projectId: number, id: number) =>
    [...previsitKeys.all, 'reservation', projectId, id] as const,
  availableSlots: (projectId: number, previsitId?: number) =>
    [...previsitKeys.all, 'availableSlots', projectId, previsitId] as const,
  dongs: (projectId: number) => [...previsitKeys.all, 'dongs', projectId] as const,
  donghos: (projectId: number, dong?: string) =>
    [...previsitKeys.all, 'donghos', projectId, dong] as const,

  // 사전방문 등록 (실제 방문 기록)
  dataList: (projectId: number, params?: PrevisitDataListParams) =>
    [...previsitKeys.all, 'dataList', projectId, params] as const,
  data: (projectId: number, id: number) =>
    [...previsitKeys.all, 'data', projectId, id] as const,
};

// =============================================================================
// 1. 사전방문 행사 Hooks
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export function usePrevisits(projectId: number, params?: PrevisitListParams) {
  return useQuery({
    queryKey: previsitKeys.list(projectId, params),
    queryFn: () => getPrevisits(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 사전방문 행사 상세 조회
 */
export function usePrevisit(projectId: number, id: number) {
  return useQuery({
    queryKey: previsitKeys.detail(projectId, id),
    queryFn: () => getPrevisit(projectId, id),
    enabled: !!projectId && !!id,
  });
}

/**
 * 사전방문 행사 등록
 */
export function useCreatePrevisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: PrevisitRequest }) =>
      createPrevisit(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 행사 수정
 */
export function useUpdatePrevisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      id,
      data,
    }: {
      projectId: number;
      id: number;
      data: Partial<PrevisitRequest>;
    }) => updatePrevisit(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 행사 삭제
 */
export function useDeletePrevisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      deletePrevisit(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

// =============================================================================
// 2. 사전방문 예약 Hooks
// =============================================================================

/**
 * 사전방문 예약 목록 조회
 */
export function usePrevisitReservations(
  projectId: number,
  params?: PrevisitReservationListParams
) {
  return useQuery({
    queryKey: previsitKeys.reservations(projectId, params),
    queryFn: () => getPrevisitReservations(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 예약 상세 조회
 */
export function usePrevisitReservation(projectId: number, id: number) {
  return useQuery({
    queryKey: previsitKeys.reservation(projectId, id),
    queryFn: () => getPrevisitReservation(projectId, id),
    enabled: !!projectId && !!id,
  });
}

/**
 * 사전방문 예약 등록
 */
export function useCreatePrevisitReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: PrevisitReservationRequest;
    }) => createPrevisitReservation(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 예약 수정
 */
export function useUpdatePrevisitReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      id,
      data,
    }: {
      projectId: number;
      id: number;
      data: Partial<PrevisitReservationRequest>;
    }) => updatePrevisitReservation(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 예약 삭제
 */
export function useDeletePrevisitReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      deletePrevisitReservation(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 예약 가능 일자/시간 조회
 * @param projectId 프로젝트 ID
 * @param previsitId 사전방문 행사 ID (특정 행사의 슬롯만 조회)
 */
export function usePrevisitAvailableSlots(projectId: number, previsitId?: number) {
  return useQuery({
    queryKey: previsitKeys.availableSlots(projectId, previsitId),
    queryFn: () => getPrevisitAvailableSlots(projectId, previsitId),
    enabled: !!projectId && !!previsitId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동 목록 조회
 */
export function usePrevisitDongs(projectId: number) {
  return useQuery({
    queryKey: previsitKeys.dongs(projectId),
    queryFn: () => getPrevisitDongs(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 동호 목록 조회
 */
export function usePrevisitDonghos(projectId: number, dong?: string) {
  return useQuery({
    queryKey: previsitKeys.donghos(projectId, dong),
    queryFn: () => getPrevisitDonghos(projectId, dong),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// =============================================================================
// 3. 사전방문 등록 (실제 방문 기록) Hooks
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export function usePrevisitDataList(projectId: number, params?: PrevisitDataListParams) {
  return useQuery({
    queryKey: previsitKeys.dataList(projectId, params),
    queryFn: () => getPrevisitDataList(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 등록 상세 조회
 */
export function usePrevisitData(projectId: number, id: number) {
  return useQuery({
    queryKey: previsitKeys.data(projectId, id),
    queryFn: () => getPrevisitData(projectId, id),
    enabled: !!projectId && !!id,
  });
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export function useCreatePrevisitData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: PrevisitDataRequest }) =>
      createPrevisitData(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 등록 수정
 */
export function useUpdatePrevisitData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      id,
      data,
    }: {
      projectId: number;
      id: number;
      data: Partial<PrevisitDataRequest>;
    }) => updatePrevisitData(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 사전방문 등록 삭제
 */
export function useDeletePrevisitData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      deletePrevisitData(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 단말기 회수 처리
 */
export function useReturnDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      returnDevice(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}
