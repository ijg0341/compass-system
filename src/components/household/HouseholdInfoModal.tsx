/**
 * 세대 정보 모달
 * 화면 ID: CP-SA-99-001
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Alert,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useHouseholdInfo, useUpdateHouseholdInfo } from '../../hooks/useDongho';
import {
  RESIDENCE_TYPE_OPTIONS,
  DEFAULT_SUPPLY_ITEMS,
} from '../../types/dongho.types';

import type { HouseholdInfo, HouseholdUpdateRequest } from '../../types/dongho.types';

interface HouseholdInfoModalProps {
  open: boolean;
  onClose: () => void;
  donghoId: number | null;
  mode?: 'previsit' | 'full'; // 사전방문 모드는 기본정보만 표시
}

export default function HouseholdInfoModal({
  open,
  onClose,
  donghoId,
  mode = 'full',
}: HouseholdInfoModalProps) {
  // 데이터 조회
  const {
    data: householdInfo,
    isLoading,
    error,
  } = useHouseholdInfo(donghoId || 0);

  // 수정 뮤테이션
  const updateMutation = useUpdateHouseholdInfo();

  // 폼 상태
  const [formData, setFormData] = useState<HouseholdInfo | null>(null);
  const [showLevel, setShowLevel] = useState(false); // 등급 필드 숨김 상태
  const [isDirty, setIsDirty] = useState(false);

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (householdInfo) {
      setFormData(householdInfo);
      setIsDirty(false);
    }
  }, [householdInfo]);

  // 기본정보 변경 핸들러
  const handleBasicChange = useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          basic: {
            ...prev.basic,
            [field]: event.target.value,
          },
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 기본정보 셀렉트 변경 핸들러
  const handleBasicSelectChange = useCallback(
    (field: keyof HouseholdInfo['basic']) =>
      (event: { target: { value: string } }) => {
        setFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            basic: {
              ...prev.basic,
              [field]: event.target.value,
            },
          };
        });
        setIsDirty(true);
      },
    []
  );

  // 검침 정보 변경 핸들러
  const handleMeterReadingChange = useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meter_reading: {
            ...prev.meter_reading,
            [field]: event.target.value,
          },
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 지급품 체크박스 변경 핸들러
  const handleSupplyItemChange = useCallback(
    (item: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        const currentItems = prev.supply.supply_items || [];
        const newItems = event.target.checked
          ? [...currentItems, item]
          : currentItems.filter((i) => i !== item);
        return {
          ...prev,
          supply: {
            ...prev.supply,
            supply_items: newItems,
          },
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 키분출 정보 변경 핸들러
  const handleKeyDistributionChange = useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          key_distribution: {
            ...prev.key_distribution,
            [field]: event.target.value,
          },
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 부동산 정보 변경 핸들러
  const handleRealEstateChange = useCallback(
    (index: number, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        const newAgencies = [...prev.real_estate.agencies];
        newAgencies[index] = {
          ...newAgencies[index],
          [field]: event.target.value,
        };
        return {
          ...prev,
          real_estate: {
            ...prev.real_estate,
            agencies: newAgencies,
          },
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 메모 변경 핸들러
  const handleMemoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          memo: event.target.value,
        };
      });
      setIsDirty(true);
    },
    []
  );

  // 수정 제출 핸들러
  const handleSubmit = useCallback(async () => {
    if (!formData || !donghoId) return;

    const updateData: HouseholdUpdateRequest = {
      dongho_id: donghoId,
      basic: formData.basic,
      meter_reading: formData.meter_reading,
      supply: formData.supply,
      key_distribution: formData.key_distribution,
      real_estate: formData.real_estate,
      memo: formData.memo || undefined,
    };

    try {
      await updateMutation.mutateAsync(updateData);
      setIsDirty(false);
      onClose();
    } catch (err) {
      console.error('세대 정보 수정 실패:', err);
    }
  }, [formData, donghoId, updateMutation, onClose]);

  // 닫기 핸들러
  const handleClose = useCallback(() => {
    if (isDirty) {
      if (!window.confirm('변경사항이 저장되지 않았습니다. 닫으시겠습니까?')) {
        return;
      }
    }
    onClose();
  }, [isDirty, onClose]);

  // 로딩 또는 데이터 없음
  if (!donghoId) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          세대 정보
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            세대 정보를 불러오는 중 오류가 발생했습니다.
          </Alert>
        )}

        {formData && !isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 기본 정보 */}
            <SectionBox title="기본 정보">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                <TextField
                  size="small"
                  label="동"
                  value={formData.basic.dong}
                  disabled
                />
                <TextField
                  size="small"
                  label="호"
                  value={formData.basic.ho}
                  disabled
                />
                <TextField
                  size="small"
                  label="타입/평수"
                  value={formData.basic.unit_type || ''}
                  disabled
                />
                <TextField
                  size="small"
                  label="라인"
                  value={formData.basic.ev_lines?.join(', ') || ''}
                  disabled
                />
                <TextField
                  size="small"
                  label="계약자명"
                  value={formData.basic.contractor_name || ''}
                  onChange={handleBasicChange('contractor_name')}
                />
                <TextField
                  size="small"
                  label="연락처"
                  value={formData.basic.contractor_phone || ''}
                  onChange={handleBasicChange('contractor_phone')}
                />
                <TextField
                  size="small"
                  label="계약자 생년월일"
                  type="date"
                  value={formData.basic.contractor_birth || ''}
                  onChange={handleBasicChange('contractor_birth')}
                  InputLabelProps={{ shrink: true }}
                />
                <Box />
                <TextField
                  size="small"
                  label="입주자명"
                  value={formData.basic.resident_name || ''}
                  onChange={handleBasicChange('resident_name')}
                />
                <TextField
                  size="small"
                  label="연락처"
                  value={formData.basic.resident_phone || ''}
                  onChange={handleBasicChange('resident_phone')}
                />
                <TextField
                  size="small"
                  label="입주자 생년월일"
                  type="date"
                  value={formData.basic.resident_birth || ''}
                  onChange={handleBasicChange('resident_birth')}
                  InputLabelProps={{ shrink: true }}
                />
                <Box />
                <TextField
                  size="small"
                  label="회원유형"
                  value={formData.basic.member_type || ''}
                  onChange={handleBasicChange('member_type')}
                />
                {/* 등급 - 숨김 필드 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showLevel ? (
                    <TextField
                      size="small"
                      label="등급"
                      value={formData.basic.level || ''}
                      onChange={handleBasicChange('level')}
                      fullWidth
                    />
                  ) : (
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowLevel(true)}
                    >
                      등급 표시
                    </Button>
                  )}
                </Box>
                <FormControl size="small">
                  <InputLabel>입주형태</InputLabel>
                  <Select
                    value={formData.basic.residence_type || ''}
                    onChange={handleBasicSelectChange('residence_type')}
                    label="입주형태"
                  >
                    <MenuItem value="">선택</MenuItem>
                    {RESIDENCE_TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="입주예정"
                  type="date"
                  value={formData.basic.move_in_date || ''}
                  onChange={handleBasicChange('move_in_date')}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  size="small"
                  label="ID"
                  value={formData.basic.login_id || ''}
                  onChange={handleBasicChange('login_id')}
                />
                <TextField
                  size="small"
                  label="PW"
                  type="password"
                  value={formData.basic.login_pw || ''}
                  onChange={handleBasicChange('login_pw')}
                />
              </Box>
            </SectionBox>

            {/* 사전방문 모드가 아닐 때만 추가 섹션 표시 */}
            {mode === 'full' && (
              <>
                {/* 검침 */}
                <SectionBox title="검침">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    <TextField
                      size="small"
                      label="검침일자"
                      type="date"
                      value={formData.meter_reading.reading_date || ''}
                      onChange={handleMeterReadingChange('reading_date')}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      label="전기"
                      value={formData.meter_reading.electricity || ''}
                      onChange={handleMeterReadingChange('electricity')}
                    />
                    <TextField
                      size="small"
                      label="수도"
                      value={formData.meter_reading.water || ''}
                      onChange={handleMeterReadingChange('water')}
                    />
                    <TextField
                      size="small"
                      label="가스"
                      value={formData.meter_reading.gas || ''}
                      onChange={handleMeterReadingChange('gas')}
                    />
                    <TextField
                      size="small"
                      label="난방"
                      value={formData.meter_reading.heating || ''}
                      onChange={handleMeterReadingChange('heating')}
                    />
                    <TextField
                      size="small"
                      label="온수"
                      value={formData.meter_reading.hot_water || ''}
                      onChange={handleMeterReadingChange('hot_water')}
                    />
                    <TextField
                      size="small"
                      label="담당자"
                      value={formData.meter_reading.manager_name || ''}
                      onChange={handleMeterReadingChange('manager_name')}
                    />
                    <TextField
                      size="small"
                      label="연락처"
                      value={formData.meter_reading.manager_phone || ''}
                      onChange={handleMeterReadingChange('manager_phone')}
                    />
                  </Box>
                </SectionBox>

                {/* 지급/설치품 */}
                <SectionBox title="지급/설치품">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      size="small"
                      label="지급일자"
                      type="date"
                      value={formData.supply.supply_date || ''}
                      onChange={(e) => {
                        setFormData((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            supply: {
                              ...prev.supply,
                              supply_date: e.target.value,
                            },
                          };
                        });
                        setIsDirty(true);
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ width: 200 }}
                    />
                    <FormGroup row>
                      {DEFAULT_SUPPLY_ITEMS.map((item) => (
                        <FormControlLabel
                          key={item}
                          control={
                            <Checkbox
                              checked={formData.supply.supply_items?.includes(item) || false}
                              onChange={handleSupplyItemChange(item)}
                            />
                          }
                          label={item}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </SectionBox>

                {/* 키분출 */}
                <SectionBox title="키분출">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    <TextField
                      size="small"
                      label="지급일자"
                      type="date"
                      value={formData.key_distribution.distribution_date || ''}
                      onChange={handleKeyDistributionChange('distribution_date')}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      label="키불출"
                      value={formData.key_distribution.key_issued || ''}
                      onChange={handleKeyDistributionChange('key_issued')}
                    />
                    <TextField
                      size="small"
                      label="세대키"
                      value={formData.key_distribution.unit_key || ''}
                      onChange={handleKeyDistributionChange('unit_key')}
                    />
                    <TextField
                      size="small"
                      label="공동현관"
                      value={formData.key_distribution.common_entrance || ''}
                      onChange={handleKeyDistributionChange('common_entrance')}
                    />
                    <TextField
                      size="small"
                      label="우편함"
                      value={formData.key_distribution.mailbox || ''}
                      onChange={handleKeyDistributionChange('mailbox')}
                    />
                    <TextField
                      size="small"
                      label="기타"
                      value={formData.key_distribution.etc || ''}
                      onChange={handleKeyDistributionChange('etc')}
                    />
                    <TextField
                      size="small"
                      label="담당자"
                      value={formData.key_distribution.manager_name || ''}
                      onChange={handleKeyDistributionChange('manager_name')}
                    />
                    <TextField
                      size="small"
                      label="연락처"
                      value={formData.key_distribution.manager_phone || ''}
                      onChange={handleKeyDistributionChange('manager_phone')}
                    />
                  </Box>
                </SectionBox>

                {/* 부동산 */}
                <SectionBox title="부동산">
                  {formData.real_estate.agencies.map((agency, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        mb: index < 2 ? 2 : 0,
                      }}
                    >
                      <TextField
                        size="small"
                        label={`업체명${index + 1}`}
                        value={agency.company_name || ''}
                        onChange={handleRealEstateChange(index, 'company_name')}
                      />
                      <TextField
                        size="small"
                        label="담당자명"
                        value={agency.manager_name || ''}
                        onChange={handleRealEstateChange(index, 'manager_name')}
                      />
                      <TextField
                        size="small"
                        label="연락처"
                        value={agency.manager_phone || ''}
                        onChange={handleRealEstateChange(index, 'manager_phone')}
                      />
                    </Box>
                  ))}
                </SectionBox>

                {/* 메모 */}
                <SectionBox title="메모">
                  <TextField
                    size="small"
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.memo || ''}
                    onChange={handleMemoChange}
                    placeholder="특이사항을 입력하세요"
                  />
                </SectionBox>

                {/* 이미지 */}
                <SectionBox title="이미지">
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      드래그 앤 드롭으로 업로드 가능
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (업로드 가능 파일 jpg,gif,png / 최대 크기 10MB)
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small">
                        파일추가
                      </Button>
                    </Box>
                    {/* 업로드된 이미지 목록 */}
                    {formData.images.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {formData.images.map((image) => (
                          <Box
                            key={image.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2">{image.file_name}</Typography>
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </SectionBox>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={updateMutation.isPending}>
          수정
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 섹션 박스 컴포넌트
function SectionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          pb: 0.5,
          borderBottom: '2px solid #1976d2',
          display: 'inline-block',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
