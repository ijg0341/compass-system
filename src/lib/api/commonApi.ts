/**
 * 공통 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * 모든 인증된 사용자가 접근 가능한 공통 API
 * Base URL: /adm/project/{projectUuid}/common
 */
import { api } from './client';
import type { ApiResponse, ApiSimpleListData, ApiListData } from '@/src/types/api';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getCommonBasePath = (projectUuid: string) => `/adm/project/${projectUuid}/common`;
const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;

// =============================================================================
// 타입 정의
// =============================================================================

/** 동 정보 */
export interface CommonDong {
  dong: string;
}

/** 동호 정보 */
export interface CommonDongho {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;
  contractor_name?: string;
  contractor_phone?: string;
}

/** 프로젝트 타입 (평형) */
export interface ProjectType {
  id: number;
  name: string;
  floorplan_file_id?: number;
  give_items?: Array<{ name: string; quantity: number }>;
}

// =============================================================================
// Common API
// =============================================================================

/**
 * 동 목록 조회
 */
export async function getCommonDongs(projectUuid: string): Promise<string[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<CommonDong>>>(
    `${getCommonBasePath(projectUuid)}/dongs`
  );
  return response.data.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회
 * @param projectUuid 프로젝트 UUID
 * @param dong 동 (선택, 특정 동의 동호만 조회)
 */
export async function getCommonDonghos(
  projectUuid: string,
  dong?: string
): Promise<CommonDongho[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<CommonDongho>>>(
    `${getCommonBasePath(projectUuid)}/donghos`,
    { params: dong ? { dong } : undefined }
  );
  return response.data.data.list;
}

// =============================================================================
// Project Type API (타입/평형)
// =============================================================================

/**
 * 프로젝트 타입 목록 조회 (id, name만)
 * GET /adm/project/{projectUuid}/common/types
 */
export async function getProjectTypes(projectUuid: string): Promise<ProjectType[]> {
  const response = await api.get<ApiResponse<ProjectType[]>>(
    `${getCommonBasePath(projectUuid)}/types`
  );
  return response.data.data;
}
