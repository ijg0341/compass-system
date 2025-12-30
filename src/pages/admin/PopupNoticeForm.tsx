/**
 * 관리자 전용 - 팝업공지 등록/수정 페이지
 */
import { useState, useEffect, useRef } from 'react';
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { popupApi, projectApi, fileApi, type PopupNoticeCreateRequest, type S3File } from '@/src/lib/api/superadminApi';
import HtmlEditor from '@/src/components/common/HtmlEditor';

interface UploadedFile {
  id: number;
  uuid: string;
  url: string;
  original_name: string;
}

export default function PopupNoticeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 상태
  const [formData, setFormData] = useState<Omit<PopupNoticeCreateRequest, 'project_id'> & { project_id: number | '' }>({
    project_id: '',
    board_category_id: 1, // 기본 카테고리
    board_subject: '',
    board_text: '',
    board_files: [],
    board_hidden: 0,
    notice_begin: '',
    notice_end: '',
  });

  // 업로드된 파일 목록 (미리보기용)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 다이얼로그 상태
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 현장 목록 조회
  const { data: projectsData } = useQuery({
    queryKey: ['projects-simple'],
    queryFn: () => projectApi.getList(),
  });

  const projects = projectsData?.data?.list ?? [];

  // 수정 모드일 때 기존 데이터 조회
  const { data: noticeData } = useQuery({
    queryKey: ['popup-notice', id],
    queryFn: () => popupApi.getDetail(Number(id)),
    enabled: isEditMode,
  });

  // 기존 데이터 로드
  useEffect(() => {
    if (noticeData?.data) {
      const notice = noticeData.data;
      setFormData({
        project_id: notice.project_id,
        board_category_id: notice.board_category_id,
        board_subject: notice.board_subject,
        board_text: notice.board_text,
        board_files: notice.board_files?.map((f) => f.id) ?? [],
        board_hidden: notice.board_hidden,
        notice_begin: notice.board_extra?.notice_begin || '',
        notice_end: notice.board_extra?.notice_end || '',
      });
      // 기존 파일 정보 설정
      if (notice.board_files && notice.board_files.length > 0) {
        setUploadedFiles(notice.board_files.map((f) => ({
          id: f.id,
          uuid: f.uuid,
          url: f.url,
          original_name: f.original_name,
        })));
      }
    }
  }, [noticeData]);

  // 등록/수정 mutation
  const saveMutation = useMutation({
    mutationFn: (data: PopupNoticeCreateRequest) =>
      isEditMode ? popupApi.update(Number(id), data) : popupApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popup-notices'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['popup-notice', id] });
      }
      navigate('/admin/popup-notice');
    },
  });

  const handleChange = (field: keyof PopupNoticeCreateRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setValidationError('jpg, gif, png 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 체크 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setValidationError('파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await fileApi.upload(file, {
        project_id: formData.project_id ? Number(formData.project_id) : undefined,
        file_category: 'popup',
      });

      if (response.code === 0 && response.data) {
        const newFile: UploadedFile = {
          id: response.data.id,
          uuid: response.data.uuid,
          url: response.data.url,
          original_name: file.name,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
        setFormData((prev) => ({
          ...prev,
          board_files: [...(prev.board_files || []), response.data.id],
        }));
      }
    } catch (error) {
      setValidationError('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 파일 삭제 핸들러
  const handleFileRemove = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setFormData((prev) => ({
      ...prev,
      board_files: (prev.board_files || []).filter((id) => id !== fileId),
    }));
  };

  // HTML 태그 제거하고 실제 텍스트만 추출
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const validateForm = (): boolean => {
    if (!formData.project_id) {
      setValidationError('"현장명" 항목을 선택하세요!');
      return false;
    }
    if (!formData.board_subject.trim()) {
      setValidationError('"제목" 항목을 입력하세요!');
      return false;
    }
    if (!stripHtml(formData.board_text).trim()) {
      setValidationError('"내용" 항목을 입력하세요!');
      return false;
    }
    if (!formData.notice_begin) {
      setValidationError('"공지 시작일" 항목을 입력하세요!');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmDialogOpen(false);
    // project_id가 필수이므로 number로 캐스팅
    saveMutation.mutate({
      ...formData,
      project_id: formData.project_id as number,
    });
  };

  const handleCancel = () => {
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    navigate('/admin/popup-notice');
  };

  const labelCellSx = {
    width: '15%',
    bgcolor: 'action.hover',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.primary',
    py: 1,
    px: 2,
  };

  const valueCellSx = {
    py: 0.5,
    px: 1,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
    '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
  };

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        팝업공지 {isEditMode ? '수정' : '등록'}
      </Typography>

      {/* 폼 */}
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
              <TableCell sx={labelCellSx}>
                현장명 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell sx={valueCellSx}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={formData.project_id}
                    onChange={(e) => {
                      const val = e.target.value as string | number;
                      handleChange('project_id', val === '' ? '' : Number(val));
                    }}
                    displayEmpty
                    sx={inputSx}
                  >
                    <MenuItem value="" disabled>현장 선택</MenuItem>
                    {projects.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={labelCellSx}>작성자</TableCell>
              <TableCell sx={valueCellSx}>
                <Typography sx={{ py: 0.75 }}>
                  {noticeData?.data?.admin_user_name || '사용자'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>
                공지 시작일 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  size="small"
                  type="date"
                  value={formData.notice_begin}
                  onChange={(e) => handleChange('notice_begin', e.target.value)}
                  sx={{ ...inputSx, width: 180 }}
                />
              </TableCell>
              <TableCell sx={labelCellSx}>공지 종료일</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  size="small"
                  type="date"
                  value={formData.notice_end}
                  onChange={(e) => handleChange('notice_end', e.target.value)}
                  sx={{ ...inputSx, width: 180 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>
                제목 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell colSpan={3} sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.board_subject}
                  onChange={(e) => handleChange('board_subject', e.target.value)}
                  sx={inputSx}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>
                내용 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell colSpan={3} sx={{ ...valueCellSx, py: 1 }}>
                <HtmlEditor
                  value={formData.board_text}
                  onChange={(value) => handleChange('board_text', value)}
                  placeholder="팝업 공지 내용을 입력하세요..."
                  minHeight={250}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>이미지</TableCell>
              <TableCell colSpan={3} sx={valueCellSx}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* 업로드 버튼 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? '업로드 중...' : '파일선택'}
                    </Button>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      (업로드 가능 파일 jpg,gif,png / 최대 크기 2MB)
                    </Typography>
                  </Box>

                  {/* 업로드된 파일 목록 */}
                  {uploadedFiles.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {uploadedFiles.map((file) => (
                        <Box
                          key={file.id}
                          sx={{
                            position: 'relative',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={file.url}
                            alt={file.original_name}
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleFileRemove(file.id)}
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)',
                              },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              p: 0.5,
                              bgcolor: 'background.paper',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 120,
                            }}
                          >
                            {file.original_name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={saveMutation.isPending}>
          {isEditMode ? '수정' : '등록'}
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          취소
        </Button>
      </Box>

      {/* 등록/수정 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            입력한 내용으로 {isEditMode ? '수정' : '등록'}하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>아니오</Button>
          <Button onClick={handleConfirmSubmit} autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 취소하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>아니오</Button>
          <Button onClick={handleConfirmCancel} autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>

      {/* 유효성 검사 에러 다이얼로그 */}
      <Dialog open={!!validationError} onClose={() => setValidationError(null)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>{validationError}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationError(null)} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
