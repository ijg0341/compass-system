/**
 * 사용자 관리 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로: /adm/project/{projectUuid}/users
 * type: 1=입주자, 2=협력사, 3=매니저
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type {
  ProjectUser,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
  CreateAccountsResponse,
} from '@/src/types/user.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;

// =============================================================================
// 사용자 관리 API
// =============================================================================

/**
 * 사용자 목록 조회
 * @param type 1=입주자, 2=협력사, 3=매니저
 */
export async function getUsers(
  projectUuid: string,
  params?: UserListParams
): Promise<ApiListData<ProjectUser>> {
  const response = await api.get<ApiResponse<ApiListData<ProjectUser>>>(
    `${getAdminBasePath(projectUuid)}/users`,
    { params }
  );
  return response.data.data;
}

/**
 * 입주자 목록 조회
 */
export async function getResidents(
  projectUuid: string,
  params?: Omit<UserListParams, 'type'>
): Promise<ApiListData<ProjectUser>> {
  return getUsers(projectUuid, { ...params, type: 1 });
}

/**
 * 협력사 목록 조회
 */
export async function getPartners(
  projectUuid: string,
  params?: Omit<UserListParams, 'type'>
): Promise<ApiListData<ProjectUser>> {
  return getUsers(projectUuid, { ...params, type: 2 });
}

/**
 * 매니저 목록 조회
 */
export async function getManagers(
  projectUuid: string,
  params?: Omit<UserListParams, 'type'>
): Promise<ApiListData<ProjectUser>> {
  return getUsers(projectUuid, { ...params, type: 3 });
}

/**
 * 사용자 상세 조회
 */
export async function getUser(projectUuid: string, id: number): Promise<ProjectUser> {
  const response = await api.get<ApiResponse<ProjectUser>>(
    `${getAdminBasePath(projectUuid)}/users/${id}`
  );
  return response.data.data;
}

/**
 * 사용자 등록
 */
export async function createUser(
  projectUuid: string,
  data: CreateUserRequest
): Promise<ApiCreateResponse['data']> {
  // is_active를 숫자로 변환 (PHP 백엔드 호환성)
  const payload = {
    ...data,
    is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : undefined,
  };
  const response = await api.post<ApiCreateResponse>(
    `${getAdminBasePath(projectUuid)}/users`,
    payload
  );
  return response.data.data;
}

/**
 * 협력사 등록
 */
export async function createPartner(
  projectUuid: string,
  data: Omit<CreateUserRequest, 'type'>
): Promise<ApiCreateResponse['data']> {
  return createUser(projectUuid, { ...data, type: 2 });
}

/**
 * 매니저 등록
 */
export async function createManager(
  projectUuid: string,
  data: Omit<CreateUserRequest, 'type'>
): Promise<ApiCreateResponse['data']> {
  return createUser(projectUuid, { ...data, type: 3 });
}

/**
 * 사용자 수정
 */
export async function updateUser(
  projectUuid: string,
  id: number,
  data: UpdateUserRequest
): Promise<void> {
  // 빈 문자열을 undefined로 변환 (PostgreSQL DATE 필드 호환성)
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
  );

  // is_active를 숫자로 변환 (PHP 백엔드 호환성)
  const payload = {
    ...cleanData,
    is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : undefined,
  };
  await api.put(`${getAdminBasePath(projectUuid)}/users/${id}`, payload);
}

/**
 * 사용자 삭제 (매니저만 삭제 가능)
 */
export async function deleteUser(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getAdminBasePath(projectUuid)}/users/${id}`);
}

/**
 * 아이디 중복 확인
 * @returns true if available, false if duplicate
 */
export async function checkUserIdDuplicate(
  projectUuid: string,
  userId: string
): Promise<boolean> {
  const response = await api.get<ApiResponse<{ available: boolean }>>(
    `${getAdminBasePath(projectUuid)}/users/check-duplicate`,
    { params: { user_id: userId } }
  );
  return response.data.data.available;
}

// =============================================================================
// 입주자 계정 일괄 생성 API
// =============================================================================

/**
 * 입주자 계정 일괄 생성
 * 동호 코드에 없는 입주자 계정을 자동 생성
 */
export async function createResidentAccounts(
  projectUuid: string
): Promise<CreateAccountsResponse> {
  const response = await api.post<ApiResponse<CreateAccountsResponse>>(
    `${getAdminBasePath(projectUuid)}/donghos-codes/create-accounts`
  );
  return response.data.data;
}
