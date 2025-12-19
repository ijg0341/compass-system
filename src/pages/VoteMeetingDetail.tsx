/**
 * 전자투표 - 총회 상세 페이지
 * 화면 ID: CP-SA-09-001 ~ CP-SA-09-005
 */
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { MeetingDetailTabs } from '@/src/components/vote';
import { useMeeting } from '@/src/hooks/useVote';
import type { MeetingStatus } from '@/src/types/vote.types';

// 현재 프로젝트 ID
const PROJECT_ID = 1;

// 상태별 칩 스타일
const statusConfig: Record<
  MeetingStatus,
  { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }
> = {
  draft: { label: '준비중', color: 'default' },
  active: { label: '투표중', color: 'primary' },
  closed: { label: '마감', color: 'warning' },
  completed: { label: '완료', color: 'success' },
};

export default function VoteMeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meetingId = Number(id);

  const { data: meeting, isLoading, error } = useMeeting(PROJECT_ID, meetingId);

  // 투표율 계산
  const calcVoteRate = (voted: number, total: number) => {
    if (total === 0) return '0.00';
    return ((voted / total) * 100).toFixed(2);
  };

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
        >
          목록으로
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            {meeting.title}
          </Typography>
          <Chip
            label={statusConfig[meeting.status].label}
            color={statusConfig[meeting.status].color}
          />
        </Box>

        {meeting.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {meeting.description}
          </Typography>
        )}
      </Box>

      {/* 기본 정보 카드 */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'rgba(26, 26, 26, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              총회일
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {meeting.meeting_date}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              투표기간
            </Typography>
            <Typography variant="body1">
              {meeting.vote_start_date.slice(0, 10)} ~ {meeting.vote_end_date.slice(0, 10)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              투표현황
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {meeting.voted_count.toLocaleString()} / {meeting.total_members.toLocaleString()}명
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              투표율
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary">
              {calcVoteRate(meeting.voted_count, meeting.total_members)}%
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 탭 영역 */}
      <MeetingDetailTabs meeting={meeting} projectId={PROJECT_ID} />
    </Box>
  );
}
