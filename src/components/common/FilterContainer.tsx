/**
 * 공통 필터 컨테이너 컴포넌트
 * 모든 페이지의 필터바에서 일관된 스타일 적용
 */

import { type ReactNode } from 'react';
import { Paper, Box, Button } from '@mui/material';

interface FilterRowProps {
  children: ReactNode;
  /** 마지막 줄 여부 (margin-bottom 제거) */
  isLast?: boolean;
}

/** 필터 행 컴포넌트 */
export function FilterRow({ children, isLast = false }: FilterRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: isLast ? 0 : 1.5,
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
}

interface FilterContainerProps {
  children: ReactNode;
  /** 초기화 버튼 클릭 핸들러 */
  onReset?: () => void;
  /** 검색/적용 버튼 클릭 핸들러 */
  onApply?: () => void;
  /** 검색 버튼 텍스트 (기본: '검색') */
  applyButtonText?: string;
  /** 버튼 표시 여부 (기본: true) */
  showButtons?: boolean;
}

/** 필터 컨테이너 컴포넌트 */
export default function FilterContainer({
  children,
  onReset,
  onApply,
  applyButtonText = '검색',
  showButtons = true,
}: FilterContainerProps) {
  return (
    <Paper
      sx={{
        p: 1.5,
        mb: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}

      {showButtons && (onReset || onApply) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 1.5,
          }}
        >
          {onReset && (
            <Button variant="outlined" onClick={onReset} size="small">
              초기화
            </Button>
          )}
          {onApply && (
            <Button variant="contained" onClick={onApply} size="small">
              {applyButtonText}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}
