/**
 * 대시보드 데이터 타입 정의
 */

// KPI 카드 데이터
export interface KPICardData {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change: number; // 전월 대비 증감률 (%)
  changeType: 'increase' | 'decrease';
  icon?: string;
}

// 차트 데이터 포인트
export interface ChartDataPoint {
  date: string;
  label: string;
  value: number;
}

// A/S 처리 현황 데이터
export interface ASProcessData {
  labels: string[];
  received: number[]; // 접수건수
  processed: number[]; // 처리건수
}

// 공종별 데이터
export interface WorkTypeData {
  id: string;
  name: string;
  totalReceived: number;
  processRate: number; // 처리율 (%)
  avgProcessTime: number; // 평균 처리시간 (일)
}

// 협력사 데이터
export interface PartnerData {
  id: string;
  name: string;
  totalReceived: number;
  processRate: number;
  avgResponseTime: number; // 평균 응답시간 (시간)
  rank?: number;
}

// 동별 히트맵 데이터
export interface BuildingHeatmapData {
  building: string; // 동명 (예: 101동)
  count: number; // A/S 건수
  intensity: number; // 0-100 강도
}

// 방문 시간대별 데이터
export interface VisitTimeData {
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (일-토)
  count: number;
}

// 입주 진행률 데이터
export interface MoveInProgressData {
  total: number;
  completed: number;
  progressRate: number;
  checklistSubmitRate: number; // 점검지 제출률
  keyHandoverRate: number; // 키불출률
}

// 최근 접수 내역 데이터
export interface RecentRequestData {
  id: string;
  site: string; // 현장명
  workType: string; // 공종
  receivedDate: string; // 접수일
  status: '접수중' | '처리중' | '완료' | '지연';
  manager: string; // 담당자
  building?: string; // 동
  unit?: string; // 호수
}

// 기간 필터 옵션
export type DateRangeFilter = '7days' | '30days' | 'year' | 'custom';

export interface DateRangeFilterValue {
  type: DateRangeFilter;
  startDate?: string;
  endDate?: string;
}
