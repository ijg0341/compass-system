import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import KPICard from '@/src/components/dashboard/KPICard';
import ASProcessChart from '@/src/components/dashboard/ASProcessChart';
import WorkTypeChart from '@/src/components/dashboard/WorkTypeChart';
import PartnerRankingCard from '@/src/components/dashboard/PartnerRankingCard';
import BuildingHeatmap from '@/src/components/dashboard/BuildingHeatmap';
import MoveInProgress from '@/src/components/dashboard/MoveInProgress';
import RecentRequestsTable from '@/src/components/dashboard/RecentRequestsTable';
import DateRangeFilter from '@/src/components/dashboard/DateRangeFilter';
import type { DateRangeFilter as DateRangeFilterType } from '@/src/types/dashboard';
import {
  mockKPIData,
  mockASProcessData,
  mockWorkTypeData,
  mockBestPartnersData,
  mockWorstPartnersData,
  mockBuildingHeatmapData,
  mockMoveInProgressData,
  mockRecentRequestsData,
  generateASProcessDataByRange,
} from '@/src/lib/mockData/dashboardData';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeFilterType>('30days');

  // 기간에 따른 차트 데이터 생성
  const getChartData = () => {
    switch (dateRange) {
      case '7days':
        return generateASProcessDataByRange(7);
      case '30days':
        return mockASProcessData;
      case 'year':
        return generateASProcessDataByRange(365);
      default:
        return mockASProcessData;
    }
  };

  return (
    <Box>
        {/* 헤더 영역 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            관리자 대시보드
          </Typography>

          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </Box>

        {/* KPI 카드 그리드 (6개) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          {mockKPIData.map((kpi) => {
            // 상승: 녹색, 하락: 빨간색
            const colorScheme = kpi.change > 0 ? 'success' : 'primary';
            return (
              <KPICard
                key={kpi.id}
                data={kpi}
                colorScheme={colorScheme}
              />
            );
          })}
        </Box>

        {/* A/S 처리 현황 차트 */}
        <Box sx={{ mb: 3 }}>
          <ASProcessChart data={getChartData()} />
        </Box>

        {/* 공종별 / 협력사별 그리드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <WorkTypeChart data={mockWorkTypeData} />
          <PartnerRankingCard
            bestPartners={mockBestPartnersData}
            worstPartners={mockWorstPartnersData}
          />
        </Box>

        {/* 동별 히트맵 + 입주 진행률 그리드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <BuildingHeatmap data={mockBuildingHeatmapData} />
          <MoveInProgress data={mockMoveInProgressData} />
        </Box>

        {/* 최근 접수 내역 테이블 */}
        <Box>
          <RecentRequestsTable data={mockRecentRequestsData} />
        </Box>
    </Box>
  );
}
