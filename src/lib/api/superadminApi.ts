/**
 * 관리자 전용 API (SuperAdmin)
 * A1(C총괄), A2(C관리자)만 접근 가능
 */
import { api } from './client';
import type { ApiResponse, ApiListData } from '@/src/types/api';

// ============== 타입 정의 ==============

// 팝업공지
export interface PopupNotice {
  id: number;
  project_id: number;
  project_name?: string | null;
  admin_users_id: number;
  admin_user_name?: string;
  board_category_id: number;
  board_subject: string;
  board_text: string;
  board_count_view: number;
  board_files: S3File[];
  board_date: string;
  board_hidden: number;
  board_extra: {
    notice_begin?: string;
    notice_end?: string;
  };
}

export interface PopupNoticeListItem {
  id: number;
  project_id: number;
  project_name?: string | null;
  board_category_id: number;
  board_subject: string;
  board_count_view: number;
  board_hidden: number;
  board_date: string;
  notice_begin: string | null;
  notice_end: string | null;
}

export interface PopupNoticeCreateRequest {
  project_id: number;  // 필수 (NOT NULL)
  board_category_id: number;
  board_subject: string;
  board_text: string;
  board_files?: number[];
  board_hidden?: number;
  notice_begin?: string;
  notice_end?: string;
}

// 건설사
export interface Company {
  id: number;
  name: string;
}

export interface CompanyCreateRequest {
  name: string;
}

// 현장 (프로젝트)
export interface Project {
  id: number;
  uuid: string;
  construction_company_id: number;
  company_name: string;
  name: string;
  bs_date_begin: string | null;
  bs_date_end: string | null;
  qa_date_begin: string | null;
  qa_date_end: string | null;
  pre_date_begin: string | null;
  pre_date_end: string | null;
  mngt_date_begin: string | null;
  mngt_date_end: string | null;
  occupancy_date_begin: string | null;
  occupancy_date_end: string | null;
  cs_date_begin: string | null;
  cs_date_end: string | null;
}

// API 날짜 응답 형식 (객체 또는 문자열)
export type ApiDateField = string | { date: string; timezone_type: number; timezone: string } | null;

export interface ProjectListItem {
  id: number;
  uuid: string;
  construction_company_id: number;
  name: string;
  project_code?: string;
  bs_date_begin: ApiDateField;
  bs_date_end: ApiDateField;
  qa_date_begin: ApiDateField;
  qa_date_end: ApiDateField;
  pre_date_begin: ApiDateField;
  pre_date_end: ApiDateField;
  mngt_date_begin: ApiDateField;
  mngt_date_end: ApiDateField;
  occupancy_date_begin: ApiDateField;
  occupancy_date_end: ApiDateField;
  cs_date_begin: ApiDateField;
  cs_date_end: ApiDateField;
}

// 날짜 필드를 문자열로 변환하는 헬퍼 함수
export function formatApiDate(date: ApiDateField): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date.split(' ')[0];
  if (typeof date === 'object' && date.date) return date.date.split(' ')[0];
  return null;
}

export interface ProjectCreateRequest {
  construction_company_id: number;
  name: string;
  bs_date_begin?: string | null;
  bs_date_end?: string | null;
  qa_date_begin?: string | null;
  qa_date_end?: string | null;
  pre_date_begin?: string | null;
  pre_date_end?: string | null;
  mngt_date_begin?: string | null;
  mngt_date_end?: string | null;
  occupancy_date_begin?: string | null;
  occupancy_date_end?: string | null;
  cs_date_begin?: string | null;
  cs_date_end?: string | null;
}

// 프로젝트 타입
export interface ProjectType {
  id: number;
  project_id: number;
  name: string;
  floorplan_file_id: number | null;
  floorplan_file?: S3File | null;
  give_items: string[];
}

export interface ProjectTypeCreateRequest {
  name: string;
  floorplan_file_id?: number | null;
  give_items?: string[];
}

// 관리자 계정 (A1만 관리 가능)
export interface AdminUser {
  id: number;
  user_id: string;
  name: string;
  phone: string | null;
  role: string;
  company_id: number | null;
  company_name: string | null;
  is_active: boolean;
  last_login_at: ApiDateField;
  created_at: ApiDateField;
}

export interface AdminUserCreateRequest {
  user_id: string;
  password: string;
  name: string;
  phone?: string;
  role: 'A1' | 'A2' | 'A3';
  company_id?: number | null;
  is_active?: boolean;
  memo?: string;
}

export interface AdminUserUpdateRequest {
  password?: string;
  name?: string;
  phone?: string;
  role?: 'A1' | 'A2' | 'A3';
  company_id?: number | null;
  is_active?: boolean;
  memo?: string;
}

// S3 파일
export interface S3File {
  id: number;
  uuid: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  file_size: number;
  url: string;
}

// ============== API 함수 ==============

// 파일 업로드 API
export const fileApi = {
  // 파일 업로드
  upload: async (file: File, options?: {
    project_id?: number;
    file_category?: string;
  }): Promise<ApiResponse<{ id: number; uuid: string; url: string; file: S3File }>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.project_id) {
      formData.append('project_id', String(options.project_id));
    }
    if (options?.file_category) {
      formData.append('file_category', options.file_category);
    }

    const response = await api.post<ApiResponse<{ id: number; uuid: string; url: string; file: S3File }>>(
      '/adm/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // 파일 삭제
  delete: async (uuid: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/adm/files/${uuid}`);
    return response.data;
  },
};

// 팝업공지 API
export const popupApi = {
  // 목록 조회
  getList: async (params?: {
    project_id?: number;
    searchKeyword?: string;
    offset?: number;
    limit?: number;
  }): Promise<ApiResponse<ApiListData<PopupNoticeListItem>>> => {
    const response = await api.get<ApiResponse<ApiListData<PopupNoticeListItem>>>(
      '/adm/superadmin/popups',
      { params }
    );
    return response.data;
  },

  // 상세 조회
  getDetail: async (id: number): Promise<ApiResponse<PopupNotice>> => {
    const response = await api.get<ApiResponse<PopupNotice>>(`/adm/superadmin/popups/${id}`);
    return response.data;
  },

  // 등록
  create: async (data: PopupNoticeCreateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.post<ApiResponse<{ id: number }>>('/adm/superadmin/popups', data);
    return response.data;
  },

  // 수정
  update: async (id: number, data: Partial<PopupNoticeCreateRequest>): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.put<ApiResponse<{ id: number }>>(`/adm/superadmin/popups/${id}`, data);
    return response.data;
  },

  // 삭제
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/adm/superadmin/popups/${id}`);
    return response.data;
  },
};

// 건설사 API
export const companyApi = {
  // 목록 조회
  getList: async (params?: {
    searchKeyword?: string;
  }): Promise<ApiResponse<{ total: number; list: Company[] }>> => {
    const response = await api.get<ApiResponse<{ total: number; list: Company[] }>>(
      '/adm/superadmin/companys',
      { params }
    );
    return response.data;
  },

  // 상세 조회
  getDetail: async (id: number): Promise<ApiResponse<Company>> => {
    const response = await api.get<ApiResponse<Company>>(`/adm/superadmin/companys/${id}`);
    return response.data;
  },

  // 등록
  create: async (data: CompanyCreateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.post<ApiResponse<{ id: number }>>('/adm/superadmin/companys', data);
    return response.data;
  },

  // 수정
  update: async (id: number, data: Partial<CompanyCreateRequest>): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.put<ApiResponse<{ id: number }>>(`/adm/superadmin/companys/${id}`, data);
    return response.data;
  },
};

// 현장 API
export const projectApi = {
  // 목록 조회
  getList: async (params?: {
    searchKeyword?: string;
    company_id?: number;
  }): Promise<ApiResponse<{ total: number; list: ProjectListItem[] }>> => {
    const response = await api.get<ApiResponse<{ total: number; list: ProjectListItem[] }>>(
      '/adm/superadmin/projects',
      { params }
    );
    return response.data;
  },

  // 상세 조회
  getDetail: async (id: number): Promise<ApiResponse<Project>> => {
    const response = await api.get<ApiResponse<Project>>(`/adm/superadmin/projects/${id}`);
    return response.data;
  },

  // 등록
  create: async (data: ProjectCreateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.post<ApiResponse<{ id: number }>>('/adm/superadmin/projects', data);
    return response.data;
  },

  // 수정
  update: async (id: number, data: Partial<ProjectCreateRequest>): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.put<ApiResponse<{ id: number }>>(`/adm/superadmin/projects/${id}`, data);
    return response.data;
  },
};

// 현장 타입 API
export const projectTypeApi = {
  // 목록 조회
  getList: async (projectUuid: string): Promise<ApiResponse<ApiListData<ProjectType>>> => {
    const response = await api.get<ApiResponse<ApiListData<ProjectType>>>(
      `/adm/superadmin/project/${projectUuid}/types`
    );
    return response.data;
  },

  // 상세 조회
  getDetail: async (projectUuid: string, id: number): Promise<ApiResponse<ProjectType>> => {
    const response = await api.get<ApiResponse<ProjectType>>(
      `/adm/superadmin/project/${projectUuid}/types/${id}`
    );
    return response.data;
  },

  // 등록
  create: async (projectUuid: string, data: ProjectTypeCreateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      `/adm/superadmin/project/${projectUuid}/types`,
      data
    );
    return response.data;
  },

  // 수정
  update: async (
    projectUuid: string,
    id: number,
    data: Partial<ProjectTypeCreateRequest>
  ): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.put<ApiResponse<{ id: number }>>(
      `/adm/superadmin/project/${projectUuid}/types/${id}`,
      data
    );
    return response.data;
  },

  // 삭제
  delete: async (projectUuid: string, id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
      `/adm/superadmin/project/${projectUuid}/types/${id}`
    );
    return response.data;
  },
};

// 관리자 계정 API (A1만 접근 가능)
export const adminUserApi = {
  // 목록 조회
  getList: async (params?: {
    searchKeyword?: string;
  }): Promise<ApiResponse<{ total: number; list: AdminUser[] }>> => {
    const response = await api.get<ApiResponse<{ total: number; list: AdminUser[] }>>(
      '/adm/superadmin/admin-users',
      { params }
    );
    return response.data;
  },

  // 상세 조회
  getDetail: async (id: number): Promise<ApiResponse<AdminUser>> => {
    const response = await api.get<ApiResponse<AdminUser>>(`/adm/superadmin/admin-users/${id}`);
    return response.data;
  },

  // 아이디 중복 확인
  checkDuplicate: async (userId: string): Promise<ApiResponse<{ is_duplicate: boolean }>> => {
    const response = await api.get<ApiResponse<{ is_duplicate: boolean }>>(
      '/adm/superadmin/admin-users/check-duplicate',
      { params: { user_id: userId } }
    );
    return response.data;
  },

  // 등록
  create: async (data: AdminUserCreateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.post<ApiResponse<{ id: number }>>('/adm/superadmin/admin-users', data);
    return response.data;
  },

  // 수정
  update: async (id: number, data: AdminUserUpdateRequest): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.put<ApiResponse<{ id: number }>>(`/adm/superadmin/admin-users/${id}`, data);
    return response.data;
  },

  // 삭제
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/adm/superadmin/admin-users/${id}`);
    return response.data;
  },
};
