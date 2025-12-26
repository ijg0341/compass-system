/**
 * 커뮤니티 - 공지사항 등록/수정 페이지
 * 화면 ID: CP-SA-06-003
 */
import { useState, useCallback, useEffect } from 'react';
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
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link,
  Checkbox,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useNotice, useCreateNotice, useUpdateNotice } from '@/src/hooks/useBoard';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { BoardPostRequest, BoardFile } from '@/src/types/board.types';

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
  verticalAlign: 'top',
};

const valueCellSx = {
  py: 1,
  px: 2,
};

const inputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
  '& .MuiInputBase-input': { py: 1, fontSize: '0.875rem' },
};

export default function CommunityNoticeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projectUuid } = useCurrentProject();
  const isEditMode = !!id;
  const postId = Number(id);

  // 폼 상태
  const [formData, setFormData] = useState<BoardPostRequest>({
    board_category_id: 1,
    board_subject: '',
    board_text: '',
    board_hidden: 0,
    board_files: [],
  });
  const [existingFiles, setExistingFiles] = useState<BoardFile[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // 다이얼로그 상태
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  // API 훅
  const { data: post, isLoading } = useNotice(projectUuid, postId);
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();

  // 기존 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode && post) {
      setFormData({
        board_category_id: post.board_category_id,
        board_subject: post.board_subject,
        board_text: post.board_text,
        board_hidden: post.board_hidden,
        board_files: post.board_files?.map((f) => f.id) || [],
      });
      setExistingFiles(post.board_files || []);
    }
  }, [isEditMode, post]);

  // 입력 핸들러
  const handleChange = useCallback((field: keyof BoardPostRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 파일 업로드
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  }, []);

  // 기존 파일 삭제 체크
  const handleFileDeleteToggle = useCallback((fileId: number) => {
    setFilesToDelete((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  }, []);

  // 새 파일 삭제
  const handleNewFileDelete = useCallback((index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 유효성 검사
  const validate = useCallback(() => {
    if (!formData.board_subject.trim()) {
      setValidationError('"제목" 항목을 입력하세요!');
      return false;
    }
    if (!formData.board_text.trim()) {
      setValidationError('"내용" 항목을 입력하세요!');
      return false;
    }
    return true;
  }, [formData]);

  // 저장
  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setConfirmDialogOpen(true);
  }, [validate]);

  // 저장 확인
  const handleConfirmSave = useCallback(async () => {
    try {
      // TODO: 파일 업로드 후 board_files에 ID 추가
      const submitData = {
        ...formData,
        board_files: existingFiles
          .filter((f) => !filesToDelete.includes(f.id))
          .map((f) => f.id),
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({
          projectUuid,
          id: postId,
          data: submitData,
        });
      } else {
        await createMutation.mutateAsync({
          projectUuid,
          data: submitData,
        });
      }
      setConfirmDialogOpen(false);
      navigate('/community/notice');
    } catch (err) {
      console.error('저장 실패:', err);
    }
  }, [
    formData,
    existingFiles,
    filesToDelete,
    isEditMode,
    updateMutation,
    createMutation,
    projectUuid,
    postId,
    navigate,
  ]);

  // 취소
  const handleCancel = useCallback(() => {
    setCancelDialogOpen(true);
  }, []);

  // 취소 확인
  const handleConfirmCancel = useCallback(() => {
    setCancelDialogOpen(false);
    navigate('/community/notice');
  }, [navigate]);

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  if (isEditMode && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          공지사항 {isEditMode ? '수정' : '등록'}
        </Typography>
      </Box>

      {/* 폼 */}
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
            {/* 작성자 */}
            <TableRow>
              <TableCell sx={labelCellSx}>작성자</TableCell>
              <TableCell sx={valueCellSx}>
                <Typography variant="body2">
                  {post?.admin_user_name || '현재 로그인 사용자'}
                </Typography>
              </TableCell>
            </TableRow>

            {/* 첨부파일 */}
            <TableRow>
              <TableCell sx={labelCellSx}>첨부파일</TableCell>
              <TableCell sx={valueCellSx}>
                {/* 기존 파일 */}
                {existingFiles.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {existingFiles.map((file) => (
                      <Box
                        key={file.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                      >
                        <Link href={`/api/files/${file.uuid}`} target="_blank">
                          {file.original_name} ({formatFileSize(file.file_size)})
                        </Link>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={filesToDelete.includes(file.id)}
                              onChange={() => handleFileDeleteToggle(file.id)}
                            />
                          }
                          label="삭제"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* 새 파일 */}
                {newFiles.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {newFiles.map((file, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                      >
                        <Typography variant="body2">
                          {file.name} ({formatFileSize(file.size)})
                        </Typography>
                        <IconButton size="small" onClick={() => handleNewFileDelete(index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* 업로드 버튼 */}
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUpload />}
                >
                  파일추가
                  <input type="file" hidden multiple onChange={handleFileUpload} />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  드래그 앤 드롭으로 업로드 가능
                  (업로드 가능 파일 jpg,gif,png,hwp,doc,docx,xls,xlsx,ppt,pptx,txt / 최대 크기 10MB)
                </Typography>
              </TableCell>
            </TableRow>

            {/* 제목 */}
            <TableRow>
              <TableCell sx={labelCellSx}>
                제목 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.board_subject}
                  onChange={(e) => handleChange('board_subject', e.target.value)}
                  sx={inputSx}
                  placeholder="제목을 입력하세요"
                />
              </TableCell>
            </TableRow>

            {/* 내용 */}
            <TableRow>
              <TableCell sx={labelCellSx}>
                내용 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  value={formData.board_text}
                  onChange={(e) => handleChange('board_text', e.target.value)}
                  sx={inputSx}
                  placeholder="내용을 입력하세요"
                />
              </TableCell>
            </TableRow>

            {/* 공개여부 */}
            <TableRow>
              <TableCell sx={labelCellSx}>공개여부</TableCell>
              <TableCell sx={valueCellSx}>
                <RadioGroup
                  row
                  value={formData.board_hidden}
                  onChange={(e) => handleChange('board_hidden', Number(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio size="small" />} label="공개" />
                  <FormControlLabel value={1} control={<Radio size="small" />} label="비공개" />
                </RadioGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditMode ? '수정' : '등록'}
        </Button>
      </Box>

      {/* 유효성 검사 에러 다이얼로그 */}
      <Dialog open={!!validationError} onClose={() => setValidationError('')}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>{validationError}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationError('')} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 저장 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>입력한 내용으로 {isEditMode ? '수정' : '등록'}하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>아니오</Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            예
          </Button>
        </DialogActions>
      </Dialog>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>정말로 취소하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>아니오</Button>
          <Button onClick={handleConfirmCancel} variant="contained">
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
