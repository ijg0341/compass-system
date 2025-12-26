/**
 * 기초코드관리 - 하자종류 탭
 * 화면 ID: CP-SA-07-002
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import DefectTypeForm, { type AscodeRequest } from './DefectTypeForm';
import DefectTypeTable from './DefectTypeTable';
import {
  useAscodes,
  useCreateAscode,
  useUpdateAscode,
  usePartners,
} from '@/src/hooks/useAfterservice';
import { useDonghos } from '@/src/hooks/useDongho';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { downloadAscodesExcel } from '@/src/lib/api/afterserviceApi';
import type { Ascode } from '@/src/types/afterservice.types';

export default function DefectTypeManageTab() {
  const { projectUuid } = useCurrentProject();

  // 편집 상태
  const [editingItem, setEditingItem] = useState<Ascode | null>(null);

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // 알림 상태
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // 데이터 조회
  const { data: ascodesData, isLoading, error } = useAscodes(projectUuid);
  const { data: donghosData } = useDonghos(projectUuid);
  const { data: partnersData } = usePartners(projectUuid);

  // 뮤테이션
  const createMutation = useCreateAscode();
  const updateMutation = useUpdateAscode();

  // 데이터 추출
  const ascodes = useMemo(() => ascodesData?.list || [], [ascodesData]);
  const partners = useMemo(() => partnersData?.list || [], [partnersData]);

  // 타입/평수 목록 (동호 코드에서 추출)
  const unitTypes = useMemo(() => {
    const types = new Set<string>();
    donghosData?.list?.forEach((d) => {
      if (d.unit_type) types.add(d.unit_type);
    });
    return Array.from(types);
  }, [donghosData]);

  // 협력사 맵 (id -> company name)
  const partnerMap = useMemo(() => {
    const map = new Map<number, string>();
    partners.forEach((p) => {
      map.set(p.id, p.company || p.name);
    });
    return map;
  }, [partners]);

  // 페이지네이션된 데이터
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return ascodes.slice(start, start + rowsPerPage);
  }, [ascodes, page, rowsPerPage]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (data: AscodeRequest) => {
      try {
        if (editingItem) {
          await updateMutation.mutateAsync({ projectUuid, id: editingItem.id, data });
          setSnackbar({ open: true, message: '하자종류 코드가 수정되었습니다.', severity: 'success' });
          setEditingItem(null);
        } else {
          await createMutation.mutateAsync({ projectUuid, data });
          setSnackbar({ open: true, message: '하자종류 코드가 등록되었습니다.', severity: 'success' });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    },
    [editingItem, createMutation, updateMutation, projectUuid]
  );

  // 수정 핸들러
  const handleEdit = useCallback((item: Ascode) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 수정 취소 핸들러
  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(async () => {
    try {
      await downloadAscodesExcel(projectUuid);
      setSnackbar({ open: true, message: '엑셀 다운로드가 완료되었습니다.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '엑셀 다운로드에 실패했습니다.', severity: 'error' });
    }
  }, [projectUuid]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Box>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            하자종류 관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {ascodesData?.total || 0}건
          </Typography>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 섹션 1: 하자종류 등록/수정 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
          {editingItem ? '하자종류 코드 수정' : '하자종류 코드 생성/수정'}
        </Typography>
        <DefectTypeForm
          editingItem={editingItem}
          unitTypes={unitTypes}
          partners={partners}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        {/* 섹션 2: 하자종류 목록 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
          하자종류 코드 목록
        </Typography>

        {/* 로딩 표시 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DefectTypeTable
            data={paginatedData}
            total={ascodes.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onEdit={handleEdit}
            onExcelDownload={handleExcelDownload}
            partnerMap={partnerMap}
          />
        )}
      </Box>

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
    </>
  );
}
