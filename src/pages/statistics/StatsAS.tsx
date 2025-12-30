/**
 * 통계 > A/S (탭 레이아웃)
 */
import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import StatsASByDong from './StatsASByDong';
import StatsASByWorkType from './StatsASByWorkType';
import StatsASDetail from './StatsASDetail';
import StatsASCompletionRate from './StatsASCompletionRate';

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

export default function StatsAS() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          통계 &gt; A/S
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
          <Tab label="동별 A/S건수" />
          <Tab label="공종별 A/S건수" />
          <Tab label="상세 A/S건수" />
          <Tab label="전체 처리율" />
        </Tabs>
      </Box>

      {/* 탭 패널 */}
      <TabPanel value={tabValue} index={0}>
        <StatsASByDong />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StatsASByWorkType />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <StatsASDetail />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <StatsASCompletionRate />
      </TabPanel>
    </Box>
  );
}
