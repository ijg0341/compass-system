/**
 * 통계 > 입주관리 (탭 레이아웃)
 */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import StatsOccupancyRate from './StatsOccupancyRate';
import StatsHouseholdStatus from './StatsHouseholdStatus';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

const TABS = ['rate', 'household'] as const;

export default function StatsOccupancy() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabValue = useMemo(() => {
    const tab = searchParams.get('tab');
    const index = TABS.indexOf(tab as typeof TABS[number]);
    return index >= 0 ? index : 0;
  }, [searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams((prev) => {
      prev.set('tab', TABS[newValue]);
      return prev;
    });
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          통계 &gt; 입주관리
        </Typography>
      </Box>

      {/* 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              minWidth: 120,
            },
          }}
        >
          <Tab label="입주율" />
          <Tab label="세대현황" />
        </Tabs>
      </Box>

      {/* 탭 패널 */}
      <TabPanel value={tabValue} index={0}>
        <StatsOccupancyRate />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StatsHouseholdStatus />
      </TabPanel>
    </Box>
  );
}
