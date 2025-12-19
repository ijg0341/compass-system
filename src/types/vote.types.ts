/**
 * 전자투표 관련 타입 정의
 * 화면 ID: CP-SA-09-001 ~ CP-SA-09-006, CP-SA-10-003
 */

// =============================================================================
// 공통 타입
// =============================================================================

/** 총회 상태 */
export type MeetingStatus = 'draft' | 'active' | 'closed' | 'completed';

/** 투표 유형 (찬반형/선택형) */
export type AgendaVoteType = 'approval' | 'selection';

/** 투표 선택 */
export type VoteChoice = 'agree' | 'disagree' | 'abstain';

/** 투표 방식 */
export type VoteMethod = 'electronic' | 'paper';

/** 거주 유형 */
export type ResidenceType = 'owner' | 'tenant' | 'monthly';

/** 사전투표 의향 */
export type PreVoteIntention = 'planned' | 'undecided' | 'impossible' | 'other';

/** 현장 참석 유형 */
export type AttendanceType = 'self' | 'proxy';

/** 안건 결과 */
export type AgendaResultType = 'passed' | 'rejected' | string;

// =============================================================================
// 총회 (Meeting) - CP-SA-09-001
// =============================================================================

/** 총회 */
export interface Meeting {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  meeting_date: string;
  vote_start_date: string;
  vote_end_date: string;
  status: MeetingStatus;
  total_members: number;
  quorum_count: number;
  quorum_percentage?: number;
  voted_count: number;
  agenda_count: number;
  vote_type: 'electronic_only' | 'electronic_paper';
  member_base_date?: string;
  pass_threshold_percentage?: number;
  max_revote_count: number;
  uuid: string;
  created_at: string;
  updated_at: string;
}

/** 총회 등록 요청 */
export interface MeetingRequest {
  title: string;
  description?: string;
  meeting_date: string;
  vote_start_date: string;
  vote_end_date: string;
  vote_type: 'electronic_only' | 'electronic_paper';
  member_base_date?: string;
  quorum_percentage: number;
  pass_threshold_percentage: number;
  max_revote_count: number;
  agendas: AgendaRequest[];
}

/** 총회 목록 조회 파라미터 */
export interface MeetingListParams {
  searchKeyword?: string;
  status?: MeetingStatus;
  offset?: number;
  limit?: number;
}

// =============================================================================
// 조합원 명부 (Member) - CP-SA-09-002
// =============================================================================

/** 조합원 */
export interface VoteMember {
  id: number;
  meeting_id: number;
  member_no: string;
  name: string;
  phone: string;
  birth_date: string;
  dong?: string;
  ho?: string;
  unit_type?: string;
  pre_vote_intention: PreVoteIntention;
  revote_count: number;
  has_voted: boolean;
  pre_voted: boolean;
  attendance_type?: AttendanceType;
  vote_method?: VoteMethod;
  voted_at?: string;
}

/** 조합원 등록 요청 */
export interface VoteMemberRequest {
  member_no?: string;
  name: string;
  phone: string;
  birth_date: string;
  dong?: string;
  ho?: string;
  unit_type?: string;
  pre_vote_intention: PreVoteIntention;
  revote_count?: number;
}

/** 조합원 목록 조회 파라미터 */
export interface VoteMemberListParams {
  searchKeyword?: string;
  dong?: string;
  has_voted?: boolean;
  pre_vote_intention?: PreVoteIntention;
  offset?: number;
  limit?: number;
}

// =============================================================================
// 안건 (Agenda) - CP-SA-09-003
// =============================================================================

/** 안건 선택지 (선택형일 때) */
export interface AgendaOption {
  id: number;
  label: string;
  vote_count?: number;
  electronic_count?: number;
  paper_count?: number;
}

/** 안건 결과 (전자/서면 분리) */
export interface AgendaVoteResult {
  agree: number;
  disagree: number;
  abstain: number;
  option_votes?: Record<number, number>;
}

/** 안건 */
export interface Agenda {
  id: number;
  meeting_id: number;
  order: number;
  title: string;
  description?: string;
  vote_type: AgendaVoteType;
  pass_threshold_percentage?: number;
  options?: AgendaOption[];
  electronic_result?: AgendaVoteResult;
  paper_result?: AgendaVoteResult;
  attendance_count?: number;
  final_result?: AgendaResultType;
  total_votes?: number;
}

/** 안건 등록 요청 */
export interface AgendaRequest {
  order?: number;
  title: string;
  description?: string;
  vote_type: AgendaVoteType;
  pass_threshold_percentage?: number;
  options?: string;
}

// =============================================================================
// 투표 내역 (Vote Record) - CP-SA-09-004
// =============================================================================

/** 개별 안건 투표 */
export interface AgendaVote {
  agenda_id: number;
  agenda_title: string;
  choice: VoteChoice | number;
  choice_label?: string;
}

/** 투표 내역 */
export interface VoteRecord {
  id: number;
  member_id: number;
  member_no: string;
  member_name: string;
  phone: string;
  birth_date: string;
  dong?: string;
  ho?: string;
  unit_type?: string;
  pre_voted: boolean;
  attendance_type?: AttendanceType;
  vote_method?: VoteMethod;
  voted_at?: string;
  votes?: AgendaVote[];
  signature_url?: string;
}

/** 투표 내역 조회 파라미터 */
export interface VoteRecordListParams {
  searchKeyword?: string;
  dong?: string;
  vote_method?: VoteMethod;
  has_voted?: boolean;
  offset?: number;
  limit?: number;
}

// =============================================================================
// 서면투표 등록 - CP-SA-09-005
// =============================================================================

/** 서면투표 등록 요청 */
export interface PaperVoteRequest {
  member_id: number;
  paper_vote_date: string;
  votes: {
    agenda_id: number;
    choice: VoteChoice | number;
  }[];
  attachment_files?: File[];
}

// =============================================================================
// 스마트넷 전자투표 생성 - CP-SA-10-003
// =============================================================================

/** 전자투표 설정 (스마트넷) */
export interface VoteSettings {
  title: string;
  description?: string;
  meeting_date: string;
  vote_start_date: string;
  vote_end_date: string;
  vote_type: 'electronic_only' | 'electronic_paper';
  member_base_date?: string;
  quorum_percentage: number;
  pass_threshold_percentage: number;
  max_revote_count: number;
  agendas: AgendaRequest[];
}

// =============================================================================
// 통계 및 집계
// =============================================================================

/** 총회 통계 */
export interface MeetingStats {
  total_members: number;
  voted_count: number;
  electronic_count: number;
  paper_count: number;
  vote_rate: number;
  quorum_count: number;
  base_date: string;
}

/** 일일 보고 */
export interface DailyReport {
  date: string;
  electronic_votes: number;
  paper_votes: number;
  total_votes: number;
  cumulative_votes: number;
}
