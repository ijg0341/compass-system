/**
 * A/S 관리 테이블 컴포넌트
 * 기획서: CP-SA-03-003
 * - 형태/진행상태 인라인 수정 가능
 */

import { useState } from 'react';
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
  Select,
  MenuItem,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  type SelectChangeEvent,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import type {
  AfterserviceListItem,
  AsStatus,
  AsPriority,
} from '@/src/types/afterservice.types';
import { AS_STATUS_COLORS, AS_PRIORITY_COLORS } from '@/src/types/afterservice.types';

interface ManageTableProps {
  data: AfterserviceListItem[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRowClick: (item: AfterserviceListItem) => void;
  onStatusChange: (id: number, statusId: number) => void;
  onPriorityChange: (id: number, priorityId: number) => void;
  statusOptions: AsStatus[];
  priorityOptions: AsPriority[];
  isUpdating?: boolean;
}

export default function ManageTable({
  data,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  onStatusChange,
  onPriorityChange,
  statusOptions,
  priorityOptions,
  isUpdating,
}: ManageTableProps) {
  const [imageDialog, setImageDialog] = useState<{ open: boolean; url: string }>({
    open: false,
    url: '',
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleStatusChange = (id: number) => (event: SelectChangeEvent<number>) => {
    event.stopPropagation();
    onStatusChange(id, Number(event.target.value));
  };

  const handlePriorityChange = (id: number) => (event: SelectChangeEvent<number>) => {
    event.stopPropagation();
    onPriorityChange(id, Number(event.target.value));
  };

  const handleImageClick = (url: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    setImageDialog({ open: true, url });
  };

  const getStatusColor = (statusId: number) => AS_STATUS_COLORS[statusId] || '#757575';
  const getPriorityColor = (priorityId: number) => AS_PRIORITY_COLORS[priorityId] || '#757575';

  return (
    <>
      <Paper
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid rgba(0, 0, 0, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>고유번호</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>등록일자</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>동</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>호</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>실명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>부위</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>상세부위</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>유형</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 60 }} align="center">
                  원거리
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 60 }} align="center">
                  근거리
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>형태</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>진행상태</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>대공종</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>소공종</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>협력사</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>보수일정</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onRowClick(row)}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.created_at || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.dong || '-'}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.ho || '-'}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>{row.room || '-'}</TableCell>
                  <TableCell>{row.issue_category1 || '-'}</TableCell>
                  <TableCell>{row.issue_category2 || '-'}</TableCell>
                  <TableCell>{row.issue_type || '-'}</TableCell>
                  <TableCell align="center">
                    {row.image_far ? (
                      <IconButton
                        size="small"
                        onClick={handleImageClick(row.image_far)}
                        color="primary"
                      >
                        <ImageIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.image_near ? (
                      <IconButton
                        size="small"
                        onClick={handleImageClick(row.image_near)}
                        color="primary"
                      >
                        <ImageIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      size="small"
                      value={row.as_priority_id}
                      onChange={handlePriorityChange(row.id)}
                      disabled={isUpdating}
                      sx={{
                        minWidth: 90,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: getPriorityColor(row.as_priority_id),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: getPriorityColor(row.as_priority_id),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: getPriorityColor(row.as_priority_id),
                        },
                        '& .MuiSelect-select': {
                          py: 0.5,
                          fontSize: '0.75rem',
                          color: getPriorityColor(row.as_priority_id),
                        },
                      }}
                    >
                      {priorityOptions.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      size="small"
                      value={row.as_status_id}
                      onChange={handleStatusChange(row.id)}
                      disabled={isUpdating}
                      sx={{
                        minWidth: 110,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(row.as_status_id),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(row.as_status_id),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(row.as_status_id),
                        },
                        '& .MuiSelect-select': {
                          py: 0.5,
                          fontSize: '0.75rem',
                          color: getStatusColor(row.as_status_id),
                        },
                      }}
                    >
                      {statusOptions.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{row.work_type1 || '-'}</TableCell>
                  <TableCell>{row.work_type2 || '-'}</TableCell>
                  <TableCell>{row.partner_company || '-'}</TableCell>
                  <TableCell>{row.work_date || '-'}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
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
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 총 ${count}건`}
        />
      </Paper>

      {/* 이미지 미리보기 다이얼로그 */}
      <Dialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, url: '' })}
        maxWidth="md"
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setImageDialog({ open: false, url: '' })}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            <Box
              component="img"
              src={imageDialog.url}
              alt="하자 사진"
              sx={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
            />
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}
