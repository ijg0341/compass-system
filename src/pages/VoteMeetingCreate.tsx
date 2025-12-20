/**
 * 스마트넷 전자투표 생성 페이지
 * 화면 ID: CP-SA-10-003
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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useCreateMeeting, useMeetings } from '@/src/hooks/useVote';
import type { AgendaVoteType } from '@/src/types/vote.types';

// 현재 프로젝트 ID (임시)
const PROJECT_ID = 1;

interface AgendaItem {
  title: string;
  pass_threshold_percentage: number;
  vote_type: AgendaVoteType;
  options: string; // /로 구분된 선택지
}

interface FormData {
  title: string;
  meeting_date: string;
  vote_start_date: string;
  vote_end_date: string;
  vote_type: 'electronic_only' | 'electronic_paper';
  member_base_date: string;
  quorum_percentage: number;
  max_revote_count: number;
  agendas: AgendaItem[];
}

// 안건 입력 폼 초기값
const initialAgendaForm: AgendaItem = {
  title: '',
  pass_threshold_percentage: 50,
  vote_type: 'approval',
  options: '',
};

const initialFormData: FormData = {
  title: '',
  meeting_date: '',
  vote_start_date: '',
  vote_end_date: '',
  vote_type: 'electronic_only',
  member_base_date: '',
  quorum_percentage: 50,
  max_revote_count: 0,
  agendas: [],
};

export default function VoteMeetingCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [agendaForm, setAgendaForm] = useState<AgendaItem>({ ...initialAgendaForm });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const createMutation = useCreateMeeting();
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
  const handleAgendaFormChange = (field: keyof AgendaItem, value: string | number) => {
    setAgendaForm((prev) => ({ ...prev, [field]: value }));
  };

  // 안건 추가
  const handleAddAgenda = () => {
    if (!agendaForm.title.trim()) {
      setSnackbar({ open: true, message: '안건 제목을 입력해주세요.', severity: 'error' });
      return;
    }

    const newAgenda: AgendaItem = {
      ...agendaForm,
      options: agendaForm.vote_type === 'approval' ? '찬성 / 반대 / 기권' : agendaForm.options,
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

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    if (!formData.title.trim()) return false;
    if (!formData.meeting_date) return false;
    if (!formData.vote_start_date) return false;
    if (!formData.vote_end_date) return false;
    if (!formData.member_base_date) return false;
    if (formData.agendas.length === 0) return false;
    return true;
  }, [formData]);

  // 저장
  const handleSave = useCallback(async () => {
    if (!isFormValid()) {
      setSnackbar({ open: true, message: '필수 항목을 모두 입력해주세요.', severity: 'error' });
      return;
    }

    try {
      await createMutation.mutateAsync({
        projectId: PROJECT_ID,
        data: {
          title: formData.title,
          description: '',
          meeting_date: formData.meeting_date,
          vote_start_date: formData.vote_start_date,
          vote_end_date: formData.vote_end_date,
          vote_type: formData.vote_type,
          member_base_date: formData.member_base_date,
          quorum_percentage: formData.quorum_percentage,
          pass_threshold_percentage: 50,
          max_revote_count: formData.max_revote_count,
          agendas: formData.agendas.map((a, idx) => ({
            order: idx + 1,
            title: a.title,
            description: '',
            vote_type: a.vote_type,
            pass_threshold_percentage: a.pass_threshold_percentage,
            options: a.options,
          })),
        },
      });

      setSnackbar({ open: true, message: '전자투표가 생성되었습니다.', severity: 'success' });
      setFormData(initialFormData);
      refetch();
    } catch {
      setSnackbar({ open: true, message: '생성에 실패했습니다.', severity: 'error' });
    }
  }, [formData, isFormValid, createMutation, refetch]);

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
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell component="th">재투표 가능회수</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={formData.max_revote_count}
                        onChange={(e) => handleChange('max_revote_count', e.target.value as number)}
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
                    value={formData.vote_type}
                    onChange={(e) => handleChange('vote_type', e.target.value)}
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
                      value={formData.quorum_percentage}
                      onChange={(e) => handleChange('quorum_percentage', Number(e.target.value))}
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
                    value={formData.meeting_date}
                    onChange={(e) => handleChange('meeting_date', e.target.value)}
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
                        value={agendaForm.title}
                        onChange={(e) => handleAgendaFormChange('title', e.target.value)}
                        size="small"
                        sx={{ width: 200 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>가결정족수</Typography>
                      <TextField
                        type="number"
                        value={agendaForm.pass_threshold_percentage}
                        onChange={(e) => handleAgendaFormChange('pass_threshold_percentage', Number(e.target.value))}
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
                        value={agendaForm.vote_type}
                        onChange={(e) => handleAgendaFormChange('vote_type', e.target.value)}
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
                    {agendaForm.vote_type === 'selection' && (
                      <TextField
                        value={agendaForm.options}
                        onChange={(e) => handleAgendaFormChange('options', e.target.value)}
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
                          <Typography variant="body2" sx={{ flex: 1 }}>{agenda.title}</Typography>
                          <Typography variant="body2" sx={{ width: 50 }}>선택지</Typography>
                          <Typography variant="body2" sx={{ width: 150 }}>{agenda.options}</Typography>
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
              disabled={!isFormValid() || createMutation.isPending}
              startIcon={createMutation.isPending && <CircularProgress size={16} color="inherit" />}
            >
              등록하기
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData(initialFormData);
                setAgendaForm({ ...initialAgendaForm });
              }}
              disabled={createMutation.isPending}
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
                        <Typography fontWeight={500}>{meeting.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.vote_start_date
                            ? new Date(meeting.vote_start_date).toLocaleString('ko-KR')
                            : '-'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.vote_end_date
                            ? new Date(meeting.vote_end_date).toLocaleString('ko-KR')
                            : '-'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {meeting.meeting_date}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {meeting.quorum_count}
                        ({meeting.quorum_count && meeting.total_members
                          ? Math.round((meeting.quorum_count / meeting.total_members) * 100)
                          : 0}%)
                      </TableCell>
                      <TableCell align="center">{meeting.total_members}</TableCell>
                      <TableCell align="center">{meeting.agenda_count}</TableCell>
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
                            sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
                          >
                            수정
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
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
