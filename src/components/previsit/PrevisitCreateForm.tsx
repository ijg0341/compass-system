import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import type { PrevisitRequest } from '@/src/types/previsit.types';

// 시간 옵션 생성 (06:00 ~ 22:00)
const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

// 초기 폼 데이터
const INITIAL_FORM: PrevisitRequest = {
  project_id: 1,
  name: '',
  date_begin: '',
  date_end: '',
  time_first: '10:00',
  time_last: '17:00',
  time_unit: 30,
  max_limit: 20,
};

interface PrevisitCreateFormProps {
  onSubmit: (data: PrevisitRequest, file?: File) => Promise<void>;
  isSubmitting?: boolean;
  existingNames?: string[];
}

export default function PrevisitCreateForm({
  onSubmit,
  isSubmitting = false,
  existingNames = [],
}: PrevisitCreateFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PrevisitRequest>(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 입력 핸들러
  const handleInputChange = useCallback(
    (field: keyof PrevisitRequest) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setError(null);
      },
    []
  );

  // 셀렉트 핸들러
  const handleSelectChange = useCallback(
    (field: keyof PrevisitRequest) => (e: SelectChangeEvent<string | number>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: typeof prev[field] === 'number' ? Number(value) : value,
      }));
    },
    []
  );

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setError('jpg, png, gif 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }, []);

  // 파일 삭제 핸들러
  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  // 폼 유효성 검사
  const isFormValid = useMemo(() => {
    if (!formData.name.trim()) return false;
    if (!formData.date_begin || !formData.date_end) return false;
    if (!formData.time_first || !formData.time_last) return false;
    if (dayjs(formData.date_begin).isAfter(dayjs(formData.date_end))) return false;
    return true;
  }, [formData]);

  // 등록 처리
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    const isDuplicate = existingNames.some(
      (name) => name.toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError('이미 존재하는 행사명입니다.');
      return;
    }

    try {
      await onSubmit(
        { ...formData, name: formData.name.trim() },
        selectedFile || undefined
      );

      // 폼 초기화
      setFormData(INITIAL_FORM);
      handleFileRemove();
      setError(null);
    } catch (err) {
      console.error('등록 실패:', err);
      setError('등록에 실패했습니다.');
    }
  }, [formData, isFormValid, existingNames, selectedFile, onSubmit, handleFileRemove]);

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* 1행: 행사명, 시작일, 종료일 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            label="행사명"
            size="small"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="행사명"
            sx={{ minWidth: 180 }}
            required
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            type="date"
            label="시작일"
            size="small"
            value={formData.date_begin}
            onChange={handleInputChange('date_begin')}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            required
          />

          <TextField
            type="date"
            label="종료일"
            size="small"
            value={formData.date_end}
            onChange={handleInputChange('date_end')}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            required
          />

          <FormControl size="small" sx={{ minWidth: 100 }} required>
            <InputLabel>첫시간</InputLabel>
            <Select
              value={formData.time_first}
              onChange={handleSelectChange('time_first')}
              label="첫시간"
            >
              {TIME_OPTIONS.map((time) => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }} required>
            <InputLabel>마지막시간</InputLabel>
            <Select
              value={formData.time_last}
              onChange={handleSelectChange('time_last')}
              label="마지막시간"
            >
              {TIME_OPTIONS.map((time) => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 90 }} required>
            <InputLabel>예약단위</InputLabel>
            <Select
              value={formData.time_unit}
              onChange={handleSelectChange('time_unit')}
              label="예약단위"
            >
              <MenuItem value={30}>30분</MenuItem>
              <MenuItem value={60}>1시간</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="최대인원"
            size="small"
            value={formData.max_limit}
            onChange={handleInputChange('max_limit')}
            inputProps={{ min: 1, max: 1000 }}
            sx={{ minWidth: 80 }}
          />
        </Box>

        {/* 2행: 이미지 업로드, 등록 버튼 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main' },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
                />
                <Typography variant="caption" sx={{ maxWidth: 100 }} noWrap>
                  {selectedFile?.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileRemove();
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <UploadIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  이미지 업로드
                </Typography>
              </>
            )}
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            size="small"
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            sx={{
              minWidth: 80,
              height: 40,
              bgcolor: '#E63C2E',
              '&:hover': { bgcolor: '#C44233' },
            }}
          >
            등록하기
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
