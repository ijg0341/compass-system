/**
 * URL 쿼리 파라미터와 프로젝트 상태를 동기화하는 훅
 * - URL의 ?project={uuid} 파라미터를 읽어서 projectStore와 동기화
 * - 프로젝트 변경 시 URL 업데이트
 * - 권한 없는 프로젝트 접근 시 /main으로 리다이렉트
 */
import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/src/stores/projectStore';

export function useProjectUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentProject, projects, setCurrentProject, isLoading } = useProjectStore();

  // 내부 업데이트 중인지 추적 (무한 루프 방지)
  const isInternalUpdate = useRef(false);

  // URL에서 project 파라미터 읽기
  const projectFromUrl = searchParams.get('project');

  // URL <-> Store 동기화
  useEffect(() => {
    if (isLoading || projects.length === 0) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (projectFromUrl) {
      // URL에 project가 있으면 해당 프로젝트로 설정 시도
      const hasAccess = projects.some(p => p.uuid === projectFromUrl);

      if (hasAccess) {
        // 권한이 있고 현재 선택과 다르면 Store 업데이트
        if (currentProject?.uuid !== projectFromUrl) {
          setCurrentProject(projectFromUrl);
        }
      } else {
        // 권한이 없으면 /main으로 리다이렉트
        navigate('/main', { replace: true });
      }
    } else if (currentProject) {
      // URL에 project가 없으면 현재 프로젝트로 URL 업데이트
      isInternalUpdate.current = true;
      const newParams = new URLSearchParams(searchParams);
      newParams.set('project', currentProject.uuid);
      setSearchParams(newParams, { replace: true });
    }
  }, [projectFromUrl, projects, currentProject?.uuid, isLoading]);

  // 프로젝트 변경 함수 (권한 체크 포함)
  const switchProject = useCallback((uuid: string) => {
    const hasAccess = projects.some(p => p.uuid === uuid);

    if (hasAccess) {
      // Store 업데이트
      setCurrentProject(uuid);
      // URL 업데이트
      isInternalUpdate.current = true;
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('project', uuid);
      setSearchParams(newParams, { replace: true });
    } else {
      // 권한이 없으면 /main으로 리다이렉트
      navigate('/main', { replace: true });
    }
  }, [projects, setCurrentProject, setSearchParams, navigate]);

  return {
    currentProjectUuid: currentProject?.uuid ?? '',
    switchProject,
  };
}
