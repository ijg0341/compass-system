/**
 * 관리자 전용 - 타입 관리 모달
 * 기획서 CP-SA-21-003
 */
import { useState, useEffect, useRef } from 'react';
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
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { projectTypeApi, fileApi, type ProjectType, type ProjectTypeCreateRequest } from '@/src/lib/api/superadminApi';
import ImagePreviewModal from '@/src/components/common/ImagePreviewModal';

interface ProjectTypeModalProps {
  open: boolean;
  onClose: () => void;
  projectUuid: string;
}

export default function ProjectTypeModal({ open, onClose, projectUuid }: ProjectTypeModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 상태
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [typeName, setTypeName] = useState('');
  const [giveItems, setGiveItems] = useState<string[]>([]);
  const [newGiveItem, setNewGiveItem] = useState('');

  // 파일 상태
  const [floorplanFile, setFloorplanFile] = useState<File | null>(null);
  const [floorplanFileId, setFloorplanFileId] = useState<number | null>(null);
  const [floorplanPreview, setFloorplanPreview] = useState<string | null>(null);

  // 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  // 타입 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ['project-types', projectUuid],
    queryFn: () => projectTypeApi.getList(projectUuid),
    enabled: open && !!projectUuid,
  });

  const types: ProjectType[] = data?.data?.list ?? [];

  // 모달 닫을 때 상태 초기화
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // 등록/수정 mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!typeName.trim()) {
        throw new Error('타입/평형을 입력하세요.');
      }

      // 새 파일이 있으면 먼저 업로드
      let fileId = floorplanFileId;
      if (floorplanFile) {
        const uploadRes = await fileApi.upload(floorplanFile);
        fileId = uploadRes.data.id;
      }

      const data: ProjectTypeCreateRequest = {
        name: typeName.trim(),
        give_items: giveItems.length > 0 ? giveItems : null,
        floorplan_file_id: fileId,
      };

      if (editMode && editId) {
        return projectTypeApi.update(projectUuid, editId, data);
      } else {
        return projectTypeApi.create(projectUuid, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-types', projectUuid] });
      resetForm();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorDialog(err.response?.data?.message || err.message || '이미 등록된 타입명 입니다.');
    },
  });

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectTypeApi.delete(projectUuid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-types', projectUuid] });
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    },
  });

  const handleEdit = async (type: ProjectType) => {
    setEditMode(true);
    setEditId(type.id);
    setTypeName(type.name);
    // give_items가 문자열, 배열, 또는 빈 객체일 수 있으므로 배열로 변환
    let items: string[] = [];
    if (Array.isArray(type.give_items)) {
      items = type.give_items;
    } else if (typeof type.give_items === 'string' && type.give_items) {
      items = type.give_items.split(',').map((s) => s.trim()).filter(Boolean);
    }
    setGiveItems(items);

    // 상세 조회로 floorplan_file_url 가져오기
    setFloorplanFile(null);
    try {
      const detail = await projectTypeApi.getDetail(projectUuid, type.id);
      const detailData = detail.data;
      setFloorplanFileId(detailData.floorplan_file_id ?? null);
      setFloorplanPreview(detailData.floorplan_file_url ?? null);
    } catch {
      setFloorplanFileId(type.floorplan_file_id ?? null);
      setFloorplanPreview(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setTypeName('');
    setGiveItems([]);
    setNewGiveItem('');
    setFloorplanFile(null);
    setFloorplanFileId(null);
    setFloorplanPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFloorplanFile(file);
      // 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setFloorplanPreview(previewUrl);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    saveMutation.mutate();
  };

  const addGiveItem = () => {
    const trimmed = newGiveItem.trim();
    if (trimmed && !giveItems.includes(trimmed)) {
      setGiveItems([...giveItems, trimmed]);
      setNewGiveItem('');
    }
  };

  const removeGiveItem = (item: string) => {
    setGiveItems(giveItems.filter((i) => i !== item));
  };

  const labelCellSx = {
    width: '15%',
    bgcolor: 'action.hover',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.primary',
    py: 1,
    px: 2,
    verticalAlign: 'top',
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            타입 관리
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 타입 생성/수정 폼 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          타입 생성/수정
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={labelCellSx}>타입/평형</TableCell>
                <TableCell sx={valueCellSx}>
                  <TextField
                    size="small"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    sx={{ ...inputSx, width: 200 }}
                    placeholder="예: 84A"
                  />
                </TableCell>
                <TableCell sx={labelCellSx}>평면도</TableCell>
                <TableCell sx={valueCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileSelect}
                    />
                    <Button variant="outlined" size="small" onClick={handleFileButtonClick}>
                      파일선택
                    </Button>
                    {floorplanPreview && (
                      <img
                        src={floorplanPreview}
                        alt="평면도 미리보기"
                        style={{ maxWidth: 120, maxHeight: 120, objectFit: 'contain', cursor: 'pointer' }}
                        onClick={() => setPreviewImage({ url: floorplanPreview, name: '평면도' })}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={labelCellSx}>지급품</TableCell>
                <TableCell colSpan={3} sx={valueCellSx}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {giveItems.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        onDelete={() => removeGiveItem(item)}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      value={newGiveItem}
                      onChange={(e) => setNewGiveItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addGiveItem()}
                      sx={{ ...inputSx, width: 200 }}
                      placeholder="지급품 입력 후 Enter"
                    />
                    <Button variant="outlined" size="small" onClick={addGiveItem}>
                      추가
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
          >
            {editMode ? '수정하기' : '등록하기'}
          </Button>
          {editMode && (
            <Button variant="outlined" onClick={resetForm}>
              취소
            </Button>
          )}
        </Box>

        {/* 타입 목록 */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          타입 목록
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 100 }}>타입/평형</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                  평면도
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>지급품</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id} hover>
                  <TableCell>{type.name}</TableCell>
                  <TableCell align="center">
                    {type.floorplan_file_url ? (
                      <img
                        src={type.floorplan_file_url}
                        alt={type.name}
                        style={{ maxWidth: 60, maxHeight: 60, cursor: 'pointer' }}
                        onClick={() => setPreviewImage({ url: type.floorplan_file_url!, name: `${type.name} 평면도` })}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(type.give_items) && type.give_items.length > 0
                      ? type.give_items.join(', ')
                      : typeof type.give_items === 'string' && type.give_items
                        ? type.give_items
                        : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(type)}
                      >
                        수정
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(type.id)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {types.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    등록된 타입이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>선택한 타입을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>아니오</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>

      {/* 에러 다이얼로그 */}
      <Dialog open={!!errorDialog} onClose={() => setErrorDialog(null)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(null)} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 이미지 미리보기 모달 */}
      <ImagePreviewModal
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url ?? ''}
        imageName={previewImage?.name}
      />
    </Dialog>
  );
}
