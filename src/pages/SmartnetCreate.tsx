import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import CategorySelector from '@/src/components/smartnet/CategorySelector';
import ContentEditor from '@/src/components/smartnet/ContentEditor';
import ActionButtons from '@/src/components/smartnet/ActionButtons';
import type {
  SmartnetFormData,
  SmartnetCategory,
  SmartnetContent,
} from '@/src/types/smartnet';
import { INITIAL_FORM_DATA } from '@/src/types/smartnet';

export default function SmartnetCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SmartnetFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // 카테고리 변경
  const handleCategoryChange = useCallback((category: SmartnetCategory | null) => {
    setFormData((prev) => ({ ...prev, category }));
  }, []);

  // 컨텐츠 변경
  const handleContentChange = useCallback((content: SmartnetContent) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    if (!formData.category) return false;
    if (!formData.content.title.trim()) return false;
    if (!formData.content.description.trim()) return false;
    return true;
  }, [formData]);

  // 저장 처리
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // URL 자동 생성
      const uuid = crypto.randomUUID();
      const categoryPath = formData.category;
      const url = `https://smartnet.compass.com/${categoryPath}/${uuid}`;

      console.log('저장 완료:', {
        ...formData,
        generatedURL: url,
        id: uuid,
      });

      setSnackbar({
        open: true,
        message: '저장이 완료되었습니다.',
        severity: 'success',
      });

      // 저장 후 목록 페이지로 이동
      setTimeout(() => {
        navigate('/smartnet');
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: '저장 중 오류가 발생했습니다.',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, navigate]);

  // 스낵바 닫기
  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <Box>
        {/* 헤더 영역 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            스마트넷 URL 생성
          </Typography>
          <Typography variant="body2" color="text.secondary">
            방문예약, 이사예약 페이지를 생성하고 URL을 배포하세요.
          </Typography>
        </Box>

        {/* 메인 컨텐츠 */}
        <Paper
          sx={{
            p: 3,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* 카테고리 선택 */}
          <CategorySelector value={formData.category} onChange={handleCategoryChange} />

          <Divider sx={{ my: 3 }} />

          {/* 컨텐츠 편집기 */}
          <ContentEditor content={formData.content} onChange={handleContentChange} />

          {/* 하단 액션 버튼 */}
          <Box sx={{ mt: 3 }}>
            <ActionButtons
              onSave={handleSave}
              isFormValid={isFormValid()}
              isSaving={isSaving}
            />
          </Box>
        </Paper>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
