
import { Box } from '@mui/material';
import HeaderBar from './HeaderBar';
import HorizontalNav from './HorizontalNav';
import PageTransition from '../common/PageTransition';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      <HorizontalNav />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: '112px', // Header(64px) + HorizontalNav(48px)
          padding: 2,
          minHeight: 'calc(100vh - 112px)',
          width: '100%',
        }}
      >
        <PageTransition>{children}</PageTransition>
      </Box>
    </Box>
  );
}
