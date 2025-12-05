
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import type { MoveInProgressData } from '@/src/types/dashboard';
import { COLOR_TOKENS } from '@/src/lib/config/compassTheme';

interface MoveInProgressProps {
  data: MoveInProgressData;
  title?: string;
}

export default function MoveInProgress({
  data,
  title = '입주 진행 현황',
}: MoveInProgressProps) {
  const { total, completed, progressRate, checklistSubmitRate, keyHandoverRate } = data;

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 2,
          }}
        >
          {/* 원형 차트 */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'relative', width: 240, height: 240 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: completed, label: '완료', color: 'var(--success-gradient, #43A047)' },
                      {
                        id: 1,
                        value: total - completed,
                        label: '진행중',
                        color: 'var(--neutral-gradient, #E0E0E0)',
                      },
                    ],
                    innerRadius: 65,
                    outerRadius: 100,
                    paddingAngle: 4,
                    cornerRadius: 6,
                    highlightScope: { fade: 'global', highlight: 'item' },
                  },
                ]}
                width={240}
                height={240}
                slots={{
                  legend: () => null,
                }}
                sx={{
                  '--success-gradient': 'url(#successGradient)',
                  '--neutral-gradient': 'url(#neutralGradient)',
                  '.MuiPieArc-root': {
                    strokeWidth: 4,
                    stroke: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                    filter: (theme) => theme.palette.mode === 'light'
                      ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
                      : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      filter: (theme) => theme.palette.mode === 'light'
                        ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))'
                        : 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6))',
                      transform: 'scale(1.08)',
                      strokeWidth: 5,
                    },
                  },
                }}
              >
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={COLOR_TOKENS.success.gradient.start} stopOpacity="1" />
                    <stop offset="30%" stopColor={COLOR_TOKENS.success.main} stopOpacity="0.95" />
                    <stop offset="70%" stopColor={COLOR_TOKENS.success.main} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={COLOR_TOKENS.success.gradient.dark} stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="neutralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FAFAFA" />
                    <stop offset="50%" stopColor="#E0E0E0" />
                    <stop offset="100%" stopColor="#BDBDBD" />
                  </linearGradient>
                </defs>
              </PieChart>

              {/* 중앙 완료율 표시 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    background: `linear-gradient(135deg, ${COLOR_TOKENS.success.gradient.start}, ${COLOR_TOKENS.success.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                  }}
                >
                  {progressRate.toFixed(1)}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  완료율
                </Typography>
              </Box>
            </Box>

            {/* 범례 */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    background: `linear-gradient(135deg, ${COLOR_TOKENS.success.gradient.start}, ${COLOR_TOKENS.success.main})`,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  완료: {completed}세대 ({progressRate.toFixed(1)}%)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    background: 'linear-gradient(135deg, #F5F5F5, #E0E0E0)',
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  진행중: {total - completed}세대 ({(100 - progressRate).toFixed(1)}%)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 통계 정보 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                입주 완료율
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                >
                  {completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / {total} 세대
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 'auto',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'success.main',
                    fontWeight: 600,
                  }}
                >
                  {progressRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressRate}
                sx={{
                  height: 12,
                  borderRadius: 1.5,
                  background: 'linear-gradient(90deg, #F5F5F5, #EEEEEE, #E0E0E0)',
                  overflow: 'hidden',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${COLOR_TOKENS.success.gradient.start} 0%, ${COLOR_TOKENS.success.main} 60%, ${COLOR_TOKENS.success.gradient.dark} 100%)`,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  점검지 제출률
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                >
                  {checklistSubmitRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={checklistSubmitRate}
                sx={{
                  height: 10,
                  borderRadius: 1.5,
                  background: 'linear-gradient(90deg, #F5F5F5, #EEEEEE, #E0E0E0)',
                  overflow: 'hidden',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${COLOR_TOKENS.info.gradient.start} 0%, ${COLOR_TOKENS.info.main} 60%, ${COLOR_TOKENS.info.gradient.dark} 100%)`,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  키불출률
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                >
                  {keyHandoverRate.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={keyHandoverRate}
                sx={{
                  height: 10,
                  borderRadius: 1.5,
                  background: 'linear-gradient(90deg, #F5F5F5, #EEEEEE, #E0E0E0)',
                  overflow: 'hidden',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${COLOR_TOKENS.warning.gradient.start} 0%, ${COLOR_TOKENS.warning.main} 60%, ${COLOR_TOKENS.warning.gradient.dark} 100%)`,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
