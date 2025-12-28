/**
 * 이사예약 페이지
 * 화면 ID: CP-SA-03-002
 */
import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';
import DataTable, { type Column } from '@/src/components/common/DataTable';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useMoveReservations, useDownloadMoveExcel } from '@/src/hooks/useMove';
import { getCommonDongs } from '@/src/lib/api/commonApi';
import type { MoveReservation, MoveReservationListParams } from '@/src/lib/api/moveApi';
import HouseholdDetailDrawer from '@/src/components/visit/HouseholdDetailDrawer';

// 요일 변환 함수
const getDayOfWeek = (dateStr: string): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

// 필터 상태
interface FilterState {
  dong: string;
  ho: string;
  residentName: string;
  residentDate: string;
  reservationDate: string;
}

const initialFilterState: FilterState = {
  dong: '',
  ho: '',
  residentName: '',
  residentDate: '',
  reservationDate: '',
};

export default function ResidenceMovePage() {
  const { projectUuid } = useCurrentProject();

  // 상태
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dongs, setDongs] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 모달 상태
  const [selectedReservation, setSelectedReservation] = useState<MoveReservation | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  // API 훅
  const listParams: MoveReservationListParams = useMemo(() => ({
    page: page + 1,
    limit: rowsPerPage,
    ...(filters.dong && { dong: filters.dong }),
    ...(filters.ho && { ho: filters.ho }),
    ...(filters.residentName && { resident_name: filters.residentName }),
    ...(filters.residentDate && { resident_date: filters.residentDate }),
    ...(filters.reservationDate && { reservation_date: filters.reservationDate }),
  }), [page, rowsPerPage, filters]);

  const { data: moveData, isLoading, refetch } = useMoveReservations(projectUuid, listParams);
  const downloadMutation = useDownloadMoveExcel();

  // 동 목록 로드
  const loadDongs = useCallback(async () => {
    if (!projectUuid) return;
    try {
      const data = await getCommonDongs(projectUuid);
      setDongs(data);
    } catch (error) {
      console.error('동 목록 로드 실패:', error);
    }
  }, [projectUuid]);

  // 컴포넌트 마운트 시 동 목록 로드
  useState(() => {
    loadDongs();
  });

  // 엑셀 다운로드
  const handleDownloadExcel = useCallback(async () => {
    if (!projectUuid) return;
    try {
      await downloadMutation.mutateAsync({ projectUuid, params: filters });
      setSnackbar({ open: true, message: '엑셀 다운로드가 시작되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      setSnackbar({ open: true, message: '엑셀 다운로드에 실패했습니다.', severity: 'error' });
    }
  }, [projectUuid, filters, downloadMutation]);

  // 행 클릭 시 세대상세 표시
  const handleRowClick = useCallback((reservation: MoveReservation) => {
    setSelectedReservation(reservation);
    setDetailDrawerOpen(true);
  }, []);

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
    setPage(0);
  }, []);

  // 테이블 컬럼 정의
  const columns: Column<MoveReservation>[] = useMemo(() => [
    { id: 'dong', label: '동', minWidth: 80 },
    { id: 'ho', label: '호', minWidth: 80 },
    { id: 'reservation_evline', label: '예약 라인', minWidth: 100 },
    { id: 'resident_name', label: '입주자 성명', minWidth: 100, render: (row) => row.resident_name || '-' },
    { id: 'resident_phone', label: '입주자 연락처', minWidth: 120, render: (row) => row.resident_phone || '-' },
    { id: 'resident_date', label: '입주일', minWidth: 100, render: (row) => row.resident_date || '-' },
    { id: 'reservation_date', label: '예약일자', minWidth: 100 },
    {
      id: 'day_of_week',
      label: '요일',
      minWidth: 60,
      align: 'center',
      render: (row) => row.reservation_date ? getDayOfWeek(row.reservation_date) : '-',
    },
    {
      id: 'reservation_time',
      label: '시간',
      minWidth: 80,
      render: (row) => row.reservation_time?.slice(0, 5) || '-',
    },
    {
      id: 'created_at',
      label: '신청일시',
      minWidth: 140,
      render: (row) => row.created_at?.slice(0, 16).replace('T', ' ') || '-',
    },
  ], []);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            이사예약
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {moveData?.total ?? 0}건
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
          disabled={downloadMutation.isPending}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 필터 */}
      <FilterContainer
        onReset={handleResetFilters}
        onApply={() => {
          setPage(0);
          refetch();
        }}
      >
        <FilterRow isLast>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>동 선택</InputLabel>
            <Select
              value={filters.dong}
              label="동 선택"
              onChange={(e) => setFilters(prev => ({ ...prev, dong: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
              {dongs.map((dong) => (
                <MenuItem key={dong} value={dong}>{dong}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>호 선택</InputLabel>
            <Select
              value={filters.ho}
              label="호 선택"
              onChange={(e) => setFilters(prev => ({ ...prev, ho: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="입주자 성명"
            size="small"
            value={filters.residentName}
            onChange={(e) => setFilters(prev => ({ ...prev, residentName: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
          <TextField
            label="입주일"
            type="date"
            size="small"
            value={filters.residentDate}
            onChange={(e) => setFilters(prev => ({ ...prev, residentDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="예약일자"
            type="date"
            size="small"
            value={filters.reservationDate}
            onChange={(e) => setFilters(prev => ({ ...prev, reservationDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </FilterRow>
      </FilterContainer>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={moveData?.list || []}
        total={moveData?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onRowClick={handleRowClick}
        getRowKey={(row) => row.id}
        emptyMessage={isLoading ? '데이터를 불러오는 중...' : '데이터가 없습니다.'}
      />

      {/* 세대상세 Drawer */}
      {selectedReservation && (
        <HouseholdDetailDrawer
          open={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
          donghoId={selectedReservation.dongho_id}
        />
      )}

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
