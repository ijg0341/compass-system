/**
 * 전자투표 - 총회 목록 페이지
 * 화면 ID: CP-SA-09-001
 */
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { MeetingTable, MeetingFilters, type MeetingFilter } from '@/src/components/vote';
import { useMeetings } from '@/src/hooks/useVote';
import type { Meeting } from '@/src/types/vote.types';

// 현재 프로젝트 ID
const PROJECT_ID = 1;

export default function VoteMeetingListPage() {
  const navigate = useNavigate();

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 필터
  const [filters, setFilters] = useState<MeetingFilter>({});

  // API 훅
  const { data: meetingsData, isLoading, error } = useMeetings(PROJECT_ID, {
    ...filters,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });

  const meetings = useMemo(() => meetingsData?.list || [], [meetingsData]);
  const total = meetingsData?.total || 0;

  // 명부 (조합원 명부 페이지로 이동)
  const handleRoster = useCallback(
    (meeting: Meeting) => {
      navigate(`/vote/meetings/${meeting.id}?tab=roster`);
    },
    [navigate]
  );

  // 안건 현황 페이지로 이동
  const handleAgendaStatus = useCallback(
    (meeting: Meeting) => {
      navigate(`/vote/meetings/${meeting.id}?tab=agenda`);
    },
    [navigate]
  );

  // 투표내역 페이지로 이동
  const handleVoteHistory = useCallback(
    (meeting: Meeting) => {
      navigate(`/vote/meetings/${meeting.id}?tab=history`);
    },
    [navigate]
  );

  // 필터 변경
  const handleFiltersChange = useCallback((newFilters: MeetingFilter) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  return (
    <>
      <Box>
        {/* 페이지 헤더 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              전자투표 관리
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              총 {total}건
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/smartnet/vote/create')}
          >
            전자투표 생성
          </Button>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 필터 */}
        <MeetingFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 로딩 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <MeetingTable
            data={meetings}
            page={page}
            rowsPerPage={rowsPerPage}
            total={total}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onRoster={handleRoster}
            onAgendaStatus={handleAgendaStatus}
            onVoteHistory={handleVoteHistory}
          />
        )}
      </Box>
    </>
  );
}
