/**
 * 세대정보 상세 Drawer
 * 화면 ID: CP-SA-99-001
 */

import { useState, useEffect, useMemo, Fragment, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDrawer from '@/src/components/common/BaseDrawer';
import ImagePreviewModal from '@/src/components/common/ImagePreviewModal';
import VisitHistoryModal from './VisitHistoryModal';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useHouseholdDetail, useUpdateHousehold } from '@/src/hooks/useDongho';
import { uploadFile } from '@/src/lib/api/reservationApi';
import type { HouseholdUpdateRequest, AgentCompany, AgentAttachFile } from '@/src/types/dongho.types';

interface HouseholdDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  householdId: number | null;
  /** 사전방문 화면에서 표시하는 경우 (기본정보 외 정보 숨김) */
  isPrevisitContext?: boolean;
}

// 스타일 상수
const labelCellSx = {
  width: '15%',
  minWidth: 100,
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1,
  px: 1.5,
  whiteSpace: 'nowrap',
};

const valueCellSx = {
  width: '35%',
  py: 0.5,
  px: 1,
};

const inputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
  '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
};

// 회원유형 라벨 변환
const getUserTypeLabel = (type: number | null): string => {
  switch (type) {
    case 1: return '입주자';
    case 2: return '협력사';
    case 3: return '매니저';
    default: return '-';
  }
};

export default function HouseholdDetailDrawer({
  open,
  onClose,
  householdId,
  isPrevisitContext = false,
}: HouseholdDetailDrawerProps) {
  const { projectUuid } = useCurrentProject();
  const { data: household, isLoading } = useHouseholdDetail(
    projectUuid,
    householdId ?? 0
  );
  const updateMutation = useUpdateHousehold();

  const [formData, setFormData] = useState<HouseholdUpdateRequest>({});
  const [showLevelInput, setShowLevelInput] = useState(false);
  const [visitHistoryOpen, setVisitHistoryOpen] = useState(false);
  const [attachFiles, setAttachFiles] = useState<AgentAttachFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (household) {
      setFormData({
        contractor_name: household.contractor_name ?? '',
        contractor_phone: household.contractor_phone ?? '',
        contractor_birth: household.contractor_birth ?? '',
        resident_name: household.resident_name ?? '',
        resident_phone: household.resident_phone ?? '',
        resident_birth: household.resident_birth ?? '',
        resident_type: household.resident_type ?? '',
        resident_date: household.resident_date ?? '',
        level: household.level ?? '',
        memo: household.memo ?? '',
        meter_date: household.meter_date ?? '',
        meter_electric: household.meter_electric ?? '',
        meter_water: household.meter_water ?? '',
        meter_gas: household.meter_gas ?? '',
        meter_heating: household.meter_heating ?? '',
        meter_hotwater: household.meter_hotwater ?? '',
        meterman_name: household.meterman_name ?? '',
        meterman_phone: household.meterman_phone ?? '',
        give_date: household.give_date ?? '',
        give_items: household.give_items ?? {},
        key_date: household.key_date ?? '',
        key_release: household.key_release ?? '',
        key_house: household.key_house ?? '',
        key_lobby: household.key_lobby ?? '',
        key_post: household.key_post ?? '',
        key_etc: household.key_etc ?? '',
        keyman_name: household.keyman_name ?? '',
        keyman_phone: household.keyman_phone ?? '',
        agent_companys: household.agent_companys ?? [],
        agent_memo: household.agent_memo ?? '',
      });
      setShowLevelInput(false);
      setAttachFiles(household.agent_attachfiles ?? []);
    }
  }, [household]);

  // 파일 업로드 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // 파일 타입 검증
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('jpg, png, gif 파일만 업로드 가능합니다.');
      return;
    }
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadFile(file, {
        projectUuid,
        entityType: 'dongho_agent',
        entityId: householdId ?? undefined,
        fileCategory: 'agent_image',
      });
      setAttachFiles((prev) => [
        ...prev,
        { uuid: result.uuid, original_name: result.file.original_name, file_size: result.file.file_size, url: result.url },
      ]);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 파일 삭제 핸들러
  const handleFileRemove = (uuid: string) => {
    setAttachFiles((prev) => prev.filter((f) => f.uuid !== uuid));
  };

  // 지급품 목록 (프로젝트 설정에서 가져와야 하지만 우선 하드코딩)
  const giveItemKeys = useMemo(() => {
    if (!household?.give_items) return [];
    return Object.keys(household.give_items);
  }, [household]);

  const handleInputChange = (field: keyof HouseholdUpdateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGiveItemChange = (key: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      give_items: { ...(prev.give_items ?? {}), [key]: checked },
    }));
  };

  const handleAgentChange = (index: number, field: keyof AgentCompany, value: string) => {
    setFormData((prev) => {
      const companys = [...(prev.agent_companys ?? [])];
      if (!companys[index]) {
        companys[index] = { name: '', manager_name: '', manager_phone: '' };
      }
      companys[index][field] = value;
      return { ...prev, agent_companys: companys };
    });
  };

  const handleSubmit = async () => {
    if (!householdId) return;
    try {
      await updateMutation.mutateAsync({
        projectUuid,
        id: householdId,
        data: {
          ...formData,
          agent_attachfiles: attachFiles.map((f) => f.uuid),
        },
      });
      onClose();
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  if (!open) return null;

  const footer = (
    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
      <Button
        variant="outlined"
        onClick={() => setVisitHistoryOpen(true)}
        disabled={!householdId}
      >
        방문이력
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={updateMutation.isPending || !household}
      >
        {updateMutation.isPending ? '저장 중...' : '수정'}
      </Button>
      <Button variant="outlined" onClick={onClose}>
        닫기
      </Button>
    </Box>
  );

  return (
    <>
      <BaseDrawer
        open={open}
        onClose={onClose}
        title="세대 정보"
        size="wide"
        footer={footer}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : household ? (
          <Box>
            {/* 기본 정보 */}
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
              기본 정보
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={labelCellSx}>동</TableCell>
                    <TableCell sx={valueCellSx}>{household.dong}</TableCell>
                    <TableCell sx={labelCellSx}>호</TableCell>
                    <TableCell sx={valueCellSx}>{household.ho}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>타입/평수</TableCell>
                    <TableCell sx={valueCellSx}>{household.unit_type || '-'}</TableCell>
                    <TableCell sx={labelCellSx}>라인</TableCell>
                    <TableCell sx={valueCellSx}>
                      {household.ev_lines?.join(', ') || '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>계약자명</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.contractor_name}
                        onChange={(e) => handleInputChange('contractor_name', e.target.value)}
                        sx={inputSx}
                      />
                    </TableCell>
                    <TableCell sx={labelCellSx}>연락처</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.contractor_phone}
                        onChange={(e) => handleInputChange('contractor_phone', e.target.value)}
                        sx={inputSx}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>계약자 생년월일</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={formData.contractor_birth}
                        onChange={(e) => handleInputChange('contractor_birth', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={inputSx}
                      />
                    </TableCell>
                    <TableCell sx={labelCellSx} />
                    <TableCell sx={valueCellSx} />
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>입주자명</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.resident_name}
                        onChange={(e) => handleInputChange('resident_name', e.target.value)}
                        sx={inputSx}
                      />
                    </TableCell>
                    <TableCell sx={labelCellSx}>연락처</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.resident_phone}
                        onChange={(e) => handleInputChange('resident_phone', e.target.value)}
                        sx={inputSx}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>입주자 생년월일</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={formData.resident_birth}
                        onChange={(e) => handleInputChange('resident_birth', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={inputSx}
                      />
                    </TableCell>
                    <TableCell sx={labelCellSx} />
                    <TableCell sx={valueCellSx} />
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>회원유형</TableCell>
                    <TableCell sx={valueCellSx}>{getUserTypeLabel(household.user_type)}</TableCell>
                    <TableCell sx={labelCellSx}>등급</TableCell>
                    <TableCell sx={valueCellSx}>
                      {showLevelInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.level}
                          onChange={(e) => handleInputChange('level', e.target.value)}
                          sx={inputSx}
                        />
                      ) : (
                        <Button size="small" variant="text" onClick={() => setShowLevelInput(true)}>
                          <AddIcon fontSize="small" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>입주형태</TableCell>
                    <TableCell sx={valueCellSx}>{household.resident_type || '-'}</TableCell>
                    <TableCell sx={labelCellSx}>입주예정</TableCell>
                    <TableCell sx={valueCellSx}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={formData.resident_date}
                        onChange={(e) => handleInputChange('resident_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={inputSx}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={labelCellSx}>ID</TableCell>
                    <TableCell sx={valueCellSx}>{household.user_id || '-'}</TableCell>
                    <TableCell sx={labelCellSx}>PW</TableCell>
                    <TableCell sx={valueCellSx}>••••••••</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* 사전방문 컨텍스트가 아닌 경우 추가 정보 표시 */}
            {!isPrevisitContext && (
              <>
                {/* 검침 */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  검침
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={labelCellSx}>검침일자</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={formData.meter_date}
                            onChange={(e) => handleInputChange('meter_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>전기</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meter_electric}
                            onChange={(e) => handleInputChange('meter_electric', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>수도</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meter_water}
                            onChange={(e) => handleInputChange('meter_water', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>가스</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meter_gas}
                            onChange={(e) => handleInputChange('meter_gas', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>난방</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meter_heating}
                            onChange={(e) => handleInputChange('meter_heating', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>온수</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meter_hotwater}
                            onChange={(e) => handleInputChange('meter_hotwater', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>담당자</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meterman_name}
                            onChange={(e) => handleInputChange('meterman_name', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>연락처</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.meterman_phone}
                            onChange={(e) => handleInputChange('meterman_phone', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 지급/설치품 */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  지급/설치품
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={labelCellSx}>지급일자</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <TextField
                            size="small"
                            type="date"
                            value={formData.give_date}
                            onChange={(e) => handleInputChange('give_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ ...inputSx, width: 180 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>지급품</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {giveItemKeys.map((key) => (
                              <FormControlLabel
                                key={key}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={formData.give_items?.[key] ?? false}
                                    onChange={(e) => handleGiveItemChange(key, e.target.checked)}
                                  />
                                }
                                label={key}
                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                              />
                            ))}
                            {giveItemKeys.length === 0 && (
                              <Typography variant="body2" color="text.secondary">
                                설정된 지급품 없음
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 키분출 */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  키분출
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={labelCellSx}>지급일자</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <TextField
                            size="small"
                            type="date"
                            value={formData.key_date}
                            onChange={(e) => handleInputChange('key_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ ...inputSx, width: 180 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>키불출</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.key_release}
                            onChange={(e) => handleInputChange('key_release', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>세대키</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.key_house}
                            onChange={(e) => handleInputChange('key_house', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>공동현관</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.key_lobby}
                            onChange={(e) => handleInputChange('key_lobby', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>우편함</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.key_post}
                            onChange={(e) => handleInputChange('key_post', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>기타</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.key_etc}
                            onChange={(e) => handleInputChange('key_etc', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>담당자</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.keyman_name}
                            onChange={(e) => handleInputChange('keyman_name', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                        <TableCell sx={labelCellSx}>연락처</TableCell>
                        <TableCell sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.keyman_phone}
                            onChange={(e) => handleInputChange('keyman_phone', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 부동산 */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  부동산
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableBody>
                      {[0, 1, 2].map((index) => (
                        <Fragment key={index}>
                          <TableRow>
                            <TableCell sx={labelCellSx}>업체명{index + 1}</TableCell>
                            <TableCell colSpan={3} sx={valueCellSx}>
                              <TextField
                                fullWidth
                                size="small"
                                value={formData.agent_companys?.[index]?.name ?? ''}
                                onChange={(e) => handleAgentChange(index, 'name', e.target.value)}
                                sx={inputSx}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={labelCellSx}>담당자명</TableCell>
                            <TableCell sx={valueCellSx}>
                              <TextField
                                fullWidth
                                size="small"
                                value={formData.agent_companys?.[index]?.manager_name ?? ''}
                                onChange={(e) => handleAgentChange(index, 'manager_name', e.target.value)}
                                sx={inputSx}
                              />
                            </TableCell>
                            <TableCell sx={labelCellSx}>연락처</TableCell>
                            <TableCell sx={valueCellSx}>
                              <TextField
                                fullWidth
                                size="small"
                                value={formData.agent_companys?.[index]?.manager_phone ?? ''}
                                onChange={(e) => handleAgentChange(index, 'manager_phone', e.target.value)}
                                sx={inputSx}
                              />
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      ))}
                      <TableRow>
                        <TableCell sx={labelCellSx}>메모</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={formData.agent_memo}
                            onChange={(e) => handleInputChange('agent_memo', e.target.value)}
                            sx={inputSx}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={labelCellSx}>이미지</TableCell>
                        <TableCell colSpan={3} sx={valueCellSx}>
                          <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                              (업로드 가능 파일 jpg,gif,png / 최대 크기 10MB)
                            </Typography>
                          </Box>
                          {attachFiles.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              {attachFiles.map((file) => (
                                <Box
                                  key={file.uuid}
                                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      cursor: file.url ? 'pointer' : 'default',
                                      color: file.url ? 'primary.main' : 'text.primary',
                                      textDecoration: file.url ? 'underline' : 'none',
                                      '&:hover': file.url ? { color: 'primary.dark' } : {},
                                    }}
                                    onClick={() => file.url && setPreviewImage({ url: file.url, name: file.original_name })}
                                  >
                                    {file.original_name} ({Math.round(file.file_size / 1024)}KB)
                                  </Typography>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleFileRemove(file.uuid)}
                                    sx={{ minWidth: 'auto', p: 0.5 }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Button>
                                </Box>
                              ))}
                            </Box>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? '업로드 중...' : '파일추가'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            데이터를 불러올 수 없습니다.
          </Typography>
        )}
      </BaseDrawer>

      {/* 방문이력 모달 */}
      <VisitHistoryModal
        open={visitHistoryOpen}
        onClose={() => setVisitHistoryOpen(false)}
        dong={household?.dong ?? ''}
        ho={household?.ho ?? ''}
        donghoId={householdId ?? 0}
      />

      {/* 이미지 미리보기 모달 */}
      <ImagePreviewModal
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url ?? ''}
        imageName={previewImage?.name}
      />
    </>
  );
}
