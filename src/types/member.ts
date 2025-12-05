/**
 * 회원관리 데이터 타입 정의
 */

// 회원 상태 타입
export type MemberStatus =
  | 'ACTIVE' // 활성
  | 'BLOCKED' // 차단
  | 'WITHDRAWN'; // 탈퇴

// 회원 레벨 타입
export type MemberLevel =
  | 'GENERAL' // 일반
  | 'VIP' // VIP
  | 'VVIP'; // VVIP

// 입주 형태 타입
export type ResidenceType =
  | 'OWNER' // 소유자
  | 'TENANT' // 임차인
  | 'FAMILY'; // 가족

// 입주자 데이터 인터페이스
export interface ResidentData {
  id: string; // 회원 ID
  no: number; // 순번
  registeredAt: string; // 등록일자
  level: MemberLevel; // 회원레벨
  dong: string; // 동
  ho: string; // 호
  unitType: string; // 타입
  line: string; // 라인
  contractorName: string; // 계약자명
  contractorPhone: string; // 계약자 연락처
  residentName: string; // 입주자명
  residentPhone: string; // 입주자 연락처
  residentIdNumber: string; // 주민번호 (마스킹)
  residenceType: ResidenceType; // 입주형태
  expectedMoveInDate?: string; // 입주예정일
  moveReservationDate?: string; // 이사예약일
  actualMoveInDate?: string; // 입주일
  memberType: string; // 회원구분
  loginId: string; // ID
  password?: string; // PW (마스킹 또는 생략)
  phoneNumber: string; // 전화번호
  mobileNumber: string; // 휴대폰번호
  joinedAt: string; // 가입일
  lastAccessAt?: string; // 최종접속
  status: MemberStatus; // 상태
  permission: string; // 권한
}

// 회원 통계 인터페이스
export interface MemberStats {
  totalMembers: number; // 전체 회원 수
  blockedMembers: number; // 차단된 회원 수
  withdrawnMembers: number; // 탈퇴한 회원 수
}

// 필터 인터페이스
export interface ResidentFilters {
  searchType?: 'memberId' | 'contractorName' | 'residentName'; // 검색 타입
  searchKeyword?: string; // 검색 키워드
  status?: MemberStatus[]; // 상태 필터
  memberType?: string; // 회원구분
  dong?: string; // 동
  ho?: string; // 호
  level?: MemberLevel; // 회원레벨
  isBlocked?: boolean; // 접근차단여부
}
