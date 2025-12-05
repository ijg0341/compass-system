
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import type { KPICardData } from '@/src/types/dashboard';

interface KPICardProps {
  data: KPICardData;
  colorScheme?: 'primary' | 'success' | 'info' | 'warning' | 'purple' | 'pink';
}

const COLOR_SCHEMES = {
  primary: {
    gradient: 'linear-gradient(90deg, #FF6B5B, #E63C2E, #B82818)',
    text: 'linear-gradient(135deg, #E63C2E, #FF6B5B)',
  },
  success: {
    gradient: 'linear-gradient(90deg, #76FF03, #00E676, #00C853)',
    text: 'linear-gradient(135deg, #00E676, #76FF03)',
  },
  info: {
    gradient: 'linear-gradient(90deg, #4FC3F7, #039BE5, #01579B)',
    text: 'linear-gradient(135deg, #039BE5, #4FC3F7)',
  },
  warning: {
    gradient: 'linear-gradient(90deg, #FFC947, #FB8C00, #E65100)',
    text: 'linear-gradient(135deg, #FB8C00, #FFC947)',
  },
  purple: {
    gradient: 'linear-gradient(90deg, #BA68C8, #9C27B0, #7B1FA2)',
    text: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
  },
  pink: {
    gradient: 'linear-gradient(90deg, #F06292, #E91E63, #C2185B)',
    text: 'linear-gradient(135deg, #E91E63, #F06292)',
  },
};

export default function KPICard({ data, colorScheme = 'primary' }: KPICardProps) {
  const { label, value, unit, change } = data;
  const colors = COLOR_SCHEMES[colorScheme];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: colors.gradient,
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {label}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: '1.75rem',
            }}
          >
            {value.toLocaleString()}
          </Typography>
          {unit && (
            <Typography variant="body2" color="text.secondary">
              {unit}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1.5,
          }}
        >
          {change > 0 ? (
            <TrendingUp
              fontSize="small"
              sx={{
                color: 'success.main',
              }}
            />
          ) : (
            <TrendingDown
              fontSize="small"
              sx={{
                color: 'error.main',
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              color: change > 0 ? 'success.main' : 'error.main',
              fontWeight: 500,
            }}
          >
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            전월 대비
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
