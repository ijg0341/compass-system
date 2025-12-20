/**
 * 전자투표 API 서비스
 * API 경로: /adm/project/{projectId}/conferences/...
 */

import { api } from './client';
import type { ApiListData, ApiCreateResponse } from '@/src/types/api';
import type {
  Conference,
  ConferenceRequest,
  ConferenceListParams,
  ConferenceVoter,
  ConferenceVoterRequest,
  ConferenceVoterListParams,
  ConferenceAgenda,
  ConferenceAgendaRequest,
  VoteRecord,
  VoteRecordListParams,
  PaperVoteRequest,
  ConferenceStats,
} from '@/src/types/vote.types';

// =============================================================================
// API 경로 헬퍼
// =============================================================================

const getBasePath = (projectId: number) => `/adm/project/${projectId}/conferences`;

// =============================================================================
// 1. 총회 (Conference) API
// =============================================================================

/**
 * 총회 목록 조회
 */
export async function getConferences(
  projectId: number,
  params?: ConferenceListParams
): Promise<ApiListData<Conference>> {
  const response = await api.get(getBasePath(projectId), { params });
  return response.data.data;
}

/**
 * 총회 상세 조회
 */
export async function getConference(projectId: number, id: number): Promise<Conference> {
  const response = await api.get(`${getBasePath(projectId)}/${id}`);
  return response.data.data;
}

/**
 * 총회 등록
 */
export async function createConference(
  projectId: number,
  data: ConferenceRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(getBasePath(projectId), data);
  return response.data.data;
}

/**
 * 총회 수정
 */
export async function updateConference(
  projectId: number,
  id: number,
  data: Partial<ConferenceRequest>
): Promise<void> {
  await api.put(`${getBasePath(projectId)}/${id}`, data);
}

/**
 * 총회 삭제
 */
export async function deleteConference(projectId: number, id: number): Promise<void> {
  await api.delete(`${getBasePath(projectId)}/${id}`);
}

/**
 * 총회 통계 조회
 */
export async function getConferenceStats(
  projectId: number,
  conferenceId: number
): Promise<ConferenceStats> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/stats`);
  return response.data.data;
}

// =============================================================================
// 기존 Meeting API 호환 (별칭)
// =============================================================================

export const getMeetings = getConferences;
export const getMeeting = getConference;
export const createMeeting = createConference;
export const updateMeeting = updateConference;
export const deleteMeeting = deleteConference;
export const getMeetingStats = getConferenceStats;

// 기존 상태 변경 API (향후 구현)
export async function updateMeetingStatus(
  projectId: number,
  id: number,
  status: 'active' | 'closed' | 'completed'
): Promise<void> {
  await api.put(`${getBasePath(projectId)}/${id}`, { status });
}

// =============================================================================
// 2. 조합원/투표자 (ConferenceVoter) API
// 향후 구현 예정 - 현재는 placeholder
// =============================================================================

/**
 * 투표자 목록 조회
 */
export async function getConferenceVoters(
  projectId: number,
  conferenceId: number,
  params?: ConferenceVoterListParams
): Promise<ApiListData<ConferenceVoter>> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/voters`, { params });
  return response.data.data;
}

/**
 * 투표자 등록
 */
export async function createConferenceVoter(
  projectId: number,
  conferenceId: number,
  data: ConferenceVoterRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectId)}/${conferenceId}/voters`, data);
  return response.data.data;
}

/**
 * 투표자 수정
 */
export async function updateConferenceVoter(
  projectId: number,
  conferenceId: number,
  voterId: number,
  data: Partial<ConferenceVoterRequest>
): Promise<void> {
  await api.put(`${getBasePath(projectId)}/${conferenceId}/voters/${voterId}`, data);
}

/**
 * 투표자 삭제
 */
export async function deleteConferenceVoter(
  projectId: number,
  conferenceId: number,
  voterId: number
): Promise<void> {
  await api.delete(`${getBasePath(projectId)}/${conferenceId}/voters/${voterId}`);
}

/**
 * 투표자 일괄 등록 (엑셀 업로드)
 */
export async function importConferenceVoters(
  projectId: number,
  conferenceId: number,
  file: File
): Promise<{ imported: number; failed: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(
    `${getBasePath(projectId)}/${conferenceId}/voters/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data;
}

/**
 * 투표자 명부 엑셀 다운로드
 */
export async function exportConferenceVoters(
  projectId: number,
  conferenceId: number
): Promise<Blob> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/voters/excel`, {
    responseType: 'blob',
  });
  return response.data;
}

// 기존 VoteMember API 호환 (별칭)
export const getVoteMembers = getConferenceVoters;
export const createVoteMember = createConferenceVoter;
export const updateVoteMember = updateConferenceVoter;
export const deleteVoteMember = deleteConferenceVoter;
export const importVoteMembers = importConferenceVoters;
export const exportVoteMembers = exportConferenceVoters;

// =============================================================================
// 3. 안건 (ConferenceAgenda) API
// 향후 구현 예정 - 현재는 placeholder
// =============================================================================

/**
 * 안건 목록 조회
 */
export async function getConferenceAgendas(
  projectId: number,
  conferenceId: number
): Promise<ConferenceAgenda[]> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/agendas`);
  return response.data.data;
}

/**
 * 안건 등록
 */
export async function createConferenceAgenda(
  projectId: number,
  conferenceId: number,
  data: ConferenceAgendaRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectId)}/${conferenceId}/agendas`, data);
  return response.data.data;
}

/**
 * 안건 수정
 */
export async function updateConferenceAgenda(
  projectId: number,
  conferenceId: number,
  agendaId: number,
  data: Partial<ConferenceAgendaRequest>
): Promise<void> {
  await api.put(`${getBasePath(projectId)}/${conferenceId}/agendas/${agendaId}`, data);
}

/**
 * 안건 삭제
 */
export async function deleteConferenceAgenda(
  projectId: number,
  conferenceId: number,
  agendaId: number
): Promise<void> {
  await api.delete(`${getBasePath(projectId)}/${conferenceId}/agendas/${agendaId}`);
}

// 기존 Agenda API 호환 (별칭)
export const getAgendas = getConferenceAgendas;
export const createAgenda = createConferenceAgenda;
export const updateAgenda = updateConferenceAgenda;
export const deleteAgenda = deleteConferenceAgenda;

// =============================================================================
// 4. 안건 현황 (Agenda Status) API
// =============================================================================

/** 안건 현황 응답 타입 */
export interface AgendaStatusResponse {
  base_date: string;
  agendas: AgendaWithVotes[];
}

/** 투표 집계 포함 안건 */
export interface AgendaWithVotes extends ConferenceAgenda {
  order: number;
  title: string;
  vote_type: 'approval' | 'selection';
  options?: { id: number; label: string }[];
  electronic_result: VoteResult;
  paper_result: VoteResult;
  attendance_count: number;
  final_result: string | null;
}

/** 투표 결과 - answers 키 기반 */
export type VoteResult = Record<string, number>;

/**
 * 안건 현황 조회 (투표 집계 포함)
 */
export async function getAgendaStatus(
  projectId: number,
  conferenceId: number
): Promise<AgendaStatusResponse> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/agenda-status`);
  return response.data.data;
}

// =============================================================================
// 5. 투표 내역 (VoteRecord) API
// =============================================================================

/**
 * 투표 내역 목록 조회
 */
export async function getVoteRecords(
  projectId: number,
  conferenceId: number,
  params?: VoteRecordListParams
): Promise<ApiListData<VoteRecord>> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/vote-records`, { params });
  return response.data.data;
}

/**
 * 투표 내역 상세 조회
 */
export async function getVoteRecord(
  projectId: number,
  conferenceId: number,
  recordId: number
): Promise<VoteRecord> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/vote-records/${recordId}`);
  return response.data.data;
}

/**
 * 투표 내역 엑셀 다운로드
 */
export async function exportVoteRecords(
  projectId: number,
  conferenceId: number
): Promise<Blob> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/vote-records/excel`, {
    responseType: 'blob',
  });
  return response.data;
}

// =============================================================================
// 6. 서면투표 등록 API
// =============================================================================

/**
 * 서면투표 등록
 */
export async function registerPaperVote(
  projectId: number,
  conferenceId: number,
  data: PaperVoteRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectId)}/${conferenceId}/paper-votes`, data);
  return response.data.data;
}

/**
 * 서면투표 수정
 */
export async function updatePaperVote(
  projectId: number,
  conferenceId: number,
  voterId: number,
  data: PaperVoteRequest
): Promise<void> {
  await api.put(`${getBasePath(projectId)}/${conferenceId}/paper-votes/${voterId}`, data);
}

// =============================================================================
// 7. 동 목록 조회
// =============================================================================

/**
 * 동 목록 조회 (투표자 명부 기준)
 */
export async function getVoteDongs(
  projectId: number,
  conferenceId: number
): Promise<number[]> {
  const response = await api.get(`${getBasePath(projectId)}/${conferenceId}/voters/dongs`);
  return response.data.data;
}
