
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import dayjs from 'dayjs';
import type { DateRangeFilter as DateRangeFilterType } from '@/src/types/dashboard';

interface DateRangeFilterProps {
  value: DateRangeFilterType;
  onChange: (value: DateRangeFilterType) => void;
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const getDateRangeLabel = (type: DateRangeFilterType): string => {
    const today = dayjs();
    switch (type) {
      case '7days':
        return `${today.subtract(6, 'day').format('MM.DD')} - ${today.format('MM.DD')}`;
      case '30days':
        return `${today.subtract(29, 'day').format('MM.DD')} - ${today.format('MM.DD')}`;
      case 'year':
        return `${today.startOf('year').format('YYYY.MM.DD')} - ${today.format('YYYY.MM.DD')}`;
      case 'custom':
        return '사용자 지정';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          기간:
        </Typography>
        <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {getDateRangeLabel(value)}
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: 2,
            py: 0.5,
            fontSize: '0.8125rem',
            textTransform: 'none',
          },
        }}
      >
        <ToggleButton value="7days">최근 7일</ToggleButton>
        <ToggleButton value="30days">최근 30일</ToggleButton>
        <ToggleButton value="year">연간</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
