import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectUser, PartnerFormData } from '@/src/types/user.types';

interface PartnerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PartnerFormData) => void;
  editData?: ProjectUser | null;
  isLoading?: boolean;
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

export default function PartnerFormModal({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
  error,
}: PartnerFormModalProps) {
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid rgba(0, 0, 0, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            협력사 {isEditMode ? '수정' : '등록'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* 아이디 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="user_id"
                label="아이디"
                value={formData.user_id}
                onChange={handleChange}
                required
                disabled={isEditMode}
                autoComplete="username"
              />
            </Grid>

            {/* 비밀번호 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="password"
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                autoComplete="new-password"
                helperText={isEditMode ? '변경 시에만 입력' : ''}
              />
            </Grid>

            {/* 담당자/직책 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="name"
                label="담당자 / 직책"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* 연락처 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="phone"
                label="연락처"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </Grid>

            {/* 회사명 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="company"
                label="회사명"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>

            {/* 부서명 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="department"
                label="부서명"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>

            {/* 이메일 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                name="email"
                label="이메일"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            {/* 주소 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                name="address"
                label="주소"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            {/* 대표번호 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="telephone"
                label="대표번호"
                value={formData.telephone}
                onChange={handleChange}
              />
            </Grid>

            {/* 사업자등록번호 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="business_number"
                label="사업자등록번호"
                value={formData.business_number}
                onChange={handleChange}
              />
            </Grid>

            {/* 접근/차단 */}
            <Grid size={{ xs: 12 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
                  접근/차단
                </FormLabel>
                <RadioGroup
                  row
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={handleActiveChange}
                >
                  <FormControlLabel value="true" control={<Radio size="small" />} label="로그인 가능" />
                  <FormControlLabel value="false" control={<Radio size="small" />} label="차단" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* 비고 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                name="memo"
                label="비고"
                value={formData.memo}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleClose} size="small">
            취소
          </Button>
          <Button type="submit" variant="contained" size="small" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : isEditMode ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
