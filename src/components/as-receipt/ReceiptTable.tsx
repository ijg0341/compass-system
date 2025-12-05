
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
  IconButton,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CommentIcon from '@mui/icons-material/Comment';
import type { ASReceiptData, ASReceiptStatus, Priority } from '@/src/types/asReceipt';

interface ReceiptTableProps {
  data: ASReceiptData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (receipt: ASReceiptData) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const statusColorMap: Record<ASReceiptStatus, string> = {
  RECEIVED: '#757575',
  ASSIGNED: '#757575',
  IN_PROGRESS: '#2196F3',
  QA: '#2196F3',
  DONE: '#4CAF50',
  REJECTED: '#F44336',
};

const statusLabelMap: Record<ASReceiptStatus, string> = {
  RECEIVED: '접수',
  ASSIGNED: '배정',
  IN_PROGRESS: '진행중',
  QA: '품질검수',
  DONE: '완료',
  REJECTED: '반려',
};

const priorityLabelMap: Record<Priority, string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
  URGENT: '긴급',
};

export default function ReceiptTable({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ReceiptTableProps) {
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
              <TableCell>접수번호</TableCell>
              <TableCell>현장/동호수</TableCell>
              <TableCell>공종/소공종</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>우선순위</TableCell>
              <TableCell>협력사</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell>접수일</TableCell>
              <TableCell>예정일</TableCell>
              <TableCell align="center">첨부</TableCell>
              <TableCell align="center">댓글</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.id);
              const hasAttachments =
                row.attachments.length > 0 ||
                row.photos.far.length > 0 ||
                row.photos.near.length > 0;

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
                    <Box sx={{ fontWeight: 500 }}>{row.siteName}</Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {row.dong}동 {row.ho}호
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    <Box sx={{ fontWeight: 500 }}>{row.trade}</Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {row.subTrade}
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
                  <TableCell onClick={() => onRowClick(row)}>
                    {priorityLabelMap[row.priority]}
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.partner || '-'}
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.assignee || '-'}
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>
                    {row.requestedAt}
                  </TableCell>
                  <TableCell onClick={() => onRowClick(row)}>{row.dueDate}</TableCell>
                  <TableCell align="center" onClick={() => onRowClick(row)}>
                    {hasAttachments ? (
                      <IconButton size="small" color="primary">
                        <AttachFileIcon />
                      </IconButton>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center" onClick={() => onRowClick(row)}>
                    {row.comments > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CommentIcon fontSize="small" color="action" />
                        <Box>{row.comments}</Box>
                      </Box>
                    ) : (
                      '-'
                    )}
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
