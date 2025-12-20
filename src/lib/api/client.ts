/**
 * API Client - 세션 기반 인증
 * withCredentials로 쿠키 자동 전송
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.compass1998.com';
const DEFAULT_TIMEOUT = 30000;

// API 응답 공통 타입
export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

// 목록 응답 타입
export interface ApiListResponse<T> {
  code: number;
  message?: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    list: T[];
  };
}

// 에러 응답 타입
export interface ApiErrorResponse {
  code: number;
  message: string;
  title?: string;
  type?: string;
}

// 인증 만료 콜백 타입
type AuthExpiredCallback = () => void;

// API Client 싱글톤 클래스
class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private onAuthExpired: AuthExpiredCallback | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      withCredentials: true, // 세션 쿠키 전송
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 싱글톤 인스턴스 반환
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Axios 인스턴스 반환
  public getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  // 인증 만료 콜백 설정
  public setAuthExpiredCallback(callback: AuthExpiredCallback): void {
    this.onAuthExpired = callback;
  }

  // 인터셉터 설정
  private setupInterceptors(): void {
    // Response 인터셉터 - 에러 핸들링
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // blob 응답은 코드 체크 건너뛰기
        if (response.config.responseType === 'blob') {
          return response;
        }
        // code가 0이 아니면 에러로 처리
        if (response.data && response.data.code !== 0) {
          return Promise.reject({
            response: {
              data: response.data,
              status: response.status,
            },
          });
        }
        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        // 401 에러 시 인증 만료 콜백 호출
        if (error.response?.status === 401) {
          if (this.onAuthExpired) {
            this.onAuthExpired();
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

// 싱글톤 인스턴스 export
export const apiClient = ApiClient.getInstance();

// Axios 인스턴스 직접 export (편의용)
export const api = apiClient.getAxios();

export default apiClient;
