/**
 * A/S 관리 관련 타입 정의
 * API 문서 기준: 2025-12-24
 */

// =============================================================================
// 1. A/S 상태 및 형태 (옵션)
// =============================================================================

/** A/S 진행상태 */
export interface AsStatus {
  id: number;
  name: string;
}

/** A/S 형태 (우선순위) */
export interface AsPriority {
  id: number;
  name: string;
}

/** A/S 옵션 응답 */
export interface AfterserviceOptions {
  as_status: AsStatus[];
  as_priority: AsPriority[];
}

// =============================================================================
// 2. 하자코드 (Ascode)
// =============================================================================

/** 하자코드 정보 */
export interface Ascode {
  id: number;
  project_id: number;
  project_users_id: number | null;  // 협력사 ID
  type: string | null;              // 타입/평수
  room: string;                     // 실명
  issue_category1: string;          // 하자부위명
  issue_category2: string;          // 하자상세명
  issue_type: string;               // 하자유형명
  work_type1: string;               // 대공종명
  work_type2: string;               // 소공종명
}

// =============================================================================
// 3. A/S 목록
// =============================================================================

/** A/S 목록 아이템 */
export interface AfterserviceListItem {
  id: number;
  project_id: number;
  dongho_id: number;
  as_status_id: number;
  as_priority_id: number;
  issue_content: string | null;
  work_date: string | null;           // YYYY-MM-DD
  created_at: string | null;          // YYYY-MM-DD
  completed_at: string | null;        // YYYY-MM-DD
  // JOIN 필드
  dong: string | null;
  ho: string | null;
  as_status_name: string | null;
  as_priority_name: string | null;
  room: string | null;                // 실명
  issue_category1: string | null;     // 하자부위
  issue_category2: string | null;     // 하자상세
  issue_type: string | null;          // 하자유형
  work_type1: string | null;          // 대공종
  work_type2: string | null;          // 소공종
  partner_company: string | null;     // 협력사명
  // 이미지 URL
  image_far: string | null;           // 원거리 사진
  image_near: string | null;          // 근거리 사진
  completed_image_far: string | null;
  completed_image_near: string | null;
}

/** A/S 목록 조회 파라미터 */
export interface AfterserviceListParams {
  dong?: string;
  ho?: string;
  as_status_id?: number;
  as_priority_id?: number;
  date_type?: 'created_at' | 'work_date' | 'resident_date';
  date_begin?: string;                // YYYY-MM-DD
  date_end?: string;                  // YYYY-MM-DD
  searchKeyword?: string;
  // 하자코드 필터
  work_type1?: string;                // 대공종
  work_type2?: string;                // 소공종
  room?: string;                      // 실명
  issue_category1?: string;           // 부위명
  issue_category2?: string;           // 상세부위명
  issue_type?: string;                // 유형
  partner_id?: number;                // 협력사
  // 페이지네이션
  offset?: number;
  limit?: number;
}

// =============================================================================
// 4. A/S 상세
// =============================================================================

/** 동호 정보 */
export interface AfterserviceDongho {
  dong: string | null;
  ho: string | null;
  unit_type: string | null;           // 타입/평수
  ev_lines: string[] | null;          // EV 라인
}

/** 세대 정보 */
export interface AfterserviceHousehold {
  contractor_name: string | null;     // 계약자명
  contractor_phone: string | null;    // 계약자 연락처
  contractor_birth: string | null;    // 계약자 생년월일
  resident_name: string | null;       // 입주자명
  resident_phone: string | null;      // 입주자 연락처
  resident_birth: string | null;      // 입주자 생년월일
  resident_type: string | null;       // 입주형태
  resident_date: string | null;       // 입주예정일
  level: string | null;               // 등급
}

/** 하자코드 상세 */
export interface AfterserviceAscode {
  id: number;
  type: string | null;                // 타입/평수
  room: string | null;                // 실명
  issue_category1: string | null;     // 하자부위
  issue_category2: string | null;     // 하자상세
  issue_type: string | null;          // 하자유형
  work_type1: string | null;          // 대공종
  work_type2: string | null;          // 소공종
}

/** 협력사 정보 */
export interface AfterservicePartner {
  company: string | null;             // 회사명
  name: string | null;                // 담당자명
  phone: string | null;               // 연락처
}

/** A/S 상세 정보 */
export interface AfterserviceDetail {
  id: number;
  project_id: number;
  dongho_id: number;
  project_ascode_id: number;
  as_status_id: number;
  as_priority_id: number;
  issue_content: string | null;
  work_date: string | null;           // YYYY-MM-DD
  work_memo: string | null;
  completed_content: string | null;
  created_at: string | null;          // YYYY-MM-DD HH:mm:ss
  updated_at: string | null;          // YYYY-MM-DD HH:mm:ss
  completed_at: string | null;        // YYYY-MM-DD HH:mm:ss
  // 중첩 객체
  dongho: AfterserviceDongho;
  // household는 별도 API (GET /donghos/{id})로 조회
  as_status: AsStatus;
  as_priority: AsPriority;
  ascode: AfterserviceAscode;
  partner: AfterservicePartner;
  // 이미지 URL
  image_far: string | null;
  image_near: string | null;
  completed_image_far: string | null;
  completed_image_near: string | null;
}

/** A/S 수정 요청 */
export interface AfterserviceUpdateRequest {
  as_status_id?: number;
  as_priority_id?: number;
  work_date?: string;                 // YYYY-MM-DD
  work_memo?: string;
  completed_content?: string;
  completed_at?: string;              // YYYY-MM-DD
  // 하자 정보 수정 (기획서 CP-SA-03-004)
  project_ascode_id?: number;         // 하자코드 (실명/부위/유형/공종 등)
  issue_content?: string;             // 하자내용
  partner_id?: number;                // 협력사 ID
}

// =============================================================================
// 5. 협력사 (Users API type=2)
// =============================================================================

/** 협력사 정보 (사용자 목록에서 type=2) */
export interface Partner {
  id: number;
  user_id: string;
  name: string;
  company: string | null;
  phone: string | null;
  is_active: boolean;
}

// =============================================================================
// 6. UI용 상수
// =============================================================================

/** 진행상태 색상 매핑 (4가지 분류)
 * - Gray: 대기 (접수, 오접수, 임의종결)
 * - Blue: 진행중 (보수처리중, 자재수급중, 관리자확인)
 * - Orange: 이슈 (공종변경요청, 긴급, 장기미처리, 수용불가)
 * - Green: 완료 (완료, 완료승인, 최종승인)
 */
export const AS_STATUS_COLORS: Record<number, string> = {
  1: '#9E9E9E',   // 접수 - gray (대기)
  2: '#4CAF50',   // 완료 - green (완료)
  3: '#9E9E9E',   // 오접수 - gray (대기)
  4: '#2196F3',   // 보수처리중 - blue (진행중)
  5: '#2196F3',   // 자재수급중 - blue (진행중)
  6: '#FF9800',   // 공종변경요청 - orange (이슈)
  7: '#FF9800',   // 긴급 - orange (이슈)
  8: '#FF9800',   // 장기미처리 - orange (이슈)
  9: '#2196F3',   // 관리자확인 - blue (진행중)
  10: '#9E9E9E',  // 임의종결 - gray (대기)
  11: '#FF9800',  // 수용불가 - orange (이슈)
  12: '#4CAF50',  // 완료승인 - green (완료)
  13: '#4CAF50',  // 최종승인 - green (완료)
};

/** 형태(우선순위) 색상 매핑 */
export const AS_PRIORITY_COLORS: Record<number, string> = {
  1: '#757575',   // 일반 - gray
  2: '#FF9800',   // 임박 - orange
  3: '#F44336',   // 긴급 - red
  4: '#E91E63',   // 중대 - pink
  5: '#2196F3',   // 자재 - blue
};
