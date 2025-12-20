/**
 * 전자투표 관련 타입 정의
 * 화면 ID: CP-SA-09-001 ~ CP-SA-09-006, CP-SA-10-003
 *
 * DB 테이블: conference, conference_voter, conference_agenda, conference_agenda_vote
 */

// =============================================================================
// 공통 타입
// =============================================================================

/** 투표 유형 (찬반형/선택형) */
export type AgendaVoteType = 'approval' | 'selection';

/** 투표 선택 */
export type VoteChoice = 'agree' | 'disagree' | 'abstain';

/** 투표 방식 */
export type VoteMethod = 'electronic' | 'paper';

/** 사전투표 의향 */
export type PreVoteIntention = 'planned' | 'undecided' | 'impossible' | 'other';

/** 현장 참석 유형 */
export type AttendanceType = 'self' | 'proxy';

/** 안건 결과 */
export type AgendaResultType = 'passed' | 'rejected' | string;

// =============================================================================
// 총회 (Conference) - CP-SA-09-001, CP-SA-10-003
// DB 테이블: conference
// =============================================================================

/** 총회 (conference 테이블 매핑) */
export interface Conference {
  id: number;
  project_id: number;
  name: string;                        // 총회명
  retry_vote: number;                  // 재투표 가능회수
  is_online_only: boolean;             // 전자투표만 진행 여부
  conference_quorum_rate: number;      // 성원정족수 (%)
  conference_date: string;             // 총회날짜 (YYYY-MM-DD)
  vote_start_date: string;             // 투표 시작일시
  vote_end_date: string;               // 투표 종료일시
  member_base_date?: string;           // 조합원 기준날짜
  uuid: string;                        // 전자투표 URL용 UUID
  created_at: string;
  updated_at: string;
  // 조회시 추가되는 필드
  voter_count?: number;                // 조합원 수
  agenda_count?: number;               // 안건 수
  voted_count?: number;                // 투표자 수
  quorum_count?: number;               // 성원수 (조합원수 * 성원정족수% 올림)
  agendas?: ConferenceAgenda[];        // 안건 목록
}

/** 총회 등록 요청 */
export interface ConferenceRequest {
  name: string;
  conference_date: string;
  vote_start_date: string;
  vote_end_date: string;
  conference_quorum_rate: number;
  retry_vote?: number;
  is_online_only?: boolean;
  member_base_date?: string;
  agendas?: ConferenceAgendaRequest[];
}

/** 총회 목록 조회 파라미터 */
export interface ConferenceListParams {
  keyword?: string;
  offset?: number;
  limit?: number;
  page?: number;
}

// 기존 Meeting 타입 별칭 (하위 호환성)
export type Meeting = Conference;
export type MeetingRequest = ConferenceRequest;
export type MeetingListParams = ConferenceListParams;
export type MeetingStatus = 'draft' | 'active' | 'closed' | 'completed';

// =============================================================================
// 조합원/투표자 (ConferenceVoter) - CP-SA-09-002
// DB 테이블: conference_voter
// =============================================================================

/** 투표자 (conference_voter 테이블 매핑) */
export interface ConferenceVoter {
  id: number;
  conference_id: number;
  voter_id: number;                    // 고유ID (가입번호)
  dong?: number;
  ho?: number;
  type?: string;                       // 타입
  name: string;
  birthday: string;                    // 생년월일 (YYYY-MM-DD)
  phone: string;                       // 연락처
  prevote_intention?: PreVoteIntention; // 사전투표 의향
  vote_date?: string;                  // 투표 날짜
  vote_count: number;                  // 투표 회수 (재투표 감지용)
  is_vote_online?: boolean;            // 전자투표 여부
  vote_document?: string;              // 투표 첨부파일 (JSON)
  vote_ip?: string;
}

/** 투표자 등록 요청 */
export interface ConferenceVoterRequest {
  voter_id?: number;
  dong?: number;
  ho?: number;
  type?: string;
  name: string;
  birthday: string;
  phone: string;
  prevote_intention?: PreVoteIntention;
}

/** 투표자 목록 조회 파라미터 */
export interface ConferenceVoterListParams {
  keyword?: string;
  dong?: number;
  has_voted?: boolean;
  offset?: number;
  limit?: number;
}

// 기존 VoteMember 타입 별칭 (하위 호환성)
export type VoteMember = ConferenceVoter;
export type VoteMemberRequest = ConferenceVoterRequest;
export type VoteMemberListParams = ConferenceVoterListParams;

// =============================================================================
// 안건 (ConferenceAgenda) - CP-SA-09-003
// DB 테이블: conference_agenda
// =============================================================================

/** 안건 (conference_agenda 테이블 매핑) */
export interface ConferenceAgenda {
  id: number;
  conference_id: number;
  name: string;                        // 안건 내용
  quorum_rate: number;                 // 가결정족수 (%)
  is_yes_or_no: boolean;               // 찬반투표 여부
  answers: string[];                   // 선택지 (찬반투표가 아닌 경우)
}

/** 안건 등록 요청 */
export interface ConferenceAgendaRequest {
  name: string;
  quorum_rate: number;
  is_yes_or_no: boolean;
  answers?: string[];
}

// 기존 Agenda 타입 별칭 (하위 호환성)
export type Agenda = ConferenceAgenda;
export type AgendaRequest = ConferenceAgendaRequest;

// =============================================================================
// 투표 내역 (ConferenceAgendaVote) - CP-SA-09-004
// DB 테이블: conference_agenda_vote
// =============================================================================

/** 안건별 투표 (conference_agenda_vote 테이블 매핑) */
export interface ConferenceAgendaVote {
  id: number;
  conference_agenda_id: number;
  conference_voter_id: number;
  answer: string;                      // 의사표시
}

/** 안건별 투표 선택 */
export interface AgendaVote {
  agenda_id: number;
  answer: string;
}

/** 투표 내역 조회용 (voter 정보 포함) */
export interface VoteRecord {
  id: number;
  member_id: number;
  member_no: number;
  dong?: string;
  ho?: string;
  unit_type?: string;
  member_name: string;
  birth_date: string;
  phone: string;
  pre_voted: boolean;
  attendance_type?: string;
  vote_method?: 'electronic' | 'paper' | null;
  vote_date?: string;
  vote_document?: Record<string, unknown> | null;
  votes?: AgendaVote[];
}

/** 투표 내역 조회 파라미터 */
export interface VoteRecordListParams {
  keyword?: string;
  dong?: number;
  is_vote_online?: boolean;
  offset?: number;
  limit?: number;
}

// =============================================================================
// 서면투표 등록 - CP-SA-09-005
// =============================================================================

/** 서면투표 등록 요청 */
export interface PaperVoteRequest {
  conference_voter_id: number;
  vote_date: string;
  votes: {
    conference_agenda_id: number;
    answer: string;
  }[];
  vote_document?: string;              // 첨부파일 JSON
}

// =============================================================================
// 통계 및 집계
// =============================================================================

/** 총회 통계 */
export interface ConferenceStats {
  voter_count: number;
  voted_count: number;
  online_count: number;
  offline_count: number;
  vote_rate: number;
  base_date?: string;
}

// 기존 타입 별칭 (하위 호환성)
export type MeetingStats = ConferenceStats;
