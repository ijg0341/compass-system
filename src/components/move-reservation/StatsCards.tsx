
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import {
  EventAvailable,
  Login,
  Logout,
  Cancel,
} from '@mui/icons-material';
import type { MoveReservationStats } from '@/src/types/reservation';

interface StatsCardsProps {
  stats: MoveReservationStats;
}

const CARD_CONFIGS = [
  {
    key: 'total',
    label: '총 예약',
    icon: EventAvailable,
    gradient: 'linear-gradient(90deg, #4FC3F7, #039BE5, #01579B)',
    getValue: (stats: MoveReservationStats) => stats.totalReservations,
  },
  {
    key: 'moveIn',
    label: '입주',
    icon: Login,
    gradient: 'linear-gradient(90deg, #76FF03, #00E676, #00C853)',
    getValue: (stats: MoveReservationStats) => stats.moveInCount,
  },
  {
    key: 'moveOut',
    label: '퇴거',
    icon: Logout,
    gradient: 'linear-gradient(90deg, #FFC947, #FB8C00, #E65100)',
    getValue: (stats: MoveReservationStats) => stats.moveOutCount,
  },
  {
    key: 'cancelled',
    label: '취소',
    icon: Cancel,
    gradient: 'linear-gradient(90deg, #EF5350, #F44336, #D32F2F)',
    getValue: (stats: MoveReservationStats) => stats.cancelledCount,
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {CARD_CONFIGS.map((config) => {
        const Icon = config.icon;
        const value = config.getValue(stats);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={config.key}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: config.gradient,
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {config.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontVariantNumeric: 'tabular-nums',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        fontSize: '1.75rem',
                      }}
                    >
                      {value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Icon
                    sx={{
                      fontSize: 32,
                      color: 'text.secondary',
                      opacity: 0.6,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
