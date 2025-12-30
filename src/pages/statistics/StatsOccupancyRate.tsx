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

// 반원 게이지 컴포넌트 (CSS 기반)
function GaugeCard({
  title,
  value,
  total,
  color = '#3b82f6',
}: {
  title: string;
  value: number;
  total: number;
  color?: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  // 반원이므로 180도 기준으로 계산
  const rotation = (percentage / 100) * 180;

  return (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ position: 'relative', width: 140, height: 80, mx: 'auto' }}>
        {/* 배경 반원 */}
        <Box
          sx={{
            position: 'absolute',
            width: 140,
            height: 70,
            borderRadius: '70px 70px 0 0',
            bgcolor: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* 채워지는 부분 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 140,
              height: 140,
              transformOrigin: 'center bottom',
              transform: `translateX(-50%) rotate(${rotation - 180}deg)`,
              background: `conic-gradient(${color} 0deg, ${color} 180deg, transparent 180deg)`,
              borderRadius: '50%',
            }}
          />
        </Box>
        {/* 내부 원 (도넛 효과) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 50,
            borderRadius: '50px 50px 0 0',
            bgcolor: 'background.paper',
          }}
        />
        {/* 텍스트 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 5,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {value}/{total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {percentage}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function StatsOccupancyRate() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = useOccupancyRate(projectUuid || '');

  const gaugeData = useMemo(() => {
    if (!data) return null;
    return {
      occupied: {
        value: data.occupied_count || 0,
        total: data.total_households || 0,
      },
      certificate: {
        value: data.certificate_count || 0,
        total: data.total_households || 0,
      },
      key: {
        value: data.key_count || 0,
        total: data.total_households || 0,
      },
      meter: {
        value: data.meter_count || 0,
        total: data.total_households || 0,
      },
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
      {/* 게이지 차트들 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          '& > *': { flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 150 },
        }}
      >
        <Box>
          <GaugeCard
            title="입주"
            value={gaugeData?.occupied.value || 0}
            total={gaugeData?.occupied.total || 0}
            color="#ef4444"
          />
        </Box>
        <Box>
          <GaugeCard
            title="입주증"
            value={gaugeData?.certificate.value || 0}
            total={gaugeData?.certificate.total || 0}
            color="#f59e0b"
          />
        </Box>
        <Box>
          <GaugeCard
            title="키불출"
            value={gaugeData?.key.value || 0}
            total={gaugeData?.key.total || 0}
            color="#3b82f6"
          />
        </Box>
        <Box>
          <GaugeCard
            title="검침"
            value={gaugeData?.meter.value || 0}
            total={gaugeData?.meter.total || 0}
            color="#22c55e"
          />
        </Box>
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
