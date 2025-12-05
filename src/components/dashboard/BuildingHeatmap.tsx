
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { BuildingHeatmapData } from '@/src/types/dashboard';

interface BuildingHeatmapProps {
  data: BuildingHeatmapData[];
  title?: string;
}

export default function BuildingHeatmap({
  data,
  title = '동별 A/S 통계',
}: BuildingHeatmapProps) {
  const getHeatmapGradient = (intensity: number, mode: 'light' | 'dark' = 'light') => {
    // 강도(0-100)에 따라 채도가 달라지는 퍼플/바이올렛 계열 그라데이션 (위에서 아래로)
    if (intensity >= 80) {
      return mode === 'light'
        ? 'linear-gradient(180deg, rgba(156, 39, 176, 0.85) 0%, rgba(123, 31, 162, 0.85) 50%, rgba(106, 27, 154, 0.85) 100%)'
        : 'linear-gradient(180deg, rgba(186, 104, 200, 0.85) 0%, rgba(156, 39, 176, 0.85) 50%, rgba(123, 31, 162, 0.85) 100%)';
    }
    if (intensity >= 60) {
      return mode === 'light'
        ? 'linear-gradient(180deg, rgba(171, 71, 188, 0.85) 0%, rgba(142, 36, 170, 0.85) 50%, rgba(123, 31, 162, 0.85) 100%)'
        : 'linear-gradient(180deg, rgba(206, 147, 216, 0.85) 0%, rgba(171, 71, 188, 0.85) 50%, rgba(142, 36, 170, 0.85) 100%)';
    }
    if (intensity >= 40) {
      return mode === 'light'
        ? 'linear-gradient(180deg, rgba(206, 147, 216, 0.85) 0%, rgba(186, 104, 200, 0.85) 50%, rgba(171, 71, 188, 0.85) 100%)'
        : 'linear-gradient(180deg, rgba(225, 190, 231, 0.85) 0%, rgba(206, 147, 216, 0.85) 50%, rgba(186, 104, 200, 0.85) 100%)';
    }
    if (intensity >= 20) {
      return mode === 'light'
        ? 'linear-gradient(180deg, rgba(225, 190, 231, 0.85) 0%, rgba(206, 147, 216, 0.85) 50%, rgba(186, 104, 200, 0.85) 100%)'
        : 'linear-gradient(180deg, rgba(243, 229, 245, 0.85) 0%, rgba(225, 190, 231, 0.85) 50%, rgba(206, 147, 216, 0.85) 100%)';
    }
    return mode === 'light'
      ? 'linear-gradient(180deg, rgba(243, 229, 245, 0.85) 0%, rgba(225, 190, 231, 0.85) 50%, rgba(206, 147, 216, 0.85) 100%)'
      : 'linear-gradient(180deg, rgba(140, 120, 150, 0.85) 0%, rgba(130, 110, 140, 0.85) 50%, rgba(120, 100, 130, 0.85) 100%)';
  };

  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 1.5,
          }}
        >
          {data.map((building) => (
            <Box
              key={building.building}
              sx={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 1,
                background: (theme) =>
                  getHeatmapGradient(
                    building.intensity,
                    theme.palette.mode
                  ),
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s, filter 0.2s',
                cursor: 'pointer',
                border: 1,
                borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(156, 39, 176, 0.5)' : 'rgba(186, 104, 200, 0.5)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.15)',
                  zIndex: 1,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: building.intensity > 40 ? '#FFFFFF' : 'text.primary',
                }}
              >
                {building.building}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: building.intensity > 40 ? '#FFFFFF' : 'text.primary',
                  }}
                >
                  {building.count}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: building.intensity > 40 ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                  }}
                >
                  건
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* 범례 */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            A/S 건수
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {minCount}
            </Typography>
            <Box
              sx={{
                width: 150,
                height: 14,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(to right, #F3E5F5, #E1BEE7, #CE93D8, #BA68C8, #AB47BC)'
                    : 'linear-gradient(to right, #6A1B9A, #E1BEE7, #CE93D8, #BA68C8, #9C27B0)',
              }}
            />
            <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {maxCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
