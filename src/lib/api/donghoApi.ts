/**
 * 동호 관리 API 서비스
 * API 문서 기준: 2025-12-05
 *
 * API 경로 형식:
 * - 관리자용: /adm/project/{projectId}/donghos
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type { Dongho, DonghoRequest, DonghoListParams } from '@/src/types/dongho.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectId: number) => `/adm/project/${projectId}`;

// =============================================================================
// 동호 코드 API (CP-SA-07-001)
// Base URL: /adm/project/{projectId}/donghos
// =============================================================================

/**
 * 동호 코드 목록 조회
 */
export async function getDonghos(
  projectId: number,
  params?: DonghoListParams
): Promise<ApiListData<Dongho>> {
  const response = await api.get<ApiResponse<ApiListData<Dongho>>>(
    `${getAdminBasePath(projectId)}/donghos`,
    { params }
  );
  return response.data.data;
}

/**
 * 동호 코드 상세 조회
 */
export async function getDongho(projectId: number, id: number): Promise<Dongho> {
  const response = await api.get<ApiResponse<Dongho>>(
    `${getAdminBasePath(projectId)}/donghos/${id}`
  );
  return response.data.data;
}

/**
 * 동호 코드 등록
 */
export async function createDongho(
  projectId: number,
  data: DonghoRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectId)}/donghos`,
    data
  );
  return response.data.data;
}

/**
 * 동호 코드 수정
 */
export async function updateDongho(
  projectId: number,
  id: number,
  data: Partial<DonghoRequest>
): Promise<void> {
  await api.put(`${getAdminBasePath(projectId)}/donghos/${id}`, data);
}

/**
 * 동호 코드 삭제
 */
export async function deleteDongho(projectId: number, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectId)}/donghos/${id}`);
}

// =============================================================================
// 엑셀 다운로드/업로드 API (2025-12-05 추가)
// =============================================================================

/**
 * 동호 엑셀 다운로드 (템플릿 겸용)
 * 데이터가 없어도 헤더만 있는 템플릿으로 사용 가능
 */
export async function downloadDonghosExcel(projectId: number): Promise<void> {
  const response = await api.get(`${getAdminBasePath(projectId)}/donghos/excel`, {
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
 * @param projectId 프로젝트 ID
 * @param file 엑셀 파일 (xlsx, xls)
 */
export async function uploadDonghosExcel(
  projectId: number,
  file: File
): Promise<DonghoUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ApiResponse<DonghoUploadResponse>>(
    `${getAdminBasePath(projectId)}/donghos/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}
