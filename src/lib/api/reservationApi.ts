/**
 * 방문예약 API 서비스
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiSimpleListData, ApiDateResponse, ApiCreateResponse } from '@/src/types/api';

// =============================================================================
// API 응답 타입 정의
// =============================================================================

// 예약 가능 시간 슬롯
export interface AvailableTimeSlot {
  time: string;
  available: number;
}

// 예약 가능 날짜
export interface AvailableDate {
  date: string;
  times: AvailableTimeSlot[];
}

// 예약 가능 일정 응답
export interface AvailableSlotsResponse {
  visit_info_id: number;
  date_begin: ApiDateResponse;
  date_end: ApiDateResponse;
  time_first: string;
  time_last: string;
  time_unit: number;
  max_limit: number;
  dates: AvailableDate[];
  image_file_id?: number | null;
  image_url?: string | null;
}

// 동 정보
export interface DongInfo {
  id: string;
  name: string;
  number: string;
}

// 호 정보
export interface DongHoInfo {
  id: string;
  dong_id: string;
  name: string;
  number: string;
  unit_type: string | null;
  line: string | null;
  dong_name: string;
  dong_number: string;
}

// 방문일정 정보
export interface VisitScheduleInfo {
  id: number;
  visit_info_id: number;
  dong_ho_id: number;
  visit_date: ApiDateResponse;
  visit_time: string;
  contractor_name: string | null;
  contractor_phone: string | null;
  resident_name: string | null;
  resident_phone: string | null;
  move_in_scheduled_date: string | null;
}

// 방문일정 등록 요청
export interface CreateVisitScheduleRequest {
  visit_info_id: number;
  visit_date: string;
  visit_time: string;
  dong_ho_id: number;
  resident_name?: string;
  resident_phone?: string;
}

// 방문일정 수정 요청
export interface UpdateVisitScheduleRequest {
  move_in_scheduled_date?: string;
  contractor_phone?: string;
  resident_name?: string;
  resident_phone?: string;
}

// 방문일정 목록 조회 파라미터
export interface VisitScheduleListParams {
  searchKeyword?: string;
  building?: string;
  unit?: string;
  offset?: number;
  limit?: number;
}

// =============================================================================
// API 함수
// =============================================================================

/**
 * 예약 가능 일정 조회
 */
export async function getAvailableSlots(projectId: number = 1): Promise<AvailableSlotsResponse> {
  const response = await api.get<ApiResponse<AvailableSlotsResponse>>(
    '/reservations/available-slots',
    { params: { project_id: projectId } }
  );
  return response.data.data;
}

/**
 * 동 목록 조회
 */
export async function getDongs(visitInfoId: number): Promise<DongInfo[]> {
  const response = await api.get<ApiResponse<ApiSimpleListData<DongInfo>>>(
    '/reservations/dongs',
    { params: { visit_info_id: visitInfoId } }
  );
  return response.data.data.list;
}

/**
 * 호 목록 조회
 */
export async function getDongHos(visitInfoId: number, dongId?: string): Promise<DongHoInfo[]> {
  const params: Record<string, unknown> = { visit_info_id: visitInfoId };
  if (dongId) {
    params.dong_id = dongId;
  }
  const response = await api.get<ApiResponse<ApiSimpleListData<DongHoInfo>>>(
    '/reservations/dong-hos',
    { params }
  );
  return response.data.data.list;
}

/**
 * 방문일정 목록 조회
 */
export async function getVisitSchedules(
  params?: VisitScheduleListParams
): Promise<ApiListData<VisitScheduleInfo>> {
  const response = await api.get<ApiResponse<ApiListData<VisitScheduleInfo>>>(
    '/reservations/visit-schedules',
    { params }
  );
  return response.data.data;
}

/**
 * 방문일정 상세 조회
 */
export async function getVisitSchedule(id: number): Promise<VisitScheduleInfo> {
  const response = await api.get<ApiResponse<VisitScheduleInfo>>(
    `/reservations/visit-schedules/${id}`
  );
  return response.data.data;
}

/**
 * 방문일정 등록
 */
export async function createVisitSchedule(
  data: CreateVisitScheduleRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    '/reservations/visit-schedules',
    data
  );
  return response.data.data;
}

/**
 * 방문일정 수정
 */
export async function updateVisitSchedule(
  id: number,
  data: UpdateVisitScheduleRequest
): Promise<void> {
  await api.put(`/reservations/visit-schedules/${id}`, data);
}

/**
 * 방문일정 삭제
 */
export async function deleteVisitSchedule(id: number): Promise<void> {
  await api.delete(`/reservations/visit-schedules/${id}`);
}

// =============================================================================
// Visit Info API (방문정보 설정)
// =============================================================================

// 방문정보 수정 요청
export interface UpdateVisitInfoRequest {
  date_begin?: string;
  date_end?: string;
  max_limit?: number;
  time_first?: string;
  time_last?: string;
  time_unit?: number;
  image_file_id?: number;
}

/**
 * 방문정보 수정
 */
export async function updateVisitInfo(
  id: number,
  data: UpdateVisitInfoRequest
): Promise<void> {
  await api.put(`/visit-info/${id}`, data);
}

// =============================================================================
// File Upload API (파일 업로드)
// =============================================================================

// 파일 업로드 응답
export interface FileUploadResponse {
  id: number;
  uuid: string;
  url: string;
  file: {
    id: number;
    uuid: string;
    original_name: string;
    stored_name: string;
    mime_type: string;
    file_size: number;
  };
}

/**
 * 파일 업로드
 */
export async function uploadFile(
  file: File,
  options?: {
    entityType?: string;
    entityId?: number;
    fileCategory?: string;
    isPublic?: boolean;
  }
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  if (options?.entityType) formData.append('entity_type', options.entityType);
  if (options?.entityId) formData.append('entity_id', String(options.entityId));
  if (options?.fileCategory) formData.append('file_category', options.fileCategory);
  if (options?.isPublic) formData.append('is_public', 'true');

  const response = await api.post<ApiResponse<FileUploadResponse>>(
    '/adm/files/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}

// 파일 정보 응답
export interface FileInfoResponse {
  id: number;
  uuid: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  file_size: number;
  url: string;
}

/**
 * 파일 정보 조회
 */
export async function getFileInfo(uuid: string): Promise<FileInfoResponse> {
  const response = await api.get<ApiResponse<FileInfoResponse>>(
    `/adm/files/${uuid}`
  );
  return response.data.data;
}
