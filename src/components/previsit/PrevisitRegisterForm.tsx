import { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
  type SelectChangeEvent,
} from '@mui/material';
import dayjs from 'dayjs';
import { usePrevisits, usePrevisitDongs, usePrevisitDonghos } from '@/src/hooks/usePrevisit';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { PrevisitDataRequest, ResidenceType } from '@/src/types/previsit.types';
import { RESIDENCE_TYPE_LABELS } from '@/src/types/previsit.types';

// 시간 옵션 생성 (06:00 ~ 20:00, 10분 단위)
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 20; h++) {
  for (let m = 0; m < 60; m += 10) {
    TIME_OPTIONS.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
}

interface PrevisitRegisterFormProps {
  onSubmit: (data: PrevisitDataRequest) => void;
  isSubmitting?: boolean;
  initialPrevisitId?: number;
}

interface FormState {
  previsit_id: number | '';
  visit_date: string;
  visit_time: string;
  dong: string;
  dongho_id: number | '';
  residence_type: ResidenceType | '';
  move_in_date: string;
  visitor_name: string;
  visitor_phone: string;
  rental_device_no: string;
  companion: string;
}

export default function PrevisitRegisterForm({
  onSubmit,
  isSubmitting = false,
  initialPrevisitId,
}: PrevisitRegisterFormProps) {
  const { projectUuid } = useCurrentProject();
  const [formData, setFormData] = useState<FormState>({
    previsit_id: initialPrevisitId || '',
    visit_date: dayjs().format('YYYY-MM-DD'),
    visit_time: dayjs().format('HH:mm'),
    dong: '',
    dongho_id: '',
    residence_type: '',
    move_in_date: '',
    visitor_name: '',
    visitor_phone: '',
    rental_device_no: '',
    companion: '',
  });

  // API 데이터 조회
  const { data: previsitsData, isLoading: isPrevisitsLoading } = usePrevisits(projectUuid);
  const previsits = useMemo(() => previsitsData?.list || [], [previsitsData]);

  const { data: dongs, isLoading: isDongsLoading } = usePrevisitDongs(projectUuid);
  const { data: donghos, isLoading: isDonghosLoading } = usePrevisitDonghos(projectUuid, formData.dong || undefined);

  // 선택된 동호 정보
  const selectedDongho = useMemo(() => {
    if (!donghos || !formData.dongho_id) return null;
    return donghos.find((dh) => dh.id === formData.dongho_id);
  }, [donghos, formData.dongho_id]);

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>
  ) => {
    const value = event.target.value;

    setFormData((prev) => {
      // 동 변경 시 호수 초기화
      if (field === 'dong') {
        return { ...prev, dong: value as string, dongho_id: '' };
      }
      // 행사 변경
      if (field === 'previsit_id') {
        return { ...prev, previsit_id: value === '' ? '' : Number(value) };
      }
      // 호수 변경
      if (field === 'dongho_id') {
        return { ...prev, dongho_id: value === '' ? '' : Number(value) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = () => {
    if (!formData.previsit_id || !formData.dongho_id || !formData.visitor_name || !formData.visitor_phone) {
      alert('필수 항목을 입력해주세요. (행사명, 동, 호, 방문자명, 연락처)');
      return;
    }

    const requestData: PrevisitDataRequest = {
      previsit_id: formData.previsit_id as number,
      dongho_id: formData.dongho_id as number,
      visit_date: formData.visit_date,
      visit_time: formData.visit_time,
      visitor_name: formData.visitor_name,
      visitor_phone: formData.visitor_phone,
      companion: formData.companion || undefined,
      rental_device_no: formData.rental_device_no || undefined,
      rental_device_return: false,
    };

    onSubmit(requestData);

    // 폼 초기화 (행사 유지)
    setFormData((prev) => ({
      ...prev,
      dong: '',
      dongho_id: '',
      residence_type: '',
      move_in_date: '',
      visitor_name: '',
      visitor_phone: '',
      rental_device_no: '',
      companion: '',
    }));
  };

  const isLoading = isPrevisitsLoading || isDongsLoading;

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
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* 1행: 행사, 방문일, 시간, 동, 호, 계약자이름, 계약자연락처, 입주형태, 입주예정 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 140 }} required>
              <InputLabel>행사명</InputLabel>
              <Select
                value={formData.previsit_id}
                onChange={handleChange('previsit_id')}
                label="행사명"
              >
                <MenuItem value="">선택</MenuItem>
                {previsits.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="방문일"
              size="small"
              value={formData.visit_date}
              onChange={handleChange('visit_date')}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
              required
            />

            <FormControl size="small" sx={{ minWidth: 90 }} required>
              <InputLabel>시간</InputLabel>
              <Select
                value={formData.visit_time}
                onChange={handleChange('visit_time')}
                label="시간"
              >
                {TIME_OPTIONS.map((time) => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 80 }} required>
              <InputLabel>동</InputLabel>
              <Select
                value={formData.dong}
                onChange={handleChange('dong')}
                label="동"
              >
                <MenuItem value="">선택</MenuItem>
                {dongs?.map((dong) => (
                  <MenuItem key={dong} value={dong}>{dong}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 80 }} required disabled={!formData.dong || isDonghosLoading}>
              <InputLabel>호</InputLabel>
              <Select
                value={formData.dongho_id}
                onChange={handleChange('dongho_id')}
                label="호"
              >
                <MenuItem value="">선택</MenuItem>
                {donghos?.map((dh) => (
                  <MenuItem key={dh.id} value={dh.id}>{dh.ho}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="계약자 이름"
              size="small"
              value={selectedDongho?.contractor_name || ''}
              disabled
              placeholder="자동"
              sx={{ minWidth: 100 }}
            />

            <TextField
              label="계약자 연락처"
              size="small"
              value={selectedDongho?.contractor_phone || ''}
              disabled
              placeholder="자동"
              sx={{ minWidth: 120 }}
            />

            <FormControl size="small" sx={{ minWidth: 90 }}>
              <InputLabel>입주형태</InputLabel>
              <Select
                value={formData.residence_type}
                onChange={handleChange('residence_type')}
                label="입주형태"
              >
                <MenuItem value="">선택</MenuItem>
                {Object.entries(RESIDENCE_TYPE_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="입주예정"
              size="small"
              value={formData.move_in_date}
              onChange={handleChange('move_in_date')}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
          </Box>

          {/* 2행: 방문자명, 방문자연락처, 단말기번호, 동행, 등록버튼 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              label="방문자명"
              size="small"
              value={formData.visitor_name}
              onChange={handleChange('visitor_name')}
              sx={{ minWidth: 100 }}
              required
            />

            <TextField
              label="방문자 연락처"
              size="small"
              value={formData.visitor_phone}
              onChange={handleChange('visitor_phone')}
              placeholder="010-0000-0000"
              sx={{ minWidth: 140 }}
              required
            />

            <TextField
              label="단말기번호"
              size="small"
              value={formData.rental_device_no}
              onChange={handleChange('rental_device_no')}
              placeholder="D001"
              sx={{ minWidth: 100 }}
            />

            <TextField
              label="동행"
              size="small"
              value={formData.companion}
              onChange={handleChange('companion')}
              placeholder="동행자 수"
              sx={{ minWidth: 80 }}
            />

            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                minWidth: 80,
                height: 40,
                bgcolor: '#333',
                '&:hover': { bgcolor: '#444' },
              }}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : '등록하기'}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
