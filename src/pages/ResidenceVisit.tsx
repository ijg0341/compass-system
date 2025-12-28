/**
 * 입주방문등록 페이지
 * 화면 ID: CP-SA-03-001
 */
import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import HistoryIcon from '@mui/icons-material/History';
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';
import DataTable, { type Column } from '@/src/components/common/DataTable';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useVisits, useCreateVisit, useDownloadVisitExcel, useUploadVisitExcel } from '@/src/hooks/useVisit';
import { getCommonDongs, getCommonDonghos, type CommonDongho } from '@/src/lib/api/commonApi';
import { VISIT_TYPES, VISIT_PURPOSES, type Visit, type VisitListParams } from '@/src/lib/api/visitApi';
import VisitHistoryModal from '@/src/components/household/VisitHistoryModal';
import HouseholdDetailDrawer from '@/src/components/visit/HouseholdDetailDrawer';

// 입주방문 폼 상태
interface VisitFormState {
  dong: string;
  ho: string;
  donghoId: number | null;
  visitorName: string;
  visitorPhone: string;
  visitType: string;
  visitPurpose: string[];
  workBegin: string;
  workEnd: string;
  memo: string;
}

const initialFormState: VisitFormState = {
  dong: '',
  ho: '',
  donghoId: null,
  visitorName: '',
  visitorPhone: '',
  visitType: '',
  visitPurpose: [],
  workBegin: '',
  workEnd: '',
  memo: '',
};

// 필터 상태
interface FilterState {
  visitDate: string;
  dong: string;
  ho: string;
  visitType: string;
  visitPurpose: string;
  workDate: string;
}

const initialFilterState: FilterState = {
  visitDate: '',
  dong: '',
  ho: '',
  visitType: '',
  visitPurpose: '',
  workDate: '',
};

export default function ResidenceVisitPage() {
  const { projectUuid } = useCurrentProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태
  const [form, setForm] = useState<VisitFormState>(initialFormState);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 동/호 정보
  const [dongs, setDongs] = useState<string[]>([]);
  const [hos, setHos] = useState<CommonDongho[]>([]);
  const [selectedDongho, setSelectedDongho] = useState<CommonDongho | null>(null);

  // 모달 상태
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<{ dong: string; ho: string; donghoId: number } | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  // API 훅
  const listParams: VisitListParams = useMemo(() => ({
    page: page + 1,
    limit: rowsPerPage,
    ...(filters.dong && { dong: filters.dong }),
    ...(filters.ho && { ho: filters.ho }),
    ...(filters.visitType && { visit_type: filters.visitType }),
    ...(filters.visitPurpose && { visit_purpose: filters.visitPurpose }),
    ...(filters.visitDate && { visit_date: filters.visitDate }),
    ...(filters.workDate && { work_date: filters.workDate }),
  }), [page, rowsPerPage, filters]);

  const { data: visitsData, isLoading, refetch } = useVisits(projectUuid, listParams);
  const createMutation = useCreateVisit();
  const downloadMutation = useDownloadVisitExcel();
  const uploadMutation = useUploadVisitExcel();

  // 동 목록 로드
  const loadDongs = useCallback(async () => {
    if (!projectUuid) return;
    try {
      const data = await getCommonDongs(projectUuid);
      setDongs(data);
    } catch (error) {
      console.error('동 목록 로드 실패:', error);
    }
  }, [projectUuid]);

  // 컴포넌트 마운트 시 동 목록 로드
  useState(() => {
    loadDongs();
  });

  // 동 선택 시 호 목록 로드
  const handleDongChange = useCallback(async (dong: string) => {
    setForm(prev => ({ ...prev, dong, ho: '', donghoId: null }));
    setSelectedDongho(null);
    if (!projectUuid || !dong) {
      setHos([]);
      return;
    }
    try {
      const data = await getCommonDonghos(projectUuid, dong);
      setHos(data);
    } catch (error) {
      console.error('호 목록 로드 실패:', error);
    }
  }, [projectUuid]);

  // 호 선택 시 세대 정보 설정
  const handleHoChange = useCallback((ho: string) => {
    const dongho = hos.find(h => h.ho === ho);
    setForm(prev => ({ ...prev, ho, donghoId: dongho?.id || null }));
    setSelectedDongho(dongho || null);
  }, [hos]);

  // 방문목적 체크박스 변경
  const handlePurposeChange = useCallback((purpose: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      visitPurpose: checked
        ? [...prev.visitPurpose, purpose]
        : prev.visitPurpose.filter(p => p !== purpose),
    }));
  }, []);

  // 등록하기
  const handleSubmit = useCallback(async () => {
    if (!projectUuid || !form.donghoId || !form.visitorName || !form.visitorPhone || !form.visitType) {
      setSnackbar({ open: true, message: '필수 항목을 입력해주세요.', severity: 'error' });
      return;
    }
    try {
      await createMutation.mutateAsync({
        projectUuid,
        data: {
          dongho_id: form.donghoId,
          visitor_name: form.visitorName,
          visitor_phone: form.visitorPhone,
          visit_type: form.visitType,
          visit_purpose: form.visitPurpose,
          work_begin: form.workBegin || undefined,
          work_end: form.workEnd || undefined,
          memo: form.memo || undefined,
        },
      });
      setSnackbar({ open: true, message: '입주방문이 등록되었습니다.', severity: 'success' });
      setForm(initialFormState);
      setSelectedDongho(null);
      refetch();
    } catch (error) {
      console.error('등록 실패:', error);
      setSnackbar({ open: true, message: '등록에 실패했습니다.', severity: 'error' });
    }
  }, [projectUuid, form, createMutation, refetch]);

  // 방문이력 조회
  const handleViewHistory = useCallback((dong: string, ho: string, donghoId: number) => {
    setHistoryTarget({ dong, ho, donghoId });
    setHistoryModalOpen(true);
  }, []);

  // 엑셀 다운로드
  const handleDownloadExcel = useCallback(async () => {
    if (!projectUuid) return;
    try {
      await downloadMutation.mutateAsync({ projectUuid, params: filters });
      setSnackbar({ open: true, message: '엑셀 다운로드가 시작되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      setSnackbar({ open: true, message: '엑셀 다운로드에 실패했습니다.', severity: 'error' });
    }
  }, [projectUuid, filters, downloadMutation]);

  // 엑셀 업로드
  const handleUploadExcel = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !projectUuid) return;
    try {
      const result = await uploadMutation.mutateAsync({ projectUuid, file });
      setSnackbar({
        open: true,
        message: `업로드 완료: ${result.insert_count}건 등록, ${result.skip_count}건 스킵`,
        severity: 'success',
      });
      refetch();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
      setSnackbar({ open: true, message: '엑셀 업로드에 실패했습니다.', severity: 'error' });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [projectUuid, uploadMutation, refetch]);

  // 행 클릭 시 세대상세 표시
  const handleRowClick = useCallback((visit: Visit) => {
    setSelectedVisit(visit);
    setDetailDrawerOpen(true);
  }, []);

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
    setPage(0);
  }, []);

  // 테이블 컬럼 정의
  const columns: Column<Visit>[] = useMemo(() => [
    { id: 'created_at', label: '방문일시', minWidth: 140, render: (row) => row.created_at?.slice(0, 16).replace('T', ' ') || '-' },
    { id: 'dong', label: '동', minWidth: 80 },
    { id: 'ho', label: '호', minWidth: 80 },
    { id: 'visitor_name', label: '방문자 이름', minWidth: 100 },
    { id: 'visitor_phone', label: '방문자 연락처', minWidth: 120 },
    { id: 'visit_type', label: '방문구분', minWidth: 100 },
    {
      id: 'visit_purpose',
      label: '방문목적',
      minWidth: 150,
      render: (row) => row.visit_purpose?.join(', ') || '-',
    },
    {
      id: 'work_period',
      label: '작업기간',
      minWidth: 180,
      render: (row) => {
        if (!row.work_begin && !row.work_end) return '-';
        return `${row.work_begin || ''} ~ ${row.work_end || ''}`;
      },
    },
    { id: 'creator_name', label: '등록자', minWidth: 100, render: (row) => row.creator_name || '-' },
    { id: 'creator_phone', label: '등록자 연락처', minWidth: 120, render: (row) => row.creator_phone || '-' },
    {
      id: 'history',
      label: '방문이력',
      minWidth: 80,
      align: 'center',
      render: (row) => (
        <Tooltip title="방문이력 보기">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewHistory(row.dong, row.ho, row.dongho_id);
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    { id: 'memo', label: '메모', minWidth: 150, render: (row) => row.memo || '-' },
  ], [handleViewHistory]);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            입주방문등록
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            입주관리 &gt; 입주방문등록
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          엑셀 등록
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleUploadExcel}
        />
      </Box>

      {/* 입주방문등록 폼 */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* 1행: 동, 호, 방문자정보, 방문구분, 작업기간 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 80 }} required>
              <InputLabel>동</InputLabel>
              <Select
                value={form.dong}
                label="동"
                onChange={(e) => handleDongChange(e.target.value)}
              >
                <MenuItem value="">선택</MenuItem>
                {dongs.map((dong) => (
                  <MenuItem key={dong} value={dong}>{dong}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 80 }} required disabled={!form.dong}>
              <InputLabel>호</InputLabel>
              <Select
                value={form.ho}
                label="호"
                onChange={(e) => handleHoChange(e.target.value)}
              >
                <MenuItem value="">선택</MenuItem>
                {hos.map((h) => (
                  <MenuItem key={h.id} value={h.ho}>{h.ho}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="방문자 이름"
              size="small"
              value={form.visitorName}
              onChange={(e) => setForm(prev => ({ ...prev, visitorName: e.target.value }))}
              sx={{ minWidth: 100 }}
              required
            />

            <TextField
              label="방문자 연락처"
              size="small"
              value={form.visitorPhone}
              onChange={(e) => setForm(prev => ({ ...prev, visitorPhone: e.target.value }))}
              placeholder="010-0000-0000"
              sx={{ minWidth: 130 }}
              required
            />

            <FormControl size="small" sx={{ minWidth: 100 }} required>
              <InputLabel>방문구분</InputLabel>
              <Select
                value={form.visitType}
                label="방문구분"
                onChange={(e) => setForm(prev => ({ ...prev, visitType: e.target.value }))}
              >
                <MenuItem value="">선택</MenuItem>
                {VISIT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="작업시작일"
              type="date"
              size="small"
              value={form.workBegin}
              onChange={(e) => setForm(prev => ({ ...prev, workBegin: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />

            <TextField
              label="작업종료일"
              type="date"
              size="small"
              value={form.workEnd}
              onChange={(e) => setForm(prev => ({ ...prev, workEnd: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
          </Box>

          {/* 2행: 방문목적 체크박스, 세대정보, 메모, 버튼 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {/* 방문목적 체크박스 (4x2 그리드) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0 }}>
              {VISIT_PURPOSES.map((purpose) => (
                <FormControlLabel
                  key={purpose}
                  control={
                    <Checkbox
                      size="small"
                      checked={form.visitPurpose.includes(purpose)}
                      onChange={(e) => handlePurposeChange(purpose, e.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">{purpose}</Typography>}
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>

            {/* 세대 정보 (동/호 선택 시 표시) */}
            {selectedDongho && (
              <>
                <TextField
                  label="계약자"
                  size="small"
                  value={selectedDongho.contractor_name || ''}
                  disabled
                  sx={{ minWidth: 80 }}
                />
                <IconButton
                  size="small"
                  onClick={() => form.donghoId && selectedDongho && handleViewHistory(selectedDongho.dong, selectedDongho.ho, form.donghoId)}
                  disabled={!form.donghoId}
                  title="방문이력"
                >
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </>
            )}

          </Box>

          {/* 3행: 메모 + 등록버튼 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              label="메모"
              size="small"
              value={form.memo}
              onChange={(e) => setForm(prev => ({ ...prev, memo: e.target.value }))}
              multiline
              rows={2}
              sx={{ flex: 1 }}
              placeholder="메모를 입력하세요"
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={createMutation.isPending || !form.donghoId}
              sx={{
                minWidth: 80,
                height: 40,
                bgcolor: '#333',
                '&:hover': { bgcolor: '#444' },
              }}
            >
              {createMutation.isPending ? <CircularProgress size={20} color="inherit" /> : '등록하기'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 방문 목록 헤더 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            방문 목록
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {visitsData?.total ?? 0}건
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
          disabled={downloadMutation.isPending}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 필터 */}
      <FilterContainer
        onReset={handleResetFilters}
        onApply={() => {
          setPage(0);
          refetch();
        }}
      >
        <FilterRow isLast>
          <TextField
            label="방문일"
            type="date"
            size="small"
            value={filters.visitDate}
            onChange={(e) => setFilters(prev => ({ ...prev, visitDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>동 선택</InputLabel>
            <Select
              value={filters.dong}
              label="동 선택"
              onChange={(e) => setFilters(prev => ({ ...prev, dong: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
              {dongs.map((dong) => (
                <MenuItem key={dong} value={dong}>{dong}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>호 선택</InputLabel>
            <Select
              value={filters.ho}
              label="호 선택"
              onChange={(e) => setFilters(prev => ({ ...prev, ho: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>방문형태</InputLabel>
            <Select
              value={filters.visitType}
              label="방문형태"
              onChange={(e) => setFilters(prev => ({ ...prev, visitType: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
              {VISIT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>방문목적</InputLabel>
            <Select
              value={filters.visitPurpose}
              label="방문목적"
              onChange={(e) => setFilters(prev => ({ ...prev, visitPurpose: e.target.value }))}
            >
              <MenuItem value="">전체</MenuItem>
              {VISIT_PURPOSES.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="작업일"
            type="date"
            size="small"
            value={filters.workDate}
            onChange={(e) => setFilters(prev => ({ ...prev, workDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </FilterRow>
      </FilterContainer>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={visitsData?.list || []}
        total={visitsData?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onRowClick={handleRowClick}
        getRowKey={(row) => row.id}
        emptyMessage={isLoading ? '데이터를 불러오는 중...' : '데이터가 없습니다.'}
      />

      {/* 방문이력 모달 */}
      {historyTarget && (
        <VisitHistoryModal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          dong={historyTarget.dong}
          ho={historyTarget.ho}
          donghoId={historyTarget.donghoId}
        />
      )}

      {/* 세대상세 Drawer */}
      {selectedVisit && (
        <HouseholdDetailDrawer
          open={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
          donghoId={selectedVisit.dongho_id}
        />
      )}

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
