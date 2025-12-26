/**
 * 게시판 관련 타입 정의
 * API 문서 기준: 2025-12-26
 */

// =============================================================================
// 공통 타입
// =============================================================================

/** 게시판 타입 */
export type BoardType = 'notice' | 'document' | 'popup';

/** 게시판 카테고리 */
export interface BoardCategory {
  id: number;
  name: string;
}

/** S3 파일 정보 */
export interface BoardFile {
  id: number;
  uuid: string;
  original_name: string;
  file_size: number;
  mime_type: string;
}

/** API 날짜 응답 형식 */
export interface BoardDateResponse {
  date: string;
  timezone_type: number;
  timezone: string;
}

// =============================================================================
// 게시글 타입
// =============================================================================

/** 게시글 기본 정보 (상세 조회용) */
export interface BoardPost {
  id: number;
  project_id: number | null;
  admin_users_id: number;
  admin_user_name?: string;
  board_category_id: number;
  board_category_name?: string;
  board_subject: string;
  board_text: string;
  board_count_view: number;
  board_files: BoardFile[] | null;
  board_date: BoardDateResponse | string;
  board_hidden: number; // 0: 공개, 1: 비공개
  board_extra: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

/** 게시글 목록 아이템 (목록 조회용) */
export interface BoardPostListItem {
  id: number;
  board_category_id?: number;
  board_category_name?: string;
  board_subject: string;
  admin_user_name?: string;
  board_date: BoardDateResponse | string;
  board_count_view: number;
  board_hidden: number;
}

/** 날짜 포맷 헬퍼 함수 */
export function formatBoardDate(date: BoardDateResponse | string | undefined): string {
  if (!date) return '-';
  if (typeof date === 'string') return date.split(' ')[0];
  return date.date.split(' ')[0];
}

/** 게시글 등록/수정 요청 */
export interface BoardPostRequest {
  board_category_id: number;
  board_subject: string;
  board_text: string;
  board_hidden: number;
  board_files?: number[]; // 파일 ID 배열
}

// =============================================================================
// 목록 조회 파라미터
// =============================================================================

/** 게시글 목록 조회 파라미터 */
export interface BoardListParams {
  page?: number;
  size?: number;
  searchType?: 'subject' | 'text' | 'admin_user_name'; // 제목, 내용, 작성자
  searchKeyword?: string;
  board_category_id?: number;
  board_hidden?: number;
  date_begin?: string;
  date_end?: string;
}

// =============================================================================
// 팝업 공지 추가 필드
// =============================================================================

/** 팝업 공지 추가 정보 */
export interface PopupExtra extends Record<string, unknown> {
  notice_begin: string;
  notice_end: string;
}

/** 팝업 공지 게시글 */
export interface PopupPost extends Omit<BoardPost, 'board_extra'> {
  board_extra: PopupExtra;
}
