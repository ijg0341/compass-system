/**
 * A/S 상세 드로어 컴포넌트
 * 기획서: CP-SA-03-004
 *
 * 수정 불가: 동, 호, 타입/평수, 라인, 회원유형, 입주형태, ID, 등록일시, 고유번호, 협력사, 연락처
 * 수정 가능: 나머지 전부
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useDongho } from '@/src/hooks/useDongho';
import type {
  AfterserviceDetail,
  AfterserviceUpdateRequest,
  AsStatus,
  AsPriority,
  Partner,
} from '@/src/types/afterservice.types';
import type { AscodeOptions } from '@/src/lib/api/afterserviceApi';
import {
  AS_STATUS_COLORS,
  AS_PRIORITY_COLORS,
} from '@/src/types/afterservice.types';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  projectUuid: string;
  detail: AfterserviceDetail | null;
  isLoading?: boolean;
  statusOptions: AsStatus[];
  priorityOptions: AsPriority[];
  ascodeOptions: AscodeOptions;
  partners: Partner[];
  onSave: (data: AfterserviceUpdateRequest) => void;
  isSaving?: boolean;
}

// 테이블 셀 스타일
const labelCellSx = {
  width: '15%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1,
  px: 1.5,
};

const valueCellSx = {
  width: '35%',
  py: 0.5,
  px: 1,
};

// 수정 가능한 input (흰색 배경)
const inputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
  '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
};

// 수정 불가 input (회색 배경)
const disabledInputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'action.disabledBackground' },
  '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
};

export default function DetailDrawer({
  open,
  onClose,
  projectUuid,
  detail,
  isLoading,
  statusOptions,
  priorityOptions,
  ascodeOptions,
  partners,
  onSave,
  isSaving,
}: DetailDrawerProps) {
  const { data: donghoData, isLoading: isDonghoLoading } = useDongho(
    projectUuid,
    detail?.dongho_id || 0
  );
  const [formData, setFormData] = useState<AfterserviceUpdateRequest>({});
  const [imageDialog, setImageDialog] = useState<{ open: boolean; url: string }>({
    open: false,
    url: '',
  });

  // 기본 정보 수정 가능 필드 state
  const [contractorName, setContractorName] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  const [contractorBirth, setContractorBirth] = useState('');
  const [residentName, setResidentName] = useState('');
  const [residentPhone, setResidentPhone] = useState('');
  const [residentBirth, setResidentBirth] = useState('');
  const [level, setLevel] = useState('');
  const [residentDate, setResidentDate] = useState('');
  const [pw, setPw] = useState('');

  // 하자코드 선택 필드 state
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedIssueCategory1, setSelectedIssueCategory1] = useState('');
  const [selectedIssueCategory2, setSelectedIssueCategory2] = useState('');
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [selectedWorkType1, setSelectedWorkType1] = useState('');
  const [selectedWorkType2, setSelectedWorkType2] = useState('');

  // 6단계 캐스케이딩 옵션 계산 (tree 구조 기반)
  const { tree, ascodeMap } = ascodeOptions;

  // 1단계: 실명 옵션 (tree의 최상위 키들)
  const roomOptions = useMemo(() => Object.keys(tree).sort(), [tree]);

  // 2단계: 하자부위 옵션 (선택된 실명의 자식)
  const issueCategory1Options = useMemo(() => {
    if (!selectedRoom || !tree[selectedRoom]) return [];
    return Object.keys(tree[selectedRoom]).sort();
  }, [tree, selectedRoom]);

  // 3단계: 하자상세 옵션 (선택된 하자부위의 자식)
  const issueCategory2Options = useMemo(() => {
    if (!selectedRoom || !selectedIssueCategory1) return [];
    const level2 = tree[selectedRoom]?.[selectedIssueCategory1];
    if (!level2) return [];
    return Object.keys(level2).sort();
  }, [tree, selectedRoom, selectedIssueCategory1]);

  // 4단계: 하자유형 옵션 (선택된 하자상세의 자식)
  const issueTypeOptions = useMemo(() => {
    if (!selectedRoom || !selectedIssueCategory1 || !selectedIssueCategory2) return [];
    const level3 = tree[selectedRoom]?.[selectedIssueCategory1]?.[selectedIssueCategory2];
    if (!level3) return [];
    return Object.keys(level3).sort();
  }, [tree, selectedRoom, selectedIssueCategory1, selectedIssueCategory2]);

  // 5단계: 대공종 옵션 (선택된 하자유형의 자식)
  const workType1Options = useMemo(() => {
    if (!selectedRoom || !selectedIssueCategory1 || !selectedIssueCategory2 || !selectedIssueType) return [];
    const level4 = tree[selectedRoom]?.[selectedIssueCategory1]?.[selectedIssueCategory2]?.[selectedIssueType];
    if (!level4) return [];
    return Object.keys(level4).sort();
  }, [tree, selectedRoom, selectedIssueCategory1, selectedIssueCategory2, selectedIssueType]);

  // 6단계: 소공종 옵션 (선택된 대공종의 자식 - 배열)
  const workType2Options = useMemo(() => {
    if (!selectedRoom || !selectedIssueCategory1 || !selectedIssueCategory2 || !selectedIssueType || !selectedWorkType1) return [];
    const level5 = tree[selectedRoom]?.[selectedIssueCategory1]?.[selectedIssueCategory2]?.[selectedIssueType]?.[selectedWorkType1];
    if (!level5 || !Array.isArray(level5)) return [];
    return [...level5].sort();
  }, [tree, selectedRoom, selectedIssueCategory1, selectedIssueCategory2, selectedIssueType, selectedWorkType1]);

  useEffect(() => {
    if (detail) {
      setFormData({
        as_status_id: detail.as_status_id,
        as_priority_id: detail.as_priority_id,
        work_date: detail.work_date || '',
        work_memo: detail.work_memo || '',
        completed_content: detail.completed_content || '',
        completed_at: detail.completed_at?.split(' ')[0] || '',
        issue_content: detail.issue_content || '',
        project_ascode_id: detail.project_ascode_id,
      });
      // 하자코드 필드 초기화
      setSelectedRoom(detail.ascode?.room || '');
      setSelectedIssueCategory1(detail.ascode?.issue_category1 || '');
      setSelectedIssueCategory2(detail.ascode?.issue_category2 || '');
      setSelectedIssueType(detail.ascode?.issue_type || '');
      setSelectedWorkType1(detail.ascode?.work_type1 || '');
      setSelectedWorkType2(detail.ascode?.work_type2 || '');
    }
  }, [detail]);

  // 기본 정보 초기화
  useEffect(() => {
    if (donghoData) {
      setContractorName(donghoData.contractor_name || '');
      setContractorPhone(donghoData.contractor_phone || '');
      setContractorBirth(donghoData.contractor_birth || '');
      setResidentName(donghoData.resident_name || '');
      setResidentPhone(donghoData.resident_phone || '');
      setResidentBirth(donghoData.resident_birth || '');
      setLevel(donghoData.level || '');
      setResidentDate(donghoData.resident_date || '');
      setPw('');
    }
  }, [donghoData]);

  // 선택된 필드들로 매칭되는 ascode ID 찾기 (ascodeMap 사용)
  useEffect(() => {
    if (selectedRoom && selectedIssueCategory1 && selectedIssueCategory2 &&
        selectedIssueType && selectedWorkType1 && selectedWorkType2) {
      const key = `${selectedRoom}|${selectedIssueCategory1}|${selectedIssueCategory2}|${selectedIssueType}|${selectedWorkType1}|${selectedWorkType2}`;
      const matchedId = ascodeMap[key];
      if (matchedId) {
        setFormData((prev) => ({ ...prev, project_ascode_id: matchedId }));
      }
    }
  }, [selectedRoom, selectedIssueCategory1, selectedIssueCategory2, selectedIssueType, selectedWorkType1, selectedWorkType2, ascodeMap]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleImageClick = (url: string) => {
    setImageDialog({ open: true, url });
  };

  // 캐스케이딩 선택 핸들러 (하위 레벨 리셋)
  const handleRoomChange = (value: string) => {
    setSelectedRoom(value);
    setSelectedIssueCategory1('');
    setSelectedIssueCategory2('');
    setSelectedIssueType('');
    setSelectedWorkType1('');
    setSelectedWorkType2('');
  };

  const handleIssueCategory1Change = (value: string) => {
    setSelectedIssueCategory1(value);
    setSelectedIssueCategory2('');
    setSelectedIssueType('');
    setSelectedWorkType1('');
    setSelectedWorkType2('');
  };

  const handleIssueCategory2Change = (value: string) => {
    setSelectedIssueCategory2(value);
    setSelectedIssueType('');
    setSelectedWorkType1('');
    setSelectedWorkType2('');
  };

  const handleIssueTypeChange = (value: string) => {
    setSelectedIssueType(value);
    setSelectedWorkType1('');
    setSelectedWorkType2('');
  };

  const handleWorkType1Change = (value: string) => {
    setSelectedWorkType1(value);
    setSelectedWorkType2('');
  };

  if (!detail) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        disableScrollLock={false}
        ModalProps={{ keepMounted: false }}
        sx={{ zIndex: 1300 }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '85%', md: '70%', lg: '60%' },
            maxWidth: '900px',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                A/S 상세
              </Typography>
              <Chip
                label={detail.as_status?.name || ''}
                size="small"
                sx={{
                  backgroundColor: AS_STATUS_COLORS[detail.as_status_id] || '#757575',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={detail.as_priority?.name || ''}
                size="small"
                sx={{
                  backgroundColor: AS_PRIORITY_COLORS[detail.as_priority_id] || '#757575',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 본문 */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.05)' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' },
              },
            }}
            onWheel={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {isLoading || isDonghoLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* 기본 정보 */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  기본 정보
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      {/* 동/호 - 수정불가 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>동</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.dongho?.dong || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>호</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.dongho?.ho || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                      </TableRow>
                      {/* 타입/평수, 라인 - 수정불가 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>타입/평수</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.dongho?.unit_type || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>라인</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.dongho?.ev_lines?.join(', ') || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                      </TableRow>
                      {/* 계약자명/연락처 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>계약자명</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={contractorName} onChange={(e) => setContractorName(e.target.value)} sx={inputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>연락처</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={contractorPhone} onChange={(e) => setContractorPhone(e.target.value)} sx={inputSx} />
                        </TableCell>
                      </TableRow>
                      {/* 계약자 생년월일 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>계약자 생년월일</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" type="date" value={contractorBirth} onChange={(e) => setContractorBirth(e.target.value)} sx={inputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}></TableCell>
                        <TableCell sx={valueCellSx}></TableCell>
                      </TableRow>
                      {/* 입주자명/연락처 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>입주자명</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={residentName} onChange={(e) => setResidentName(e.target.value)} sx={inputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>연락처</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={residentPhone} onChange={(e) => setResidentPhone(e.target.value)} sx={inputSx} />
                        </TableCell>
                      </TableRow>
                      {/* 입주자 생년월일 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>입주자 생년월일</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" type="date" value={residentBirth} onChange={(e) => setResidentBirth(e.target.value)} sx={inputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}></TableCell>
                        <TableCell sx={valueCellSx}></TableCell>
                      </TableRow>
                      {/* 회원유형/등급 - 회원유형 수정불가, 등급 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>회원유형</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value="" disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>등급</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={level} onChange={(e) => setLevel(e.target.value)} sx={inputSx} />
                        </TableCell>
                      </TableRow>
                      {/* 입주형태/입주예정 - 입주형태 수정불가, 입주예정 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>입주형태</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={donghoData?.resident_type || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>입주예정</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" type="date" value={residentDate} onChange={(e) => setResidentDate(e.target.value)} sx={inputSx} />
                        </TableCell>
                      </TableRow>
                      {/* ID/PW - ID 수정불가, PW 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>ID</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value="" disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>PW</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={pw} onChange={(e) => setPw(e.target.value)} sx={inputSx} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 하자 정보 */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  하자 정보
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      {/* 등록일시/고유번호 - 수정불가 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>등록일시</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.created_at || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>고유번호</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.id} disabled sx={disabledInputSx} />
                        </TableCell>
                      </TableRow>

                      {/* 실명/하자부위 - 수정가능 (캐스케이딩) */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>실명</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select value={selectedRoom} onChange={(e) => handleRoomChange(e.target.value)} displayEmpty sx={inputSx}>
                              <MenuItem value="" disabled>실명</MenuItem>
                              {roomOptions.map((room) => (
                                <MenuItem key={room} value={room}>{room}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={labelCellSx}>하자부위</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedIssueCategory1}
                              onChange={(e) => handleIssueCategory1Change(e.target.value)}
                              displayEmpty
                              sx={inputSx}
                              disabled={!selectedRoom}
                            >
                              <MenuItem value="" disabled>부위명</MenuItem>
                              {issueCategory1Options.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>

                      {/* 세부부위/하자유형 - 수정가능 (캐스케이딩) */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>세부부위</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedIssueCategory2}
                              onChange={(e) => handleIssueCategory2Change(e.target.value)}
                              displayEmpty
                              sx={inputSx}
                              disabled={!selectedIssueCategory1}
                            >
                              <MenuItem value="" disabled>상세부위명</MenuItem>
                              {issueCategory2Options.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={labelCellSx}>하자유형</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedIssueType}
                              onChange={(e) => handleIssueTypeChange(e.target.value)}
                              displayEmpty
                              sx={inputSx}
                              disabled={!selectedIssueCategory2}
                            >
                              <MenuItem value="" disabled>유형</MenuItem>
                              {issueTypeOptions.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>

                      {/* 하자내용/하자형태 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>하자내용</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.issue_content || ''}
                            onChange={(e) => setFormData({ ...formData, issue_content: e.target.value })}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>하자형태</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={formData.as_priority_id || ''}
                              onChange={(e) => setFormData({ ...formData, as_priority_id: Number(e.target.value) })}
                              sx={inputSx}
                            >
                              <MenuItem value="" disabled>형태</MenuItem>
                              {priorityOptions.map((p) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>

                      {/* 대공종/공종 - 수정가능 (캐스케이딩) */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>대공종</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedWorkType1}
                              onChange={(e) => handleWorkType1Change(e.target.value)}
                              displayEmpty
                              sx={inputSx}
                              disabled={!selectedIssueType}
                            >
                              <MenuItem value="" disabled>대공종</MenuItem>
                              {workType1Options.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={labelCellSx}>공종</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedWorkType2}
                              onChange={(e) => setSelectedWorkType2(e.target.value)}
                              displayEmpty
                              sx={inputSx}
                              disabled={!selectedWorkType1}
                            >
                              <MenuItem value="" disabled>소공종</MenuItem>
                              {workType2Options.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>

                      {/* 협력사/진행상태 - 협력사 수정불가, 진행상태 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>협력사</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.partner?.company || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                        <TableCell sx={labelCellSx}>진행상태</TableCell>
                        <TableCell sx={valueCellSx}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={formData.as_status_id || ''}
                              onChange={(e) => setFormData({ ...formData, as_status_id: Number(e.target.value) })}
                              sx={inputSx}
                            >
                              <MenuItem value="" disabled>진행상태</MenuItem>
                              {statusOptions.map((s) => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>

                      {/* 보수일정/연락처 - 보수일정 수정가능, 연락처 수정불가 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>보수일정</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={formData.work_date || ''}
                            onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>연락처</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField fullWidth size="small" value={detail.partner?.phone || ''} disabled sx={disabledInputSx} />
                        </TableCell>
                      </TableRow>

                      {/* 메모 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>메모</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.work_memo || ''}
                            onChange={(e) => setFormData({ ...formData, work_memo: e.target.value })}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>

                      {/* 완료일자/완료내용 - 수정가능 */}
                      <TableRow>
                        <TableCell sx={labelCellSx}>완료일자</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={formData.completed_at || ''}
                            onChange={(e) => setFormData({ ...formData, completed_at: e.target.value })}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>완료내용</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.completed_content || ''}
                            onChange={(e) => setFormData({ ...formData, completed_content: e.target.value })}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>

                      {/* 사진 */}
                      {(detail.image_far || detail.image_near) && (
                        <TableRow>
                          <TableCell sx={labelCellSx}>원거리 사진</TableCell>
                          <TableCell sx={valueCellSx}>
                            {detail.image_far ? (
                              <IconButton onClick={() => handleImageClick(detail.image_far!)} color="primary" size="small">
                                <ImageIcon />
                              </IconButton>
                            ) : '-'}
                          </TableCell>
                          <TableCell sx={labelCellSx}>근거리 사진</TableCell>
                          <TableCell sx={valueCellSx}>
                            {detail.image_near ? (
                              <IconButton onClick={() => handleImageClick(detail.image_near!)} color="primary" size="small">
                                <ImageIcon />
                              </IconButton>
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>

          {/* 푸터 */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              sx={{ minWidth: 100 }}
            >
              {isSaving ? '저장 중...' : '등록'}
            </Button>
            <Button variant="outlined" onClick={onClose} sx={{ minWidth: 100 }}>
              취소
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* 이미지 미리보기 다이얼로그 */}
      <Dialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, url: '' })}
        maxWidth="md"
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setImageDialog({ open: false, url: '' })}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            <Box
              component="img"
              src={imageDialog.url}
              alt="사진"
              sx={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
            />
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}
