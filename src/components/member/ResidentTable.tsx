
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
  Select,
  MenuItem,
} from '@mui/material';
import type { ResidentData, MemberStatus, MemberLevel } from '@/src/types/member';

interface ResidentTableProps {
  data: ResidentData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (resident: ResidentData) => void;
  onStatusChange: (id: string, status: MemberStatus) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const statusColorMap: Record<MemberStatus, string> = {
  ACTIVE: '#4CAF50',
  BLOCKED: '#F44336',
  WITHDRAWN: '#757575',
};

const levelLabelMap: Record<MemberLevel, string> = {
  GENERAL: '일반',
  VIP: 'VIP',
  VVIP: 'VVIP',
};

export default function ResidentTable({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onStatusChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ResidentTableProps) {
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

  return (
    <Paper
      sx={{
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.08)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <TableContainer
        sx={{
          background: 'transparent',
        }}
      >
        <Table stickyHeader>
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
              <TableCell>회원구분</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>동</TableCell>
              <TableCell>호</TableCell>
              <TableCell>성명</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>회원레벨</TableCell>
              <TableCell>접근/차단</TableCell>
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

                  {/* 회원구분 */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.memberType}
                  </TableCell>

                  {/* ID */}
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {row.loginId}
                    </Box>
                  </TableCell>

                  {/* 동 */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.dong}
                  </TableCell>

                  {/* 호 */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.ho}
                  </TableCell>

                  {/* 성명 (입주자명 사용) */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.residentName}
                  </TableCell>

                  {/* 연락처 (휴대폰번호 사용) */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.mobileNumber}
                  </TableCell>

                  {/* 회원레벨 */}
                  <TableCell onClick={() => onRowClick(row)}>
                    {levelLabelMap[row.level]}
                  </TableCell>

                  {/* 접근/차단 - Select */}
                  <TableCell>
                    <Select
                      size="small"
                      value={row.status}
                      onChange={(e) => onStatusChange(row.id, e.target.value as MemberStatus)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        minWidth: 80,
                        '& .MuiSelect-select': {
                          py: 0.5,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: statusColorMap[row.status],
                        },
                      }}
                    >
                      <MenuItem value="ACTIVE">접근</MenuItem>
                      <MenuItem value="BLOCKED">차단</MenuItem>
                    </Select>
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
