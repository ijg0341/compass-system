/**
 * 인증 상태 관리 Store (Zustand)
 */
import { create } from 'zustand';
import { User, login as loginApi, logout as logoutApi, getMe, LoginRequest } from '@/src/lib/api/authApi';
import { apiClient } from '@/src/lib/api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isChecking: boolean;    // 인증 상태 확인 중 (ProtectedRoute용)
  isSubmitting: boolean;  // 로그인/로그아웃 요청 중
  error: string | null;

  // Actions
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // 401 에러 시 자동 로그아웃
  apiClient.setAuthExpiredCallback(() => {
    set({ user: null, isAuthenticated: false });
  });

  return {
    user: null,
    isAuthenticated: false,
    isChecking: true,     // 초기에는 인증 확인 필요
    isSubmitting: false,
    error: null,

    login: async (data: LoginRequest) => {
      set({ isSubmitting: true, error: null });
      try {
        const response = await loginApi(data);
        set({
          user: response.data.user,
          isAuthenticated: true,
          isSubmitting: false,
        });
        return true;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        set({
          error: error.response?.data?.message || '로그인에 실패했습니다.',
          isSubmitting: false,
        });
        return false;
      }
    },

    logout: async () => {
      set({ isSubmitting: true });
      try {
        await logoutApi();
      } catch {
        // 로그아웃 실패해도 클라이언트 상태는 초기화
      }
      set({ user: null, isAuthenticated: false, isSubmitting: false });
    },

    checkAuth: async () => {
      set({ isChecking: true });
      try {
        const response = await getMe();
        set({
          user: response.data.user,
          isAuthenticated: true,
          isChecking: false,
        });
      } catch {
        set({
          user: null,
          isAuthenticated: false,
          isChecking: false,
        });
      }
    },

    clearError: () => set({ error: null }),
  };
});
