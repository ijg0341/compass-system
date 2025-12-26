/**
 * 하자종류 코드 등록/수정 폼
 * 화면 ID: CP-SA-07-002
 */

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import type { Ascode, Partner } from '@/src/types/afterservice.types';

interface DefectTypeFormProps {
  editingItem: Ascode | null;
  unitTypes: string[];
  partners: Partner[];
  onSubmit: (data: AscodeRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface AscodeRequest {
  type?: string;
  room: string;
  issue_category1: string;
  issue_category2: string;
  issue_type: string;
  work_type1: string;
  work_type2: string;
  project_users_id?: number;
}

const labelCellSx = {
  width: '12%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1.5,
  px: 2,
};

const valueCellSx = {
  width: '38%',
  py: 1,
  px: 1.5,
};

const inputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
  '& .MuiInputBase-input': { py: 1, fontSize: '0.875rem' },
};

export default function DefectTypeForm({
  editingItem,
  unitTypes,
  partners,
  onSubmit,
  onCancel,
  isSubmitting,
}: DefectTypeFormProps) {
  const [formData, setFormData] = useState<AscodeRequest>({
    type: '',
    room: '',
    issue_category1: '',
    issue_category2: '',
    issue_type: '',
    work_type1: '',
    work_type2: '',
    project_users_id: undefined,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || '',
        room: editingItem.room,
        issue_category1: editingItem.issue_category1,
        issue_category2: editingItem.issue_category2,
        issue_type: editingItem.issue_type,
        work_type1: editingItem.work_type1,
        work_type2: editingItem.work_type2,
        project_users_id: editingItem.project_users_id || undefined,
      });
    } else {
      setFormData({
        type: '',
        room: '',
        issue_category1: '',
        issue_category2: '',
        issue_type: '',
        work_type1: '',
        work_type2: '',
        project_users_id: undefined,
      });
    }
  }, [editingItem]);

  const handleChange = (field: keyof AscodeRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof AscodeRequest) => (e: SelectChangeEvent<string | number>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'project_users_id' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingItem) {
      setFormData({
        type: '',
        room: '',
        issue_category1: '',
        issue_category2: '',
        issue_type: '',
        work_type1: '',
        work_type2: '',
        project_users_id: undefined,
      });
    }
  };

  const isValid =
    formData.room.trim() &&
    formData.issue_category1.trim() &&
    formData.issue_category2.trim() &&
    formData.issue_type.trim() &&
    formData.work_type1.trim() &&
    formData.work_type2.trim();

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
        <Table size="small">
          <TableBody>
            {/* 타입/평수, 실명 */}
            <TableRow>
              <TableCell sx={labelCellSx}>타입/평수</TableCell>
              <TableCell sx={valueCellSx}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.type || ''}
                    onChange={handleSelectChange('type')}
                    displayEmpty
                    sx={inputSx}
                  >
                    <MenuItem value="">타입 선택</MenuItem>
                    {unitTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={labelCellSx}>실명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.room}
                  onChange={handleChange('room')}
                  placeholder="실명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
            </TableRow>

            {/* 하자부위명, 하자상세명 */}
            <TableRow>
              <TableCell sx={labelCellSx}>하자부위명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.issue_category1}
                  onChange={handleChange('issue_category1')}
                  placeholder="하자부위명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
              <TableCell sx={labelCellSx}>하자상세명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.issue_category2}
                  onChange={handleChange('issue_category2')}
                  placeholder="하자상세명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
            </TableRow>

            {/* 하자유형명, 협력사 */}
            <TableRow>
              <TableCell sx={labelCellSx}>하자유형명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.issue_type}
                  onChange={handleChange('issue_type')}
                  placeholder="하자유형명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
              <TableCell sx={labelCellSx}>협력사</TableCell>
              <TableCell sx={valueCellSx}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.project_users_id ?? ''}
                    onChange={handleSelectChange('project_users_id')}
                    displayEmpty
                    sx={inputSx}
                  >
                    <MenuItem value="">협력사 선택</MenuItem>
                    {partners.map((partner) => (
                      <MenuItem key={partner.id} value={partner.id}>
                        {partner.company || partner.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* 대공종명, 소공종명 */}
            <TableRow>
              <TableCell sx={labelCellSx}>대공종명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.work_type1}
                  onChange={handleChange('work_type1')}
                  placeholder="대공종명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
              <TableCell sx={labelCellSx}>소공종명 *</TableCell>
              <TableCell sx={valueCellSx}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.work_type2}
                  onChange={handleChange('work_type2')}
                  placeholder="소공종명 입력"
                  sx={inputSx}
                  required
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isSubmitting}
          sx={{ minWidth: 100 }}
        >
          {editingItem ? '수정하기' : '등록하기'}
        </Button>
        {editingItem && (
          <Button variant="outlined" onClick={onCancel} sx={{ minWidth: 80 }}>
            취소
          </Button>
        )}
      </Box>
    </Box>
  );
}
