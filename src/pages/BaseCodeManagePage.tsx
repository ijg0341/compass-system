/**
 * 기초코드관리 페이지
 * 화면 ID: CP-SA-07-001 (동/호), CP-SA-07-002 (하자종류)
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import DonghoManageTab from '@/src/components/base-code/DonghoManageTab';
import DefectTypeManageTab from '@/src/components/base-code/DefectTypeManageTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`basecode-tabpanel-${index}`}
      aria-labelledby={`basecode-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `basecode-tab-${index}`,
    'aria-controls': `basecode-tabpanel-${index}`,
  };
}

export default function BaseCodeManagePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 라우트 경로에 따라 탭 선택
  const getTabFromPath = () => {
    if (location.pathname.includes('defect-type')) return 1;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getTabFromPath());

  // 경로 변경 시 탭 업데이트
  useEffect(() => {
    setTabValue(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    navigate(newValue === 1 ? '/base-code/defect-type' : '/base-code/dongho');
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="기초코드 관리 탭"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.9375rem',
            },
          }}
        >
          <Tab label="동/호" {...a11yProps(0)} />
          <Tab label="하자종류" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <DonghoManageTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <DefectTypeManageTab />
      </TabPanel>
    </Box>
  );
}
