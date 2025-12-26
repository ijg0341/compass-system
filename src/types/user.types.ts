/**
 * 사용자 관리 타입 정의
 * project_users 테이블 기준 (type: 1=입주자, 2=협력사, 3=매니저)
 */

import type { PaginationParams } from './api';

// 사용자 타입
export type UserType = 1 | 2 | 3; // 1: 입주자, 2: 협력사, 3: 매니저

// 매니저 역할 (백엔드 role 필드: B1, B2, B3, B4)
export type ManagerMemberType = 'B1' | 'B2' | 'B3' | 'B4';

export const MANAGER_TYPE_LABELS: Record<ManagerMemberType, string> = {
  B1: '조합사용자',
  B2: '현장관리자',
  B3: '매니저',
  B4: '관리사무소',
};

export const MANAGER_TYPE_OPTIONS = [
  { value: 'B1', label: '조합사용자' },
  { value: 'B2', label: '현장관리자' },
  { value: 'B3', label: '매니저' },
  { value: 'B4', label: '관리사무소' },
] as const;

// ========================================
// 공통 사용자 인터페이스
// ========================================

export interface ProjectUser {
  id: number;
  project_id: number;
  user_id: string;       // 아이디
  type: UserType;        // 유형
  name: string;          // 담당자/직책
  birthday?: string;     // 생년월일 (매니저용)
  phone?: string;        // 연락처
  company?: string;      // 회사명
  department?: string;   // 부서명
  email?: string;        // 이메일
  address?: string;      // 주소
  telephone?: string;    // 대표번호
  business_number?: string; // 사업자등록번호
  is_active: boolean;    // 접근/차단
  last_login_at?: string; // 마지막 로그인
  memo?: string;         // 비고

  // 입주자 전용 필드 (API 응답에 포함될 수 있음)
  dongho_id?: number;
  dong?: string;
  ho?: string;
}

// ========================================
// 입주자 관리
// ========================================

export interface ResidentUser extends ProjectUser {
  type: 1;
  dongho_id: number;
  dong: string;
  ho: string;
}

export interface ResidentListItem {
  id: number;
  user_id: string;
  dong: string;
  ho: string;
  name: string;          // 입주자 성명
  phone?: string;        // 입주자 연락처
  is_active: boolean;
  last_login_at?: string;
}

// ========================================
// 협력사 관리
// ========================================

export interface PartnerUser extends ProjectUser {
  type: 2;
}

export interface PartnerListItem {
  id: number;
  user_id: string;
  company?: string;      // 회사명
  department?: string;   // 부서명
  name: string;          // 담당자
  phone?: string;        // 연락처
  is_active: boolean;
  last_login_at?: string;
}

export interface PartnerFormData {
  user_id: string;
  password?: string;
  name: string;          // 담당자/직책
  phone?: string;
  company?: string;
  department?: string;
  email?: string;
  address?: string;
  telephone?: string;
  business_number?: string;
  is_active: boolean;
  memo?: string;
}

// ========================================
// 매니저 관리
// ========================================

export interface ManagerUser extends ProjectUser {
  type: 3;
  member_type?: ManagerMemberType; // 회원구분
}

export interface ManagerListItem {
  id: number;
  user_id: string;
  member_type?: string;  // 회원구분
  company?: string;      // 회사명
  department?: string;   // 부서명
  name: string;          // 성명
  phone?: string;        // 연락처
  is_active: boolean;
  last_login_at?: string;
}

export interface ManagerFormData {
  user_id: string;
  password?: string;
  member_type?: ManagerMemberType;
  birthday?: string;
  name: string;          // 담당자/직책
  phone?: string;
  company?: string;
  department?: string;
  email?: string;
  address?: string;
  telephone?: string;
  business_number?: string;
  is_active: boolean;
  memo?: string;
}

// ========================================
// API 요청/응답 타입
// ========================================

export interface UserListParams extends PaginationParams {
  type?: UserType;
  searchKeyword?: string;
  is_active?: boolean;
}

export interface CreateUserRequest {
  user_id: string;
  password: string;
  type: UserType;
  name: string;
  role?: ManagerMemberType; // 매니저 역할
  birthday?: string;
  phone?: string;
  company?: string;
  department?: string;
  email?: string;
  address?: string;
  telephone?: string;
  business_number?: string;
  is_active?: boolean;
  memo?: string;
}

export interface UpdateUserRequest {
  password?: string;
  name?: string;
  role?: ManagerMemberType; // 매니저 역할
  birthday?: string;
  phone?: string;
  company?: string;
  department?: string;
  email?: string;
  address?: string;
  telephone?: string;
  business_number?: string;
  is_active?: boolean;
  memo?: string;
}

// 계정 생성 응답
export interface CreateAccountsResponse {
  created_count: number;
}

// 아이디 중복 확인 응답
export interface CheckUserIdResponse {
  available: boolean;
}
