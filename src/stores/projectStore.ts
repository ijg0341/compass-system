/**
 * 프로젝트 상태 관리 Store (Zustand)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, getProjects as getProjectsApi } from '@/src/lib/api/authApi';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  setCurrentProject: (uuid: string) => void;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getProjectsApi();
          const projects = response.data;

          // 현재 선택된 프로젝트가 없거나 목록에 없으면 첫 번째 프로젝트 선택
          const current = get().currentProject;
          const validCurrent = current && projects.some(p => p.uuid === current.uuid);

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
        const project = get().projects.find(p => p.uuid === uuid);
        if (project) {
          set({ currentProject: project });
        }
      },

      clearProjects: () => {
        set({ projects: [], currentProject: null, error: null });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ currentProject: state.currentProject }),
    }
  )
);
