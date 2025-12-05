import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import type { Previsit } from '@/src/types/previsit.types';

// 날짜 포맷 (string 또는 { date: string } 객체 처리)
const formatDate = (date: string | { date: string }) => {
  if (typeof date === 'object' && date !== null) {
    return dayjs(date.date).format('YYYY-MM-DD');
  }
  return dayjs(date).format('YYYY-MM-DD');
};

interface PrevisitListTableProps {
  data: Previsit[];
  onView: (previsit: Previsit) => void;
  onCopyUrl: (previsit: Previsit) => void;
  onDelete: (previsit: Previsit) => void;
}

export default function PrevisitListTable({
  data,
  onView,
  onCopyUrl,
  onDelete,
}: PrevisitListTableProps) {
  return (
    <Paper
      sx={{
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>행사명</TableCell>
              <TableCell>시작일</TableCell>
              <TableCell>종료일</TableCell>
              <TableCell>첫시간</TableCell>
              <TableCell>마지막시간</TableCell>
              <TableCell>예약시간단위</TableCell>
              <TableCell>단위당 최대 인원</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  등록된 사전방문 행사가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((previsit) => (
                <TableRow key={previsit.id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{previsit.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(previsit.date_begin)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(previsit.date_end)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {previsit.time_first?.slice(0, 5)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {previsit.time_last?.slice(0, 5)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={previsit.time_unit === 30 ? '30분' : '1시간'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{previsit.max_limit || '-'}명</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="조회">
                        <IconButton size="small" onClick={() => onView(previsit)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="URL 복사">
                        <IconButton size="small" onClick={() => onCopyUrl(previsit)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" color="error" onClick={() => onDelete(previsit)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
