/**
 * 입주 방문이력 모달
 * 화면 ID: CP-SA-99-002
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useVisitHistory } from '@/src/hooks/useDongho';

interface VisitHistoryModalProps {
  open: boolean;
  onClose: () => void;
  dong: string;
  ho: string;
  donghoId: number;
}

// 날짜 포맷팅
function formatDateTime(datetime: string | null): string {
  if (!datetime) return '-';
  const d = new Date(datetime);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDate(date: string | null): string {
  if (!date) return '-';
  return date;
}

function formatDateRange(begin: string | null, end: string | null): string {
  if (!begin && !end) return '-';
  if (begin && end) return `${begin} ~ ${end}`;
  return begin || end || '-';
}

export default function VisitHistoryModal({
  open,
  onClose,
  dong,
  ho,
  donghoId,
}: VisitHistoryModalProps) {
  const { projectUuid } = useCurrentProject();
  const { data: visitHistory, isLoading } = useVisitHistory(projectUuid, donghoId);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            입주 방문이력
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} color="primary">
            {dong} {ho}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : visitHistory && visitHistory.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>방문일시</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 60 }}>동</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 60 }}>호</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>방문자이름</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>방문자연락처</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>방문구분</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>방문목적</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>작업기간</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>이사예약일시</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>등록일시</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>등록자</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>등록자연락처</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>메모</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitHistory.map((visit) => (
                  <TableRow key={visit.id} hover>
                    <TableCell>{formatDateTime(visit.visit_datetime)}</TableCell>
                    <TableCell>{visit.dong}</TableCell>
                    <TableCell>{visit.ho}</TableCell>
                    <TableCell>{visit.visitor_name || '-'}</TableCell>
                    <TableCell>{visit.visitor_phone || '-'}</TableCell>
                    <TableCell>{visit.visit_type || '-'}</TableCell>
                    <TableCell>
                      {visit.visit_purpose?.join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      {formatDateRange(visit.work_begin, visit.work_end)}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(visit.move_reservation_datetime)}
                    </TableCell>
                    <TableCell>{formatDateTime(visit.created_at)}</TableCell>
                    <TableCell>{visit.created_by_name || '-'}</TableCell>
                    <TableCell>{visit.created_by_phone || '-'}</TableCell>
                    <TableCell>{visit.memo || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            방문이력이 없습니다.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
