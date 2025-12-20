/**
 * 스마트넷 전자투표 생성 페이지
 * 화면 ID: CP-SA-10-003
 *
 * DB 테이블: conference, conference_agenda
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  TablePagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useCreateMeeting, useUpdateMeeting, useDeleteMeeting, useMeetings, useMeeting } from '@/src/hooks/useVote';
import type { Conference } from '@/src/types/vote.types';

// 현재 프로젝트 ID (임시)
const PROJECT_ID = 1;

// 안건 입력 폼 타입 (DB 필드 기준)
interface AgendaFormItem {
  name: string;                    // 안건명
  quorum_rate: number;             // 가결정족수 (%)
  is_yes_or_no: boolean;           // 찬반투표 여부
  answers: string;                 // 선택지 (슬래시로 구분)
}

// 폼 데이터 타입 (DB 필드 기준)
interface FormData {
  name: string;                    // 총회명
  conference_date: string;         // 총회날짜
  vote_start_date: string;         // 투표 시작일시
  vote_end_date: string;           // 투표 종료일시
  is_online_only: boolean;         // 전자투표만 진행 여부
  member_base_date: string;        // 조합원 기준날짜
  conference_quorum_rate: number;  // 성원정족수 (%)
  retry_vote: number;              // 재투표 가능회수
  agendas: AgendaFormItem[];
}

// 안건 입력 폼 초기값
const initialAgendaForm: AgendaFormItem = {
  name: '',
  quorum_rate: 50,
  is_yes_or_no: true,
  answers: '',
};

const initialFormData: FormData = {
  name: '',
  conference_date: '',
  vote_start_date: '',
  vote_end_date: '',
  is_online_only: true,
  member_base_date: '',
  conference_quorum_rate: 50,
  retry_vote: 0,
  agendas: [],
};

export default function VoteMeetingCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [agendaForm, setAgendaForm] = useState<AgendaFormItem>({ ...initialAgendaForm });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // 수정 모드
  const [editingId, setEditingId] = useState<number | null>(null);

  // 삭제 확인 다이얼로그
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const createMutation = useCreateMeeting();
  const updateMutation = useUpdateMeeting();
  const deleteMutation = useDeleteMeeting();
  const { data: meetingsData, isLoading: isLoadingMeetings, refetch } = useMeetings(PROJECT_ID, {
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });

  const meetings = meetingsData?.list || [];
  const totalMeetings = meetingsData?.total || 0;

  // URL 복사
  const handleCopyUrl = (uuid: string) => {
    const url = `https://vote.compass1998.com/${uuid}`;
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: 'URL이 복사되었습니다.', severity: 'success' });
  };

  // 기본 정보 변경
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 안건 폼 변경
  const handleAgendaFormChange = (field: keyof AgendaFormItem, value: string | number | boolean) => {
    setAgendaForm((prev) => ({ ...prev, [field]: value }));
  };

  // 안건 추가
  const handleAddAgenda = () => {
    if (!agendaForm.name.trim()) {
      setSnackbar({ open: true, message: '안건 제목을 입력해주세요.', severity: 'error' });
      return;
    }

    const newAgenda: AgendaFormItem = {
      ...agendaForm,
      answers: agendaForm.is_yes_or_no ? '찬성 / 반대 / 기권' : agendaForm.answers,
    };

    setFormData((prev) => ({
      ...prev,
      agendas: [...prev.agendas, newAgenda],
    }));
    setAgendaForm({ ...initialAgendaForm });
  };

  // 안건 삭제
  const handleRemoveAgenda = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      agendas: prev.agendas.filter((_, i) => i !== index),
    }));
  };

  // 수정 모드로 전환 - 상세 API 호출하여 안건 포함 데이터 로드
  const handleEdit = async (meetingId: number) => {
    try {
      // 상세 조회 API 호출 (안건 포함)
      const { getMeeting } = await import('@/src/lib/api/voteApi');
      const meeting = await getMeeting(PROJECT_ID, meetingId);

      // datetime-local 형식으로 변환 (YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        // "2025-12-15 09:00:00" -> "2025-12-15T09:00"
        return dateStr.replace(' ', 'T').substring(0, 16);
      };

      setFormData({
        name: meeting.name,
        conference_date: meeting.conference_date,
        vote_start_date: formatDateTime(meeting.vote_start_date),
        vote_end_date: formatDateTime(meeting.vote_end_date),
        is_online_only: meeting.is_online_only,
        member_base_date: meeting.member_base_date || '',
        conference_quorum_rate: meeting.conference_quorum_rate,
        retry_vote: meeting.retry_vote,
        agendas: (meeting.agendas || []).map((a) => ({
          name: a.name,
          quorum_rate: a.quorum_rate,
          is_yes_or_no: a.is_yes_or_no,
          answers: Array.isArray(a.answers) ? a.answers.join(' / ') : '',
        })),
      });
      setEditingId(meeting.id);
      // 폼 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSnackbar({ open: true, message: '데이터를 불러오는데 실패했습니다.', severity: 'error' });
    }
  };

  // 수정 모드 취소
  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setAgendaForm({ ...initialAgendaForm });
    setEditingId(null);
  };

  // 삭제 확인 다이얼로그 열기
  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  // 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteMutation.mutateAsync({
        projectId: PROJECT_ID,
        id: deleteTargetId,
      });
      setSnackbar({ open: true, message: '전자투표가 삭제되었습니다.', severity: 'success' });
      refetch();
    } catch {
      setSnackbar({ open: true, message: '삭제에 실패했습니다.', severity: 'error' });
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    if (!formData.name.trim()) return false;
    if (!formData.conference_date) return false;
    if (!formData.vote_start_date) return false;
    if (!formData.vote_end_date) return false;
    if (formData.agendas.length === 0) return false;
    return true;
  }, [formData]);

  // 저장 (생성 또는 수정)
  const handleSave = useCallback(async () => {
    if (!isFormValid()) {
      setSnackbar({ open: true, message: '필수 항목을 모두 입력해주세요.', severity: 'error' });
      return;
    }

    const requestData = {
      name: formData.name,
      conference_date: formData.conference_date,
      vote_start_date: formData.vote_start_date,
      vote_end_date: formData.vote_end_date,
      conference_quorum_rate: formData.conference_quorum_rate,
      retry_vote: formData.retry_vote,
      is_online_only: formData.is_online_only,
      member_base_date: formData.member_base_date || undefined,
      agendas: formData.agendas.map((a) => ({
        name: a.name,
        quorum_rate: a.quorum_rate,
        is_yes_or_no: a.is_yes_or_no,
        answers: a.answers.split('/').map(s => s.trim()),
      })),
    };

    try {
      if (editingId) {
        // 수정 모드
        await updateMutation.mutateAsync({
          projectId: PROJECT_ID,
          id: editingId,
          data: requestData,
        });
        setSnackbar({ open: true, message: '전자투표가 수정되었습니다.', severity: 'success' });
        setEditingId(null);
      } else {
        // 생성 모드
        await createMutation.mutateAsync({
          projectId: PROJECT_ID,
          data: requestData,
        });
        setSnackbar({ open: true, message: '전자투표가 생성되었습니다.', severity: 'success' });
      }

      setFormData(initialFormData);
      refetch();
    } catch {
      setSnackbar({ open: true, message: editingId ? '수정에 실패했습니다.' : '생성에 실패했습니다.', severity: 'error' });
    }
  }, [formData, isFormValid, editingId, createMutation, updateMutation, refetch]);

  return (
    <>
      <Box>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vote/meetings')}
            sx={{ mb: 2 }}
            size="small"
          >
            목록으로
          </Button>
          <Typography variant="h5" fontWeight={700}>
            전자투표 생성/수정
          </Typography>
        </Box>

        {/* 기본 정보 폼 */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Table
            size="small"
            sx={{
              '& td, & th': { border: '1px solid rgba(255,255,255,0.15)', py: 1.5, px: 2 },
              '& th': { whiteSpace: 'nowrap', width: 120, bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 },
            }}
          >
            <TableBody>
              {/* 1행: 총회명, 재투표 가능회수 */}
              <TableRow>
                <TableCell component="th">총회명</TableCell>
                <TableCell>
                  <TextField
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell component="th">재투표 가능회수</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={formData.retry_vote}
                        onChange={(e) => handleChange('retry_vote', e.target.value as number)}
                      >
                        <MenuItem value={0}>불가</MenuItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <MenuItem key={n} value={n}>{n}회</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary">
                      최종 투표제출 회수 기준
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>

              {/* 2행: 투표시작일시, 투표종료일시 */}
              <TableRow>
                <TableCell component="th">투표시작일시</TableCell>
                <TableCell>
                  <TextField
                    type="datetime-local"
                    value={formData.vote_start_date}
                    onChange={(e) => handleChange('vote_start_date', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell component="th">투표종료일시</TableCell>
                <TableCell>
                  <TextField
                    type="datetime-local"
                    value={formData.vote_end_date}
                    onChange={(e) => handleChange('vote_end_date', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
              </TableRow>

              {/* 3행: 투표종류, 조합원 기준날짜 */}
              <TableRow>
                <TableCell component="th">투표종류</TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={formData.is_online_only ? 'electronic_only' : 'electronic_paper'}
                    onChange={(e) => handleChange('is_online_only', e.target.value === 'electronic_only' ? 1 : 0)}
                  >
                    <FormControlLabel
                      value="electronic_only"
                      control={<Radio size="small" />}
                      label="전자투표 전용"
                    />
                    <FormControlLabel
                      value="electronic_paper"
                      control={<Radio size="small" />}
                      label="전자+서면투표"
                    />
                  </RadioGroup>
                </TableCell>
                <TableCell component="th">조합원 기준날짜</TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={formData.member_base_date}
                    onChange={(e) => handleChange('member_base_date', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
              </TableRow>

              {/* 4행: 성원정족수, 총회날짜 */}
              <TableRow>
                <TableCell component="th">성원정족수</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      type="number"
                      value={formData.conference_quorum_rate}
                      onChange={(e) => handleChange('conference_quorum_rate', Number(e.target.value))}
                      size="small"
                      sx={{ width: 100 }}
                      slotProps={{ htmlInput: { min: 0, max: 100 } }}
                    />
                    <Typography>%</Typography>
                  </Box>
                </TableCell>
                <TableCell component="th">총회날짜</TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={formData.conference_date}
                    onChange={(e) => handleChange('conference_date', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
              </TableRow>

              {/* 5행: 안건 입력 */}
              <TableRow>
                <TableCell component="th">안건</TableCell>
                <TableCell colSpan={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>제목</Typography>
                      <TextField
                        value={agendaForm.name}
                        onChange={(e) => handleAgendaFormChange('name', e.target.value)}
                        size="small"
                        sx={{ width: 200 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>가결정족수</Typography>
                      <TextField
                        type="number"
                        value={agendaForm.quorum_rate}
                        onChange={(e) => handleAgendaFormChange('quorum_rate', Number(e.target.value))}
                        size="small"
                        sx={{ width: 70 }}
                        slotProps={{ htmlInput: { min: 0, max: 100 } }}
                      />
                      <Typography variant="body2">%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>선택지</Typography>
                      <RadioGroup
                        row
                        value={agendaForm.is_yes_or_no ? 'approval' : 'selection'}
                        onChange={(e) => handleAgendaFormChange('is_yes_or_no', e.target.value === 'approval')}
                      >
                        <FormControlLabel
                          value="approval"
                          control={<Radio size="small" />}
                          label="찬성/반대"
                        />
                        <FormControlLabel
                          value="selection"
                          control={<Radio size="small" />}
                          label="직접입력"
                        />
                      </RadioGroup>
                    </Box>
                    {!agendaForm.is_yes_or_no && (
                      <TextField
                        value={agendaForm.answers}
                        onChange={(e) => handleAgendaFormChange('answers', e.target.value)}
                        size="small"
                        placeholder="슬래시( / )로 구분"
                        sx={{ width: 180 }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddAgenda}
                    >
                      추가
                    </Button>
                  </Box>

                  {/* 등록된 안건 목록 */}
                  {formData.agendas.length > 0 && (
                    <Box sx={{ mt: 2, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1 }}>
                      {formData.agendas.map((agenda, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            borderBottom: index < formData.agendas.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                          }}
                        >
                          <Typography variant="body2" sx={{ width: 50 }}>제{index + 1}호</Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>{agenda.name}</Typography>
                          <Typography variant="body2" sx={{ width: 50 }}>선택지</Typography>
                          <Typography variant="body2" sx={{ width: 150 }}>{agenda.answers}</Typography>
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => handleRemoveAgenda(index)}
                            sx={{ minWidth: 'auto', px: 1.5 }}
                          >
                            삭제
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* 액션 버튼 */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid() || createMutation.isPending || updateMutation.isPending}
              startIcon={(createMutation.isPending || updateMutation.isPending) && <CircularProgress size={16} color="inherit" />}
            >
              {editingId ? '수정하기' : '등록하기'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              취소
            </Button>
          </Box>
        </Paper>

        {/* 전자투표 목록 */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
          전자투표 목록
        </Typography>
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
                  <TableCell>총회명</TableCell>
                  <TableCell>시작일시</TableCell>
                  <TableCell>종료일시</TableCell>
                  <TableCell>총회날짜</TableCell>
                  <TableCell align="center">성원정족수</TableCell>
                  <TableCell align="center">조합원 수</TableCell>
                  <TableCell align="center">안건 수</TableCell>
                  <TableCell align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingMeetings ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      등록된 전자투표가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings.map((meeting) => (
                    <TableRow key={meeting.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{meeting.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.vote_start_date || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.vote_end_date || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.conference_date}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {meeting.voter_count && meeting.conference_quorum_rate
                          ? Math.ceil(meeting.voter_count * meeting.conference_quorum_rate / 100)
                          : 0}
                        ({meeting.conference_quorum_rate || 0}%)
                      </TableCell>
                      <TableCell align="center">{meeting.voter_count || 0}</TableCell>
                      <TableCell align="center">{meeting.agenda_count || 0}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleCopyUrl(meeting.uuid)}
                            sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
                          >
                            URL복사
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleEdit(meeting.id)}
                            disabled={editingId === meeting.id}
                            sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
                          >
                            {editingId === meeting.id ? '수정중' : '수정'}
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={() => handleDeleteClick(meeting.id)}
                            disabled={deleteMutation.isPending}
                            sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
                          >
                            삭제
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalMeetings}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="페이지당 행 수:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 총 ${count}건`}
          />
        </Paper>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>전자투표 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말 이 전자투표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
          </Button>
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
    </>
  );
}
