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

export interface PrevisitDataFilter {
  previsit_id?: number;
  searchKeyword?: string;
  dong?: string;
  rental_device_no?: string;
  rental_device_return?: boolean;
}

interface PrevisitDataFiltersProps {
  filters: PrevisitDataFilter;
  onFiltersChange: (filters: PrevisitDataFilter) => void;
  previsits: Previsit[];
  dongs: string[];
}

export default function PrevisitDataFilters({
  filters,
  onFiltersChange,
  previsits,
  dongs,
}: PrevisitDataFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PrevisitDataFilter>(filters);

  const handlePrevisitChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;
    setLocalFilters((prev) => ({
      ...prev,
      previsit_id: value === '' ? undefined : Number(value),
    }));
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters((prev) => ({ ...prev, dong: event.target.value || undefined }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, searchKeyword: event.target.value || undefined }));
  };

  const handleDeviceNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, rental_device_no: event.target.value || undefined }));
  };

  const handleDeviceReturnChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setLocalFilters((prev) => ({
      ...prev,
      rental_device_return: value === '' ? undefined : value === 'true',
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: PrevisitDataFilter = {};
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

        {/* 동 선택 */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>동</InputLabel>
          <Select
            value={localFilters.dong || ''}
            label="동"
            onChange={handleDongChange}
          >
            <MenuItem value="">전체</MenuItem>
            {dongs.map((dong) => (
              <MenuItem key={dong} value={dong}>
                {dong}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 단말기번호 */}
        <TextField
          size="small"
          placeholder="단말기 No"
          value={localFilters.rental_device_no || ''}
          onChange={handleDeviceNoChange}
          sx={{ minWidth: 100 }}
        />

        {/* 단말기회수 */}
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>단말기회수</InputLabel>
          <Select
            value={localFilters.rental_device_return === undefined ? '' : String(localFilters.rental_device_return)}
            label="단말기회수"
            onChange={handleDeviceReturnChange}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="true">회수완료</MenuItem>
            <MenuItem value="false">미회수</MenuItem>
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
          sx={{ minWidth: 'auto', px: 1.5, bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          검색
        </Button>
      </Box>
    </Paper>
  );
}
