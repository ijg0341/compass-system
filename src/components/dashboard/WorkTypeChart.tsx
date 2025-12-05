
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { WorkTypeData } from '@/src/types/dashboard';
import { CHART_TOKENS, COLOR_TOKENS } from '@/src/lib/config/compassTheme';

interface WorkTypeChartProps {
  data: WorkTypeData[];
  title?: string;
}

export default function WorkTypeChart({
  data,
  title = '공종별 처리 현황',
}: WorkTypeChartProps) {
  const workTypes = data.map((item) => item.name);
  const processRates = data.map((item) => item.processRate);

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ width: '100%', height: 350, mt: 2 }}>
          <BarChart
            yAxis={[
              {
                data: workTypes,
                scaleType: 'band',
              },
            ]}
            series={[
              {
                data: processRates,
                label: '처리율 (%)',
                color: 'var(--primary-gradient, #E63C2E)',
              },
            ]}
            layout="horizontal"
            margin={{ top: 10, right: 10, bottom: 30, left: 80 }}
            slotProps={{
              legend: {
                position: { vertical: 'top', horizontal: 'end' },
              },
            }}
            sx={{
              '--primary-gradient': 'url(#barGradient)',
              '.MuiChartsAxis-label': {
                fontSize: CHART_TOKENS.axis.labelFontSize,
              },
              '.MuiChartsAxis-tickLabel': {
                fontSize: CHART_TOKENS.axis.tickFontSize,
              },
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLOR_TOKENS.primary.gradient.dark} />
                <stop offset="50%" stopColor={COLOR_TOKENS.primary.main} />
                <stop offset="100%" stopColor={COLOR_TOKENS.primary.gradient.start} />
              </linearGradient>
            </defs>
          </BarChart>
        </Box>

        {/* 평균 처리시간 표시 */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 1,
          }}
        >
          {data.map((item) => (
            <Box key={item.id} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
              >
                {item.avgProcessTime.toFixed(1)}일
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
