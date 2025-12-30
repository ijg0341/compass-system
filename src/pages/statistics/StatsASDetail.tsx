/**
 * 통계 > A/S > 상세 A/S건수 (CP-SA-05-007)
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
import { useASDetail } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import type { ASDetailWorkType2, ASDetailIssueType } from '@/src/types/stats.types';
import dayjs from 'dayjs';

const headerCellSx = {
  fontWeight: 600,
  bgcolor: 'action.hover',
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
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

const rankCellSx = {
  ...cellSx,
  fontWeight: 700,
  bgcolor: 'action.hover',
};

export default function StatsASDetail() {
  const { projectUuid } = useCurrentProject();
  const [dateBegin, setDateBegin] = useState(
    dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  );
  const [dateEnd, setDateEnd] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, isLoading, error, refetch } = useASDetail(projectUuid || '', {
    date_begin: dateBegin,
    date_end: dateEnd,
  });

  const handleSearch = () => {
    refetch();
  };

  // 소공종별 차트 데이터 생성
  const getChartData = (workType2: ASDetailWorkType2 | undefined) => {
    if (!workType2?.issue_types) return null;

    return {
      categories: workType2.issue_types.map((it: ASDetailIssueType) => it.issue_type),
      series: [
        {
          name: 'A/S 건수',
          data: workType2.issue_types.map((it: ASDetailIssueType) => it.count),
        },
      ],
    };
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

      {/* 테이블 및 차트 */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>순위</TableCell>
              <TableCell sx={headerCellSx}>공종</TableCell>
              <TableCell sx={headerCellSx}>하자유형</TableCell>
              <TableCell sx={headerCellSx}>A/S 건수</TableCell>
              <TableCell sx={headerCellSx}>비율</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>그래프</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.by_work_type2?.map((workType2) => (
              <Fragment key={workType2.work_type2}>
                {workType2.issue_types?.map((issueType, idx) => (
                  <TableRow key={`${workType2.work_type2}-${issueType.issue_type}`}>
                    {idx === 0 && (
                      <>
                        <TableCell
                          rowSpan={workType2.issue_types.length}
                          sx={rankCellSx}
                        >
                          {workType2.rank}
                        </TableCell>
                        <TableCell
                          rowSpan={workType2.issue_types.length}
                          sx={{ ...cellSx, fontWeight: 600 }}
                        >
                          {workType2.work_type2}
                        </TableCell>
                      </>
                    )}
                    <TableCell sx={cellSx}>{issueType.issue_type}</TableCell>
                    <TableCell sx={cellSx}>{issueType.count}</TableCell>
                    <TableCell sx={cellSx}>
                      {issueType.rate?.toFixed(2)}%
                    </TableCell>
                    {idx === 0 && (
                      <TableCell
                        rowSpan={workType2.issue_types.length}
                        sx={{ p: 1, verticalAlign: 'middle' }}
                      >
                        {(() => {
                          const chartData = getChartData(workType2);
                          return chartData ? (
                            <ColumnChart
                              data={chartData}
                              options={{
                                chart: { title: '' },
                                legend: { visible: false },
                                exportMenu: { visible: false },
                                xAxis: { label: { interval: 0 } },
                              }}
                              height={150}
                            />
                          ) : null;
                        })()}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
