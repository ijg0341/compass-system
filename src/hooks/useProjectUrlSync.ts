/**
 * URL 쿼리 파라미터와 프로젝트 상태를 동기화하는 훅
 * - URL의 ?project={uuid} 파라미터를 읽어서 projectStore와 동기화
 * - 프로젝트 변경 시 URL 업데이트
 * - 권한 없는 프로젝트 접근 시 /main으로 리다이렉트
 * - /admin/* 경로 접근 시 권한 체크 및 자동 모드 전환
 */
import { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useProjectStore, ADMIN_MODE_PROJECT } from '@/src/stores/projectStore';
import { useAuthStore } from '@/src/stores/authStore';

// 모듈 레벨 변수 (컴포넌트 리렌더/마운트와 무관하게 유지)
let syncPausedUntil = 0;

export function useProjectUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject, projects, setCurrentProject, isLoading, isAdminMode } = useProjectStore();
  const { canAccessAdminMode } = useAuthStore();

  // URL에서 project 파라미터 읽기
  const projectFromUrl = searchParams.get('project');

  // 관리자 전용 페이지인지 확인
  const isAdminPath = location.pathname.startsWith('/admin');

  // URL <-> Store 동기화 (초기 로드 및 외부 URL 변경 시에만)
  useEffect(() => {
    if (isLoading) return;

    // 동기화 일시 중지 상태면 스킵 (타임스탬프 기반)
    if (Date.now() < syncPausedUntil) {
      return;
    }

    // /admin/* 경로 접근 시 처리
    if (isAdminPath) {
      const hasAdminAccess = canAccessAdminMode();

      if (hasAdminAccess) {
        // 권한이 있으면 자동으로 관리자 모드 진입
        if (!isAdminMode) {
          setCurrentProject(ADMIN_MODE_PROJECT.uuid);
        }
      } else {
        // 권한이 없으면 첫 번째 프로젝트의 메인으로 리다이렉트
        const firstProject = projects[0];
        if (firstProject) {
          navigate(`/main?project=${firstProject.uuid}`, { replace: true });
        } else {
          navigate('/main', { replace: true });
        }
      }
      return;
    }

    // 일반 페이지에서의 동기화
    if (projects.length === 0) return;

    // 관리자 모드일 때는 URL 동기화 하지 않음
    if (isAdminMode) {
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
    } else if (currentProject && currentProject.uuid !== ADMIN_MODE_PROJECT.uuid) {
      // URL에 project가 없고 일반 프로젝트면 URL 업데이트
      const newParams = new URLSearchParams(searchParams);
      newParams.set('project', currentProject.uuid);
      setSearchParams(newParams, { replace: true });
    }
  }, [projectFromUrl, projects, currentProject?.uuid, isLoading, isAdminMode, isAdminPath, canAccessAdminMode]);

  // 프로젝트 변경 함수 (스토어 + URL + 네비게이션 통합 처리)
  const switchProject = useCallback((uuid: string, targetPath?: string) => {
    // 동기화 일시 중지 (1초 동안)
    syncPausedUntil = Date.now() + 1000;

    // 관리자 전용 모드 전환
    if (uuid === ADMIN_MODE_PROJECT.uuid) {
      setCurrentProject(uuid);
      navigate(targetPath || '/admin/popup-notice', { replace: false });
      return;
    }

    // 일반 프로젝트 전환
    const hasAccess = projects.some(p => p.uuid === uuid);

    if (hasAccess) {
      setCurrentProject(uuid);
      navigate(targetPath || `/main?project=${uuid}`, { replace: false });
    } else {
      // 권한이 없으면 /main으로 리다이렉트
      const firstProject = projects[0];
      if (firstProject) {
        setCurrentProject(firstProject.uuid);
        navigate(`/main?project=${firstProject.uuid}`, { replace: true });
      } else {
        navigate('/main', { replace: true });
      }
    }
  }, [projects, setCurrentProject, navigate]);

  return {
    currentProjectUuid: currentProject?.uuid ?? '',
    switchProject,
  };
}
