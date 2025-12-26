/**
 * 동호 관리 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로 형식:
 * - 조회용: /adm/project/{projectUuid}/donghos
 * - 관리용: /adm/project/{projectUuid}/donghos-codes
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type { Dongho, DonghoRequest, DonghoListParams } from '@/src/types/dongho.types';

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
