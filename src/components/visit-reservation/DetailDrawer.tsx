
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimelineIcon from '@mui/icons-material/Timeline';
import type { AdminVisitReservation, VisitReservationStatus } from '@/src/types/reservation';
import { getVisitStatusLabel } from '@/src/lib/mockData/reservationData';

interface DetailDrawerProps {
  open: boolean;
  reservation: AdminVisitReservation | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: VisitReservationStatus, reason?: string) => void;
}

const statusColorMap: Record<VisitReservationStatus, string> = {
  pending: '#FF9800',
  confirmed: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
};

export default function DetailDrawer({
  open,
  reservation,
  onClose,
  onStatusChange,
}: DetailDrawerProps) {
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [newStatus, setNewStatus] = useState<VisitReservationStatus | ''>('');
  const [cancelReason, setCancelReason] = useState('');

  // Drawer가 열릴 때 Lenis 스크롤 중지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (window as typeof window & { lenis?: { stop: () => void; start: () => void } }).lenis;
      if (open && lenis) {
        lenis.stop();
      } else if (!open && lenis) {
        lenis.start();
      }
    }
  }, [open]);

  // Drawer가 닫힐 때 상태 초기화를 위한 이벤트 핸들러
  const handleDrawerClose = () => {
    setShowStatusChange(false);
    setNewStatus('');
    setCancelReason('');
    onClose();
  };

  if (!reservation) return null;

  const handleConfirm = () => {
    if (onStatusChange) {
      onStatusChange(reservation.id, 'confirmed');
    }
    alert(`예약 ${reservation.id}을(를) 확정하였습니다. (실제 구현 필요)`);
  };

  const handleCancel = () => {
    setShowStatusChange(true);
    setNewStatus('cancelled');
  };

  const handleStatusChangeSubmit = () => {
    if (newStatus && onStatusChange) {
      onStatusChange(reservation.id, newStatus, cancelReason);
    }
    alert(
      `예약 ${reservation.id}의 상태를 ${getVisitStatusLabel(newStatus as VisitReservationStatus)}(으)로 변경하였습니다. (실제 구현 필요)`
    );
    setShowStatusChange(false);
    setNewStatus('');
    setCancelReason('');
  };

  const formatDateTime = (date: string, time: string) => {
    return `${dayjs(date).format('YYYY년 MM월 DD일')} ${time}`;
  };

  const formatDate = (isoString: string) => {
    return dayjs(isoString).format('YYYY-MM-DD HH:mm');
  };

  // 상태 변경 가능 여부
  const canConfirm = reservation.status === 'pending';
  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';
  // canComplete는 향후 완료 기능 구현시 사용 예정
  // const canComplete = reservation.status === 'confirmed';

  // 상태 이력 (목업)
  const statusHistory = [
    {
      id: '1',
      previousStatus: '-',
      newStatus: '대기중',
      changedBy: '시스템',
      changedAt: reservation.createdAt,
      reason: '예약 등록',
    },
  ];

  if (reservation.confirmedAt) {
    statusHistory.push({
      id: '2',
      previousStatus: '대기중',
      newStatus: '확정',
      changedBy: '관리자',
      changedAt: reservation.confirmedAt,
      reason: '예약 확정',
    });
  }

  if (reservation.completedAt) {
    statusHistory.push({
      id: '3',
      previousStatus: '확정',
      newStatus: '완료',
      changedBy: '시스템',
      changedAt: reservation.completedAt,
      reason: '방문 완료',
    });
  }

  if (reservation.cancelledAt) {
    statusHistory.push({
      id: '4',
      previousStatus: reservation.confirmedAt ? '확정' : '대기중',
      newStatus: '취소',
      changedBy: '관리자',
      changedAt: reservation.cancelledAt,
      reason: reservation.cancelReason || '취소',
    });
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      disableScrollLock={false}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        zIndex: 1300,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '85%', md: '60%', lg: '50%' },
          maxWidth: '900px',
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
              {reservation.id}
            </Typography>
            <Chip
              label={getVisitStatusLabel(reservation.status)}
              size="small"
              sx={{
                backgroundColor: statusColorMap[reservation.status],
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
          <IconButton onClick={handleDrawerClose}>
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
              startIcon={<CheckCircleIcon />}
              onClick={handleConfirm}
              disabled={!canConfirm}
              color="success"
            >
              확정
            </Button>
            <Button
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={!canCancel}
              color="error"
            >
              취소
            </Button>
          </ButtonGroup>
        </Box>

        {/* 상태 변경 폼 */}
        {showStatusChange && (
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Alert severity="warning" sx={{ mb: 2 }}>
              예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </Alert>
            <TextField
              fullWidth
              size="small"
              label="취소 사유"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowStatusChange(false)}
              >
                취소
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleStatusChangeSubmit}
                disabled={!cancelReason}
              >
                확인
              </Button>
            </Box>
          </Box>
        )}

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
          {/* 예약 정보 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            예약 정보
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
                    예약자명
                  </TableCell>
                  <TableCell sx={{ width: '25%', color: 'text.primary' }}>
                    {reservation.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '25%',
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    연락처
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '25%',
                      color: 'text.primary',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {reservation.phone}
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
                    동/호수
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {reservation.building} {reservation.unit}
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    예약일시
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'text.primary',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatDateTime(reservation.date, reservation.time)}
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
                    방문 목적
                  </TableCell>
                  <TableCell colSpan={3} sx={{ color: 'text.primary' }}>
                    {reservation.purpose || '-'}
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
                    등록일
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'text.primary',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatDate(reservation.createdAt)}
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'action.hover',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    최종수정일
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'text.primary',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatDate(reservation.updatedAt)}
                  </TableCell>
                </TableRow>
                {reservation.memo && (
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      관리자 메모
                    </TableCell>
                    <TableCell colSpan={3} sx={{ color: 'text.primary' }}>
                      {reservation.memo}
                    </TableCell>
                  </TableRow>
                )}
                {reservation.cancelReason && (
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      취소 사유
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Typography color="error">{reservation.cancelReason}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 상태 이력 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            상태 이력
          </Typography>
          {statusHistory.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              {statusHistory.map((history) => (
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {history.previousStatus} → {history.newStatus}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatDate(history.changedAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {history.reason}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      변경자: {history.changedBy}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              상태 이력이 없습니다.
            </Typography>
          )}
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
          <Button variant="outlined" onClick={handleDrawerClose}>
            닫기
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
