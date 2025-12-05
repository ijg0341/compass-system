
import React, { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { useAvailableSlots, useDongs, useDongHos } from '@/src/hooks/useReservation';
import type { CreateVisitScheduleRequest } from '@/src/lib/api/reservationApi';

interface ScheduleFormProps {
  onSubmit: (data: CreateVisitScheduleRequest) => void;
  isSubmitting?: boolean;
}

interface FormState {
  visitDate: string;
  visitTime: string;
  dongId: string;
  dongHoId: string;
  residentName: string;
  residentPhone: string;
}

export default function ScheduleForm({ onSubmit, isSubmitting = false }: ScheduleFormProps) {
  const [formData, setFormData] = useState<FormState>({
    visitDate: '',
    visitTime: '',
    dongId: '',
    dongHoId: '',
    residentName: '',
    residentPhone: '',
  });

  // API 데이터 조회
  const { data: availableSlots, isLoading: isSlotsLoading } = useAvailableSlots(1);
  const { data: dongs, isLoading: isDongsLoading } = useDongs(availableSlots?.visit_info_id || 1);
  const { data: dongHos, isLoading: isDongHosLoading } = useDongHos(
    availableSlots?.visit_info_id || 1,
    formData.dongId || undefined
  );

  // 선택된 날짜의 시간 옵션
  const timeOptions = useMemo(() => {
    if (!availableSlots?.dates || !formData.visitDate) return [];
    const dateData = availableSlots.dates.find(d => d.date === formData.visitDate);
    if (!dateData) return [];
    return dateData.times.filter(t => t.available > 0).map(t => ({
      time: t.time.slice(0, 5), // "10:00:00" -> "10:00"
      available: t.available,
    }));
  }, [availableSlots, formData.visitDate]);

  // 날짜 옵션
  const dateOptions = useMemo(() => {
    if (!availableSlots?.dates) return [];
    return availableSlots.dates.map(d => d.date);
  }, [availableSlots]);

  // 선택된 동에 해당하는 호수 목록
  const filteredDongHos = useMemo(() => {
    if (!dongHos || !formData.dongId) return [];
    return dongHos.filter(ho => ho.dong_id === formData.dongId);
  }, [dongHos, formData.dongId]);

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;

    setFormData(prev => {
      // 동 변경 시 호수 초기화
      if (field === 'dongId') {
        return {
          ...prev,
          [field]: value,
          dongHoId: '',
        };
      }

      // 날짜 변경 시 시간 초기화
      if (field === 'visitDate') {
        return {
          ...prev,
          [field]: value,
          visitTime: '',
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!formData.visitDate || !formData.visitTime || !formData.dongHoId) {
      alert('필수 항목을 입력해주세요. (방문일, 시간, 동, 호)');
      return;
    }

    const requestData: CreateVisitScheduleRequest = {
      visit_info_id: availableSlots?.visit_info_id || 1,
      visit_date: formData.visitDate,
      visit_time: formData.visitTime,
      dong_ho_id: parseInt(formData.dongHoId, 10),
      resident_name: formData.residentName || undefined,
      resident_phone: formData.residentPhone || undefined,
    };

    onSubmit(requestData);

    // 폼 초기화
    setFormData({
      visitDate: '',
      visitTime: '',
      dongId: '',
      dongHoId: '',
      residentName: '',
      residentPhone: '',
    });
  };

  const isLoading = isSlotsLoading || isDongsLoading;

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
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          {/* 방문일 (필수) */}
          <FormControl size="small" sx={{ minWidth: 150 }} required>
            <InputLabel>방문일</InputLabel>
            <Select
              value={formData.visitDate}
              onChange={handleChange('visitDate')}
              label="방문일"
            >
              {dateOptions.map(date => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 시간 (필수) */}
          <FormControl size="small" sx={{ minWidth: 110 }} required disabled={!formData.visitDate}>
            <InputLabel>시간</InputLabel>
            <Select
              value={formData.visitTime}
              onChange={handleChange('visitTime')}
              label="시간"
            >
              {timeOptions.map(({ time, available }) => (
                <MenuItem key={time} value={time}>
                  {time} ({available}석)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 동 (필수) */}
          <FormControl size="small" sx={{ minWidth: 100 }} required>
            <InputLabel>동</InputLabel>
            <Select
              value={formData.dongId}
              onChange={handleChange('dongId')}
              label="동"
            >
              {dongs?.map(dong => (
                <MenuItem key={dong.id} value={dong.id}>
                  {dong.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 호 (필수, 동 선택 시 활성화) */}
          <FormControl size="small" sx={{ minWidth: 100 }} required disabled={!formData.dongId || isDongHosLoading}>
            <InputLabel>호</InputLabel>
            <Select
              value={formData.dongHoId}
              onChange={handleChange('dongHoId')}
              label="호"
            >
              {filteredDongHos.map(ho => (
                <MenuItem key={ho.id} value={ho.id}>
                  {ho.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 성함 */}
          <TextField
            label="성함"
            size="small"
            value={formData.residentName}
            onChange={handleChange('residentName')}
            sx={{ minWidth: 100 }}
          />

          {/* 연락처 */}
          <TextField
            label="연락처"
            size="small"
            value={formData.residentPhone}
            onChange={handleChange('residentPhone')}
            placeholder="010-0000-0000"
            sx={{ minWidth: 140 }}
          />

          {/* 등록 버튼 */}
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              minWidth: 80,
              height: 40,
              bgcolor: '#E63C2E',
              '&:hover': {
                bgcolor: '#C44233',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : '등록'}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
