/**
 * 방문이력 모달 컴포넌트
 * 화면 ID: CP-SA-99-002
 */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { VisitHistory } from '@/src/types/dongho.types';

interface VisitHistoryModalProps {
  open: boolean;
  onClose: () => void;
  data: VisitHistory[];
}

export default function VisitHistoryModal({ open, onClose, data }: VisitHistoryModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          입주방문이력
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {data.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">방문이력이 없습니다.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>방문일시</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>동</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>호</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>방문자명</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>방문자 연락처</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>방문구분</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>방문목적</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>작업기간</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>이사예약일시</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>등록일시</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>등록자</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>메모</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.visit_datetime?.slice(0, 16).replace('T', ' ') || '-'}
                    </TableCell>
                    <TableCell>{item.dong}</TableCell>
                    <TableCell>{item.ho}</TableCell>
                    <TableCell>{item.visitor_name}</TableCell>
                    <TableCell>{item.visitor_phone}</TableCell>
                    <TableCell>{item.visit_type}</TableCell>
                    <TableCell>{item.visit_purpose?.join(', ') || '-'}</TableCell>
                    <TableCell>
                      {item.work_begin || item.work_end
                        ? `${item.work_begin || ''} ~ ${item.work_end || ''}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {item.move_reservation_datetime?.slice(0, 16).replace('T', ' ') || '-'}
                    </TableCell>
                    <TableCell>
                      {item.created_at?.slice(0, 16).replace('T', ' ') || '-'}
                    </TableCell>
                    <TableCell>{item.created_by_name || '-'}</TableCell>
                    <TableCell>{item.memo || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
