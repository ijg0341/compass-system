import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import BaseDrawer from '@/src/components/common/BaseDrawer';
import type { ProjectUser } from '@/src/types/user.types';

export interface ResidentFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  is_active: boolean;
  memo: string;
}

interface ResidentFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ResidentFormData) => void;
  editData: ProjectUser | null;
  isLoading?: boolean;
  isLoadingDetail?: boolean;
  error?: string | null;
}

const initialFormData: ResidentFormData = {
  name: '',
  phone: '',
  email: '',
  password: '',
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

const valueTextSx = {
  fontSize: '0.875rem',
  py: 0.75,
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

export default function ResidentFormDrawer({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  isLoadingDetail,
  error,
}: ResidentFormDrawerProps) {
  const [formData, setFormData] = useState<ResidentFormData>(initialFormData);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        phone: editData.phone || '',
        email: editData.email || '',
        password: '',
        is_active: editData.is_active,
        memo: editData.memo || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData, open]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      is_active: event.target.value === 'true',
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!editData) return null;

  return (
    <BaseDrawer
      open={open}
      onClose={handleClose}
      title="입주자 정보 수정"
      size="medium"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose} size="small">
            취소
          </Button>
          <Button
            type="submit"
            form="resident-form"
            variant="contained"
            size="small"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : '저장'}
          </Button>
        </>
      }
    >
      <form id="resident-form" onSubmit={handleSubmit}>
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
              {/* 아이디 / 동 */}
              <TableRow>
                <TableCell sx={labelCellSx}>아이디</TableCell>
                <TableCell sx={valueCellSx}>
                  <Typography sx={valueTextSx}>{editData.user_id}</Typography>
                </TableCell>
                <TableCell sx={labelCellSx}>동</TableCell>
                <TableCell sx={valueCellSx}>
                  <Typography sx={valueTextSx}>{editData.dong || '-'}</Typography>
                </TableCell>
              </TableRow>

              {/* 호 / 비밀번호 */}
              <TableRow>
                <TableCell sx={labelCellSx}>호</TableCell>
                <TableCell sx={valueCellSx}>
                  <Typography sx={valueTextSx}>{editData.ho || '-'}</Typography>
                </TableCell>
                <TableCell sx={labelCellSx}>비밀번호</TableCell>
                <TableCell sx={valueCellSx}>
                  <TextField
                    fullWidth
                    size="small"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="변경 시에만 입력"
                    sx={inputSx}
                  />
                </TableCell>
              </TableRow>

              {/* 성명 / 연락처 */}
              <TableRow>
                <TableCell sx={labelCellSx}>성명 *</TableCell>
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

              {/* 마지막 로그인 */}
              <TableRow>
                <TableCell sx={labelCellSx}>마지막 로그인</TableCell>
                <TableCell colSpan={3} sx={valueCellSx}>
                  <Typography sx={valueTextSx}>
                    {editData.last_login_at || '없음'}
                  </Typography>
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
  );
}
