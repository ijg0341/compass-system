/**
 * 사전방문 관련 React Query hooks
 * API 문서 기준: 2025-12-24
 *
 * 모든 hook에 projectUuid 파라미터 필요 (URL path 형식 변경)
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
  list: (projectUuid: string, params?: PrevisitListParams) =>
    [...previsitKeys.all, 'list', projectUuid, params] as const,
  detail: (projectUuid: string, id: number) =>
    [...previsitKeys.all, 'detail', projectUuid, id] as const,

  // 사전방문 예약
  reservations: (projectUuid: string, params?: PrevisitReservationListParams) =>
    [...previsitKeys.all, 'reservations', projectUuid, params] as const,
  reservation: (projectUuid: string, id: number) =>
    [...previsitKeys.all, 'reservation', projectUuid, id] as const,
  availableSlots: (projectUuid: string, previsitId?: number) =>
    [...previsitKeys.all, 'availableSlots', projectUuid, previsitId] as const,
  dongs: (projectUuid: string) => [...previsitKeys.all, 'dongs', projectUuid] as const,
  donghos: (projectUuid: string, dong?: string) =>
    [...previsitKeys.all, 'donghos', projectUuid, dong] as const,

  // 사전방문 등록 (실제 방문 기록)
  dataList: (projectUuid: string, params?: PrevisitDataListParams) =>
    [...previsitKeys.all, 'dataList', projectUuid, params] as const,
  data: (projectUuid: string, id: number) =>
    [...previsitKeys.all, 'data', projectUuid, id] as const,
};

// =============================================================================
// 1. 사전방문 행사 Hooks
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export function usePrevisits(projectUuid: string, params?: PrevisitListParams) {
  return useQuery({
    queryKey: previsitKeys.list(projectUuid, params),
    queryFn: () => getPrevisits(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 사전방문 행사 상세 조회
 */
export function usePrevisit(projectUuid: string, id: number) {
  return useQuery({
    queryKey: previsitKeys.detail(projectUuid, id),
    queryFn: () => getPrevisit(projectUuid, id),
    enabled: !!projectUuid && !!id,
  });
}

/**
 * 사전방문 행사 등록
 */
export function useCreatePrevisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, data }: { projectUuid: string; data: PrevisitRequest }) =>
      createPrevisit(projectUuid, data),
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
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<PrevisitRequest>;
    }) => updatePrevisit(projectUuid, id, data),
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
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      deletePrevisit(projectUuid, id),
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
  projectUuid: string,
  params?: PrevisitReservationListParams
) {
  return useQuery({
    queryKey: previsitKeys.reservations(projectUuid, params),
    queryFn: () => getPrevisitReservations(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 예약 상세 조회
 */
export function usePrevisitReservation(projectUuid: string, id: number) {
  return useQuery({
    queryKey: previsitKeys.reservation(projectUuid, id),
    queryFn: () => getPrevisitReservation(projectUuid, id),
    enabled: !!projectUuid && !!id,
  });
}

/**
 * 사전방문 예약 등록
 */
export function useCreatePrevisitReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      data,
    }: {
      projectUuid: string;
      data: PrevisitReservationRequest;
    }) => createPrevisitReservation(projectUuid, data),
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
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<PrevisitReservationRequest>;
    }) => updatePrevisitReservation(projectUuid, id, data),
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
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      deletePrevisitReservation(projectUuid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 예약 가능 일자/시간 조회
 * @param projectUuid 프로젝트 UUID
 * @param previsitId 사전방문 행사 ID (특정 행사의 슬롯만 조회)
 */
export function usePrevisitAvailableSlots(projectUuid: string, previsitId?: number) {
  return useQuery({
    queryKey: previsitKeys.availableSlots(projectUuid, previsitId),
    queryFn: () => getPrevisitAvailableSlots(projectUuid, previsitId),
    enabled: !!projectUuid && !!previsitId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동 목록 조회
 */
export function usePrevisitDongs(projectUuid: string) {
  return useQuery({
    queryKey: previsitKeys.dongs(projectUuid),
    queryFn: () => getPrevisitDongs(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 동호 목록 조회
 */
export function usePrevisitDonghos(projectUuid: string, dong?: string) {
  return useQuery({
    queryKey: previsitKeys.donghos(projectUuid, dong),
    queryFn: () => getPrevisitDonghos(projectUuid, dong),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// =============================================================================
// 3. 사전방문 등록 (실제 방문 기록) Hooks
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export function usePrevisitDataList(projectUuid: string, params?: PrevisitDataListParams) {
  return useQuery({
    queryKey: previsitKeys.dataList(projectUuid, params),
    queryFn: () => getPrevisitDataList(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 등록 상세 조회
 */
export function usePrevisitData(projectUuid: string, id: number) {
  return useQuery({
    queryKey: previsitKeys.data(projectUuid, id),
    queryFn: () => getPrevisitData(projectUuid, id),
    enabled: !!projectUuid && !!id,
  });
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export function useCreatePrevisitData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, data }: { projectUuid: string; data: PrevisitDataRequest }) =>
      createPrevisitData(projectUuid, data),
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
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<PrevisitDataRequest>;
    }) => updatePrevisitData(projectUuid, id, data),
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
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      deletePrevisitData(projectUuid, id),
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
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      returnDevice(projectUuid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}
