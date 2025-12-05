/**
 * 예약 관리 데이터 타입 정의
 * - 방문예약 관리자용
 * - 이사예약 관리자용
 */

// =============================================================================
// 공통 타입
// =============================================================================

// 방문예약 상태 타입
export type VisitReservationStatus =
  | 'pending' // 대기중
  | 'confirmed' // 확정
  | 'cancelled' // 취소
  | 'completed'; // 완료

// 이사예약 상태 타입
export type MoveReservationStatus =
  | 'active' // 예약중
  | 'cancelled'; // 취소

// 방문일정 상태 타입
export type VisitScheduleStatus =
  | 'empty' // 빈 일정
  | 'reserved'; // 예약됨

// 입주형태 타입
export type ResidenceType =
  | 'owner' // 소유주
  | 'tenant' // 세입자
  | 'representative'; // 대리인

// 이사 시간대 타입 (1~3시간 단위)
export type MoveTimeSlotType =
  | '09:00~10:00'
  | '10:00~11:00'
  | '11:00~12:00'
  | '12:00~13:00'
  | '13:00~14:00'
  | '14:00~15:00'
  | '15:00~16:00'
  | '16:00~17:00'
  | '17:00~18:00'
  | '09:00~11:00'
  | '11:00~13:00'
  | '13:00~15:00'
  | '15:00~17:00'
  | '09:00~12:00'
  | '12:00~15:00'
  | '15:00~18:00';

// 승강기 라인 타입
export type ElevatorLine = 'A' | 'B' | 'C' | 'D';

// =============================================================================
// 방문예약 관리자용 타입
// =============================================================================

// 방문예약 데이터
export interface AdminVisitReservation {
  id: string;
  // 예약자 정보
  name: string;
  phone: string;
  // 세대 정보
  building: string; // 동 (예: '101동')
  unit: string; // 호 (예: '1201호')
  // 예약 정보
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (예: '10:00')
  purpose?: string; // 방문 목적
  // 상태 및 메타데이터
  status: VisitReservationStatus;
  memo?: string; // 관리자 메모
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  confirmedAt?: string; // 확정 시간
  completedAt?: string; // 완료 시간
  cancelledAt?: string; // 취소 시간
  cancelReason?: string; // 취소 사유
}

// 방문예약 시간대 슬롯
export interface VisitTimeSlot {
  time: string; // HH:mm (예: '10:00')
  available: number; // 현재 예약 가능 세대수
  total: number; // 시간대별 최대 예약 가능 세대수
  reserved: number; // 예약된 세대수
  isAvailable: boolean; // 예약 가능 여부
}

// 방문예약 필터 옵션
export interface VisitReservationFilter {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: VisitReservationStatus[];
  building?: string; // 동
  unit?: string; // 호
  searchKeyword?: string; // 이름 또는 전화번호 검색
}

// 방문예약 설정
export interface VisitReservationSettings {
  id: string;
  name: string; // 설정명
  isActive: boolean; // 활성화 여부
  // 예약 기간 설정 (1~5일 전)
  reservationPeriod: {
    minDays: number; // 최소 예약 가능일 (예: 1일 전부터)
    maxDays: number; // 최대 예약 가능일 (예: 5일 후까지)
  };
  // 시간대 설정
  timeSlots: {
    startTime: string; // HH:mm (예: '09:00')
    endTime: string; // HH:mm (예: '18:00')
    interval: 30 | 60; // 30분 또는 1시간 단위
  };
  // 세대수 제한
  maxReservationsPerSlot: number; // 시간대별 예약 가능 세대수
  // 제외 요일 (0: 일요일, 6: 토요일)
  excludedDays?: number[];
  // 특별 제외일 (공휴일 등)
  excludedDates?: string[]; // YYYY-MM-DD[]
  // 메타데이터
  createdAt: string;
  updatedAt: string;
}

// 방문예약 통계
export interface VisitReservationStats {
  totalReservations: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  todayReservations: number;
  averageReservationsPerDay: number;
}

// =============================================================================
// 방문일정 관리자용 타입
// =============================================================================

// 방문일정 데이터
export interface VisitSchedule {
  id: string;
  // 일정 기본 정보
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm (예: '10:00')
  building: string; // 동 (예: '101동')
  unit: string; // 호 (예: '1201호')
  // 예약자 정보 (예약 시 채워짐)
  name?: string; // 성함
  phone?: string; // 연락처
  birthDate?: string; // 생년월일 (YYYY-MM-DD)
  residenceType?: ResidenceType; // 입주형태
  moveInDate?: string; // 입주예정일 (YYYY-MM-DD)
  terminalNumber?: string; // 단말기번호
  companion?: number; // 동행 인원수
  note?: string; // 기타 메모
  // 상태 및 메타데이터
  status: VisitScheduleStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  reservedAt?: string; // 예약된 시간
}

// 방문일정 등록 폼 데이터
export interface VisitScheduleFormData {
  visitDate: string;
  visitTime: string;
  building: string;
  unit: string;
  name?: string;
  phone?: string;
  birthDate?: string;
  residenceType?: ResidenceType;
  moveInDate?: string;
  terminalNumber?: string;
  companion?: number;
  note?: string;
}

// 방문일정 필터 옵션
export interface VisitScheduleFilter {
  searchKeyword?: string; // 검색어 (이름 또는 연락처)
  building?: string; // 동
  unit?: string; // 호
  terminalNumber?: string; // 단말기번호
  status?: VisitScheduleStatus; // 단말기상태
}

// =============================================================================
// 이사예약 관리자용 타입
// =============================================================================

// 이사예약 데이터
export interface AdminMoveReservation {
  id: string;
  // 예약자 정보
  ownerName: string;
  phone: string;
  // 세대 정보
  building: string; // 동 (예: '101동')
  unit: string; // 호 (예: '1201호')
  elevatorLine: ElevatorLine; // 승강기 라인
  // 예약 정보
  date: string; // YYYY-MM-DD
  timeSlot: MoveTimeSlotType; // 예약 시간대
  // 이사 정보
  moveType: 'move_in' | 'move_out'; // 입주/퇴거
  vehicleType?: string; // 차량 종류
  vehicleNumber?: string; // 차량 번호
  movingCompany?: string; // 이사 업체
  specialRequests?: string; // 특별 요청사항
  // 상태 및 메타데이터
  status: MoveReservationStatus;
  memo?: string; // 관리자 메모
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  cancelledAt?: string; // 취소 시간
  cancelReason?: string; // 취소 사유
}

// 이사예약 시간대 슬롯 (승강기 라인별)
export interface MoveTimeSlotAvailability {
  date: string; // YYYY-MM-DD
  elevatorLine: ElevatorLine;
  timeSlot: MoveTimeSlotType;
  isAvailable: boolean; // 예약 가능 여부 (라인당 1일 각 시간대별 1회)
  reservationId?: string; // 예약된 경우 예약 ID
}

// 이사예약 필터 옵션
export interface MoveReservationFilter {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: MoveReservationStatus[];
  building?: string; // 동
  unit?: string; // 호
  elevatorLine?: ElevatorLine; // 승강기 라인
  moveType?: 'move_in' | 'move_out'; // 이사 유형
  searchKeyword?: string; // 이름 또는 전화번호 검색
}

// 이사예약 설정
export interface MoveReservationSettings {
  id: string;
  name: string; // 설정명
  isActive: boolean; // 활성화 여부
  // 예약 기간 설정 (15~90일 전)
  reservationPeriod: {
    minDays: number; // 최소 예약 가능일 (예: 15일 전부터)
    maxDays: number; // 최대 예약 가능일 (예: 90일 후까지)
  };
  // 시간대 설정 (1~3시간 단위)
  timeSlotDuration: 1 | 2 | 3; // 시간 단위
  availableTimeSlots: MoveTimeSlotType[]; // 이용 가능한 시간대
  // 승강기 라인 설정
  elevatorLines: ElevatorLine[]; // 사용 가능한 승강기 라인
  maxReservationsPerLinePerSlot: number; // 라인당 시간대별 최대 예약 수 (기본 1)
  // 제외 요일
  excludedDays?: number[];
  // 특별 제외일
  excludedDates?: string[];
  // 메타데이터
  createdAt: string;
  updatedAt: string;
}

// 이사예약 통계
export interface MoveReservationStats {
  totalReservations: number;
  activeCount: number;
  cancelledCount: number;
  moveInCount: number;
  moveOutCount: number;
  todayReservations: number;
  upcomingReservations: number; // 향후 7일 이내
  averageReservationsPerDay: number;
}

// =============================================================================
// 공통 유틸리티 타입
// =============================================================================

// 정렬 옵션
export type ReservationSortField =
  | 'id'
  | 'date'
  | 'createdAt'
  | 'status'
  | 'building'
  | 'name'
  | 'ownerName';

export interface ReservationSortOption {
  field: ReservationSortField;
  order: 'asc' | 'desc';
}

// 동/호수 옵션
export interface BuildingOption {
  id: string;
  name: string; // 동명 (예: '101동')
  units: string[]; // 호수 목록 (예: ['101호', '102호', ...])
}

// 예약 상태 변경 이력
export interface ReservationStatusHistory {
  id: string;
  reservationType: 'visit' | 'move';
  reservationId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string; // 변경자
  changedAt: string; // ISO 8601
  reason?: string; // 변경 사유
}

// 페이지네이션
export interface ReservationPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// API 응답 래퍼
export interface ReservationListResponse<T> {
  data: T[];
  pagination: ReservationPagination;
  stats?: VisitReservationStats | MoveReservationStats;
}
