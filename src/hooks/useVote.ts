/**
 * 전자투표 관련 React Query hooks
 * API 문서 기준: 2025-12-24
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
  meetings: (projectUuid: string, params?: MeetingListParams) =>
    [...voteKeys.all, 'meetings', projectUuid, params] as const,
  meeting: (projectUuid: string, id: number) =>
    [...voteKeys.all, 'meeting', projectUuid, id] as const,
  meetingStats: (projectUuid: string, meetingId: number) =>
    [...voteKeys.all, 'meetingStats', projectUuid, meetingId] as const,

  // 조합원
  members: (projectUuid: string, meetingId: number, params?: VoteMemberListParams) =>
    [...voteKeys.all, 'members', projectUuid, meetingId, params] as const,

  // 안건
  agendas: (projectUuid: string, meetingId: number) =>
    [...voteKeys.all, 'agendas', projectUuid, meetingId] as const,
  agendaStatus: (projectUuid: string, meetingId: number) =>
    [...voteKeys.all, 'agendaStatus', projectUuid, meetingId] as const,

  // 투표 내역
  voteRecords: (projectUuid: string, meetingId: number, params?: VoteRecordListParams) =>
    [...voteKeys.all, 'voteRecords', projectUuid, meetingId, params] as const,
  voteRecord: (projectUuid: string, meetingId: number, recordId: number) =>
    [...voteKeys.all, 'voteRecord', projectUuid, meetingId, recordId] as const,

  // 동 목록
  dongs: (projectUuid: string, meetingId: number) =>
    [...voteKeys.all, 'dongs', projectUuid, meetingId] as const,
};

// =============================================================================
// 1. 총회 (Meeting) Hooks
// =============================================================================

/**
 * 총회 목록 조회
 */
export function useMeetings(projectUuid: string, params?: MeetingListParams) {
  return useQuery({
    queryKey: voteKeys.meetings(projectUuid, params),
    queryFn: () => getMeetings(projectUuid, params),
    enabled: !!projectUuid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 총회 상세 조회
 */
export function useMeeting(projectUuid: string, id: number) {
  return useQuery({
    queryKey: voteKeys.meeting(projectUuid, id),
    queryFn: () => getMeeting(projectUuid, id),
    enabled: !!projectUuid && !!id,
  });
}

/**
 * 총회 통계 조회
 */
export function useMeetingStats(projectUuid: string, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.meetingStats(projectUuid, meetingId),
    queryFn: () => getMeetingStats(projectUuid, meetingId),
    enabled: !!projectUuid && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 총회 등록
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectUuid, data }: { projectUuid: string; data: MeetingRequest }) =>
      createMeeting(projectUuid, data),
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
      projectUuid,
      id,
      data,
    }: {
      projectUuid: string;
      id: number;
      data: Partial<MeetingRequest>;
    }) => updateMeeting(projectUuid, id, data),
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
    mutationFn: ({ projectUuid, id }: { projectUuid: string; id: number }) =>
      deleteMeeting(projectUuid, id),
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
      projectUuid,
      id,
      status,
    }: {
      projectUuid: string;
      id: number;
      status: 'active' | 'closed' | 'completed';
    }) => updateMeetingStatus(projectUuid, id, status),
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
  projectUuid: string,
  meetingId: number,
  params?: VoteMemberListParams
) {
  return useQuery({
    queryKey: voteKeys.members(projectUuid, meetingId, params),
    queryFn: () => getVoteMembers(projectUuid, meetingId, params),
    enabled: !!projectUuid && !!meetingId,
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
      projectUuid,
      meetingId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      data: VoteMemberRequest;
    }) => createVoteMember(projectUuid, meetingId, data),
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
      projectUuid,
      meetingId,
      memberId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      memberId: number;
      data: VoteMemberRequest;
    }) => updateVoteMember(projectUuid, meetingId, memberId, data),
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
      projectUuid,
      meetingId,
      memberId,
    }: {
      projectUuid: string;
      meetingId: number;
      memberId: number;
    }) => deleteVoteMember(projectUuid, meetingId, memberId),
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
      projectUuid,
      meetingId,
      file,
    }: {
      projectUuid: string;
      meetingId: number;
      file: File;
    }) => importVoteMembers(projectUuid, meetingId, file),
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
    mutationFn: ({ projectUuid, meetingId }: { projectUuid: string; meetingId: number }) =>
      exportVoteMembers(projectUuid, meetingId),
  });
}

// =============================================================================
// 3. 안건 (Agenda) Hooks
// =============================================================================

/**
 * 안건 목록 조회
 */
export function useAgendas(projectUuid: string, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.agendas(projectUuid, meetingId),
    queryFn: () => getAgendas(projectUuid, meetingId),
    enabled: !!projectUuid && !!meetingId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 안건 현황 조회 (투표 집계 포함)
 */
export function useAgendaStatus(projectUuid: string, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.agendaStatus(projectUuid, meetingId),
    queryFn: () => getAgendaStatus(projectUuid, meetingId),
    enabled: !!projectUuid && !!meetingId,
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
      projectUuid,
      meetingId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      data: AgendaRequest;
    }) => createAgenda(projectUuid, meetingId, data),
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
      projectUuid,
      meetingId,
      agendaId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      agendaId: number;
      data: Partial<AgendaRequest>;
    }) => updateAgenda(projectUuid, meetingId, agendaId, data),
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
      projectUuid,
      meetingId,
      agendaId,
    }: {
      projectUuid: string;
      meetingId: number;
      agendaId: number;
    }) => deleteAgenda(projectUuid, meetingId, agendaId),
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
  projectUuid: string,
  meetingId: number,
  params?: VoteRecordListParams
) {
  return useQuery({
    queryKey: voteKeys.voteRecords(projectUuid, meetingId, params),
    queryFn: () => getVoteRecords(projectUuid, meetingId, params),
    enabled: !!projectUuid && !!meetingId,
    staleTime: 1000 * 60 * 1, // 1분
  });
}

/**
 * 투표 내역 상세 조회
 */
export function useVoteRecord(projectUuid: string, meetingId: number, recordId: number) {
  return useQuery({
    queryKey: voteKeys.voteRecord(projectUuid, meetingId, recordId),
    queryFn: () => getVoteRecord(projectUuid, meetingId, recordId),
    enabled: !!projectUuid && !!meetingId && !!recordId,
  });
}

/**
 * 투표 내역 엑셀 다운로드
 */
export function useExportVoteRecords() {
  return useMutation({
    mutationFn: ({ projectUuid, meetingId }: { projectUuid: string; meetingId: number }) =>
      exportVoteRecords(projectUuid, meetingId),
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
      projectUuid,
      meetingId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      data: PaperVoteRequest;
    }) => registerPaperVote(projectUuid, meetingId, data),
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
      projectUuid,
      meetingId,
      memberId,
      data,
    }: {
      projectUuid: string;
      meetingId: number;
      memberId: number;
      data: PaperVoteRequest;
    }) => updatePaperVote(projectUuid, meetingId, memberId, data),
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
export function useVoteDongs(projectUuid: string, meetingId: number) {
  return useQuery({
    queryKey: voteKeys.dongs(projectUuid, meetingId),
    queryFn: () => getVoteDongs(projectUuid, meetingId),
    enabled: !!projectUuid && !!meetingId,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
