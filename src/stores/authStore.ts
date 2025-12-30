/**
 * 인증 상태 관리 Store (Zustand)
 */
import { create } from 'zustand';
import { User, login as loginApi, logout as logoutApi, getMe, LoginRequest, SUPER_ADMIN_ROLES, TOP_ADMIN_ROLE, UserRole } from '@/src/lib/api/authApi';
import { apiClient } from '@/src/lib/api/client';
import { useProjectStore } from './projectStore';

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

  // Getters
  canAccessAdminMode: () => boolean;  // 관리자 전용 모드 접근 가능 여부 (A1, A2)
  canManageAdmins: () => boolean;     // 관리자 관리 접근 가능 여부 (A1만)
  getUserRole: () => UserRole | null;
}

export const useAuthStore = create<AuthState>((set, get) => {
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
        await loginApi(data);
        // 로그인 성공 후 프로젝트 목록 조회
        await useProjectStore.getState().fetchProjects();
        set({
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
      useProjectStore.getState().clearProjects();
      set({ user: null, isAuthenticated: false, isSubmitting: false });
    },

    checkAuth: async () => {
      set({ isChecking: true });
      try {
        const response = await getMe();
        // 인증 확인 후 프로젝트 목록 조회
        await useProjectStore.getState().fetchProjects();
        set({
          user: response.data.user,
          isAuthenticated: true,
          isChecking: false,
        });
      } catch {
        useProjectStore.getState().clearProjects();
        set({
          user: null,
          isAuthenticated: false,
          isChecking: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    // Getters
    canAccessAdminMode: () => {
      const { user } = get();
      return user?.role ? SUPER_ADMIN_ROLES.includes(user.role) : false;
    },

    canManageAdmins: () => {
      const { user } = get();
      return user?.role === TOP_ADMIN_ROLE;
    },

    getUserRole: () => {
      const { user } = get();
      return user?.role || null;
    },
  };
});
