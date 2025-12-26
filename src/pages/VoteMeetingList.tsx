/**
 * 전자투표 - 총회 목록 페이지
 * 화면 ID: CP-SA-09-001
 */
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { MeetingTable } from '@/src/components/vote';
import { useMeetings } from '@/src/hooks/useVote';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { Meeting } from '@/src/types/vote.types';

export default function VoteMeetingListPage() {
  const navigate = useNavigate();
  const { projectUuid } = useCurrentProject();

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API 훅
  const { data: meetingsData, isLoading, error } = useMeetings(projectUuid, {
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
              총회 목록
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              총 {total}건
            </Typography>
          </Box>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

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
