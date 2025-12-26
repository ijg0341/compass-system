/**
 * 사전방문 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로 형식:
 * - 조회용: /adm/project/{projectUuid}/previsit
 * - 관리용(CUD): /adm/project/{projectUuid}/smartnet/previsit
 * - 등록관리: /adm/project/{projectUuid}/previsit/data
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

const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;

// =============================================================================
// 1. 사전방문 행사 (Previsit) API
// 조회: /adm/project/{projectUuid}/previsit
// 관리: /adm/project/{projectUuid}/smartnet/previsit
// =============================================================================

/**
 * 사전방문 행사 목록 조회
 */
export async function getPrevisits(
  projectUuid: string,
  params?: PrevisitListParams
): Promise<ApiListData<Previsit>> {
  const response = await api.get<ApiResponse<ApiListData<Previsit>>>(
    `${getAdminBasePath(projectUuid)}/previsit`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 행사 상세 조회
 */
export async function getPrevisit(projectUuid: string, id: number): Promise<Previsit> {
  const response = await api.get<ApiResponse<Previsit>>(
    `${getAdminBasePath(projectUuid)}/previsit/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 행사 등록 (smartnet 모듈)
 */
export async function createPrevisit(
  projectUuid: string,
  data: PrevisitRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectUuid)}/smartnet/previsit`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 행사 수정 (smartnet 모듈)
 */
export async function updatePrevisit(
  projectUuid: string,
  id: number,
  data: Partial<PrevisitRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/smartnet/previsit/${id}`, data);
}

/**
 * 사전방문 행사 삭제 (smartnet 모듈)
 */
export async function deletePrevisit(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectUuid)}/smartnet/previsit/${id}`);
}

// =============================================================================
// 2. 사전방문 예약 (Previsit Reservation) API
// Base URL: /adm/project/{projectUuid}/previsit-reservations
// =============================================================================

/**
 * 사전방문 예약 목록 조회
 */
export async function getPrevisitReservations(
  projectUuid: string,
  params?: PrevisitReservationListParams
): Promise<ApiListData<PrevisitReservation>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitReservation>>>(
    `${getAdminBasePath(projectUuid)}/previsit-reservations`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 예약 상세 조회
 */
export async function getPrevisitReservation(
  projectUuid: string,
  id: number
): Promise<PrevisitReservation> {
  const response = await api.get<ApiResponse<PrevisitReservation>>(
    `${getAdminBasePath(projectUuid)}/previsit-reservations/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 예약 등록
 */
export async function createPrevisitReservation(
  projectUuid: string,
  data: PrevisitReservationRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectUuid)}/previsit-reservations`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 예약 수정
 */
export async function updatePrevisitReservation(
  projectUuid: string,
  id: number,
  data: Partial<PrevisitReservationRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/previsit-reservations/${id}`, data);
}

/**
 * 사전방문 예약 삭제
 */
export async function deletePrevisitReservation(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectUuid)}/previsit-reservations/${id}`);
}

/**
 * 예약 가능 일자/시간 조회
 * @param projectUuid 프로젝트 UUID
 * @param previsitId 사전방문 행사 ID (특정 행사의 슬롯만 조회)
 */
export async function getPrevisitAvailableSlots(
  projectUuid: string,
  previsitId?: number
): Promise<PrevisitAvailableSlotsResponse> {
  const response = await api.get<ApiResponse<PrevisitAvailableSlotsResponse>>(
    `${getAdminBasePath(projectUuid)}/previsit-reservations/available-slots`,
    { params: previsitId ? { previsit_id: previsitId } : undefined }
  );
  return response.data.data;
}

/**
 * 동 목록 조회 (common 모듈)
 */
export async function getPrevisitDongs(
  projectUuid: string
): Promise<string[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<{ dong: string }>>>(
    `${getAdminBasePath(projectUuid)}/common/dongs`
  );
  // API가 [{ dong: "101동" }] 형식으로 반환하므로 변환
  return response.data.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회 (common 모듈)
 */
export async function getPrevisitDonghos(
  projectUuid: string,
  dong?: string
): Promise<PrevisitDongho[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<PrevisitDongho>>>(
    `${getAdminBasePath(projectUuid)}/common/donghos`,
    { params: dong ? { dong } : undefined }
  );
  return response.data.data.list;
}

// =============================================================================
// 3. 사전방문 등록 (Previsit Data) API - 실제 방문 기록
// Base URL: /adm/project/{projectUuid}/previsit/data
// =============================================================================

/**
 * 사전방문 등록 목록 조회
 */
export async function getPrevisitDataList(
  projectUuid: string,
  params?: PrevisitDataListParams
): Promise<ApiListData<PrevisitData>> {
  const response = await api.get<ApiResponse<ApiListData<PrevisitData>>>(
    `${getAdminBasePath(projectUuid)}/previsit/data`,
    { params }
  );
  return response.data.data;
}

/**
 * 사전방문 등록 상세 조회
 */
export async function getPrevisitData(projectUuid: string, id: number): Promise<PrevisitData> {
  const response = await api.get<ApiResponse<PrevisitData>>(
    `${getAdminBasePath(projectUuid)}/previsit/data/${id}`
  );
  return response.data.data;
}

/**
 * 사전방문 등록 (실제 방문 기록 추가)
 */
export async function createPrevisitData(
  projectUuid: string,
  data: PrevisitDataRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectUuid)}/previsit/data`,
    data
  );
  return response.data.data;
}

/**
 * 사전방문 등록 수정
 */
export async function updatePrevisitData(
  projectUuid: string,
  id: number,
  data: Partial<PrevisitDataRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/previsit/data/${id}`, data);
}

/**
 * 사전방문 등록 삭제
 */
export async function deletePrevisitData(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectUuid)}/previsit/data/${id}`);
}

/**
 * 단말기 회수 처리
 */
export async function returnDevice(projectUuid: string, id: number): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/previsit/data/${id}`, {
    rental_device_return: true,
  });
}

// =============================================================================
// 4. 엑셀 다운로드 API
// =============================================================================

/**
 * 엑셀 파일 다운로드 공통 유틸
 */
async function downloadExcel(url: string, defaultFilename: string): Promise<void> {
  const response = await api.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : defaultFilename;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

/**
 * 사전방문 예약 엑셀 다운로드
 * @param projectUuid 프로젝트 UUID
 * @param previsitId 사전방문 행사 ID (선택)
 */
export async function downloadPrevisitReservationsExcel(
  projectUuid: string,
  previsitId?: number
): Promise<void> {
  const url = previsitId
    ? `${getAdminBasePath(projectUuid)}/previsit-reservations/excel?previsit_id=${previsitId}`
    : `${getAdminBasePath(projectUuid)}/previsit-reservations/excel`;

  await downloadExcel(url, `previsit_reservations_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * 사전방문 등록 엑셀 다운로드
 * @param projectUuid 프로젝트 UUID
 * @param previsitId 사전방문 행사 ID (선택)
 */
export async function downloadPrevisitDataExcel(
  projectUuid: string,
  previsitId?: number
): Promise<void> {
  const url = previsitId
    ? `${getAdminBasePath(projectUuid)}/previsit/data/excel?previsit_id=${previsitId}`
    : `${getAdminBasePath(projectUuid)}/previsit/data/excel`;

  await downloadExcel(url, `previsit_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
