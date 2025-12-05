/**
 * 사전방문 관련 React Query hooks
 * API 문서 기준: 2025-12-04
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
  list: (params?: PrevisitListParams) => [...previsitKeys.all, 'list', params] as const,
  detail: (id: number) => [...previsitKeys.all, 'detail', id] as const,

  // 사전방문 예약
  reservations: (params?: PrevisitReservationListParams) =>
    [...previsitKeys.all, 'reservations', params] as const,
  reservation: (id: number) => [...previsitKeys.all, 'reservation', id] as const,
  availableSlots: (projectId: number) =>
    [...previsitKeys.all, 'availableSlots', projectId] as const,
  dongs: (projectId: number) => [...previsitKeys.all, 'dongs', projectId] as const,
  donghos: (dong: string) => [...previsitKeys.all, 'donghos', dong] as const,

  // 사전방문 등록 (실제 방문 기록)
  dataList: (params?: PrevisitDataListParams) =>
    [...previsitKeys.all, 'dataList', params] as const,
  data: (id: number) => [...previsitKeys.all, 'data', id] as const,
};

// =============================================================================
// 1. 사전방문 행사 Hooks
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export function usePrevisits(params?: PrevisitListParams) {
  return useQuery({
    queryKey: previsitKeys.list(params),
    queryFn: () => getPrevisits(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 사전방문 행사 상세 조회
 */
export function usePrevisit(id: number) {
  return useQuery({
    queryKey: previsitKeys.detail(id),
    queryFn: () => getPrevisit(id),
    enabled: !!id,
  });
}

/**
 * 사전방문 행사 등록
 */
export function useCreatePrevisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrevisitRequest) => createPrevisit(data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<PrevisitRequest> }) =>
      updatePrevisit(id, data),
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
    mutationFn: (id: number) => deletePrevisit(id),
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
export function usePrevisitReservations(params?: PrevisitReservationListParams) {
  return useQuery({
    queryKey: previsitKeys.reservations(params),
    queryFn: () => getPrevisitReservations(params),
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 예약 상세 조회
 */
export function usePrevisitReservation(id: number) {
  return useQuery({
    queryKey: previsitKeys.reservation(id),
    queryFn: () => getPrevisitReservation(id),
    enabled: !!id,
  });
}

/**
 * 사전방문 예약 등록
 */
export function useCreatePrevisitReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrevisitReservationRequest) => createPrevisitReservation(data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<PrevisitReservationRequest> }) =>
      updatePrevisitReservation(id, data),
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
    mutationFn: (id: number) => deletePrevisitReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}

/**
 * 예약 가능 일자/시간 조회
 */
export function usePrevisitAvailableSlots(projectId: number) {
  return useQuery({
    queryKey: previsitKeys.availableSlots(projectId),
    queryFn: () => getPrevisitAvailableSlots(projectId),
    enabled: !!projectId,
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
export function usePrevisitDonghos(dong?: string) {
  return useQuery({
    queryKey: previsitKeys.donghos(dong || ''),
    queryFn: () => getPrevisitDonghos(dong!),
    enabled: !!dong,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// =============================================================================
// 3. 사전방문 등록 (실제 방문 기록) Hooks
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export function usePrevisitDataList(params?: PrevisitDataListParams) {
  return useQuery({
    queryKey: previsitKeys.dataList(params),
    queryFn: () => getPrevisitDataList(params),
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 사전방문 등록 상세 조회
 */
export function usePrevisitData(id: number) {
  return useQuery({
    queryKey: previsitKeys.data(id),
    queryFn: () => getPrevisitData(id),
    enabled: !!id,
  });
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export function useCreatePrevisitData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrevisitDataRequest) => createPrevisitData(data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<PrevisitDataRequest> }) =>
      updatePrevisitData(id, data),
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
    mutationFn: (id: number) => deletePrevisitData(id),
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
    mutationFn: (id: number) => returnDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: previsitKeys.all });
    },
  });
}
