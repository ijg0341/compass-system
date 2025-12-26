/**
 * 서면투표 등록/수정 Drawer
 * 화면 ID: CP-SA-09-005
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Drawer,
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
import { uploadFile, type FileUploadResponse } from '@/src/lib/api/reservationApi';
import type { Agenda, AgendaVote } from '@/src/types/vote.types';

interface PaperVoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  projectUuid: string;
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
  existingVoteDate?: string;
  existingVoteDocument?: Record<string, unknown> | null;
}

interface VoteSelection {
  agenda_id: number;
  choice: string | null;  // 서버 answers 값 사용
}

interface UploadedFile {
  name: string;
  size: number;
  file?: File;
  url?: string; // 기존 업로드된 파일 URL
  uploaded?: FileUploadResponse; // 업로드 완료 시 응답 저장
  uploading?: boolean; // 업로드 중 상태
  isExisting?: boolean; // 기존 파일 여부
}

export default function PaperVoteModal({
  open,
  onClose,
  onSave,
  projectUuid,
  meetingId,
  memberId,
  memberInfo,
  isEditMode,
  existingVotes,
  existingVoteDate,
  existingVoteDocument,
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
  const { data: agendas, isLoading: isAgendasLoading } = useAgendas(projectUuid, meetingId);
  const registerMutation = useRegisterPaperVote();
  const updateMutation = useUpdatePaperVote();

  // 안건 로드 시 투표 선택 초기화
  useEffect(() => {
    if (agendas) {
      if (isEditMode && existingVotes) {
        // 수정 모드: 기존 투표 선택 로드 (서버 값 그대로 사용)
        setVotes(
          agendas.map((agenda) => {
            const existing = existingVotes.find((v) => v.agenda_id === agenda.id);
            // answer 또는 choice 필드 확인
            const existingChoice = existing?.answer || (existing as { choice?: string })?.choice || null;
            return {
              agenda_id: agenda.id,
              choice: existingChoice,
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

  // 수정 모드: 기존 날짜 및 첨부파일 로드
  useEffect(() => {
    if (isEditMode) {
      // 날짜 로드
      if (existingVoteDate) {
        setPaperVoteDate(existingVoteDate);
      }
      // 기존 첨부파일 로드
      if (existingVoteDocument) {
        const existingFiles: UploadedFile[] = [];

        // URL 추출 함수
        const extractUrls = (obj: unknown): void => {
          if (!obj) return;
          if (typeof obj === 'string') {
            if (obj.startsWith('http://') || obj.startsWith('https://')) {
              existingFiles.push({
                name: obj.split('/').pop() || '제출서류',
                size: 0,
                url: obj,
                isExisting: true,
              });
            } else {
              try {
                const parsed = JSON.parse(obj);
                extractUrls(parsed);
              } catch {
                // 일반 문자열
              }
            }
            return;
          }
          if (Array.isArray(obj)) {
            obj.forEach((item) => extractUrls(item));
            return;
          }
          if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach((value) => extractUrls(value));
          }
        };

        extractUrls(existingVoteDocument);
        setFiles(existingFiles);
      }
    } else {
      // 등록 모드: 초기화
      setPaperVoteDate('');
      setFiles([]);
    }
  }, [isEditMode, existingVoteDate, existingVoteDocument]);

  // 투표 선택 변경
  const handleVoteChange = useCallback((agendaId: number, choice: string) => {
    setVotes((prev) =>
      prev.map((v) => (v.agenda_id === agendaId ? { ...v, choice } : v))
    );
    setError(null);
  }, []);

  // 파일 업로드 (S3로 즉시 업로드)
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of Array.from(uploadedFiles)) {
      if (!allowedTypes.includes(file.type)) {
        setError('jpg, gif, png 파일만 업로드 가능합니다.');
        continue;
      }
      if (file.size > maxSize) {
        setError('파일 크기는 최대 10MB입니다.');
        continue;
      }

      // 파일 목록에 추가 (업로드 중 상태)
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        file,
        uploading: true,
      };
      setFiles((prev) => [...prev, newFile]);

      try {
        // S3 업로드
        const response = await uploadFile(file, {
          entityType: 'conference_voter',
          fileCategory: 'vote_document',
        });

        // 업로드 완료 상태로 업데이트
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name && f.uploading
              ? { ...f, uploading: false, uploaded: response }
              : f
          )
        );
      } catch {
        // 업로드 실패 시 목록에서 제거
        setFiles((prev) => prev.filter((f) => !(f.name === file.name && f.uploading)));
        setError(`${file.name} 업로드에 실패했습니다.`);
      }
    }

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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024;

    for (const file of Array.from(droppedFiles)) {
      if (!allowedTypes.includes(file.type)) {
        setError('jpg, gif, png 파일만 업로드 가능합니다.');
        continue;
      }
      if (file.size > maxSize) {
        setError('파일 크기는 최대 10MB입니다.');
        continue;
      }

      // 파일 목록에 추가 (업로드 중 상태)
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        file,
        uploading: true,
      };
      setFiles((prev) => [...prev, newFile]);

      try {
        // S3 업로드
        const response = await uploadFile(file, {
          entityType: 'conference_voter',
          fileCategory: 'vote_document',
        });

        // 업로드 완료 상태로 업데이트
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name && f.uploading
              ? { ...f, uploading: false, uploaded: response }
              : f
          )
        );
      } catch {
        // 업로드 실패 시 목록에서 제거
        setFiles((prev) => prev.filter((f) => !(f.name === file.name && f.uploading)));
        setError(`${file.name} 업로드에 실패했습니다.`);
      }
    }
  }, []);

  // 유효성 검사
  const validate = (): boolean => {
    if (!paperVoteDate) {
      setError('서면결의 날짜를 선택해주세요.');
      return false;
    }

    const missingVote = votes.find((v) => v.choice === null);
    if (missingVote && agendas) {
      const agendaIndex = agendas.findIndex((a) => a.id === missingVote.agenda_id);
      setError(`안건 제${agendaIndex + 1}호 의사표시가 필요합니다.`);
      return false;
    }

    return true;
  };

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    // 업로드 중인 파일이 있는지 확인
    const uploadingFiles = files.filter((f) => f.uploading);
    if (uploadingFiles.length > 0) {
      setError('파일 업로드가 완료될 때까지 기다려주세요.');
      return;
    }

    try {
      // choice가 이미 서버 값("찬성", "반대" 등)이므로 그대로 사용
      const voteData = votes
        .filter((v) => v.choice !== null)
        .map((v) => ({
          conference_agenda_id: v.agenda_id,
          answer: String(v.choice),
        }));

      // 파일 URL 목록 구성 (기존 파일 + 새로 업로드된 파일)
      const allFileUrls: string[] = [];

      files.forEach((f) => {
        if (f.isExisting && f.url) {
          // 기존 파일
          allFileUrls.push(f.url);
        } else if (f.uploaded) {
          // 새로 업로드된 파일
          allFileUrls.push(f.uploaded.url);
        }
      });

      let voteDocumentData: string | undefined;

      if (allFileUrls.length === 1) {
        voteDocumentData = JSON.stringify({ document_url: allFileUrls[0] });
      } else if (allFileUrls.length > 1) {
        const documentObj: Record<string, string> = {};
        allFileUrls.forEach((url, index) => {
          const key = index === 0 ? 'document_url' : `document_url${index + 1}`;
          documentObj[key] = url;
        });
        voteDocumentData = JSON.stringify(documentObj);
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          projectUuid,
          meetingId,
          memberId,
          data: {
            conference_voter_id: memberId,
            vote_date: paperVoteDate,
            votes: voteData,
            vote_document: voteDocumentData,
          },
        });
      } else {
        await registerMutation.mutateAsync({
          projectUuid,
          meetingId,
          data: {
            conference_voter_id: memberId,
            vote_date: paperVoteDate,
            votes: voteData,
            vote_document: voteDocumentData,
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
    projectUuid,
    meetingId,
    memberId,
    onSave,
  ]);

  // 안건 선택지 렌더링 - 서버에서 주는 answers 배열 사용
  const renderChoices = (agenda: Agenda) => {
    const currentVote = votes.find((v) => v.agenda_id === agenda.id);
    const answers = agenda.answers || ['찬성', '반대', '기권'];

    return (
      <RadioGroup
        row
        value={currentVote?.choice || ''}
        onChange={(e) => handleVoteChange(agenda.id, e.target.value)}
      >
        {answers.map((answer) => (
          <FormControlLabel
            key={answer}
            value={answer}
            control={<Radio size="small" />}
            label={answer}
          />
        ))}
      </RadioGroup>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // Drawer가 열릴 때 Lenis 스크롤 중지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (window as { lenis?: { stop: () => void; start: () => void } }).lenis;
      if (open && lenis) {
        lenis.stop();
      } else if (!open && lenis) {
        lenis.start();
      }
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      disableScrollLock={false}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        zIndex: 1300,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '85%', md: '700px' },
          maxWidth: '700px',
          background: '#1a1a1a',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 헤더 */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            서면투표 {isEditMode ? '수정' : '등록'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 본문 */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          {isAgendasLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
            {/* 조합원 정보 */}
            <Table
              size="small"
              sx={{
                mb: 3,
                tableLayout: 'fixed',
                '& td, & th': { border: '1px solid rgba(255,255,255,0.15)', py: 1, px: 1.5 },
                '& th': { whiteSpace: 'nowrap', width: '15%', bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 },
                '& td': { width: '35%' },
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell component="th">조합원 성명</TableCell>
                  <TableCell>{memberInfo.name}</TableCell>
                  <TableCell component="th">생년월일</TableCell>
                  <TableCell>{memberInfo.birth_date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">동/호</TableCell>
                  <TableCell>{memberInfo.dong || '-'} / {memberInfo.ho || '-'}</TableCell>
                  <TableCell component="th">연락처</TableCell>
                  <TableCell>{memberInfo.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">서면결의 날짜 *</TableCell>
                  <TableCell colSpan={3}>
                    <TextField
                      type="date"
                      size="small"
                      value={paperVoteDate}
                      onChange={(e) => {
                        setPaperVoteDate(e.target.value);
                        setError(null);
                      }}
                      sx={{ width: 200 }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* 첨부파일 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                제출서류
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
                      {file.uploading && <CircularProgress size={16} />}
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {file.name}
                        {file.size > 0 && ` (${formatFileSize(file.size)})`}
                        {file.uploading && ' - 업로드 중...'}
                        {file.uploaded && ' - 완료'}
                        {file.isExisting && ' - 기존 파일'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFileDelete(index)}
                        disabled={file.uploading}
                      >
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
                  {agendas?.map((agenda, index) => (
                    <TableRow key={agenda.id}>
                      <TableCell>제{index + 1}호</TableCell>
                      <TableCell>{agenda.name}</TableCell>
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
        </Box>

        {/* 푸터 */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
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
        </Box>
      </Box>
    </Drawer>
  );
}
