
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
import type {
  MoveReservationFilter,
  MoveReservationStatus,
  ElevatorLine,
} from '@/src/types/reservation';
import { mockBuildingOptions } from '@/src/lib/mockData/reservationData';

interface FiltersBarProps {
  filters: MoveReservationFilter;
  onFiltersChange: (filters: MoveReservationFilter) => void;
}

const statusOptions: { value: MoveReservationStatus; label: string; color: string }[] = [
  { value: 'active', label: '예약중', color: '#4CAF50' },
  { value: 'cancelled', label: '취소', color: '#F44336' },
];

const elevatorLineOptions: { value: ElevatorLine; label: string }[] = [
  { value: 'A', label: 'A라인' },
  { value: 'B', label: 'B라인' },
  { value: 'C', label: 'C라인' },
  { value: 'D', label: 'D라인' },
];

const moveTypeOptions = [
  { value: 'move_in', label: '입주' },
  { value: 'move_out', label: '퇴거' },
];

export default function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<MoveReservationFilter>(filters);

  const handleBuildingChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, building: event.target.value || undefined, unit: undefined });
  };

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, unit: event.target.value || undefined });
  };

  const handleElevatorLineChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, elevatorLine: (event.target.value as ElevatorLine) || undefined });
  };

  const handleMoveTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      moveType: (event.target.value as 'move_in' | 'move_out') || undefined,
    });
  };

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatuses: MoveReservationStatus[]
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
    const emptyFilters: MoveReservationFilter = {};
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
      {/* 첫 번째 줄: 날짜 범위, 검색 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'auto auto 1fr auto auto',
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
          sx={{ width: { xs: '100%', md: 150 } }}
        />

        <TextField
          size="small"
          type="date"
          label="종료일"
          value={localFilters.endDate || ''}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: '100%', md: 150 } }}
        />

        <TextField
          size="small"
          placeholder="이름 또는 전화번호 검색..."
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
        />

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

      {/* 두 번째 줄: 동, 호수, 승강기 라인, 이사 유형 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 1,
          mb: 1,
        }}
      >
        <FormControl fullWidth size="small">
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

        <FormControl fullWidth size="small">
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

        <FormControl fullWidth size="small">
          <InputLabel>승강기 라인</InputLabel>
          <Select
            value={localFilters.elevatorLine || ''}
            label="승강기 라인"
            onChange={handleElevatorLineChange}
          >
            <MenuItem value="">전체</MenuItem>
            {elevatorLineOptions.map((line) => (
              <MenuItem key={line.value} value={line.value}>
                {line.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>이사 유형</InputLabel>
          <Select
            value={localFilters.moveType || ''}
            label="이사 유형"
            onChange={handleMoveTypeChange}
          >
            <MenuItem value="">전체</MenuItem>
            {moveTypeOptions.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 세 번째 줄: 상태 필터 */}
      <Box sx={{ mb: 0 }}>
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
      </Box>
    </Paper>
  );
}
