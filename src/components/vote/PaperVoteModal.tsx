/**
 * 서면투표 등록/수정 모달
 * 화면 ID: CP-SA-09-005
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAgendas, useRegisterPaperVote, useUpdatePaperVote } from '@/src/hooks/useVote';
import type { Agenda, AgendaVote, VoteChoice } from '@/src/types/vote.types';

interface PaperVoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  projectId: number;
  meetingId: number;
  memberId: number;
  memberInfo: {
    name: string;
    birth_date: string;
    dong?: string;
    ho?: string;
    phone: string;
  };
  isEditMode: boolean;
  existingVotes?: AgendaVote[];
}

interface VoteSelection {
  agenda_id: number;
  choice: VoteChoice | number | null;
}

interface UploadedFile {
  name: string;
  size: number;
  file: File;
}

export default function PaperVoteModal({
  open,
  onClose,
  onSave,
  projectId,
  meetingId,
  memberId,
  memberInfo,
  isEditMode,
  existingVotes,
}: PaperVoteModalProps) {
  // 서면결의 날짜
  const [paperVoteDate, setPaperVoteDate] = useState('');

  // 첨부파일
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 투표 선택
  const [votes, setVotes] = useState<VoteSelection[]>([]);

  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // API 훅
  const { data: agendas, isLoading: isAgendasLoading } = useAgendas(projectId, meetingId);
  const registerMutation = useRegisterPaperVote();
  const updateMutation = useUpdatePaperVote();

  // 안건 로드 시 투표 선택 초기화
  useEffect(() => {
    if (agendas) {
      if (isEditMode && existingVotes) {
        // 수정 모드: 기존 투표 선택 로드
        setVotes(
          agendas.map((agenda) => {
            const existing = existingVotes.find((v) => v.agenda_id === agenda.id);
            return {
              agenda_id: agenda.id,
              choice: existing?.choice || null,
            };
          })
        );
      } else {
        // 등록 모드: 빈 선택으로 초기화
        setVotes(
          agendas.map((agenda) => ({
            agenda_id: agenda.id,
            choice: null,
          }))
        );
      }
    }
  }, [agendas, isEditMode, existingVotes]);

  // 투표 선택 변경
  const handleVoteChange = useCallback((agendaId: number, choice: VoteChoice | number) => {
    setVotes((prev) =>
      prev.map((v) => (v.agenda_id === agendaId ? { ...v, choice } : v))
    );
    setError(null);
  }, []);

  // 파일 업로드
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: UploadedFile[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(uploadedFiles).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError('jpg, gif, png 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > maxSize) {
        setError('파일 크기는 최대 10MB입니다.');
        return;
      }
      newFiles.push({
        name: file.name,
        size: file.size,
        file,
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  }, []);

  // 파일 삭제
  const handleFileDelete = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 드래그 앤 드롭
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles: UploadedFile[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024;

    Array.from(droppedFiles).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError('jpg, gif, png 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > maxSize) {
        setError('파일 크기는 최대 10MB입니다.');
        return;
      }
      newFiles.push({
        name: file.name,
        size: file.size,
        file,
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // 유효성 검사
  const validate = (): boolean => {
    if (!paperVoteDate) {
      setError('서면결의 날짜를 선택해주세요.');
      return false;
    }

    const missingVote = votes.find((v) => v.choice === null);
    if (missingVote && agendas) {
      const agenda = agendas.find((a) => a.id === missingVote.agenda_id);
      setError(`안건 제${agenda?.order}호 의사표시가 필요합니다.`);
      return false;
    }

    return true;
  };

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    try {
      const voteData = votes
        .filter((v) => v.choice !== null)
        .map((v) => ({
          agenda_id: v.agenda_id,
          choice: v.choice as VoteChoice | number,
        }));

      if (isEditMode) {
        await updateMutation.mutateAsync({
          projectId,
          meetingId,
          memberId,
          data: {
            member_id: memberId,
            paper_vote_date: paperVoteDate,
            votes: voteData,
            attachment_files: files.map((f) => f.file),
          },
        });
      } else {
        await registerMutation.mutateAsync({
          projectId,
          meetingId,
          data: {
            member_id: memberId,
            paper_vote_date: paperVoteDate,
            votes: voteData,
            attachment_files: files.map((f) => f.file),
          },
        });
      }

      onSave();
    } catch {
      setError('저장에 실패했습니다.');
    }
  }, [
    votes,
    paperVoteDate,
    files,
    isEditMode,
    registerMutation,
    updateMutation,
    projectId,
    meetingId,
    memberId,
    onSave,
  ]);

  // 안건 선택지 렌더링
  const renderChoices = (agenda: Agenda) => {
    const currentVote = votes.find((v) => v.agenda_id === agenda.id);

    if (agenda.vote_type === 'approval') {
      return (
        <RadioGroup
          row
          value={currentVote?.choice || ''}
          onChange={(e) => handleVoteChange(agenda.id, e.target.value as VoteChoice)}
        >
          <FormControlLabel value="agree" control={<Radio size="small" />} label="찬성" />
          <FormControlLabel value="disagree" control={<Radio size="small" />} label="반대" />
          <FormControlLabel value="abstain" control={<Radio size="small" />} label="기권" />
        </RadioGroup>
      );
    }

    // 선택형
    return (
      <RadioGroup
        row
        value={currentVote?.choice?.toString() || ''}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'abstain') {
            handleVoteChange(agenda.id, 'abstain');
          } else {
            handleVoteChange(agenda.id, Number(val));
          }
        }}
      >
        {agenda.options?.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id.toString()}
            control={<Radio size="small" />}
            label={option.label}
          />
        ))}
        <FormControlLabel value="abstain" control={<Radio size="small" />} label="기권" />
      </RadioGroup>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          서면투표 {isEditMode ? '수정' : '등록'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isAgendasLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* 조합원 정보 */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                mb: 3,
                p: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  조합원 성명
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {memberInfo.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  생년월일
                </Typography>
                <Typography variant="body1">{memberInfo.birth_date}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  동/호
                </Typography>
                <Typography variant="body1">
                  {memberInfo.dong || '-'}동 {memberInfo.ho || '-'}호
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  연락처
                </Typography>
                <Typography variant="body1">{memberInfo.phone}</Typography>
              </Box>
            </Box>

            {/* 서면결의 날짜 */}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="서면결의 날짜"
                type="date"
                size="small"
                required
                value={paperVoteDate}
                onChange={(e) => {
                  setPaperVoteDate(e.target.value);
                  setError(null);
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
            </Box>

            {/* 첨부파일 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                첨부파일
              </Typography>
              <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  드래그 앤 드롭으로 업로드 가능
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (업로드 가능 파일 jpg, gif, png / 최대 크기 10MB)
                </Typography>
              </Box>

              {files.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {file.name} ({formatFileSize(file.size)})
                      </Typography>
                      <IconButton size="small" onClick={() => handleFileDelete(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ mt: 1 }}
                  >
                    파일추가
                  </Button>
                </Box>
              )}
            </Box>

            {/* 안건 테이블 */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>안건</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>의결내용</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 300 }}>
                      의사표시 <span style={{ color: '#f44336' }}>*</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agendas?.map((agenda) => (
                    <TableRow key={agenda.id}>
                      <TableCell>제{agenda.order}호</TableCell>
                      <TableCell>{agenda.title}</TableCell>
                      <TableCell>{renderChoices(agenda)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 에러 메시지 */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={registerMutation.isPending || updateMutation.isPending}
          startIcon={
            (registerMutation.isPending || updateMutation.isPending) && (
              <CircularProgress size={16} />
            )
          }
        >
          {isEditMode ? '수정' : '등록'}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
