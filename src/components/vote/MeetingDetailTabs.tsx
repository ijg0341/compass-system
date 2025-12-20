/**
 * 총회 상세 탭 콘텐츠 컴포넌트
 * 조합원 명부, 안건 현황, 투표 내역 콘텐츠를 렌더링
 */
import { Box } from '@mui/material';
import MemberRoster from './MemberRoster';
import AgendaStatus from './AgendaStatus';
import VoteHistory from './VoteHistory';
import type { Meeting } from '@/src/types/vote.types';

type TabType = 'roster' | 'agenda' | 'history';

interface MeetingDetailTabsProps {
  meeting: Meeting;
  projectId: number;
  currentTab: TabType;
}

export default function MeetingDetailTabs({ meeting, projectId, currentTab }: MeetingDetailTabsProps) {
  return (
    <Box>
      {currentTab === 'roster' && (
        <MemberRoster projectId={projectId} meetingId={meeting.id} />
      )}

      {currentTab === 'agenda' && (
        <AgendaStatus
          projectId={projectId}
          meetingId={meeting.id}
          meetingDate={meeting.meeting_date}
        />
      )}

      {currentTab === 'history' && (
        <VoteHistory projectId={projectId} meetingId={meeting.id} />
      )}
    </Box>
  );
}
