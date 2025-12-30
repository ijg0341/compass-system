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
import { HeatmapChart } from '@/src/components/charts/ToastChart';
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

  // 시간대별 방문 데이터 생성 (Toast UI Heatmap용)
  const heatmapData = useMemo(() => {
    if (!data?.by_date?.length || !data?.hours?.length) return null;

    const days = ['일', '월', '화', '수', '목', '금', '토']; // JS Date.getDay() 순서: 0=일, 1=월, ...
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일']; // 표시용

    // 요일별 시간대별 방문 합계 계산
    const dayHourMap: Record<string, number[]> = {};
    dayLabels.forEach((day) => {
      dayHourMap[day] = data.hours.map(() => 0);
    });

    data.by_date.forEach((dateItem) => {
      // date 문자열에서 요일 계산
      const date = new Date(dateItem.date);
      const dayIndex = date.getDay(); // 0=일, 1=월, 2=화, ...
      const dayOfWeek = days[dayIndex];

      dateItem.visit?.forEach((hourItem) => {
        const hourIdx = data.hours.indexOf(hourItem.hour);
        if (dayHourMap[dayOfWeek] && hourIdx >= 0) {
          dayHourMap[dayOfWeek][hourIdx] += hourItem.total;
        }
      });
    });

    // X축: 요일, Y축: 시간대
    // series는 Y축(시간대) 기준으로 각 X축(요일) 값의 배열
    const hourLabels = data.hours.map((h) => `${h}시`);
    const series = data.hours.map((hour, hourIdx) =>
      dayLabels.map((day) => dayHourMap[day][hourIdx])
    );

    return {
      categories: {
        x: dayLabels,
        y: hourLabels,
      },
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

      {/* 시간대별 방문 히트맵 */}
      {heatmapData && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            요일/시간대별 방문 현황
          </Typography>
          <HeatmapChart
            data={heatmapData}
            options={{
              chart: { title: '' },
              xAxis: { title: '요일' },
              yAxis: { title: '시간대' },
              legend: { align: 'right' },
              series: {
                dataLabels: { visible: true },
              },
            }}
            height={400}
          />
        </Paper>
      )}
    </Box>
  );
}
