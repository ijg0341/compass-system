import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import ResidentTab from '@/src/components/user/ResidentTab';
import PartnerTab from '@/src/components/user/PartnerTab';
import ManagerTab from '@/src/components/user/ManagerTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam ? parseInt(tabParam, 10) : 0;
  const [tabIndex, setTabIndex] = useState(initialTab);

  // URL 쿼리 파라미터 변경 시 탭 인덱스 업데이트
  useEffect(() => {
    if (tabParam !== null) {
      const newIndex = parseInt(tabParam, 10);
      if (!isNaN(newIndex) && newIndex >= 0 && newIndex <= 2) {
        setTabIndex(newIndex);
      }
    }
  }, [tabParam]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSearchParams({ tab: String(newValue) });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          사용자 관리
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          입주자, 협력사, 매니저 계정을 관리합니다
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 0,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              minWidth: 120,
            },
          }}
        >
          <Tab label="입주자 관리" />
          <Tab label="협력사 관리" />
          <Tab label="매니저 관리" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabIndex} index={0}>
        <ResidentTab />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <PartnerTab />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ManagerTab />
      </TabPanel>
    </Box>
  );
}
