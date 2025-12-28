/**
 * A/S 관리 페이지
 * 기획서: CP-SA-03-003, CP-SA-03-004
 */

import { useState, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FiltersBar from '@/src/components/as-manage/FiltersBar';
import ManageTable from '@/src/components/as-manage/ManageTable';
import DetailDrawer from '@/src/components/as-manage/DetailDrawer';
import {
  useAfterservices,
  useAfterservice,
  useUpdateAfterservice,
  useAfterserviceOptions,
  useAscodes,
  useAscodeOptions,
  usePartners,
  useAfterserviceDongs,
  useAfterserviceDonghos,
} from '@/src/hooks/useAfterservice';
import { downloadAfterservicesExcel } from '@/src/lib/api/afterserviceApi';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type {
  AfterserviceListParams,
  AfterserviceListItem,
  AfterserviceUpdateRequest,
} from '@/src/types/afterservice.types';

export default function ASManagePage() {
  const { projectUuid } = useCurrentProject();

  // 필터 상태
  const [filters, setFilters] = useState<AfterserviceListParams>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedDong, setSelectedDong] = useState<string>('');

  // 상세 드로어 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 스낵바 상태
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // API 쿼리
  const { data: listData, isLoading: isListLoading } = useAfterservices(projectUuid, {
    ...filters,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });

  const { data: detailData, isLoading: isDetailLoading } = useAfterservice(
    projectUuid,
    selectedId || 0
  );

  const { data: optionsData } = useAfterserviceOptions(projectUuid);
  const { data: ascodesData } = useAscodes(projectUuid);
  const { data: ascodeOptionsData } = useAscodeOptions(projectUuid);
  const { data: partnersData } = usePartners(projectUuid);
  const { data: dongsData } = useAfterserviceDongs(projectUuid);
  const { data: donghosData } = useAfterserviceDonghos(projectUuid, selectedDong);

  const updateMutation = useUpdateAfterservice();

  // 필터 변경 핸들러
  const handleFiltersChange = useCallback((newFilters: AfterserviceListParams) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  // 동 변경 핸들러 (호수 목록 갱신용)
  const handleDongChange = useCallback((dong: string) => {
    setSelectedDong(dong);
  }, []);

  // 행 클릭 핸들러
  const handleRowClick = useCallback((item: AfterserviceListItem) => {
    setSelectedId(item.id);
    setDrawerOpen(true);
  }, []);

  // 드로어 닫기 핸들러
  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedId(null);
  }, []);

  // 인라인 상태 변경 핸들러
  const handleStatusChange = useCallback(
    (id: number, statusId: number) => {
      const statusName = optionsData?.as_status.find((s) => s.id === statusId)?.name || '';
      updateMutation.mutate(
        { projectUuid, id, data: { as_status_id: statusId } },
        {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: `${id}번 하자의 진행상태가 ${statusName}(으)로 변경되었습니다.`,
              severity: 'success',
            });
          },
          onError: () => {
            setSnackbar({
              open: true,
              message: '변경에 실패했습니다.',
              severity: 'error',
            });
          },
        }
      );
    },
    [updateMutation, optionsData]
  );

  // 인라인 형태 변경 핸들러
  const handlePriorityChange = useCallback(
    (id: number, priorityId: number) => {
      const priorityName = optionsData?.as_priority.find((p) => p.id === priorityId)?.name || '';
      updateMutation.mutate(
        { projectUuid, id, data: { as_priority_id: priorityId } },
        {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: `${id}번 하자의 형태가 ${priorityName}(으)로 변경되었습니다.`,
              severity: 'success',
            });
          },
          onError: () => {
            setSnackbar({
              open: true,
              message: '변경에 실패했습니다.',
              severity: 'error',
            });
          },
        }
      );
    },
    [updateMutation, optionsData]
  );

  // 상세 저장 핸들러
  const handleDetailSave = useCallback(
    (data: AfterserviceUpdateRequest) => {
      if (!selectedId) return;

      updateMutation.mutate(
        { projectUuid, id: selectedId, data },
        {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: '저장되었습니다.',
              severity: 'success',
            });
            handleDrawerClose();
          },
          onError: () => {
            setSnackbar({
              open: true,
              message: '저장에 실패했습니다.',
              severity: 'error',
            });
          },
        }
      );
    },
    [selectedId, updateMutation, handleDrawerClose]
  );

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(async () => {
    try {
      await downloadAfterservicesExcel(projectUuid, filters);
      setSnackbar({
        open: true,
        message: '엑셀 다운로드가 완료되었습니다.',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: '엑셀 다운로드에 실패했습니다.',
        severity: 'error',
      });
    }
  }, [filters]);

  return (
    <Box>
      {/* 헤더 */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            A/S 관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {listData?.total || 0}건
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExcelDownload}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 필터바 */}
      <FiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        statusOptions={optionsData?.as_status || []}
        priorityOptions={optionsData?.as_priority || []}
        ascodes={ascodesData?.list || []}
        partners={partnersData?.list || []}
        dongs={dongsData || []}
        donghos={donghosData || []}
        onDongChange={handleDongChange}
      />

      {/* 테이블 */}
      <ManageTable
        data={listData?.list || []}
        total={listData?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onRowClick={handleRowClick}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        statusOptions={optionsData?.as_status || []}
        priorityOptions={optionsData?.as_priority || []}
        isUpdating={updateMutation.isPending}
      />

      {/* 상세 드로어 */}
      <DetailDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        projectUuid={projectUuid}
        detail={detailData || null}
        isLoading={isDetailLoading}
        statusOptions={optionsData?.as_status || []}
        priorityOptions={optionsData?.as_priority || []}
        ascodeOptions={ascodeOptionsData || { ascodes: [], issueTree: [], workTree: [] }}
        partners={partnersData?.list || []}
        onSave={handleDetailSave}
        isSaving={updateMutation.isPending}
      />

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
