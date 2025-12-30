/**
 * 이사예약 API 서비스
 * API 문서 기준: 2025-12-26
 * 화면 ID: CP-SA-03-002, CP-SA-10-002
 *
 * API 경로:
 * - 조회용: /adm/project/{projectUuid}/move
 * - 생성용: /adm/project/{projectUuid}/smartnet/move
 */
import { api } from './client';
import type { ApiResponse } from '@/src/types/api';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getMoveBasePath = (projectUuid: string) => `/adm/project/${projectUuid}/move`;
const getSmartnetMovePath = (projectUuid: string) => `/adm/project/${projectUuid}/smartnet/move`;

// =============================================================================
// 타입 정의
// =============================================================================

/** 이사예약 아이템 (API 응답) */
export interface MoveReservation {
  id: number;
  dongho_id: number;
  dong: string;
  ho: string;
  reservation_evline: string;
  reservation_date: string;
  reservation_time: string;
  created_at: string;
  // 관련 정보
  resident_name: string | null;
  resident_phone: string | null;
  resident_date: string | null;
}

/** 이사예약 목록 조회 파라미터 */
export interface MoveReservationListParams {
  page?: number;
  limit?: number;
  dong?: string;
  ho?: string;
  resident_name?: string;
  resident_date?: string;
  reservation_date?: string;
}

/** 날짜 객체 형태 (API 응답) */
interface DateObject {
  date: string;
  timezone_type: number;
  timezone: string;
}

/** 이사예약 설정 정보 (API 응답) */
export interface MoveSettings {
  id: number;
  project_id: number;
  uuid: string;
  date_begin: DateObject | string;
  date_end: DateObject | string;
  time_first: string;
  time_last: string;
  time_unit: number;
}

/** 날짜 추출 헬퍼 */
export function extractDate(dateField: DateObject | string | null): string {
  if (!dateField) return '';
  if (typeof dateField === 'string') return dateField.slice(0, 10);
  return dateField.date.slice(0, 10);
}

/** 이사예약 생성/수정 요청 */
export interface CreateMoveSettingsRequest {
  date_begin: string;
  date_end: string;
  time_first: string;
  time_last: string;
  time_unit: number;
}

// =============================================================================
// 이사간격 상수
// =============================================================================

export const MOVE_TIME_UNITS = [
  { value: 60, label: '1시간' },
  { value: 120, label: '2시간' },
  { value: 180, label: '3시간' },
] as const;

// =============================================================================
// Move API (조회)
// =============================================================================

/** 이사예약 목록 + 설정 정보 응답 (프론트용) */
export interface MoveListResponse {
  settings: MoveSettings | null;
  list: MoveReservation[];
  total: number;
}

/**
 * 이사예약 조회 (설정 정보 + 예약 목록)
 */
export async function getMoveReservations(
  projectUuid: string,
  params?: MoveReservationListParams
): Promise<MoveListResponse> {
  // page를 offset으로 변환
  const apiParams: Record<string, unknown> = { ...params };
  if (params?.page !== undefined && params?.limit !== undefined) {
    apiParams.offset = (params.page - 1) * params.limit;
    delete apiParams.page;
  }

  const response = await api.get<ApiResponse<MoveSettings | null>>(
    getMoveBasePath(projectUuid),
    { params: apiParams }
  );

  // API가 settings 객체를 직접 반환
  const data = response.data.data;
  return {
    settings: data,
    list: [],
    total: 0,
  };
}

/**
 * 이사예약 엑셀 다운로드
 */
export async function downloadMoveExcel(
  projectUuid: string,
  params?: MoveReservationListParams
): Promise<void> {
  const response = await api.get(`${getMoveBasePath(projectUuid)}/excel`, {
    params,
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `move_reservation_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// =============================================================================
// Smartnet Move API (생성/수정)
// =============================================================================

/**
 * 이사예약 설정 생성/수정
 */
export async function createOrUpdateMoveSettings(
  projectUuid: string,
  data: CreateMoveSettingsRequest
): Promise<{ id: number; uuid: string }> {
  const response = await api.post<ApiResponse<{ id: number; uuid: string }>>(
    getSmartnetMovePath(projectUuid),
    data
  );
  return response.data.data;
}

/**
 * 이사예약 URL 생성
 */
export function getMoveUrl(uuid: string): string {
  return `https://customer.compass1998.com/move/${uuid}/`;
}
