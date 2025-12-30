/**
 * 통계 > 입주관리 > 입주율 (CP-SA-05-009)
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
import { PieChart } from '@/src/components/charts/ToastChart';
import { useOccupancyRate } from '@/src/hooks/useStats';
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

const rowHeaderCellSx = {
  ...cellSx,
  fontWeight: 600,
  bgcolor: 'action.hover',
};

export default function StatsOccupancyRate() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = useOccupancyRate(projectUuid || '');

  // 도넛 차트 데이터 생성
  const donutCharts = useMemo(() => {
    if (!data) return null;
    const total = data.total_households || 0;

    const createChartData = (value: number, label: string) => ({
      categories: [label],
      series: [
        { name: label, data: value },
        { name: '미완료', data: Math.max(0, total - value) },
      ],
    });

    return {
      occupied: createChartData(data.occupied_count || 0, '입주'),
      certificate: createChartData(data.certificate_count || 0, '입주증'),
      key: createChartData(data.key_count || 0, '키불출'),
      meter: createChartData(data.meter_count || 0, '검침'),
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

  const total = data.total_households || 0;

  return (
    <Box>
      {/* 도넛 차트들 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          '& > *': { flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 },
        }}
      >
        {donutCharts && (
          <>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                입주
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <PieChart
                  data={donutCharts.occupied}
                  options={{
                    chart: { title: '' },
                    series: {
                      radiusRange: { inner: '75%', outer: '100%' },
                      dataLabels: { visible: false },
                    },
                    legend: { visible: false },
                    theme: { series: { colors: ['#e53935', '#757575'] } },
                  }}
                  height={180}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {data.occupied_count || 0}/{total}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="error.main">
                    {total > 0 ? ((data.occupied_count || 0) / total * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                입주증
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <PieChart
                  data={donutCharts.certificate}
                  options={{
                    chart: { title: '' },
                    series: {
                      radiusRange: { inner: '75%', outer: '100%' },
                      dataLabels: { visible: false },
                    },
                    legend: { visible: false },
                    theme: { series: { colors: ['#e53935', '#757575'] } },
                  }}
                  height={180}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {data.certificate_count || 0}/{total}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="error.main">
                    {total > 0 ? ((data.certificate_count || 0) / total * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                키불출
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <PieChart
                  data={donutCharts.key}
                  options={{
                    chart: { title: '' },
                    series: {
                      radiusRange: { inner: '75%', outer: '100%' },
                      dataLabels: { visible: false },
                    },
                    legend: { visible: false },
                    theme: { series: { colors: ['#e53935', '#757575'] } },
                  }}
                  height={180}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {data.key_count || 0}/{total}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="error.main">
                    {total > 0 ? ((data.key_count || 0) / total * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                검침
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <PieChart
                  data={donutCharts.meter}
                  options={{
                    chart: { title: '' },
                    series: {
                      radiusRange: { inner: '75%', outer: '100%' },
                      dataLabels: { visible: false },
                    },
                    legend: { visible: false },
                    theme: { series: { colors: ['#e53935', '#757575'] } },
                  }}
                  height={180}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {data.meter_count || 0}/{total}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="error.main">
                    {total > 0 ? ((data.meter_count || 0) / total * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </>
        )}
      </Box>

      {/* 상세 테이블 */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx} rowSpan={2}>
                구분
              </TableCell>
              <TableCell sx={headerCellSx} colSpan={2}>
                입주
              </TableCell>
              <TableCell sx={headerCellSx} colSpan={2}>
                입주증
              </TableCell>
              <TableCell sx={headerCellSx} colSpan={2}>
                키불출
              </TableCell>
              <TableCell sx={headerCellSx} colSpan={2}>
                검침(선인수인계)
              </TableCell>
              <TableCell sx={headerCellSx} rowSpan={2}>
                키대여
              </TableCell>
              <TableCell sx={headerCellSx} rowSpan={2}>
                세대방문
              </TableCell>
              <TableCell sx={headerCellSx} rowSpan={2}>
                부동산방문
              </TableCell>
              <TableCell sx={headerCellSx} rowSpan={2}>
                외부 업체
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={headerCellSx}>건수</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>건수</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>건수</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>건수</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 전일 */}
            <TableRow>
              <TableCell sx={rowHeaderCellSx}>전일</TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.occupied || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.occupied_rate
                  ? `${data.list.yesterday.occupied_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.certificate || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.certificate_rate
                  ? `${data.list.yesterday.certificate_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.key || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.key_rate
                  ? `${data.list.yesterday.key_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.meter || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.meter_rate
                  ? `${data.list.yesterday.meter_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.key_rental || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.household_visit || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.agent_visit || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.yesterday?.other_visit || 0}
              </TableCell>
            </TableRow>
            {/* 금일 */}
            <TableRow>
              <TableCell sx={rowHeaderCellSx}>금일</TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.occupied || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.occupied_rate
                  ? `${data.list.today.occupied_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.certificate || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.certificate_rate
                  ? `${data.list.today.certificate_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>{data.list?.today?.key || 0}</TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.key_rate
                  ? `${data.list.today.key_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>{data.list?.today?.meter || 0}</TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.meter_rate
                  ? `${data.list.today.meter_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.key_rental || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.household_visit || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.agent_visit || 0}
              </TableCell>
              <TableCell sx={cellSx}>
                {data.list?.today?.other_visit || 0}
              </TableCell>
            </TableRow>
            {/* 누계 */}
            <TableRow sx={{ bgcolor: 'action.selected' }}>
              <TableCell sx={{ ...rowHeaderCellSx, fontWeight: 700 }}>
                누계
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.occupied || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.occupied_rate
                  ? `${data.list.total.occupied_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.certificate || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.certificate_rate
                  ? `${data.list.total.certificate_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.key || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.key_rate
                  ? `${data.list.total.key_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.meter || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.meter_rate
                  ? `${data.list.total.meter_rate.toFixed(1)}%`
                  : '0%'}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.key_rental || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.household_visit || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.agent_visit || 0}
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {data.list?.total?.other_visit || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
