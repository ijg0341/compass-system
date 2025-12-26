/**
 * 이사예약 생성 페이지 (스마트넷)
 * 화면 ID: CP-SA-10-002
 */
import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useMoveReservations, useCreateOrUpdateMoveSettings } from '@/src/hooks/useMove';
import { MOVE_TIME_UNITS, getMoveUrl, extractDate } from '@/src/lib/api/moveApi';

// 시간 옵션 생성 (06시~22시)
const HOUR_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const hour = (i + 6).toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}시` };
});

// 폼 상태
interface FormState {
  dateBegin: string;
  dateEnd: string;
  timeFirst: string;
  timeLast: string;
  timeUnit: number;
}

const initialFormState: FormState = {
  dateBegin: '',
  dateEnd: '',
  timeFirst: '10:00',
  timeLast: '18:00',
  timeUnit: 60,
};

// 스타일 정의
const labelCellSx = {
  width: '15%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1.5,
  px: 2,
};

const valueCellSx = {
  width: '35%',
  py: 1,
  px: 1.5,
};

export default function SmartnetMoveCreatePage() {
  const { projectUuid } = useCurrentProject();

  // 상태
  const [form, setForm] = useState<FormState>(initialFormState);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // API 훅
  const { data: moveData, isLoading } = useMoveReservations(projectUuid);
  const createMutation = useCreateOrUpdateMoveSettings();

  // 기존 설정 로드
  const settings = moveData?.settings;
  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        dateBegin: extractDate(settings.date_begin),
        dateEnd: extractDate(settings.date_end),
        timeFirst: settings.time_first?.slice(0, 5) || '10:00',
        timeLast: settings.time_last?.slice(0, 5) || '18:00',
        timeUnit: settings.time_unit || 60,
      });
    }
  }, [settings]);

  // 등록/수정
  const handleSubmit = useCallback(async () => {
    if (!projectUuid || !form.dateBegin || !form.dateEnd) {
      setSnackbar({ open: true, message: '시작일과 종료일을 입력해주세요.', severity: 'error' });
      return;
    }

    try {
      await createMutation.mutateAsync({
        projectUuid,
        data: {
          date_begin: form.dateBegin,
          date_end: form.dateEnd,
          time_first: form.timeFirst,
          time_last: form.timeLast,
          time_unit: form.timeUnit,
        },
      });
      setSnackbar({ open: true, message: '이사예약 설정이 저장되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('저장 실패:', error);
      setSnackbar({ open: true, message: '저장에 실패했습니다.', severity: 'error' });
    }
  }, [projectUuid, form, createMutation]);

  // URL 복사
  const settingsUuid = settings?.uuid;
  const handleCopyUrl = useCallback(async () => {
    if (!settingsUuid) {
      setSnackbar({ open: true, message: '이사예약이 생성되지 않았습니다.', severity: 'error' });
      return;
    }

    const url = getMoveUrl(settingsUuid);
    try {
      await navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: 'URL이 클립보드에 복사되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('URL 복사 실패:', error);
      setSnackbar({ open: true, message: 'URL 복사에 실패했습니다.', severity: 'error' });
    }
  }, [settingsUuid]);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          이사예약 생성
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          스마트넷 &gt; 이사예약 생성
        </Typography>
      </Box>

      {/* 이사예약 생성 폼 */}
      <Paper
        sx={{
          p: 3,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid rgba(0, 0, 0, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          이사예약 생성
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 3 }}>
              <Table size="small">
                <TableBody>
                  {/* 시작일/종료일 */}
                  <TableRow>
                    <TableCell sx={labelCellSx}>시작일</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        value={form.dateBegin}
                        onChange={(e) => setForm(prev => ({ ...prev, dateBegin: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell sx={labelCellSx}>종료일</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        value={form.dateEnd}
                        onChange={(e) => setForm(prev => ({ ...prev, dateEnd: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* 이사 첫시간/마지막시간 */}
                  <TableRow>
                    <TableCell sx={labelCellSx}>이사 첫시간</TableCell>
                    <TableCell sx={valueCellSx}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={form.timeFirst}
                          onChange={(e) => setForm(prev => ({ ...prev, timeFirst: e.target.value }))}
                        >
                          {HOUR_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={labelCellSx}>이사 마지막시간</TableCell>
                    <TableCell sx={valueCellSx}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={form.timeLast}
                          onChange={(e) => setForm(prev => ({ ...prev, timeLast: e.target.value }))}
                        >
                          {HOUR_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* 이사 간격 */}
                  <TableRow>
                    <TableCell sx={labelCellSx}>이사 간격</TableCell>
                    <TableCell sx={valueCellSx}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={form.timeUnit}
                          onChange={(e) => setForm(prev => ({ ...prev, timeUnit: Number(e.target.value) }))}
                        >
                          {MOVE_TIME_UNITS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={labelCellSx}></TableCell>
                    <TableCell sx={valueCellSx}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* 버튼 영역 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <CircularProgress size={20} /> : '등록하기'}
              </Button>

              {settingsUuid && (
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyUrl}
                >
                  URL 복사
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>

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
