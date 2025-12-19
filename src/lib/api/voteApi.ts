/**
 * 전자투표 API 서비스
 * 현재: Mock 데이터 사용
 * TODO: 백엔드 API 구현 후 실제 API로 교체
 *
 * API 경로 형식 (예정):
 * - 관리자용: /adm/project/{projectId}/meetings/...
 */

import type { ApiListData, ApiCreateResponse } from '@/src/types/api';
import type {
  Meeting,
  MeetingRequest,
  MeetingListParams,
  VoteMember,
  VoteMemberRequest,
  VoteMemberListParams,
  Agenda,
  AgendaRequest,
  VoteRecord,
  VoteRecordListParams,
  PaperVoteRequest,
  MeetingStats,
} from '@/src/types/vote.types';

// Mock 데이터 import
import {
  mockMeetings,
  mockVoteMembers,
  mockAgendas,
  mockVoteRecords,
  mockMeetingStats,
  delay,
} from '@/src/lib/mockData/voteData';

// =============================================================================
// API 경로 헬퍼 (백엔드 구현 후 사용)
// =============================================================================

// const getAdminBasePath = (projectId: number) => `/adm/project/${projectId}`;

// =============================================================================
// 1. 총회 (Meeting) API
// =============================================================================

/**
 * 총회 목록 조회
 */
export async function getMeetings(
  projectId: number,
  params?: MeetingListParams
): Promise<ApiListData<Meeting>> {
  await delay();

  let filtered = mockMeetings.filter((m) => m.project_id === projectId);

  // 검색어 필터
  if (params?.searchKeyword) {
    const keyword = params.searchKeyword.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(keyword) ||
        m.description?.toLowerCase().includes(keyword)
    );
  }

  // 상태 필터
  if (params?.status) {
    filtered = filtered.filter((m) => m.status === params.status);
  }

  // 페이지네이션
  const offset = params?.offset || 0;
  const limit = params?.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    offset,
    limit,
    total: filtered.length,
    list: paginated,
  };
}

/**
 * 총회 상세 조회
 */
export async function getMeeting(projectId: number, id: number): Promise<Meeting> {
  await delay();

  const meeting = mockMeetings.find((m) => m.id === id && m.project_id === projectId);
  if (!meeting) {
    throw new Error('총회를 찾을 수 없습니다.');
  }
  return meeting;
}

/**
 * 총회 등록
 */
export async function createMeeting(
  projectId: number,
  data: MeetingRequest
): Promise<ApiCreateResponse['data']> {
  await delay();

  const newId = Math.max(...mockMeetings.map((m) => m.id)) + 1;
  const newMeeting: Meeting = {
    id: newId,
    project_id: projectId,
    title: data.title,
    description: data.description,
    meeting_date: data.meeting_date,
    vote_start_date: data.vote_start_date,
    vote_end_date: data.vote_end_date,
    vote_type: data.vote_type,
    max_revote_count: data.max_revote_count,
    status: 'draft',
    total_members: 0,
    quorum_count: 0,
    voted_count: 0,
    agenda_count: data.agendas?.length || 0,
    uuid: `vote-uuid-${newId.toString().padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockMeetings.push(newMeeting);
  return { id: newId };
}

/**
 * 총회 수정
 */
export async function updateMeeting(
  projectId: number,
  id: number,
  data: Partial<MeetingRequest>
): Promise<void> {
  await delay();

  const index = mockMeetings.findIndex((m) => m.id === id && m.project_id === projectId);
  if (index === -1) {
    throw new Error('총회를 찾을 수 없습니다.');
  }

  mockMeetings[index] = {
    ...mockMeetings[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
}

/**
 * 총회 삭제
 */
export async function deleteMeeting(projectId: number, id: number): Promise<void> {
  await delay();

  const index = mockMeetings.findIndex((m) => m.id === id && m.project_id === projectId);
  if (index === -1) {
    throw new Error('총회를 찾을 수 없습니다.');
  }

  mockMeetings.splice(index, 1);
}

/**
 * 총회 상태 변경 (투표 시작/종료)
 */
export async function updateMeetingStatus(
  projectId: number,
  id: number,
  status: 'active' | 'closed' | 'completed'
): Promise<void> {
  await delay();

  const index = mockMeetings.findIndex((m) => m.id === id && m.project_id === projectId);
  if (index === -1) {
    throw new Error('총회를 찾을 수 없습니다.');
  }

  mockMeetings[index] = {
    ...mockMeetings[index],
    status,
    updated_at: new Date().toISOString(),
  };
}

/**
 * 총회 통계 조회
 */
export async function getMeetingStats(
  projectId: number,
  meetingId: number
): Promise<MeetingStats> {
  await delay();

  // Mock: 고정값 반환
  void projectId;
  void meetingId;
  return mockMeetingStats;
}

// =============================================================================
// 2. 조합원 명부 (Member) API
// =============================================================================

/**
 * 조합원 목록 조회
 */
export async function getVoteMembers(
  projectId: number,
  meetingId: number,
  params?: VoteMemberListParams
): Promise<ApiListData<VoteMember>> {
  await delay();
  void projectId;

  let filtered = mockVoteMembers.filter((m) => m.meeting_id === meetingId);

  // 검색어 필터
  if (params?.searchKeyword) {
    const keyword = params.searchKeyword.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(keyword) ||
        m.phone.includes(keyword) ||
        m.dong?.includes(keyword) ||
        m.ho?.includes(keyword)
    );
  }

  // 동 필터
  if (params?.dong) {
    filtered = filtered.filter((m) => m.dong === params.dong);
  }

  // 투표 여부 필터
  if (params?.has_voted !== undefined) {
    filtered = filtered.filter((m) => m.has_voted === params.has_voted);
  }

  // 페이지네이션
  const offset = params?.offset || 0;
  const limit = params?.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    offset,
    limit,
    total: filtered.length,
    list: paginated,
  };
}

/**
 * 조합원 등록
 */
export async function createVoteMember(
  projectId: number,
  meetingId: number,
  data: VoteMemberRequest
): Promise<ApiCreateResponse['data']> {
  await delay();
  void projectId;

  const newId = Math.max(...mockVoteMembers.map((m) => m.id)) + 1;
  const newMember: VoteMember = {
    id: newId,
    meeting_id: meetingId,
    member_no: data.member_no || `M${newId.toString().padStart(3, '0')}`,
    name: data.name,
    phone: data.phone,
    birth_date: data.birth_date,
    dong: data.dong,
    ho: data.ho,
    unit_type: data.unit_type,
    pre_vote_intention: data.pre_vote_intention,
    revote_count: data.revote_count || 0,
    has_voted: false,
    pre_voted: false,
  };

  mockVoteMembers.push(newMember);
  return { id: newId };
}

/**
 * 조합원 수정
 */
export async function updateVoteMember(
  projectId: number,
  meetingId: number,
  memberId: number,
  data: VoteMemberRequest
): Promise<void> {
  await delay();
  void projectId;

  const index = mockVoteMembers.findIndex(
    (m) => m.id === memberId && m.meeting_id === meetingId
  );
  if (index === -1) {
    throw new Error('조합원을 찾을 수 없습니다.');
  }

  mockVoteMembers[index] = {
    ...mockVoteMembers[index],
    ...data,
  };
}

/**
 * 조합원 삭제
 */
export async function deleteVoteMember(
  projectId: number,
  meetingId: number,
  memberId: number
): Promise<void> {
  await delay();
  void projectId;

  const index = mockVoteMembers.findIndex(
    (m) => m.id === memberId && m.meeting_id === meetingId
  );
  if (index === -1) {
    throw new Error('조합원을 찾을 수 없습니다.');
  }

  mockVoteMembers.splice(index, 1);
}

/**
 * 조합원 일괄 등록 (엑셀 업로드)
 */
export async function importVoteMembers(
  projectId: number,
  meetingId: number,
  file: File
): Promise<{ imported: number; failed: number }> {
  await delay(1000);
  void projectId;
  void meetingId;
  void file;

  // Mock: 성공 응답
  return { imported: 50, failed: 2 };
}

/**
 * 조합원 명부 엑셀 다운로드
 */
export async function exportVoteMembers(
  projectId: number,
  meetingId: number
): Promise<Blob> {
  await delay();
  void projectId;
  void meetingId;

  // Mock: 빈 Blob 반환
  return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// =============================================================================
// 3. 안건 (Agenda) API
// =============================================================================

/**
 * 안건 목록 조회
 */
export async function getAgendas(
  projectId: number,
  meetingId: number
): Promise<Agenda[]> {
  await delay();
  void projectId;

  return mockAgendas
    .filter((a) => a.meeting_id === meetingId)
    .sort((a, b) => a.order - b.order);
}

/**
 * 안건 등록
 */
export async function createAgenda(
  projectId: number,
  meetingId: number,
  data: AgendaRequest
): Promise<ApiCreateResponse['data']> {
  await delay();
  void projectId;

  const existingAgendas = mockAgendas.filter((a) => a.meeting_id === meetingId);
  const newId = Math.max(...mockAgendas.map((a) => a.id), 0) + 1;
  const newOrder = data.order ?? existingAgendas.length + 1;

  const newAgenda: Agenda = {
    id: newId,
    meeting_id: meetingId,
    order: newOrder,
    title: data.title,
    description: data.description,
    vote_type: data.vote_type,
    pass_threshold_percentage: data.pass_threshold_percentage,
    options: data.options
      ? data.options.split(',').map((label, idx) => ({ id: idx + 1, label: label.trim() }))
      : undefined,
  };

  mockAgendas.push(newAgenda);
  return { id: newId };
}

/**
 * 안건 수정
 */
export async function updateAgenda(
  projectId: number,
  meetingId: number,
  agendaId: number,
  data: Partial<AgendaRequest>
): Promise<void> {
  await delay();
  void projectId;

  const index = mockAgendas.findIndex(
    (a) => a.id === agendaId && a.meeting_id === meetingId
  );
  if (index === -1) {
    throw new Error('안건을 찾을 수 없습니다.');
  }

  mockAgendas[index] = {
    ...mockAgendas[index],
    ...data,
    order: data.order ?? mockAgendas[index].order,
    options: data.options
      ? data.options.split(',').map((label, idx) => ({ id: idx + 1, label: label.trim() }))
      : mockAgendas[index].options,
  };
}

/**
 * 안건 삭제
 */
export async function deleteAgenda(
  projectId: number,
  meetingId: number,
  agendaId: number
): Promise<void> {
  await delay();
  void projectId;

  const index = mockAgendas.findIndex(
    (a) => a.id === agendaId && a.meeting_id === meetingId
  );
  if (index === -1) {
    throw new Error('안건을 찾을 수 없습니다.');
  }

  mockAgendas.splice(index, 1);
}

// =============================================================================
// 4. 투표 내역 (Vote Record) API
// =============================================================================

/**
 * 투표 내역 목록 조회
 */
export async function getVoteRecords(
  projectId: number,
  meetingId: number,
  params?: VoteRecordListParams
): Promise<ApiListData<VoteRecord>> {
  await delay();
  void projectId;

  // 해당 총회의 투표 내역만 필터링
  let filtered = mockVoteRecords.filter((r) => {
    const member = mockVoteMembers.find((m) => m.id === r.member_id);
    return member?.meeting_id === meetingId;
  });

  // 검색어 필터
  if (params?.searchKeyword) {
    const keyword = params.searchKeyword.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.member_name.toLowerCase().includes(keyword) ||
        r.phone.includes(keyword) ||
        r.dong?.includes(keyword) ||
        r.ho?.includes(keyword)
    );
  }

  // 동 필터
  if (params?.dong) {
    filtered = filtered.filter((r) => r.dong === params.dong);
  }

  // 투표 방식 필터
  if (params?.vote_method) {
    filtered = filtered.filter((r) => r.vote_method === params.vote_method);
  }

  // 페이지네이션
  const offset = params?.offset || 0;
  const limit = params?.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    offset,
    limit,
    total: filtered.length,
    list: paginated,
  };
}

/**
 * 투표 내역 상세 조회
 */
export async function getVoteRecord(
  projectId: number,
  meetingId: number,
  recordId: number
): Promise<VoteRecord> {
  await delay();
  void projectId;
  void meetingId;

  const record = mockVoteRecords.find((r) => r.id === recordId);
  if (!record) {
    throw new Error('투표 내역을 찾을 수 없습니다.');
  }
  return record;
}

/**
 * 투표 내역 엑셀 다운로드
 */
export async function exportVoteRecords(
  projectId: number,
  meetingId: number
): Promise<Blob> {
  await delay();
  void projectId;
  void meetingId;

  // Mock: 빈 Blob 반환
  return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// =============================================================================
// 5. 서면투표 등록 API
// =============================================================================

/**
 * 서면투표 등록
 */
export async function registerPaperVote(
  projectId: number,
  meetingId: number,
  data: PaperVoteRequest
): Promise<ApiCreateResponse['data']> {
  await delay();
  void projectId;

  // Mock: 해당 조합원을 투표 완료 상태로 변경
  const memberIndex = mockVoteMembers.findIndex((m) => m.id === data.member_id);
  if (memberIndex !== -1) {
    mockVoteMembers[memberIndex] = {
      ...mockVoteMembers[memberIndex],
      has_voted: true,
      vote_method: 'paper',
      voted_at: new Date().toISOString(),
    };
  }

  // Mock 투표 내역 추가
  const member = mockVoteMembers[memberIndex];
  const newRecordId = Math.max(...mockVoteRecords.map((r) => r.id), 0) + 1;
  const agendas = mockAgendas.filter((a) => a.meeting_id === meetingId);

  const newRecord: VoteRecord = {
    id: newRecordId,
    member_id: data.member_id,
    member_no: member?.member_no || '',
    member_name: member?.name || '',
    phone: member?.phone || '',
    birth_date: member?.birth_date || '',
    dong: member?.dong,
    ho: member?.ho,
    pre_voted: false,
    vote_method: 'paper',
    voted_at: data.paper_vote_date || new Date().toISOString(),
    votes: data.votes.map((v) => {
      const agenda = agendas.find((a) => a.id === v.agenda_id);
      return {
        agenda_id: v.agenda_id,
        agenda_title: agenda?.title || '',
        choice: v.choice,
      };
    }),
  };

  mockVoteRecords.push(newRecord);
  return { id: newRecordId };
}

/**
 * 서면투표 수정
 */
export async function updatePaperVote(
  projectId: number,
  meetingId: number,
  memberId: number,
  data: PaperVoteRequest
): Promise<void> {
  await delay();
  void projectId;

  // Mock: 해당 조합원의 투표 내역 수정
  const recordIndex = mockVoteRecords.findIndex((r) => r.member_id === memberId);
  if (recordIndex !== -1) {
    const agendas = mockAgendas.filter((a) => a.meeting_id === meetingId);
    mockVoteRecords[recordIndex] = {
      ...mockVoteRecords[recordIndex],
      voted_at: data.paper_vote_date || mockVoteRecords[recordIndex].voted_at,
      votes: data.votes.map((v) => {
        const agenda = agendas.find((a) => a.id === v.agenda_id);
        return {
          agenda_id: v.agenda_id,
          agenda_title: agenda?.title || '',
          choice: v.choice,
        };
      }),
    };
  }
}

// =============================================================================
// 6. 동 목록 조회
// =============================================================================

/**
 * 동 목록 조회 (조합원 명부 기준)
 */
export async function getVoteDongs(
  projectId: number,
  meetingId: number
): Promise<string[]> {
  await delay();
  void projectId;

  const members = mockVoteMembers.filter((m) => m.meeting_id === meetingId);
  const dongs = members.map((m) => m.dong).filter((d): d is string => !!d);
  return [...new Set(dongs)].sort();
}
