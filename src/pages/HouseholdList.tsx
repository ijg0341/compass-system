/**
 * 세대현황 - 세대목록 페이지
 * 화면 ID: CP-SA-04-001
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  type SelectChangeEvent,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';
import DataTable, { type Column } from '@/src/components/common/DataTable';
import HouseholdDetailModal from '@/src/components/household/HouseholdDetailModal';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useHouseholdStatus, useDonghos } from '@/src/hooks/useDongho';
import { downloadHouseholdStatusExcel } from '@/src/lib/api/donghoApi';
import type { HouseholdStatus, HouseholdStatusParams } from '@/src/types/dongho.types';
import { extractDateString } from '@/src/types/dongho.types';

type TabType = 'all' | 'key' | 'meter' | 'give';

interface FilterState {
  dateBegin: string;
  dateEnd: string;
  contractorName: string;
  dong: string;
  ho: string;
  tab: TabType;
}

const initialFilters: FilterState = {
  dateBegin: '',
  dateEnd: '',
  contractorName: '',
  dong: '',
  ho: '',
  tab: 'all',
};

const tabOptions: { value: TabType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'key', label: '키불' },
  { value: 'meter', label: '검침' },
  { value: 'give', label: '지급' },
];

export default function HouseholdList() {
  const { projectUuid, hasProject } = useCurrentProject();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // API 파라미터 변환
  const apiParams: HouseholdStatusParams = useMemo(() => {
    const params: HouseholdStatusParams = {
      page: page + 1,
      limit: rowsPerPage,
    };
    if (appliedFilters.dong) params.dong = appliedFilters.dong;
    if (appliedFilters.ho) params.ho = appliedFilters.ho;
    if (appliedFilters.contractorName) params.contractor_name = appliedFilters.contractorName;
    if (appliedFilters.dateBegin) params.date_begin = appliedFilters.dateBegin;
    if (appliedFilters.dateEnd) params.date_end = appliedFilters.dateEnd;
    if (appliedFilters.tab !== 'all') params.tab = appliedFilters.tab;
    return params;
  }, [appliedFilters, page, rowsPerPage]);

  // 데이터 조회
  const { data, isLoading } = useHouseholdStatus(projectUuid, apiParams);
  const { data: donghosData } = useDonghos(projectUuid);

  // 동 목록 추출
  const dongOptions = useMemo(() => {
    if (!donghosData?.list) return [];
    const dongs = [...new Set(donghosData.list.map((d) => d.dong))];
    return dongs.sort((a, b) => a.localeCompare(b, 'ko'));
  }, [donghosData]);

  // 호 목록 추출 (선택된 동 기준)
  const hoOptions = useMemo(() => {
    if (!donghosData?.list || !filters.dong) return [];
    const hos = donghosData.list
      .filter((d) => d.dong === filters.dong)
      .map((d) => d.ho);
    return [...new Set(hos)].sort((a, b) => a.localeCompare(b, 'ko'));
  }, [donghosData, filters.dong]);

  // 테이블 컬럼 정의
  const columns: Column<HouseholdStatus>[] = useMemo(() => [
    { id: 'dong', label: '동', minWidth: 80 },
    { id: 'ho', label: '호', minWidth: 80 },
    { id: 'resident_name', label: '입주자명', minWidth: 100 },
    { id: 'resident_phone', label: '입주자연락처', minWidth: 120 },
    { id: 'memo', label: '메모', minWidth: 100, render: (row) => row.memo || '-' },
    {
      id: 'move_date',
      label: '이사예약일',
      minWidth: 100,
      render: (row) => extractDateString(row.move_date) || '-',
    },
    { id: 'key_date', label: '키불일자', minWidth: 100, render: (row) => extractDateString(row.key_date) || '-' },
    { id: 'keyman_name', label: '키불담당자', minWidth: 100, render: (row) => row.keyman_name || '-' },
    { id: 'meter_gas', label: '가스', minWidth: 80, render: (row) => row.meter_gas || '-' },
    { id: 'meter_water', label: '수도', minWidth: 80, render: (row) => row.meter_water || '-' },
    { id: 'meter_heating', label: '난방', minWidth: 80, render: (row) => row.meter_heating || '-' },
    { id: 'meter_hotwater', label: '온수', minWidth: 80, render: (row) => row.meter_hotwater || '-' },
    { id: 'meter_date', label: '검침일자', minWidth: 100, render: (row) => extractDateString(row.meter_date) || '-' },
    { id: 'meterman_name', label: '검침담당자', minWidth: 100, render: (row) => row.meterman_name || '-' },
    {
      id: 'give_items_count',
      label: '지급품',
      minWidth: 80,
      render: (row) => {
        if (!row.give_items) return '-';
        const count = Object.values(row.give_items).filter(Boolean).length;
        return count > 0 ? `${count}건` : '-';
      },
    },
    { id: 'give_date', label: '지급일자', minWidth: 100, render: (row) => extractDateString(row.give_date) || '-' },
    { id: 'giveman_name', label: '지급담당자', minWidth: 100, render: (row) => row.giveman_name || '-' },
  ], []);

  // 필터 핸들러
  const handleDongChange = (e: SelectChangeEvent<string>) => {
    setFilters({ ...filters, dong: e.target.value, ho: '' });
  };

  const handleHoChange = (e: SelectChangeEvent<string>) => {
    setFilters({ ...filters, ho: e.target.value });
  };

  const handleTabChange = (_: React.MouseEvent<HTMLElement>, newTab: TabType | null) => {
    if (newTab !== null) {
      setFilters({ ...filters, tab: newTab });
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(0);
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    setPage(0);
  };

  const handleRowClick = (row: HouseholdStatus) => {
    setSelectedHouseholdId(row.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedHouseholdId(null);
  };

  const handleExcelDownload = async () => {
    try {
      await downloadHouseholdStatusExcel(projectUuid, apiParams);
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    }
  };

  if (!hasProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>프로젝트를 선택해주세요.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            세대현황
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {data?.total ?? 0}건
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExcelDownload}
          size="small"
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 필터 */}
      <FilterContainer onReset={handleReset} onApply={handleApply}>
        <FilterRow>
          <TextField
            size="small"
            type="date"
            label="등록일 시작"
            value={filters.dateBegin}
            onChange={(e) => setFilters({ ...filters, dateBegin: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <Typography sx={{ mx: 0.5 }}>~</Typography>
          <TextField
            size="small"
            type="date"
            label="등록일 종료"
            value={filters.dateEnd}
            onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            label="계약자 성명"
            value={filters.contractorName}
            onChange={(e) => setFilters({ ...filters, contractorName: e.target.value })}
            sx={{ width: 150 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>동 선택</InputLabel>
            <Select value={filters.dong} label="동 선택" onChange={handleDongChange}>
              <MenuItem value="">전체</MenuItem>
              {dongOptions.map((dong) => (
                <MenuItem key={dong} value={dong}>
                  {dong}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>호 선택</InputLabel>
            <Select
              value={filters.ho}
              label="호 선택"
              onChange={handleHoChange}
              disabled={!filters.dong}
            >
              <MenuItem value="">전체</MenuItem>
              {hoOptions.map((ho) => (
                <MenuItem key={ho} value={ho}>
                  {ho}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterRow>
        <FilterRow isLast>
          <ToggleButtonGroup
            value={filters.tab}
            exclusive
            onChange={handleTabChange}
            size="small"
          >
            {tabOptions.map((tab) => (
              <ToggleButton key={tab.value} value={tab.value}>
                {tab.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FilterRow>
      </FilterContainer>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.list ?? []}
        total={data?.total ?? 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        onRowClick={handleRowClick}
        getRowKey={(row) => row.id}
        emptyMessage={isLoading ? '데이터를 불러오는 중...' : '데이터가 없습니다.'}
      />

      {/* 세대정보 상세 모달 */}
      <HouseholdDetailModal
        open={modalOpen}
        onClose={handleModalClose}
        householdId={selectedHouseholdId}
      />
    </Box>
  );
}
