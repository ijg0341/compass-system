/**
 * 통계 > 입주관리 > 세대현황 (CP-SA-05-010)
 */
import { useMemo, useState, Fragment } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHouseholdStatus } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { HouseholdStatusItem } from '@/src/types/stats.types';

// 세대 카드 컴포넌트
function HouseholdCard({
  household,
  onClick,
}: {
  household: HouseholdStatusItem;
  onClick: () => void;
}) {
  const hasData =
    household.meter_date ||
    household.key_date ||
    household.move_date ||
    household.resident_date;

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 1,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: hasData ? 'success.light' : 'divider',
        bgcolor: hasData ? 'success.lighter' : 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
        },
        minWidth: 200,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
        {household.ho}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0.5,
          fontSize: '0.65rem',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            검침
          </Typography>
          <Typography
            variant="caption"
            fontWeight={household.meter_date ? 600 : 400}
            color={household.meter_date ? 'success.main' : 'text.disabled'}
          >
            {household.meter_date
              ? household.meter_date.slice(5).replace('-', '/')
              : '-'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            키불
          </Typography>
          <Typography
            variant="caption"
            fontWeight={household.key_date ? 600 : 400}
            color={household.key_date ? 'success.main' : 'text.disabled'}
          >
            {household.key_date
              ? household.key_date.slice(5).replace('-', '/')
              : '-'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            이사예약
          </Typography>
          <Typography
            variant="caption"
            fontWeight={household.move_date ? 600 : 400}
            color={household.move_date ? 'info.main' : 'text.disabled'}
          >
            {household.move_date
              ? household.move_date.slice(5).replace('-', '/')
              : '-'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            입주
          </Typography>
          <Typography
            variant="caption"
            fontWeight={household.resident_date ? 600 : 400}
            color={household.resident_date ? 'primary.main' : 'text.disabled'}
          >
            {household.resident_date
              ? household.resident_date.slice(5).replace('-', '/')
              : '-'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

// 동별 세대 그리드 컴포넌트
function DongGrid({
  dong,
  lines,
  onHouseholdClick,
}: {
  dong: string;
  lines: HouseholdStatusItem[][];
  onHouseholdClick: (household: HouseholdStatusItem) => void;
}) {
  // 라인별로 정렬 (높은 층부터)
  const sortedLines = useMemo(() => {
    return [...lines].sort((a, b) => {
      const aMaxHo = Math.max(...a.map((h) => parseInt(h.ho) || 0));
      const bMaxHo = Math.max(...b.map((h) => parseInt(h.ho) || 0));
      return bMaxHo - aMaxHo;
    });
  }, [lines]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, textAlign: 'center', bgcolor: 'action.hover', py: 1 }}
      >
        {dong}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sortedLines.map((line, lineIdx) => (
          <Box key={lineIdx} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {line
              .sort((a, b) => parseInt(a.ho) - parseInt(b.ho))
              .map((household) => (
                <HouseholdCard
                  key={household.id}
                  household={household}
                  onClick={() => onHouseholdClick(household)}
                />
              ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// 세대 상세 다이얼로그
function HouseholdDetailDialog({
  open,
  household,
  dong,
  onClose,
}: {
  open: boolean;
  household: HouseholdStatusItem | null;
  dong: string;
  onClose: () => void;
}) {
  if (!household) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        세대 상세 - {dong} {household.ho}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">검침일자</Typography>
            <Typography fontWeight={600}>
              {household.meter_date || '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">키불출일자</Typography>
            <Typography fontWeight={600}>
              {household.key_date || '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">이사예약일</Typography>
            <Typography fontWeight={600}>
              {household.move_date || '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">입주일</Typography>
            <Typography fontWeight={600}>
              {household.resident_date || '-'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function StatsHouseholdStatus() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = useHouseholdStatus(projectUuid || '');
  const [selectedHousehold, setSelectedHousehold] =
    useState<HouseholdStatusItem | null>(null);
  const [selectedDong, setSelectedDong] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleHouseholdClick = (
    household: HouseholdStatusItem,
    dong: string
  ) => {
    setSelectedHousehold(household);
    setSelectedDong(dong);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedHousehold(null);
    setSelectedDong('');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        데이터를 불러오는데 실패했습니다.
      </Alert>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        데이터가 없습니다.
      </Alert>
    );
  }

  const dongs = Object.keys(data).sort((a, b) => {
    const aNum = parseInt(a.replace(/\D/g, '')) || 0;
    const bNum = parseInt(b.replace(/\D/g, '')) || 0;
    return aNum - bNum;
  });

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          '& > *': { flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' }, minWidth: 0 },
        }}
      >
        {dongs.map((dong) => (
          <Box key={dong}>
            <DongGrid
              dong={dong}
              lines={data[dong]}
              onHouseholdClick={(household) =>
                handleHouseholdClick(household, dong)
              }
            />
          </Box>
        ))}
      </Box>

      <HouseholdDetailDialog
        open={dialogOpen}
        household={selectedHousehold}
        dong={selectedDong}
        onClose={handleDialogClose}
      />
    </Box>
  );
}
