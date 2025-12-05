/**
 * 동호 관리 API 서비스
 * API 문서 기준: 2025-12-05
 *
 * API 경로 형식:
 * - 관리자용: /adm/project/{projectId}/donghos
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type { Dongho, DonghoRequest, DonghoListParams } from '@/src/types/dongho.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectId: number) => `/adm/project/${projectId}`;

// =============================================================================
// 동호 코드 API (CP-SA-07-001)
// Base URL: /adm/project/{projectId}/donghos
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export async function getDonghos(
  projectId: number,
  params?: DonghoListParams
): Promise<ApiListData<Dongho>> {
  const response = await api.get<ApiResponse<ApiListData<Dongho>>>(
    `${getAdminBasePath(projectId)}/donghos`,
    { params }
  );
  return response.data.data;
}

/**
 * 동호 코드 상세 조회
 */
export async function getDongho(projectId: number, id: number): Promise<Dongho> {
  const response = await api.get<ApiResponse<Dongho>>(
    `${getAdminBasePath(projectId)}/donghos/${id}`
  );
  return response.data.data;
}

/**
 * 동호 코드 등록
 */
export async function createDongho(
  projectId: number,
  data: DonghoRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectId)}/donghos`,
    data
  );
  return response.data.data;
}

/**
 * 동호 코드 수정
 */
export async function updateDongho(
  projectId: number,
  id: number,
  data: Partial<DonghoRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/donghos/${id}`, data);
}

/**
 * 동호 코드 삭제
 */
export async function deleteDongho(projectId: number, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectId)}/donghos/${id}`);
}
