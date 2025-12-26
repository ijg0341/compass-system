/**
 * A/S 관리 관련 React Query hooks
 * API 문서 기준: 2025-12-24
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAfterservices,
  getAfterservice,
  updateAfterservice,
  getAfterserviceOptions,
  getAscodes,
  getAscodeOptions,
  createAscode,
  updateAscode,
  getPartners,
  getAfterserviceDongs,
  getAfterserviceDonghos,
} from '@/src/lib/api/afterserviceApi';
import type { AscodeRequest } from '@/src/lib/api/afterserviceApi';
import type {
  AfterserviceListParams,
  AfterserviceUpdateRequest,
} from '@/src/types/afterservice.types';

// =============================================================================
// Query Keys
// =============================================================================

export const afterserviceKeys = {
  all: ['afterservice'] as const,
  // A/S 목록
  list: (projectUuid: string, params?: AfterserviceListParams) =>
    [...afterserviceKeys.all, 'list', projectUuid, params] as const,
  // A/S 상세
  detail: (projectUuid: string, id: number) =>
    [...afterserviceKeys.all, 'detail', projectUuid, id] as const,
  // 옵션 (상태, 형태)
  options: (projectUuid: string) =>
    [...afterserviceKeys.all, 'options', projectUuid] as const,
  // 하자코드
  ascodes: (projectUuid: string) =>
    [...afterserviceKeys.all, 'ascodes', projectUuid] as const,
  // 협력사
  partners: (projectUuid: string) =>
    [...afterserviceKeys.all, 'partners', projectUuid] as const,
  // 동 목록
  dongs: (projectUuid: string) =>
    [...afterserviceKeys.all, 'dongs', projectUuid] as const,
  // 동호 목록
  donghos: (projectUuid: string, dong?: string) =>
    [...afterserviceKeys.all, 'donghos', projectUuid, dong] as const,
};

// =============================================================================
// 1. A/S 목록/상세 Hooks
// =============================================================================

/**
 * A/S 목록 조회
 */
export function useAfterservices(
  projectUuid: string,
  params?: AfterserviceListParams
) {
  return useQuery({
    queryKey: afterserviceKeys.list(projectUuid, params),
    queryFn: () => getAfterservices(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * A/S 상세 조회
 */
export function useAfterservice(projectUuid: string, id: number) {
  return useQuery({
    queryKey: afterserviceKeys.detail(projectUuid, id),
    queryFn: () => getAfterservice(projectUuid, id),
    enabled: !!projectUuid && !!id,
  });
}

/**
 * A/S 수정
 */
export function useUpdateAfterservice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: AfterserviceUpdateRequest;
    }) => updateAfterservice(projectUuid, id, data),
    onSuccess: (_data, variables) => {
      // 목록과 상세 모두 갱신
      queryClient.invalidateQueries({
        queryKey: [...afterserviceKeys.all, 'list', variables.projectUuid],
      });
      queryClient.invalidateQueries({
        queryKey: afterserviceKeys.detail(variables.projectUuid, variables.id),
      });
    },
  });
}

// =============================================================================
// 2. 옵션 Hooks
// =============================================================================

/**
 * A/S 옵션 조회 (상태, 형태)
 */
export function useAfterserviceOptions(projectUuid: string) {
  return useQuery({
    queryKey: afterserviceKeys.options(projectUuid),
    queryFn: () => getAfterserviceOptions(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 하자코드 목록 조회
 */
export function useAscodes(projectUuid: string) {
  return useQuery({
    queryKey: afterserviceKeys.ascodes(projectUuid),
    queryFn: () => getAscodes(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 하자코드 옵션 조회 (다단구조)
 */
export function useAscodeOptions(projectUuid: string) {
  return useQuery({
    queryKey: [...afterserviceKeys.ascodes(projectUuid), 'options'],
    queryFn: () => getAscodeOptions(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 협력사 목록 조회
 */
export function usePartners(projectUuid: string) {
  return useQuery({
    queryKey: afterserviceKeys.partners(projectUuid),
    queryFn: () => getPartners(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// =============================================================================
// 3. 동/호 Hooks
// =============================================================================

/**
 * 동 목록 조회
 */
export function useAfterserviceDongs(projectUuid: string) {
  return useQuery({
    queryKey: afterserviceKeys.dongs(projectUuid),
    queryFn: () => getAfterserviceDongs(projectUuid),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 동호 목록 조회
 */
export function useAfterserviceDonghos(projectUuid: string, dong?: string) {
  return useQuery({
    queryKey: afterserviceKeys.donghos(projectUuid, dong),
    queryFn: () => getAfterserviceDonghos(projectUuid, dong),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// =============================================================================
// 4. 하자코드 Mutation Hooks
// =============================================================================

/**
 * 하자코드 등록
 */
export function useCreateAscode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      data,
    }: {
      projectUuid: string;
      data: AscodeRequest;
    }) => createAscode(projectUuid, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: afterserviceKeys.ascodes(variables.projectUuid),
      });
    },
  });
}

/**
 * 하자코드 수정
 */
export function useUpdateAscode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: AscodeRequest;
    }) => updateAscode(projectUuid, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: afterserviceKeys.ascodes(variables.projectUuid),
      });
    },
  });
}
