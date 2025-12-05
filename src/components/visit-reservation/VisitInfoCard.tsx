
import { Box, Paper, Typography, Chip, IconButton, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import ImageIcon from '@mui/icons-material/Image';
import type { AvailableSlotsResponse } from '@/src/lib/api/reservationApi';

interface VisitInfoCardProps {
  data?: AvailableSlotsResponse;
  isLoading?: boolean;
  onEdit?: () => void;
}

export default function VisitInfoCard({ data, isLoading, onEdit }: VisitInfoCardProps) {
  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Skeleton variant="text" width={200} height={32} />
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography color="text.secondary">
          방문정보가 설정되지 않았습니다.
        </Typography>
      </Paper>
    );
  }

  const formatDate = (dateObj: { date: string }) => {
    return dateObj.date.split(' ')[0]; // "2025-11-27 00:00:00" -> "2025-11-27"
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // "10:00:00" -> "10:00"
  };

  const getTimeUnitLabel = (unit: number) => {
    if (unit === 30) return '30분';
    if (unit === 60) return '1시간';
    if (unit === 90) return '1시간 30분';
    if (unit === 120) return '2시간';
    return `${unit}분`;
  };

  return (
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          방문정보 설정
        </Typography>
        {onEdit && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'text.secondary' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        {/* 방문 기간 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            방문기간
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatDate(data.date_begin)} ~ {formatDate(data.date_end)}
          </Typography>
        </Box>

        {/* 방문 시간 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            방문시간
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(data.time_first)} ~ {formatTime(data.time_last)}
          </Typography>
          <Chip
            label={getTimeUnitLabel(data.time_unit)}
            size="small"
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        </Box>

        {/* 인원 제한 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            타임당 인원
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {data.max_limit > 0 ? `${data.max_limit}명` : '무제한'}
          </Typography>
        </Box>

        {/* 이미지 미리보기 */}
        {data.image_url && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ImageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              이미지
            </Typography>
            <Box
              component="a"
              href={data.image_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#2196F3',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              미리보기
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
