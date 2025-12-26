/**
 * 기초코드관리 - 동/호 탭
 * 화면 ID: CP-SA-07-001
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { DonghoForm, DonghoTable } from '@/src/components/dongho';
import {
  useDonghos,
  useCreateDongho,
  useUpdateDongho,
  useDeleteDongho,
} from '@/src/hooks/useDongho';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { Dongho, DonghoRequest } from '@/src/types/dongho.types';

export default function DonghoManageTab() {
  const { projectUuid } = useCurrentProject();

  // 편집 상태
  const [editingDongho, setEditingDongho] = useState<Dongho | null>(null);

  // 삭제 다이얼로그 상태
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; dongho: Dongho | null }>({
    open: false,
    dongho: null,
  });

  // 알림 상태
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // 데이터 조회
  const { data: donghosData, isLoading, error } = useDonghos(projectUuid);

  // 뮤테이션
  const createMutation = useCreateDongho();
  const updateMutation = useUpdateDongho();
  const deleteMutation = useDeleteDongho();

  // 데이터 추출
  const donghos = useMemo(() => donghosData?.list || [], [donghosData]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (data: DonghoRequest) => {
      try {
        if (editingDongho) {
          await updateMutation.mutateAsync({ projectUuid, id: editingDongho.id, data });
          setSnackbar({ open: true, message: '동호 코드가 수정되었습니다.', severity: 'success' });
          setEditingDongho(null);
        } else {
          await createMutation.mutateAsync({ projectUuid, data });
          setSnackbar({ open: true, message: '동호 코드가 등록되었습니다.', severity: 'success' });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    },
    [editingDongho, createMutation, updateMutation, projectUuid]
  );

  // 수정 핸들러
  const handleEdit = useCallback((dongho: Dongho) => {
    setEditingDongho(dongho);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 수정 취소 핸들러
  const handleCancelEdit = useCallback(() => {
    setEditingDongho(null);
  }, []);

  // 삭제 다이얼로그 열기
  const handleDeleteClick = useCallback((dongho: Dongho) => {
    setDeleteDialog({ open: true, dongho });
  }, []);

  // 삭제 처리
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.dongho) return;

    try {
      await deleteMutation.mutateAsync({ projectUuid, id: deleteDialog.dongho.id });
      setSnackbar({ open: true, message: '삭제되었습니다.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setDeleteDialog({ open: false, dongho: null });
    }
  }, [deleteDialog.dongho, deleteMutation, projectUuid]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Box>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            동/호 관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {donghosData?.total || 0}건
          </Typography>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 섹션 1: 동호 등록/수정 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
          {editingDongho ? '동호 코드 수정' : '동호 코드 생성/수정'}
        </Typography>
        <DonghoForm
          editingDongho={editingDongho}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        {/* 섹션 2: 동호 목록 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
          동호 코드 목록
        </Typography>

        {/* 로딩 표시 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DonghoTable
            data={donghos}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, dongho: null })}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &apos;{deleteDialog.dongho?.dong} {deleteDialog.dongho?.ho}&apos; 동호 코드를 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, dongho: null })}>취소</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteMutation.isPending}
            startIcon={deleteMutation.isPending && <CircularProgress size={16} />}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

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
