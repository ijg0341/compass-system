/**
 * 전자투표 Mock 데이터
 * 백엔드 API 구현 전 프론트엔드 개발용
 */

import type {
  Meeting,
  VoteMember,
  Agenda,
  VoteRecord,
  MeetingStats,
} from '@/src/types/vote.types';

// =============================================================================
// 총회 Mock 데이터
// =============================================================================

export const mockMeetings: Meeting[] = [
  {
    id: 1,
    project_id: 1,
    title: '2025년 제1차 정기총회',
    description: '2025년도 사업계획 및 예산안 의결',
    meeting_date: '2025-03-15',
    vote_start_date: '2025-03-01T09:00:00',
    vote_end_date: '2025-03-14T18:00:00',
    status: 'active',
    total_members: 1250,
    quorum_count: 626,
    voted_count: 892,
    agenda_count: 4,
    vote_type: 'electronic_paper',
    max_revote_count: 1,
    uuid: 'vote-uuid-001',
    created_at: '2025-02-01T10:00:00',
    updated_at: '2025-02-15T14:30:00',
  },
  {
    id: 2,
    project_id: 1,
    title: '2025년 임시총회',
    description: '관리규약 개정안 의결',
    meeting_date: '2025-04-20',
    vote_start_date: '2025-04-10T09:00:00',
    vote_end_date: '2025-04-19T18:00:00',
    status: 'draft',
    total_members: 1250,
    quorum_count: 626,
    voted_count: 0,
    agenda_count: 2,
    vote_type: 'electronic_only',
    max_revote_count: 0,
    uuid: 'vote-uuid-002',
    created_at: '2025-03-01T10:00:00',
    updated_at: '2025-03-01T10:00:00',
  },
  {
    id: 3,
    project_id: 1,
    title: '2024년 제2차 정기총회',
    description: '결산 및 감사보고',
    meeting_date: '2024-12-20',
    vote_start_date: '2024-12-10T09:00:00',
    vote_end_date: '2024-12-19T18:00:00',
    status: 'completed',
    total_members: 1200,
    quorum_count: 600,
    voted_count: 1056,
    agenda_count: 3,
    vote_type: 'electronic_paper',
    max_revote_count: 1,
    uuid: 'vote-uuid-003',
    created_at: '2024-11-01T10:00:00',
    updated_at: '2024-12-20T10:00:00',
  },
];

// =============================================================================
// 조합원 Mock 데이터
// =============================================================================

export const mockVoteMembers: VoteMember[] = [
  {
    id: 1,
    meeting_id: 1,
    member_no: 'M001',
    name: '김철수',
    phone: '010-1234-5678',
    birth_date: '1975-03-15',
    dong: '101동',
    ho: '1201호',
    unit_type: '84A',
    pre_vote_intention: 'planned',
    revote_count: 0,
    has_voted: true,
    pre_voted: true,
    vote_method: 'electronic',
    voted_at: '2025-03-05T14:30:00',
  },
  {
    id: 2,
    meeting_id: 1,
    member_no: 'M002',
    name: '이영희',
    phone: '010-2345-6789',
    birth_date: '1980-07-22',
    dong: '101동',
    ho: '1502호',
    unit_type: '59B',
    pre_vote_intention: 'planned',
    revote_count: 0,
    has_voted: true,
    pre_voted: false,
    vote_method: 'paper',
    voted_at: '2025-03-10T10:00:00',
  },
  {
    id: 3,
    meeting_id: 1,
    member_no: 'M003',
    name: '박민수',
    phone: '010-3456-7890',
    birth_date: '1985-11-08',
    dong: '102동',
    ho: '801호',
    unit_type: '84A',
    pre_vote_intention: 'undecided',
    revote_count: 0,
    has_voted: false,
    pre_voted: false,
  },
  {
    id: 4,
    meeting_id: 1,
    member_no: 'M004',
    name: '정수연',
    phone: '010-4567-8901',
    birth_date: '1990-01-25',
    dong: '102동',
    ho: '1101호',
    unit_type: '59A',
    pre_vote_intention: 'planned',
    revote_count: 0,
    has_voted: true,
    pre_voted: true,
    vote_method: 'electronic',
    voted_at: '2025-03-08T09:15:00',
  },
  {
    id: 5,
    meeting_id: 1,
    member_no: 'M005',
    name: '최동훈',
    phone: '010-5678-9012',
    birth_date: '1978-05-12',
    dong: '103동',
    ho: '501호',
    unit_type: '84B',
    pre_vote_intention: 'impossible',
    revote_count: 0,
    has_voted: false,
    pre_voted: false,
  },
];

// =============================================================================
// 안건 Mock 데이터
// =============================================================================

export const mockAgendas: Agenda[] = [
  {
    id: 1,
    meeting_id: 1,
    order: 1,
    title: '제1호 안건: 2025년도 사업계획(안) 승인의 건',
    description: '2025년도 주요 사업계획 및 추진방향에 대한 승인을 요청합니다.',
    vote_type: 'approval',
    electronic_result: {
      agree: 650,
      disagree: 80,
      abstain: 26,
    },
    paper_result: {
      agree: 106,
      disagree: 18,
      abstain: 12,
    },
    total_votes: 892,
    final_result: 'passed',
  },
  {
    id: 2,
    meeting_id: 1,
    order: 2,
    title: '제2호 안건: 2025년도 예산(안) 승인의 건',
    description: '2025년도 관리비 예산안에 대한 승인을 요청합니다.',
    vote_type: 'approval',
    electronic_result: {
      agree: 600,
      disagree: 120,
      abstain: 36,
    },
    paper_result: {
      agree: 102,
      disagree: 25,
      abstain: 9,
    },
    total_votes: 892,
    final_result: 'passed',
  },
  {
    id: 3,
    meeting_id: 1,
    order: 3,
    title: '제3호 안건: 관리업체 선정의 건',
    description: '신규 관리업체 선정에 관한 안건입니다.',
    vote_type: 'selection',
    options: [
      { id: 1, label: 'A 관리업체', vote_count: 423, electronic_count: 350, paper_count: 73 },
      { id: 2, label: 'B 관리업체', vote_count: 312, electronic_count: 260, paper_count: 52 },
      { id: 3, label: 'C 관리업체', vote_count: 157, electronic_count: 146, paper_count: 11 },
    ],
    total_votes: 892,
    final_result: 'passed',
  },
  {
    id: 4,
    meeting_id: 1,
    order: 4,
    title: '제4호 안건: 공용부분 보수공사 시행의 건',
    description: '노후화된 공용부분 보수공사 시행에 대한 승인을 요청합니다.',
    vote_type: 'approval',
    electronic_result: {
      agree: 700,
      disagree: 28,
      abstain: 28,
    },
    paper_result: {
      agree: 134,
      disagree: 4,
      abstain: -2,
    },
    total_votes: 892,
    final_result: 'passed',
  },
];

// =============================================================================
// 투표 내역 Mock 데이터
// =============================================================================

export const mockVoteRecords: VoteRecord[] = [
  {
    id: 1,
    member_id: 1,
    member_no: 'M001',
    member_name: '김철수',
    phone: '010-1234-5678',
    birth_date: '1975-03-15',
    dong: '101동',
    ho: '1201호',
    pre_voted: true,
    vote_method: 'electronic',
    voted_at: '2025-03-05T14:30:00',
    votes: [
      { agenda_id: 1, agenda_title: '제1호 안건: 2025년도 사업계획(안) 승인의 건', choice: 'agree' },
      { agenda_id: 2, agenda_title: '제2호 안건: 2025년도 예산(안) 승인의 건', choice: 'agree' },
      { agenda_id: 3, agenda_title: '제3호 안건: 관리업체 선정의 건', choice: 1, choice_label: 'A 관리업체' },
      { agenda_id: 4, agenda_title: '제4호 안건: 공용부분 보수공사 시행의 건', choice: 'agree' },
    ],
    signature_url: 'https://example.com/signatures/1.png',
  },
  {
    id: 2,
    member_id: 2,
    member_no: 'M002',
    member_name: '이영희',
    phone: '010-2345-6789',
    birth_date: '1980-07-22',
    dong: '101동',
    ho: '1502호',
    pre_voted: false,
    vote_method: 'paper',
    voted_at: '2025-03-10T10:00:00',
    votes: [
      { agenda_id: 1, agenda_title: '제1호 안건: 2025년도 사업계획(안) 승인의 건', choice: 'agree' },
      { agenda_id: 2, agenda_title: '제2호 안건: 2025년도 예산(안) 승인의 건', choice: 'disagree' },
      { agenda_id: 3, agenda_title: '제3호 안건: 관리업체 선정의 건', choice: 2, choice_label: 'B 관리업체' },
      { agenda_id: 4, agenda_title: '제4호 안건: 공용부분 보수공사 시행의 건', choice: 'agree' },
    ],
  },
  {
    id: 3,
    member_id: 4,
    member_no: 'M004',
    member_name: '정수연',
    phone: '010-4567-8901',
    birth_date: '1990-01-25',
    dong: '102동',
    ho: '1101호',
    pre_voted: true,
    vote_method: 'electronic',
    voted_at: '2025-03-08T09:15:00',
    votes: [
      { agenda_id: 1, agenda_title: '제1호 안건: 2025년도 사업계획(안) 승인의 건', choice: 'abstain' },
      { agenda_id: 2, agenda_title: '제2호 안건: 2025년도 예산(안) 승인의 건', choice: 'agree' },
      { agenda_id: 3, agenda_title: '제3호 안건: 관리업체 선정의 건', choice: 1, choice_label: 'A 관리업체' },
      { agenda_id: 4, agenda_title: '제4호 안건: 공용부분 보수공사 시행의 건', choice: 'agree' },
    ],
    signature_url: 'https://example.com/signatures/3.png',
  },
  // 투표하지 않은 조합원 - 서면투표 등록 버튼 표시용
  {
    id: 4,
    member_id: 3,
    member_no: 'M003',
    member_name: '박민수',
    phone: '010-3456-7890',
    birth_date: '1985-11-08',
    dong: '102동',
    ho: '801호',
    unit_type: '84A',
    pre_voted: false,
  },
  {
    id: 5,
    member_id: 5,
    member_no: 'M005',
    member_name: '최동훈',
    phone: '010-5678-9012',
    birth_date: '1978-05-12',
    dong: '103동',
    ho: '501호',
    unit_type: '84B',
    pre_voted: false,
  },
];

// =============================================================================
// 총회 통계 Mock 데이터
// =============================================================================

export const mockMeetingStats: MeetingStats = {
  total_members: 1250,
  voted_count: 892,
  electronic_count: 756,
  paper_count: 136,
  vote_rate: 71.36,
  quorum_count: 626,
  base_date: '2025-02-28',
};

// =============================================================================
// Mock API 헬퍼 함수
// =============================================================================

/** 지연 시뮬레이션 */
export const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/** ID로 총회 찾기 */
export const findMeetingById = (id: number): Meeting | undefined =>
  mockMeetings.find((m) => m.id === id);

/** 총회 ID로 조합원 목록 가져오기 */
export const getMembersByMeetingId = (meetingId: number): VoteMember[] =>
  mockVoteMembers.filter((m) => m.meeting_id === meetingId);

/** 총회 ID로 안건 목록 가져오기 */
export const getAgendasByMeetingId = (meetingId: number): Agenda[] =>
  mockAgendas.filter((a) => a.meeting_id === meetingId);

/** 총회 ID로 투표 내역 가져오기 */
export const getVoteRecordsByMeetingId = (meetingId: number): VoteRecord[] =>
  mockVoteRecords.filter((r) => {
    const member = mockVoteMembers.find((m) => m.id === r.member_id);
    return member?.meeting_id === meetingId;
  });

/** 동 목록 추출 */
export const getUniqueDongs = (): string[] => {
  const dongs = mockVoteMembers.map((m) => m.dong).filter((d): d is string => !!d);
  return [...new Set(dongs)].sort();
};
