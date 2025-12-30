/**
 * 관리자 전용 - 관리자 관리 페이지 (A1 전용)
 * 기획서 CP-SA-22-001
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { adminUserApi, formatApiDate, type AdminUser } from '@/src/lib/api/superadminApi';
import AdminUserFormModal from './AdminUserFormModal';

// 권한 레벨 표시 텍스트
const ROLE_LABELS: Record<string, string> = {
  A1: 'C총괄',
  A2: 'C관리자',
  A3: '본사관리자',
};

export default function AdminUserManage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 모달 상태
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);

  // 삭제 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  // 관리자 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminUserApi.getList(),
  });

  const adminUsers = data?.data?.list ?? [];
  const total = data?.data?.total ?? 0;

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminUserApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    },
  });

  const handleOpenCreateModal = () => {
    setEditUser(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setEditUser(user);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setDeleteTarget(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  // 페이지네이션 처리
  const paginatedUsers = adminUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          관리자 목록
        </Typography>
        <Button variant="contained" onClick={handleOpenCreateModal}>
          등록하기
        </Button>
      </Box>

      {/* 관리자 목록 테이블 */}
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
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                  고유번호
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>아이디</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>건설사 권한</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }}>권한</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }}>이름</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 130 }}>연락처</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 130 }}>마지막 로그인</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                  접근/차단
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150 }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.company_name || '[전체]'}</TableCell>
                  <TableCell>{ROLE_LABELS[user.role] || user.role}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    {formatApiDate(user.last_login_at) ?? '없음'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.is_active ? '로그인 가능' : '차단'}
                      size="small"
                      color={user.is_active ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenEditModal(user)}
                      >
                        수정
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {adminUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    등록된 관리자가 없습니다.
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
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / 총 ${count}건`
          }
        />
      </Paper>

      {/* 등록/수정 모달 */}
      <AdminUserFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        editUser={editUser}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            관리자를 삭제하시겠습니까?
            <br />
            해당 아이디로 더 이상 사용이 불가합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>아니오</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
