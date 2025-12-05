import dayjs from 'dayjs';
import type {
  KPICardData,
  ASProcessData,
  WorkTypeData,
  PartnerData,
  BuildingHeatmapData,
  VisitTimeData,
  MoveInProgressData,
  RecentRequestData,
} from '@/src/types/dashboard';

/**
 * Mock 데이터 생성 함수들
 *
 * 고정된 기준 날짜를 사용하여 서버/클라이언트 hydration 이슈 방지
 */
const BASE_DATE = '2024-10-22';

// KPI 카드 데이터
export const mockKPIData: KPICardData[] = [
  {
    id: 'total-received',
    label: '총 접수 건수 (월간)',
    value: 1248,
    unit: '건',
    change: 12.5,
    changeType: 'increase',
  },
  {
    id: 'total-processed',
    label: '총 처리 건수 (월간)',
    value: 1089,
    unit: '건',
    change: 8.3,
    changeType: 'increase',
  },
  {
    id: 'process-rate',
    label: '처리율',
    value: 87.3,
    unit: '%',
    change: -2.1,
    changeType: 'decrease',
  },
  {
    id: 'pending-delayed',
    label: '미처리/지연 건수',
    value: 159,
    unit: '건',
    change: 15.2,
    changeType: 'increase',
  },
  {
    id: 'move-in-visit',
    label: '입주 세대 / 방문 세대',
    value: 342,
    unit: '/ 478 세대',
    change: 5.8,
    changeType: 'increase',
  },
  {
    id: 'avg-response-time',
    label: '협력사 평균 처리시간',
    value: 18.6,
    unit: '시간',
    change: -3.2,
    changeType: 'decrease',
  },
];

// A/S 처리 현황 (최근 30일)
export const mockASProcessData: ASProcessData = {
  labels: Array.from({ length: 30 }, (_, i) => {
    return dayjs(BASE_DATE).subtract(29 - i, 'day').format('MM.DD');
  }),
  received: [
    42, 38, 45, 51, 48, 39, 35, 47, 52, 49, 46, 41, 38, 50, 55,
    48, 43, 39, 46, 53, 51, 47, 44, 40, 48, 54, 52, 49, 45, 51
  ],
  processed: [
    38, 36, 41, 47, 45, 37, 33, 43, 48, 46, 42, 39, 35, 46, 51,
    45, 40, 36, 43, 49, 48, 44, 41, 38, 45, 50, 49, 46, 42, 47
  ],
};

// 공종별 데이터
export const mockWorkTypeData: WorkTypeData[] = [
  {
    id: 'electric',
    name: '전기',
    totalReceived: 324,
    processRate: 89.5,
    avgProcessTime: 1.8,
  },
  {
    id: 'plumbing',
    name: '설비',
    totalReceived: 412,
    processRate: 85.2,
    avgProcessTime: 2.3,
  },
  {
    id: 'construction',
    name: '토목',
    totalReceived: 198,
    processRate: 92.1,
    avgProcessTime: 3.5,
  },
  {
    id: 'interior',
    name: '인테리어',
    totalReceived: 286,
    processRate: 81.5,
    avgProcessTime: 2.1,
  },
  {
    id: 'flooring',
    name: '바닥',
    totalReceived: 156,
    processRate: 88.9,
    avgProcessTime: 1.6,
  },
  {
    id: 'door-window',
    name: '문/창호',
    totalReceived: 223,
    processRate: 86.5,
    avgProcessTime: 1.9,
  },
];

// 협력사 데이터 (Best 3 / Worst 3)
export const mockBestPartnersData: PartnerData[] = [
  {
    id: 'partner-001',
    name: '(주)다솔전기',
    totalReceived: 156,
    processRate: 96.8,
    avgResponseTime: 12.3,
    rank: 1,
  },
  {
    id: 'partner-002',
    name: '한빛설비',
    totalReceived: 189,
    processRate: 94.2,
    avgResponseTime: 14.6,
    rank: 2,
  },
  {
    id: 'partner-003',
    name: '세진건설',
    totalReceived: 142,
    processRate: 92.5,
    avgResponseTime: 15.8,
    rank: 3,
  },
];

export const mockWorstPartnersData: PartnerData[] = [
  {
    id: 'partner-015',
    name: '삼성인테리어',
    totalReceived: 98,
    processRate: 72.4,
    avgResponseTime: 38.5,
    rank: 1,
  },
  {
    id: 'partner-016',
    name: '동양바닥',
    totalReceived: 76,
    processRate: 75.8,
    avgResponseTime: 35.2,
    rank: 2,
  },
  {
    id: 'partner-017',
    name: '신화창호',
    totalReceived: 103,
    processRate: 78.6,
    avgResponseTime: 32.7,
    rank: 3,
  },
];

// 동별 히트맵 데이터 (101동~110동)
export const mockBuildingHeatmapData: BuildingHeatmapData[] = [
  { building: '101동', count: 89, intensity: 75 },
  { building: '102동', count: 112, intensity: 95 },
  { building: '103동', count: 78, intensity: 65 },
  { building: '104동', count: 95, intensity: 80 },
  { building: '105동', count: 68, intensity: 55 },
  { building: '106동', count: 134, intensity: 100 },
  { building: '107동', count: 91, intensity: 77 },
  { building: '108동', count: 73, intensity: 60 },
  { building: '109동', count: 87, intensity: 73 },
  { building: '110동', count: 102, intensity: 85 },
];

// 방문 시간대별 데이터 (Heatmap용 - 요일 × 시간)
export const mockVisitTimeData: VisitTimeData[] = (() => {
  const data: VisitTimeData[] = [];
  // 고정된 패턴 데이터 (요일별, 시간별)
  const basePattern = [12, 10, 14, 11, 15, 13, 9]; // 요일별 기본 패턴

  for (let day = 0; day < 7; day++) {
    for (let hour = 9; hour < 18; hour++) {
      // 근무시간 9-18시
      const baseCount = basePattern[day] + (hour - 9);
      // 점심시간(12-13시) 감소
      const lunchPenalty = hour === 12 ? -5 : 0;
      // 주말(토일) 감소
      const weekendPenalty = day === 0 || day === 6 ? -3 : 0;

      data.push({
        hour,
        dayOfWeek: day,
        count: Math.max(baseCount + lunchPenalty + weekendPenalty, 2),
      });
    }
  }
  return data;
})();

// 입주 진행률 데이터
export const mockMoveInProgressData: MoveInProgressData = {
  total: 478,
  completed: 342,
  progressRate: 71.5,
  checklistSubmitRate: 85.4,
  keyHandoverRate: 68.9,
};

// 최근 접수 내역 (최근 20건)
export const mockRecentRequestsData: RecentRequestData[] = [
  {
    id: 'REQ-20240001',
    site: '힐스테이트 1단지',
    workType: '전기',
    receivedDate: dayjs(BASE_DATE).subtract(0, 'day').format('YYYY-MM-DD'),
    status: '지연',
    manager: '김철수',
    building: '102동',
    unit: '1201호',
  },
  {
    id: 'REQ-20240002',
    site: '힐스테이트 2단지',
    workType: '설비',
    receivedDate: dayjs(BASE_DATE).subtract(1, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '이영희',
    building: '105동',
    unit: '804호',
  },
  {
    id: 'REQ-20240003',
    site: '자이 아파트',
    workType: '토목',
    receivedDate: dayjs(BASE_DATE).subtract(2, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '박민수',
    building: '103동',
    unit: '1503호',
  },
  {
    id: 'REQ-20240004',
    site: '힐스테이트 1단지',
    workType: '인테리어',
    receivedDate: dayjs(BASE_DATE).subtract(3, 'day').format('YYYY-MM-DD'),
    status: '접수중',
    manager: '정수연',
    building: '108동',
    unit: '702호',
  },
  {
    id: 'REQ-20240005',
    site: '힐스테이트 2단지',
    workType: '바닥',
    receivedDate: dayjs(BASE_DATE).subtract(4, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '최동욱',
    building: '101동',
    unit: '304호',
  },
  {
    id: 'REQ-20240006',
    site: '자이 아파트',
    workType: '문/창호',
    receivedDate: dayjs(BASE_DATE).subtract(5, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '김철수',
    building: '107동',
    unit: '1102호',
  },
  {
    id: 'REQ-20240007',
    site: '힐스테이트 1단지',
    workType: '전기',
    receivedDate: dayjs(BASE_DATE).subtract(6, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '이영희',
    building: '104동',
    unit: '901호',
  },
  {
    id: 'REQ-20240008',
    site: '힐스테이트 2단지',
    workType: '설비',
    receivedDate: dayjs(BASE_DATE).subtract(7, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '박민수',
    building: '106동',
    unit: '603호',
  },
  {
    id: 'REQ-20240009',
    site: '자이 아파트',
    workType: '토목',
    receivedDate: dayjs(BASE_DATE).subtract(8, 'day').format('YYYY-MM-DD'),
    status: '지연',
    manager: '정수연',
    building: '109동',
    unit: '1404호',
  },
  {
    id: 'REQ-20240010',
    site: '힐스테이트 1단지',
    workType: '인테리어',
    receivedDate: dayjs(BASE_DATE).subtract(9, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '최동욱',
    building: '110동',
    unit: '502호',
  },
  {
    id: 'REQ-20240011',
    site: '힐스테이트 2단지',
    workType: '바닥',
    receivedDate: dayjs(BASE_DATE).subtract(10, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '김철수',
    building: '102동',
    unit: '1303호',
  },
  {
    id: 'REQ-20240012',
    site: '자이 아파트',
    workType: '문/창호',
    receivedDate: dayjs(BASE_DATE).subtract(11, 'day').format('YYYY-MM-DD'),
    status: '접수중',
    manager: '이영희',
    building: '105동',
    unit: '704호',
  },
  {
    id: 'REQ-20240013',
    site: '힐스테이트 1단지',
    workType: '전기',
    receivedDate: dayjs(BASE_DATE).subtract(12, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '박민수',
    building: '103동',
    unit: '1001호',
  },
  {
    id: 'REQ-20240014',
    site: '힐스테이트 2단지',
    workType: '설비',
    receivedDate: dayjs(BASE_DATE).subtract(13, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '정수연',
    building: '108동',
    unit: '402호',
  },
  {
    id: 'REQ-20240015',
    site: '자이 아파트',
    workType: '토목',
    receivedDate: dayjs(BASE_DATE).subtract(14, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '최동욱',
    building: '101동',
    unit: '1504호',
  },
  {
    id: 'REQ-20240016',
    site: '힐스테이트 1단지',
    workType: '인테리어',
    receivedDate: dayjs(BASE_DATE).subtract(15, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '김철수',
    building: '107동',
    unit: '803호',
  },
  {
    id: 'REQ-20240017',
    site: '힐스테이트 2단지',
    workType: '바닥',
    receivedDate: dayjs(BASE_DATE).subtract(16, 'day').format('YYYY-MM-DD'),
    status: '지연',
    manager: '이영희',
    building: '104동',
    unit: '1202호',
  },
  {
    id: 'REQ-20240018',
    site: '자이 아파트',
    workType: '문/창호',
    receivedDate: dayjs(BASE_DATE).subtract(17, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '박민수',
    building: '106동',
    unit: '601호',
  },
  {
    id: 'REQ-20240019',
    site: '힐스테이트 1단지',
    workType: '전기',
    receivedDate: dayjs(BASE_DATE).subtract(18, 'day').format('YYYY-MM-DD'),
    status: '처리중',
    manager: '정수연',
    building: '109동',
    unit: '1103호',
  },
  {
    id: 'REQ-20240020',
    site: '힐스테이트 2단지',
    workType: '설비',
    receivedDate: dayjs(BASE_DATE).subtract(19, 'day').format('YYYY-MM-DD'),
    status: '완료',
    manager: '최동욱',
    building: '110동',
    unit: '904호',
  },
];

/**
 * 기간 필터에 따른 데이터 생성 함수
 */
export function generateASProcessDataByRange(days: number, baseDate?: string): ASProcessData {
  // 고정된 패턴으로 데이터 생성 (sin 파동 패턴)
  const baseReceived = 45;
  const baseProcessed = 40;
  const refDate = baseDate || BASE_DATE;

  return {
    labels: Array.from({ length: days }, (_, i) => {
      return dayjs(refDate).subtract(days - 1 - i, 'day').format('MM.DD');
    }),
    received: Array.from({ length: days }, (_, i) => {
      // sin 곡선을 사용한 고정된 패턴
      const variation = Math.sin(i / 5) * 10;
      return Math.round(baseReceived + variation);
    }),
    processed: Array.from({ length: days }, (_, i) => {
      // sin 곡선을 사용한 고정된 패턴 (약간의 위상차)
      const variation = Math.sin((i / 5) + 0.5) * 8;
      return Math.round(baseProcessed + variation);
    }),
  };
}
