/**
 * 동호 관리 관련 타입 정의
 * 화면 ID: CP-SA-07-001 (기초코드관리 - 동/호)
 */

// =============================================================================
// 동호 코드 (CP-SA-07-001)
// =============================================================================

/** 동호 코드 정보 (API 응답) */
export interface Dongho {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;
  ev_lines: string[] | null;
  // 계약자 정보
  contractor_name: string | null;
  contractor_phone: string | null;
  contractor_birth: string | null;
  // 입주자 정보
  resident_name: string | null;
  resident_phone: string | null;
  resident_birth: string | null;
  resident_type: string | null;
  resident_date: string | null;
  level: string | null;
}

/** 동호 코드 등록/수정 요청
 * @note contractor 필드는 2025-12-05부터 dongho_household 테이블로 분리되어
 *       등록/수정 시 더 이상 사용되지 않음 (조회 시에는 자동 조인됨)
 */
export interface DonghoRequest {
  dong: string;
  ho: string;
  unit_type?: string;
  ev_lines?: string[];
}

/** 동호 코드 목록 조회 파라미터 */
export interface DonghoListParams {
  dong?: string;
}

// =============================================================================
// 세대현황 (CP-SA-04-001, CP-SA-04-002)
// =============================================================================

/** API 날짜 객체 형식 (PHP DateTime) */
export interface ApiDateObject {
  date: string;
  timezone_type: number;
  timezone: string;
}

/** 날짜 필드 타입 (문자열 또는 객체) */
export type DateField = string | ApiDateObject | null;

/** 날짜 객체에서 문자열 추출 헬퍼 */
export function extractDateString(date: DateField): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date;
  // 객체인 경우 date 필드에서 날짜 부분만 추출
  return date.date.split(' ')[0];
}

/** 세대현황 목록 아이템 (API 응답) */
export interface HouseholdStatus {
  id: number;
  dong: string;
  ho: string;
  unit_type?: string | null;
  ev_lines?: string[] | null;
  // 입주자 정보
  resident_name: string | null;
  resident_phone: string | null;
  resident_date: DateField;
  level?: string | null;
  // 계약자 정보
  contractor_name: string | null;
  contractor_phone?: string | null;
  // 메모
  memo?: string | null;
  // 이사예약
  move_date: DateField;
  // 키불출 정보
  key_date: DateField;
  keyman_name: string | null;
  // 검침 정보
  meter_date: DateField;
  meter_gas: string | null;
  meter_water: string | null;
  meter_heating: string | null;
  meter_hotwater: string | null;
  meterman_name: string | null;
  // 지급품 정보
  give_date: DateField;
  give_items: Record<string, boolean> | unknown[] | null;
  giveman_name: string | null;
}

/** 세대현황 목록 조회 파라미터 */
export interface HouseholdStatusParams {
  page?: number;
  limit?: number;
  dong?: string;
  ho?: string;
  contractor_name?: string;
  date_begin?: string;
  date_end?: string;
  tab?: 'key' | 'meter' | 'give';
}

/** 현황입면도 호 정보 */
export interface FloorPlanHo {
  id: number;
  ho: string;
  meter_date: DateField;
  key_date: DateField;
  move_date: DateField;
  resident_date: DateField;
}

/** 현황입면도 응답 데이터 - 동별 라인별 호 목록 */
export type FloorPlanData = Record<string, FloorPlanHo[][]>;

// =============================================================================
// 세대정보 상세 (CP-SA-99-001)
// =============================================================================

/** 세대정보 상세 (API 응답) */
export interface HouseholdDetail {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;
  ev_lines: string[] | null;
  // 기본 정보
  contractor_name: string | null;
  contractor_phone: string | null;
  contractor_birth: string | null;
  resident_name: string | null;
  resident_phone: string | null;
  resident_birth: string | null;
  resident_type: string | null;
  resident_date: string | null;
  level: string | null;
  // 회원 정보
  user_id: string | null;
  // 메모 (숨김 필드)
  memo: string | null;
  // 검침 정보
  meter_date: string | null;
  meter_electric: string | null;
  meter_water: string | null;
  meter_gas: string | null;
  meter_heating: string | null;
  meter_hotwater: string | null;
  meterman_name: string | null;
  meterman_phone: string | null;
  // 지급품 정보
  give_date: string | null;
  give_items: Record<string, boolean> | null;
  // 키불출 정보
  key_date: string | null;
  key_release: string | null;
  key_house: string | null;
  key_lobby: string | null;
  key_post: string | null;
  key_etc: string | null;
  keyman_name: string | null;
  keyman_phone: string | null;
  // 부동산 정보
  agent_companys: AgentCompany[] | null;
  agent_memo: string | null;
  agent_attachfiles: AgentAttachFile[] | null;
}

/** 부동산 업체 정보 */
export interface AgentCompany {
  name: string;
  manager_name: string;
  manager_phone: string;
}

/** 부동산 첨부파일 */
export interface AgentAttachFile {
  uuid: string;
  original_name: string;
  file_size: number;
}

/** 세대정보 수정 요청 */
export interface HouseholdUpdateRequest {
  // 기본 정보
  contractor_name?: string;
  contractor_phone?: string;
  contractor_birth?: string;
  resident_name?: string;
  resident_phone?: string;
  resident_birth?: string;
  resident_type?: string;
  resident_date?: string;
  level?: string;
  memo?: string;
  // 검침 정보
  meter_date?: string;
  meter_electric?: string;
  meter_water?: string;
  meter_gas?: string;
  meter_heating?: string;
  meter_hotwater?: string;
  meterman_name?: string;
  meterman_phone?: string;
  // 지급품 정보
  give_date?: string;
  give_items?: Record<string, boolean>;
  // 키불출 정보
  key_date?: string;
  key_release?: string;
  key_house?: string;
  key_lobby?: string;
  key_post?: string;
  key_etc?: string;
  keyman_name?: string;
  keyman_phone?: string;
  // 부동산 정보
  agent_companys?: AgentCompany[];
  agent_memo?: string;
  agent_attachfiles?: string[]; // UUID 배열
}

// =============================================================================
// 입주 방문이력 (CP-SA-99-002)
// =============================================================================

/** 입주 방문이력 아이템 */
export interface VisitHistory {
  id: number;
  visit_datetime: string;
  dong: string;
  ho: string;
  visitor_name: string;
  visitor_phone: string;
  visit_type: string;
  visit_purpose: string[];
  work_begin: string | null;
  work_end: string | null;
  move_reservation_datetime: string | null;
  created_at: string;
  created_by_name: string | null;
  created_by_phone: string | null;
  memo: string | null;
}
