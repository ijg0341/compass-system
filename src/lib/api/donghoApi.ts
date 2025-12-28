/**
 * 동호 관리 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로 형식:
 * - 조회용: /adm/project/{projectUuid}/donghos
 * - 관리용: /adm/project/{projectUuid}/donghos-codes
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiPageListData, ApiCreateResponse } from '@/src/types/api';
import type {
  Dongho,
  DonghoRequest,
  DonghoListParams,
  HouseholdStatus,
  HouseholdStatusParams,
  FloorPlanData,
  HouseholdDetail,
  HouseholdUpdateRequest,
  VisitHistory,
} from '@/src/types/dongho.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;

// =============================================================================
// 동호 조회 API (donghos)
// Base URL: /adm/project/{projectUuid}/donghos
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export async function getDonghos(
  projectUuid: string,
  params?: DonghoListParams
): Promise<ApiListData<Dongho>> {
  const response = await api.get<ApiResponse<ApiListData<Dongho>>>(
    `${getAdminBasePath(projectUuid)}/donghos`,
    { params }
  );
  return response.data.data;
}

/**
 * 동호 코드 상세 조회
 */
export async function getDongho(projectUuid: string, id: number): Promise<Dongho> {
  const response = await api.get<ApiResponse<Dongho>>(
    `${getAdminBasePath(projectUuid)}/donghos/${id}`
  );
  return response.data.data;
}

// =============================================================================
// 동호 관리 API (donghos-codes)
// Base URL: /adm/project/{projectUuid}/donghos-codes
// =============================================================================

/**
 * 동호 코드 등록
 */
export async function createDongho(
  projectUuid: string,
  data: DonghoRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectUuid)}/donghos-codes`,
    data
  );
  return response.data.data;
}

/**
 * 동호 코드 수정
 */
export async function updateDongho(
  projectUuid: string,
  id: number,
  data: Partial<DonghoRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/donghos-codes/${id}`, data);
}

/**
 * 동호 코드 삭제
 */
export async function deleteDongho(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectUuid)}/donghos-codes/${id}`);
}

// =============================================================================
// 엑셀 다운로드/업로드 API (donghos-codes)
// =============================================================================

/**
 * 동호 엑셀 다운로드 (템플릿 겸용)
 * 데이터가 없어도 헤더만 있는 템플릿으로 사용 가능
 */
export async function downloadDonghosExcel(projectUuid: string): Promise<void> {
  const response = await api.get(`${getAdminBasePath(projectUuid)}/donghos-codes/excel`, {
    responseType: 'blob',
  });

  // 파일 다운로드 처리
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Content-Disposition 헤더에서 파일명 추출 또는 기본값 사용
  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `donghos_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/** 동호 엑셀 업로드 응답 */
export interface DonghoUploadResponse {
  insert_count: number;
  update_count: number;
  skip_count: number;
  errors: string[];
}

/**
 * 동호 엑셀 업로드
 * @param projectUuid 프로젝트 UUID
 * @param file 엑셀 파일 (xlsx, xls)
 */
export async function uploadDonghosExcel(
  projectUuid: string,
  file: File
): Promise<DonghoUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ApiResponse<DonghoUploadResponse>>(
    `${getAdminBasePath(projectUuid)}/donghos-codes/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}

// =============================================================================
// 세대현황 API (CP-SA-04-001, CP-SA-04-002)
// Base URL: /adm/project/{projectUuid}/donghos
// =============================================================================

/**
 * 세대현황 목록 조회
 * 필터: dong, ho, contractor_name, date_begin, date_end, tab(key/meter/give)
 */
export async function getHouseholdStatus(
  projectUuid: string,
  params?: HouseholdStatusParams
): Promise<ApiPageListData<HouseholdStatus>> {
  const response = await api.get<ApiResponse<ApiPageListData<HouseholdStatus>>>(
    `${getAdminBasePath(projectUuid)}/donghos/household-status`,
    { params }
  );
  return response.data.data;
}

/**
 * 세대현황 엑셀 다운로드
 */
export async function downloadHouseholdStatusExcel(
  projectUuid: string,
  params?: HouseholdStatusParams
): Promise<void> {
  const response = await api.get(
    `${getAdminBasePath(projectUuid)}/donghos/household-status/excel`,
    {
      params,
      responseType: 'blob',
    }
  );

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `household_status_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 현황입면도 조회
 * 동별 -> 라인별(호 끝 2자리) 그룹핑
 */
export async function getFloorPlan(projectUuid: string): Promise<FloorPlanData> {
  const response = await api.get<ApiResponse<FloorPlanData>>(
    `${getAdminBasePath(projectUuid)}/donghos/floor-plan`
  );
  return response.data.data;
}

// =============================================================================
// 세대정보 상세 API (CP-SA-99-001)
// Base URL: /adm/project/{projectUuid}/donghos/household
// =============================================================================

/**
 * 세대정보 상세 조회
 * 검침/지급/키불출/부동산 정보 포함
 */
export async function getHouseholdDetail(
  projectUuid: string,
  id: number
): Promise<HouseholdDetail> {
  const response = await api.get<ApiResponse<HouseholdDetail>>(
    `${getAdminBasePath(projectUuid)}/donghos/household/${id}`
  );
  return response.data.data;
}

/**
 * 세대정보 수정
 * 입주자정보, 검침, 지급품, 키불출, 부동산 정보 수정 가능
 */
export async function updateHousehold(
  projectUuid: string,
  id: number,
  data: HouseholdUpdateRequest
): Promise<void> {
  await api.put(`${getAdminBasePath(projectUuid)}/donghos/household/${id}`, data);
}

// =============================================================================
// 입주 방문이력 API (CP-SA-99-002)
// =============================================================================

/**
 * 특정 세대의 입주 방문이력 조회
 */
export async function getVisitHistory(
  projectUuid: string,
  donghoId: number
): Promise<VisitHistory[]> {
  const response = await api.get<ApiResponse<{ list: VisitHistory[] }>>(
    `${getAdminBasePath(projectUuid)}/visit`,
    { params: { dongho_id: donghoId } }
  );
  return response.data.data.list;
}
