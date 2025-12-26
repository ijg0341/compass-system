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
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getManagers, getUser, createManager, updateUser, checkUserIdDuplicate } from '@/src/lib/api/userApi';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { ProjectUser, ManagerFormData } from '@/src/types/user.types';
import { MANAGER_TYPE_LABELS, type ManagerMemberType } from '@/src/types/user.types';
import ManagerFormDrawer from './ManagerFormDrawer';

export default function ManagerTab() {
  const { projectUuid } = useCurrentProject();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<ProjectUser | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 매니저 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['managers', projectUuid, page, rowsPerPage],
    queryFn: () => getManagers(projectUuid, {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    }),
    enabled: !!projectUuid,
  });

  // 매니저 등록 mutation
  const createMutation = useMutation({
    mutationFn: (formData: ManagerFormData) =>
      createManager(projectUuid, {
        user_id: formData.user_id,
        password: formData.password!,
        name: formData.name,
        role: formData.member_type, // 백엔드 필드명: role
        birthday: formData.birthday,
        phone: formData.phone,
        company: formData.company,
        department: formData.department,
        email: formData.email,
        address: formData.address,
        telephone: formData.telephone,
        business_number: formData.business_number,
        is_active: formData.is_active,
        memo: formData.memo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      handleCloseModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || '등록 중 오류가 발생했습니다.');
    },
  });

  // 매니저 수정 mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data: formData }: { id: number; data: ManagerFormData }) =>
      updateUser(projectUuid, id, {
        password: formData.password || undefined,
        name: formData.name,
        role: formData.member_type, // 백엔드 필드명: role
        birthday: formData.birthday,
        phone: formData.phone,
        company: formData.company,
        department: formData.department,
        email: formData.email,
        address: formData.address,
        telephone: formData.telephone,
        business_number: formData.business_number,
        is_active: formData.is_active,
        memo: formData.memo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      handleCloseModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || '수정 중 오류가 발생했습니다.');
    },
  });

  const handleOpenModal = async (manager?: ProjectUser) => {
    setApiError(null);
    setModalOpen(true);
    if (manager) {
      setIsLoadingDetail(true);
      try {
        const detail = await getUser(projectUuid, manager.id);
        setEditData(detail);
      } catch (err) {
        setApiError((err as Error).message || '상세 정보를 불러오는 중 오류가 발생했습니다.');
        setEditData(manager);
      } finally {
        setIsLoadingDetail(false);
      }
    } else {
      setEditData(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setApiError(null);
  };

  const handleCheckDuplicate = async (userId: string): Promise<boolean> => {
    return checkUserIdDuplicate(projectUuid, userId);
  };

  const handleSubmit = (formData: ManagerFormData) => {
    setApiError(null);
    if (editData) {
      updateMutation.mutate({ id: editData.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 회원구분 라벨 가져오기 (백엔드 필드: role)
  const getRoleLabel = (role?: string) => {
    if (!role) return '-';
    return MANAGER_TYPE_LABELS[role as ManagerMemberType] || role;
  };

  if (error) {
    return <Alert severity="error">데이터를 불러오는 중 오류가 발생했습니다.</Alert>;
  }

  const managers = data?.list || [];
  const total = data?.total || 0;

  return (
    <Box>
      {/* Header with Register Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          매니저 목록
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          등록하기
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
                  <TableCell>회원구분</TableCell>
                  <TableCell>아이디</TableCell>
                  <TableCell>회사명</TableCell>
                  <TableCell>부서명</TableCell>
                  <TableCell>성명</TableCell>
                  <TableCell>연락처</TableCell>
                  <TableCell>마지막 로그인</TableCell>
                  <TableCell>접근/차단</TableCell>
                  <TableCell>관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {managers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        등록된 매니저가 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  managers.map((manager: ProjectUser) => (
                    <TableRow key={manager.id} hover>
                      <TableCell>{manager.id}</TableCell>
                      <TableCell>
                        {getRoleLabel(
                          (manager as ProjectUser & { role?: string }).role
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {manager.user_id}
                        </Box>
                      </TableCell>
                      <TableCell>{manager.company || '-'}</TableCell>
                      <TableCell>{manager.department || '-'}</TableCell>
                      <TableCell>{manager.name}</TableCell>
                      <TableCell>{manager.phone || '-'}</TableCell>
                      <TableCell>
                        {manager.last_login_at
                          ? manager.last_login_at.split(' ')[0]
                          : '없음'}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manager.is_active ? '#4CAF50' : '#F44336',
                            fontWeight: 600,
                          }}
                        >
                          {manager.is_active ? '로그인 가능' : '차단'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenModal(manager)}
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

      {/* Manager Form Drawer */}
      <ManagerFormDrawer
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onCheckDuplicate={handleCheckDuplicate}
        editData={editData}
        isLoading={createMutation.isPending || updateMutation.isPending}
        isLoadingDetail={isLoadingDetail}
        error={apiError}
      />
    </Box>
  );
}
