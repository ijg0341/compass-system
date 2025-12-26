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
  projectUuid: string;
  currentTab: TabType;
}

export default function MeetingDetailTabs({ meeting, projectUuid, currentTab }: MeetingDetailTabsProps) {
  return (
    <Box>
      {currentTab === 'roster' && (
        <MemberRoster projectUuid={projectUuid} meetingId={meeting.id} />
      )}

      {currentTab === 'agenda' && (
        <AgendaStatus
          projectUuid={projectUuid}
          meetingId={meeting.id}
          meetingDate={meeting.conference_date}
        />
      )}

      {currentTab === 'history' && (
        <VoteHistory projectUuid={projectUuid} meetingId={meeting.id} />
      )}
    </Box>
  );
}
