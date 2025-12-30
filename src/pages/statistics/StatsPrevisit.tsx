/**
 * 통계 > 사전방문 (탭 레이아웃)
 */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import StatsPrevisitVisit from './StatsPrevisitVisit';
import StatsPrevisitTime from './StatsPrevisitTime';
import StatsPrevisitOccupancy from './StatsPrevisitOccupancy';
import StatsPrevisitInspection from './StatsPrevisitInspection';

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

const TABS = ['visit', 'time', 'occupancy', 'inspection'] as const;

export default function StatsPrevisit() {
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
          통계 &gt; 사전방문
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
          <Tab label="방문현황" />
          <Tab label="방문현황(요일, 시간대별)" />
          <Tab label="입주현황" />
          <Tab label="점검세대" />
        </Tabs>
      </Box>

      {/* 탭 패널 */}
      <TabPanel value={tabValue} index={0}>
        <StatsPrevisitVisit />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StatsPrevisitTime />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <StatsPrevisitOccupancy />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <StatsPrevisitInspection />
      </TabPanel>
    </Box>
  );
}
