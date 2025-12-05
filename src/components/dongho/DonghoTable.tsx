import {
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Dongho } from '@/src/types/dongho.types';

interface DonghoTableProps {
  data: Dongho[];
  onEdit: (dongho: Dongho) => void;
  onDelete: (dongho: Dongho) => void;
}

export default function DonghoTable({ data, onEdit, onDelete }: DonghoTableProps) {
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
              <TableCell>동</TableCell>
              <TableCell>호</TableCell>
              <TableCell>타입/평수</TableCell>
              <TableCell>승강기 라인</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  등록된 동호 코드가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((dongho) => (
                <TableRow key={dongho.id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{dongho.dong}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{dongho.ho}</Typography>
                  </TableCell>
                  <TableCell>{dongho.unit_type || '-'}</TableCell>
                  <TableCell>{dongho.ev_lines?.join(', ') || '-'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="수정">
                        <IconButton size="small" onClick={() => onEdit(dongho)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" color="error" onClick={() => onDelete(dongho)}>
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
