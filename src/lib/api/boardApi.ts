/**
 * 게시판 API 서비스
 * API 문서 기준: 2025-12-26
 *
 * API 경로 형식:
 * - 공지사항: /adm/project/{projectUuid}/boards/notice
 * - 자료실: /adm/project/{projectUuid}/boards/document
 * - 팝업공지: /adm/project/{projectUuid}/boards/popup
 */
import { api } from './client';
import type { ApiResponse, ApiListData, ApiCreateResponse } from '@/src/types/api';
import type {
  BoardType,
  BoardPost,
  BoardPostListItem,
  BoardPostRequest,
  BoardListParams,
} from '@/src/types/board.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getAdminBasePath = (projectUuid: string) => `/adm/project/${projectUuid}`;
const getBoardPath = (projectUuid: string, boardType: BoardType) =>
  `${getAdminBasePath(projectUuid)}/boards/${boardType}`;

// =============================================================================
// 게시글 CRUD API
// =============================================================================

/**
 * 게시글 목록 조회
 */
export async function getBoardPosts(
  projectUuid: string,
  boardType: BoardType,
  params?: BoardListParams
): Promise<ApiListData<BoardPostListItem>> {
  const response = await api.get<ApiResponse<ApiListData<BoardPostListItem>>>(
    getBoardPath(projectUuid, boardType),
    { params }
  );
  return response.data.data;
}

/**
 * 게시글 상세 조회
 */
export async function getBoardPost(
  projectUuid: string,
  boardType: BoardType,
  id: number
): Promise<BoardPost> {
  const response = await api.get<ApiResponse<BoardPost>>(
    `${getBoardPath(projectUuid, boardType)}/${id}`
  );
  return response.data.data;
}

/**
 * 게시글 등록
 */
export async function createBoardPost(
  projectUuid: string,
  boardType: BoardType,
  data: BoardPostRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post<ApiCreateResponse>(
    getBoardPath(projectUuid, boardType),
    data
  );
  return response.data.data;
}

/**
 * 게시글 수정
 */
export async function updateBoardPost(
  projectUuid: string,
  boardType: BoardType,
  id: number,
  data: Partial<BoardPostRequest>
): Promise<void> {
  await api.put(`${getBoardPath(projectUuid, boardType)}/${id}`, data);
}

/**
 * 게시글 삭제
 */
export async function deleteBoardPost(
  projectUuid: string,
  boardType: BoardType,
  id: number
): Promise<void> {
  await api.delete(`${getBoardPath(projectUuid, boardType)}/${id}`);
}

// =============================================================================
// 공지사항 전용 API (편의 함수)
// =============================================================================

export const getNotices = (projectUuid: string, params?: BoardListParams) =>
  getBoardPosts(projectUuid, 'notice', params);

export const getNotice = (projectUuid: string, id: number) =>
  getBoardPost(projectUuid, 'notice', id);

export const createNotice = (projectUuid: string, data: BoardPostRequest) =>
  createBoardPost(projectUuid, 'notice', data);

export const updateNotice = (projectUuid: string, id: number, data: Partial<BoardPostRequest>) =>
  updateBoardPost(projectUuid, 'notice', id, data);

export const deleteNotice = (projectUuid: string, id: number) =>
  deleteBoardPost(projectUuid, 'notice', id);

// =============================================================================
// 자료실 전용 API (편의 함수)
// =============================================================================

export const getDocuments = (projectUuid: string, params?: BoardListParams) =>
  getBoardPosts(projectUuid, 'document', params);

export const getDocument = (projectUuid: string, id: number) =>
  getBoardPost(projectUuid, 'document', id);

export const createDocument = (projectUuid: string, data: BoardPostRequest) =>
  createBoardPost(projectUuid, 'document', data);

export const updateDocument = (projectUuid: string, id: number, data: Partial<BoardPostRequest>) =>
  updateBoardPost(projectUuid, 'document', id, data);

export const deleteDocument = (projectUuid: string, id: number) =>
  deleteBoardPost(projectUuid, 'document', id);

// =============================================================================
// 팝업공지 전용 API (편의 함수)
// =============================================================================

export const getPopups = (projectUuid: string, params?: BoardListParams) =>
  getBoardPosts(projectUuid, 'popup', params);

export const getPopup = (projectUuid: string, id: number) =>
  getBoardPost(projectUuid, 'popup', id);

/**
 * 현재 활성화된 팝업공지 조회
 * notice_begin <= 오늘 <= notice_end 이고 board_hidden = 0인 팝업만 조회
 */
export async function getActivePopups(projectUuid: string): Promise<BoardPost[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 목록 조회 (비공개 제외)
  const listData = await getBoardPosts(projectUuid, 'popup', {
    board_hidden: 0,
    limit: 100,
  });

  // 날짜 필터링 (notice_begin <= today <= notice_end)
  const activePopups: BoardPost[] = [];

  for (const item of listData.list) {
    // 상세 조회하여 board_extra 확인
    try {
      const detail = await getBoardPost(projectUuid, 'popup', item.id);
      const noticeBegin = detail.board_extra?.notice_begin;
      const noticeEnd = detail.board_extra?.notice_end;

      // 시작일 체크
      if (noticeBegin && noticeBegin > today) continue;
      // 종료일 체크 (종료일이 없으면 무기한)
      if (noticeEnd && noticeEnd < today) continue;

      activePopups.push(detail);
    } catch {
      // 상세 조회 실패 시 스킵
    }
  }

  return activePopups;
}
