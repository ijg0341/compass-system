/**
 * 스마트넷 전자투표 생성 페이지
 * 화면 ID: CP-SA-10-003
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useCreateMeeting } from '@/src/hooks/useVote';
import type { AgendaRequest, AgendaVoteType } from '@/src/types/vote.types';

// 현재 프로젝트 ID (임시)
const PROJECT_ID = 1;

interface AgendaFormData extends Omit<AgendaRequest, 'options'> {
  options: string;
}

interface FormData {
  title: string;
  description: string;
  meeting_date: string;
  vote_start_date: string;
  vote_end_date: string;
  vote_type: 'electronic_only' | 'electronic_paper';
  quorum_percentage: number;
  pass_threshold_percentage: number;
  max_revote_count: number;
  agendas: AgendaFormData[];
}

const initialAgenda: AgendaFormData = {
  title: '',
  description: '',
  vote_type: 'approval',
  pass_threshold_percentage: 50,
  options: '',
};

const initialFormData: FormData = {
  title: '',
  description: '',
  meeting_date: '',
  vote_start_date: '',
  vote_end_date: '',
  vote_type: 'electronic_only',
  quorum_percentage: 50,
  pass_threshold_percentage: 50,
  max_revote_count: 0,
  agendas: [{ ...initialAgenda }],
};

export default function VoteMeetingCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const createMutation = useCreateMeeting();

  // 기본 정보 변경
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 안건 변경
  const handleAgendaChange = (index: number, field: keyof AgendaFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      agendas: prev.agendas.map((agenda, i) =>
        i === index ? { ...agenda, [field]: value } : agenda
      ),
    }));
  };

  // 안건 추가
  const handleAddAgenda = () => {
    setFormData((prev) => ({
      ...prev,
      agendas: [...prev.agendas, { ...initialAgenda }],
    }));
  };

  // 안건 삭제
  const handleRemoveAgenda = (index: number) => {
    if (formData.agendas.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      agendas: prev.agendas.filter((_, i) => i !== index),
    }));
  };

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    if (!formData.title.trim()) return false;
    if (!formData.meeting_date) return false;
    if (!formData.vote_start_date) return false;
    if (!formData.vote_end_date) return false;
    if (formData.agendas.length === 0) return false;
    if (formData.agendas.some((a) => !a.title.trim())) return false;
    return true;
  }, [formData]);

  // URL 복사
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setSnackbar({ open: true, message: 'URL이 복사되었습니다.', severity: 'success' });
  };

  // 저장
  const handleSave = useCallback(async () => {
    if (!isFormValid()) {
      setSnackbar({ open: true, message: '필수 항목을 모두 입력해주세요.', severity: 'error' });
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        projectId: PROJECT_ID,
        data: {
          title: formData.title,
          description: formData.description,
          meeting_date: formData.meeting_date,
          vote_start_date: formData.vote_start_date,
          vote_end_date: formData.vote_end_date,
          vote_type: formData.vote_type,
          quorum_percentage: formData.quorum_percentage,
          pass_threshold_percentage: formData.pass_threshold_percentage,
          max_revote_count: formData.max_revote_count,
          agendas: formData.agendas.map((a, idx) => ({
            order: idx + 1,
            title: a.title,
            description: a.description,
            vote_type: a.vote_type,
            pass_threshold_percentage: a.pass_threshold_percentage,
            options: a.vote_type === 'selection' ? a.options : undefined,
          })),
        },
      });

      // URL 생성
      const uuid = `vote-uuid-${result.id.toString().padStart(3, '0')}`;
      const url = `https://vote.compass1998.com/${uuid}`;
      setGeneratedUrl(url);

      setSnackbar({ open: true, message: '전자투표가 생성되었습니다.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '생성에 실패했습니다.', severity: 'error' });
    }
  }, [formData, isFormValid, createMutation]);

  return (
    <>
      <Box>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vote/meetings')}
            sx={{ mb: 2 }}
          >
            목록으로
          </Button>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            전자투표 생성
          </Typography>
          <Typography variant="body2" color="text.secondary">
            총회 정보와 안건을 등록하고 투표 URL을 생성합니다.
          </Typography>
        </Box>

        {/* 생성된 URL */}
        {generatedUrl && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" startIcon={<CopyIcon />} onClick={handleCopyUrl}>
                복사
              </Button>
            }
          >
            <Typography variant="body2" fontWeight={600}>
              투표 URL이 생성되었습니다
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
              {generatedUrl}
            </Typography>
          </Alert>
        )}

        {/* 기본 정보 */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            기본 정보
          </Typography>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <TextField
              label="총회명"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              fullWidth
              placeholder="예: 2025년 제1차 정기총회"
            />

            <TextField
              label="설명"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="총회에 대한 간단한 설명"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <TextField
                label="총회일"
                type="date"
                value={formData.meeting_date}
                onChange={(e) => handleChange('meeting_date', e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="투표 시작일시"
                type="datetime-local"
                value={formData.vote_start_date}
                onChange={(e) => handleChange('vote_start_date', e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="투표 종료일시"
                type="datetime-local"
                value={formData.vote_end_date}
                onChange={(e) => handleChange('vote_end_date', e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <FormControl>
                <FormLabel>투표 방식</FormLabel>
                <RadioGroup
                  row
                  value={formData.vote_type}
                  onChange={(e) => handleChange('vote_type', e.target.value)}
                >
                  <FormControlLabel
                    value="electronic_only"
                    control={<Radio />}
                    label="전자투표만"
                  />
                  <FormControlLabel
                    value="electronic_paper"
                    control={<Radio />}
                    label="전자+서면투표"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl size="small">
                <InputLabel>재투표 허용</InputLabel>
                <Select
                  value={formData.max_revote_count}
                  label="재투표 허용"
                  onChange={(e) => handleChange('max_revote_count', e.target.value)}
                >
                  <MenuItem value={0}>재투표 불가</MenuItem>
                  <MenuItem value={1}>1회 허용</MenuItem>
                  <MenuItem value={2}>2회 허용</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="의결정족수 (%)"
                type="number"
                value={formData.quorum_percentage}
                onChange={(e) => handleChange('quorum_percentage', Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                helperText="의결이 유효하려면 필요한 최소 참석률"
              />
              <TextField
                label="가결 기준 (%)"
                type="number"
                value={formData.pass_threshold_percentage}
                onChange={(e) => handleChange('pass_threshold_percentage', Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                helperText="안건 가결에 필요한 최소 찬성률"
              />
            </Box>
          </Box>
        </Paper>

        {/* 안건 목록 */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              안건 목록
            </Typography>
            <Button startIcon={<AddIcon />} onClick={handleAddAgenda} size="small">
              안건 추가
            </Button>
          </Box>

          {formData.agendas.map((agenda, index) => (
            <Paper
              key={index}
              sx={{
                p: 2.5,
                mb: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  제{index + 1}호 안건
                </Typography>
                {formData.agendas.length > 1 && (
                  <IconButton size="small" onClick={() => handleRemoveAgenda(index)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="안건명"
                  value={agenda.title}
                  onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="예: 2025년도 사업계획(안) 승인의 건"
                />

                <TextField
                  label="안건 설명"
                  value={agenda.description}
                  onChange={(e) => handleAgendaChange(index, 'description', e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <FormControl size="small">
                    <InputLabel>투표 유형</InputLabel>
                    <Select
                      value={agenda.vote_type}
                      label="투표 유형"
                      onChange={(e) => handleAgendaChange(index, 'vote_type', e.target.value as AgendaVoteType)}
                    >
                      <MenuItem value="approval">찬반형 (찬성/반대/기권)</MenuItem>
                      <MenuItem value="selection">선택형 (복수 옵션 중 택1)</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="가결 기준 (%)"
                    type="number"
                    value={agenda.pass_threshold_percentage}
                    onChange={(e) => handleAgendaChange(index, 'pass_threshold_percentage', Number(e.target.value))}
                    size="small"
                    slotProps={{ htmlInput: { min: 0, max: 100 } }}
                  />
                </Box>

                {agenda.vote_type === 'selection' && (
                  <TextField
                    label="선택 옵션"
                    value={agenda.options}
                    onChange={(e) => handleAgendaChange(index, 'options', e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="쉼표로 구분 (예: A 관리업체, B 관리업체, C 관리업체)"
                    helperText="선택 가능한 옵션들을 쉼표로 구분하여 입력"
                  />
                )}
              </Box>
            </Paper>
          ))}
        </Paper>

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/vote/meetings')}
            disabled={createMutation.isPending}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid() || createMutation.isPending}
            startIcon={createMutation.isPending && <CircularProgress size={16} color="inherit" />}
          >
            {createMutation.isPending ? '생성 중...' : '전자투표 생성'}
          </Button>
        </Box>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
