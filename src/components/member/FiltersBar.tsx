
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
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ResidentFilters, MemberLevel } from '@/src/types/member';

interface FiltersBarProps {
  filters: ResidentFilters;
  onFiltersChange: (filters: ResidentFilters) => void;
}

const searchTypeOptions = [
  { value: 'memberId', label: '회원아이디' },
  { value: 'contractorName', label: '계약자명' },
  { value: 'residentName', label: '입주자명' },
];

const memberTypeOptions = [
  { value: '입주자', label: '입주자' },
  { value: '계약자', label: '계약자' },
];

const levelOptions = [
  { value: 'GENERAL', label: '일반' },
  { value: 'VIP', label: 'VIP' },
  { value: 'VVIP', label: 'VVIP' },
];

const blockedOptions = [
  { value: '', label: '전체' },
  { value: 'false', label: '접근' },
  { value: 'true', label: '차단' },
];

export default function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<ResidentFilters>(filters);

  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      searchType: event.target.value as 'memberId' | 'contractorName' | 'residentName',
    });
  };

  const handleSearchKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, searchKeyword: event.target.value });
  };

  const handleMemberTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, memberType: event.target.value || undefined });
  };

  const handleDongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, dong: event.target.value || undefined });
  };

  const handleHoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, ho: event.target.value || undefined });
  };

  const handleLevelChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, level: (event.target.value || undefined) as MemberLevel | undefined });
  };

  const handleBlockedChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setLocalFilters({ ...localFilters, isBlocked: value === '' ? undefined : value === 'true' });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: ResidentFilters = {};
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
      {/* 첫 번째 줄: 검색 */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>검색 타입</InputLabel>
          <Select
            value={localFilters.searchType || ''}
            label="검색 타입"
            onChange={handleSearchTypeChange}
          >
            <MenuItem value="">전체</MenuItem>
            {searchTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="검색어를 입력하세요"
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchKeywordChange}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
        />
      </Box>

      {/* 두 번째 줄: 필터 */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>회원구분</InputLabel>
          <Select
            value={localFilters.memberType || ''}
            label="회원구분"
            onChange={handleMemberTypeChange}
          >
            <MenuItem value="">전체</MenuItem>
            {memberTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="동"
          value={localFilters.dong || ''}
          onChange={handleDongChange}
          sx={{ width: 80 }}
        />

        <TextField
          size="small"
          label="호"
          value={localFilters.ho || ''}
          onChange={handleHoChange}
          sx={{ width: 80 }}
        />

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>회원레벨</InputLabel>
          <Select
            value={localFilters.level || ''}
            label="회원레벨"
            onChange={handleLevelChange}
          >
            <MenuItem value="">전체</MenuItem>
            {levelOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>접근/차단</InputLabel>
          <Select
            value={localFilters.isBlocked === undefined ? '' : String(localFilters.isBlocked)}
            label="접근/차단"
            onChange={handleBlockedChange}
          >
            {blockedOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

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
          검색
        </Button>
      </Box>
    </Paper>
  );
}
