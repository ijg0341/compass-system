import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Dongho, DonghoRequest } from '@/src/types/dongho.types';
import { useProjectTypes } from '@/src/hooks/useDongho';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';

interface DonghoFormProps {
  editingDongho: Dongho | null;
  onSubmit: (data: DonghoRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormState {
  dong: string;
  ho: string;
  unit_type: string;
  ev_lines: string;
}

const INITIAL_FORM: FormState = {
  dong: '',
  ho: '',
  unit_type: '',
  ev_lines: '',
};

export default function DonghoForm({
  editingDongho,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DonghoFormProps) {
  const { projectUuid } = useCurrentProject();
  const { data: projectTypes = [] } = useProjectTypes(projectUuid);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);

  // 수정 모드 시 폼 데이터 설정
  useEffect(() => {
    if (editingDongho) {
      setFormData({
        dong: editingDongho.dong,
        ho: editingDongho.ho,
        unit_type: editingDongho.unit_type || '',
        ev_lines: editingDongho.ev_lines?.join(', ') || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [editingDongho]);

  // 입력 핸들러
  const handleInputChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  // 폼 유효성 검사
  const isFormValid = formData.dong.trim() !== '' && formData.ho.trim() !== '';

  // 등록/수정 처리
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return;

    const evLines = formData.ev_lines
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    await onSubmit({
      dong: formData.dong,
      ho: formData.ho,
      unit_type: formData.unit_type || undefined,
      ev_lines: evLines.length > 0 ? evLines : undefined,
    });

    // 등록 모드일 때만 폼 초기화
    if (!editingDongho) {
      setFormData(INITIAL_FORM);
    }
  }, [formData, isFormValid, onSubmit, editingDongho]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    setFormData(INITIAL_FORM);
    onCancel();
  }, [onCancel]);

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
        <TextField
          label="동"
          size="small"
          value={formData.dong}
          onChange={handleInputChange('dong')}
          placeholder="예: 101동"
          sx={{ width: 120 }}
          required
          inputProps={{ maxLength: 20 }}
        />

        <TextField
          label="호"
          size="small"
          value={formData.ho}
          onChange={handleInputChange('ho')}
          placeholder="예: 101호"
          sx={{ width: 120 }}
          required
          inputProps={{ maxLength: 20 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>타입/평수</InputLabel>
          <Select
            value={formData.unit_type}
            label="타입/평수"
            onChange={(e) => setFormData((prev) => ({ ...prev, unit_type: e.target.value }))}
          >
            <MenuItem value="">
              <em>선택 안함</em>
            </MenuItem>
            {projectTypes.map((type) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="승강기 라인"
          size="small"
          value={formData.ev_lines}
          onChange={handleInputChange('ev_lines')}
          placeholder="쉼표로 구분"
          sx={{ minWidth: 150 }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* 버튼 */}
        {editingDongho ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              sx={{ height: 40 }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <EditIcon />}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              sx={{
                minWidth: 80,
                height: 40,
                bgcolor: '#E63C2E',
                '&:hover': { bgcolor: '#C44233' },
              }}
            >
              수정하기
            </Button>
          </Box>
        ) : (
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
        )}
      </Box>
    </Paper>
  );
}
