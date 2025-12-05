
import { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material';
import dayjs from 'dayjs';
import type { AdminMoveReservation, ElevatorLine } from '@/src/types/reservation';
import { getMoveStatusLabel, getMoveTypeLabel } from '@/src/lib/mockData/reservationData';

interface ReservationTableProps {
  data: AdminMoveReservation[];
  onRowClick: (reservation: AdminMoveReservation) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

type SortField = 'id' | 'ownerName' | 'building' | 'date' | 'moveType' | 'status';
type SortOrder = 'asc' | 'desc';

const ELEVATOR_LINE_COLORS: Record<ElevatorLine, string> = {
  A: '#E63C2E', // 빨강
  B: '#2196F3', // 파랑
  C: '#4CAF50', // 초록
  D: '#FF9800', // 주황
};

export default function ReservationTable({
  data,
  onRowClick,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ReservationTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'ownerName':
        comparison = a.ownerName.localeCompare(b.ownerName);
        break;
      case 'building':
        comparison = a.building.localeCompare(b.building) || a.unit.localeCompare(b.unit);
        break;
      case 'date':
        comparison = a.date.localeCompare(b.date);
        break;
      case 'moveType':
        comparison = a.moveType.localeCompare(b.moveType);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
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
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'id'}
                  direction={sortField === 'id' ? sortOrder : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  예약번호
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'ownerName'}
                  direction={sortField === 'ownerName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('ownerName')}
                >
                  예약자명
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>연락처</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'building'}
                  direction={sortField === 'building' ? sortOrder : 'asc'}
                  onClick={() => handleSort('building')}
                >
                  동/호수
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>승강기라인</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortField === 'date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  이사일
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>시간대</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'moveType'}
                  direction={sortField === 'moveType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('moveType')}
                >
                  이사유형
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1 }}>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortField === 'status' ? sortOrder : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  상태
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((reservation) => (
              <TableRow
                key={reservation.id}
                hover
                onClick={() => onRowClick(reservation)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <TableCell sx={{ py: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {reservation.id}
                </TableCell>
                <TableCell sx={{ py: 1 }}>{reservation.ownerName}</TableCell>
                <TableCell sx={{ py: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {reservation.phone}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {reservation.building} {reservation.unit}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={reservation.elevatorLine}
                    size="small"
                    sx={{
                      backgroundColor: ELEVATOR_LINE_COLORS[reservation.elevatorLine],
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 36,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {dayjs(reservation.date).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell sx={{ py: 1 }}>{reservation.timeSlot}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={getMoveTypeLabel(reservation.moveType)}
                    size="small"
                    variant="outlined"
                    color={reservation.moveType === 'move_in' ? 'info' : 'warning'}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={getMoveStatusLabel(reservation.status)}
                    size="small"
                    sx={{
                      backgroundColor:
                        reservation.status === 'active' ? '#4CAF50' : '#F44336',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="페이지당 행수:"
        labelDisplayedRows={({ from, to, count }) =>
          `${count}개 중 ${from}-${to}`
        }
      />
    </Paper>
  );
}
