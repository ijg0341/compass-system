/**
 * 하자종류 코드 목록 테이블
 * 화면 ID: CP-SA-07-002
 */

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import PrintIcon from '@mui/icons-material/Print';
import type { Ascode } from '@/src/types/afterservice.types';

interface DefectTypeTableProps {
  data: Ascode[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit: (item: Ascode) => void;
  onExcelUpload?: () => void;
  onExcelDownload?: () => void;
  onPrint?: () => void;
  partnerMap?: Map<number, string>;
}

export default function DefectTypeTable({
  data,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onExcelUpload,
  onExcelDownload,
  onPrint,
  partnerMap,
}: DefectTypeTableProps) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const getPartnerName = (partnerId: number | null) => {
    if (!partnerId || !partnerMap) return '-';
    return partnerMap.get(partnerId) || '-';
  };

  return (
    <Box>
      {/* 버튼 그룹 */}
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
        {onExcelUpload && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadIcon />}
            onClick={onExcelUpload}
          >
            엑셀 등록
          </Button>
        )}
        {onExcelDownload && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={onExcelDownload}
          >
            엑셀 다운로드
          </Button>
        )}
        {onPrint && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={onPrint}
          >
            인쇄
          </Button>
        )}
      </Stack>

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
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }}>고유번호</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>타입/평수</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>실명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>하자부위명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 90 }}>하자상세명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>하자유형명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>대공종명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>소공종명</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>협력사</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 70 }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.type || '-'}</TableCell>
                  <TableCell>{row.room}</TableCell>
                  <TableCell>{row.issue_category1}</TableCell>
                  <TableCell>{row.issue_category2}</TableCell>
                  <TableCell>{row.issue_type}</TableCell>
                  <TableCell>{row.work_type1}</TableCell>
                  <TableCell>{row.work_type2}</TableCell>
                  <TableCell>{getPartnerName(row.project_users_id)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit(row)}
                      sx={{ minWidth: 50 }}
                    >
                      수정
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    등록된 하자종류 코드가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 총 ${count}건`}
        />
      </Paper>
    </Box>
  );
}
