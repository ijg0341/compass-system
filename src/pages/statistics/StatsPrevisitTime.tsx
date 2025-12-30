/**
 * 통계 > 사전방문 > 방문현황 (요일, 시간대별) (CP-SA-05-002)
 */
import { useMemo, Fragment } from 'react';
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
import { usePrevisitByTime } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';

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

const dateCellSx = {
  ...cellSx,
  fontWeight: 600,
  bgcolor: 'action.hover',
};

export default function StatsPrevisitTime() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = usePrevisitByTime(projectUuid || '');

  // 시간대별 방문 데이터 생성 (ColumnChart용)
  const chartData = useMemo(() => {
    if (!data?.by_date?.length || !data?.hours?.length) return null;

    const days = ['월', '화', '수', '목', '금', '토', '일'];

    // 요일별 시간대별 방문 합계 계산
    const dayHourMap: Record<string, Record<number, number>> = {};
    days.forEach((day) => {
      dayHourMap[day] = {};
      data.hours.forEach((hour) => {
        dayHourMap[day][hour] = 0;
      });
    });

    data.by_date.forEach((dateItem) => {
      const dayOfWeek = dateItem.day_of_week || '월';
      dateItem.visit?.forEach((hourItem) => {
        if (dayHourMap[dayOfWeek] && data.hours.includes(hourItem.hour)) {
          dayHourMap[dayOfWeek][hourItem.hour] += hourItem.total;
        }
      });
    });

    // Toast UI ColumnChart series 형식
    const series = days.map((day) => ({
      name: day,
      data: data.hours.map((hour) => dayHourMap[day][hour] || 0),
    }));

    return {
      categories: data.hours.map((h) => `${h}시`),
      series,
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

  const hours = data.hours || [];

  return (
    <Box>
      {/* 테이블 */}
      <TableContainer
        component={Paper}
        sx={{ mb: 3, maxHeight: 500, overflow: 'auto' }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} rowSpan={2} sx={headerCellSx}>
                구분
              </TableCell>
              {hours.map((hour) => (
                <TableCell key={hour} colSpan={2} sx={headerCellSx}>
                  {hour}시
                </TableCell>
              ))}
              <TableCell rowSpan={2} sx={headerCellSx}>
                계
              </TableCell>
            </TableRow>
            <TableRow>
              {hours.map((hour) => (
                <Fragment key={hour}>
                  <TableCell sx={headerCellSx}>초방</TableCell>
                  <TableCell sx={headerCellSx}>재방</TableCell>
                </Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.by_date?.map((dateItem) => (
              <Fragment key={dateItem.date}>
                {/* 예약 */}
                <TableRow>
                  <TableCell rowSpan={3} sx={dateCellSx}>
                    {dateItem.date?.slice(5).replace('-', '/')}
                    <br />({dateItem.day_of_week})
                  </TableCell>
                  <TableCell sx={dateCellSx}>예약</TableCell>
                  {hours.map((hour) => {
                    const hourData = dateItem.reservation?.find(
                      (h) => h.hour === hour
                    );
                    return (
                      <Fragment key={hour}>
                        <TableCell sx={cellSx}>
                          {hourData?.first_visit || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {hourData?.revisit || '-'}
                        </TableCell>
                      </Fragment>
                    );
                  })}
                  <TableCell sx={cellSx}>
                    {dateItem.reservation_total || '-'}
                  </TableCell>
                </TableRow>
                {/* 방문 */}
                <TableRow>
                  <TableCell sx={dateCellSx}>방문</TableCell>
                  {hours.map((hour) => {
                    const hourData = dateItem.visit?.find((h) => h.hour === hour);
                    return (
                      <Fragment key={hour}>
                        <TableCell sx={cellSx}>
                          {hourData?.first_visit || '-'}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {hourData?.revisit || '-'}
                        </TableCell>
                      </Fragment>
                    );
                  })}
                  <TableCell sx={cellSx}>{dateItem.visit_total || '-'}</TableCell>
                </TableRow>
                {/* 계 */}
                <TableRow sx={{ bgcolor: 'action.selected' }}>
                  <TableCell sx={{ ...dateCellSx, fontWeight: 600 }}>계</TableCell>
                  {hours.map((hour) => {
                    const resData = dateItem.reservation?.find(
                      (h) => h.hour === hour
                    );
                    const visData = dateItem.visit?.find((h) => h.hour === hour);
                    const total =
                      (resData?.total || 0) + (visData?.total || 0);
                    return (
                      <Fragment key={hour}>
                        <TableCell colSpan={2} sx={{ ...cellSx, fontWeight: 600 }}>
                          {total || '-'}
                        </TableCell>
                      </Fragment>
                    );
                  })}
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {(dateItem.reservation_total || 0) +
                      (dateItem.visit_total || 0) || '-'}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
            {/* 합계 행 */}
            <TableRow sx={{ bgcolor: 'warning.light' }}>
              <TableCell colSpan={2} sx={{ ...dateCellSx, fontWeight: 700 }}>
                합계
              </TableCell>
              {hours.map((hour) => {
                let totalFirst = 0;
                let totalRevisit = 0;
                data.by_date?.forEach((dateItem) => {
                  const resData = dateItem.reservation?.find(
                    (h) => h.hour === hour
                  );
                  const visData = dateItem.visit?.find((h) => h.hour === hour);
                  totalFirst +=
                    (resData?.first_visit || 0) + (visData?.first_visit || 0);
                  totalRevisit +=
                    (resData?.revisit || 0) + (visData?.revisit || 0);
                });
                return (
                  <Fragment key={hour}>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {totalFirst || '-'}
                    </TableCell>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                      {totalRevisit || '-'}
                    </TableCell>
                  </Fragment>
                );
              })}
              <TableCell sx={{ ...cellSx, fontWeight: 700 }}>
                {data.by_date?.reduce(
                  (sum, d) =>
                    sum + (d.reservation_total || 0) + (d.visit_total || 0),
                  0
                ) || '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 시간대별 방문 차트 */}
      {chartData && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            요일/시간대별 방문 현황
          </Typography>
          <ColumnChart
            data={chartData}
            options={{
              chart: { title: '' },
              xAxis: { title: '시간대' },
              yAxis: { title: '방문 수' },
              legend: { visible: true },
              series: {
                stack: true,
                dataLabels: { visible: false },
              },
            }}
            height={350}
          />
        </Paper>
      )}
    </Box>
  );
}
