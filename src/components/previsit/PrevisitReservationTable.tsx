import dayjs from 'dayjs';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Typography,
} from '@mui/material';
import type { PrevisitReservation, Previsit } from '@/src/types/previsit.types';

interface PrevisitReservationTableProps {
  data: PrevisitReservation[];
  previsits: Previsit[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onGoToRegister: (reservation: PrevisitReservation) => void;
}

export default function PrevisitReservationTable({
  data,
  previsits,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onGoToRegister,
}: PrevisitReservationTableProps) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const formatDate = (date: string | { date: string }) => {
    if (typeof date === 'object') {
      return dayjs(date.date).format('YYYY-MM-DD');
    }
    return dayjs(date).format('YYYY-MM-DD');
  };

  const getPrevisitName = (previsitId: number) => {
    return previsits.find((p) => p.id === previsitId)?.name || '-';
  };

  return (
    <Paper
      sx={{
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>행사명</TableCell>
              <TableCell>동</TableCell>
              <TableCell>호</TableCell>
              <TableCell>신청자</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>예약일</TableCell>
              <TableCell>예약시간</TableCell>
              <TableCell>메모</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  등록된 예약이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((reservation) => (
                <TableRow
                  key={reservation.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onGoToRegister(reservation)}
                >
                  <TableCell>{getPrevisitName(reservation.previsit_id)}</TableCell>
                  <TableCell>{reservation.dong || '-'}</TableCell>
                  <TableCell>{reservation.ho || '-'}</TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{reservation.writer_name}</Typography>
                  </TableCell>
                  <TableCell>{reservation.writer_phone}</TableCell>
                  <TableCell>{formatDate(reservation.reservation_date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        typeof reservation.reservation_time === 'string'
                          ? reservation.reservation_time.slice(0, 5)
                          : '-'
                      }
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {reservation.memo || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onGoToRegister(reservation)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
                    >
                      조회
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
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
