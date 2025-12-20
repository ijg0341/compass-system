/**
 * 전자투표 - 총회 상세 페이지
 * 화면 ID: CP-SA-09-001 ~ CP-SA-09-005
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { MeetingDetailTabs } from '@/src/components/vote';
import { useMeeting } from '@/src/hooks/useVote';

// 현재 프로젝트 ID
const PROJECT_ID = 1;

// 탭 타입
type TabType = 'roster' | 'agenda' | 'history';

export default function VoteMeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const meetingId = Number(id);

  // 탭 상태
  const tabParam = searchParams.get('tab') as TabType | null;
  const [currentTab, setCurrentTab] = useState<TabType>(tabParam || 'roster');

  useEffect(() => {
    if (tabParam && ['roster', 'agenda', 'history'].includes(tabParam)) {
      setCurrentTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (_: React.MouseEvent<HTMLElement>, newTab: TabType | null) => {
    if (newTab) {
      setCurrentTab(newTab);
      setSearchParams({ tab: newTab });
    }
  };

  const { data: meeting, isLoading, error } = useMeeting(PROJECT_ID, meetingId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !meeting) {
    return (
      <Box>
        <Alert severity="error">총회 정보를 불러오는데 실패했습니다.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vote/meetings')}
          sx={{ mt: 2 }}
        >
          목록으로
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vote/meetings')}
          sx={{ mb: 2 }}
          size="small"
        >
          총회 목록
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            총회명: {meeting.title}
          </Typography>
          <ToggleButtonGroup
            value={currentTab}
            exclusive
            onChange={handleTabChange}
            size="small"
          >
            <ToggleButton value="roster" sx={{ px: 2 }}>
              조합원 명부
            </ToggleButton>
            <ToggleButton value="agenda" sx={{ px: 2 }}>
              안건 현황
            </ToggleButton>
            <ToggleButton value="history" sx={{ px: 2 }}>
              투표 내역
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* 탭 콘텐츠 */}
      <MeetingDetailTabs meeting={meeting} projectId={PROJECT_ID} currentTab={currentTab} />
    </Box>
  );
}
