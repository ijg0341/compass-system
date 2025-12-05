/**
 * 사전방문 API 서비스
 * API 문서 기준: 2025-12-05
 *
 * API 경로 형식:
 * - 관리자용: /adm/project/{projectId}/...
 * - 파일: /adm/files/...
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiSimpleListData, ApiCreateResponse } from '@/src/types/api';
import type {
  Previsit,
  PrevisitRequest,
  PrevisitListParams,
  PrevisitReservation,
  PrevisitReservationRequest,
  PrevisitReservationListParams,
  PrevisitAvailableSlotsResponse,
  PrevisitData,
  PrevisitDataRequest,
  PrevisitDataListParams,
  PrevisitDongho,
} from '@/src/types/previsit.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectId: number) => `/adm/project/${projectId}`;

// =============================================================================
// 1. 사전방문 행사 (Previsit) API
// Base URL: /adm/project/{projectId}/previsit
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export async function getPrevisits(
  projectId: number,
  params?: PrevisitListParams
): Promise<ApiListData<Previsit>> {
  const response = await api.get<ApiResponse<ApiListData<Previsit>>>(
    `${getAdminBasePath(projectId)}/previsit`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 행사 상세 조회
 */
export async function getPrevisit(projectId: number, id: number): Promise<Previsit> {
  const response = await api.get<ApiResponse<Previsit>>(
    `${getAdminBasePath(projectId)}/previsit/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 행사 등록
 */
export async function createPrevisit(
  projectId: number,
  data: PrevisitRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectId)}/previsit`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 행사 수정
 */
export async function updatePrevisit(
  projectId: number,
  id: number,
  data: Partial<PrevisitRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/previsit/${id}`, data);
}

/**
 * 사전방문 행사 삭제
 */
export async function deletePrevisit(projectId: number, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectId)}/previsit/${id}`);
}

// =============================================================================
// 2. 사전방문 예약 (Previsit Reservation) API
// Base URL: /adm/project/{projectId}/previsit-reservations
// =============================================================================

/**
 * 사전방문 예약 목록 조회
 */
export async function getPrevisitReservations(
  projectId: number,
  params?: PrevisitReservationListParams
): Promise<ApiListData<PrevisitReservation>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitReservation>>>(
    `${getAdminBasePath(projectId)}/previsit-reservations`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 예약 상세 조회
 */
export async function getPrevisitReservation(
  projectId: number,
  id: number
): Promise<PrevisitReservation> {
  const response = await api.get<ApiResponse<PrevisitReservation>>(
    `${getAdminBasePath(projectId)}/previsit-reservations/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 예약 등록
 */
export async function createPrevisitReservation(
  projectId: number,
  data: PrevisitReservationRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectId)}/previsit-reservations`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 예약 수정
 */
export async function updatePrevisitReservation(
  projectId: number,
  id: number,
  data: Partial<PrevisitReservationRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/previsit-reservations/${id}`, data);
}

/**
 * 사전방문 예약 삭제
 */
export async function deletePrevisitReservation(projectId: number, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectId)}/previsit-reservations/${id}`);
}

/**
 * 예약 가능 일자/시간 조회
 */
export async function getPrevisitAvailableSlots(
  projectId: number
): Promise<PrevisitAvailableSlotsResponse> {
  const response = await api.get<ApiResponse<PrevisitAvailableSlotsResponse>>(
    `${getAdminBasePath(projectId)}/previsit-reservations/available-slots`
  );
  return response.data.data;
}

/**
 * 동 목록 조회
 */
export async function getPrevisitDongs(
  projectId: number
): Promise<string[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<{ dong: string }>>>(
    `${getAdminBasePath(projectId)}/previsit-reservations/dongs`
  );
  // API가 [{ dong: "101동" }] 형식으로 반환하므로 변환
  return response.data.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회
 */
export async function getPrevisitDonghos(
  projectId: number,
  dong?: string
): Promise<PrevisitDongho[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<PrevisitDongho>>>(
    `${getAdminBasePath(projectId)}/previsit-reservations/donghos`,
    { params: dong ? { dong } : undefined }
  );
  return response.data.data.list;
}

// =============================================================================
// 3. 사전방문 등록 (Previsit Data) API - 실제 방문 기록
// Base URL: /adm/project/{projectId}/previsit-data
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export async function getPrevisitDataList(
  projectId: number,
  params?: PrevisitDataListParams
): Promise<ApiListData<PrevisitData>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitData>>>(
    `${getAdminBasePath(projectId)}/previsit-data`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 등록 상세 조회
 */
export async function getPrevisitData(projectId: number, id: number): Promise<PrevisitData> {
  const response = await api.get<ApiResponse<PrevisitData>>(
    `${getAdminBasePath(projectId)}/previsit-data/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export async function createPrevisitData(
  projectId: number,
  data: PrevisitDataRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectId)}/previsit-data`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 등록 수정
 */
export async function updatePrevisitData(
  projectId: number,
  id: number,
  data: Partial<PrevisitDataRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/previsit-data/${id}`, data);
}

/**
 * 사전방문 등록 삭제
 */
export async function deletePrevisitData(projectId: number, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectId)}/previsit-data/${id}`);
}

/**
 * 단말기 회수 처리
 */
export async function returnDevice(projectId: number, id: number): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/previsit-data/${id}`, {
    rental_device_return: true,
  });
}
