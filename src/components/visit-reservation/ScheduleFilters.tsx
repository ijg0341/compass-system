
import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  type SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { VisitScheduleFilter, VisitScheduleStatus } from '@/src/types/reservation';
import { mockBuildingOptions } from '@/src/lib/mockData/reservationData';

interface ScheduleFiltersProps {
  filters: VisitScheduleFilter;
  onFiltersChange: (filters: VisitScheduleFilter) => void;
}

const STATUS_OPTIONS: { value: '' | VisitScheduleStatus; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'empty', label: '대기' },
  { value: 'reserved', label: '예약완료' },
];

export default function ScheduleFilters({ filters, onFiltersChange }: ScheduleFiltersProps) {
  const [localFilters, setLocalFilters] = useState<VisitScheduleFilter>(filters);

  const handleBuildingChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, building: event.target.value || undefined, unit: undefined });
  };

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, unit: event.target.value || undefined });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as '' | VisitScheduleStatus;
    setLocalFilters({ ...localFilters, status: value || undefined });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, searchKeyword: event.target.value || undefined });
  };

  const handleTerminalNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, terminalNumber: event.target.value || undefined });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: VisitScheduleFilter = {};
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
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
        }}
      >
        {/* 검색어 */}
        <TextField
          size="small"
          placeholder="이름 또는 연락처 검색..."
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
          sx={{ minWidth: 200 }}
        />

        {/* 동 선택 */}
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

        {/* 호수 선택 */}
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

        {/* 단말기번호 */}
        <TextField
          size="small"
          placeholder="단말기번호"
          value={localFilters.terminalNumber || ''}
          onChange={handleTerminalNumberChange}
          sx={{ minWidth: 140 }}
        />

        {/* 단말기상태 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>단말기상태</InputLabel>
          <Select
            value={localFilters.status || ''}
            label="단말기상태"
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 여백 */}
        <Box sx={{ flexGrow: 1 }} />

        {/* 버튼 그룹 */}
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
