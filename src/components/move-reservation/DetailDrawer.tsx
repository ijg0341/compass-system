
import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Chip,
  Button,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import type { AdminMoveReservation, ElevatorLine } from '@/src/types/reservation';
import { getMoveStatusLabel, getMoveTypeLabel } from '@/src/lib/mockData/reservationData';

interface DetailDrawerProps {
  open: boolean;
  reservation: AdminMoveReservation | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: 'cancelled', reason: string) => void;
}

const ELEVATOR_LINE_COLORS: Record<ElevatorLine, string> = {
  A: '#E63C2E',
  B: '#2196F3',
  C: '#4CAF50',
  D: '#FF9800',
};

export default function DetailDrawer({
  open,
  reservation,
  onClose,
  onStatusChange,
}: DetailDrawerProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Drawer가 열릴 때 Lenis 스크롤 중지
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

  if (!reservation) return null;

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (onStatusChange && cancelReason.trim()) {
      onStatusChange(reservation.id, 'cancelled', cancelReason);
    }
    setCancelDialogOpen(false);
    setCancelReason('');
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setCancelReason('');
  };

  return (
    <>
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
            width: { xs: '100%', sm: '85%', md: '60%', lg: '50%' },
            maxWidth: '800px',
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
                label={getMoveStatusLabel(reservation.status)}
                size="small"
                sx={{
                  backgroundColor:
                    reservation.status === 'active' ? '#4CAF50' : '#F44336',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={getMoveTypeLabel(reservation.moveType)}
                size="small"
                variant="outlined"
                color={reservation.moveType === 'move_in' ? 'info' : 'warning'}
              />
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 액션 버튼 */}
          {reservation.status === 'active' && (
            <Box
              sx={{
                p: 2,
                display: 'flex',
                gap: 1,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancelClick}
                size="small"
              >
                예약 취소
              </Button>
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
                        width: '30%',
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      예약번호
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.id}
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
                      예약자명
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.ownerName}
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
                      연락처
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
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
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      승강기 라인
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <Chip
                        label={`${reservation.elevatorLine} 라인`}
                        size="small"
                        sx={{
                          backgroundColor:
                            ELEVATOR_LINE_COLORS[reservation.elevatorLine],
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            {/* 이사 정보 섹션 */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              이사 정보
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
                        width: '30%',
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      이사 유형
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <Chip
                        label={getMoveTypeLabel(reservation.moveType)}
                        size="small"
                        variant="outlined"
                        color={
                          reservation.moveType === 'move_in' ? 'info' : 'warning'
                        }
                      />
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
                      이사일
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {dayjs(reservation.date).format('YYYY년 MM월 DD일 (ddd)')}
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
                      예약 시간대
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.timeSlot}
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
                      차량 종류
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.vehicleType || '-'}
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
                      차량 번호
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.vehicleNumber || '-'}
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
                      이사 업체
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.movingCompany || '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            {/* 특이사항 섹션 */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              특이사항
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
                        width: '30%',
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      특별 요청사항
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.specialRequests || '없음'}
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
                      관리자 메모
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {reservation.memo || '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            {/* 메타 정보 섹션 */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              메타 정보
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
                        width: '30%',
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      예약 생성일
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {dayjs(reservation.createdAt).format('YYYY-MM-DD HH:mm')}
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
                      최종 수정일
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {dayjs(reservation.updatedAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                  </TableRow>
                  {reservation.cancelledAt && (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: 'action.hover',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          취소일
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'error.main',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {dayjs(reservation.cancelledAt).format('YYYY-MM-DD HH:mm')}
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
                          취소 사유
                        </TableCell>
                        <TableCell sx={{ color: 'error.main' }}>
                          {reservation.cancelReason || '-'}
                        </TableCell>
                      </TableRow>
                    </>
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

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>예약 취소</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="취소 사유"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>취소</Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={!cancelReason.trim()}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
