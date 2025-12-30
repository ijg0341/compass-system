/**
 * 팝업공지 다이얼로그
 * 프로젝트 진입 시 활성화된 팝업공지를 표시
 * 여러 팝업을 왼쪽 상단부터 오른쪽으로 나열
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Portal,
  Paper,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getActivePopups } from '@/src/lib/api/boardApi';
import type { BoardPost } from '@/src/types/board.types';

interface PopupNoticeDialogProps {
  projectUuid: string | null;
}

// 오늘 날짜 기준 로컬스토리지 키 생성
function getTodayKey(projectUuid: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `popup_dismissed_${projectUuid}_${today}`;
}

// 오늘 안보기 처리된 팝업 ID 목록 조회
function getDismissedPopupIds(projectUuid: string): number[] {
  const key = getTodayKey(projectUuid);
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// 오늘 안보기 처리
function dismissPopupToday(projectUuid: string, popupId: number): void {
  const key = getTodayKey(projectUuid);
  const dismissed = getDismissedPopupIds(projectUuid);
  if (!dismissed.includes(popupId)) {
    dismissed.push(popupId);
    localStorage.setItem(key, JSON.stringify(dismissed));
  }
}

// 어제 이전 키 정리
function cleanupOldKeys(): void {
  const today = new Date().toISOString().split('T')[0];
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('popup_dismissed_') && !key.endsWith(today)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

// 개별 팝업 컴포넌트
interface SinglePopupProps {
  popup: BoardPost;
  index: number;
  onClose: (popupId: number, dontShowToday: boolean) => void;
}

function SinglePopup({ popup, index, onClose }: SinglePopupProps) {
  const [dontShowToday, setDontShowToday] = useState(false);

  // 팝업 위치 계산 (왼쪽 상단부터 오른쪽으로)
  const POPUP_WIDTH = 420;
  const POPUP_GAP = 20;
  const START_TOP = 130; // Header + Nav 높이
  const START_LEFT = 20;

  const left = START_LEFT + index * (POPUP_WIDTH + POPUP_GAP);

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: START_TOP,
        left: left,
        width: POPUP_WIDTH,
        maxHeight: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300 + index,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(30, 30, 30, 0.98)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(245, 245, 245, 0.9)'
              : 'rgba(40, 40, 40, 0.9)',
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            mr: 1,
          }}
        >
          {popup.board_subject}
        </Typography>
        <IconButton
          onClick={() => onClose(popup.id, dontShowToday)}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* 내용 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
        }}
      >
        {/* 이미지 */}
        {popup.board_files && popup.board_files.length > 0 && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            {popup.board_files.map((file) => (
              <Box key={file.id} sx={{ mb: 1 }}>
                <img
                  src={file.url}
                  alt={file.original_name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 250,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* HTML 내용 */}
        <Box
          dangerouslySetInnerHTML={{ __html: popup.board_text }}
          sx={{
            '& p': { margin: '0.5em 0' },
            '& img': { maxWidth: '100%' },
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        />
      </Box>

      {/* 푸터 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(245, 245, 245, 0.9)'
              : 'rgba(40, 40, 40, 0.9)',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
            />
          }
          label={
            <Typography variant="caption">오늘 하루 보지 않기</Typography>
          }
          sx={{ m: 0 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => onClose(popup.id, dontShowToday)}
        >
          확인
        </Button>
      </Box>
    </Paper>
  );
}

export default function PopupNoticeDialog({ projectUuid }: PopupNoticeDialogProps) {
  const [popupsToShow, setPopupsToShow] = useState<BoardPost[]>([]);

  // 활성 팝업 조회
  const { data: activePopups } = useQuery({
    queryKey: ['active-popups', projectUuid],
    queryFn: () => getActivePopups(projectUuid!),
    enabled: !!projectUuid && projectUuid !== '__ADMIN_MODE__',
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 팝업 필터링 및 표시
  useEffect(() => {
    if (!activePopups || activePopups.length === 0 || !projectUuid) {
      setPopupsToShow([]);
      return;
    }

    // 오래된 키 정리
    cleanupOldKeys();

    // 오늘 안보기 처리된 팝업 제외
    const dismissedIds = getDismissedPopupIds(projectUuid);
    const filtered = activePopups.filter((p) => !dismissedIds.includes(p.id));

    setPopupsToShow(filtered);
  }, [activePopups, projectUuid]);

  // 팝업 닫기 핸들러
  const handleClose = useCallback(
    (popupId: number, dontShowToday: boolean) => {
      if (dontShowToday && projectUuid) {
        dismissPopupToday(projectUuid, popupId);
      }
      setPopupsToShow((prev) => prev.filter((p) => p.id !== popupId));
    },
    [projectUuid]
  );

  if (popupsToShow.length === 0) return null;

  return (
    <Portal>
      {popupsToShow.map((popup, index) => (
        <SinglePopup
          key={popup.id}
          popup={popup}
          index={index}
          onClose={handleClose}
        />
      ))}
    </Portal>
  );
}
