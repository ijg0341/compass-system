/**
 * 총회 목록 테이블
 * 화면 ID: CP-SA-09-001
 */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import type { Meeting } from '@/src/types/vote.types';

interface MeetingTableProps {
  data: Meeting[];
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRoster: (meeting: Meeting) => void;
  onAgendaStatus: (meeting: Meeting) => void;
  onVoteHistory: (meeting: Meeting) => void;
}

export default function MeetingTable({
  data,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onRoster,
  onAgendaStatus,
  onVoteHistory,
}: MeetingTableProps) {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  return (
    <Paper
      sx={{
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>총회명</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100, whiteSpace: 'nowrap' }}>투표시작일시</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100, whiteSpace: 'nowrap' }}>투표종료일시</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100, whiteSpace: 'nowrap' }}>총회날짜</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70, whiteSpace: 'nowrap' }} align="center">조합원 수</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70, whiteSpace: 'nowrap' }} align="center">성원 수</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 70, whiteSpace: 'nowrap' }} align="center">투표자 수</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 60, whiteSpace: 'nowrap' }} align="center">안건 수</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200, whiteSpace: 'nowrap' }} align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">등록된 총회가 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((meeting) => (
                <TableRow key={meeting.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {meeting.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {meeting.vote_start_date?.slice(0, 10) || '-'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {meeting.vote_end_date?.slice(0, 10) || '-'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {meeting.conference_date}
                  </TableCell>
                  <TableCell align="center">{(meeting.voter_count || 0).toLocaleString()}</TableCell>
                  <TableCell align="center">{(meeting.quorum_count || 0).toLocaleString()}</TableCell>
                  <TableCell align="center">{(meeting.voted_count || 0).toLocaleString()}</TableCell>
                  <TableCell align="center">{meeting.agenda_count || 0}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button size="small" variant="outlined" onClick={() => onRoster(meeting)}>
                        명부
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => onAgendaStatus(meeting)}>
                        안건 현황
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => onVoteHistory(meeting)}>
                        투표내역
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="페이지당 행 수:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 총 ${count}건`}
      />
    </Paper>
  );
}
