/**
 * 통계 > 사전방문 > 입주현황 (CP-SA-05-003)
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
import { PieChart, ColumnChart } from '@/src/components/charts/ToastChart';
import { usePrevisitOccupancy } from '@/src/hooks/useStats';
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

export default function StatsPrevisitOccupancy() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = usePrevisitOccupancy(projectUuid || '');

  // 입주형태 도넛 차트 데이터
  const typeChartData = useMemo(() => {
    if (!data?.by_resident_type) return null;

    return {
      categories: ['입주형태'],
      series: data.by_resident_type.map((item) => ({
        name: item.resident_type || '미정',
        data: item.count,
      })),
    };
  }, [data]);

  // 입주시기 막대 차트 데이터
  const monthChartData = useMemo(() => {
    if (!data?.by_resident_month) return null;

    const months = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];

    // 월별 데이터 맵 생성
    const monthMap: Record<string, number> = {};
    months.forEach((month) => {
      monthMap[month] = 0;
    });

    data.by_resident_month.forEach((item) => {
      if (item.resident_month === '미정') {
        return;
      }
      const monthNum = parseInt(item.resident_month.split('-')[1], 10);
      if (monthNum >= 1 && monthNum <= 12) {
        monthMap[months[monthNum - 1]] = item.count;
      }
    });

    return {
      categories: months,
      series: [
        {
          name: '입주시기',
          data: months.map((month) => monthMap[month]),
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

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 입주형태 테이블 및 차트 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              입주형태
            </Typography>
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {data.by_resident_type?.map((item) => (
                      <TableCell key={item.resident_type} sx={headerCellSx}>
                        {item.resident_type || '미정'}
                      </TableCell>
                    ))}
                    <TableCell sx={headerCellSx}>합계</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {data.by_resident_type?.map((item) => (
                      <TableCell key={item.resident_type} sx={cellSx}>
                        {item.count}
                      </TableCell>
                    ))}
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {data.total}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {data.by_resident_type?.map((item) => (
                      <TableCell key={item.resident_type} sx={cellSx}>
                        {item.rate?.toFixed(1)}%
                      </TableCell>
                    ))}
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      100%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {typeChartData && (
              <PieChart
                data={typeChartData}
                options={{
                  chart: { title: '' },
                  legend: { align: 'right' },
                  series: {
                    radiusRange: {
                      inner: '40%',
                      outer: '100%',
                    },
                    dataLabels: {
                      visible: true,
                      pieSeriesName: { visible: true },
                    },
                  },
                }}
                height={300}
              />
            )}
          </Paper>
        </Box>

        {/* 입주시기 테이블 및 차트 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              입주시기
            </Typography>
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {data.by_resident_month
                      ?.filter((item) => item.resident_month !== '미정')
                      .slice(0, 5)
                      .map((item) => (
                        <TableCell
                          key={item.resident_month}
                          sx={headerCellSx}
                        >
                          {item.resident_month === '미정'
                            ? '미정'
                            : `${parseInt(item.resident_month.split('-')[1], 10)}월`}
                        </TableCell>
                      ))}
                    <TableCell sx={headerCellSx}>미정</TableCell>
                    <TableCell sx={headerCellSx}>합계</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {data.by_resident_month
                      ?.filter((item) => item.resident_month !== '미정')
                      .slice(0, 5)
                      .map((item) => (
                        <TableCell key={item.resident_month} sx={cellSx}>
                          {item.count}
                        </TableCell>
                      ))}
                    <TableCell sx={cellSx}>
                      {data.by_resident_month?.find(
                        (item) => item.resident_month === '미정'
                      )?.count || 0}
                    </TableCell>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {data.total}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {data.by_resident_month
                      ?.filter((item) => item.resident_month !== '미정')
                      .slice(0, 5)
                      .map((item) => (
                        <TableCell key={item.resident_month} sx={cellSx}>
                          {item.rate?.toFixed(1)}%
                        </TableCell>
                      ))}
                    <TableCell sx={cellSx}>
                      {data.by_resident_month
                        ?.find((item) => item.resident_month === '미정')
                        ?.rate?.toFixed(1) || 0}
                      %
                    </TableCell>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      100%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {monthChartData && (
              <ColumnChart
                data={monthChartData}
                options={{
                  chart: { title: '' },
                  xAxis: { title: '월' },
                  yAxis: { title: '세대수' },
                  legend: { visible: false },
                  series: {
                    dataLabels: { visible: true },
                  },
                }}
                height={300}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
