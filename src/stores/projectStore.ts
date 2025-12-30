/**
 * 프로젝트 상태 관리 Store (Zustand)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, getProjects as getProjectsApi } from '@/src/lib/api/authApi';

// 관리자 전용 모드를 위한 가상 프로젝트 상수
export const ADMIN_MODE_PROJECT: Project = {
  uuid: '__ADMIN_MODE__',
  name: '관리자 전용',
};

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isAdminMode: boolean;  // 관리자 전용 모드 여부
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  setCurrentProject: (uuid: string) => void;
  enterAdminMode: () => void;   // 관리자 전용 모드 진입
  exitAdminMode: () => void;    // 관리자 전용 모드 종료
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isAdminMode: false,
      isLoading: false,
      error: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getProjectsApi();
          const projects = response.data;

          // 관리자 모드면 유지
          if (get().isAdminMode) {
            set({
              projects,
              isLoading: false,
            });
            return;
          }

          // 현재 선택된 프로젝트가 없거나 목록에 없으면 첫 번째 프로젝트 선택
          const current = get().currentProject;
          const validCurrent = current && current.uuid !== ADMIN_MODE_PROJECT.uuid && projects.some(p => p.uuid === current.uuid);

          set({
            projects,
            currentProject: validCurrent ? current : (projects[0] || null),
            isLoading: false,
          });
        } catch (err) {
          const error = err as { response?: { data?: { message?: string } } };
          set({
            error: error.response?.data?.message || '프로젝트 목록을 불러오는데 실패했습니다.',
            isLoading: false,
          });
        }
      },

      setCurrentProject: (uuid: string) => {
        // 관리자 모드 전환
        if (uuid === ADMIN_MODE_PROJECT.uuid) {
          set({
            currentProject: ADMIN_MODE_PROJECT,
            isAdminMode: true,
          });
          return;
        }

        // 일반 프로젝트 전환
        const project = get().projects.find(p => p.uuid === uuid);
        if (project) {
          set({
            currentProject: project,
            isAdminMode: false,
          });
        }
      },

      enterAdminMode: () => {
        set({
          currentProject: ADMIN_MODE_PROJECT,
          isAdminMode: true,
        });
      },

      exitAdminMode: () => {
        const projects = get().projects;
        set({
          currentProject: projects[0] || null,
          isAdminMode: false,
        });
      },

      clearProjects: () => {
        set({ projects: [], currentProject: null, isAdminMode: false, error: null });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        currentProject: state.currentProject,
        isAdminMode: state.isAdminMode,
      }),
    }
  )
);
