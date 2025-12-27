/**
 * 커뮤니티 - 공지사항 상세 페이지
 * 화면 ID: CP-SA-06-002
 */
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import { Delete, Edit, List as ListIcon } from '@mui/icons-material';
import { useNotice, useDeleteNotice } from '@/src/hooks/useBoard';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { formatBoardDate } from '@/src/types/board.types';

// 셀 스타일
const labelCellSx = {
  width: '15%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1.5,
  px: 2,
  borderRight: '1px solid',
  borderColor: 'divider',
};

const valueCellSx = {
  width: '35%',
  py: 1.5,
  px: 2,
};

export default function CommunityNoticeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projectUuid } = useCurrentProject();
  const postId = Number(id);

  // 삭제 확인 다이얼로그
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // API 훅
  const { data: post, isLoading, error } = useNotice(projectUuid, postId);
  const deleteMutation = useDeleteNotice();

  // 목록으로 이동
  const handleGoList = useCallback(() => {
    navigate('/community/notice');
  }, [navigate]);

  // 수정 페이지로 이동
  const handleEdit = useCallback(() => {
    navigate(`/community/notice/${postId}/edit`);
  }, [navigate, postId]);

  // 삭제
  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync({ projectUuid, id: postId });
      setDeleteDialogOpen(false);
      navigate('/community/notice');
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  }, [deleteMutation, projectUuid, postId, navigate]);

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Alert severity="error">
        게시글을 불러오는데 실패했습니다.
      </Alert>
    );
  }

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          공지사항 상세
        </Typography>
      </Box>

      {/* 상세 내용 */}
      <Paper
        sx={{
          mb: 3,
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
        <Table size="small">
          <TableBody>
            {/* 작성자/등록일 */}
            <TableRow>
              <TableCell sx={labelCellSx}>작성자</TableCell>
              <TableCell sx={valueCellSx}>{post.admin_user_name || '관리자'}</TableCell>
              <TableCell sx={labelCellSx}>등록일</TableCell>
              <TableCell sx={valueCellSx}>{formatBoardDate(post.board_date)}</TableCell>
            </TableRow>
            {/* 조회수/수정일 */}
            <TableRow>
              <TableCell sx={labelCellSx}>조회수</TableCell>
              <TableCell sx={valueCellSx}>{post.board_count_view}</TableCell>
              <TableCell sx={labelCellSx}>수정일</TableCell>
              <TableCell sx={valueCellSx}>{post.updated_at || '-'}</TableCell>
            </TableRow>
            {/* 첨부파일 */}
            <TableRow>
              <TableCell sx={labelCellSx}>첨부파일</TableCell>
              <TableCell colSpan={3} sx={valueCellSx}>
                {Array.isArray(post.board_files) && post.board_files.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {post.board_files.map((file) => (
                      <Link
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noopener"
                        sx={{ cursor: 'pointer' }}
                      >
                        {file.original_name} ({formatFileSize(file.file_size)})
                      </Link>
                    ))}
                  </Box>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
            {/* 제목 */}
            <TableRow>
              <TableCell sx={labelCellSx}>제목</TableCell>
              <TableCell colSpan={3} sx={valueCellSx}>
                {post.board_subject}
              </TableCell>
            </TableRow>
            {/* 내용 */}
            <TableRow>
              <TableCell sx={labelCellSx}>내용</TableCell>
              <TableCell
                colSpan={3}
                sx={{ ...valueCellSx, minHeight: 200 }}
              >
                <Box
                  dangerouslySetInnerHTML={{ __html: post.board_text }}
                  sx={{
                    minHeight: 200,
                    '& img': { maxWidth: '100%' },
                    '& a': { color: 'primary.main' },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          삭제
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="contained"
            startIcon={<ListIcon />}
            onClick={handleGoList}
          >
            목록
          </Button>
        </Box>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>게시물을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>아니오</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
