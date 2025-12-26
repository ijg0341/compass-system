/**
 * 사전방문 등록 (CP-SA-02-001)
 * 실제 방문 기록을 등록하고 관리하는 페이지
 */
import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import {
  PrevisitRegisterForm,
  PrevisitDataTable,
  PrevisitDataFilters,
  type PrevisitDataFilter,
} from '@/src/components/previsit';
import {
  usePrevisits,
  usePrevisitDataList,
  useCreatePrevisitData,
  useReturnDevice,
  usePrevisitDongs,
} from '@/src/hooks/usePrevisit';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { PrevisitData, PrevisitDataRequest } from '@/src/types/previsit.types';

export default function PrevisitRegisterPage() {
  const [searchParams] = useSearchParams();
  const { projectUuid } = useCurrentProject();
  const initialPrevisitId = searchParams.get('previsit_id');
  const initialSearchKeyword = searchParams.get('searchKeyword');
  const initialDong = searchParams.get('dong');

  // 필터/페이징 상태
  const [filters, setFilters] = useState<PrevisitDataFilter>({
    previsit_id: initialPrevisitId ? Number(initialPrevisitId) : undefined,
    searchKeyword: initialSearchKeyword || undefined,
    dong: initialDong || undefined,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // UI 상태
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // API 조회
  const { data: previsitsData } = usePrevisits(projectUuid);
  const previsits = useMemo(() => previsitsData?.list || [], [previsitsData]);

  const { data: dongs } = usePrevisitDongs(projectUuid);

  const {
    data: visitDataList,
    isLoading,
    error,
  } = usePrevisitDataList(projectUuid, {
    previsit_id: filters.previsit_id,
    searchKeyword: filters.searchKeyword,
    dong: filters.dong,
    rental_device_no: filters.rental_device_no,
    rental_device_return: filters.rental_device_return,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });
  const visits = useMemo(() => visitDataList?.list || [], [visitDataList]);
  const totalCount = visitDataList?.total || 0;

  // Mutations
  const createMutation = useCreatePrevisitData();
  const returnDeviceMutation = useReturnDevice();

  // 등록 핸들러
  const handleSubmit = useCallback(
    async (data: PrevisitDataRequest) => {
      try {
        await createMutation.mutateAsync({ projectUuid, data });
        setSnackbar({ open: true, message: '방문이 등록되었습니다.', severity: 'success' });
      } catch (err) {
        console.error('등록 실패:', err);
        setSnackbar({ open: true, message: '등록에 실패했습니다.', severity: 'error' });
      }
    },
    [createMutation]
  );

  // 단말기 회수 핸들러
  const handleReturnDevice = useCallback(
    async (id: number) => {
      try {
        await returnDeviceMutation.mutateAsync({ projectUuid, id });
        setSnackbar({ open: true, message: '단말기 회수가 완료되었습니다.', severity: 'success' });
      } catch (err) {
        console.error('회수 처리 실패:', err);
        setSnackbar({ open: true, message: '회수 처리에 실패했습니다.', severity: 'error' });
      }
    },
    [returnDeviceMutation]
  );

  // 방문 이력 검색 (이름, 동으로 검색)
  const handleViewHistory = useCallback((visit: PrevisitData) => {
    setFilters((prev) => ({
      ...prev,
      searchKeyword: visit.contractor_name || visit.visitor_name || '',
      dong: visit.dong || '',
    }));
    setPage(0);
  }, []);

  // 필터 변경
  const handleFiltersChange = useCallback((newFilters: PrevisitDataFilter) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          사전방문 등록
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          총 {totalCount}건
        </Typography>
      </Box>

      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          데이터를 불러오는데 실패했습니다.
        </Alert>
      )}

      {/* 섹션 1: 사전 방문등록 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
        사전 방문등록
      </Typography>
      <PrevisitRegisterForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        initialPrevisitId={initialPrevisitId ? Number(initialPrevisitId) : undefined}
      />

      {/* 섹션 2: 사전 방문내역 */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
        사전 방문내역
      </Typography>

      {/* 검색 필터 */}
      <PrevisitDataFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        previsits={previsits}
        dongs={dongs || []}
      />

      {/* 로딩 표시 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PrevisitDataTable
          data={visits}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onReturnDevice={handleReturnDevice}
          onViewHistory={handleViewHistory}
          isReturning={returnDeviceMutation.isPending}
        />
      )}

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
