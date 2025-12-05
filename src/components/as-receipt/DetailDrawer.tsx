
import {
  Drawer,
  Box,
  IconButton,
  Chip,
  Button,
  Typography,
  Divider,
  ButtonGroup,
  Paper,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useEffect } from 'react';
import type { ASReceiptData, Priority, ASReceiptStatus } from '@/src/types/asReceipt';

interface DetailDrawerProps {
  open: boolean;
  receipt: ASReceiptData | null;
  onClose: () => void;
}

const statusColorMap: Record<ASReceiptStatus, string> = {
  RECEIVED: '#757575',
  ASSIGNED: '#757575',
  IN_PROGRESS: '#2196F3',
  QA: '#2196F3',
  DONE: '#4CAF50',
  REJECTED: '#F44336',
};

const statusLabelMap: Record<ASReceiptStatus, string> = {
  RECEIVED: '접수',
  ASSIGNED: '배정',
  IN_PROGRESS: '진행중',
  QA: '품질검수',
  DONE: '완료',
  REJECTED: '반려',
};


const priorityLabelMap: Record<Priority, string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
  URGENT: '긴급',
};

export default function DetailDrawer({ open, receipt, onClose }: DetailDrawerProps) {
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

  if (!receipt) return null;

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action} for receipt ${receipt.id}`);
    alert(`${action} 버튼이 클릭되었습니다. (실제 구현 필요)`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
          width: { xs: '100%', sm: '85%', md: '80%', lg: '70%' },
          maxWidth: '1400px',
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
              {receipt.id}
            </Typography>
            <Chip
              label={statusLabelMap[receipt.status]}
              size="small"
              sx={{
                backgroundColor: statusColorMap[receipt.status],
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={priorityLabelMap[receipt.priority]}
              size="small"
              variant="outlined"
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
          }}
        >
          <ButtonGroup variant="outlined" size="small">
            <Button
              startIcon={<EditIcon />}
              onClick={() => handleActionClick('상태변경')}
            >
              상태변경
            </Button>
            <Button
              startIcon={<PersonAddIcon />}
              onClick={() => handleActionClick('담당자배정')}
            >
              배정
            </Button>
            <Button
              startIcon={<CheckCircleIcon />}
              onClick={() => handleActionClick('승인')}
            >
              승인
            </Button>
          </ButtonGroup>
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
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>현장</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.siteName}</TableCell>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>동/호수</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.dong}동 {receipt.ho}호</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>공종</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.trade}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>소공종</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.subTrade}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>협력사</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.partner || '-'}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>담당자</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.assignee || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>요청자</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.requester}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>우선순위</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{priorityLabelMap[receipt.priority]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>접수일</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.requestedAt}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>예정일</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.dueDate}</TableCell>
                </TableRow>
                {receipt.completedAt && (
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>완료일</TableCell>
                    <TableCell colSpan={3} sx={{ color: 'text.primary' }}>{receipt.completedAt}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>내용</TableCell>
                  <TableCell colSpan={3} sx={{ color: 'text.primary' }}>{receipt.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 하자유형 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            하자유형
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>1단계 (대분류)</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.defectType.level1}</TableCell>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>2단계 (중분류)</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.defectType.level2}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>3단계 (소분류)</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.defectType.level3}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>4단계 (세분류)</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{receipt.defectType.level4}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 이미지 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            이미지
          </Typography>

          {/* 원거리 사진 */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            원거리 사진 ({receipt.photos.far.length})
          </Typography>
          {receipt.photos.far.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {receipt.photos.far.map((photo, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Avatar variant="square" sx={{ width: '100%', height: 120 }}>
                      <ImageIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ width: '100%', textAlign: 'center' }}>
                      {photo}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              원거리 사진이 없습니다.
            </Typography>
          )}

          {/* 근거리 사진 */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            근거리 사진 ({receipt.photos.near.length})
          </Typography>
          {receipt.photos.near.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {receipt.photos.near.map((photo, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Avatar variant="square" sx={{ width: '100%', height: 120 }}>
                      <ImageIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ width: '100%', textAlign: 'center' }}>
                      {photo}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              근거리 사진이 없습니다.
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 첨부파일 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            첨부파일
          </Typography>
          {receipt.attachments.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {receipt.attachments.map((attachment) => (
                <Grid size={{ xs: 12, sm: 6 }} key={attachment.id}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <AttachFileIcon color="action" />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {attachment.fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(attachment.fileSize)} · {attachment.uploadedAt}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => console.log('Download:', attachment.fileName)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              첨부파일이 없습니다.
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 이력 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            이력
          </Typography>
          {receipt.histories.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              {receipt.histories.map((history) => (
                <Paper
                  key={history.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <TimelineIcon color="action" sx={{ mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {history.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {history.createdAt}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {history.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      작성자: {history.createdBy}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              이력이 없습니다.
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 승인정보 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            승인정보
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>승인 상태</TableCell>
                  <TableCell colSpan={3} sx={{ color: 'text.primary' }}>
                    {receipt.approval?.isApproved ? '승인됨' : '미승인'}
                  </TableCell>
                </TableRow>
                {receipt.approval?.isApproved && (
                  <>
                    <TableRow>
                      <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>승인자</TableCell>
                      <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.approval.approvedBy}</TableCell>
                      <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>승인일시</TableCell>
                      <TableCell sx={{ width: '30%', color: 'text.primary' }}>{receipt.approval.approvedAt}</TableCell>
                    </TableRow>
                  </>
                )}
                {receipt.approval?.rejectedReason && (
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>반려 사유</TableCell>
                    <TableCell colSpan={3}>
                      <Typography color="error">{receipt.approval.rejectedReason}</Typography>
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
