
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import type { ASProcessData } from '@/src/types/dashboard';
import { CHART_TOKENS, COLOR_TOKENS } from '@/src/lib/config/compassTheme';

interface ASProcessChartProps {
  data: ASProcessData;
  title?: string;
}

export default function ASProcessChart({
  data,
  title = 'A/S 처리 현황',
}: ASProcessChartProps) {
  const { labels, received, processed } = data;

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <LineChart
            xAxis={[
              {
                data: labels.map((_, index) => index),
                scaleType: 'point',
                valueFormatter: (value) => labels[value],
              },
            ]}
            series={[
              {
                data: received,
                label: '접수건수',
                color: 'var(--primary-gradient, #E63C2E)',
                curve: 'monotoneX',
                showMark: false,
                area: true,
              },
              {
                data: processed,
                label: '처리건수',
                color: 'var(--info-gradient, #039BE5)',
                curve: 'monotoneX',
                showMark: false,
                area: true,
              },
            ]}
            margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
            slotProps={{
              legend: {
                position: { vertical: 'top', horizontal: 'end' },
              },
            }}
            sx={{
              '--primary-gradient': 'url(#primaryGradient)',
              '--info-gradient': 'url(#infoGradient)',
              '.MuiChartsAxis-label': {
                fontSize: CHART_TOKENS.axis.labelFontSize,
              },
              '.MuiChartsAxis-tickLabel': {
                fontSize: CHART_TOKENS.axis.tickFontSize,
              },
              '.MuiLineElement-root': {
                strokeWidth: 3,
              },
              '.MuiAreaElement-root': {
                fillOpacity: 0.2,
              },
            }}
          >
            <defs>
              <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={COLOR_TOKENS.primary.gradient.start} />
                <stop offset="50%" stopColor={COLOR_TOKENS.primary.main} />
                <stop offset="100%" stopColor={COLOR_TOKENS.primary.gradient.dark} />
              </linearGradient>
              <linearGradient id="infoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={COLOR_TOKENS.info.gradient.start} />
                <stop offset="50%" stopColor={COLOR_TOKENS.info.main} />
                <stop offset="100%" stopColor={COLOR_TOKENS.info.gradient.dark} />
              </linearGradient>
            </defs>
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  );
}
