/**
 * A/S 관리 필터바 컴포넌트
 * 기획서: CP-SA-03-003
 */

import { useState, useMemo } from 'react';
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
import type {
  AfterserviceListParams,
  AsStatus,
  AsPriority,
  Ascode,
  Partner,
} from '@/src/types/afterservice.types';

interface FiltersBarProps {
  filters: AfterserviceListParams;
  onFiltersChange: (filters: AfterserviceListParams) => void;
  // 옵션 데이터
  statusOptions: AsStatus[];
  priorityOptions: AsPriority[];
  ascodes: Ascode[];
  partners: Partner[];
  dongs: string[];
  donghos: { id: number; dong: string; ho: string }[];
  onDongChange?: (dong: string) => void;
}

// 날짜 타입 옵션
const dateTypeOptions = [
  { value: 'created_at', label: '등록일' },
  { value: 'work_date', label: '보수일정' },
  { value: 'resident_date', label: '입주예정' },
] as const;

export default function FiltersBar({
  filters,
  onFiltersChange,
  statusOptions,
  priorityOptions,
  ascodes,
  partners,
  dongs,
  donghos,
  onDongChange,
}: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<AfterserviceListParams>({
    date_type: 'created_at',
    ...filters,
  });

  // ========== 실명 → 부위명 → 상세부위명 → 유형 캐스케이딩 ==========
  // 1단계: 실명 옵션 (전체)
  const rooms = useMemo(
    () => [...new Set(ascodes.map((a) => a.room).filter(Boolean))].sort(),
    [ascodes]
  );

  // 2단계: 부위명 옵션 (실명 선택 시 필터링)
  const issueCategories1 = useMemo(() => {
    const filtered = localFilters.room
      ? ascodes.filter((a) => a.room === localFilters.room)
      : ascodes;
    return [...new Set(filtered.map((a) => a.issue_category1).filter(Boolean))].sort();
  }, [ascodes, localFilters.room]);

  // 3단계: 상세부위명 옵션 (부위명 선택 시 필터링)
  const issueCategories2 = useMemo(() => {
    let filtered = ascodes;
    if (localFilters.room) filtered = filtered.filter((a) => a.room === localFilters.room);
    if (localFilters.issue_category1) filtered = filtered.filter((a) => a.issue_category1 === localFilters.issue_category1);
    return [...new Set(filtered.map((a) => a.issue_category2).filter(Boolean))].sort();
  }, [ascodes, localFilters.room, localFilters.issue_category1]);

  // 4단계: 유형 옵션 (상세부위명 선택 시 필터링)
  const issueTypes = useMemo(() => {
    let filtered = ascodes;
    if (localFilters.room) filtered = filtered.filter((a) => a.room === localFilters.room);
    if (localFilters.issue_category1) filtered = filtered.filter((a) => a.issue_category1 === localFilters.issue_category1);
    if (localFilters.issue_category2) filtered = filtered.filter((a) => a.issue_category2 === localFilters.issue_category2);
    return [...new Set(filtered.map((a) => a.issue_type).filter(Boolean))].sort();
  }, [ascodes, localFilters.room, localFilters.issue_category1, localFilters.issue_category2]);

  // ========== 대공종 → 소공종 → 협력사 캐스케이딩 ==========
  // 1단계: 대공종 옵션 (전체)
  const workTypes1 = useMemo(
    () => [...new Set(ascodes.map((a) => a.work_type1).filter(Boolean))].sort(),
    [ascodes]
  );

  // 2단계: 소공종 옵션 (대공종 선택 시 필터링)
  const workTypes2 = useMemo(() => {
    const filtered = localFilters.work_type1
      ? ascodes.filter((a) => a.work_type1 === localFilters.work_type1)
      : ascodes;
    return [...new Set(filtered.map((a) => a.work_type2).filter(Boolean))].sort();
  }, [ascodes, localFilters.work_type1]);

  // 3단계: 협력사 옵션 (소공종 선택 시 해당 협력사만 필터링)
  const filteredPartners = useMemo(() => {
    if (!localFilters.work_type1 && !localFilters.work_type2) return partners;
    let filtered = ascodes;
    if (localFilters.work_type1) filtered = filtered.filter((a) => a.work_type1 === localFilters.work_type1);
    if (localFilters.work_type2) filtered = filtered.filter((a) => a.work_type2 === localFilters.work_type2);
    const partnerIds = new Set(filtered.map((a) => a.project_users_id).filter(Boolean));
    return partners.filter((p) => partnerIds.has(p.id));
  }, [ascodes, partners, localFilters.work_type1, localFilters.work_type2]);

  // 선택된 동에 해당하는 호수 목록
  const hoOptions = useMemo(
    () =>
      localFilters.dong
        ? donghos.filter((d) => d.dong === localFilters.dong).map((d) => d.ho)
        : [],
    [localFilters.dong, donghos]
  );

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const dong = event.target.value || undefined;
    setLocalFilters({ ...localFilters, dong, ho: undefined });
    onDongChange?.(dong || '');
  };

  const handleHoChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({ ...localFilters, ho: event.target.value || undefined });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setLocalFilters({ ...localFilters, as_status_id: value ? Number(value) : undefined });
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setLocalFilters({ ...localFilters, as_priority_id: value ? Number(value) : undefined });
  };

  const handleSelectChange =
    (field: keyof AfterserviceListParams) => (event: SelectChangeEvent<string>) => {
      setLocalFilters({ ...localFilters, [field]: event.target.value || undefined });
    };

  // 실명 → 부위명 → 상세부위명 → 유형 캐스케이딩 핸들러
  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      room: event.target.value || undefined,
      issue_category1: undefined,
      issue_category2: undefined,
      issue_type: undefined,
    });
  };

  const handleIssueCategory1Change = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      issue_category1: event.target.value || undefined,
      issue_category2: undefined,
      issue_type: undefined,
    });
  };

  const handleIssueCategory2Change = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      issue_category2: event.target.value || undefined,
      issue_type: undefined,
    });
  };

  // 대공종 → 소공종 → 협력사 캐스케이딩 핸들러
  const handleWorkType1Change = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      work_type1: event.target.value || undefined,
      work_type2: undefined,
      partner_id: undefined,
    });
  };

  const handleWorkType2Change = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      work_type2: event.target.value || undefined,
      partner_id: undefined,
    });
  };

  const handleDateTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters({
      ...localFilters,
      date_type: (event.target.value as 'created_at' | 'work_date' | 'resident_date') || 'created_at',
    });
  };

  const handleDateChange =
    (field: 'date_begin' | 'date_end') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFilters({ ...localFilters, [field]: event.target.value || undefined });
    };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: AfterserviceListParams = { date_type: 'created_at' };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

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
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 첫 번째 줄: 날짜검색 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1.5,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ width: 100 }}>
          <InputLabel>날짜</InputLabel>
          <Select
            value={localFilters.date_type || 'created_at'}
            label="날짜"
            onChange={handleDateTypeChange}
          >
            {dateTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          type="date"
          label="시작일"
          value={localFilters.date_begin || ''}
          onChange={handleDateChange('date_begin')}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 150 }}
        />
        <Box sx={{ color: 'text.secondary', px: 0.5 }}>~</Box>
        <TextField
          size="small"
          type="date"
          label="종료일"
          value={localFilters.date_end || ''}
          onChange={handleDateChange('date_end')}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 150 }}
        />
      </Box>

      {/* 두 번째 줄: 동, 호, 대공종, 소공종, 협력사 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1.5,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>동</InputLabel>
          <Select value={localFilters.dong || ''} label="동" onChange={handleDongChange}>
            <MenuItem value="">전체</MenuItem>
            {dongs.map((dong) => (
              <MenuItem key={dong} value={dong}>
                {dong}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>호</InputLabel>
          <Select
            value={localFilters.ho || ''}
            label="호"
            onChange={handleHoChange}
            disabled={!localFilters.dong}
          >
            <MenuItem value="">전체</MenuItem>
            {hoOptions.map((ho) => (
              <MenuItem key={ho} value={ho}>
                {ho}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>대공종</InputLabel>
          <Select
            value={localFilters.work_type1 || ''}
            label="대공종"
            onChange={handleWorkType1Change}
          >
            <MenuItem value="">전체</MenuItem>
            {workTypes1.map((wt) => (
              <MenuItem key={wt} value={wt}>
                {wt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>소공종</InputLabel>
          <Select
            value={localFilters.work_type2 || ''}
            label="소공종"
            onChange={handleWorkType2Change}
            disabled={!localFilters.work_type1}
          >
            <MenuItem value="">전체</MenuItem>
            {workTypes2.map((wt) => (
              <MenuItem key={wt} value={wt}>
                {wt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>협력사</InputLabel>
          <Select
            value={localFilters.partner_id?.toString() || ''}
            label="협력사"
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                partner_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <MenuItem value="">전체</MenuItem>
            {filteredPartners.map((p) => (
              <MenuItem key={p.id} value={p.id.toString()}>
                {p.company || p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 세 번째 줄: 실명, 부위명, 상세부위명, 유형 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1.5,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>실명</InputLabel>
          <Select
            value={localFilters.room || ''}
            label="실명"
            onChange={handleRoomChange}
          >
            <MenuItem value="">전체</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>부위명</InputLabel>
          <Select
            value={localFilters.issue_category1 || ''}
            label="부위명"
            onChange={handleIssueCategory1Change}
            disabled={!localFilters.room}
          >
            <MenuItem value="">전체</MenuItem>
            {issueCategories1.map((ic) => (
              <MenuItem key={ic} value={ic}>
                {ic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>상세부위명</InputLabel>
          <Select
            value={localFilters.issue_category2 || ''}
            label="상세부위명"
            onChange={handleIssueCategory2Change}
            disabled={!localFilters.issue_category1}
          >
            <MenuItem value="">전체</MenuItem>
            {issueCategories2.map((ic) => (
              <MenuItem key={ic} value={ic}>
                {ic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>유형</InputLabel>
          <Select
            value={localFilters.issue_type || ''}
            label="유형"
            onChange={handleSelectChange('issue_type')}
            disabled={!localFilters.issue_category2}
          >
            <MenuItem value="">전체</MenuItem>
            {issueTypes.map((it) => (
              <MenuItem key={it} value={it}>
                {it}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 네 번째 줄: 진행상태, 형태, 버튼 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>진행상태</InputLabel>
          <Select
            value={localFilters.as_status_id?.toString() || ''}
            label="진행상태"
            onChange={handleStatusChange}
          >
            <MenuItem value="">전체</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status.id} value={status.id.toString()}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>형태</InputLabel>
          <Select
            value={localFilters.as_priority_id?.toString() || ''}
            label="형태"
            onChange={handlePriorityChange}
          >
            <MenuItem value="">전체</MenuItem>
            {priorityOptions.map((priority) => (
              <MenuItem key={priority.id} value={priority.id.toString()}>
                {priority.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" onClick={handleReset} size="small">
          초기화
        </Button>
        <Button variant="contained" onClick={handleApply} size="small">
          검색
        </Button>
      </Box>
    </Paper>
  );
}
