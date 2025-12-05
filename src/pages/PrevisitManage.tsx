/**
 * 스마트넷 - 사전방문 생성 (CP-SA-10-001)
 * 사전방문 행사를 생성하고 관리하는 페이지
 */
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { PrevisitCreateForm, PrevisitListTable } from '@/src/components/previsit';
import {
  usePrevisits,
  useCreatePrevisit,
  useDeletePrevisit,
} from '@/src/hooks/usePrevisit';
import { useUploadFile } from '@/src/hooks/useReservation';
import type { Previsit, PrevisitRequest } from '@/src/types/previsit.types';
import { generatePrevisitUrl } from '@/src/lib/utils/hash';

// 방문예약 시스템 URL (환경변수로 관리 권장)
const RESERVATION_BASE_URL = import.meta.env.VITE_RESERVATION_URL || 'https://customer.compass1998.com';

export default function PrevisitManagePage() {
  const navigate = useNavigate();

  // UI 상태
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; previsit: Previsit | null }>({
    open: false,
    previsit: null,
  });

  // API 훅
  const { data: previsitData, isLoading, error } = usePrevisits({ project_id: 1 });
  const createMutation = useCreatePrevisit();
  const deleteMutation = useDeletePrevisit();
  const uploadMutation = useUploadFile();

  // 목록 데이터
  const previsits = useMemo(() => previsitData?.list || [], [previsitData]);
  const existingNames = useMemo(() => previsits.map((p) => p.name), [previsits]);

  // 등록 핸들러
  const handleSubmit = useCallback(
    async (data: PrevisitRequest, file?: File) => {
      let imageFileId: number | undefined;

      // 이미지 업로드
      if (file) {
        const uploadResult = await uploadMutation.mutateAsync({
          file,
          options: {
            entityType: 'previsit',
            fileCategory: 'image',
            isPublic: true,
          },
        });
        imageFileId = uploadResult.id;
      }

      // 사전방문 생성
      await createMutation.mutateAsync({
        ...data,
        image_file_id: imageFileId,
      });

      setSnackbar({ open: true, message: '사전방문 행사가 등록되었습니다.', severity: 'success' });
    },
    [createMutation, uploadMutation]
  );

  // 조회 (예약 화면으로 이동)
  const handleView = useCallback(
    (previsit: Previsit) => {
      navigate(`/pre-visit/reservation?previsit_id=${previsit.id}`);
    },
    [navigate]
  );

  // URL 복사 (해시 포함)
  const handleCopyUrl = useCallback((previsit: Previsit) => {
    const url = generatePrevisitUrl(RESERVATION_BASE_URL, previsit.id, previsit.name);
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: 'URL이 복사되었습니다.', severity: 'info' });
  }, []);

  // 삭제 다이얼로그 열기
  const handleDeleteClick = useCallback((previsit: Previsit) => {
    setDeleteDialog({ open: true, previsit });
  }, []);

  // 삭제 처리
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.previsit) return;

    try {
      await deleteMutation.mutateAsync(deleteDialog.previsit.id);
      setSnackbar({ open: true, message: '삭제되었습니다.', severity: 'success' });
    } catch (err) {
      console.error('삭제 실패:', err);
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setDeleteDialog({ open: false, previsit: null });
    }
  }, [deleteDialog.previsit, deleteMutation]);

  return (
    <>
      <Box>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            사전방문 생성
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {previsits.length}건
          </Typography>
        </Box>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            데이터를 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 섹션 1: 사전방문 생성 */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
          사전방문 생성
        </Typography>
        <PrevisitCreateForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || uploadMutation.isPending}
          existingNames={existingNames}
        />

        {/* 섹션 2: 사전방문 목록 */}
        <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
          사전방문 목록
        </Typography>

        {/* 로딩 표시 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <PrevisitListTable
            data={previsits}
            onView={handleView}
            onCopyUrl={handleCopyUrl}
            onDelete={handleDeleteClick}
          />
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, previsit: null })}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &apos;{deleteDialog.previsit?.name}&apos; 사전방문 행사를 삭제하시겠습니까?
            <br />
            관련된 예약 정보도 함께 삭제됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, previsit: null })}>취소</Button>
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
