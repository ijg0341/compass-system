/**
 * 관리자 전용 - 현장 관리 페이지
 * 기획서 CP-SA-21-002
 */
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  companyApi,
  projectApi,
  formatApiDate,
  type ProjectListItem,
  type ProjectCreateRequest,
  type ApiDateField,
} from '@/src/lib/api/superadminApi';
import ProjectTypeModal from './ProjectTypeModal';

// 날짜 필드 타입
interface DateField {
  begin: string;
  end: string;
  undecided: boolean;
}

export default function ProjectManage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 폼 상태
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [projectName, setProjectName] = useState('');

  // 날짜 필드들
  const [bsDate, setBsDate] = useState<DateField>({ begin: '', end: '', undecided: true });
  const [qaDate, setQaDate] = useState<DateField>({ begin: '', end: '', undecided: true });
  const [preDate, setPreDate] = useState<DateField>({ begin: '', end: '', undecided: true });
  const [mngtDate, setMngtDate] = useState<DateField>({ begin: '', end: '', undecided: true });
  const [occupancyDate, setOccupancyDate] = useState<DateField>({ begin: '', end: '', undecided: true });
  const [csDate, setCsDate] = useState<DateField>({ begin: '', end: '', undecided: true });

  // 타입 관리 모달 상태
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string>('');

  // 다이얼로그 상태
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  // 건설사 목록 조회
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyApi.getList(),
  });

  const companies = companiesData?.data?.list ?? [];

  // 현장 목록 조회
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getList(),
  });

  const projects = projectsData?.data?.list ?? [];
  const total = projectsData?.data?.total ?? 0;

  // 등록/수정 mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) {
        throw new Error('건설사를 선택하세요.');
      }
      if (!projectName.trim()) {
        throw new Error('현장명을 입력하세요.');
      }

      const data: ProjectCreateRequest = {
        construction_company_id: companyId as number,
        name: projectName,
        bs_date_begin: bsDate.undecided ? null : bsDate.begin || null,
        bs_date_end: bsDate.undecided ? null : bsDate.end || null,
        qa_date_begin: qaDate.undecided ? null : qaDate.begin || null,
        qa_date_end: qaDate.undecided ? null : qaDate.end || null,
        pre_date_begin: preDate.undecided ? null : preDate.begin || null,
        pre_date_end: preDate.undecided ? null : preDate.end || null,
        mngt_date_begin: mngtDate.undecided ? null : mngtDate.begin || null,
        mngt_date_end: mngtDate.undecided ? null : mngtDate.end || null,
        occupancy_date_begin: occupancyDate.undecided ? null : occupancyDate.begin || null,
        occupancy_date_end: occupancyDate.undecided ? null : occupancyDate.end || null,
        cs_date_begin: csDate.undecided ? null : csDate.begin || null,
        cs_date_end: csDate.undecided ? null : csDate.end || null,
      };

      if (editMode && editId) {
        return projectApi.update(editId, data);
      } else {
        return projectApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorDialog(err.response?.data?.message || err.message || '저장에 실패했습니다.');
    },
  });

  // 건설사 ID로 이름 조회하는 헬퍼 함수
  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || '-';
  };

  const handleEdit = (project: ProjectListItem) => {
    setEditMode(true);
    setEditId(project.id);
    setCompanyId(project.construction_company_id);
    setProjectName(project.name);

    setBsDate({
      begin: formatApiDate(project.bs_date_begin) || '',
      end: formatApiDate(project.bs_date_end) || '',
      undecided: !project.bs_date_begin,
    });
    setQaDate({
      begin: formatApiDate(project.qa_date_begin) || '',
      end: formatApiDate(project.qa_date_end) || '',
      undecided: !project.qa_date_begin,
    });
    setPreDate({
      begin: formatApiDate(project.pre_date_begin) || '',
      end: formatApiDate(project.pre_date_end) || '',
      undecided: !project.pre_date_begin,
    });
    setMngtDate({
      begin: formatApiDate(project.mngt_date_begin) || '',
      end: formatApiDate(project.mngt_date_end) || '',
      undecided: !project.mngt_date_begin,
    });
    setOccupancyDate({
      begin: formatApiDate(project.occupancy_date_begin) || '',
      end: formatApiDate(project.occupancy_date_end) || '',
      undecided: !project.occupancy_date_begin,
    });
    setCsDate({
      begin: formatApiDate(project.cs_date_begin) || '',
      end: formatApiDate(project.cs_date_end) || '',
      undecided: !project.cs_date_begin,
    });
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setCompanyId('');
    setProjectName('');
    setBsDate({ begin: '', end: '', undecided: true });
    setQaDate({ begin: '', end: '', undecided: true });
    setPreDate({ begin: '', end: '', undecided: true });
    setMngtDate({ begin: '', end: '', undecided: true });
    setOccupancyDate({ begin: '', end: '', undecided: true });
    setCsDate({ begin: '', end: '', undecided: true });
  };

  const handleSubmit = () => {
    saveMutation.mutate();
  };

  const handleOpenTypeModal = (uuid: string) => {
    setSelectedProjectUuid(uuid);
    setTypeModalOpen(true);
  };

  // 페이지네이션 처리
  const paginatedProjects = projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 날짜 필드 렌더링 컴포넌트
  const DateFieldInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: DateField;
    onChange: (v: DateField) => void;
  }) => (
    <TableRow>
      <TableCell sx={labelCellSx}>{label}</TableCell>
      <TableCell sx={valueCellSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            type="date"
            value={value.begin}
            onChange={(e) => onChange({ ...value, begin: e.target.value })}
            disabled={value.undecided}
            sx={{ width: 150, ...inputSx }}
          />
          <Typography>~</Typography>
          <TextField
            size="small"
            type="date"
            value={value.end}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            disabled={value.undecided}
            sx={{ width: 150, ...inputSx }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={value.undecided}
                onChange={(e) => onChange({ ...value, undecided: e.target.checked })}
              />
            }
            label="미정"
          />
        </Box>
      </TableCell>
    </TableRow>
  );

  const labelCellSx = {
    width: '15%',
    bgcolor: 'action.hover',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.primary',
    py: 1,
    px: 2,
  };

  const valueCellSx = {
    py: 0.5,
    px: 1,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
    '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
  };

  // 기간 포맷팅
  const formatPeriod = (begin: ApiDateField, end: ApiDateField) => {
    const beginStr = formatApiDate(begin);
    const endStr = formatApiDate(end);
    if (!beginStr) return '미정';
    return `${beginStr}${endStr ? ` ~ ${endStr}` : ''}`;
  };

  return (
    <Box>
      {/* 현장 생성/수정 폼 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        현장 생성/수정
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mb: 2,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={labelCellSx}>건설사명</TableCell>
              <TableCell sx={valueCellSx}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value as number)}
                    displayEmpty
                    sx={inputSx}
                  >
                    <MenuItem value="">건설사 선택</MenuItem>
                    {companies.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCellSx}>현장명</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  size="small"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  sx={{ ...inputSx, minWidth: 300 }}
                />
              </TableCell>
            </TableRow>
            <DateFieldInput label="BS점검" value={bsDate} onChange={setBsDate} />
            <DateFieldInput label="품질점검" value={qaDate} onChange={setQaDate} />
            <DateFieldInput label="사전점검" value={preDate} onChange={setPreDate} />
            <DateFieldInput label="경영층 점검" value={mngtDate} onChange={setMngtDate} />
            <DateFieldInput label="입주관리" value={occupancyDate} onChange={setOccupancyDate} />
            <DateFieldInput label="CS" value={csDate} onChange={setCsDate} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
        >
          {editMode ? '수정하기' : '등록하기'}
        </Button>
        <Button variant="outlined" onClick={resetForm}>
          취소
        </Button>
      </Box>

      {/* 현장 목록 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        현장 목록
      </Typography>

      <Paper
        sx={{
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
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                  고유번호
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>건설사</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150 }}>현장명</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>기간</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 150 }} align="center">
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProjects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell align="center">{project.id}</TableCell>
                  <TableCell>{getCompanyName(project.construction_company_id)}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: 0.5, fontSize: '0.75rem' }}>
                      <Typography variant="caption" fontWeight={600}>BS점검</Typography>
                      <Typography variant="caption">{formatPeriod(project.bs_date_begin, project.bs_date_end)}</Typography>
                      <Typography variant="caption" fontWeight={600}>품질점검</Typography>
                      <Typography variant="caption">{formatPeriod(project.qa_date_begin, project.qa_date_end)}</Typography>
                      <Typography variant="caption" fontWeight={600}>사전점검</Typography>
                      <Typography variant="caption">{formatPeriod(project.pre_date_begin, project.pre_date_end)}</Typography>
                      <Typography variant="caption" fontWeight={600}>경영층 점검</Typography>
                      <Typography variant="caption">{formatPeriod(project.mngt_date_begin, project.mngt_date_end)}</Typography>
                      <Typography variant="caption" fontWeight={600}>입주관리</Typography>
                      <Typography variant="caption">{formatPeriod(project.occupancy_date_begin, project.occupancy_date_end)}</Typography>
                      <Typography variant="caption" fontWeight={600}>CS</Typography>
                      <Typography variant="caption">{formatPeriod(project.cs_date_begin, project.cs_date_end)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(project)}
                      >
                        수정
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenTypeModal(project.uuid)}
                      >
                        타입
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    등록된 현장이 없습니다.
                  </TableCell>
                </TableRow>
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
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / 총 ${count}건`
          }
        />
      </Paper>

      {/* 타입 관리 모달 */}
      <ProjectTypeModal
        open={typeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        projectUuid={selectedProjectUuid}
      />

      {/* 에러 다이얼로그 */}
      <Dialog open={!!errorDialog} onClose={() => setErrorDialog(null)}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDialog}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(null)} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
