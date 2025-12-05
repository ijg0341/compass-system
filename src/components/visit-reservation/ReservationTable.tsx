
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
  Checkbox,
  Chip,
} from '@mui/material';
import type { AdminVisitReservation, VisitReservationStatus } from '@/src/types/reservation';
import { getVisitStatusLabel } from '@/src/lib/mockData/reservationData';

interface ReservationTableProps {
  data: AdminVisitReservation[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (reservation: AdminVisitReservation) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

// 향후 정렬 기능 구현시 사용 예정
// type OrderDirection = 'asc' | 'desc';
// type OrderBy = 'id' | 'name' | 'building' | 'date' | 'status' | 'createdAt';

const statusColorMap: Record<VisitReservationStatus, string> = {
  pending: '#FF9800',
  confirmed: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
};

export default function ReservationTable({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ReservationTableProps) {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(data.map((row) => row.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedIds, id];
    } else {
      newSelected = selectedIds.filter((selectedId) => selectedId !== id);
    }

    onSelectionChange(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const isSelected = (id: string) => selectedIds.indexOf(id) !== -1;

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDateTime = (date: string, time: string) => {
    return `${dayjs(date).format('YYYY-MM-DD')} ${time}`;
  };

  const formatDate = (isoString: string) => {
    return dayjs(isoString).format('YYYY-MM-DD HH:mm');
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
      <TableContainer
        sx={{
          background: 'transparent',
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < data.length
                  }
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>예약번호</TableCell>
              <TableCell>예약자명</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>동/호수</TableCell>
              <TableCell>예약일시</TableCell>
              <TableCell>방문목적</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>등록일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.id);

              return (
                <TableRow
                  key={row.id}
                  hover
                  selected={isItemSelected}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {row.id}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {row.phone}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontWeight: 500 }}>
                      {row.building} {row.unit}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatDateTime(row.date, row.time)}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {row.purpose || '-'}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Chip
                      label={getVisitStatusLabel(row.status)}
                      size="small"
                      sx={{
                        backgroundColor: statusColorMap[row.status],
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem' }}>
                      {formatDate(row.createdAt)}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="페이지당 행 수:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / 총 ${count}건`
        }
      />
    </Paper>
  );
}
