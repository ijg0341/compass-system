import { useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ScheduleForm from '@/src/components/visit-reservation/ScheduleForm';
import ScheduleTable from '@/src/components/visit-reservation/ScheduleTable';
import ScheduleFilters from '@/src/components/visit-reservation/ScheduleFilters';
import type { VisitScheduleFilter } from '@/src/types/reservation';
import { useVisitSchedules, useCreateVisitSchedule, useDongHos, useAvailableSlots, useUpdateVisitInfo } from '@/src/hooks/useReservation';
import type { CreateVisitScheduleRequest, VisitScheduleInfo, UpdateVisitInfoRequest } from '@/src/lib/api/reservationApi';
import VisitInfoCard from '@/src/components/visit-reservation/VisitInfoCard';
import VisitInfoEditModal from '@/src/components/visit-reservation/VisitInfoEditModal';

// API 응답을 UI에서 사용하는 형태로 변환
interface DisplaySchedule {
  id: string;
  visitDate: string;
  visitTime: string;
  building: string;
  unit: string;
  name?: string;
  phone?: string;
  status: 'empty' | 'reserved';
}

export default function VisitReservationPage() {
  // 상태 관리
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<VisitScheduleFilter>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // API 조회
  const { data: availableSlots, isLoading: isSlotsLoading, refetch: refetchSlots } = useAvailableSlots(1);
  const visitInfoId = availableSlots?.visit_info_id || 1;

  const {
    data: schedulesData,
    isLoading,
    error,
    refetch
  } = useVisitSchedules({
    offset: page * rowsPerPage,
    limit: rowsPerPage,
    searchKeyword: filters.searchKeyword,
  });

  // 동/호 정보 조회 (테이블 표시용)
  const { data: dongHos } = useDongHos(visitInfoId);

  // 방문일정 등록 mutation
  const createMutation = useCreateVisitSchedule();

  // 방문정보 수정 mutation
  const updateVisitInfoMutation = useUpdateVisitInfo();

  // API 데이터를 UI 형태로 변환
  const schedules: DisplaySchedule[] = useMemo(() => {
    if (!schedulesData?.list) return [];

    return schedulesData.list.map((item: VisitScheduleInfo) => {
      // dong_ho_id로 동/호 정보 찾기
      const dongHo = dongHos?.find(dh => dh.id === String(item.dong_ho_id));

      return {
        id: String(item.id),
        visitDate: item.visit_date.date.split(' ')[0], // "2025-11-27 00:00:00" -> "2025-11-27"
        visitTime: item.visit_time.slice(0, 5), // "12:00:00" -> "12:00"
        building: dongHo?.dong_name || '-',
        unit: dongHo?.name || '-',
        name: item.resident_name || undefined,
        phone: item.resident_phone || undefined,
        status: item.resident_name ? 'reserved' : 'empty',
      };
    });
  }, [schedulesData, dongHos]);

  // 필터링된 데이터 계산 (클라이언트 사이드 필터링)
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // 동 필터
      if (filters.building && schedule.building !== filters.building) return false;

      // 호 필터
      if (filters.unit && schedule.unit !== filters.unit) return false;

      // 상태 필터
      if (filters.status && schedule.status !== filters.status) return false;

      return true;
    });
  }, [schedules, filters]);

  // 새 일정 등록 핸들러
  const handleSubmit = async (formData: CreateVisitScheduleRequest) => {
    try {
      await createMutation.mutateAsync(formData);
      refetch();
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록에 실패했습니다.');
    }
  };

  // 행 클릭 핸들러
  const handleRowClick = (schedule: DisplaySchedule) => {
    console.log('Selected schedule:', schedule);
    // TODO: 상세 드로어 열기
  };

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: VisitScheduleFilter) => {
    setFilters(newFilters);
    setPage(0);
  };

  // 방문정보 수정 핸들러
  const handleUpdateVisitInfo = async (data: UpdateVisitInfoRequest) => {
    try {
      await updateVisitInfoMutation.mutateAsync({ id: visitInfoId, data });
      alert('방문정보가 수정되었습니다.');
      setIsEditModalOpen(false);
      refetchSlots();
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <Box>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            방문예약 관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {schedulesData?.total || 0}건
          </Typography>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 방문정보 카드 */}
        <VisitInfoCard
          data={availableSlots}
          isLoading={isSlotsLoading}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {/* 섹션 1: 방문일정 등록 */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
          방문일정 등록
        </Typography>
        <ScheduleForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />

        {/* 섹션 2: 등록된 방문일정 */}
        <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
          등록된 방문일정
        </Typography>

        {/* 검색 필터 */}
        <ScheduleFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 로딩 표시 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* 방문일정 테이블 */
          <ScheduleTable
            data={filteredSchedules}
            totalCount={schedulesData?.total || 0}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={handleRowClick}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        )}

        {/* 방문정보 수정 모달 */}
        <VisitInfoEditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateVisitInfo}
          initialData={availableSlots}
          isSubmitting={updateVisitInfoMutation.isPending}
        />
    </Box>
  );
}
