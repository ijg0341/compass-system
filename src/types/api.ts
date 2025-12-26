/**
 * API 공통 타입 정의
 */

// API 날짜 응답 형식
export interface ApiDateResponse {
  date: string;
  timezone_type: number;
  timezone: string;
}

// 공통 응답 래퍼
export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

// 목록 응답 데이터 (offset 기반)
export interface ApiListData<T> {
  offset: number;
  limit: number;
  total: number;
  list: T[];
}

// 목록 응답 데이터 (page 기반)
export interface ApiPageListData<T> {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  list: T[];
}

// 목록 응답 래퍼
export interface ApiListResponse<T> {
  code: number;
  message?: string;
  data: ApiListData<T>;
}

// 단순 목록 응답 (offset/limit 없음)
export interface ApiSimpleListData<T> {
  list: T[];
}

// 생성 응답
export interface ApiCreateResponse {
  code: number;
  message: string;
  data: {
    id: number;
  };
}

// 에러 응답
export interface ApiErrorResponse {
  code: number;
  message: string;
  title?: string;
  type?: string;
}

// 페이지네이션 파라미터
export interface PaginationParams {
  offset?: number;
  limit?: number;
}
