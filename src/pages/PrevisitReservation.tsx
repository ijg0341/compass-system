/**
 * 사전방문 예약 (CP-SA-02-002)
 * 사전방문 예약을 등록하고 관리하는 페이지
 */
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import {
  PrevisitReservationForm,
  PrevisitReservationTable,
  PrevisitReservationFilters,
  type PrevisitReservationFilter,
} from '@/src/components/previsit';
import {
  usePrevisits,
  usePrevisitReservations,
  useCreatePrevisitReservation,
  useDeletePrevisitReservation,
} from '@/src/hooks/usePrevisit';
import type { PrevisitReservation, PrevisitReservationRequest } from '@/src/types/previsit.types';

export default function PrevisitReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPrevisitId = searchParams.get('previsit_id');

  // 필터/페이징 상태
  const [filters, setFilters] = useState<PrevisitReservationFilter>({
    previsit_id: initialPrevisitId ? Number(initialPrevisitId) : undefined,
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
  const { data: previsitsData } = usePrevisits({ project_id: 1 });
  const previsits = useMemo(() => previsitsData?.list || [], [previsitsData]);

  const {
    data: reservationsData,
    isLoading,
    error,
  } = usePrevisitReservations({
    previsit_id: filters.previsit_id,
    searchKeyword: filters.searchKeyword,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });
  const reservations = useMemo(() => reservationsData?.list || [], [reservationsData]);
  const totalCount = reservationsData?.total || 0;

  // Mutations
  const createMutation = useCreatePrevisitReservation();
  const deleteMutation = useDeletePrevisitReservation();

  // 등록 핸들러
  const handleSubmit = useCallback(
    async (data: PrevisitReservationRequest) => {
      try {
        await createMutation.mutateAsync(data);
        setSnackbar({ open: true, message: '예약이 등록되었습니다.', severity: 'success' });
      } catch (err) {
        console.error('등록 실패:', err);
        setSnackbar({ open: true, message: '등록에 실패했습니다.', severity: 'error' });
      }
    },
    [createMutation]
  );

  // 삭제 핸들러
  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm('이 예약을 삭제하시겠습니까?')) return;

      try {
        await deleteMutation.mutateAsync(id);
        setSnackbar({ open: true, message: '삭제되었습니다.', severity: 'success' });
      } catch (err) {
        console.error('삭제 실패:', err);
        setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
      }
    },
    [deleteMutation]
  );

  // 방문등록 화면으로 이동
  const handleGoToRegister = useCallback(
    (reservation: PrevisitReservation) => {
      navigate(
        `/smartnet/pre-visit/register?previsit_id=${reservation.previsit_id}&dongho_id=${reservation.dongho_id}`
      );
    },
    [navigate]
  );

  // 필터 변경
  const handleFiltersChange = useCallback((newFilters: PrevisitReservationFilter) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          사전방문 예약
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

      {/* 섹션 1: 사전 방문예약 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
        사전 방문예약
      </Typography>
      <PrevisitReservationForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        initialPrevisitId={initialPrevisitId ? Number(initialPrevisitId) : undefined}
      />

      {/* 섹션 2: 예약 목록 */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
        예약 목록
      </Typography>

      {/* 검색 필터 */}
      <PrevisitReservationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        previsits={previsits}
      />

      {/* 로딩 표시 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PrevisitReservationTable
          data={reservations}
          previsits={previsits}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onGoToRegister={handleGoToRegister}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
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
