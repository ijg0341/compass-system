/**
 * 스마트넷 URL 생성 타입 정의
 */

// 카테고리 타입
export type SmartnetCategory = 'visit' | 'move' | 'vote';

// 카테고리 라벨
export const CATEGORY_LABELS: Record<SmartnetCategory, string> = {
  visit: '방문예약',
  move: '이사예약',
  vote: '전자투표',
};

// 기본 컨텐츠 정보
export interface SmartnetContent {
  title: string;
  description: string; // Quill HTML content
  logoImage: string | null; // 로고 이미지 URL 또는 base64
  mainImage: string | null; // 메인 이미지 URL 또는 base64
}

// 방문예약 설정
export interface SmartnetVisitSettings {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  timeInterval: 30 | 60; // 분 단위
  maxReservationsPerSlot: number; // 시간대별 예약 가능 세대수
}

// 이사예약 설정
export interface SmartnetMoveSettings {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  timeSlotDuration: 1 | 2 | 3; // 시간 단위
}

// 전자투표 설정 (향후 확장)
export interface SmartnetVoteSettings {
  startDate: string;
  endDate: string;
  votingItems: string[];
}

// 폼 데이터 전체
export interface SmartnetFormData {
  category: SmartnetCategory | null;
  content: SmartnetContent;
  visitSettings: SmartnetVisitSettings;
  moveSettings: SmartnetMoveSettings;
  voteSettings: SmartnetVoteSettings;
}

// 생성된 URL 정보
export interface GeneratedURL {
  id: string;
  url: string;
  category: SmartnetCategory;
  createdAt: string;
}

// 스마트넷 상태
export type SmartnetStatus = 'active' | 'inactive' | 'expired';

// 상태 라벨
export const STATUS_LABELS: Record<SmartnetStatus, string> = {
  active: '활성',
  inactive: '비활성',
  expired: '만료',
};

// 통계 정보
export interface SmartnetStats {
  viewCount: number; // 조회수
  actionCount: number; // 예약/투표 수
  lastAccessedAt?: string; // 마지막 접근 시간
}

// 목록 아이템
export interface SmartnetListItem {
  id: string;
  category: SmartnetCategory;
  title: string;
  url: string;
  status: SmartnetStatus;
  createdAt: string;
  startDate: string;
  endDate: string;
  stats: SmartnetStats;
  description?: string;
}

// 목록 필터
export interface SmartnetFilter {
  category?: SmartnetCategory;
  status?: SmartnetStatus[];
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
}

// 초기 폼 데이터
export const INITIAL_FORM_DATA: SmartnetFormData = {
  category: null,
  content: {
    title: '',
    description: '',
    logoImage: null,
    mainImage: null,
  },
  visitSettings: {
    startDate: '',
    endDate: '',
    timeInterval: 60,
    maxReservationsPerSlot: 5,
  },
  moveSettings: {
    startDate: '',
    endDate: '',
    timeSlotDuration: 2,
  },
  voteSettings: {
    startDate: '',
    endDate: '',
    votingItems: [],
  },
};
