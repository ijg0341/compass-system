/**
 * 전자투표 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // 총회
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
  getMeetingStats,
  // 조합원
  getVoteMembers,
  createVoteMember,
  updateVoteMember,
  deleteVoteMember,
  importVoteMembers,
  exportVoteMembers,
  // 안건
  getAgendas,
  getAgendaStatus,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  // 투표 내역
  getVoteRecords,
  getVoteRecord,
  exportVoteRecords,
  // 서면투표
  registerPaperVote,
  updatePaperVote,
  // 동 목록
  getVoteDongs,
} from '@/src/lib/api/voteApi';
import type {
  MeetingRequest,
  MeetingListParams,
  VoteMemberRequest,
  VoteMemberListParams,
  AgendaRequest,
  VoteRecordListParams,
  PaperVoteRequest,
} from '@/src/types/vote.types';

// =============================================================================
// Query Keys
// =============================================================================

export const voteKeys = {
  all: ['vote'] as const,

  // 총회
  meetings: (projectId: number, params?: MeetingListParams) =>
    [...voteKeys.all, 'meetings', projectId, params] as const,
  meeting: (projectId: number, id: number) =>
    [...voteKeys.all, 'meeting', projectId, id] as const,
  meetingStats: (projectId: number, meetingId: number) =>
    [...voteKeys.all, 'meetingStats', projectId, meetingId] as const,

  // 조합원
  members: (projectId: number, meetingId: number, params?: VoteMemberListParams) =>
    [...voteKeys.all, 'members', projectId, meetingId, params] as const,

  // 안건
  agendas: (projectId: number, meetingId: number) =>
    [...voteKeys.all, 'agendas', projectId, meetingId] as const,
  agendaStatus: (projectId: number, meetingId: number) =>
    [...voteKeys.all, 'agendaStatus', projectId, meetingId] as const,

  // 투표 내역
  voteRecords: (projectId: number, meetingId: number, params?: VoteRecordListParams) =>
    [...voteKeys.all, 'voteRecords', projectId, meetingId, params] as const,
  voteRecord: (projectId: number, meetingId: number, recordId: number) =>
    [...voteKeys.all, 'voteRecord', projectId, meetingId, recordId] as const,

  // 동 목록
  dongs: (projectId: number, meetingId: number) =>
    [...voteKeys.all, 'dongs', projectId, meetingId] as const,
};

// =============================================================================
// 1. 총회 (Meeting) Hooks
// =============================================================================

/**
 * 총회 목록 조회
 */
export function useMeetings(projectId: number, params?: MeetingListParams) {
  return useQuery({
    queryKey: voteKeys.meetings(projectId, params),
    queryFn: () => getMeetings(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 총회 상세 조회
 */
export function useMeeting(projectId: number, id: number) {
  return useQuery({
    queryKey: voteKeys.meeting(projectId, id),
    queryFn: () => getMeeting(projectId, id),
    enabled: !!projectId && !!id,
  });
}

/**
 * 총회 통계 조회
 */
export function useMeetingStats(projectId: number, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.meetingStats(projectId, meetingId),
    queryFn: () => getMeetingStats(projectId, meetingId),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 총회 등록
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: MeetingRequest }) =>
      createMeeting(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 총회 수정
 */
export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      id,
      data,
    }: {
      projectId: number;
      id: number;
      data: Partial<MeetingRequest>;
    }) => updateMeeting(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 총회 삭제
 */
export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, id }: { projectId: number; id: number }) =>
      deleteMeeting(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 총회 상태 변경
 */
export function useUpdateMeetingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      id,
      status,
    }: {
      projectId: number;
      id: number;
      status: 'active' | 'closed' | 'completed';
    }) => updateMeetingStatus(projectId, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

// =============================================================================
// 2. 조합원 (Member) Hooks
// =============================================================================

/**
 * 조합원 목록 조회
 */
export function useVoteMembers(
  projectId: number,
  meetingId: number,
  params?: VoteMemberListParams
) {
  return useQuery({
    queryKey: voteKeys.members(projectId, meetingId, params),
    queryFn: () => getVoteMembers(projectId, meetingId, params),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 조합원 등록
 */
export function useCreateVoteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      data: VoteMemberRequest;
    }) => createVoteMember(projectId, meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 조합원 수정
 */
export function useUpdateVoteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      memberId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      memberId: number;
      data: VoteMemberRequest;
    }) => updateVoteMember(projectId, meetingId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 조합원 삭제
 */
export function useDeleteVoteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      memberId,
    }: {
      projectId: number;
      meetingId: number;
      memberId: number;
    }) => deleteVoteMember(projectId, meetingId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 조합원 일괄 등록 (엑셀)
 */
export function useImportVoteMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      file,
    }: {
      projectId: number;
      meetingId: number;
      file: File;
    }) => importVoteMembers(projectId, meetingId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 조합원 명부 엑셀 다운로드
 */
export function useExportVoteMembers() {
  return useMutation({
    mutationFn: ({ projectId, meetingId }: { projectId: number; meetingId: number }) =>
      exportVoteMembers(projectId, meetingId),
  });
}

// =============================================================================
// 3. 안건 (Agenda) Hooks
// =============================================================================

/**
 * 안건 목록 조회
 */
export function useAgendas(projectId: number, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.agendas(projectId, meetingId),
    queryFn: () => getAgendas(projectId, meetingId),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 안건 현황 조회 (투표 집계 포함)
 */
export function useAgendaStatus(projectId: number, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.agendaStatus(projectId, meetingId),
    queryFn: () => getAgendaStatus(projectId, meetingId),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 안건 등록
 */
export function useCreateAgenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      data: AgendaRequest;
    }) => createAgenda(projectId, meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 안건 수정
 */
export function useUpdateAgenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      agendaId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      agendaId: number;
      data: Partial<AgendaRequest>;
    }) => updateAgenda(projectId, meetingId, agendaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 안건 삭제
 */
export function useDeleteAgenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      agendaId,
    }: {
      projectId: number;
      meetingId: number;
      agendaId: number;
    }) => deleteAgenda(projectId, meetingId, agendaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

// =============================================================================
// 4. 투표 내역 (Vote Record) Hooks
// =============================================================================

/**
 * 투표 내역 목록 조회
 */
export function useVoteRecords(
  projectId: number,
  meetingId: number,
  params?: VoteRecordListParams
) {
  return useQuery({
    queryKey: voteKeys.voteRecords(projectId, meetingId, params),
    queryFn: () => getVoteRecords(projectId, meetingId, params),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 투표 내역 상세 조회
 */
export function useVoteRecord(projectId: number, meetingId: number, recordId: number) {
  return useQuery({
    queryKey: voteKeys.voteRecord(projectId, meetingId, recordId),
    queryFn: () => getVoteRecord(projectId, meetingId, recordId),
    enabled: !!projectId && !!meetingId && !!recordId,
  });
}

/**
 * 투표 내역 엑셀 다운로드
 */
export function useExportVoteRecords() {
  return useMutation({
    mutationFn: ({ projectId, meetingId }: { projectId: number; meetingId: number }) =>
      exportVoteRecords(projectId, meetingId),
  });
}

// =============================================================================
// 5. 서면투표 등록 Hooks
// =============================================================================

/**
 * 서면투표 등록
 */
export function useRegisterPaperVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      data: PaperVoteRequest;
    }) => registerPaperVote(projectId, meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

/**
 * 서면투표 수정
 */
export function useUpdatePaperVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      meetingId,
      memberId,
      data,
    }: {
      projectId: number;
      meetingId: number;
      memberId: number;
      data: PaperVoteRequest;
    }) => updatePaperVote(projectId, meetingId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.all });
    },
  });
}

// =============================================================================
// 6. 동 목록 Hooks
// =============================================================================

/**
 * 동 목록 조회
 */
export function useVoteDongs(projectId: number, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.dongs(projectId, meetingId),
    queryFn: () => getVoteDongs(projectId, meetingId),
    enabled: !!projectId && !!meetingId,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
