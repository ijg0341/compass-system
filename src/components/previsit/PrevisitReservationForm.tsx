import { useState, useMemo, useCallback } from 'react';
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
import { Add as AddIcon } from '@mui/icons-material';
import {
  usePrevisits,
  usePrevisitAvailableSlots,
  usePrevisitDongs,
  usePrevisitDonghos,
} from '@/src/hooks/usePrevisit';
import type { PrevisitReservationRequest, PrevisitAvailableTimeSlot } from '@/src/types/previsit.types';

// 현재 프로젝트 ID (추후 프로젝트 선택 기능 구현 시 동적으로 변경)
const PROJECT_ID = 1;

interface PrevisitReservationFormProps {
  onSubmit: (data: PrevisitReservationRequest) => void;
  isSubmitting?: boolean;
  initialPrevisitId?: number;
}

interface FormState {
  previsit_id: number | '';
  dong: string;
  dongho_id: number | '';
  reservation_date: string;
  reservation_time: string;
  writer_name: string;
  writer_phone: string;
  memo: string;
}

export default function PrevisitReservationForm({
  onSubmit,
  isSubmitting = false,
  initialPrevisitId,
}: PrevisitReservationFormProps) {
  const [formData, setFormData] = useState<FormState>({
    previsit_id: initialPrevisitId || '',
    dong: '',
    dongho_id: '',
    reservation_date: '',
    reservation_time: '',
    writer_name: '',
    writer_phone: '',
    memo: '',
  });

  // API 데이터 조회
  const { data: previsitsData, isLoading: isPrevisitsLoading } = usePrevisits(PROJECT_ID);
  const previsits = useMemo(() => previsitsData?.list || [], [previsitsData]);

  const { data: availableSlots } = usePrevisitAvailableSlots(PROJECT_ID);
  const { data: dongs, isLoading: isDongsLoading } = usePrevisitDongs(PROJECT_ID);
  const { data: donghos, isLoading: isDonghosLoading } = usePrevisitDonghos(PROJECT_ID, formData.dong || undefined);

  // 선택된 동호 정보
  const selectedDongho = useMemo(() => {
    if (!donghos || !formData.dongho_id) return null;
    return donghos.find((dh) => dh.id === formData.dongho_id);
  }, [donghos, formData.dongho_id]);

  // 날짜 옵션
  const dateOptions = useMemo(() => {
    if (!availableSlots?.dates) return [];
    return availableSlots.dates.map((d) => d.date);
  }, [availableSlots]);

  // 선택된 날짜의 시간 옵션
  const timeOptions = useMemo(() => {
    if (!availableSlots?.dates || !formData.reservation_date) return [];
    const dateData = availableSlots.dates.find((d) => d.date === formData.reservation_date);
    if (!dateData) return [];
    return dateData.times.filter((t) => t.available > 0);
  }, [availableSlots, formData.reservation_date]);

  const handleChange = useCallback(
    (field: keyof FormState) =>
      (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>
      ) => {
        const value = event.target.value;

        setFormData((prev) => {
          // 행사 변경 시 날짜/시간 초기화
          if (field === 'previsit_id') {
            return {
              ...prev,
              previsit_id: value === '' ? '' : Number(value),
              reservation_date: '',
              reservation_time: '',
            };
          }
          // 동 변경 시 호수 초기화
          if (field === 'dong') {
            return { ...prev, dong: value as string, dongho_id: '' };
          }
          // 호수 변경
          if (field === 'dongho_id') {
            return { ...prev, dongho_id: value === '' ? '' : Number(value) };
          }
          // 날짜 변경 시 시간 초기화
          if (field === 'reservation_date') {
            return { ...prev, reservation_date: value as string, reservation_time: '' };
          }
          return { ...prev, [field]: value };
        });
      },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!formData.previsit_id || !formData.dongho_id || !formData.writer_name || !formData.writer_phone) {
      alert('필수 항목을 입력해주세요. (행사명, 동, 호, 신청자명, 연락처, 예약일, 예약시간)');
      return;
    }
    if (!formData.reservation_date || !formData.reservation_time) {
      alert('예약일과 예약시간을 선택해주세요.');
      return;
    }

    // 예약 가능 여부 체크
    const selectedTimeSlot = timeOptions.find(
      (t) => t.time.slice(0, 5) === formData.reservation_time
    );
    if (!selectedTimeSlot || selectedTimeSlot.available <= 0) {
      alert('선택한 시간대는 예약이 마감되었습니다. 다른 시간대를 선택해주세요.');
      return;
    }

    onSubmit({
      previsit_id: formData.previsit_id as number,
      dongho_id: formData.dongho_id as number,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      writer_name: formData.writer_name.trim(),
      writer_phone: formData.writer_phone.trim(),
      memo: formData.memo || undefined,
    });

    // 폼 초기화 (행사 유지)
    setFormData((prev) => ({
      ...prev,
      dong: '',
      dongho_id: '',
      reservation_date: '',
      reservation_time: '',
      writer_name: '',
      writer_phone: '',
      memo: '',
    }));
  }, [formData, timeOptions, onSubmit]);

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
          {/* 1행: 행사, 동, 호, 계약자이름, 계약자연락처 */}
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
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 80 }} required>
              <InputLabel>동</InputLabel>
              <Select value={formData.dong} onChange={handleChange('dong')} label="동">
                <MenuItem value="">선택</MenuItem>
                {dongs?.map((dong) => (
                  <MenuItem key={dong} value={dong}>
                    {dong}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 80 }}
              required
              disabled={!formData.dong || isDonghosLoading}
            >
              <InputLabel>호</InputLabel>
              <Select value={formData.dongho_id} onChange={handleChange('dongho_id')} label="호">
                <MenuItem value="">선택</MenuItem>
                {donghos?.map((dh) => (
                  <MenuItem key={dh.id} value={dh.id}>
                    {dh.ho}
                  </MenuItem>
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
          </Box>

          {/* 2행: 신청자, 신청자 연락처, 예약일, 예약시간, 메모, 등록버튼 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              label="신청자"
              size="small"
              value={formData.writer_name}
              onChange={handleChange('writer_name')}
              sx={{ minWidth: 100 }}
              required
            />

            <TextField
              label="신청자 연락처"
              size="small"
              value={formData.writer_phone}
              onChange={handleChange('writer_phone')}
              placeholder="010-0000-0000"
              sx={{ minWidth: 140 }}
              required
            />

            <FormControl size="small" sx={{ minWidth: 130 }} required disabled={!formData.previsit_id}>
              <InputLabel>예약일</InputLabel>
              <Select
                value={formData.reservation_date}
                onChange={handleChange('reservation_date')}
                label="예약일"
              >
                <MenuItem value="">선택</MenuItem>
                {dateOptions.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 120 }}
              required
              disabled={!formData.reservation_date}
            >
              <InputLabel>예약시간</InputLabel>
              <Select
                value={formData.reservation_time}
                onChange={handleChange('reservation_time')}
                label="예약시간"
              >
                <MenuItem value="">선택</MenuItem>
                {timeOptions.map((slot: PrevisitAvailableTimeSlot) => (
                  <MenuItem key={slot.time} value={slot.time.slice(0, 5)}>
                    {slot.time.slice(0, 5)} ({slot.available}석)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="메모"
              size="small"
              value={formData.memo}
              onChange={handleChange('memo')}
              sx={{ minWidth: 150 }}
            />

            <Button
              variant="contained"
              size="small"
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting}
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
      )}
    </Paper>
  );
}
