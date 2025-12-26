import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import BaseDrawer from '@/src/components/common/BaseDrawer';
import type { ProjectUser, PartnerFormData } from '@/src/types/user.types';

interface PartnerFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PartnerFormData) => void;
  onCheckDuplicate?: (userId: string) => Promise<boolean>;
  editData?: ProjectUser | null;
  isLoading?: boolean;
  isLoadingDetail?: boolean;
  error?: string | null;
}

const initialFormData: PartnerFormData = {
  user_id: '',
  password: '',
  name: '',
  phone: '',
  company: '',
  department: '',
  email: '',
  address: '',
  telephone: '',
  business_number: '',
  is_active: true,
  memo: '',
};

// 테이블 셀 스타일
const labelCellSx = {
  width: '15%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1,
  px: 1.5,
};

const valueCellSx = {
  width: '35%',
  py: 0.5,
  px: 1,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
  },
  '& .MuiInputBase-input': {
    py: 0.75,
    fontSize: '0.875rem',
  },
};

export default function PartnerFormDrawer({
  open,
  onClose,
  onSubmit,
  onCheckDuplicate,
  editData,
  isLoading,
  isLoadingDetail,
  error,
}: PartnerFormDrawerProps) {
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        user_id: editData.user_id,
        password: '',
        name: editData.name || '',
        phone: editData.phone || '',
        company: editData.company || '',
        department: editData.department || '',
        email: editData.email || '',
        address: editData.address || '',
        telephone: editData.telephone || '',
        business_number: editData.business_number || '',
        is_active: editData.is_active,
        memo: editData.memo || '',
      });
      setIsUserIdChecked(true);
      setIsUserIdAvailable(true);
    } else {
      setFormData(initialFormData);
      setIsUserIdChecked(false);
      setIsUserIdAvailable(false);
    }
  }, [editData, open]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'user_id') {
      setIsUserIdChecked(false);
      setIsUserIdAvailable(false);
    }
  };

  const handleActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      is_active: event.target.value === 'true',
    }));
  };

  const handleCheckDuplicate = async () => {
    if (!formData.user_id.trim()) {
      setDuplicateMessage('아이디를 입력해주세요.');
      setDuplicateDialogOpen(true);
      return;
    }

    setIsCheckingUserId(true);
    try {
      if (onCheckDuplicate) {
        const isAvailable = await onCheckDuplicate(formData.user_id);
        setIsUserIdChecked(true);
        setIsUserIdAvailable(isAvailable);
        setDuplicateMessage(isAvailable ? '사용 가능한 아이디입니다.' : '이미 사용중인 아이디입니다.');
      } else {
        setIsUserIdChecked(true);
        setIsUserIdAvailable(true);
        setDuplicateMessage('사용 가능한 아이디입니다.');
      }
      setDuplicateDialogOpen(true);
    } catch {
      setDuplicateMessage('중복 확인 중 오류가 발생했습니다.');
      setDuplicateDialogOpen(true);
    } finally {
      setIsCheckingUserId(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditMode && !isUserIdChecked) {
      setDuplicateMessage('아이디 중복확인을 해주세요.');
      setDuplicateDialogOpen(true);
      return;
    }

    if (!isEditMode && !isUserIdAvailable) {
      setDuplicateMessage('사용할 수 없는 아이디입니다.');
      setDuplicateDialogOpen(true);
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setIsUserIdChecked(false);
    setIsUserIdAvailable(false);
    onClose();
  };

  return (
    <>
      <BaseDrawer
        open={open}
        onClose={handleClose}
        title={`협력사 ${isEditMode ? '수정' : '등록'}`}
        size="medium"
        footer={
          <>
            <Button variant="outlined" onClick={handleClose} size="small">
              취소
            </Button>
            <Button
              type="submit"
              form="partner-form"
              variant="contained"
              size="small"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : isEditMode ? '수정' : '등록'}
            </Button>
          </>
        }
      >
        <form id="partner-form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isLoadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                {/* 아이디 / 비밀번호 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>아이디 *</TableCell>
                  <TableCell sx={valueCellSx}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        disabled={isEditMode}
                        autoComplete="username"
                        sx={inputSx}
                      />
                      {!isEditMode && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCheckDuplicate}
                          disabled={isCheckingUserId || !formData.user_id.trim()}
                          sx={{ minWidth: 80, whiteSpace: 'nowrap' }}
                        >
                          {isCheckingUserId ? <CircularProgress size={16} /> : '중복확인'}
                        </Button>
                      )}
                    </Box>
                    {!isEditMode && isUserIdChecked && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: isUserIdAvailable ? 'success.main' : 'error.main',
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        {isUserIdAvailable ? '✓ 사용 가능' : '✗ 사용 불가'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={labelCellSx}>비밀번호 {!isEditMode && '*'}</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!isEditMode}
                      autoComplete="new-password"
                      placeholder={isEditMode ? '변경 시에만 입력' : ''}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 담당자/직책 / 연락처 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>담당자 / 직책 *</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={inputSx}
                    />
                  </TableCell>
                  <TableCell sx={labelCellSx}>연락처</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 회사명 / 부서명 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>회사명</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                  <TableCell sx={labelCellSx}>부서명</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 이메일 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>이메일</TableCell>
                  <TableCell colSpan={3} sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 주소 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>주소</TableCell>
                  <TableCell colSpan={3} sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 대표번호 / 사업자등록번호 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>대표번호</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                  <TableCell sx={labelCellSx}>사업자등록번호</TableCell>
                  <TableCell sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="business_number"
                      value={formData.business_number}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>

                {/* 접근/차단 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>접근/차단</TableCell>
                  <TableCell colSpan={3} sx={valueCellSx}>
                    <RadioGroup
                      row
                      name="is_active"
                      value={String(formData.is_active)}
                      onChange={handleActiveChange}
                    >
                      <FormControlLabel value="true" control={<Radio size="small" />} label="로그인 가능" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="차단" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>

                {/* 비고 */}
                <TableRow>
                  <TableCell sx={labelCellSx}>비고</TableCell>
                  <TableCell colSpan={3} sx={valueCellSx}>
                    <TextField
                      fullWidth
                      size="small"
                      name="memo"
                      value={formData.memo}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      sx={inputSx}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </form>
      </BaseDrawer>

      {/* 중복확인 결과 Dialog */}
      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>{duplicateMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDuplicateDialogOpen(false)}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
