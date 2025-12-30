/**
 * 관리자 전용 - 팝업공지 상세 페이지
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { popupApi } from '@/src/lib/api/superadminApi';

export default function PopupNoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ['popup-notice', id],
    queryFn: () => popupApi.getDetail(Number(id)),
    enabled: !!id,
  });

  const notice = data?.data;

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => popupApi.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popup-notices'] });
      navigate('/admin/popup-notice');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const labelCellSx = {
    width: '15%',
    bgcolor: 'action.hover',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.primary',
    py: 1.5,
    px: 2,
  };

  const valueCellSx = {
    py: 1.5,
    px: 2,
  };

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!notice) {
    return <Typography>팝업공지를 찾을 수 없습니다.</Typography>;
  }

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        팝업공지 상세
      </Typography>

      {/* 상세 정보 */}
      <TableContainer
        component={Paper}
        sx={{
          mb: 3,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={labelCellSx}>현장명</TableCell>
              <TableCell sx={valueCellSx}>
                {notice.project_name || '[전체]'}
              </TableCell>
              <TableCell sx={labelCellSx}>작성자</TableCell>
              <TableCell sx={valueCellSx}>{notice.admin_user_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>공지시작일</TableCell>
              <TableCell sx={valueCellSx}>{notice.board_extra?.notice_begin || '-'}</TableCell>
              <TableCell sx={labelCellSx}>공지종료일</TableCell>
              <TableCell sx={valueCellSx}>{notice.board_extra?.notice_end || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>제목</TableCell>
              <TableCell colSpan={3} sx={valueCellSx}>
                {notice.board_subject}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>내용</TableCell>
              <TableCell colSpan={3} sx={{ ...valueCellSx, minHeight: 200 }}>
                {/* 이미지 */}
                {notice.board_files && notice.board_files.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {notice.board_files.map((file) => (
                      <Box key={file.id} sx={{ mb: 1 }}>
                        <img
                          src={file.url}
                          alt={file.original_name}
                          style={{ maxWidth: '100%', maxHeight: 300 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                {/* HTML 내용 */}
                <Box
                  dangerouslySetInnerHTML={{ __html: notice.board_text }}
                  sx={{
                    '& p': { margin: '0.5em 0' },
                    '& img': { maxWidth: '100%' },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          삭제
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/admin/popup-notice/${id}/edit`)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/popup-notice')}
          >
            목록
          </Button>
        </Box>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            게시물을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>아니오</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
