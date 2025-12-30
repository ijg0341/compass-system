/**
 * 관리자 전용 모드 네비게이션
 */
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import {
  Campaign,
  Business,
  Apartment,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/authStore';

interface NavItem {
  text: string;
  icon: React.ComponentType;
  path: string;
  requireTopAdmin?: boolean; // A1만 접근 가능
}

const adminMenuItems: NavItem[] = [
  { text: '팝업공지등록', icon: Campaign, path: '/admin/popup-notice' },
  { text: '건설사 관리', icon: Business, path: '/admin/company' },
  { text: '현장 관리', icon: Apartment, path: '/admin/project' },
  { text: '관리자 관리', icon: AdminPanelSettings, path: '/admin/manager', requireTopAdmin: true },
];

export default function SuperAdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const theme = useTheme();
  const { canManageAdmins } = useAuthStore();

  const isTopAdmin = canManageAdmins();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (item: NavItem) => {
    return pathname.startsWith(item.path);
  };

  // A1만 접근 가능한 메뉴 필터링
  const visibleMenuItems = adminMenuItems.filter(
    (item) => !item.requireTopAdmin || isTopAdmin
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      {/* 관리자 전용 네비게이션 바 */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, rgba(237, 108, 2, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(237, 108, 2, 0.15) 0%, rgba(26, 26, 26, 0.9) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid rgba(237, 108, 2, 0.2)'
              : '1px solid rgba(237, 108, 2, 0.3)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 4px 20px rgba(237, 108, 2, 0.1)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '48px !important',
            px: 2,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, minWidth: 'fit-content' }}>
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveItem(item);

              return (
                <Button
                  key={item.text}
                  onClick={() => handleMenuClick(item.path)}
                  startIcon={<Icon />}
                  sx={{
                    color: isActive ? 'warning.dark' : 'text.primary',
                    backgroundColor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(237, 108, 2, 0.2)'
                        : 'rgba(237, 108, 2, 0.1)'
                      : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                    px: 2,
                    py: 0.75,
                    minHeight: 36,
                    borderRadius: 1,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(237, 108, 2, 0.15)'
                        : 'rgba(237, 108, 2, 0.08)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
