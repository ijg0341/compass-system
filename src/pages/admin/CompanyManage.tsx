/**
 * 관리자 전용 - 건설사 관리 페이지
 * 기획서 CP-SA-21-001
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
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { companyApi, type Company } from '@/src/lib/api/superadminApi';

export default function CompanyManage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 폼 상태
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');

  // 다이얼로그 상태
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  // 건설사 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyApi.getList(),
  });

  const companies = data?.data?.list ?? [];
  const total = data?.data?.total ?? 0;

  // 등록/수정 mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyName.trim()) {
        throw new Error('건설사명을 입력하세요.');
      }
      if (editMode && editId) {
        return companyApi.update(editId, { name: companyName });
      } else {
        return companyApi.create({ name: companyName });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      resetForm();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorDialog(err.response?.data?.message || '이미 등록된 건설사명 입니다.');
    },
  });

  const handleEdit = (company: Company) => {
    setEditMode(true);
    setEditId(company.id);
    setCompanyName(company.name);
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setCompanyName('');
  };

  const handleSubmit = () => {
    saveMutation.mutate();
  };

  // 페이지네이션 처리
  const paginatedCompanies = companies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const labelCellSx = {
    width: '20%',
    bgcolor: 'action.hover',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.primary',
    py: 1,
    px: 2,
  };

  const valueCellSx = {
    py: 0.5,
    px: 1,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
    '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
  };

  return (
    <Box>
      {/* 건설사 생성/수정 폼 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        건설사 생성/수정
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={labelCellSx}>건설사명</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  size="small"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  sx={{ ...inputSx, minWidth: 300 }}
                  placeholder="건설사명을 입력하세요"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
        >
          {editMode ? '수정하기' : '등록하기'}
        </Button>
        <Button variant="outlined" onClick={resetForm}>
          취소
        </Button>
      </Box>

      {/* 건설사 목록 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        건설사 목록
      </Typography>

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
                <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                  고유번호
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>건설사명</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCompanies.map((company) => (
                <TableRow key={company.id} hover>
                  <TableCell align="center">{company.id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(company)}
                    >
                      수정
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    등록된 건설사가 없습니다.
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

      {/* 에러 다이얼로그 */}
      <Dialog open={!!errorDialog} onClose={() => setErrorDialog(null)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDialog}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(null)} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
