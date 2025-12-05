/**
 * 사전방문 관련 타입 정의
 * API 문서 기준: 2025-12-04
 */

import type { ApiDateResponse } from './api';

// =============================================================================
// 1. 사전방문 행사 (Previsit)
// =============================================================================

/** 사전방문 행사 정보 */
export interface Previsit {
  id: number;
  uuid: string;               // UUID (고객용 URL 접근에 사용)
  project_id: number;
  name: string;
  date_begin: string | ApiDateResponse;  // YYYY-MM-DD 또는 API 날짜 객체
  date_end: string | ApiDateResponse;    // YYYY-MM-DD 또는 API 날짜 객체
  max_limit: number | null;   // 시간대별 최대 예약 수
  time_first: string;         // HH:mm:ss
  time_last: string;          // HH:mm:ss
  time_unit: number;          // 30 | 60 (분)
  image_file_id: number | null;
}

/** 사전방문 행사 등록/수정 요청 (project_id는 URL path로 전달) */
export interface PrevisitRequest {
  name: string;
  date_begin: string;         // YYYY-MM-DD
  date_end: string;           // YYYY-MM-DD
  max_limit?: number;
  time_first: string;         // HH:mm
  time_last: string;          // HH:mm
  time_unit: number;          // 30 | 60
  image_file_id?: number;
}

/** 사전방문 행사 목록 조회 파라미터 (project_id는 URL path로 전달) */
export interface PrevisitListParams {
  offset?: number;
  limit?: number;
}

// =============================================================================
// 2. 사전방문 예약 (Previsit Reservation)
// =============================================================================

/** 사전방문 예약 정보 */
export interface PrevisitReservation {
  id: number;
  previsit_id: number;
  dongho_id: number;
  reservation_date: string | ApiDateResponse;
  reservation_time: string;
  writer_name: string;
  writer_phone: string;
  memo: string | null;
  // 조회 시 추가되는 정보
  dong?: string;
  ho?: string;
  contractor_name?: string;
  contractor_phone?: string;
}

/** 사전방문 예약 등록/수정 요청 */
export interface PrevisitReservationRequest {
  previsit_id: number;
  dongho_id: number;
  reservation_date: string;   // YYYY-MM-DD
  reservation_time: string;   // HH:mm
  writer_name: string;
  writer_phone: string;
  memo?: string;
}

/** 사전방문 예약 목록 조회 파라미터 */
export interface PrevisitReservationListParams {
  searchKeyword?: string;
  dongho_id?: number;
  previsit_id?: number;
  offset?: number;
  limit?: number;
}

/** 예약 가능 시간 슬롯 */
export interface PrevisitAvailableTimeSlot {
  time: string;               // HH:mm:ss
  available: number;          // 남은 예약 가능 수
}

/** 예약 가능 날짜 */
export interface PrevisitAvailableDate {
  date: string;               // YYYY-MM-DD
  times: PrevisitAvailableTimeSlot[];
}

/** 예약 가능 일정 응답 */
export interface PrevisitAvailableSlotsResponse {
  previsit_id: number;
  date_begin: string;
  date_end: string;
  time_first: string;
  time_last: string;
  time_unit: number;
  max_limit: number;
  dates: PrevisitAvailableDate[];
}

// =============================================================================
// 3. 사전방문 등록 (Previsit Data) - 실제 방문 기록
// =============================================================================

/** 사전방문 등록 (실제 방문 기록) */
export interface PrevisitData {
  id: number;
  previsit_id: number;
  dongho_id: number;
  visit_date: string | ApiDateResponse;
  visit_time: string;
  visitor_name: string;
  visitor_phone: string;
  companion: string | null;           // 동행자 정보
  rental_device_no: string | null;    // 단말기 번호
  rental_device_return: boolean;      // 단말기 회수 여부
  // 조회 시 추가되는 정보
  dong?: string;
  ho?: string;
  contractor_name?: string;
  contractor_phone?: string;
  residence_type?: string;            // 입주형태
  move_in_scheduled_date?: string;    // 입주예정일
  move_in_date?: string;              // 입주예정일 (별칭)
  // 예약 정보 (조인 조회 시)
  reservation_writer_name?: string;   // 예약자명
  reservation_date?: string | ApiDateResponse;  // 예약일
  reservation_time?: string;          // 예약시간
  reservation_writer_phone?: string;  // 예약자 연락처
  reservation_memo?: string;          // 예약 메모
}

/** 사전방문 등록 요청 */
export interface PrevisitDataRequest {
  previsit_id: number;
  dongho_id: number;
  visit_date: string;           // YYYY-MM-DD
  visit_time: string;           // HH:mm
  visitor_name: string;
  visitor_phone: string;
  companion?: string;
  rental_device_no?: string;
  rental_device_return?: boolean;
}

/** 사전방문 등록 목록 조회 파라미터 */
export interface PrevisitDataListParams {
  previsit_id?: number;
  searchKeyword?: string;       // 이름/연락처 검색
  dong?: string;
  ho?: string;
  rental_device_no?: string;
  rental_device_return?: boolean;
  offset?: number;
  limit?: number;
}

// =============================================================================
// 4. 동/호 정보
// =============================================================================

/** 동 정보 */
export interface PrevisitDong {
  dong: string;
}

/** 동호 정보 */
export interface PrevisitDongho {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;   // 타입/평수
  contractor_name?: string;   // 계약자명
  contractor_phone?: string;  // 계약자 연락처
}

// =============================================================================
// 5. UI용 확장 타입
// =============================================================================

/** 사전방문 목록 테이블 표시용 */
export interface PrevisitListItem extends Previsit {
  reservation_count?: number;  // 예약 수
  visit_count?: number;        // 방문 수
}

/** 입주형태 */
export type ResidenceType = 'owner' | 'tenant' | 'monthly';  // 자가/전세/월세

export const RESIDENCE_TYPE_LABELS: Record<ResidenceType, string> = {
  owner: '자가',
  tenant: '전세',
  monthly: '월세',
};
