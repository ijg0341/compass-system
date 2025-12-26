import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getResidents, getUser, updateUser, createResidentAccounts } from '@/src/lib/api/userApi';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { ProjectUser } from '@/src/types/user.types';
import ResidentFormDrawer, { type ResidentFormData } from './ResidentFormDrawer';

export default function ResidentTab() {
  const { projectUuid } = useCurrentProject();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  // 입주자 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['residents', projectUuid, page, rowsPerPage],
    queryFn: () => getResidents(projectUuid, {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    }),
    enabled: !!projectUuid,
  });

  const [selectedResident, setSelectedResident] = useState<ProjectUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 입주자 수정 mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data: formData }: { id: number; data: ResidentFormData }) =>
      updateUser(projectUuid, id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password || undefined,
        is_active: formData.is_active,
        memo: formData.memo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      handleCloseDrawer();
    },
    onError: (err: Error) => {
      setApiError(err.message || '수정 중 오류가 발생했습니다.');
    },
  });

  // 계정 생성 mutation
  const createAccountsMutation = useMutation({
    mutationFn: () => createResidentAccounts(projectUuid),
    onSuccess: (result) => {
      setCreatedCount(result.created_count);
      setConfirmDialogOpen(false);
      setResultDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });

  const handleOpenDrawer = async (resident: ProjectUser) => {
    setApiError(null);
    setDrawerOpen(true);
    setIsLoadingDetail(true);
    try {
      const detail = await getUser(projectUuid, resident.id);
      setSelectedResident(detail);
    } catch (err) {
      setApiError((err as Error).message || '상세 정보를 불러오는 중 오류가 발생했습니다.');
      setSelectedResident(resident); // fallback to list data
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSubmit = (formData: ResidentFormData) => {
    setApiError(null);
    if (selectedResident) {
      updateMutation.mutate({ id: selectedResident.id, data: formData });
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedResident(null);
    setApiError(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateAccounts = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    createAccountsMutation.mutate();
  };

  if (error) {
    return <Alert severity="error">데이터를 불러오는 중 오류가 발생했습니다.</Alert>;
  }

  const residents = data?.list || [];
  const total = data?.total || 0;

  return (
    <Box>
      {/* Header with Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          입주자 목록
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAccounts}
          disabled={createAccountsMutation.isPending}
        >
          계정 생성
        </Button>
      </Box>

      {/* Table */}
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
        }}
      >
        <TableContainer>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>고유번호</TableCell>
                  <TableCell>아이디</TableCell>
                  <TableCell>동</TableCell>
                  <TableCell>호</TableCell>
                  <TableCell>입주자 성명</TableCell>
                  <TableCell>입주자 연락처</TableCell>
                  <TableCell>접근/차단</TableCell>
                  <TableCell>관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        등록된 입주자가 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident: ProjectUser) => (
                    <TableRow key={resident.id} hover>
                      <TableCell>{resident.id}</TableCell>
                      <TableCell>
                        <Box sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {resident.user_id}
                        </Box>
                      </TableCell>
                      <TableCell>{resident.dong || '-'}</TableCell>
                      <TableCell>{resident.ho || '-'}</TableCell>
                      <TableCell>{resident.name}</TableCell>
                      <TableCell>{resident.phone || '-'}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: resident.is_active ? '#4CAF50' : '#F44336',
                            fontWeight: 600,
                          }}
                        >
                          {resident.is_active ? '로그인 가능' : '차단'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenDrawer(resident)}
                        >
                          수정
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / 총 ${count}건`
          }
        />
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>계정 생성</DialogTitle>
        <DialogContent>
          <Typography>
            동호 코드에 없는 입주자 계정을 자동으로 생성합니다.
            <br />
            계속하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleConfirmCreate}
            disabled={createAccountsMutation.isPending}
          >
            {createAccountsMutation.isPending ? <CircularProgress size={20} /> : '확인'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>
            {createdCount}개 세대의 계정이 생성되었습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setResultDialogOpen(false)}>
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 입주자 수정 Drawer */}
      <ResidentFormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        editData={selectedResident}
        isLoading={updateMutation.isPending}
        isLoadingDetail={isLoadingDetail}
        error={apiError}
      />
    </Box>
  );
}
