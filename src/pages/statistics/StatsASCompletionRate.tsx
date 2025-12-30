/**
 * 통계 > A/S > 전체 처리율 (CP-SA-05-008)
 */
import { useState, useMemo } from 'react';
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
  Button,
  TextField,
} from '@mui/material';
import { AreaChart } from '@/src/components/charts/ToastChart';
import { useASCompletionRate } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import dayjs from 'dayjs';

const headerCellSx = {
  fontWeight: 600,
  bgcolor: 'action.hover',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  p: 1,
  textAlign: 'center',
  borderRight: '1px solid',
  borderColor: 'divider',
};

const cellSx = {
  fontSize: '0.75rem',
  p: 1,
  textAlign: 'center',
  borderRight: '1px solid',
  borderColor: 'divider',
};

export default function StatsASCompletionRate() {
  const { projectUuid } = useCurrentProject();
  const [dateBegin, setDateBegin] = useState(
    dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  );
  const [dateEnd, setDateEnd] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, isLoading, error, refetch } = useASCompletionRate(
    projectUuid || '',
    {
      date_begin: dateBegin,
      date_end: dateEnd,
    }
  );

  // 영역 차트 데이터
  const chartData = useMemo(() => {
    if (!data?.by_date) return null;

    return {
      categories: data.by_date.map((item) =>
        item.date.slice(5).replace('-', '/')
      ),
      series: [
        {
          name: '접수건수',
          data: data.by_date.map((item) => item.received?.total || 0),
        },
        {
          name: '처리건수',
          data: data.by_date.map((item) => item.completed?.total || 0),
        },
        {
          name: '미처리건수',
          data: data.by_date.map((item) => item.pending?.total || 0),
        },
      ],
    };
  }, [data]);

  const handleSearch = () => {
    refetch();
  };

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
      {/* 필터 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          type="date"
          size="small"
          label="시작일"
          value={dateBegin}
          onChange={(e) => setDateBegin(e.target.value)}
          sx={{ width: 180 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Typography>~</Typography>
        <TextField
          type="date"
          size="small"
          label="종료일"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          sx={{ width: 180 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button variant="contained" onClick={handleSearch}>
          조회
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 테이블 */}
        <Box sx={{ flex: { md: 5 }, minWidth: 0 }}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 500, overflow: 'auto' }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} sx={headerCellSx}>
                    일자
                  </TableCell>
                  <TableCell colSpan={2} sx={headerCellSx}>
                    접수건수
                  </TableCell>
                  <TableCell colSpan={3} sx={headerCellSx}>
                    처리건수
                  </TableCell>
                  <TableCell colSpan={2} sx={headerCellSx}>
                    미처리 건수
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={headerCellSx}>(당일)</TableCell>
                  <TableCell sx={headerCellSx}>%</TableCell>
                  <TableCell sx={headerCellSx}>(전일)</TableCell>
                  <TableCell sx={headerCellSx}>(누계)</TableCell>
                  <TableCell sx={headerCellSx}>%</TableCell>
                  <TableCell sx={headerCellSx}>(누계)</TableCell>
                  <TableCell sx={headerCellSx}>%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.by_date?.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {item.date}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.received?.today || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.received?.rate
                        ? `${item.received.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.completed?.yesterday || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.completed?.total || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.completed?.rate
                        ? `${item.completed.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.pending?.total || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {item.pending?.rate
                        ? `${item.pending.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 영역 차트 */}
        <Box sx={{ flex: { md: 7 }, minWidth: 0 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              일별 접수/처리/미처리 추이
            </Typography>
            {chartData && (
              <AreaChart
                data={chartData}
                options={{
                  chart: { title: '' },
                  xAxis: { title: '날짜' },
                  yAxis: { title: '건수' },
                  legend: { align: 'bottom' },
                  series: {
                    stack: false,
                    spline: true,
                  },
                  theme: {
                    series: {
                      colors: ['#3b82f6', '#22c55e', '#ef4444'],
                    },
                  },
                }}
                height={400}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
