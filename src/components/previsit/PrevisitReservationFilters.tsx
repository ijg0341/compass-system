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
import type { Previsit } from '@/src/types/previsit.types';

export interface PrevisitReservationFilter {
  previsit_id?: number;
  searchKeyword?: string;
}

interface PrevisitReservationFiltersProps {
  filters: PrevisitReservationFilter;
  onFiltersChange: (filters: PrevisitReservationFilter) => void;
  previsits: Previsit[];
}

export default function PrevisitReservationFilters({
  filters,
  onFiltersChange,
  previsits,
}: PrevisitReservationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PrevisitReservationFilter>(filters);

  const handlePrevisitChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;
    setLocalFilters((prev) => ({
      ...prev,
      previsit_id: value === '' ? undefined : Number(value),
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, searchKeyword: event.target.value || undefined }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: PrevisitReservationFilter = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {/* 행사명 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>행사명</InputLabel>
          <Select
            value={localFilters.previsit_id || ''}
            label="행사명"
            onChange={handlePrevisitChange}
          >
            <MenuItem value="">전체</MenuItem>
            {previsits.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 검색어 */}
        <TextField
          size="small"
          placeholder="이름/연락처"
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
          sx={{ minWidth: 150 }}
        />

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
          sx={{ minWidth: 'auto', px: 1.5, bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          검색
        </Button>
      </Box>
    </Paper>
  );
}
