
import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type {
  ASReceiptFilters,
  ASReceiptStatus,
  Priority,
} from '@/src/types/asReceipt';
import { mockSiteOptions, mockTradeOptions } from '@/src/lib/mockData/asReceiptData';

interface FiltersBarProps {
  filters: ASReceiptFilters;
  onFiltersChange: (filters: ASReceiptFilters) => void;
}

const statusOptions: { value: ASReceiptStatus; label: string; color: string }[] = [
  { value: 'RECEIVED', label: '접수', color: '#757575' },
  { value: 'ASSIGNED', label: '배정', color: '#757575' },
  { value: 'IN_PROGRESS', label: '진행중', color: '#2196F3' },
  { value: 'QA', label: '품질검수', color: '#2196F3' },
  { value: 'DONE', label: '완료', color: '#4CAF50' },
  { value: 'REJECTED', label: '반려', color: '#F44336' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
];

export default function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<ASReceiptFilters>(filters);

  const handleSiteChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, siteId: event.target.value });
  };

  const handleDongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, dong: event.target.value });
  };

  const handleHoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, ho: event.target.value });
  };

  const handleTradeChange = (
    _event: React.SyntheticEvent,
    value: { id: string; name: string } | null
  ) => {
    setLocalFilters({ ...localFilters, trade: value?.name, subTrade: undefined });
  };

  const handleSubTradeChange = (
    _event: React.SyntheticEvent,
    value: { id: string; name: string } | null
  ) => {
    setLocalFilters({ ...localFilters, subTrade: value?.name });
  };

  const handleStatusChange = (event: SelectChangeEvent<ASReceiptStatus[]>) => {
    const value = event.target.value;
    setLocalFilters({
      ...localFilters,
      status: typeof value === 'string' ? [value as ASReceiptStatus] : value,
    });
  };

  const handlePriorityChange = (event: SelectChangeEvent<Priority[]>) => {
    const value = event.target.value;
    setLocalFilters({
      ...localFilters,
      priority: typeof value === 'string' ? [value as Priority] : value,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, searchKeyword: event.target.value });
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, startDate: event.target.value });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, endDate: event.target.value });
  };

  const handleAssignedToMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, assignedToMe: event.target.checked });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: ASReceiptFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const selectedTrade = mockTradeOptions.find((t) => t.name === localFilters.trade);
  const subTradeOptions = selectedTrade?.subTrades || [];

  return (
    <Paper
      sx={{
        p: 1.5,
        mb: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.08)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 첫 번째 줄: 현장, 동, 호, 공종, 소공종 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 1,
          mb: 1,
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel>현장</InputLabel>
          <Select
            value={localFilters.siteId || ''}
            label="현장"
            onChange={handleSiteChange}
          >
            <MenuItem value="">전체</MenuItem>
            {mockSiteOptions.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="동"
          value={localFilters.dong || ''}
          onChange={handleDongChange}
          placeholder="예: 101"
        />

        <TextField
          size="small"
          label="호"
          value={localFilters.ho || ''}
          onChange={handleHoChange}
          placeholder="예: 1203"
        />

        <Autocomplete
          size="small"
          options={mockTradeOptions}
          getOptionLabel={(option) => option.name}
          value={mockTradeOptions.find((t) => t.name === localFilters.trade) || null}
          onChange={handleTradeChange}
          renderInput={(params) => <TextField {...params} label="공종" />}
        />

        <Autocomplete
          size="small"
          options={subTradeOptions}
          getOptionLabel={(option) => option.name}
          value={subTradeOptions.find((st) => st.name === localFilters.subTrade) || null}
          onChange={handleSubTradeChange}
          disabled={!selectedTrade}
          renderInput={(params) => <TextField {...params} label="소공종" />}
        />
      </Box>

      {/* 두 번째 줄: 상태, 우선순위, 기간, 검색, 내 담당 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'auto auto auto auto 1fr auto auto auto',
          },
          gap: 1,
          mb: 1,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>진행상태</InputLabel>
          <Select
            multiple
            value={localFilters.status || []}
            label="진행상태"
            onChange={handleStatusChange}
            renderValue={(selected) =>
              (selected as ASReceiptStatus[]).length === 0
                ? '전체'
                : `${(selected as ASReceiptStatus[]).length}개 선택`
            }
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>형태</InputLabel>
          <Select
            multiple
            value={localFilters.priority || []}
            label="형태"
            onChange={handlePriorityChange}
            renderValue={(selected) =>
              (selected as Priority[]).length === 0
                ? '전체'
                : `${(selected as Priority[]).length}개 선택`
            }
          >
            {priorityOptions.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                {priority.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="시작일"
          value={localFilters.startDate || ''}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 150 }}
        />

        <TextField
          size="small"
          type="date"
          label="종료일"
          value={localFilters.endDate || ''}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 150 }}
        />

        <TextField
          size="small"
          placeholder="검색..."
          value={localFilters.searchKeyword || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'action.active' }} />,
          }}
        />

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={localFilters.assignedToMe || false}
              onChange={handleAssignedToMeChange}
            />
          }
          label="내 담당"
          sx={{ m: 0 }}
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
    </Paper>
  );
}
