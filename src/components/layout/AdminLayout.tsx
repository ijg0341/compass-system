
import { Box } from '@mui/material';
import HeaderBar from './HeaderBar';
import HorizontalNav from './HorizontalNav';
import SuperAdminNav from './SuperAdminNav';
import PageTransition from '../common/PageTransition';
import PopupNoticeDialog from '../common/PopupNoticeDialog';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useProjectUrlSync } from '@/src/hooks/useProjectUrlSync';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdminMode, projectUuid } = useCurrentProject();

  // URL 동기화 (관리자 페이지 보호 포함)
  useProjectUrlSync();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      {isAdminMode ? <SuperAdminNav /> : <HorizontalNav />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: '112px', // Header(64px) + Nav(48px)
          px: 3,
          py: 2,
          minHeight: 'calc(100vh - 112px)',
          width: '100%',
        }}
      >
        <PageTransition>{children}</PageTransition>
      </Box>

      {/* 팝업공지 다이얼로그 (관리자 모드가 아닐 때만) */}
      {!isAdminMode && <PopupNoticeDialog projectUuid={projectUuid} />}
    </Box>
  );
}
