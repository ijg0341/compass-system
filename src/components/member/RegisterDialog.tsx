
import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Divider,
  type SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ResidentData } from '@/src/types/member';

/**
 * RegisterDialog Props Interface
 */
interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ResidentData>) => void;
}

/**
 * 입주자 등록 Dialog 컴포넌트
 *
 * Compass Design System 준수:
 * - 글래스모피즘 다크 테마
 * - size="small" 컴팩트 UI
 * - Grid 레이아웃 (8px 그리드 시스템)
 * - 필수 필드 validation
 */
export default function RegisterDialog({
  open,
  onClose,
  onSubmit,
}: RegisterDialogProps) {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState<Partial<ResidentData>>({
    level: 'GENERAL',
    residenceType: 'OWNER',
    permission: '일반',
    memberType: '입주자',
  });

  // 텍스트 필드 변경 핸들러
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select 필드 변경 핸들러
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  // Dialog 닫기 핸들러 (폼 초기화)
  const handleClose = () => {
    setFormData({
      level: 'GENERAL',
      residenceType: 'OWNER',
      permission: '일반',
      memberType: '입주자',
    });
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
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            입주자 등록
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Dialog Content */}
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* ========== 기본정보 섹션 ========== */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                기본정보
              </Typography>
            </Grid>

            {/* 로그인 ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="loginId"
                label="로그인 ID"
                value={formData.loginId || ''}
                onChange={handleChange}
                required
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
                value={formData.password || ''}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </Grid>

            {/* 계약자명 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="contractorName"
                label="계약자명"
                value={formData.contractorName || ''}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* 계약자 연락처 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="contractorPhone"
                label="계약자 연락처"
                value={formData.contractorPhone || ''}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </Grid>

            {/* 입주자명 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="residentName"
                label="입주자명"
                value={formData.residentName || ''}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* 입주자 연락처 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="residentPhone"
                label="입주자 연락처"
                value={formData.residentPhone || ''}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </Grid>

            {/* 주민번호 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="residentIdNumber"
                label="주민번호"
                value={formData.residentIdNumber || ''}
                onChange={handleChange}
                placeholder="000000-0000000"
              />
            </Grid>

            {/* 회원구분 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="member-type-label">회원구분</InputLabel>
                <Select
                  labelId="member-type-label"
                  name="memberType"
                  value={formData.memberType || '입주자'}
                  onChange={handleSelectChange}
                  label="회원구분"
                >
                  <MenuItem value="입주자">입주자</MenuItem>
                  <MenuItem value="계약자">계약자</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ========== 세대정보 섹션 ========== */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                세대정보
              </Typography>
            </Grid>

            {/* 동 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="dong"
                label="동"
                value={formData.dong || ''}
                onChange={handleChange}
                required
                placeholder="101동"
              />
            </Grid>

            {/* 호 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="ho"
                label="호"
                value={formData.ho || ''}
                onChange={handleChange}
                required
                placeholder="101호"
              />
            </Grid>

            {/* 타입 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="unitType"
                label="타입"
                value={formData.unitType || ''}
                onChange={handleChange}
                placeholder="84A"
              />
            </Grid>

            {/* 라인 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="line"
                label="라인"
                value={formData.line || ''}
                onChange={handleChange}
                placeholder="1호라인"
              />
            </Grid>

            {/* 입주형태 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="residence-type-label">입주형태</InputLabel>
                <Select
                  labelId="residence-type-label"
                  name="residenceType"
                  value={formData.residenceType || 'OWNER'}
                  onChange={handleSelectChange}
                  label="입주형태"
                >
                  <MenuItem value="OWNER">자가</MenuItem>
                  <MenuItem value="TENANT">임차</MenuItem>
                  <MenuItem value="FAMILY">가족</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ========== 입주일정 섹션 ========== */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                입주일정
              </Typography>
            </Grid>

            {/* 입주예정일 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="expectedMoveInDate"
                label="입주예정일"
                type="date"
                value={formData.expectedMoveInDate || ''}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* 이사예약일 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="moveReservationDate"
                label="이사예약일"
                type="date"
                value={formData.moveReservationDate || ''}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* 입주일 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="actualMoveInDate"
                label="입주일"
                type="date"
                value={formData.actualMoveInDate || ''}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* ========== 회원설정 섹션 ========== */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                회원설정
              </Typography>
            </Grid>

            {/* 회원레벨 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="level-label">회원레벨</InputLabel>
                <Select
                  labelId="level-label"
                  name="level"
                  value={formData.level || 'GENERAL'}
                  onChange={handleSelectChange}
                  label="회원레벨"
                >
                  <MenuItem value="GENERAL">일반</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="VVIP">VVIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 권한 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                name="permission"
                label="권한"
                value={formData.permission || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Dialog Actions */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            size="small"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.23)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #FF4433 0%, #E63C2E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF6E5E 0%, #FF4433 100%)',
              },
            }}
          >
            등록
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
