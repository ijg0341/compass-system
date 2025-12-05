
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  type SelectChangeEvent,
} from '@mui/material';
import type { SmartnetVisitSettings } from '@/src/types/smartnet';

interface VisitSettingsProps {
  settings: SmartnetVisitSettings;
  onChange: (settings: SmartnetVisitSettings) => void;
}

export default function VisitSettings({ settings, onChange }: VisitSettingsProps) {
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, startDate: event.target.value });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, endDate: event.target.value });
  };

  const handleIntervalChange = (event: SelectChangeEvent<number>) => {
    onChange({ ...settings, timeInterval: event.target.value as 30 | 60 });
  };

  const handleMaxReservationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onChange({ ...settings, maxReservationsPerSlot: value });
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        방문예약 세부설정
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        * 기간: 시작일~종료일 (1~5일), 시간대: 30분~1시간 단위, 세대수: 시간대별 예약 가능 세대수
      </Typography>

      <Stack spacing={2}>
        {/* 기간 설정 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            type="date"
            label="시작일"
            value={settings.startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            fullWidth
            type="date"
            label="종료일"
            value={settings.endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Box>

        {/* 시간대 설정 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>시간 단위</InputLabel>
            <Select
              value={settings.timeInterval}
              label="시간 단위"
              onChange={handleIntervalChange}
            >
              <MenuItem value={30}>30분</MenuItem>
              <MenuItem value={60}>1시간</MenuItem>
            </Select>
          </FormControl>

          {/* 세대수 설정 */}
          <TextField
            fullWidth
            type="number"
            label="시간대별 최대 예약 세대수"
            value={settings.maxReservationsPerSlot}
            onChange={handleMaxReservationsChange}
            inputProps={{ min: 1, max: 100 }}
            size="small"
          />
        </Box>
      </Stack>
    </Box>
  );
}
