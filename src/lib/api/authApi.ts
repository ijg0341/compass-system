/**
 * 인증 API
 */
import { api, ApiResponse } from './client';

// 사용자 정보 타입
export interface User {
  id: number;
  user_id: string;
  name: string;
  role: string;
  company_id: number;
}

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
