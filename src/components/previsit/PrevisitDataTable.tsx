import dayjs from 'dayjs';
import {
  Box,
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { CheckCircle as CheckIcon, History as HistoryIcon } from '@mui/icons-material';
import type { PrevisitData, ResidenceType } from '@/src/types/previsit.types';
import { RESIDENCE_TYPE_LABELS } from '@/src/types/previsit.types';

interface PrevisitDataTableProps {
  data: PrevisitData[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onReturnDevice: (id: number) => void;
  onViewHistory: (visit: PrevisitData) => void;
  isReturning?: boolean;
}

export default function PrevisitDataTable({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onReturnDevice,
  onViewHistory,
  isReturning = false,
}: PrevisitDataTableProps) {
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
              <TableCell>방문일</TableCell>
              <TableCell>시간</TableCell>
              <TableCell>동</TableCell>
              <TableCell>호</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>입주형태</TableCell>
              <TableCell>입주예정일</TableCell>
              <TableCell>방문자명</TableCell>
              <TableCell>단말기회수</TableCell>
              <TableCell>단말기번호</TableCell>
              <TableCell>동행</TableCell>
              <TableCell>예약자명</TableCell>
              <TableCell>예약일</TableCell>
              <TableCell>예약시간</TableCell>
              <TableCell>예약연락처</TableCell>
              <TableCell>예약메모</TableCell>
              <TableCell align="center">방문이력</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={18} align="center" sx={{ py: 4 }}>
                  등록된 방문 기록이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((visit) => (
                <TableRow key={visit.id} hover>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(visit.visit_date)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {typeof visit.visit_time === 'string' ? visit.visit_time.slice(0, 5) : '-'}
                    </Box>
                  </TableCell>
                  <TableCell>{visit.dong || '-'}</TableCell>
                  <TableCell>{visit.ho || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 500 }}>{visit.contractor_name || '-'}</Box>
                  </TableCell>
                  <TableCell>{visit.contractor_phone || '-'}</TableCell>
                  <TableCell>
                    {visit.residence_type
                      ? RESIDENCE_TYPE_LABELS[visit.residence_type as ResidenceType]
                      : '-'}
                  </TableCell>
                  <TableCell>{visit.move_in_date || '-'}</TableCell>
                  <TableCell>{visit.visitor_name}</TableCell>
                  <TableCell>
                    {visit.rental_device_no ? (
                      visit.rental_device_return ? (
                        <Chip label="회수완료" size="small" color="success" />
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<CheckIcon />}
                          onClick={() => onReturnDevice(visit.id)}
                          disabled={isReturning}
                        >
                          회수완료
                        </Button>
                      )
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{visit.rental_device_no || '-'}</TableCell>
                  <TableCell>{visit.companion || '-'}</TableCell>
                  <TableCell>{visit.reservation_writer_name || '-'}</TableCell>
                  <TableCell>
                    {visit.reservation_date ? formatDate(visit.reservation_date) : '-'}
                  </TableCell>
                  <TableCell>{visit.reservation_time || '-'}</TableCell>
                  <TableCell>{visit.reservation_writer_phone || '-'}</TableCell>
                  <TableCell>{visit.reservation_memo || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="방문이력 검색">
                      <IconButton size="small" onClick={() => onViewHistory(visit)}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
