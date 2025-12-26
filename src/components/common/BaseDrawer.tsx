/**
 * 공통 Drawer 컴포넌트
 * 모든 상세 Drawer에서 공통으로 사용
 */

import { type ReactNode } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  type SxProps,
  type Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// =============================================================================
// BaseDrawer 메인 컴포넌트
// =============================================================================

interface BaseDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleExtra?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Drawer 너비 설정 (기본: wide) */
  size?: 'narrow' | 'medium' | 'wide';
}

const sizeConfig = {
  narrow: { width: { xs: '100%', sm: '60%', md: '50%', lg: '40%' }, maxWidth: '700px' },
  medium: { width: { xs: '100%', sm: '70%', md: '60%', lg: '50%' }, maxWidth: '900px' },
  wide: { width: { xs: '100%', sm: '85%', md: '80%', lg: '70%' }, maxWidth: '1400px' },
};

export default function BaseDrawer({
  open,
  onClose,
  title,
  titleExtra,
  children,
  footer,
  size = 'wide',
}: BaseDrawerProps) {
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
          ...sizeConfig[size],
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
              {title}
            </Typography>
            {titleExtra}
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 본문 */}
        <Box
          data-lenis-prevent
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
          {children}
        </Box>

        {/* 푸터 */}
        {footer && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

// =============================================================================
// DrawerSection: 섹션 타이틀 + 구분선
// =============================================================================

interface DrawerSectionProps {
  title: string;
  children: ReactNode;
  /** 첫 번째 섹션 여부 (구분선 표시 안함) */
  isFirst?: boolean;
}

export function DrawerSection({ title, children, isFirst = false }: DrawerSectionProps) {
  return (
    <>
      {!isFirst && <Divider sx={{ my: 3 }} />}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </>
  );
}

// =============================================================================
// DrawerInfoTable: 정보 표시용 테이블
// =============================================================================

export interface InfoRow {
  /** 라벨 */
  label: string;
  /** 값 (ReactNode 가능) */
  value: ReactNode;
  /** 전체 너비 사용 (colSpan=3) */
  fullWidth?: boolean;
}

interface DrawerInfoTableProps {
  /** 2열 또는 4열 레이아웃으로 표시될 행 데이터 */
  rows: (InfoRow | [InfoRow, InfoRow])[];
  /** 추가 스타일 */
  sx?: SxProps<Theme>;
}

const labelCellSx = {
  width: '20%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  color: 'text.primary',
};

const valueCellSx = {
  width: '30%',
  color: 'text.primary',
};

export function DrawerInfoTable({ rows, sx }: DrawerInfoTableProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ mb: 4, bgcolor: 'background.paper', ...sx }}
    >
      <Table size="small">
        <TableBody>
          {rows.map((row, index) => {
            // 배열인 경우: 2개의 컬럼 (4열 레이아웃)
            if (Array.isArray(row)) {
              const [left, right] = row;
              return (
                <TableRow key={index}>
                  <TableCell sx={labelCellSx}>{left.label}</TableCell>
                  <TableCell sx={valueCellSx}>{left.value ?? '-'}</TableCell>
                  <TableCell sx={labelCellSx}>{right.label}</TableCell>
                  <TableCell sx={valueCellSx}>{right.value ?? '-'}</TableCell>
                </TableRow>
              );
            }

            // 단일 객체인 경우
            if (row.fullWidth) {
              return (
                <TableRow key={index}>
                  <TableCell sx={labelCellSx}>{row.label}</TableCell>
                  <TableCell colSpan={3} sx={valueCellSx}>
                    {row.value ?? '-'}
                  </TableCell>
                </TableRow>
              );
            }

            // 단일 객체, 2열 레이아웃
            return (
              <TableRow key={index}>
                <TableCell sx={{ ...labelCellSx, width: '25%' }}>{row.label}</TableCell>
                <TableCell colSpan={3} sx={{ ...valueCellSx, width: '75%' }}>
                  {row.value ?? '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
