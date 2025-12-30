/**
 * 관리자 전용 - 관리자 등록/수정 모달
 * 기획서 CP-SA-22-002
 */
import { useState, useEffect } from 'react';
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
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  adminUserApi,
  companyApi,
  type AdminUser,
  type AdminUserCreateRequest,
  type AdminUserUpdateRequest,
} from '@/src/lib/api/superadminApi';

interface AdminUserFormModalProps {
  open: boolean;
  onClose: () => void;
  editUser: AdminUser | null;
}

export default function AdminUserFormModal({ open, onClose, editUser }: AdminUserFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!editUser;

  // 폼 상태
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'A1' | 'A2' | 'A3'>('A2');
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [memo, setMemo] = useState('');

  // 아이디 중복 체크 상태
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [userIdError, setUserIdError] = useState<string | null>(null);

  // 에러 다이얼로그
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  // 건설사 목록 조회
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyApi.getList(),
    enabled: open,
  });

  const companies = companiesData?.data?.list ?? [];

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (open && editUser) {
      setUserId(editUser.user_id);
      setPassword('');
      setRole(editUser.role as 'A1' | 'A2' | 'A3');
      setCompanyId(editUser.company_id ?? '');
      setName(editUser.name);
      setPhone(editUser.phone || '');
      setIsActive(editUser.is_active);
      setIsUserIdChecked(true); // 수정 모드에서는 이미 존재하는 아이디
    } else if (open) {
      resetForm();
    }
  }, [open, editUser]);

  // 아이디 중복 확인 mutation
  const checkDuplicateMutation = useMutation({
    mutationFn: (userId: string) => adminUserApi.checkDuplicate(userId),
    onSuccess: (data) => {
      if (data.data?.is_duplicate) {
        setUserIdError('이미 사용중인 아이디 입니다.');
        setIsUserIdChecked(false);
      } else {
        setUserIdError(null);
        setIsUserIdChecked(true);
      }
    },
  });

  // 등록/수정 mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!isEditMode && !userId.trim()) {
        throw new Error('아이디를 입력하세요.');
      }
      if (!isEditMode && !password.trim()) {
        throw new Error('비밀번호를 입력하세요.');
      }
      if (!isEditMode && !isUserIdChecked) {
        throw new Error('아이디 중복확인을 해주세요.');
      }
      if (!name.trim()) {
        throw new Error('이름을 입력하세요.');
      }

      if (isEditMode && editUser) {
        const updateData: AdminUserUpdateRequest = {
          name,
          phone: phone || undefined,
          role,
          company_id: role === 'A3' ? (companyId as number) : null,
          is_active: isActive,
          memo: memo || undefined,
        };
        if (password.trim()) {
          updateData.password = password;
        }
        return adminUserApi.update(editUser.id, updateData);
      } else {
        const createData: AdminUserCreateRequest = {
          user_id: userId,
          password,
          name,
          phone: phone || undefined,
          role,
          company_id: role === 'A3' ? (companyId as number) : null,
          is_active: isActive,
          memo: memo || undefined,
        };
        return adminUserApi.create(createData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorDialog(err.response?.data?.message || err.message || '저장에 실패했습니다.');
    },
  });

  const resetForm = () => {
    setUserId('');
    setPassword('');
    setRole('A2');
    setCompanyId('');
    setName('');
    setPhone('');
    setIsActive(true);
    setMemo('');
    setIsUserIdChecked(false);
    setUserIdError(null);
  };

  const handleCheckDuplicate = () => {
    if (!userId.trim()) {
      setUserIdError('아이디를 입력하세요.');
      return;
    }
    checkDuplicateMutation.mutate(userId);
  };

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    setIsUserIdChecked(false);
    setUserIdError(null);
  };

  const handleSubmit = () => {
    saveMutation.mutate();
  };

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
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              관리자 {isEditMode ? '수정' : '등록'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={labelCellSx}>아이디</TableCell>
                  <TableCell sx={valueCellSx}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        value={userId}
                        onChange={(e) => handleUserIdChange(e.target.value)}
                        disabled={isEditMode}
                        error={!!userIdError}
                        helperText={userIdError}
                        sx={{ ...inputSx, flex: 1 }}
                      />
                      {!isEditMode && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCheckDuplicate}
                          disabled={checkDuplicateMutation.isPending}
                        >
                          중복확인
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>비밀번호</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      size="small"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isEditMode ? '변경 시에만 입력' : ''}
                      sx={{ ...inputSx, width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>관리자 레벨</TableCell>
                  <TableCell sx={valueCellSx}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'A1' | 'A2' | 'A3')}
                        sx={inputSx}
                      >
                        <MenuItem value="A1">C총괄</MenuItem>
                        <MenuItem value="A2">C관리자</MenuItem>
                        <MenuItem value="A3">건설사 본사</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>건설사 권한</TableCell>
                  <TableCell sx={valueCellSx}>
                    <FormControl size="small" sx={{ minWidth: 150 }} disabled={role !== 'A3'}>
                      <Select
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value as number)}
                        displayEmpty
                        sx={inputSx}
                      >
                        <MenuItem value="">선택</MenuItem>
                        {companies.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>이름</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      size="small"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      sx={{ ...inputSx, width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>연락처</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      size="small"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      sx={{ ...inputSx, width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>접근/차단</TableCell>
                  <TableCell sx={valueCellSx}>
                    <RadioGroup
                      row
                      value={isActive ? 'active' : 'blocked'}
                      onChange={(e) => setIsActive(e.target.value === 'active')}
                    >
                      <FormControlLabel
                        value="active"
                        control={<Radio size="small" />}
                        label="로그인 가능"
                      />
                      <FormControlLabel
                        value="blocked"
                        control={<Radio size="small" />}
                        label="차단"
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={labelCellSx}>비고</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      size="small"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      multiline
                      rows={2}
                      sx={{ ...inputSx, width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
          >
            {isEditMode ? '수정' : '등록'}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 에러 다이얼로그 */}
      <Dialog open={!!errorDialog} onClose={() => setErrorDialog(null)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(null)} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
