
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
  Chip,
  type SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type {
  SmartnetFilter,
  SmartnetCategory,
  SmartnetStatus,
} from '@/src/types/smartnet';
import { CATEGORY_LABELS } from '@/src/types/smartnet';

interface FiltersBarProps {
  filters: SmartnetFilter;
  onFiltersChange: (filters: SmartnetFilter) => void;
}

const statusOptions: { value: SmartnetStatus; label: string; color: string }[] = [
  { value: 'active', label: '활성', color: '#4CAF50' },
  { value: 'inactive', label: '비활성', color: '#9E9E9E' },
  { value: 'expired', label: '만료', color: '#F44336' },
];

export default function FiltersBar({
  filters,
  onFiltersChange,
}: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<SmartnetFilter>(filters);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      category: event.target.value ? (event.target.value as SmartnetCategory) : undefined,
    });
  };

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatuses: SmartnetStatus[]
  ) => {
    setLocalFilters({
      ...localFilters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      searchKeyword: event.target.value || undefined,
    });
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      startDate: event.target.value || undefined,
    });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      endDate: event.target.value || undefined,
    });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: SmartnetFilter = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  // 활성 필터 개수
  const activeFilterCount =
    (localFilters.category ? 1 : 0) +
    (localFilters.status && localFilters.status.length > 0 ? 1 : 0) +
    (localFilters.searchKeyword ? 1 : 0) +
    (localFilters.startDate ? 1 : 0) +
    (localFilters.endDate ? 1 : 0);

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
      {/* 첫 번째 줄: 카테고리, 날짜 범위, 검색어 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'auto auto auto 1fr',
          },
          gap: 1,
          mb: 1,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={localFilters.category || ''}
            label="카테고리"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="visit">{CATEGORY_LABELS.visit}</MenuItem>
            <MenuItem value="move">{CATEGORY_LABELS.move}</MenuItem>
          </Select>
        </FormControl>

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

        <TextField
          size="small"
          placeholder="제목으로 검색..."
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
                    opacity: 0.9,
                  },
                },
              }}
            >
              {status.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount}개 필터 적용`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}

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
