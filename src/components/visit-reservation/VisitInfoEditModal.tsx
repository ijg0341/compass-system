
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  SelectChangeEvent,
  Typography,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import type { AvailableSlotsResponse, UpdateVisitInfoRequest } from '@/src/lib/api/reservationApi';
import { useUploadFile } from '@/src/hooks/useReservation';

interface VisitInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateVisitInfoRequest) => Promise<void>;
  initialData?: AvailableSlotsResponse;
  isSubmitting?: boolean;
}

interface FormState {
  dateBegin: string;
  dateEnd: string;
  timeFirst: string;
  timeLast: string;
  timeUnit: string;
  maxLimit: string;
  imageFileId: number | null;
  imageUrl: string | null;
}

// 시간 옵션 생성 (06:00 ~ 22:00)
const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const hour = (i + 6).toString().padStart(2, '0');
  return `${hour}:00`;
});

// 시간 단위 옵션 (분)
const TIME_UNIT_OPTIONS = [
  { value: '30', label: '30분' },
  { value: '60', label: '1시간' },
  { value: '90', label: '1시간 30분' },
  { value: '120', label: '2시간' },
];

export default function VisitInfoEditModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: VisitInfoEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();

  const [formData, setFormData] = useState<FormState>({
    dateBegin: '',
    dateEnd: '',
    timeFirst: '10:00',
    timeLast: '17:00',
    timeUnit: '60',
    maxLimit: '',
    imageFileId: null,
    imageUrl: null,
  });

  // initialData가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (initialData && open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        dateBegin: initialData.date_begin?.date?.split(' ')[0] || '',
        dateEnd: initialData.date_end?.date?.split(' ')[0] || '',
        timeFirst: initialData.time_first?.slice(0, 5) || '10:00',
        timeLast: initialData.time_last?.slice(0, 5) || '17:00',
        timeUnit: String(initialData.time_unit || 60),
        maxLimit: initialData.max_limit ? String(initialData.max_limit) : '',
        imageFileId: initialData.image_file_id || null,
        imageUrl: initialData.image_url || null,
      });
    }
  }, [initialData, open]);

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        options: {
          fileCategory: 'visit_info',
          isPublic: true,
        },
      });

      setFormData(prev => ({
        ...prev,
        imageFileId: result.id,
        imageUrl: result.url,
      }));
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      alert('파일 업로드에 실패했습니다.');
    }

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFileId: null,
      imageUrl: null,
    }));
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.dateBegin || !formData.dateEnd || !formData.timeFirst || !formData.timeLast || !formData.timeUnit) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    // 날짜 유효성 검증
    if (formData.dateBegin > formData.dateEnd) {
      alert('종료일은 시작일 이후여야 합니다.');
      return;
    }

    // 시간 유효성 검증
    if (formData.timeFirst >= formData.timeLast) {
      alert('종료시간은 시작시간 이후여야 합니다.');
      return;
    }

    const requestData: UpdateVisitInfoRequest = {
      date_begin: formData.dateBegin,
      date_end: formData.dateEnd,
      time_first: formData.timeFirst,
      time_last: formData.timeLast,
      time_unit: parseInt(formData.timeUnit, 10),
      max_limit: formData.maxLimit ? parseInt(formData.maxLimit, 10) : undefined,
      image_file_id: formData.imageFileId || undefined,
    };

    await onSubmit(requestData);
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle>방문정보 수정</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* 방문 기간 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="시작일"
              type="date"
              size="small"
              fullWidth
              value={formData.dateBegin}
              onChange={handleChange('dateBegin')}
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="종료일"
              type="date"
              size="small"
              fullWidth
              value={formData.dateEnd}
              onChange={handleChange('dateEnd')}
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          {/* 방문 시간 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth required>
              <InputLabel>시작시간</InputLabel>
              <Select
                value={formData.timeFirst}
                onChange={handleChange('timeFirst')}
                label="시작시간"
              >
                {TIME_OPTIONS.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth required>
              <InputLabel>종료시간</InputLabel>
              <Select
                value={formData.timeLast}
                onChange={handleChange('timeLast')}
                label="종료시간"
              >
                {TIME_OPTIONS.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 시간 단위 & 인원제한 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth required>
              <InputLabel>시간단위</InputLabel>
              <Select
                value={formData.timeUnit}
                onChange={handleChange('timeUnit')}
                label="시간단위"
              >
                {TIME_UNIT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="타임당 인원제한"
              type="number"
              size="small"
              fullWidth
              value={formData.maxLimit}
              onChange={handleChange('maxLimit')}
              placeholder="무제한"
              slotProps={{
                htmlInput: { min: 1 },
              }}
            />
          </Box>

          {/* 이미지 업로드 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              방문예약 페이지 이미지
            </Typography>

            {formData.imageUrl ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <ImageIcon sx={{ color: 'text.secondary' }} />
                <Box
                  component="a"
                  href={formData.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    flex: 1,
                    color: '#2196F3',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  이미지 보기
                </Box>
                <IconButton size="small" onClick={handleRemoveImage} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={isUploading ? <CircularProgress size={18} /> : <CloudUploadIcon />}
                disabled={isUploading}
                sx={{
                  width: '100%',
                  borderStyle: 'dashed',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  },
                }}
              >
                {isUploading ? '업로드 중...' : '이미지 업로드'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting || isUploading}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
          sx={{
            bgcolor: '#E63C2E',
            '&:hover': { bgcolor: '#C44233' },
          }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
