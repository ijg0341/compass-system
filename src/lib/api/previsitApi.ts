/**
 * 사전방문 API 서비스
 * API 문서 기준: 2025-12-04
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
// 1. 사전방문 행사 (Previsit) API
// Base URL: /previsit
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export async function getPrevisits(
  params?: PrevisitListParams
): Promise<ApiListData<Previsit>> {
  const response = await api.get<ApiResponse<ApiListData<Previsit>>>(
    '/previsit',
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 행사 상세 조회
 */
export async function getPrevisit(id: number): Promise<Previsit> {
  const response = await api.get<ApiResponse<Previsit>>(`/previsit/${id}`);
  return response.data.data;
}

/**
 * 사전방문 행사 등록
 */
export async function createPrevisit(
  data: PrevisitRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>('/previsit', data);
  return response.data.data;
}

/**
 * 사전방문 행사 수정
 */
export async function updatePrevisit(
  id: number,
  data: Partial<PrevisitRequest>
): Promise<void> {
  await api.put(`/previsit/${id}`, data);
}

/**
 * 사전방문 행사 삭제
 */
export async function deletePrevisit(id: number): Promise<void> {
  await api.delete(`/previsit/${id}`);
}

// =============================================================================
// 2. 사전방문 예약 (Previsit Reservation) API
// Base URL: /previsit-reservations
// =============================================================================

/**
 * 사전방문 예약 목록 조회
 */
export async function getPrevisitReservations(
  params?: PrevisitReservationListParams
): Promise<ApiListData<PrevisitReservation>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitReservation>>>(
    '/previsit-reservations',
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 예약 상세 조회
 */
export async function getPrevisitReservation(id: number): Promise<PrevisitReservation> {
  const response = await api.get<ApiResponse<PrevisitReservation>>(
    `/previsit-reservations/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 예약 등록
 */
export async function createPrevisitReservation(
  data: PrevisitReservationRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    '/previsit-reservations',
    data
  );
  return response.data.data;
}

/**
 * 사전방문 예약 수정
 */
export async function updatePrevisitReservation(
  id: number,
  data: Partial<PrevisitReservationRequest>
): Promise<void> {
  await api.put(`/previsit-reservations/${id}`, data);
}

/**
 * 사전방문 예약 삭제
 */
export async function deletePrevisitReservation(id: number): Promise<void> {
  await api.delete(`/previsit-reservations/${id}`);
}

/**
 * 예약 가능 일자/시간 조회
 */
export async function getPrevisitAvailableSlots(
  projectId: number
): Promise<PrevisitAvailableSlotsResponse> {
  const response = await api.get<ApiResponse<PrevisitAvailableSlotsResponse>>(
    '/previsit-reservations/available-slots',
    { params: { project_id: projectId } }
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
    '/previsit-reservations/dongs',
    { params: { project_id: projectId } }
  );
  // API가 [{ dong: "101동" }] 형식으로 반환하므로 변환
  return response.data.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회
 */
export async function getPrevisitDonghos(
  dong: string
): Promise<PrevisitDongho[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<PrevisitDongho>>>(
    '/previsit-reservations/donghos',
    { params: { dong } }
  );
  return response.data.data.list;
}

// =============================================================================
// 3. 사전방문 등록 (Previsit Data) API - 실제 방문 기록
// Base URL: /previsit-data
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export async function getPrevisitDataList(
  params?: PrevisitDataListParams
): Promise<ApiListData<PrevisitData>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitData>>>(
    '/previsit-data',
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 등록 상세 조회
 */
export async function getPrevisitData(id: number): Promise<PrevisitData> {
  const response = await api.get<ApiResponse<PrevisitData>>(
    `/previsit-data/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export async function createPrevisitData(
  data: PrevisitDataRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>('/previsit-data', data);
  return response.data.data;
}

/**
 * 사전방문 등록 수정
 */
export async function updatePrevisitData(
  id: number,
  data: Partial<PrevisitDataRequest>
): Promise<void> {
  await api.put(`/previsit-data/${id}`, data);
}

/**
 * 사전방문 등록 삭제
 */
export async function deletePrevisitData(id: number): Promise<void> {
  await api.delete(`/previsit-data/${id}`);
}

/**
 * 단말기 회수 처리
 */
export async function returnDevice(id: number): Promise<void> {
  await api.put(`/previsit-data/${id}`, {
    rental_device_return: true,
  });
}
