
import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import type { SmartnetFormData } from '@/src/types/smartnet';
import { CATEGORY_LABELS } from '@/src/types/smartnet';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  formData: SmartnetFormData;
}

export default function PreviewDialog({ open, onClose, formData }: PreviewDialogProps) {
  // Dialog 열릴 때 Lenis 스크롤 중지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
      if (open && lenis) {
        lenis.stop();
      } else if (!open && lenis) {
        lenis.start();
      }
    }
  }, [open]);

  const formatSettings = () => {
    if (!formData.category) return null;

    if (formData.category === 'visit') {
      const settings = formData.visitSettings;
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            예약 기간: {settings.startDate || '미설정'} ~ {settings.endDate || '미설정'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            시간 단위: {settings.timeInterval}분
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            시간대별 최대 예약: {settings.maxReservationsPerSlot}세대
          </Typography>
        </Box>
      );
    }

    if (formData.category === 'move') {
      const settings = formData.moveSettings;
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            예약 기간: {settings.startDate || '미설정'} ~ {settings.endDate || '미설정'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            시간 단위: {settings.timeSlotDuration}시간
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIphoneIcon />
          <Typography variant="h6">모바일 미리보기</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* 모바일 프레임 */}
        <Paper
          sx={{
            width: '100%',
            maxWidth: 320,
            mx: 'auto',
            borderRadius: 4,
            overflow: 'hidden',
            background: '#1a1a1a',
            border: '8px solid #333',
          }}
        >
          {/* 상태바 */}
          <Box
            sx={{
              height: 24,
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 6,
                borderRadius: 3,
                background: '#333',
              }}
            />
          </Box>

          {/* 컨텐츠 영역 */}
          <Box sx={{ p: 2, minHeight: 400, background: '#0f0f0f' }}>
            {/* 카테고리 태그 */}
            {formData.category && (
              <Chip
                label={CATEGORY_LABELS[formData.category]}
                size="small"
                color="primary"
                sx={{ mb: 2 }}
              />
            )}

            {/* 제목 */}
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2, color: '#ededed', wordBreak: 'break-word' }}
            >
              {formData.content.title || '제목을 입력해주세요'}
            </Typography>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* 내용 (HTML 렌더링) */}
            <Box
              sx={{
                color: '#b3b3b3',
                fontSize: '0.875rem',
                mb: 2,
                '& p': { margin: 0 },
                '& h1, & h2, & h3': { color: '#ededed', mt: 1, mb: 0.5 },
                '& a': { color: '#E63C2E' },
                '& ul, & ol': { pl: 2, my: 0.5 },
              }}
              dangerouslySetInnerHTML={{
                __html: formData.content.description || '<p style="color: #666;">내용을 입력해주세요</p>'
              }}
            />

            {/* 메인 이미지 */}
            {formData.content.mainImage && (
              <Box sx={{ mt: 2 }}>
                <Box
                  component="img"
                  src={formData.content.mainImage}
                  alt="메인 이미지"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    display: 'block',
                  }}
                />
              </Box>
            )}

            {/* 설정 정보 */}
            {formatSettings()}
          </Box>

          {/* 홈 버튼 */}
          <Box
            sx={{
              height: 40,
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 4,
                borderRadius: 2,
                background: '#333',
              }}
            />
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
