/**
 * 통계 > A/S > 동별 A/S건수 (CP-SA-05-005)
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
import { ColumnChart } from '@/src/components/charts/ToastChart';
import { useASByDong } from '@/src/hooks/useStats';
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

const dongCellSx = {
  ...cellSx,
  fontWeight: 600,
  bgcolor: 'action.hover',
};

export default function StatsASByDong() {
  const { projectUuid } = useCurrentProject();
  const [dateFilter, setDateFilter] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, isLoading, error, refetch } = useASByDong(projectUuid || '', {
    date_end: dateFilter,
  });

  // 차트 데이터 - types 배열에서 합산
  const chartData = useMemo(() => {
    if (!data?.by_dong || data.by_dong.length === 0) return null;

    const categories = data.by_dong.map((dong) => dong.dong);

    // types 배열에서 합산 (subtotal이 없으므로)
    const receivedData = data.by_dong.map((dong) => {
      if (dong.subtotal?.received_total != null) {
        return dong.subtotal.received_total;
      }
      return dong.types?.reduce((sum, t) => sum + (t.received?.total || 0), 0) ?? 0;
    });

    const completedData = data.by_dong.map((dong) => {
      if (dong.subtotal?.completed_total != null) {
        return dong.subtotal.completed_total;
      }
      return dong.types?.reduce((sum, t) => sum + (t.completed?.total || 0), 0) ?? 0;
    });

    return {
      categories,
      series: [
        { name: '접수', data: receivedData },
        { name: '처리', data: completedData },
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 테이블 */}
        <Box>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 500, overflow: 'auto' }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} sx={headerCellSx}>
                    동
                  </TableCell>
                  <TableCell rowSpan={2} sx={headerCellSx}>
                    타입
                  </TableCell>
                  <TableCell rowSpan={2} sx={headerCellSx}>
                    총세대수
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
                  <TableCell sx={headerCellSx}>(누계)</TableCell>
                  <TableCell sx={headerCellSx}>(전일)</TableCell>
                  <TableCell sx={headerCellSx}>(누계)</TableCell>
                  <TableCell sx={headerCellSx}>%</TableCell>
                  <TableCell sx={headerCellSx}>(누계)</TableCell>
                  <TableCell sx={headerCellSx}>%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.by_dong?.map((dong) => (
                  <Fragment key={dong.dong}>
                    {dong.types.map((type, typeIdx) => (
                      <TableRow key={`${dong.dong}-${type.unit_type}`}>
                        {typeIdx === 0 && (
                          <TableCell
                            rowSpan={dong.types.length + 1}
                            sx={dongCellSx}
                          >
                            {dong.dong}
                          </TableCell>
                        )}
                        <TableCell sx={cellSx}>{type.unit_type}</TableCell>
                        <TableCell sx={cellSx}>{type.total_households}</TableCell>
                        <TableCell sx={cellSx}>
                          {type.received?.today || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.received?.total || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.completed?.yesterday || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.completed?.total || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.completed?.rate
                            ? `${type.completed.rate.toFixed(1)}%`
                            : '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.pending?.total || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {type.pending?.rate
                            ? `${type.pending.rate.toFixed(1)}%`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* 동 소계 - types에서 합산 */}
                    {(() => {
                      const totalHouseholds = dong.subtotal?.total_households ?? (dong.types?.reduce((s, t) => s + (t.total_households || 0), 0) || 0);
                      const receivedToday = dong.subtotal?.received_today ?? (dong.types?.reduce((s, t) => s + (t.received?.today || 0), 0) || 0);
                      const receivedTotal = dong.subtotal?.received_total ?? (dong.types?.reduce((s, t) => s + (t.received?.total || 0), 0) || 0);
                      const completedYesterday = dong.subtotal?.completed_yesterday ?? (dong.types?.reduce((s, t) => s + (t.completed?.yesterday || 0), 0) || 0);
                      const completedTotal = dong.subtotal?.completed_total ?? (dong.types?.reduce((s, t) => s + (t.completed?.total || 0), 0) || 0);
                      const completedRate = receivedTotal > 0 ? (completedTotal / receivedTotal) * 100 : 0;
                      const pendingTotal = dong.subtotal?.pending_total ?? (dong.types?.reduce((s, t) => s + (t.pending?.total || 0), 0) || 0);
                      const pendingRate = receivedTotal > 0 ? (pendingTotal / receivedTotal) * 100 : 0;

                      return (
                        <TableRow sx={{ bgcolor: 'action.selected' }}>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>계</TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {totalHouseholds || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {receivedToday || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {receivedTotal || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {completedYesterday || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {completedTotal || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {completedRate > 0 ? `${completedRate.toFixed(1)}%` : '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {pendingTotal || '-'}
                          </TableCell>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                            {pendingRate > 0 ? `${pendingRate.toFixed(1)}%` : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })()}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 차트 */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              동별 접수/처리 현황
            </Typography>
            {chartData && chartData.categories.length > 0 ? (
              <ColumnChart
                data={chartData}
                options={{
                  chart: { title: '' },
                  xAxis: { title: '동', label: { interval: 0 } },
                  yAxis: { title: '건수' },
                  legend: { align: 'bottom' },
                  series: {
                    dataLabels: { visible: false },
                  },
                }}
                height={350}
              />
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">차트 데이터가 없습니다.</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
