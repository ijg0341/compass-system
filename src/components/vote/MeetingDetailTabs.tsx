/**
 * 총회 상세 탭 컴포넌트
 * 조합원 명부, 안건 현황, 투표 내역 탭을 포함
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import {
  People as PeopleIcon,
  ListAlt as ListIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import MemberRoster from './MemberRoster';
import AgendaStatus from './AgendaStatus';
import VoteHistory from './VoteHistory';
import type { Meeting } from '@/src/types/vote.types';

interface MeetingDetailTabsProps {
  meeting: Meeting;
  projectId: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 탭 인덱스 매핑
const tabMapping: Record<string, number> = {
  roster: 0,
  agenda: 1,
  history: 2,
};

const reverseTabMapping: Record<number, string> = {
  0: 'roster',
  1: 'agenda',
  2: 'history',
};

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ pt: 2 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function MeetingDetailTabs({ meeting, projectId }: MeetingDetailTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // URL 파라미터에서 초기 탭 설정
  const getInitialTab = () => {
    if (tabParam && tabMapping[tabParam] !== undefined) {
      return tabMapping[tabParam];
    }
    return 0;
  };

  const [tabValue, setTabValue] = useState(getInitialTab);

  // URL 파라미터 변경 시 탭 업데이트
  useEffect(() => {
    if (tabParam && tabMapping[tabParam] !== undefined) {
      setTabValue(tabMapping[tabParam]);
    }
  }, [tabParam]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // URL 파라미터 업데이트
    setSearchParams({ tab: reverseTabMapping[newValue] });
  };

  return (
    <Box>
      <Paper
        sx={{
          background: 'rgba(26, 26, 26, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiTab-root': {
              minHeight: 56,
            },
          }}
        >
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="조합원 명부"
          />
          <Tab
            icon={<ListIcon />}
            iconPosition="start"
            label="안건 현황"
          />
          <Tab
            icon={<VoteIcon />}
            iconPosition="start"
            label="투표 내역"
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <MemberRoster projectId={projectId} meetingId={meeting.id} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AgendaStatus
          projectId={projectId}
          meetingId={meeting.id}
          meetingDate={meeting.meeting_date}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <VoteHistory projectId={projectId} meetingId={meeting.id} />
      </TabPanel>
    </Box>
  );
}
