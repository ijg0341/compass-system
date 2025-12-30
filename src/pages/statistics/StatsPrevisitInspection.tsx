/**
 * 통계 > 사전방문 > 점검세대 (CP-SA-05-004)
 */
import { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ColumnChart } from '@/src/components/charts/ToastChart';
import { usePrevisitInspection } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';

const headerCellSx = {
  fontWeight: 600,
  bgcolor: 'action.hover',
  fontSize: '0.8rem',
  p: 1.5,
  textAlign: 'center',
  borderRight: '1px solid',
  borderColor: 'divider',
};

const cellSx = {
  fontSize: '0.8rem',
  p: 1.5,
  textAlign: 'center',
  borderRight: '1px solid',
  borderColor: 'divider',
};

export default function StatsPrevisitInspection() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = usePrevisitInspection(projectUuid || '');

  // 더블 막대 차트 데이터 (방문 vs 제출)
  const chartData = useMemo(() => {
    if (!data?.by_date) return null;

    return {
      categories: data.by_date.map((item) =>
        item.visit_date.slice(5).replace('-', '/')
      ),
      series: [
        {
          name: '방문',
          data: data.by_date.map((item) => item.inspected),
        },
        {
          name: '제출',
          data: data.by_date.map((item) => item.defect_count),
        },
      ],
    };
  }, [data]);

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

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        데이터가 없습니다.
      </Alert>
    );
  }

  // 합계 계산
  const totalInspected =
    data.by_date?.reduce((sum, item) => sum + item.inspected, 0) || 0;
  const totalDefect =
    data.by_date?.reduce((sum, item) => sum + item.defect_count, 0) || 0;
  const avgSubmissionRate =
    totalInspected > 0
      ? ((totalDefect / totalInspected) * 100).toFixed(0)
      : '0';

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 테이블 */}
        <Box sx={{ flex: { md: 5 }, minWidth: 0 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>항목</TableCell>
                  <TableCell sx={headerCellSx}>방문</TableCell>
                  <TableCell sx={headerCellSx}>제출</TableCell>
                  <TableCell sx={headerCellSx}>제출율</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.by_date?.map((item) => (
                  <TableRow key={item.visit_date}>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {item.visit_date.slice(5).replace('-', '/')}
                    </TableCell>
                    <TableCell sx={cellSx}>{item.inspected}</TableCell>
                    <TableCell sx={cellSx}>{item.defect_count}</TableCell>
                    <TableCell sx={cellSx}>
                      {item.submission_rate?.toFixed(0) ||
                        (item.inspected > 0
                          ? (
                              (item.defect_count / item.inspected) *
                              100
                            ).toFixed(0)
                          : 0)}
                      %
                    </TableCell>
                  </TableRow>
                ))}
                {/* 합계 */}
                <TableRow sx={{ bgcolor: 'action.selected' }}>
                  <TableCell sx={{ ...cellSx, fontWeight: 700 }}>합계</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700 }}>
                    {totalInspected}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700 }}>
                    {totalDefect}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700 }}>
                    {avgSubmissionRate}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 차트 */}
        <Box sx={{ flex: { md: 7 }, minWidth: 0 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              일별 방문/제출 현황
            </Typography>
            {chartData && (
              <ColumnChart
                data={chartData}
                options={{
                  chart: { title: '' },
                  xAxis: { title: '날짜' },
                  yAxis: { title: '건수' },
                  legend: { align: 'bottom' },
                  series: {
                    dataLabels: {
                      visible: true,
                      anchor: 'end',
                    },
                  },
                  theme: {
                    series: {
                      colors: ['#3b82f6', '#f59e0b'],
                    },
                  },
                }}
                height={350}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
