/**
 * A/S 관리 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로:
 * - A/S 목록/상세/수정: /adm/project/{projectUuid}/afterservices
 * - A/S 옵션: /adm/project/{projectUuid}/afterservices/options
 * - 하자코드: /adm/project/{projectUuid}/afterservice-codes
 * - 협력사: /adm/project/{projectUuid}/users?type=2
 * - 동 목록: /adm/project/{projectUuid}/donghos/dongs
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiSimpleListData } from '@/src/types/api';
import type {
  AfterserviceListItem,
  AfterserviceListParams,
  AfterserviceDetail,
  AfterserviceUpdateRequest,
  AfterserviceOptions,
  Ascode,
  Partner,
} from '@/src/types/afterservice.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;

// =============================================================================
// 1. A/S 관리 API
// =============================================================================

/**
 * A/S 목록 조회
 */
export async function getAfterservices(
  projectUuid: string,
  params?: AfterserviceListParams
): Promise<ApiListData<AfterserviceListItem>> {
  const response = await api.get<ApiResponse<ApiListData<AfterserviceListItem>>>(
    `${getAdminBasePath(projectUuid)}/afterservices`,
    { params }
  );
  return response.data.data;
}

/**
 * A/S 상세 조회
 */
export async function getAfterservice(
  projectUuid: string,
  id: number
): Promise<AfterserviceDetail> {
  const response = await api.get<ApiResponse<AfterserviceDetail>>(
    `${getAdminBasePath(projectUuid)}/afterservices/${id}`
  );
  return response.data.data;
}

/**
 * A/S 수정
 */
export async function updateAfterservice(
  projectUuid: string,
  id: number,
  data: AfterserviceUpdateRequest
): Promise<{ id: number }> {
  const response = await api.put<ApiResponse<{ id: number }>>(
    `${getAdminBasePath(projectUuid)}/afterservices/${id}`,
    data
  );
  return response.data.data;
}

/**
 * A/S 옵션 조회 (상태, 형태)
 */
export async function getAfterserviceOptions(
  projectUuid: string
): Promise<AfterserviceOptions> {
  const response = await api.get<ApiResponse<AfterserviceOptions>>(
    `${getAdminBasePath(projectUuid)}/afterservices/options`
  );
  return response.data.data;
}

// =============================================================================
// 2. 하자코드 API
// =============================================================================

/** 하자코드 등록/수정 요청 타입 */
export interface AscodeRequest {
  type?: string;
  room: string;
  issue_category1: string;
  issue_category2: string;
  issue_type: string;
  work_type1: string;
  work_type2: string;
  project_users_id?: number;
}

/**
 * 하자코드 트리 노드 타입
 */
export interface AscodeTreeNode {
  name: string;
  column: string;
  children: (AscodeTreeNode | number)[];
}

/**
 * 하자코드 항목 타입
 */
export interface AscodeItem {
  id: number;
  issue_type: string;
  work_type1: string;
  work_type2: string;
  project_users_id: number | null;
  project_users_company: string | null;
}

/**
 * 하자코드 옵션 응답 타입
 * - ascodes: 하자코드 목록 (id로 issue_type, work_type1, work_type2 조회)
 * - issueTree: 하자분류 트리 (type → room → issue_category1 → issue_category2 → [id])
 * - workTree: 공종분류 트리 (work_type1 → work_type2 → [id])
 */
export interface AscodeOptions {
  ascodes: AscodeItem[];
  issueTree: AscodeTreeNode[];
  workTree: AscodeTreeNode[];
}

/**
 * 하자코드 옵션 조회 (다단구조 JSON)
 */
export async function getAscodeOptions(
  projectUuid: string
): Promise<AscodeOptions> {
  const response = await api.get<ApiResponse<AscodeOptions>>(
    `${getAdminBasePath(projectUuid)}/afterservice-codes/options`
  );
  return response.data.data;
}

/**
 * 하자코드 목록 조회
 */
export async function getAscodes(
  projectUuid: string
): Promise<{ total: number; list: Ascode[] }> {
  const response = await api.get<ApiResponse<{ total: number; list: Ascode[] }>>(
    `${getAdminBasePath(projectUuid)}/afterservice-codes`
  );
  return response.data.data;
}

/**
 * 하자코드 등록
 */
export async function createAscode(
  projectUuid: string,
  data: AscodeRequest
): Promise<{ id: number }> {
  const response = await api.post<ApiResponse<{ id: number }>>(
    `${getAdminBasePath(projectUuid)}/afterservice-codes`,
    data
  );
  return response.data.data;
}

/**
 * 하자코드 수정
 */
export async function updateAscode(
  projectUuid: string,
  id: number,
  data: AscodeRequest
): Promise<{ id: number }> {
  const response = await api.put<ApiResponse<{ id: number }>>(
    `${getAdminBasePath(projectUuid)}/afterservice-codes/${id}`,
    data
  );
  return response.data.data;
}

/**
 * 하자코드 엑셀 다운로드
 */
export async function downloadAscodesExcel(projectUuid: string): Promise<void> {
  const response = await api.get(
    `${getAdminBasePath(projectUuid)}/afterservice-codes/excel`,
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `ascodes_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

// =============================================================================
// 3. 협력사 API
// =============================================================================

/**
 * 협력사 목록 조회 (type=2)
 */
export async function getPartners(
  projectUuid: string
): Promise<ApiListData<Partner>> {
  const response = await api.get<ApiResponse<ApiListData<Partner>>>(
    `${getAdminBasePath(projectUuid)}/users`,
    { params: { type: 2 } }
  );
  return response.data.data;
}

// =============================================================================
// 4. 동 목록 API
// =============================================================================

/**
 * 동 목록 조회
 */
export async function getAfterserviceDongs(
  projectUuid: string
): Promise<string[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<{ dong: string }>>>(
    `${getAdminBasePath(projectUuid)}/donghos/dongs`
  );
  return response.data.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회
 */
export async function getAfterserviceDonghos(
  projectUuid: string,
  dong?: string
): Promise<{ id: number; dong: string; ho: string }[]> {
  const response = await api.get<
    ApiResponse<ApiSimpleListData<{ id: number; dong: string; ho: string }>>
  >(`${getAdminBasePath(projectUuid)}/common/donghos`, {
    params: dong ? { dong } : undefined,
  });
  return response.data.data.list;
}

// =============================================================================
// 5. 엑셀 다운로드 API
// =============================================================================

/**
 * A/S 엑셀 다운로드
 */
export async function downloadAfterservicesExcel(
  projectUuid: string,
  params?: AfterserviceListParams
): Promise<void> {
  const response = await api.get(
    `${getAdminBasePath(projectUuid)}/afterservices/excel`,
    {
      params,
      responseType: 'blob',
    }
  );

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `afterservices_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
