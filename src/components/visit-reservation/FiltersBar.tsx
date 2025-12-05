
import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Paper,
  type SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { VisitReservationFilter, VisitReservationStatus } from '@/src/types/reservation';
import { mockBuildingOptions } from '@/src/lib/mockData/reservationData';

interface FiltersBarProps {
  filters: VisitReservationFilter;
  onFiltersChange: (filters: VisitReservationFilter) => void;
}

const statusOptions: { value: VisitReservationStatus; label: string; color: string }[] = [
  { value: 'pending', label: '대기중', color: '#FF9800' },
  { value: 'confirmed', label: '확정', color: '#2196F3' },
  { value: 'completed', label: '완료', color: '#4CAF50' },
  { value: 'cancelled', label: '취소', color: '#F44336' },
];

export default function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<VisitReservationFilter>(filters);

  const handleBuildingChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, building: event.target.value || undefined, unit: undefined });
  };

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, unit: event.target.value || undefined });
  };

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatuses: VisitReservationStatus[]
  ) => {
    setLocalFilters({ ...localFilters, status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, searchKeyword: event.target.value || undefined });
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, startDate: event.target.value || undefined });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, endDate: event.target.value || undefined });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: VisitReservationFilter = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const selectedBuilding = mockBuildingOptions.find((b) => b.name === localFilters.building);
  const unitOptions = selectedBuilding?.units || [];

  return (
    <Paper
      sx={{
        p: 1.5,
        mb: 2,
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 첫 번째 줄: 날짜 범위, 동, 호수, 검색어 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'auto auto auto auto 1fr',
          },
          gap: 1,
          mb: 1,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          type="date"
          label="시작일"
          value={localFilters.startDate || ''}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <TextField
          size="small"
          type="date"
          label="종료일"
          value={localFilters.endDate || ''}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>동</InputLabel>
          <Select
            value={localFilters.building || ''}
            label="동"
            onChange={handleBuildingChange}
          >
            <MenuItem value="">전체</MenuItem>
            {mockBuildingOptions.map((building) => (
              <MenuItem key={building.id} value={building.name}>
                {building.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>호수</InputLabel>
          <Select
            value={localFilters.unit || ''}
            label="호수"
            onChange={handleUnitChange}
            disabled={!selectedBuilding}
          >
            <MenuItem value="">전체</MenuItem>
            {unitOptions.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="이름 또는 연락처 검색..."
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
        />
      </Box>

      {/* 두 번째 줄: 상태 필터 + 버튼 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <ToggleButtonGroup
          value={localFilters.status || []}
          onChange={handleStatusChange}
          size="small"
          sx={{ flexWrap: 'wrap', gap: 0.5 }}
        >
          {statusOptions.map((status) => (
            <ToggleButton
              key={status.value}
              value={status.value}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: status.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: status.color,
                  },
                },
              }}
            >
              {status.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          onClick={handleReset}
          size="small"
          sx={{ minWidth: 'auto', px: 1.5 }}
        >
          초기화
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          size="small"
          sx={{ minWidth: 'auto', px: 1.5 }}
        >
          적용
        </Button>
      </Box>
    </Paper>
  );
}
