/**
 * A/S 접수관리 데이터 타입 정의
 */

// A/S 상태 타입
export type ASReceiptStatus =
  | 'RECEIVED' // 접수
  | 'ASSIGNED' // 배정
  | 'IN_PROGRESS' // 진행중
  | 'QA' // 품질검수
  | 'DONE' // 완료
  | 'REJECTED'; // 반려

// 우선순위 타입
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// A/S 접수 사진 데이터
export interface ASReceiptPhotos {
  far: string[]; // 원거리 사진
  near: string[]; // 근거리 사진
}

// A/S 접수 첨부파일 데이터
export interface ASReceiptAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

// A/S 접수 이력 데이터
export interface ASReceiptHistory {
  id: string;
  type: 'STATUS_CHANGE' | 'COMMENT' | 'ASSIGNMENT' | 'APPROVAL';
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  oldValue?: string;
  newValue?: string;
}

// 승인 정보
export interface ASReceiptApproval {
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}

// 하자 유형 (4단계 트리 구조)
export interface DefectType {
  level1: string; // 대분류
  level2: string; // 중분류
  level3: string; // 소분류
  level4: string; // 세분류
}

// A/S 접수 메인 데이터
export interface ASReceiptData {
  id: string;
  siteName: string; // 현장명
  dong: string; // 동
  ho: string; // 호수
  trade: string; // 공종
  subTrade: string; // 소공종
  defectType: DefectType; // 하자유형
  status: ASReceiptStatus; // 상태
  priority: Priority; // 우선순위
  partner?: string; // 협력사
  assignee?: string; // 담당자
  requester: string; // 요청자
  requestedAt: string; // 접수일
  dueDate: string; // 예정일
  completedAt?: string; // 완료일
  photos: ASReceiptPhotos; // 사진
  attachments: ASReceiptAttachment[]; // 첨부파일
  description: string; // 내용
  comments: number; // 코멘트 수
  histories: ASReceiptHistory[]; // 이력
  approval?: ASReceiptApproval; // 승인정보
}

// 필터 옵션
export interface ASReceiptFilters {
  siteId?: string;
  dong?: string;
  ho?: string;
  trade?: string;
  subTrade?: string;
  status?: ASReceiptStatus[];
  priority?: Priority[];
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
  assignedToMe?: boolean;
}

// 정렬 옵션
export type SortField =
  | 'id'
  | 'requestedAt'
  | 'dueDate'
  | 'status'
  | 'priority'
  | 'siteName';

export interface SortOption {
  field: SortField;
  order: 'asc' | 'desc';
}

// 현장 옵션
export interface SiteOption {
  id: string;
  name: string;
}

// 공종 옵션
export interface TradeOption {
  id: string;
  name: string;
  subTrades: { id: string; name: string }[];
}
