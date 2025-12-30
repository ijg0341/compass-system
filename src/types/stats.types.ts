/**
 * 통계 API 응답 타입 정의
 * API 문서 기준: admin-stats-api.http
 */

// =============================================================================
// 1. 사전방문 통계 (CP-SA-05-001 ~ 004)
// =============================================================================

/** 1-1. 방문현황 (동별) - CP-SA-05-001 */
export interface PrevisitByDongDate {
  visit_date: string;
  first_visit: number;
  revisit: number;
  total: number;
}

export interface PrevisitByDongType {
  unit_type: string;
  total_households: number;
  sale_union: number;
  sale_general: number;
  sale_subtotal: number;
  unsold: number;
  dates: PrevisitByDongDate[];
  first_visit_subtotal: number;
  first_visit_rate: number;
  revisit_subtotal: number;
  total_visit: number;
  total_rate: number;
}

export interface PrevisitByDongItem {
  dong: string;
  types: PrevisitByDongType[];
  subtotal: {
    total_households: number;
    first_visit_subtotal: number;
    revisit_subtotal: number;
    total_visit: number;
  };
}

export interface PrevisitByDongStats {
  total_households: number;
  visited_households: number;
  total_defects: number;
  avg_defects: number;
  most_visited: { dong: string; ho: string; count: number } | null;
  least_visited: { dong: string; ho: string; count: number } | null;
  dates: string[];
  by_dong: PrevisitByDongItem[];
}

/** 1-2. 방문현황 (요일/시간대별) - CP-SA-05-002 */
export interface PrevisitByTimeHour {
  hour: number;
  first_visit: number;
  revisit: number;
  total: number;
}

export interface PrevisitByTimeDate {
  date: string;
  day_of_week: string;
  reservation: PrevisitByTimeHour[];
  visit: PrevisitByTimeHour[];
  reservation_total: number;
  visit_total: number;
}

export interface PrevisitByTimeStats {
  hours: number[];
  by_date: PrevisitByTimeDate[];
  heatmap: Array<{ hour: number; day: string; value: number }>;
}

/** 1-3. 입주현황 - CP-SA-05-003 */
export interface OccupancyTypeItem {
  resident_type: string;
  count: number;
  rate: number;
}

export interface OccupancyMonthItem {
  resident_month: string;
  count: number;
  rate: number;
}

export interface PrevisitOccupancyStats {
  total: number;
  by_resident_type: OccupancyTypeItem[];
  by_resident_month: OccupancyMonthItem[];
}

/** 1-4. 점검세대 - CP-SA-05-004 */
export interface InspectionDateItem {
  visit_date: string;
  inspected: number;
  defect_count: number;
  submission_rate: number;
}

export interface PrevisitInspectionStats {
  total: number;
  inspected: number;
  defect_count: number;
  by_date: InspectionDateItem[];
}

// =============================================================================
// 2. A/S 통계 (CP-SA-05-005 ~ 008)
// =============================================================================

/** 2-1. 동별 A/S 건수 - CP-SA-05-005 */
export interface ASByDongType {
  unit_type: string;
  total_households: number;
  received: { today: number; total: number };
  completed: { yesterday: number; total: number; rate: number };
  pending: { total: number; rate: number };
}

export interface ASByDongItem {
  dong: string;
  types: ASByDongType[];
  subtotal: {
    total_households: number;
    received_today: number;
    received_total: number;
    completed_yesterday: number;
    completed_total: number;
    completed_rate: number;
    pending_total: number;
    pending_rate: number;
  };
}

export interface ASByDongStats {
  by_dong: ASByDongItem[];
  total: {
    received_today: number;
    received_total: number;
    completed_total: number;
    pending_total: number;
  };
}

/** 2-2. 공종별 A/S 건수 - CP-SA-05-006 */
export interface ASByWorkType2Item {
  work_type2: string;
  partner_company: string | null;
  received: { today: number; rate: number };
  completed: { yesterday: number; total: number; rate: number };
  pending: { total: number; rate: number };
}

export interface ASByWorkTypeItem {
  work_type1: string;
  work_type2_list: ASByWorkType2Item[];
  subtotal: {
    received_today: number;
    received_rate: number;
    completed_total: number;
    completed_rate: number;
    pending_total: number;
    pending_rate: number;
  };
}

export interface ASByWorkTypeStats {
  total_received: number;
  by_work_type: ASByWorkTypeItem[];
}

/** 2-3. 상세 A/S 건수 - CP-SA-05-007 */
export interface ASDetailIssueType {
  issue_type: string;
  count: number;
  rate: number;
}

export interface ASDetailWorkType2 {
  rank: number;
  work_type2: string;
  total_count: number;
  issue_types: ASDetailIssueType[];
}

export interface ASDetailStats {
  by_work_type2: ASDetailWorkType2[];
}

/** 2-4. 전체 처리율 - CP-SA-05-008 */
export interface ASCompletionRateDateItem {
  date: string;
  received: { today: number; total: number; rate: number };
  completed: { yesterday: number; total: number; rate: number };
  pending: { total: number; rate: number };
}

export interface ASCompletionRateStats {
  by_date: ASCompletionRateDateItem[];
}

// =============================================================================
// 3. 입주관리 통계 (CP-SA-05-009 ~ 010)
// =============================================================================

/** 3-1. 입주율 - CP-SA-05-009 */
export interface OccupancyRatePeriod {
  occupied: number;
  occupied_rate: number;
  certificate: number;
  certificate_rate: number;
  key: number;
  key_rate: number;
  meter: number;
  meter_rate: number;
  key_rental: number;
  household_visit: number;
  agent_visit: number;
  other_visit: number;
}

export interface OccupancyRateStats {
  total_households: number;
  occupied_count: number;
  certificate_count: number;
  key_count: number;
  meter_count: number;
  list: {
    yesterday: OccupancyRatePeriod;
    today: OccupancyRatePeriod;
    total: OccupancyRatePeriod;
  };
}

/** 3-2. 세대현황 - CP-SA-05-010 */
export interface HouseholdStatusItem {
  id: number;
  ho: string;
  meter_date: string | null;
  key_date: string | null;
  move_date: string | null;
  resident_date: string | null;
}

export interface HouseholdStatusStats {
  [dong: string]: HouseholdStatusItem[][];
}

// =============================================================================
// 4. 현장관리 대시보드 (CP-SA-05-011)
// =============================================================================

export interface DashboardGraphItem {
  period: string;
  received: number;
  completed: number;
}

export interface DashboardPartnerItem {
  partner_id: number;
  partner_company: string;
  total: number;
  completed: number;
  rate: number;
}

export interface DashboardStats {
  summary: {
    total_households: number;
    certificate: number;
    meter: number;
    key: number;
    occupied: number;
    occupied_rate: number;
    as_received: number;
    as_completed: number;
    as_pending: number;
    as_completion_rate: number;
    today_visit: number;
    total_visit: number;
  };
  yearly_graph: DashboardGraphItem[];
  monthly_graph: DashboardGraphItem[];
  daily_graph: DashboardGraphItem[];
  best_partners: DashboardPartnerItem[];
  worst_partners: DashboardPartnerItem[];
}

// =============================================================================
// API 파라미터 타입
// =============================================================================

export interface StatsDateRangeParams {
  date_begin?: string;
  date_end?: string;
}

export interface PrevisitStatsParams extends StatsDateRangeParams {
  previsit_id?: number;
}

export interface ASDetailStatsParams extends StatsDateRangeParams {
  dong?: string;
  work_type1?: string;
  issue_category1?: string;
}
