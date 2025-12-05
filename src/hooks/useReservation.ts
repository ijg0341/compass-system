/**
 * 방문예약 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAvailableSlots,
  getDongs,
  getDongHos,
  getVisitSchedules,
  getVisitSchedule,
  createVisitSchedule,
  updateVisitSchedule,
  deleteVisitSchedule,
  updateVisitInfo,
  uploadFile,
  type VisitScheduleListParams,
  type CreateVisitScheduleRequest,
  type UpdateVisitScheduleRequest,
  type UpdateVisitInfoRequest,
} from '@/src/lib/api/reservationApi';

// Query Keys
export const reservationKeys = {
  all: ['reservation'] as const,
  availableSlots: (projectId: number) => [...reservationKeys.all, 'availableSlots', projectId] as const,
  dongs: (visitInfoId: number) => [...reservationKeys.all, 'dongs', visitInfoId] as const,
  dongHos: (visitInfoId: number, dongId?: string) => [...reservationKeys.all, 'dongHos', visitInfoId, dongId] as const,
  visitSchedules: (params?: VisitScheduleListParams) => [...reservationKeys.all, 'visitSchedules', params] as const,
  visitSchedule: (id: number) => [...reservationKeys.all, 'visitSchedule', id] as const,
};

/**
 * 예약 가능 일정 조회
 */
export function useAvailableSlots(projectId: number = 1) {
  return useQuery({
    queryKey: reservationKeys.availableSlots(projectId),
    queryFn: () => getAvailableSlots(projectId),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 동 목록 조회
 */
export function useDongs(visitInfoId: number) {
  return useQuery({
    queryKey: reservationKeys.dongs(visitInfoId),
    queryFn: () => getDongs(visitInfoId),
    enabled: !!visitInfoId,
    staleTime: 1000 * 60 * 30, // 30분 (잘 안 바뀌므로)
  });
}

/**
 * 호 목록 조회
 */
export function useDongHos(visitInfoId: number, dongId?: string) {
  return useQuery({
    queryKey: reservationKeys.dongHos(visitInfoId, dongId),
    queryFn: () => getDongHos(visitInfoId, dongId),
    enabled: !!visitInfoId,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 방문일정 목록 조회
 */
export function useVisitSchedules(params?: VisitScheduleListParams) {
  return useQuery({
    queryKey: reservationKeys.visitSchedules(params),
    queryFn: () => getVisitSchedules(params),
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 방문일정 상세 조회
 */
export function useVisitSchedule(id: number) {
  return useQuery({
    queryKey: reservationKeys.visitSchedule(id),
    queryFn: () => getVisitSchedule(id),
    enabled: !!id,
  });
}

/**
 * 방문일정 등록
 */
export function useCreateVisitSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVisitScheduleRequest) => createVisitSchedule(data),
    onSuccess: () => {
      // 방문일정 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * 방문일정 수정
 */
export function useUpdateVisitSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVisitScheduleRequest }) =>
      updateVisitSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * 방문일정 삭제
 */
export function useDeleteVisitSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVisitSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * 방문정보 수정
 */
export function useUpdateVisitInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVisitInfoRequest }) =>
      updateVisitInfo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * 파일 업로드
 */
export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, options }: {
      file: File;
      options?: {
        entityType?: string;
        entityId?: number;
        fileCategory?: string;
        isPublic?: boolean;
      };
    }) => uploadFile(file, options),
  });
}
