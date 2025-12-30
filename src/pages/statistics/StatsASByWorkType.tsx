/**
 * 통계 > A/S > 공종별 A/S건수 (CP-SA-05-006)
 */
import { useState, useMemo, Fragment } from 'react';
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
import { BarChart } from '@/src/components/charts/ToastChart';
import { useASByWorkType } from '@/src/hooks/useStats';
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

const workTypeCellSx = {
  ...cellSx,
  fontWeight: 600,
  bgcolor: 'action.hover',
};

export default function StatsASByWorkType() {
  const { projectUuid } = useCurrentProject();
  const [dateFilter, setDateFilter] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, isLoading, error, refetch } = useASByWorkType(projectUuid || '', {
    date_end: dateFilter,
  });

  // 수평 막대 차트 데이터
  const chartData = useMemo(() => {
    if (!data?.by_work_type) return null;

    const categories: string[] = [];
    const receivedData: number[] = [];
    const completedData: number[] = [];
    const pendingData: number[] = [];

    data.by_work_type.forEach((workType) => {
      workType.work_type2_list?.forEach((wt2) => {
        categories.push(`${workType.work_type1} - ${wt2.work_type2}`);
        receivedData.push(wt2.received?.today || 0);
        completedData.push(wt2.completed?.total || 0);
        pendingData.push(wt2.pending?.total || 0);
      });
    });

    return {
      categories,
      series: [
        { name: '접수', data: receivedData },
        { name: '처리', data: completedData },
        { name: '미처리', data: pendingData },
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
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          sx={{ width: 180 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          조회
        </Button>
      </Box>

      {/* 테이블 */}
      <TableContainer
        component={Paper}
        sx={{ mb: 3, maxHeight: 500, overflow: 'auto' }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={headerCellSx}>
                대공종
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                소공종
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                협력사
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
              <TableCell sx={headerCellSx}>(금일)</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>(전일)</TableCell>
              <TableCell sx={headerCellSx}>(누계)</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>(누계)</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.by_work_type?.map((workType) => (
              <Fragment key={workType.work_type1}>
                {workType.work_type2_list?.map((wt2, idx) => (
                  <TableRow key={`${workType.work_type1}-${wt2.work_type2}`}>
                    {idx === 0 && (
                      <TableCell
                        rowSpan={workType.work_type2_list.length + 1}
                        sx={workTypeCellSx}
                      >
                        {workType.work_type1}
                      </TableCell>
                    )}
                    <TableCell sx={cellSx}>{wt2.work_type2}</TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.partner_company || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.received?.today || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.received?.rate
                        ? `${wt2.received.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.completed?.yesterday || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.completed?.total || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.completed?.rate
                        ? `${wt2.completed.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.pending?.total || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {wt2.pending?.rate
                        ? `${wt2.pending.rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {/* 대공종 소계 */}
                <TableRow sx={{ bgcolor: 'action.selected' }}>
                  <TableCell colSpan={2} sx={{ ...cellSx, fontWeight: 600 }}>
                    계
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.received_today || '-'}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.received_rate
                      ? `${workType.subtotal.received_rate.toFixed(2)}%`
                      : '100%'}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>-</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.completed_total || '-'}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.completed_rate
                      ? `${workType.subtotal.completed_rate.toFixed(2)}%`
                      : '100%'}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.pending_total || '-'}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {workType.subtotal?.pending_rate
                      ? `${workType.subtotal.pending_rate.toFixed(2)}%`
                      : '100%'}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 수평 막대 차트 */}
      {chartData && chartData.categories.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            공종별 접수/처리/미처리 현황
          </Typography>
          <BarChart
            data={chartData}
            options={{
              chart: { title: '' },
              xAxis: { title: '건수' },
              yAxis: { title: '공종' },
              legend: { align: 'bottom' },
              series: {
                stack: true,
              },
              theme: {
                series: {
                  colors: ['#3b82f6', '#22c55e', '#f59e0b'],
                },
              },
            }}
            height={Math.max(350, chartData.categories.length * 40)}
          />
        </Paper>
      )}
    </Box>
  );
}
