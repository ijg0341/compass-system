import dayjs from 'dayjs';
import type {
  AdminVisitReservation,
  AdminMoveReservation,
  VisitReservationStatus,
  MoveReservationStatus,
  MoveTimeSlotType,
  ElevatorLine,
  VisitTimeSlot,
  MoveTimeSlotAvailability,
  VisitReservationSettings,
  MoveReservationSettings,
  VisitReservationStats,
  MoveReservationStats,
  BuildingOption,
  VisitReservationFilter,
  MoveReservationFilter,
  VisitSchedule,
  VisitScheduleStatus,
  ResidenceType,
} from '@/src/types/reservation';

/**
 * 예약 관리 Mock 데이터 생성기
 *
 * 고정된 기준 날짜를 사용하여 서버/클라이언트 hydration 이슈 방지
 */
const BASE_DATE = '2024-10-22';

// =============================================================================
// 공통 데이터
// =============================================================================

// 동/호수 정보 (101동~110동, 각 동별 101호~1501호)
export const mockBuildingOptions: BuildingOption[] = Array.from(
  { length: 10 },
  (_, buildingIndex) => {
    const buildingNumber = 101 + buildingIndex;
    const buildingName = `${buildingNumber}동`;

    // 각 동별 101호~1501호 (15층, 층당 1호)
    const units: string[] = [];
    for (let floor = 1; floor <= 15; floor++) {
      const floorStr = String(floor).padStart(2, '0');
      units.push(`${floorStr}01호`);
    }

    return {
      id: `building-${buildingNumber}`,
      name: buildingName,
      units,
    };
  }
);

// 한국 이름 목록
const KOREAN_NAMES = [
  '김민수',
  '이영희',
  '박철수',
  '최수연',
  '정동욱',
  '강지현',
  '조현우',
  '윤서연',
  '임재현',
  '한미경',
  '오준혁',
  '서은지',
  '배성민',
  '홍지훈',
  '신유진',
  '권태호',
  '문정아',
  '안상우',
  '손예린',
  '유승현',
  '장민지',
  '김태현',
  '이수빈',
  '박지우',
  '최현준',
];

// 전화번호 생성
function generatePhoneNumber(index: number): string {
  const middle = String(1000 + (index * 13) % 9000).padStart(4, '0');
  const last = String(1000 + (index * 7) % 9000).padStart(4, '0');
  return `010-${middle}-${last}`;
}

// =============================================================================
// 방문예약 Mock 데이터
// =============================================================================

// 방문 목적 목록
const VISIT_PURPOSES = [
  '인테리어 상담',
  '하자 점검',
  '시설물 확인',
  '입주 사전 방문',
  '가구 배치 확인',
  '마감재 선택',
  '옵션 품목 확인',
  '전기/설비 점검',
];

// 방문예약 상태 분포 (대기중 30%, 확정 40%, 완료 20%, 취소 10%)
const VISIT_STATUS_DISTRIBUTION: VisitReservationStatus[] = [
  'pending',
  'pending',
  'pending',
  'confirmed',
  'confirmed',
  'confirmed',
  'confirmed',
  'completed',
  'completed',
  'cancelled',
];

// 방문 가능 시간대 (30분 단위)
const VISIT_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

// 방문예약 목록 생성 (40개)
export const mockVisitReservations: AdminVisitReservation[] = Array.from(
  { length: 40 },
  (_, index) => {
    const id = `VISIT-${String(index + 1).padStart(5, '0')}`;
    const buildingIndex = index % 10;
    const building = mockBuildingOptions[buildingIndex].name;
    const unitIndex = index % 15;
    const unit = mockBuildingOptions[buildingIndex].units[unitIndex];

    // 날짜: 기준일 기준 -10일 ~ +5일 범위
    const dayOffset = (index % 16) - 10;
    const date = dayjs(BASE_DATE).add(dayOffset, 'day').format('YYYY-MM-DD');

    // 시간대
    const time = VISIT_TIME_SLOTS[index % VISIT_TIME_SLOTS.length];

    // 상태
    const status = VISIT_STATUS_DISTRIBUTION[index % 10];

    // 생성일: 예약일 기준 1~3일 전
    const createdDaysAgo = (index % 3) + 1;
    const createdAt = dayjs(date)
      .subtract(createdDaysAgo, 'day')
      .hour(9 + (index % 10))
      .minute((index * 7) % 60)
      .toISOString();
    const updatedAt = createdAt;

    const reservation: AdminVisitReservation = {
      id,
      name: KOREAN_NAMES[index % KOREAN_NAMES.length],
      phone: generatePhoneNumber(index),
      building,
      unit,
      date,
      time,
      purpose: VISIT_PURPOSES[index % VISIT_PURPOSES.length],
      status,
      createdAt,
      updatedAt,
    };

    // 상태별 추가 정보
    if (status === 'confirmed') {
      reservation.confirmedAt = dayjs(createdAt).add(2, 'hour').toISOString();
    } else if (status === 'completed') {
      reservation.confirmedAt = dayjs(createdAt).add(2, 'hour').toISOString();
      reservation.completedAt = dayjs(date).hour(18).toISOString();
    } else if (status === 'cancelled') {
      reservation.cancelledAt = dayjs(createdAt).add(1, 'day').toISOString();
      reservation.cancelReason =
        index % 2 === 0 ? '개인 사정으로 취소' : '일정 변경';
    }

    // 관리자 메모 (일부만)
    if (index % 5 === 0) {
      reservation.memo = '특별 요청사항 확인 필요';
    }

    return reservation;
  }
);

// 방문예약 설정
export const mockVisitReservationSettings: VisitReservationSettings = {
  id: 'visit-settings-001',
  name: '기본 방문예약 설정',
  isActive: true,
  reservationPeriod: {
    minDays: 1,
    maxDays: 5,
  },
  timeSlots: {
    startTime: '09:00',
    endTime: '18:00',
    interval: 30,
  },
  maxReservationsPerSlot: 3,
  excludedDays: [0], // 일요일 제외
  excludedDates: ['2024-10-31'], // 특별 휴일
  createdAt: '2024-10-01T09:00:00.000Z',
  updatedAt: '2024-10-15T14:30:00.000Z',
};

// 특정 날짜의 방문예약 시간대 슬롯 생성
export function generateVisitTimeSlots(date: string): VisitTimeSlot[] {
  const settings = mockVisitReservationSettings;
  const slots: VisitTimeSlot[] = [];

  // 해당 날짜의 예약 건수 계산
  const reservationsOnDate = mockVisitReservations.filter(
    (r) => r.date === date && r.status !== 'cancelled'
  );

  for (const time of VISIT_TIME_SLOTS) {
    const reservedCount = reservationsOnDate.filter(
      (r) => r.time === time
    ).length;
    const available = settings.maxReservationsPerSlot - reservedCount;

    slots.push({
      time,
      total: settings.maxReservationsPerSlot,
      reserved: reservedCount,
      available: Math.max(0, available),
      isAvailable: available > 0,
    });
  }

  return slots;
}

// 방문예약 통계 생성
export function generateVisitReservationStats(): VisitReservationStats {
  const total = mockVisitReservations.length;
  const pendingCount = mockVisitReservations.filter(
    (r) => r.status === 'pending'
  ).length;
  const confirmedCount = mockVisitReservations.filter(
    (r) => r.status === 'confirmed'
  ).length;
  const completedCount = mockVisitReservations.filter(
    (r) => r.status === 'completed'
  ).length;
  const cancelledCount = mockVisitReservations.filter(
    (r) => r.status === 'cancelled'
  ).length;

  const todayReservations = mockVisitReservations.filter(
    (r) => r.date === BASE_DATE
  ).length;

  return {
    totalReservations: total,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    todayReservations,
    averageReservationsPerDay: Math.round((total / 16) * 10) / 10, // 16일 범위
  };
}

// 방문예약 필터링 함수
export function filterVisitReservations(
  reservations: AdminVisitReservation[],
  filter: VisitReservationFilter
): AdminVisitReservation[] {
  return reservations.filter((r) => {
    // 날짜 필터
    if (filter.startDate && r.date < filter.startDate) return false;
    if (filter.endDate && r.date > filter.endDate) return false;

    // 상태 필터
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(r.status)) return false;
    }

    // 동 필터
    if (filter.building && r.building !== filter.building) return false;

    // 호수 필터
    if (filter.unit && r.unit !== filter.unit) return false;

    // 검색어 필터 (이름 또는 전화번호)
    if (filter.searchKeyword) {
      const keyword = filter.searchKeyword.toLowerCase();
      const nameMatch = r.name.toLowerCase().includes(keyword);
      const phoneMatch = r.phone.includes(keyword);
      if (!nameMatch && !phoneMatch) return false;
    }

    return true;
  });
}

// =============================================================================
// 이사예약 Mock 데이터
// =============================================================================

// 이사 시간대 (3시간 단위 기본)
const MOVE_TIME_SLOTS: MoveTimeSlotType[] = [
  '09:00~12:00',
  '12:00~15:00',
  '15:00~18:00',
];

// 승강기 라인
const ELEVATOR_LINES: ElevatorLine[] = ['A', 'B', 'C', 'D'];

// 이사예약 상태 분포 (예약중 85%, 취소 15%)
const MOVE_STATUS_DISTRIBUTION: MoveReservationStatus[] = [
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'cancelled',
  'cancelled',
  'cancelled',
];

// 차량 종류
const VEHICLE_TYPES = [
  '1톤 트럭',
  '2.5톤 트럭',
  '5톤 트럭',
  '포터',
  '스타렉스',
  '대형 이사 트럭',
];

// 이사 업체
const MOVING_COMPANIES = [
  '한진택배',
  '대한통운',
  '로젠택배',
  '용달이사',
  '포장이사',
  '영일이사',
  '한국이사',
  '삼성이사',
];

// 이사예약 목록 생성 (25개)
export const mockMoveReservations: AdminMoveReservation[] = Array.from(
  { length: 25 },
  (_, index) => {
    const id = `MOVE-${String(index + 1).padStart(5, '0')}`;
    const buildingIndex = index % 10;
    const building = mockBuildingOptions[buildingIndex].name;
    const unitIndex = index % 15;
    const unit = mockBuildingOptions[buildingIndex].units[unitIndex];

    // 승강기 라인 (동에 따라 결정)
    const elevatorLine = ELEVATOR_LINES[buildingIndex % 4];

    // 날짜: 기준일 기준 -30일 ~ +60일 범위
    const dayOffset = (index * 3) % 90 - 30;
    const date = dayjs(BASE_DATE).add(dayOffset, 'day').format('YYYY-MM-DD');

    // 시간대
    const timeSlot = MOVE_TIME_SLOTS[index % 3];

    // 상태
    const status = MOVE_STATUS_DISTRIBUTION[index % 20];

    // 이사 유형 (입주 70%, 퇴거 30%)
    const moveType: 'move_in' | 'move_out' =
      index % 10 < 7 ? 'move_in' : 'move_out';

    // 생성일: 예약일 기준 15~60일 전
    const createdDaysAgo = 15 + (index % 46);
    const createdAt = dayjs(date)
      .subtract(createdDaysAgo, 'day')
      .hour(10 + (index % 8))
      .minute((index * 11) % 60)
      .toISOString();
    const updatedAt = createdAt;

    const reservation: AdminMoveReservation = {
      id,
      ownerName: KOREAN_NAMES[index % KOREAN_NAMES.length],
      phone: generatePhoneNumber(index + 100),
      building,
      unit,
      elevatorLine,
      date,
      timeSlot,
      moveType,
      vehicleType: VEHICLE_TYPES[index % VEHICLE_TYPES.length],
      movingCompany: MOVING_COMPANIES[index % MOVING_COMPANIES.length],
      status,
      createdAt,
      updatedAt,
    };

    // 차량 번호 (일부만)
    if (index % 3 !== 0) {
      const regionCode = ['서울', '경기', '인천'][index % 3];
      const typeCode = ['가', '나', '다', '라', '마'][index % 5];
      const number = String(1000 + (index * 17) % 9000);
      reservation.vehicleNumber = `${regionCode}${typeCode} ${number}`;
    }

    // 특별 요청사항 (일부만)
    if (index % 4 === 0) {
      const requests = [
        '대형 가구 이동 시 주의 필요',
        '엘리베이터 보양 작업 필요',
        '주차장 확보 요청',
        '피아노 운반 예정',
      ];
      reservation.specialRequests = requests[index % 4];
    }

    // 취소 정보
    if (status === 'cancelled') {
      reservation.cancelledAt = dayjs(createdAt).add(5, 'day').toISOString();
      reservation.cancelReason =
        index % 2 === 0 ? '이사 일정 변경' : '계약 해지';
    }

    // 관리자 메모 (일부만)
    if (index % 6 === 0) {
      reservation.memo = '협력업체 사전 연락 완료';
    }

    return reservation;
  }
);

// 이사예약 설정
export const mockMoveReservationSettings: MoveReservationSettings = {
  id: 'move-settings-001',
  name: '기본 이사예약 설정',
  isActive: true,
  reservationPeriod: {
    minDays: 15,
    maxDays: 90,
  },
  timeSlotDuration: 3,
  availableTimeSlots: ['09:00~12:00', '12:00~15:00', '15:00~18:00'],
  elevatorLines: ['A', 'B', 'C', 'D'],
  maxReservationsPerLinePerSlot: 1,
  excludedDays: [0], // 일요일 제외
  excludedDates: ['2024-12-25', '2025-01-01'], // 특별 휴일
  createdAt: '2024-10-01T09:00:00.000Z',
  updatedAt: '2024-10-15T14:30:00.000Z',
};

// 특정 날짜의 이사예약 시간대 슬롯 가용성 생성
export function generateMoveTimeSlotAvailability(
  date: string
): MoveTimeSlotAvailability[] {
  const availability: MoveTimeSlotAvailability[] = [];

  // 해당 날짜의 예약 건수 확인
  const reservationsOnDate = mockMoveReservations.filter(
    (r) => r.date === date && r.status === 'active'
  );

  for (const line of ELEVATOR_LINES) {
    for (const timeSlot of MOVE_TIME_SLOTS) {
      const existingReservation = reservationsOnDate.find(
        (r) => r.elevatorLine === line && r.timeSlot === timeSlot
      );

      availability.push({
        date,
        elevatorLine: line,
        timeSlot,
        isAvailable: !existingReservation,
        reservationId: existingReservation?.id,
      });
    }
  }

  return availability;
}

// 이사예약 통계 생성
export function generateMoveReservationStats(): MoveReservationStats {
  const total = mockMoveReservations.length;
  const activeCount = mockMoveReservations.filter(
    (r) => r.status === 'active'
  ).length;
  const cancelledCount = mockMoveReservations.filter(
    (r) => r.status === 'cancelled'
  ).length;

  const moveInCount = mockMoveReservations.filter(
    (r) => r.moveType === 'move_in'
  ).length;
  const moveOutCount = mockMoveReservations.filter(
    (r) => r.moveType === 'move_out'
  ).length;

  const todayReservations = mockMoveReservations.filter(
    (r) => r.date === BASE_DATE && r.status === 'active'
  ).length;

  // 향후 7일 이내 예약
  const sevenDaysLater = dayjs(BASE_DATE).add(7, 'day').format('YYYY-MM-DD');
  const upcomingReservations = mockMoveReservations.filter(
    (r) =>
      r.date >= BASE_DATE &&
      r.date <= sevenDaysLater &&
      r.status === 'active'
  ).length;

  return {
    totalReservations: total,
    activeCount,
    cancelledCount,
    moveInCount,
    moveOutCount,
    todayReservations,
    upcomingReservations,
    averageReservationsPerDay: Math.round((total / 90) * 10) / 10, // 90일 범위
  };
}

// 이사예약 필터링 함수
export function filterMoveReservations(
  reservations: AdminMoveReservation[],
  filter: MoveReservationFilter
): AdminMoveReservation[] {
  return reservations.filter((r) => {
    // 날짜 필터
    if (filter.startDate && r.date < filter.startDate) return false;
    if (filter.endDate && r.date > filter.endDate) return false;

    // 상태 필터
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(r.status)) return false;
    }

    // 동 필터
    if (filter.building && r.building !== filter.building) return false;

    // 호수 필터
    if (filter.unit && r.unit !== filter.unit) return false;

    // 승강기 라인 필터
    if (filter.elevatorLine && r.elevatorLine !== filter.elevatorLine)
      return false;

    // 이사 유형 필터
    if (filter.moveType && r.moveType !== filter.moveType) return false;

    // 검색어 필터 (이름 또는 전화번호)
    if (filter.searchKeyword) {
      const keyword = filter.searchKeyword.toLowerCase();
      const nameMatch = r.ownerName.toLowerCase().includes(keyword);
      const phoneMatch = r.phone.includes(keyword);
      if (!nameMatch && !phoneMatch) return false;
    }

    return true;
  });
}

// =============================================================================
// 유틸리티 함수
// =============================================================================

// 상태 라벨 변환 (방문예약)
export function getVisitStatusLabel(status: VisitReservationStatus): string {
  const labels: Record<VisitReservationStatus, string> = {
    pending: '대기중',
    confirmed: '확정',
    cancelled: '취소',
    completed: '완료',
  };
  return labels[status];
}

// 상태 라벨 변환 (이사예약)
export function getMoveStatusLabel(status: MoveReservationStatus): string {
  const labels: Record<MoveReservationStatus, string> = {
    active: '예약중',
    cancelled: '취소',
  };
  return labels[status];
}

// 이사 유형 라벨 변환
export function getMoveTypeLabel(moveType: 'move_in' | 'move_out'): string {
  return moveType === 'move_in' ? '입주' : '퇴거';
}

// 상태별 색상 (방문예약)
export function getVisitStatusColor(
  status: VisitReservationStatus
): 'warning' | 'success' | 'error' | 'info' {
  const colors: Record<
    VisitReservationStatus,
    'warning' | 'success' | 'error' | 'info'
  > = {
    pending: 'warning',
    confirmed: 'info',
    cancelled: 'error',
    completed: 'success',
  };
  return colors[status];
}

// 상태별 색상 (이사예약)
export function getMoveStatusColor(
  status: MoveReservationStatus
): 'success' | 'error' {
  const colors: Record<MoveReservationStatus, 'success' | 'error'> = {
    active: 'success',
    cancelled: 'error',
  };
  return colors[status];
}

// 상태 라벨 변환 (방문일정)
export function getScheduleStatusLabel(status: VisitScheduleStatus): string {
  const labels: Record<VisitScheduleStatus, string> = {
    empty: '대기',
    reserved: '예약완료',
  };
  return labels[status];
}

// 입주형태 라벨 변환
export function getResidenceTypeLabel(residenceType: ResidenceType): string {
  const labels: Record<ResidenceType, string> = {
    owner: '소유주',
    tenant: '세입자',
    representative: '대리인',
  };
  return labels[residenceType];
}

// =============================================================================
// 방문일정 Mock 데이터 (관리자가 사전에 생성한 예약 가능 슬롯)
// =============================================================================

// 입주형태 목록
const RESIDENCE_TYPES: ResidenceType[] = ['owner', 'tenant', 'representative'];

// 방문일정 목록 생성 (30개의 사전 생성된 방문 슬롯)
export const mockVisitSchedules: VisitSchedule[] = Array.from(
  { length: 30 },
  (_, index) => {
    const id = `SCHEDULE-${String(index + 1).padStart(5, '0')}`;
    const buildingIndex = index % 10;
    const building = mockBuildingOptions[buildingIndex].name;
    const unit = mockBuildingOptions[buildingIndex].units[index % 15];

    // 날짜: 기준일 기준 -5일 ~ +10일 범위 (16일간)
    const dayOffset = (index % 16) - 5;
    const visitDate = dayjs(BASE_DATE).add(dayOffset, 'day').format('YYYY-MM-DD');

    // 시간대
    const visitTime = VISIT_TIME_SLOTS[index % VISIT_TIME_SLOTS.length];

    // 상태: 약 60%는 예약완료(reserved), 40%는 대기(empty)
    const status: VisitScheduleStatus = index % 5 < 3 ? 'reserved' : 'empty';

    // 생성일: 일정 날짜 기준 7~14일 전에 관리자가 미리 생성
    const createdDaysAgo = 7 + (index % 8);
    const createdAt = dayjs(visitDate)
      .subtract(createdDaysAgo, 'day')
      .hour(14)
      .minute((index * 5) % 60)
      .toISOString();
    const updatedAt = createdAt;

    const schedule: VisitSchedule = {
      id,
      building,
      unit,
      visitDate,
      visitTime,
      status,
      createdAt,
      updatedAt,
    };

    // 예약완료 상태인 경우 예약자 정보 추가
    if (status === 'reserved') {
      const nameIndex = (index * 3) % KOREAN_NAMES.length;

      schedule.name = KOREAN_NAMES[nameIndex];
      schedule.phone = generatePhoneNumber(index + 200);
      schedule.residenceType = RESIDENCE_TYPES[index % 3];
      schedule.companion = index % 4; // 0~3명의 동행인
      schedule.reservedAt = dayjs(createdAt).add(3, 'day').toISOString();

      // 생년월일 (일부만)
      if (index % 3 === 0) {
        const birthYear = 1970 + (index % 40);
        const birthMonth = String((index % 12) + 1).padStart(2, '0');
        const birthDay = String((index % 28) + 1).padStart(2, '0');
        schedule.birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
      }

      // 입주예정일 (일부만)
      if (index % 2 === 0) {
        const moveInDaysLater = 7 + (index % 14);
        schedule.moveInDate = dayjs(visitDate)
          .add(moveInDaysLater, 'day')
          .format('YYYY-MM-DD');
      }

      // 단말기번호 (일부만)
      if (index % 4 === 0) {
        schedule.terminalNumber = `T${String(1000 + index).padStart(4, '0')}`;
      }

      // 기타 메모 (일부만)
      if (index % 5 === 0) {
        const notes = [
          '유모차 접근 가능한 경로 확인 필요',
          '주차 공간 사전 확인 요청',
          '반려동물 동반 예정',
          '휠체어 이용자 동행',
          '고령자 동반 (엘리베이터 우선 이용)',
        ];
        schedule.note = notes[index % 5];
      }
    }

    return schedule;
  }
);

// 방문일정 필터링 함수
export function filterVisitSchedules(
  schedules: VisitSchedule[],
  filter: {
    status?: VisitScheduleStatus;
    building?: string;
    startDate?: string;
    endDate?: string;
    searchKeyword?: string;
  }
): VisitSchedule[] {
  return schedules.filter((s) => {
    // 날짜 필터
    if (filter.startDate && s.visitDate < filter.startDate) return false;
    if (filter.endDate && s.visitDate > filter.endDate) return false;

    // 상태 필터
    if (filter.status && s.status !== filter.status) return false;

    // 동 필터
    if (filter.building && s.building !== filter.building) return false;

    // 검색어 필터 (예약자 이름 또는 전화번호)
    if (filter.searchKeyword) {
      const keyword = filter.searchKeyword.toLowerCase();
      if (s.status === 'reserved') {
        const nameMatch = s.name?.toLowerCase().includes(keyword);
        const phoneMatch = s.phone?.includes(keyword);
        if (!nameMatch && !phoneMatch) return false;
      } else {
        // empty 상태는 검색어로 필터링하지 않음
        return false;
      }
    }

    return true;
  });
}

// 방문일정 통계 생성
export function generateVisitScheduleStats() {
  const total = mockVisitSchedules.length;
  const emptyCount = mockVisitSchedules.filter((s) => s.status === 'empty')
    .length;
  const reservedCount = mockVisitSchedules.filter(
    (s) => s.status === 'reserved'
  ).length;

  // 오늘의 방문일정
  const todaySchedules = mockVisitSchedules.filter(
    (s) => s.visitDate === BASE_DATE
  ).length;

  // 향후 7일 이내 예약완료 일정
  const sevenDaysLater = dayjs(BASE_DATE).add(7, 'day').format('YYYY-MM-DD');
  const upcomingReserved = mockVisitSchedules.filter(
    (s) =>
      s.visitDate >= BASE_DATE &&
      s.visitDate <= sevenDaysLater &&
      s.status === 'reserved'
  ).length;

  return {
    totalSchedules: total,
    emptyCount,
    reservedCount,
    todaySchedules,
    upcomingReserved,
    utilizationRate: Math.round((reservedCount / total) * 1000) / 10, // 이용률 (%)
  };
}

// 상태별 색상 (방문일정)
export function getScheduleStatusColor(
  status: VisitScheduleStatus
): 'default' | 'success' {
  const colors: Record<VisitScheduleStatus, 'default' | 'success'> = {
    empty: 'default',
    reserved: 'success',
  };
  return colors[status];
}
