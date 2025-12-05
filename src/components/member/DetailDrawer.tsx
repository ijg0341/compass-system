
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import type { ResidentData, MemberStatus, MemberLevel, ResidenceType } from '@/src/types/member';

interface DetailDrawerProps {
  open: boolean;
  resident: ResidentData | null;
  onClose: () => void;
}

const statusColorMap: Record<MemberStatus, string> = {
  ACTIVE: '#4CAF50',
  BLOCKED: '#F44336',
  WITHDRAWN: '#757575',
};

const statusLabelMap: Record<MemberStatus, string> = {
  ACTIVE: '활성',
  BLOCKED: '차단',
  WITHDRAWN: '탈퇴',
};

const levelLabelMap: Record<MemberLevel, string> = {
  GENERAL: '일반',
  VIP: 'VIP',
  VVIP: 'VVIP',
};

const residenceTypeLabelMap: Record<ResidenceType, string> = {
  OWNER: '자가',
  TENANT: '임차',
  FAMILY: '가족',
};

export default function DetailDrawer({ open, resident, onClose }: DetailDrawerProps) {
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

  if (!resident) return null;

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
              {resident.id}
            </Typography>
            <Chip
              label={statusLabelMap[resident.status]}
              size="small"
              sx={{
                backgroundColor: statusColorMap[resident.status],
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={levelLabelMap[resident.level]}
              size="small"
              variant="outlined"
            />
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
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
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>회원 ID</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.id}</TableCell>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>로그인 ID</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.loginId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>계약자명</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.contractorName}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>계약자 연락처</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.contractorPhone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>입주자명</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.residentName}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>입주자 연락처</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.residentPhone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>주민번호</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.residentIdNumber}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>회원구분</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.memberType}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 세대정보 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            세대정보
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>동</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.dong}</TableCell>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>호</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.ho}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>타입</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.unitType}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>라인</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.line}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>입주형태</TableCell>
                  <TableCell colSpan={3} sx={{ color: 'text.primary' }}>{residenceTypeLabelMap[resident.residenceType]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 입주일정 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            입주일정
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>입주예정일</TableCell>
                  <TableCell sx={{ width: '80%', color: 'text.primary' }}>{resident.expectedMoveInDate || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>이사예약일</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.moveReservationDate || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>입주일</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.actualMoveInDate || '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* 계정정보 섹션 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            계정정보
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>가입일</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.joinedAt}</TableCell>
                  <TableCell sx={{ width: '20%', bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>최종접속</TableCell>
                  <TableCell sx={{ width: '30%', color: 'text.primary' }}>{resident.lastAccessAt || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>권한</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{resident.permission}</TableCell>
                  <TableCell sx={{ bgcolor: 'action.hover', fontWeight: 600, color: 'text.primary' }}>상태</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{statusLabelMap[resident.status]}</TableCell>
                </TableRow>
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
