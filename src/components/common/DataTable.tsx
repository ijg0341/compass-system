/**
 * 공통 데이터 테이블 컴포넌트
 * 모든 페이지의 테이블에서 일관된 스타일 적용
 */

import { type ReactNode } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface Column<T> {
  /** 컬럼 ID (데이터 키) */
  id: keyof T | string;
  /** 헤더 라벨 */
  label: string;
  /** 최소 너비 */
  minWidth?: number;
  /** 정렬 */
  align?: 'left' | 'center' | 'right';
  /** 커스텀 렌더러 */
  render?: (row: T) => ReactNode;
  /** 헤더 스타일 */
  headerSx?: SxProps<Theme>;
  /** 셀 스타일 */
  cellSx?: SxProps<Theme> | ((row: T) => SxProps<Theme> | undefined);
}

interface DataTableProps<T> {
  /** 컬럼 정의 */
  columns: Column<T>[];
  /** 데이터 배열 */
  data: T[];
  /** 총 데이터 수 (페이지네이션용) */
  total?: number;
  /** 현재 페이지 (0부터 시작) */
  page?: number;
  /** 페이지당 행 수 */
  rowsPerPage?: number;
  /** 페이지 변경 핸들러 */
  onPageChange?: (page: number) => void;
  /** 페이지당 행 수 변경 핸들러 */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: T) => void;
  /** 행 고유 키 추출 함수 */
  getRowKey: (row: T) => string | number;
  /** 페이지네이션 표시 여부 */
  showPagination?: boolean;
  /** 데이터 없을 때 메시지 */
  emptyMessage?: string;
  /** 행 호버 시 클릭 커서 표시 */
  clickable?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  getRowKey,
  showPagination = true,
  emptyMessage = '데이터가 없습니다.',
  clickable = true,
}: DataTableProps<T>) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
    onPageChange?.(0);
  };

  return (
    <Paper
      sx={{
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  sx={{
                    fontWeight: 600,
                    minWidth: column.minWidth,
                    ...column.headerSx,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={getRowKey(row)}
                hover
                sx={{ cursor: clickable && onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const cellSx =
                    typeof column.cellSx === 'function'
                      ? (column.cellSx as (row: T) => SxProps<Theme>)(row)
                      : column.cellSx;

                  return (
                    <TableCell
                      key={String(column.id)}
                      align={column.align}
                      sx={cellSx}
                    >
                      {column.render
                        ? column.render(row)
                        : (row[column.id as keyof T] as ReactNode) ?? '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / 총 ${count}건`
          }
        />
      )}
    </Paper>
  );
}
