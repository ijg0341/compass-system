
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
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { SmartnetListItem } from '@/src/types/smartnet';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/src/types/smartnet';

interface ListTableProps {
  items: SmartnetListItem[];
  onItemClick: (item: SmartnetListItem) => void;
}

const statusColorMap = {
  active: '#4CAF50',
  inactive: '#9E9E9E',
  expired: '#F44336',
};

const categoryColorMap = {
  visit: '#2196F3',
  move: '#FF9800',
  vote: '#9C27B0',
};

export default function ListTable({ items, onItemClick }: ListTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopyUrl = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(url);
    alert('URL이 클립보드에 복사되었습니다.');
  };

  const handleEdit = (item: SmartnetListItem, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Edit:', item.id);
    alert(`${item.title} 수정 기능은 추후 구현 예정입니다.`);
  };

  const handleDelete = (item: SmartnetListItem, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm(`정말로 "${item.title}"을 삭제하시겠습니까?`)) {
      console.log('Delete:', item.id);
      alert('삭제 기능은 추후 구현 예정입니다.');
    }
  };

  const paginatedItems = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      sx={{
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 80 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>카테고리</TableCell>
              <TableCell sx={{ fontWeight: 600, flexGrow: 1 }}>제목</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 200 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 90 }}>상태</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 140 }}>생성일</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120, textAlign: 'center' }}>
                액션
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    검색 결과가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => onItemClick(item)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
                    >
                      {item.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={CATEGORY_LABELS[item.category]}
                      size="small"
                      sx={{
                        backgroundColor: categoryColorMap[item.category],
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {item.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        noWrap
                        sx={{
                          maxWidth: 180,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {item.url}
                      </Typography>
                      <Tooltip title="URL 복사">
                        <IconButton
                          size="small"
                          onClick={(e) => handleCopyUrl(item.url, e)}
                          sx={{ ml: 'auto' }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[item.status]}
                      size="small"
                      sx={{
                        backgroundColor: statusColorMap[item.status],
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {item.createdAt.split(' ')[0]}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick(item);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={(e) => handleEdit(item, e)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(item, e)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="페이지당 행:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / 총 ${count}개`
        }
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          '.MuiTablePagination-toolbar': {
            minHeight: 48,
          },
        }}
      />
    </Paper>
  );
}
