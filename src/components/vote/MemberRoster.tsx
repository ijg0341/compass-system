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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
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
  projectId: number;
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
  member_no: '',
  name: '',
  phone: '',
  birth_date: '',
  dong: '',
  ho: '',
  unit_type: '',
  pre_vote_intention: 'undecided',
  revote_count: 0,
};

export default function MemberRoster({ projectId, meetingId }: MemberRosterProps) {
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
  const { data: membersData, isLoading, refetch } = useVoteMembers(projectId, meetingId, {
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
  const handleInputChange = (field: keyof VoteMemberRequest, value: string | number) => {
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
    if (!formData.birth_date) {
      errors.birth_date = '필수';
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
        if (member?.has_voted) {
          setErrorMessage('사전투표가 이미 완료된 경우 변경 불가합니다.');
          setErrorDialogOpen(true);
          return;
        }

        await updateMutation.mutateAsync({
          projectId,
          meetingId,
          memberId: editingId,
          data: formData,
        });
        setSnackbar({ open: true, message: '수정되었습니다.', severity: 'success' });
      } else {
        await createMutation.mutateAsync({
          projectId,
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
      if (errorObj.message?.includes('member_no')) {
        setErrorMessage('이미 존재하는 가입번호입니다.');
        setErrorDialogOpen(true);
      } else if (errorObj.message?.includes('dong_ho')) {
        setErrorMessage('이미 존재하는 동/호입니다.');
        setErrorDialogOpen(true);
      } else {
        setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
      }
    }
  }, [formData, editingId, members, createMutation, updateMutation, projectId, meetingId, refetch]);

  // 수정 버튼 클릭
  const handleEdit = useCallback((member: VoteMember) => {
    setEditingId(member.id);
    setFormData({
      member_no: member.member_no,
      name: member.name,
      phone: member.phone,
      birth_date: member.birth_date,
      dong: member.dong || '',
      ho: member.ho || '',
      unit_type: member.unit_type || '',
      pre_vote_intention: member.pre_vote_intention,
      revote_count: member.revote_count,
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
        projectId,
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
  }, [deletingMember, deleteMutation, projectId, meetingId, refetch]);

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
        projectId,
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
      const blob = await exportMutation.mutateAsync({ projectId, meetingId });
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
          p: 3,
          mb: 2,
          background: 'rgba(26, 26, 26, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* 엑셀 등록 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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

        {/* 폼 필드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            size="small"
            label="가입번호"
            value={formData.member_no}
            onChange={(e) => handleInputChange('member_no', e.target.value)}
            placeholder="미입력시 자동 생성"
          />
          <TextField
            size="small"
            label="동"
            value={formData.dong}
            onChange={(e) => handleInputChange('dong', e.target.value)}
          />
          <TextField
            size="small"
            label="호"
            value={formData.ho}
            onChange={(e) => handleInputChange('ho', e.target.value)}
          />
          <TextField
            size="small"
            label="타입"
            value={formData.unit_type}
            onChange={(e) => handleInputChange('unit_type', e.target.value)}
          />
          <TextField
            size="small"
            label="생년월일"
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleInputChange('birth_date', e.target.value)}
            error={!!formErrors.birth_date}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="성명"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!formErrors.name}
            required
          />
          <TextField
            size="small"
            label="연락처"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={!!formErrors.phone}
            required
          />
          <TextField
            size="small"
            label="재투표 회수"
            type="number"
            value={formData.revote_count}
            onChange={(e) => handleInputChange('revote_count', parseInt(e.target.value) || 0)}
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* 사전투표의향 */}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>사전투표의향</FormLabel>
          <RadioGroup
            row
            value={formData.pre_vote_intention}
            onChange={(e) => handleInputChange('pre_vote_intention', e.target.value)}
          >
            <FormControlLabel value="planned" control={<Radio size="small" />} label="예정" />
            <FormControlLabel value="undecided" control={<Radio size="small" />} label="미정" />
            <FormControlLabel value="impossible" control={<Radio size="small" />} label="불가" />
            <FormControlLabel value="other" control={<Radio size="small" />} label="기타" />
          </RadioGroup>
        </FormControl>

        {/* 버튼 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingId ? '수정하기' : '등록하기'}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
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
                    <TableCell>{member.member_no}</TableCell>
                    <TableCell>{member.dong || '-'}</TableCell>
                    <TableCell>{member.ho || '-'}</TableCell>
                    <TableCell>{member.unit_type || '-'}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{member.birth_date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{member.phone}</TableCell>
                    <TableCell>{preVoteIntentionLabels[member.pre_vote_intention]}</TableCell>
                    <TableCell align="center">{member.revote_count}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="수정">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(member)}
                            disabled={member.has_voted}
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
