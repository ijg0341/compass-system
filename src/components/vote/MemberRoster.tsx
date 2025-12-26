/**
 * 조합원 명부 컴포넌트
 * 화면 ID: CP-SA-09-002
 */
import { useState, useCallback, useRef } from 'react';
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
  TextField,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  useVoteMembers,
  useCreateVoteMember,
  useUpdateVoteMember,
  useDeleteVoteMember,
  useImportVoteMembers,
  useExportVoteMembers,
} from '@/src/hooks/useVote';
import type { VoteMember, VoteMemberRequest, PreVoteIntention } from '@/src/types/vote.types';

interface MemberRosterProps {
  projectUuid: string;
  meetingId: number;
}

// 사전투표의향 라벨
const preVoteIntentionLabels: Record<PreVoteIntention, string> = {
  planned: '예정',
  undecided: '미정',
  impossible: '불가',
  other: '기타',
};

// 초기 폼 상태
const initialFormState: VoteMemberRequest = {
  voter_id: undefined,
  name: '',
  phone: '',
  birthday: '',
  dong: undefined,
  ho: undefined,
  type: '',
  prevote_intention: 'undecided',
};

export default function MemberRoster({ projectUuid, meetingId }: MemberRosterProps) {
  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 폼 상태
  const [formData, setFormData] = useState<VoteMemberRequest>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 다이얼로그
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<VoteMember | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 스낵바
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // 파일 입력 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API 훅
  const { data: membersData, isLoading, refetch } = useVoteMembers(projectUuid, meetingId, {
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });
  const createMutation = useCreateVoteMember();
  const updateMutation = useUpdateVoteMember();
  const deleteMutation = useDeleteVoteMember();
  const importMutation = useImportVoteMembers();
  const exportMutation = useExportVoteMembers();

  const members = membersData?.list || [];
  const total = membersData?.total || 0;

  // 폼 입력 핸들러
  const handleInputChange = (field: keyof VoteMemberRequest, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = '필수';
    }
    if (!formData.phone.trim()) {
      errors.phone = '필수';
    }
    if (!formData.birthday) {
      errors.birthday = '필수';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 등록/수정 핸들러
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        const member = members.find((m) => m.id === editingId);
        if (member && member.vote_count > 0) {
          setErrorMessage('사전투표가 이미 완료된 경우 변경 불가합니다.');
          setErrorDialogOpen(true);
          return;
        }

        await updateMutation.mutateAsync({
          projectUuid,
          meetingId,
          memberId: editingId,
          data: formData,
        });
        setSnackbar({ open: true, message: '수정되었습니다.', severity: 'success' });
      } else {
        await createMutation.mutateAsync({
          projectUuid,
          meetingId,
          data: formData,
        });
        setSnackbar({ open: true, message: '등록되었습니다.', severity: 'success' });
      }

      setFormData(initialFormState);
      setEditingId(null);
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      if (errorObj.message?.includes('가입번호')) {
        setErrorMessage('이미 존재하는 가입번호입니다.');
        setErrorDialogOpen(true);
      } else if (errorObj.message?.includes('동/호')) {
        setErrorMessage('이미 존재하는 동/호입니다.');
        setErrorDialogOpen(true);
      } else {
        setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
      }
    }
  }, [formData, editingId, members, createMutation, updateMutation, projectUuid, meetingId, refetch]);

  // 수정 버튼 클릭
  const handleEdit = useCallback((member: VoteMember) => {
    setEditingId(member.id);
    setFormData({
      voter_id: member.voter_id,
      name: member.name,
      phone: member.phone,
      birthday: member.birthday,
      dong: member.dong,
      ho: member.ho,
      type: member.type || '',
      prevote_intention: member.prevote_intention || 'undecided',
    });
  }, []);

  // 삭제 버튼 클릭
  const handleDeleteClick = useCallback((member: VoteMember) => {
    setDeletingMember(member);
    setDeleteDialogOpen(true);
  }, []);

  // 삭제 확인
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingMember) return;

    try {
      await deleteMutation.mutateAsync({
        projectUuid,
        meetingId,
        memberId: deletingMember.id,
      });
      setSnackbar({ open: true, message: '삭제되었습니다.', severity: 'success' });
      refetch();
    } catch {
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    }

    setDeleteDialogOpen(false);
    setDeletingMember(null);
  }, [deletingMember, deleteMutation, projectUuid, meetingId, refetch]);

  // 취소
  const handleCancel = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setFormErrors({});
  };

  // 엑셀 업로드
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importMutation.mutateAsync({
        projectUuid,
        meetingId,
        file,
      });
      setSnackbar({
        open: true,
        message: `${result.imported}건 등록, ${result.failed}건 실패`,
        severity: result.failed > 0 ? 'warning' : 'success',
      });
      refetch();
    } catch {
      setSnackbar({ open: true, message: '업로드에 실패했습니다.', severity: 'error' });
    }

    e.target.value = '';
  };

  // 엑셀 다운로드
  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync({ projectUuid, meetingId });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `조합원명부_${meetingId}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setSnackbar({ open: true, message: '다운로드에 실패했습니다.', severity: 'error' });
    }
  };

  return (
    <Box>
      {/* 입력 폼 */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          background: 'rgba(26, 26, 26, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* 엑셀 등록 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={importMutation.isPending ? <CircularProgress size={16} /> : <UploadIcon />}
            onClick={handleImportClick}
            disabled={importMutation.isPending}
          >
            엑셀 등록
          </Button>
        </Box>

        {/* 테이블 형태 폼 */}
        <Table size="small" sx={{
          tableLayout: 'fixed',
          '& td, & th': { border: '1px solid rgba(255,255,255,0.15)', py: 1, px: 1.5 },
          '& th': { whiteSpace: 'nowrap', width: '15%', bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 },
          '& td': { width: '35%' },
        }}>
          <TableBody>
            {/* 1행: 가입번호, 동 */}
            <TableRow>
              <TableCell component="th">가입번호</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  value={formData.voter_id || ''}
                  onChange={(e) => handleInputChange('voter_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="자동생성"
                />
              </TableCell>
              <TableCell component="th">동</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  value={formData.dong || ''}
                  onChange={(e) => handleInputChange('dong', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </TableCell>
            </TableRow>

            {/* 2행: 호, 타입 */}
            <TableRow>
              <TableCell component="th">호</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  value={formData.ho || ''}
                  onChange={(e) => handleInputChange('ho', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </TableCell>
              <TableCell component="th">타입</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                />
              </TableCell>
            </TableRow>

            {/* 3행: 생년월일, 성명 */}
            <TableRow>
              <TableCell component="th">
                생년월일 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  error={!!formErrors.birthday}
                />
              </TableCell>
              <TableCell component="th">
                성명 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!formErrors.name}
                />
              </TableCell>
            </TableRow>

            {/* 4행: 연락처, 사전투표의향 */}
            <TableRow>
              <TableCell component="th">
                연락처 <Typography component="span" color="error">*</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={!!formErrors.phone}
                />
              </TableCell>
              <TableCell component="th">사전투표의향</TableCell>
              <TableCell>
                <RadioGroup
                  row
                  value={formData.prevote_intention}
                  onChange={(e) => handleInputChange('prevote_intention', e.target.value)}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                >
                  <FormControlLabel value="planned" control={<Radio size="small" />} label="예정" />
                  <FormControlLabel value="undecided" control={<Radio size="small" />} label="미정" />
                  <FormControlLabel value="impossible" control={<Radio size="small" />} label="불가" />
                  <FormControlLabel value="other" control={<Radio size="small" />} label="기타" />
                </RadioGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* 버튼 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingId ? '수정하기' : '등록하기'}
          </Button>
          <Button variant="outlined" size="small" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Paper>

      {/* 조합원 목록 */}
      <Paper
        sx={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            조합원 목록
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={exportMutation.isPending ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            엑셀 다운로드
          </Button>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>가입번호</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>동</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>호</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>타입</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>성명</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>생년월일</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>연락처</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>사전투표의향</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="center">재투표회수</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">등록된 조합원이 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.voter_id}</TableCell>
                    <TableCell>{member.dong || '-'}</TableCell>
                    <TableCell>{member.ho || '-'}</TableCell>
                    <TableCell>{member.type || '-'}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{member.birthday}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{member.phone}</TableCell>
                    <TableCell>{preVoteIntentionLabels[member.prevote_intention as keyof typeof preVoteIntentionLabels] || '-'}</TableCell>
                    <TableCell align="center">{member.vote_count}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="수정">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(member)}
                            disabled={member.vote_count > 0}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(member)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 총 ${count}건`}
        />
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>조합원을 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>아니오</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            예
          </Button>
        </DialogActions>
      </Dialog>

      {/* 에러 다이얼로그 */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>{errorMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>확인</Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
