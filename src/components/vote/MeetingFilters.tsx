/**
 * 총회 목록 필터
 * 화면 ID: CP-SA-09-001
 */
import { useState } from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import type { MeetingStatus } from '@/src/types/vote.types';

export interface MeetingFilter {
  searchKeyword?: string;
  status?: MeetingStatus;
}

interface MeetingFiltersProps {
  filters: MeetingFilter;
  onFiltersChange: (filters: MeetingFilter) => void;
}

const statusOptions: { value: MeetingStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'draft', label: '준비중' },
  { value: 'active', label: '투표중' },
  { value: 'closed', label: '마감' },
  { value: 'completed', label: '완료' },
];

export default function MeetingFilters({ filters, onFiltersChange }: MeetingFiltersProps) {
  const [localKeyword, setLocalKeyword] = useState(filters.searchKeyword || '');

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, newStatus: MeetingStatus | '') => {
    onFiltersChange({
      ...filters,
      status: newStatus || undefined,
    });
  };

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      searchKeyword: localKeyword || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setLocalKeyword('');
    onFiltersChange({});
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 2,
        p: 2,
        background: 'rgba(26, 26, 26, 0.5)',
        borderRadius: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* 상태 필터 */}
      <ToggleButtonGroup
        value={filters.status || ''}
        exclusive
        onChange={handleStatusChange}
        size="small"
        sx={{ flexShrink: 0 }}
      >
        {statusOptions.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            sx={{
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* 검색어 */}
      <TextField
        size="small"
        placeholder="총회명 검색"
        value={localKeyword}
        onChange={(e) => setLocalKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1, maxWidth: 300 }}
      />

      {/* 버튼 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={handleSearch}>
          검색
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
        >
          초기화
        </Button>
      </Box>
    </Box>
  );
}
