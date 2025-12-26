/**
 * 게시판 관련 React Query hooks
 * API 문서 기준: 2025-12-26
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBoardPosts,
  getBoardPost,
  createBoardPost,
  updateBoardPost,
  deleteBoardPost,
} from '@/src/lib/api/boardApi';
import type { BoardType, BoardListParams, BoardPostRequest } from '@/src/types/board.types';

// =============================================================================
// Query Keys
// =============================================================================

export const boardKeys = {
  all: ['board'] as const,

  // 게시글 목록
  posts: (projectUuid: string, boardType: BoardType, params?: BoardListParams) =>
    [...boardKeys.all, 'posts', projectUuid, boardType, params] as const,

  // 게시글 상세
  post: (projectUuid: string, boardType: BoardType, id: number) =>
    [...boardKeys.all, 'post', projectUuid, boardType, id] as const,
};

// =============================================================================
// 게시글 조회 Hooks
// =============================================================================

/**
 * 게시글 목록 조회
 */
export function useBoardPosts(
  projectUuid: string,
  boardType: BoardType,
  params?: BoardListParams
) {
  return useQuery({
    queryKey: boardKeys.posts(projectUuid, boardType, params),
    queryFn: () => getBoardPosts(projectUuid, boardType, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 게시글 상세 조회
 */
export function useBoardPost(
  projectUuid: string,
  boardType: BoardType,
  id: number
) {
  return useQuery({
    queryKey: boardKeys.post(projectUuid, boardType, id),
    queryFn: () => getBoardPost(projectUuid, boardType, id),
    enabled: !!projectUuid && !!id,
  });
}

// =============================================================================
// 게시글 Mutation Hooks
// =============================================================================

/**
 * 게시글 등록
 */
export function useCreateBoardPost(boardType: BoardType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      data,
    }: {
      projectUuid: string;
      data: BoardPostRequest;
    }) => createBoardPost(projectUuid, boardType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

/**
 * 게시글 수정
 */
export function useUpdateBoardPost(boardType: BoardType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<BoardPostRequest>;
    }) => updateBoardPost(projectUuid, boardType, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

/**
 * 게시글 삭제
 */
export function useDeleteBoardPost(boardType: BoardType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectUuid,
      id,
    }: {
      projectUuid: string;
      id: number;
    }) => deleteBoardPost(projectUuid, boardType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

// =============================================================================
// 공지사항 전용 Hooks (편의 함수)
// =============================================================================

export const useNotices = (projectUuid: string, params?: BoardListParams) =>
  useBoardPosts(projectUuid, 'notice', params);

export const useNotice = (projectUuid: string, id: number) =>
  useBoardPost(projectUuid, 'notice', id);

export const useCreateNotice = () => useCreateBoardPost('notice');
export const useUpdateNotice = () => useUpdateBoardPost('notice');
export const useDeleteNotice = () => useDeleteBoardPost('notice');

// =============================================================================
// 자료실 전용 Hooks (편의 함수)
// =============================================================================

export const useDocuments = (projectUuid: string, params?: BoardListParams) =>
  useBoardPosts(projectUuid, 'document', params);

export const useDocument = (projectUuid: string, id: number) =>
  useBoardPost(projectUuid, 'document', id);

export const useCreateDocument = () => useCreateBoardPost('document');
export const useUpdateDocument = () => useUpdateBoardPost('document');
export const useDeleteDocument = () => useDeleteBoardPost('document');
