/**
 * 동호 관리 API 서비스
 * API 문서 기준: 2025-12-05
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type { Dongho, DonghoRequest, DonghoListParams } from '@/src/types/dongho.types';

// =============================================================================
// 동호 코드 API (CP-SA-07-001)
// Base URL: /donghos
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export async function getDonghos(params?: DonghoListParams): Promise<ApiListData<Dongho>> {
  const response = await api.get<ApiResponse<ApiListData<Dongho>>>('/donghos', { params });
  return response.data.data;
}

/**
 * 동호 코드 상세 조회
 */
export async function getDongho(id: number): Promise<Dongho> {
  const response = await api.get<ApiResponse<Dongho>>(`/donghos/${id}`);
  return response.data.data;
}

/**
 * 동호 코드 등록
 */
export async function createDongho(data: DonghoRequest): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>('/donghos', data);
  return response.data.data;
}

/**
 * 동호 코드 수정
 */
export async function updateDongho(id: number, data: Partial<DonghoRequest>): Promise<void> {
  await api.put(`/donghos/${id}`, data);
}

/**
 * 동호 코드 삭제
 */
export async function deleteDongho(id: number): Promise<void> {
  await api.delete(`/donghos/${id}`);
}
