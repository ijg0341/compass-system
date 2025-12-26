/**
 * 투표 내역 컴포넌트
 * 화면 ID: CP-SA-09-004
 */
import { useState, useCallback } from 'react';
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
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Download as DownloadIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useVoteRecords, useExportVoteRecords } from '@/src/hooks/useVote';
import type { VoteRecord } from '@/src/types/vote.types';
import PaperVoteModal from './PaperVoteModal';
import VoteDocumentModal from './VoteDocumentModal';

interface VoteHistoryProps {
  projectUuid: string;
  meetingId: number;
}

// 현장참석 라벨 (향후 확장)
const attendanceLabels: Record<string, string> = {
  self: '본인',
  proxy: '대리인',
  '-': '-',
};

export default function VoteHistory({ projectUuid, meetingId }: VoteHistoryProps) {
  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 서면투표 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VoteRecord | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // 첨부파일 모달
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Record<string, unknown> | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string>('');

  // 스낵바
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // API 훅
  const { data: recordsData, isLoading, refetch } = useVoteRecords(projectUuid, meetingId, {
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });
  const exportMutation = useExportVoteRecords();

  const records = recordsData?.list || [];
  const total = recordsData?.total || 0;

  // 서면투표 등록 버튼 클릭
  const handlePaperVoteRegister = useCallback((record: VoteRecord) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setModalOpen(true);
  }, []);

  // 서면투표 수정 버튼 클릭
  const handlePaperVoteEdit = useCallback((record: VoteRecord) => {
    setSelectedRecord(record);
    setIsEditMode(true);
    setModalOpen(true);
  }, []);

  // 모달 닫기
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedRecord(null);
  }, []);

  // 모달 저장 완료
  const handleModalSave = useCallback(() => {
    setModalOpen(false);
    setSelectedRecord(null);
    setSnackbar({ open: true, message: '서면투표가 등록되었습니다.', severity: 'success' });
    refetch();
  }, [refetch]);

  // 첨부파일 보기
  const handleViewDocument = useCallback((record: VoteRecord) => {
    setSelectedDocument(record.vote_document || null);
    setSelectedMemberName(record.member_name);
    setDocModalOpen(true);
  }, []);

  // 첨부파일 모달 닫기
  const handleDocModalClose = useCallback(() => {
    setDocModalOpen(false);
    setSelectedDocument(null);
    setSelectedMemberName('');
  }, []);

  // 엑셀 다운로드
  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync({ projectUuid, meetingId });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `투표내역_${meetingId}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setSnackbar({ open: true, message: '다운로드에 실패했습니다.', severity: 'error' });
    }
  };

  // 투표방식 텍스트 렌더링
  const getVoteMethodText = (record: VoteRecord): string => {
    if (!record.vote_method) return '-';
    if (record.vote_method === 'paper') return '서면';
    if (record.vote_method === 'electronic') return '전자';
    return '-';
  };

  // 관리 버튼 렌더링
  const renderManageButton = (record: VoteRecord) => {
    // 투표하지 않은 경우: 서면투표 등록 버튼
    if (!record.vote_method) {
      return (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlePaperVoteRegister(record)}
          sx={{ py: 0.25, px: 1, fontSize: '0.75rem', minWidth: 'auto' }}
        >
          서면투표 등록
        </Button>
      );
    }

    // 서면투표한 경우: 서면투표 수정 버튼
    if (record.vote_method === 'paper') {
      return (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlePaperVoteEdit(record)}
          sx={{ py: 0.25, px: 1, fontSize: '0.75rem', minWidth: 'auto' }}
        >
          서면투표 수정
        </Button>
      );
    }

    // 전자투표한 경우: 버튼 없음
    return null;
  };

  return (
    <Box>
      {/* 엑셀 다운로드 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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

      {/* 테이블 */}
      <Paper
        sx={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 90, whiteSpace: 'nowrap' }}>가입번호</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }}>동</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }}>호</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }}>타입</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100, whiteSpace: 'nowrap' }}>성명</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 110, whiteSpace: 'nowrap' }}>생년월일</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }} align="center">
                  사전투표
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }} align="center">
                  현장참석
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }} align="center">
                  투표방식
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80, whiteSpace: 'nowrap' }} align="center">
                  제출서류
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 130, whiteSpace: 'nowrap' }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">투표 내역이 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.member_no}</TableCell>
                    <TableCell>{record.dong || '-'}</TableCell>
                    <TableCell>{record.ho || '-'}</TableCell>
                    <TableCell>{record.unit_type || '-'}</TableCell>
                    <TableCell>{record.member_name}</TableCell>
                    <TableCell>{record.birth_date}</TableCell>
                    <TableCell align="center">
                      {record.pre_voted ? 'O' : ''}
                    </TableCell>
                    <TableCell align="center">
                      {record.attendance_type && record.attendance_type !== '-'
                        ? attendanceLabels[record.attendance_type] || record.attendance_type
                        : '-'}
                    </TableCell>
                    <TableCell align="center">{getVoteMethodText(record)}</TableCell>
                    <TableCell align="center">
                      {record.vote_document ? (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleViewDocument(record)}
                          sx={{ py: 0, px: 0.5, minWidth: 'auto' }}
                        >
                          <AttachFileIcon fontSize="small" />
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="center">{renderManageButton(record)}</TableCell>
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

      {/* 서면투표 등록/수정 모달 */}
      {selectedRecord && (
        <PaperVoteModal
          open={modalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          projectUuid={projectUuid}
          meetingId={meetingId}
          memberId={selectedRecord.member_id}
          memberInfo={{
            name: selectedRecord.member_name,
            birth_date: selectedRecord.birth_date,
            dong: selectedRecord.dong,
            ho: selectedRecord.ho,
            phone: selectedRecord.phone,
          }}
          isEditMode={isEditMode}
          existingVotes={selectedRecord.votes}
          existingVoteDate={selectedRecord.vote_date}
          existingVoteDocument={selectedRecord.vote_document}
        />
      )}

      {/* 첨부파일 보기 모달 */}
      <VoteDocumentModal
        open={docModalOpen}
        onClose={handleDocModalClose}
        document={selectedDocument}
        memberName={selectedMemberName}
      />

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
