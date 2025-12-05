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
  contractor_name: string | null;
  contractor_phone: string | null;
  contractor_birth: string | null;
}

/** 동호 코드 등록/수정 요청 */
export interface DonghoRequest {
  dong: string;
  ho: string;
  unit_type?: string;
  ev_lines?: string[];
  contractor_name?: string;
  contractor_phone?: string;
  contractor_birth?: string;
}

/** 동호 코드 목록 조회 파라미터 */
export interface DonghoListParams {
  dong?: string;
}
