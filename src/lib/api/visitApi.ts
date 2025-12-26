/**
 * 입주방문등록 API 서비스
 * API 문서 기준: 2025-12-26
 * 화면 ID: CP-SA-03-001
 *
 * API 경로: /adm/project/{projectUuid}/visit
 */
import { api } from './client';
import type { ApiResponse, ApiListData } from '@/src/types/api';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getVisitBasePath = (projectUuid: string) => `/adm/project/${projectUuid}/visit`;

// =============================================================================
// 타입 정의
// =============================================================================

/** 입주방문 아이템 (API 응답) */
export interface Visit {
  id: number;
  dongho_id: number;
  dong: string;
  ho: string;
  visitor_name: string;
  visitor_phone: string;
  visit_type: string;
  visit_purpose: string[];
  work_begin: string | null;
  work_end: string | null;
  visit_datetime: string | null;
  memo: string | null;
  // 메타데이터
  created_at: string;
  created_by: number | null;
  creator_name: string | null;
  creator_phone: string | null;
}

/** 입주방문 목록 조회 파라미터 */
export interface VisitListParams {
  page?: number;
  limit?: number;
  dong?: string;
  ho?: string;
  visit_type?: string;
  visit_purpose?: string;
  visit_date?: string;
  work_date?: string;
  searchKeyword?: string;
}

/** 입주방문 등록 요청 */
export interface CreateVisitRequest {
  dongho_id: number;
  visitor_name: string;
  visitor_phone: string;
  visit_type: string;
  visit_purpose: string[];
  visit_datetime?: string;
  work_begin?: string;
  work_end?: string;
  memo?: string;
}

/** 동/호 선택 시 표시할 세대 정보 */
export interface DonghoInfo {
  id: number;
  dong: string;
  ho: string;
  contractor_name: string | null;
  resident_name: string | null;
  agent_company: string | null;
}

// =============================================================================
// 방문구분 상수
// =============================================================================

export const VISIT_TYPES = ['세대방문', '부동산', '외부업체'] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

// =============================================================================
// 방문목적 상수
// =============================================================================

export const VISIT_PURPOSES = [
  '키대여',
  '동행',
  '인수인계',
  '검침',
  '지급',
  '입주증',
  '키불출',
  '입주',
] as const;
export type VisitPurpose = (typeof VISIT_PURPOSES)[number];

// =============================================================================
// Visit API
// =============================================================================

/**
 * 입주방문 목록 조회
 */
export async function getVisits(
  projectUuid: string,
  params?: VisitListParams
): Promise<ApiListData<Visit>> {
  const response = await api.get<ApiResponse<ApiListData<Visit>>>(
    getVisitBasePath(projectUuid),
    { params }
  );
  return response.data.data;
}

/**
 * 입주방문 등록
 */
export async function createVisit(
  projectUuid: string,
  data: CreateVisitRequest
): Promise<{ id: number }> {
  const response = await api.post<ApiResponse<{ id: number }>>(
    getVisitBasePath(projectUuid),
    data
  );
  return response.data.data;
}

/**
 * 입주방문 엑셀 다운로드
 */
export async function downloadVisitExcel(
  projectUuid: string,
  params?: VisitListParams
): Promise<void> {
  const response = await api.get(`${getVisitBasePath(projectUuid)}/excel`, {
    params,
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `visit_${new Date().toISOString().slice(0, 10)}.xlsx`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/** 입주방문 엑셀 업로드 응답 */
export interface VisitUploadResponse {
  insert_count: number;
  skip_count: number;
  errors: string[];
}

/**
 * 입주방문 엑셀 업로드
 */
export async function uploadVisitExcel(
  projectUuid: string,
  file: File
): Promise<VisitUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ApiResponse<VisitUploadResponse>>(
    `${getVisitBasePath(projectUuid)}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}
