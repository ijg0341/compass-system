
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

// 간소화된 스케줄 타입 (API 응답 기반)
interface DisplaySchedule {
  id: string;
  visitDate: string;
  visitTime: string;
  building: string;
  unit: string;
  name?: string;
  phone?: string;
  status: 'empty' | 'reserved';
}

interface ScheduleTableProps {
  data: DisplaySchedule[];
  totalCount: number;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (schedule: DisplaySchedule) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

type ScheduleStatus = 'empty' | 'reserved';

const statusColorMap: Record<ScheduleStatus, string> = {
  empty: '#FF9800',    // 주황 (대기)
  reserved: '#4CAF50', // 녹색 (예약완료)
};

const statusLabelMap: Record<ScheduleStatus, string> = {
  empty: '빈 일정',
  reserved: '예약완료',
};

export default function ScheduleTable({
  data,
  totalCount,
  selectedIds,
  onSelectionChange,
  onRowClick,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ScheduleTableProps) {
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

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD');
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
              <TableCell>방문일</TableCell>
              <TableCell>시간</TableCell>
              <TableCell>동/호수</TableCell>
              <TableCell>성함</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  등록된 방문일정이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
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
                      <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatDate(row.visitDate)}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => onRowClick(row)}>
                      <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {row.visitTime}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => onRowClick(row)}>
                      <Box sx={{ fontWeight: 500 }}>
                        {row.building} {row.unit}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => onRowClick(row)}>
                      <Box sx={{ fontWeight: row.name ? 500 : 400, color: row.name ? 'inherit' : 'text.secondary' }}>
                        {row.name || '-'}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => onRowClick(row)}>
                      <Box sx={{ fontVariantNumeric: 'tabular-nums', color: row.phone ? 'inherit' : 'text.secondary' }}>
                        {row.phone || '-'}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => onRowClick(row)}>
                      <Chip
                        label={statusLabelMap[row.status]}
                        size="small"
                        sx={{
                          backgroundColor: statusColorMap[row.status],
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
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
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="페이지당 행 수:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / 총 ${count}건`
        }
      />
    </Paper>
  );
}
