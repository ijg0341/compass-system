
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import {
  People,
  Block,
  PersonOff,
} from '@mui/icons-material';
import type { MemberStats } from '@/src/types/member';

interface StatsCardsProps {
  stats: MemberStats;
}

const CARD_CONFIGS = [
  {
    key: 'total',
    label: '총 회원수',
    icon: People,
    gradient: 'linear-gradient(90deg, #4FC3F7, #039BE5, #01579B)',
    getValue: (stats: MemberStats) => stats.totalMembers,
  },
  {
    key: 'blocked',
    label: '차단 회원수',
    icon: Block,
    gradient: 'linear-gradient(90deg, #EF5350, #F44336, #D32F2F)',
    getValue: (stats: MemberStats) => stats.blockedMembers,
  },
  {
    key: 'withdrawn',
    label: '탈퇴 회원수',
    icon: PersonOff,
    gradient: 'linear-gradient(90deg, #9E9E9E, #757575, #616161)',
    getValue: (stats: MemberStats) => stats.withdrawnMembers,
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {CARD_CONFIGS.map((config) => {
        const Icon = config.icon;
        const value = config.getValue(stats);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={config.key}>
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
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {config.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontVariantNumeric: 'tabular-nums',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        fontSize: '1rem',
                      }}
                    >
                      {value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Icon
                    sx={{
                      fontSize: 24,
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
