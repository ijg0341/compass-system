/**
 * 통계 > 사전방문 > 방문현황 (CP-SA-05-001)
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
  Chip,
} from '@mui/material';
import { ColumnChart } from '@/src/components/charts/ToastChart';
import { usePrevisitByDong } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';

// 테이블 셀 스타일
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

export default function StatsPrevisitVisit() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = usePrevisitByDong(projectUuid || '');

  // 날짜 목록 추출 (API에서 dates가 객체로 오므로 키 배열로 변환)
  const dateList = useMemo(() => {
    if (!data?.dates) return [];
    if (Array.isArray(data.dates)) return data.dates;
    return Object.keys(data.dates).sort();
  }, [data]);

  // 타입별 차트 데이터 생성
  const chartData = useMemo(() => {
    if (!data?.by_dong) return null;

    const categories: string[] = [];
    const series: { name: string; data: number[] }[] = [];
    const typeMap: Record<string, number[]> = {};

    data.by_dong.forEach((dong) => {
      dong.types.forEach((type) => {
        if (!typeMap[type.unit_type]) {
          typeMap[type.unit_type] = [];
        }
        // total_visit 계산: dates 배열의 total 합산
        const totalVisit = type.dates?.reduce((sum, d) => sum + (d.total || 0), 0) || 0;
        typeMap[type.unit_type].push(totalVisit);
      });
      categories.push(dong.dong);
    });

    Object.entries(typeMap).forEach(([name, typeData]) => {
      series.push({ name, data: typeData });
    });

    return { categories, series };
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
      {/* 요약 카드 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, flex: 1, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            총방문세대수
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {data.visited_households?.toLocaleString() || 0}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            총접수건수
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {data.total_defects?.toLocaleString() || 0}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            평균접수건수
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {data.avg_defects?.toFixed(1) || 0}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            최고건수
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {data.most_visited?.count || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({data.most_visited?.dong || '-'} {data.most_visited?.ho || '-'})
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 150, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            최저건수
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {data.least_visited?.count || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({data.least_visited?.dong || '-'} {data.least_visited?.ho || '-'})
          </Typography>
        </Paper>
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
                동
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                타입
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                총세대수
              </TableCell>
              <TableCell colSpan={3} sx={headerCellSx}>
                분양
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                미분양
              </TableCell>
              {dateList.map((date) => (
                <TableCell key={date} colSpan={2} sx={headerCellSx}>
                  {date.slice(5).replace('-', '/')}
                </TableCell>
              ))}
              <TableCell colSpan={2} sx={headerCellSx}>
                초방
              </TableCell>
              <TableCell colSpan={2} sx={headerCellSx}>
                재방
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                총합계
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                총방문율
              </TableCell>
              <TableCell rowSpan={2} sx={headerCellSx}>
                타입별 통계
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={headerCellSx}>조합</TableCell>
              <TableCell sx={headerCellSx}>일반</TableCell>
              <TableCell sx={headerCellSx}>소계</TableCell>
              {dateList.map((date) => (
                <Fragment key={date}>
                  <TableCell sx={headerCellSx}>초방</TableCell>
                  <TableCell sx={headerCellSx}>재방</TableCell>
                </Fragment>
              ))}
              <TableCell sx={headerCellSx}>소계</TableCell>
              <TableCell sx={headerCellSx}>%</TableCell>
              <TableCell sx={headerCellSx}>소계</TableCell>
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
                    <TableCell sx={cellSx}>{type.sale_union || '-'}</TableCell>
                    <TableCell sx={cellSx}>{type.sale_general || '-'}</TableCell>
                    <TableCell sx={cellSx}>{type.sale_subtotal || '-'}</TableCell>
                    <TableCell sx={cellSx}>{type.unsold || '-'}</TableCell>
                    {dateList.map((date) => {
                      const dateData = type.dates?.find(
                        (d) => d.visit_date === date
                      );
                      return (
                        <Fragment key={date}>
                          <TableCell sx={cellSx}>
                            {dateData?.first_visit || '-'}
                          </TableCell>
                          <TableCell sx={cellSx}>
                            {dateData?.revisit || '-'}
                          </TableCell>
                        </Fragment>
                      );
                    })}
                    <TableCell sx={cellSx}>
                      {type.first_visit_subtotal || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {type.first_visit_rate
                        ? `${type.first_visit_rate.toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {type.revisit_subtotal || '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>
                      {type.total_rate
                        ? `${(type.total_rate - type.first_visit_rate).toFixed(2)}%`
                        : '-'}
                    </TableCell>
                    <TableCell sx={cellSx}>{type.total_visit || '-'}</TableCell>
                    <TableCell sx={cellSx}>
                      {type.total_rate ? `${type.total_rate.toFixed(2)}%` : '-'}
                    </TableCell>
                    <TableCell sx={{ ...cellSx, width: 150 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Chip
                          label={`${type.unit_type} ${type.first_visit_rate?.toFixed(0) || 0}%`}
                          size="small"
                          sx={{ bgcolor: '#f59e0b', color: 'white' }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {/* 동 소계 */}
                <TableRow sx={{ bgcolor: 'action.selected' }}>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>계</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {dong.subtotal?.total_households || '-'}
                  </TableCell>
                  <TableCell colSpan={3} sx={cellSx}>
                    -
                  </TableCell>
                  <TableCell sx={cellSx}>-</TableCell>
                  {dateList.map((date) => (
                    <Fragment key={date}>
                      <TableCell sx={cellSx}>-</TableCell>
                      <TableCell sx={cellSx}>-</TableCell>
                    </Fragment>
                  ))}
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {dong.subtotal?.first_visit_subtotal || '-'}
                  </TableCell>
                  <TableCell sx={cellSx}>-</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {dong.subtotal?.revisit_subtotal || '-'}
                  </TableCell>
                  <TableCell sx={cellSx}>-</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {dong.subtotal?.total_visit || '-'}
                  </TableCell>
                  <TableCell sx={cellSx}>-</TableCell>
                  <TableCell sx={cellSx}>-</TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 타입별 차트 */}
      {chartData && chartData.series.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            동별 타입별 방문 현황
          </Typography>
          <ColumnChart
            data={{
              categories: chartData.categories,
              series: chartData.series,
            }}
            options={{
              chart: { title: '' },
              xAxis: { title: '동' },
              yAxis: { title: '방문 건수' },
              legend: { align: 'bottom' },
              series: { stack: true },
            }}
            height={350}
          />
        </Paper>
      )}
    </Box>
  );
}
