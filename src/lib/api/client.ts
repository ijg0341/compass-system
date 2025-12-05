/**
 * API Client - 싱글톤 패턴
 * Axios 인스턴스를 전역으로 관리
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API 기본 설정
const API_BASE_URL = 'https://api.compass1998.com';
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

// API Client 싱글톤 클래스
class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokensFromStorage();
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

  // 토큰 설정
  public setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    this.saveTokensToStorage();
  }

  // 토큰 초기화 (로그아웃)
  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // 현재 토큰 반환
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  // 인증 여부 확인
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // 인터셉터 설정
  private setupInterceptors(): void {
    // Request 인터셉터 - 토큰 자동 첨부
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response 인터셉터 - 에러 핸들링
    this.axiosInstance.interceptors.response.use(
      (response) => {
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
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;

        // 401 에러 시 토큰 갱신 시도
        if (error.response?.status === 401 && originalRequest && this.refreshToken) {
          try {
            const response = await this.refreshAccessToken();
            if (response) {
              // 새 토큰으로 재요청
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch {
            // 토큰 갱신 실패 시 로그아웃
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // 토큰 갱신
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      if (response.data.code === 0 && response.data.data) {
        this.setTokens(
          response.data.data.accessToken,
          response.data.data.refreshToken
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // 로컬 스토리지에서 토큰 로드
  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  // 로컬 스토리지에 토큰 저장
  private saveTokensToStorage(): void {
    if (typeof window !== 'undefined') {
      if (this.accessToken) {
        localStorage.setItem('accessToken', this.accessToken);
      }
      if (this.refreshToken) {
        localStorage.setItem('refreshToken', this.refreshToken);
      }
    }
  }
}

// 싱글톤 인스턴스 export
export const apiClient = ApiClient.getInstance();

// Axios 인스턴스 직접 export (편의용)
export const api = apiClient.getAxios();

export default apiClient;
