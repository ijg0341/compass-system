/**
 * 서면투표 등록 폼
 * 화면 ID: CP-SA-09-005
 */
import { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Autocomplete,
} from '@mui/material';
import { useVoteMembers, useAgendas, useRegisterPaperVote } from '@/src/hooks/useVote';
import type { VoteMember, Agenda, VoteChoice } from '@/src/types/vote.types';

interface PaperVoteFormProps {
  projectId: number;
  meetingId: number;
}

interface VoteSelection {
  agenda_id: number;
  choice: VoteChoice | number;
}

export default function PaperVoteForm({ projectId, meetingId }: PaperVoteFormProps) {
  // 선택된 조합원
  const [selectedMember, setSelectedMember] = useState<VoteMember | null>(null);

  // 투표 선택
  const [votes, setVotes] = useState<VoteSelection[]>([]);

  // 스낵바
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // API 훅
  const { data: membersData, isLoading: isMembersLoading } = useVoteMembers(
    projectId,
    meetingId,
    { has_voted: false }
  );
  const { data: agendas, isLoading: isAgendasLoading } = useAgendas(projectId, meetingId);
  const registerMutation = useRegisterPaperVote();

  // 미투표 조합원 목록
  const unvotedMembers = membersData?.list || [];

  // 조합원 선택 핸들러
  const handleMemberSelect = (member: VoteMember | null) => {
    setSelectedMember(member);
    // 안건별 초기 투표 선택 설정
    if (agendas) {
      setVotes(
        agendas.map((agenda) => ({
          agenda_id: agenda.id,
          choice: 'agree' as VoteChoice,
        }))
      );
    }
  };

  // 투표 선택 변경
  const handleVoteChange = (agendaId: number, choice: VoteChoice | number) => {
    setVotes((prev) =>
      prev.map((v) => (v.agenda_id === agendaId ? { ...v, choice } : v))
    );
  };

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!selectedMember) {
      setSnackbar({ open: true, message: '조합원을 선택해주세요.', severity: 'error' });
      return;
    }

    if (votes.length === 0) {
      setSnackbar({ open: true, message: '투표 내용을 입력해주세요.', severity: 'error' });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        projectId,
        meetingId,
        data: {
          member_id: selectedMember.id,
          paper_vote_date: new Date().toISOString(),
          votes,
        },
      });

      setSnackbar({ open: true, message: '서면투표가 등록되었습니다.', severity: 'success' });

      // 폼 초기화
      setSelectedMember(null);
      setVotes([]);
    } catch {
      setSnackbar({ open: true, message: '등록에 실패했습니다.', severity: 'error' });
    }
  }, [selectedMember, votes, registerMutation, projectId, meetingId]);

  // 안건별 투표 입력 렌더링
  const renderAgendaVote = (agenda: Agenda) => {
    const currentVote = votes.find((v) => v.agenda_id === agenda.id);

    return (
      <Paper
        key={agenda.id}
        sx={{
          p: 2,
          mb: 2,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          제{agenda.order}호 안건
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
          {agenda.title}
        </Typography>

        {agenda.vote_type === 'approval' ? (
          <RadioGroup
            row
            value={currentVote?.choice || ''}
            onChange={(e) => handleVoteChange(agenda.id, e.target.value as VoteChoice)}
          >
            <FormControlLabel
              value="agree"
              control={<Radio color="success" />}
              label="찬성"
            />
            <FormControlLabel
              value="disagree"
              control={<Radio color="error" />}
              label="반대"
            />
            <FormControlLabel
              value="abstain"
              control={<Radio />}
              label="기권"
            />
          </RadioGroup>
        ) : (
          <FormControl fullWidth size="small">
            <InputLabel>선택</InputLabel>
            <Select
              value={currentVote?.choice || ''}
              label="선택"
              onChange={(e) => handleVoteChange(agenda.id, Number(e.target.value))}
            >
              {agenda.options?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Paper>
    );
  };

  if (isMembersLoading || isAgendasLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          background: 'rgba(26, 26, 26, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          서면투표 등록
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          서면으로 제출된 투표지를 대리 입력합니다. 미투표 조합원만 선택 가능합니다.
        </Alert>

        {/* 조합원 선택 */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          조합원 선택
        </Typography>
        <Autocomplete
          options={unvotedMembers}
          value={selectedMember}
          onChange={(_, newValue) => handleMemberSelect(newValue)}
          getOptionLabel={(option) =>
            `${option.name} (${option.dong || '-'} ${option.ho || '-'}) - ${option.phone}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="조합원 이름, 연락처, 동/호로 검색"
              size="small"
            />
          )}
          sx={{ mb: 3 }}
          noOptionsText="미투표 조합원이 없습니다"
        />

        {/* 선택된 조합원 정보 */}
        {selectedMember && (
          <>
            <Paper sx={{ p: 2, mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                선택된 조합원
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                <Typography variant="body2">이름: {selectedMember.name}</Typography>
                <Typography variant="body2">연락처: {selectedMember.phone}</Typography>
                <Typography variant="body2">
                  동/호: {selectedMember.dong} {selectedMember.ho}
                </Typography>
                <Typography variant="body2">
                  평형: {selectedMember.unit_type || '-'}
                </Typography>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* 안건별 투표 */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              안건별 투표
            </Typography>

            {agendas && agendas.length > 0 ? (
              agendas.map(renderAgendaVote)
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                등록된 안건이 없습니다.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* 제출 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={registerMutation.isPending || !selectedMember || votes.length === 0}
                startIcon={registerMutation.isPending && <CircularProgress size={16} />}
              >
                서면투표 등록
              </Button>
            </Box>
          </>
        )}

        {!selectedMember && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            서면투표를 등록할 조합원을 선택해주세요.
          </Typography>
        )}
      </Paper>

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
