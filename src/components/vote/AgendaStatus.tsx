/**
 * 안건 현황 컴포넌트
 * 화면 ID: CP-SA-09-003
 */
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useAgendaStatus, useMeetingStats } from '@/src/hooks/useVote';
import type { AgendaWithVotes, VoteResult } from '@/src/lib/api/voteApi';

interface AgendaStatusProps {
  projectId: number;
  meetingId: number;
  meetingDate?: string;
}

// 투표 결과 포맷팅 - 서버에서 answers 키 기반으로 카운트된 결과 사용
function formatVoteResult(
  result: Record<string, number> | undefined,
  answers: string[] | undefined
): string {
  if (!result || !answers) return '-';

  return answers.map((answer) => `${answer} ${result[answer] || 0}표`).join('\n');
}

// 최종 결과 계산
function getFinalResult(agenda: AgendaWithVotes): string {
  const electronic = agenda.electronic_result || {};
  const paper = agenda.paper_result || {};
  const answers = agenda.answers || [];

  if (answers.length === 0) return '-';

  // 각 answer별 총 투표수 계산
  const totals: Record<string, number> = {};
  answers.forEach((answer) => {
    totals[answer] = (electronic[answer] || 0) + (paper[answer] || 0);
  });

  // is_yes_or_no가 true면 첫 번째(찬성) vs 두 번째(반대) 비교하여 가결/부결
  if (agenda.is_yes_or_no && answers.length >= 2) {
    const agreeCount = totals[answers[0]] || 0;
    const disagreeCount = totals[answers[1]] || 0;

    if (agreeCount > disagreeCount) return '가결';
    if (agreeCount < disagreeCount) return '부결';
    return '-';
  }

  // is_yes_or_no가 false면 최다 득표 answer 반환
  let maxAnswer = '-';
  let maxCount = 0;
  answers.forEach((answer) => {
    if (totals[answer] > maxCount) {
      maxCount = totals[answer];
      maxAnswer = answer;
    }
  });

  return maxCount > 0 ? maxAnswer : '-';
}

// 출석 조합원수 계산
function getAttendanceCount(agenda: AgendaWithVotes): number {
  return agenda.attendance_count || 0;
}

export default function AgendaStatus({ projectId, meetingId, meetingDate }: AgendaStatusProps) {
  const { data: agendaStatusData, isLoading } = useAgendaStatus(projectId, meetingId);
  const { data: stats } = useMeetingStats(projectId, meetingId);
  const agendas = agendaStatusData?.agendas;

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // 기준 날짜 계산 (오늘/총회날짜 중 과거인 날짜)
  const getBaseDate = (): string => {
    if (stats?.base_date) return stats.base_date;

    const today = new Date();
    const meeting = meetingDate ? new Date(meetingDate) : null;

    if (meeting && meeting < today) {
      return meetingDate!;
    }

    return today.toISOString().slice(0, 10);
  };

  // 다운로드 핸들러들
  const handleDailyReport = async () => {
    try {
      // TODO: API 연동
      setSnackbar({ open: true, message: '일일보고 다운로드를 시작합니다.', severity: 'info' });
    } catch {
      setSnackbar({ open: true, message: '다운로드에 실패했습니다.', severity: 'error' });
    }
  };

  const handleResultReport = async () => {
    try {
      // TODO: API 연동
      setSnackbar({ open: true, message: '결과집계표 다운로드를 시작합니다.', severity: 'info' });
    } catch {
      setSnackbar({ open: true, message: '다운로드에 실패했습니다.', severity: 'error' });
    }
  };

  const handleQuorumReport = async () => {
    try {
      // TODO: API 연동
      setSnackbar({ open: true, message: '성원집계표 다운로드를 시작합니다.', severity: 'info' });
    } catch {
      setSnackbar({ open: true, message: '다운로드에 실패했습니다.', severity: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 기준 날짜 및 다운로드 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" fontWeight={600} color="primary">
          {new Date(getBaseDate()).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          기준
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDailyReport}
          >
            일일보고 다운로드
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleResultReport}
          >
            결과집계표 다운로드
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleQuorumReport}
          >
            성원집계표 다운로드
          </Button>
        </Box>
      </Box>

      {/* 안건 테이블 */}
      <Paper
        sx={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <TableContainer>
          <Table sx={{ '& tbody tr': { minHeight: 80, height: 80 }, '& tbody td': { verticalAlign: 'top', py: 1.5 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 80 }}>구분</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150 }}>전자투표</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150 }}>서면투표</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                  출석
                  <br />
                  조합원수
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                  결과
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!agendas || agendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">등록된 안건이 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                agendas.map((agenda) => {
                  const finalResult = getFinalResult(agenda);
                  const resultColor =
                    finalResult === '가결'
                      ? 'primary.main'
                      : finalResult === '부결'
                        ? 'error.main'
                        : 'text.primary';

                  return (
                    <TableRow key={agenda.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          제{agenda.order}호
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{agenda.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                        >
                          {formatVoteResult(agenda.electronic_result, agenda.answers)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                        >
                          {formatVoteResult(agenda.paper_result, agenda.answers)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{getAttendanceCount(agenda)}명</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600} color={resultColor}>
                          {finalResult}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
