
import { Grid, Box, Typography, Paper } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import type { VisitReservationStats } from '@/src/types/reservation';

interface StatsCardsProps {
  stats: VisitReservationStats;
}

interface StatCardData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cardData: StatCardData[] = [
    {
      title: '총 예약',
      value: stats.totalReservations,
      icon: <EventAvailableIcon sx={{ fontSize: 32 }} />,
      color: '#2196F3',
    },
    {
      title: '확정',
      value: stats.confirmedCount,
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: '#4CAF50',
    },
    {
      title: '대기중',
      value: stats.pendingCount,
      icon: <PendingIcon sx={{ fontSize: 32 }} />,
      color: '#FF9800',
    },
    {
      title: '취소',
      value: stats.cancelledCount,
      icon: <CancelIcon sx={{ fontSize: 32 }} />,
      color: '#F44336',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cardData.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(26, 26, 26, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {card.value.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  color: card.color,
                  opacity: 0.8,
                }}
              >
                {card.icon}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
