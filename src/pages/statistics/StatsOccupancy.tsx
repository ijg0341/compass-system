/**
 * 통계 > 입주관리 (탭 레이아웃)
 */
import { useState } from 'react';
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

export default function StatsOccupancy() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
