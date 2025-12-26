/**
 * 현재 선택된 프로젝트 UUID를 반환하는 훅
 */
import { useProjectStore } from '@/src/stores/projectStore';

export function useCurrentProject() {
  const { currentProject, projects, isLoading, setCurrentProject } = useProjectStore();

  return {
    projectUuid: currentProject?.uuid ?? '',
    projectName: currentProject?.name ?? '',
    projects,
    isLoading,
    hasProject: !!currentProject,
    setCurrentProject,
  };
}
