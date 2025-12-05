
import { useEffect } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Chip,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LaunchIcon from '@mui/icons-material/Launch';
import type { SmartnetListItem } from '@/src/types/smartnet';
import { CATEGORY_LABELS } from '@/src/types/smartnet';

interface DetailDrawerProps {
  open: boolean;
  item: SmartnetListItem | null;
  onClose: () => void;
}

const categoryColorMap = {
  visit: '#2196F3',
  move: '#FF9800',
  vote: '#9C27B0',
};

export default function DetailDrawer({
  open,
  item,
  onClose,
}: DetailDrawerProps) {
  // Drawer가 열릴 때 Lenis 스크롤 중지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (window as { lenis?: { stop: () => void; start: () => void } }).lenis;
      if (open && lenis) {
        lenis.stop();
      } else if (!open && lenis) {
        lenis.start();
      }
    }
  }, [open]);

  if (!item) return null;

  const handleOpenURL = () => {
    if (item) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    alert('URL이 클립보드에 복사되었습니다.');
  };

  const handleEdit = () => {
    alert('수정 기능은 추후 구현 예정입니다.');
  };

  const handleDelete = () => {
    if (confirm(`정말로 "${item.title}"을 삭제하시겠습니까?`)) {
      alert('삭제 기능은 추후 구현 예정입니다.');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      disableScrollLock={false}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        zIndex: 1300,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '85%', md: '70%', lg: '60%' },
          maxWidth: '1000px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 헤더 */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {item.id}
            </Typography>
            <Chip
              label={CATEGORY_LABELS[item.category]}
              size="small"
              sx={{
                backgroundColor: categoryColorMap[item.category],
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 액션 버튼 그룹 */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
            borderBottom: 1,
            borderColor: 'divider',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<LaunchIcon />}
            onClick={handleOpenURL}
          >
            바로가기
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyUrl}
          >
            URL 복사
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            삭제
          </Button>
        </Box>

        {/* 본문 */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          {/* 기본정보 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            기본정보
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mb: 4, bgcolor: 'background.paper' }}
          >
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      width: '25%',
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    제목
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {item.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    URL
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: 'primary.main',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          wordBreak: 'break-all',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.url}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleOpenURL}
                        title="새 창에서 열기"
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleCopyUrl}
                        title="URL 복사"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    카테고리
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {CATEGORY_LABELS[item.category]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    생성일
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {item.createdAt}
                  </TableCell>
                </TableRow>
                {item.description && (
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      설명
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {/* 향후 HTML 에디터 연동 예정 */}
                      {item.description}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 푸터 */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            닫기
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
