
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  type SelectChangeEvent,
} from '@mui/material';
import type { SmartnetMoveSettings } from '@/src/types/smartnet';

interface MoveSettingsProps {
  settings: SmartnetMoveSettings;
  onChange: (settings: SmartnetMoveSettings) => void;
}

export default function MoveSettings({ settings, onChange }: MoveSettingsProps) {
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, startDate: event.target.value });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, endDate: event.target.value });
  };

  const handleDurationChange = (event: SelectChangeEvent<number>) => {
    onChange({ ...settings, timeSlotDuration: event.target.value as 1 | 2 | 3 });
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        이사예약 세부설정
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        * 기간: 15~90일, 시간범위: 1~3시간 단위
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

        {/* 시간범위 설정 */}
        <FormControl fullWidth size="small">
          <InputLabel>시간 단위</InputLabel>
          <Select
            value={settings.timeSlotDuration}
            label="시간 단위"
            onChange={handleDurationChange}
          >
            <MenuItem value={1}>1시간</MenuItem>
            <MenuItem value={2}>2시간</MenuItem>
            <MenuItem value={3}>3시간</MenuItem>
          </Select>
        </FormControl>

        {/* 자동 제약 안내 */}
        <Alert severity="info" sx={{ mt: 1 }}>
          자동 제약: 승강기 라인당 1일 각 시간대별 1회만 예약 가능
        </Alert>
      </Stack>
    </Box>
  );
}
