/**
 * 인증 API
 */
import { api, ApiResponse } from './client';

// 사용자 정보 타입
export interface User {
  id: number;
  user_id: string;
  name: string;
  role: UserRole;
  company_id: number;
}

// 사용자 권한 타입
export type UserRole = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'B4' | 'C1' | 'D1';

// 관리자 전용 접근 가능 권한 (A1: C총괄, A2: C관리자)
export const SUPER_ADMIN_ROLES: UserRole[] = ['A1', 'A2'];

// A1만 접근 가능한 권한
export const TOP_ADMIN_ROLE: UserRole = 'A1';

// 로그인 요청 타입
export interface LoginRequest {
  user_id: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  user: User;
}

// 프로젝트 정보 타입
export interface Project {
  uuid: string;
  name: string;
}

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/adm/auth/login', data);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/adm/auth/logout');
  return response.data;
};

/**
 * 현재 로그인 상태 확인
 */
export const getMe = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/adm/auth/me');
  return response.data;
};

/**
 * 접근 가능한 프로젝트 목록 조회
 */
export const getProjects = async (): Promise<ApiResponse<Project[]>> => {
  const response = await api.get<ApiResponse<Project[]>>('/adm/auth/projects');
  return response.data;
};
