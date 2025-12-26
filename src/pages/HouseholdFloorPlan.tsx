/**
 * 세대현황 - 현황입면도 페이지
 * 화면 ID: CP-SA-04-002
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import HouseholdDetailModal from '@/src/components/household/HouseholdDetailModal';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useFloorPlan } from '@/src/hooks/useDongho';
import type { FloorPlanHo, DateField } from '@/src/types/dongho.types';
import { extractDateString } from '@/src/types/dongho.types';

// 날짜 포맷팅 (M/D 형식)
function formatDate(date: DateField): string {
  const dateStr = extractDateString(date);
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// 호 셀 컴포넌트
interface HoCellProps {
  ho: FloorPlanHo;
  onClick: (id: number) => void;
}

function HoCell({ ho, onClick }: HoCellProps) {
  return (
    <Box
      onClick={() => onClick(ho.id)}
      sx={{
        cursor: 'pointer',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(0,0,0,0.12)'
            : '1px solid rgba(255,255,255,0.12)',
        borderRadius: 1,
        p: 1,
        minWidth: 140,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, textAlign: 'center' }}>
        {ho.ho}
      </Typography>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ p: 0.25, fontSize: '0.7rem', fontWeight: 500, textAlign: 'center', borderBottom: 'none' }}
            >
              검침
            </TableCell>
            <TableCell
              sx={{ p: 0.25, fontSize: '0.7rem', fontWeight: 500, textAlign: 'center', borderBottom: 'none' }}
            >
              키불
            </TableCell>
            <TableCell
              sx={{ p: 0.25, fontSize: '0.7rem', fontWeight: 500, textAlign: 'center', borderBottom: 'none' }}
            >
              이사예약
            </TableCell>
            <TableCell
              sx={{ p: 0.25, fontSize: '0.7rem', fontWeight: 500, textAlign: 'center', borderBottom: 'none' }}
            >
              입주
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ p: 0.25, fontSize: '0.7rem', textAlign: 'center', borderBottom: 'none' }}>
              {formatDate(ho.meter_date)}
            </TableCell>
            <TableCell sx={{ p: 0.25, fontSize: '0.7rem', textAlign: 'center', borderBottom: 'none' }}>
              {formatDate(ho.key_date)}
            </TableCell>
            <TableCell sx={{ p: 0.25, fontSize: '0.7rem', textAlign: 'center', borderBottom: 'none' }}>
              {formatDate(ho.move_date)}
            </TableCell>
            <TableCell sx={{ p: 0.25, fontSize: '0.7rem', textAlign: 'center', borderBottom: 'none' }}>
              {formatDate(ho.resident_date)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

// 동 블록 컴포넌트
interface DongBlockProps {
  dong: string;
  lines: FloorPlanHo[][];
  onHoClick: (id: number) => void;
}

function DongBlock({ dong, lines, onHoClick }: DongBlockProps) {
  // 가장 긴 라인의 층수 (역순으로 표시하기 위해)
  const maxFloors = Math.max(...lines.map((line) => line.length));

  return (
    <Paper
      sx={{
        p: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        minWidth: 'fit-content',
      }}
    >
      {/* 동 헤더 */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{
          textAlign: 'center',
          py: 1,
          bgcolor: 'action.selected',
          borderRadius: 1,
          mb: 2,
        }}
      >
        {dong}
      </Typography>

      {/* 호 그리드: 세로로 층, 가로로 라인 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* 각 층을 위에서 아래로 (높은 층부터) */}
        {Array.from({ length: maxFloors }, (_, floorIndex) => {
          const floor = maxFloors - floorIndex - 1; // 역순
          return (
            <Box key={floor} sx={{ display: 'flex', gap: 1 }}>
              {lines.map((line, lineIndex) => {
                const ho = line[floor];
                if (!ho) {
                  // 빈 셀
                  return <Box key={lineIndex} sx={{ minWidth: 140 }} />;
                }
                return <HoCell key={ho.id} ho={ho} onClick={onHoClick} />;
              })}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

export default function HouseholdFloorPlan() {
  const { projectUuid, hasProject } = useCurrentProject();
  const { data, isLoading } = useFloorPlan(projectUuid);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 동 목록 정렬
  const sortedDongs = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [data]);

  const handleHoClick = (id: number) => {
    setSelectedHouseholdId(id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedHouseholdId(null);
  };

  if (!hasProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>프로젝트를 선택해주세요.</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          현황입면도
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          동별 세대 현황을 입면도 형태로 확인합니다.
        </Typography>
      </Box>

      {/* 동 블록들 (가로 스크롤 가능) */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'action.hover',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.disabled',
            borderRadius: 4,
            '&:hover': {
              bgcolor: 'action.active',
            },
          },
        }}
      >
        {sortedDongs.map((dong) => (
          <DongBlock
            key={dong}
            dong={dong}
            lines={data![dong]}
            onHoClick={handleHoClick}
          />
        ))}
        {sortedDongs.length === 0 && (
          <Typography color="text.secondary">
            동호 데이터가 없습니다.
          </Typography>
        )}
      </Box>

      {/* 세대정보 상세 모달 */}
      <HouseholdDetailModal
        open={modalOpen}
        onClose={handleModalClose}
        householdId={selectedHouseholdId}
      />
    </Box>
  );
}
