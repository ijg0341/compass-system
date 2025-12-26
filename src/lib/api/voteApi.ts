/**
 * 전자투표 API 서비스
 * API 문서 기준: 2025-12-24
 *
 * API 경로 형식:
 * - 조회용: /adm/project/{projectUuid}/conferences
 * - 관리용(CUD): /adm/project/{projectUuid}/smartnet/conferences
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

const getBasePath = (projectUuid: string) => `/adm/project/${projectUuid}/conferences`;
const getSmartnetPath = (projectUuid: string) => `/adm/project/${projectUuid}/smartnet/conferences`;

// =============================================================================
// 1. 총회 (Conference) API
// 조회: /adm/project/{projectUuid}/conferences
// 관리: /adm/project/{projectUuid}/smartnet/conferences
// =============================================================================

/**
 * 총회 목록 조회
 */
export async function getConferences(
  projectUuid: string,
  params?: ConferenceListParams
): Promise<ApiListData<Conference>> {
  const response = await api.get(getBasePath(projectUuid), { params });
  return response.data.data;
}

/**
 * 총회 상세 조회
 */
export async function getConference(projectUuid: string, id: number): Promise<Conference> {
  const response = await api.get(`${getBasePath(projectUuid)}/${id}`);
  return response.data.data;
}

/**
 * 총회 등록 (smartnet 모듈)
 */
export async function createConference(
  projectUuid: string,
  data: ConferenceRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(getSmartnetPath(projectUuid), data);
  return response.data.data;
}

/**
 * 총회 수정 (smartnet 모듈)
 */
export async function updateConference(
  projectUuid: string,
  id: number,
  data: Partial<ConferenceRequest>
): Promise<void> {
  await api.put(`${getSmartnetPath(projectUuid)}/${id}`, data);
}

/**
 * 총회 삭제 (smartnet 모듈)
 */
export async function deleteConference(projectUuid: string, id: number): Promise<void> {
  await api.delete(`${getSmartnetPath(projectUuid)}/${id}`);
}

/**
 * 총회 통계 조회
 */
export async function getConferenceStats(
  projectUuid: string,
  conferenceId: number
): Promise<ConferenceStats> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/stats`);
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
  projectUuid: string,
  id: number,
  status: 'active' | 'closed' | 'completed'
): Promise<void> {
  await api.put(`${getSmartnetPath(projectUuid)}/${id}`, { status });
}

// =============================================================================
// 2. 조합원/투표자 (ConferenceVoter) API
// =============================================================================

/**
 * 투표자 목록 조회
 */
export async function getConferenceVoters(
  projectUuid: string,
  conferenceId: number,
  params?: ConferenceVoterListParams
): Promise<ApiListData<ConferenceVoter>> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/voters`, { params });
  return response.data.data;
}

/**
 * 투표자 등록
 */
export async function createConferenceVoter(
  projectUuid: string,
  conferenceId: number,
  data: ConferenceVoterRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectUuid)}/${conferenceId}/voters`, data);
  return response.data.data;
}

/**
 * 투표자 수정
 */
export async function updateConferenceVoter(
  projectUuid: string,
  conferenceId: number,
  voterId: number,
  data: Partial<ConferenceVoterRequest>
): Promise<void> {
  await api.put(`${getBasePath(projectUuid)}/${conferenceId}/voters/${voterId}`, data);
}

/**
 * 투표자 삭제
 */
export async function deleteConferenceVoter(
  projectUuid: string,
  conferenceId: number,
  voterId: number
): Promise<void> {
  await api.delete(`${getBasePath(projectUuid)}/${conferenceId}/voters/${voterId}`);
}

/**
 * 투표자 일괄 등록 (엑셀 업로드)
 */
export async function importConferenceVoters(
  projectUuid: string,
  conferenceId: number,
  file: File
): Promise<{ imported: number; failed: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(
    `${getBasePath(projectUuid)}/${conferenceId}/voters/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data;
}

/**
 * 투표자 명부 엑셀 다운로드
 */
export async function exportConferenceVoters(
  projectUuid: string,
  conferenceId: number
): Promise<Blob> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/voters/excel`, {
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
// =============================================================================

/**
 * 안건 목록 조회
 */
export async function getConferenceAgendas(
  projectUuid: string,
  conferenceId: number
): Promise<ConferenceAgenda[]> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/agendas`);
  return response.data.data;
}

/**
 * 안건 등록
 */
export async function createConferenceAgenda(
  projectUuid: string,
  conferenceId: number,
  data: ConferenceAgendaRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectUuid)}/${conferenceId}/agendas`, data);
  return response.data.data;
}

/**
 * 안건 수정
 */
export async function updateConferenceAgenda(
  projectUuid: string,
  conferenceId: number,
  agendaId: number,
  data: Partial<ConferenceAgendaRequest>
): Promise<void> {
  await api.put(`${getBasePath(projectUuid)}/${conferenceId}/agendas/${agendaId}`, data);
}

/**
 * 안건 삭제
 */
export async function deleteConferenceAgenda(
  projectUuid: string,
  conferenceId: number,
  agendaId: number
): Promise<void> {
  await api.delete(`${getBasePath(projectUuid)}/${conferenceId}/agendas/${agendaId}`);
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
  projectUuid: string,
  conferenceId: number
): Promise<AgendaStatusResponse> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/agenda-status`);
  return response.data.data;
}

// =============================================================================
// 5. 투표 내역 (VoteRecord) API
// =============================================================================

/**
 * 투표 내역 목록 조회
 */
export async function getVoteRecords(
  projectUuid: string,
  conferenceId: number,
  params?: VoteRecordListParams
): Promise<ApiListData<VoteRecord>> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/vote-records`, { params });
  return response.data.data;
}

/**
 * 투표 내역 상세 조회
 */
export async function getVoteRecord(
  projectUuid: string,
  conferenceId: number,
  recordId: number
): Promise<VoteRecord> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/vote-records/${recordId}`);
  return response.data.data;
}

/**
 * 투표 내역 엑셀 다운로드
 */
export async function exportVoteRecords(
  projectUuid: string,
  conferenceId: number
): Promise<Blob> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/vote-records/excel`, {
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
  projectUuid: string,
  conferenceId: number,
  data: PaperVoteRequest
): Promise<ApiCreateResponse['data']> {
  const response = await api.post(`${getBasePath(projectUuid)}/${conferenceId}/paper-votes`, data);
  return response.data.data;
}

/**
 * 서면투표 수정
 */
export async function updatePaperVote(
  projectUuid: string,
  conferenceId: number,
  voterId: number,
  data: PaperVoteRequest
): Promise<void> {
  await api.put(`${getBasePath(projectUuid)}/${conferenceId}/paper-votes/${voterId}`, data);
}

// =============================================================================
// 7. 동 목록 조회
// =============================================================================

/**
 * 동 목록 조회 (투표자 명부 기준)
 */
export async function getVoteDongs(
  projectUuid: string,
  conferenceId: number
): Promise<number[]> {
  const response = await api.get(`${getBasePath(projectUuid)}/${conferenceId}/voters/dongs`);
  return response.data.data;
}
