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
import { useAgendas, useMeetingStats } from '@/src/hooks/useVote';
import type { Agenda, AgendaVoteResult } from '@/src/types/vote.types';

interface AgendaStatusProps {
  projectId: number;
  meetingId: number;
  meetingDate?: string;
}

// 투표 결과 포맷팅 (찬반형)
function formatApprovalResult(result: AgendaVoteResult | undefined): string {
  if (!result) return '-';
  return `찬성 ${result.agree}표\n반대 ${result.disagree}표\n기권 ${result.abstain}표`;
}

// 투표 결과 포맷팅 (선택형)
function formatSelectionResult(
  result: AgendaVoteResult | undefined,
  options: { id: number; label: string }[] | undefined
): string {
  if (!result || !options || !result.option_votes) return '-';

  return options
    .map((opt) => `${opt.label} ${result.option_votes?.[opt.id] || 0}표`)
    .concat([`기권 ${result.abstain}표`])
    .join('\n');
}

// 최종 결과 계산
function getFinalResult(agenda: Agenda): string {
  if (agenda.final_result) {
    if (agenda.final_result === 'passed') return '가결';
    if (agenda.final_result === 'rejected') return '부결';
    return agenda.final_result;
  }

  // 찬반형일 경우 찬성이 반대보다 많으면 가결
  if (agenda.vote_type === 'approval') {
    const electronic = agenda.electronic_result;
    const paper = agenda.paper_result;

    const totalAgree = (electronic?.agree || 0) + (paper?.agree || 0);
    const totalDisagree = (electronic?.disagree || 0) + (paper?.disagree || 0);

    if (totalAgree > totalDisagree) return '가결';
    if (totalAgree < totalDisagree) return '부결';
    return '-';
  }

  // 선택형일 경우 최다득표 옵션
  if (agenda.vote_type === 'selection' && agenda.options) {
    const electronic = agenda.electronic_result?.option_votes || {};
    const paper = agenda.paper_result?.option_votes || {};

    let maxVotes = 0;
    let maxLabel = '-';

    agenda.options.forEach((opt) => {
      const total = (electronic[opt.id] || 0) + (paper[opt.id] || 0);
      if (total > maxVotes) {
        maxVotes = total;
        maxLabel = opt.label;
      }
    });

    return maxLabel;
  }

  return '-';
}

// 출석 조합원수 계산
function getAttendanceCount(agenda: Agenda): number {
  const electronic = agenda.electronic_result;
  const paper = agenda.paper_result;

  const electronicTotal = electronic
    ? electronic.agree + electronic.disagree + electronic.abstain
    : 0;
  const paperTotal = paper
    ? paper.agree + paper.disagree + paper.abstain
    : 0;

  return agenda.attendance_count || electronicTotal + paperTotal;
}

export default function AgendaStatus({ projectId, meetingId, meetingDate }: AgendaStatusProps) {
  const { data: agendas, isLoading } = useAgendas(projectId, meetingId);
  const { data: stats } = useMeetingStats(projectId, meetingId);

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
                  const isApproval = agenda.vote_type === 'approval';
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
                          {isApproval
                            ? formatApprovalResult(agenda.electronic_result)
                            : formatSelectionResult(agenda.electronic_result, agenda.options)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                        >
                          {isApproval
                            ? formatApprovalResult(agenda.paper_result)
                            : formatSelectionResult(agenda.paper_result, agenda.options)}
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
