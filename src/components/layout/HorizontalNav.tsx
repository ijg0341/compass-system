
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useTheme,
  Collapse,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Dashboard,
  Home,
  BarChart,
  Forum,
  HowToVote,
  Settings,
  People,
  Language,
  AdminPanelSettings,
  KeyboardArrowDown,
  CalendarMonth,
  Apartment,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMenuStore } from '@/src/stores/menuStore';

interface SubMenuItem {
  text: string;
  path: string;
}

interface NavItem {
  text: string;
  icon: React.ComponentType;
  path: string;
  subMenu?: SubMenuItem[];
}

// 구현된 페이지 목록
const IMPLEMENTED_PAGES = [
  '/main',                  // Dashboard.tsx
  '/pre-visit/register',    // PrevisitRegister.tsx
  '/pre-visit/reservation', // PrevisitReservation.tsx
  '/residence/move',        // ResidenceMove.tsx
  '/residence/as',          // ASManagePage.tsx (A/S 관리)
  '/statistics/as',         // ASManageList.tsx
  '/user',                  // UserManagement.tsx (사용자 관리 - 탭 통합)
  '/user/resident',         // MemberResident.tsx
  '/smartnet/pre-visit',    // PrevisitManage.tsx
  '/smartnet/move',         // SmartnetCreate.tsx
  '/smartnet/vote',         // VoteMeetingCreate.tsx
  '/base-code/dongho',      // BaseCodeManagePage.tsx (동/호 탭)
  '/base-code/defect-type', // BaseCodeManagePage.tsx (하자종류 탭)
  '/vote/meetings',         // VoteMeetingList.tsx
];

const menuItems: NavItem[] = [
  { text: '메인', icon: Dashboard, path: '/main' },
  {
    text: '사전방문',
    icon: CalendarMonth,
    path: '/pre-visit',
    subMenu: [
      { text: '사전방문등록', path: '/pre-visit/register' },
      { text: '사전방문예약', path: '/pre-visit/reservation' },
    ]
  },
  {
    text: '입주관리',
    icon: Home,
    path: '/residence',
    subMenu: [
      { text: '입주방문등록', path: '/residence/visit-register' },
      { text: '이사예약', path: '/residence/move' },
      { text: 'A/S 관리', path: '/residence/as' },
    ]
  },
  {
    text: '세대현황',
    icon: Apartment,
    path: '/units',
    subMenu: [
      { text: '세대목록', path: '/units/list' },
    ]
  },
  {
    text: '통계',
    icon: BarChart,
    path: '/statistics',
    subMenu: [
      { text: '사전방문', path: '/statistics/pre-visit' },
      { text: 'A/S', path: '/statistics/as' },
      { text: '입주관리', path: '/statistics/residence' },
      { text: '현장관리', path: '/statistics/site' },
    ]
  },
  {
    text: '커뮤니티',
    icon: Forum,
    path: '/community',
    subMenu: [
      { text: '공지', path: '/community/notice' },
      { text: '자료실', path: '/community/resources' },
    ]
  },
  {
    text: '기초코드 관리',
    icon: Settings,
    path: '/base-code',
    subMenu: [
      { text: '동/호', path: '/base-code/dongho' },
      { text: '하자종류', path: '/base-code/defect-type' },
    ]
  },
  {
    text: '전자투표',
    icon: HowToVote,
    path: '/vote',
    subMenu: [
      { text: '총회 목록', path: '/vote/meetings' },
    ]
  },
  {
    text: '사용자 관리',
    icon: People,
    path: '/user',
    subMenu: [
      { text: '입주자 관리', path: '/user?tab=0' },
      { text: '협력사 관리', path: '/user?tab=1' },
      { text: '매니저 관리', path: '/user?tab=2' },
    ]
  },
  {
    text: '스마트넷',
    icon: Language,
    path: '/smartnet',
    subMenu: [
      { text: '사전방문 생성', path: '/smartnet/pre-visit' },
      { text: '이사예약 생성', path: '/smartnet/move' },
      { text: '전자투표 생성', path: '/smartnet/vote' },
    ]
  },
  {
    text: '관리자 전용',
    icon: AdminPanelSettings,
    path: '/admin',
    subMenu: [
      { text: '팝업공지등록', path: '/admin/popup-notice' },
      { text: '건설사 관리', path: '/admin/constructor' },
      { text: '현장 관리', path: '/admin/site' },
      { text: '관리자 관리', path: '/admin/manager' },
    ]
  },
];

export default function HorizontalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const theme = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<number>(0);
  const isCompact = useMenuStore((state) => state.isCompact);

  // 토스트 상태
  const [toastOpen, setToastOpen] = useState(false);

  // 페이지 이동 핸들러 (구현 여부 체크)
  const navigateTo = (path: string) => {
    // 쿼리 파라미터 제외한 pathname만 추출
    const pathname = path.split('?')[0];
    if (IMPLEMENTED_PAGES.includes(pathname)) {
      navigate(path);
    } else {
      setToastOpen(true);
    }
  };

  const handleMainMenuClick = (item: NavItem) => {
    if (item.subMenu && item.subMenu.length > 0) {
      // 서브메뉴가 있으면 토글
      setActiveMenu(activeMenu === item.text ? null : item.text);
    } else {
      // 서브메뉴가 없으면 이동 시도
      navigateTo(item.path);
      setActiveMenu(null);
    }
  };

  const handleMainMenuHover = (item: NavItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.subMenu && item.subMenu.length > 0) {
      setActiveMenu(item.text);
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setMenuPosition(rect.left);
    }
  };

  const handleSubMenuClick = (path: string) => {
    navigateTo(path);
  };

  const isActiveItem = (item: NavItem) => {
    if (pathname === item.path) return true;
    if (item.subMenu) {
      return item.subMenu.some(sub => pathname === sub.path);
    }
    return false;
  };

  // 현재 활성화된 메뉴의 서브메뉴 찾기
  const activeMenuItem = menuItems.find(item => item.text === activeMenu);
  const showSubMenu = activeMenuItem && activeMenuItem.subMenu;

  return (
    <>
    <Box
      sx={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* 메인 네비게이션 바 */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 4px 20px rgba(0, 0, 0, 0.06)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '48px !important',
            px: 2,
            gap: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2) transparent'
              : 'rgba(0, 0, 0, 0.2) transparent',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, minWidth: 'fit-content' }}>
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;
            const isMenuOpen = activeMenu === item.text;

            if (isCompact) {
              return (
                <Button
                  key={item.text}
                  onClick={() => handleMainMenuClick(item)}
                  onMouseEnter={(e) => handleMainMenuHover(item, e)}
                  startIcon={<Icon />}
                  sx={{
                    color: isActive || isMenuOpen ? 'primary.main' : 'text.primary',
                    backgroundColor: isActive || isMenuOpen
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)'
                      : 'transparent',
                    borderRadius: 1,
                    minWidth: 'auto',
                    px: 1,
                    py: 0.75,
                    fontSize: '0.875rem',
                    fontWeight: isActive || isMenuOpen ? 600 : 400,
                    textTransform: 'none',
                    overflow: 'hidden',
                    maxWidth: '36px',
                    transition: 'all 0.3s ease',
                    '& .MuiButton-startIcon': {
                      margin: 0,
                      transition: 'all 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                      maxWidth: '200px',
                      px: 1.5,
                      '& .MuiButton-startIcon': {
                        marginRight: '8px',
                      },
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      opacity: 0,
                      maxWidth: 0,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                      '.MuiButton-root:hover &': {
                        opacity: 1,
                        maxWidth: '150px',
                      },
                    }}
                  >
                    {item.text}
                  </Box>
                </Button>
              );
            }

            return (
              <Button
                key={item.text}
                onClick={() => handleMainMenuClick(item)}
                onMouseEnter={(e) => handleMainMenuHover(item, e)}
                startIcon={<Icon />}
                endIcon={hasSubMenu ? <KeyboardArrowDown sx={{ fontSize: 18 }} /> : null}
                sx={{
                  color: isActive || isMenuOpen ? 'primary.main' : 'text.primary',
                  backgroundColor: isActive || isMenuOpen
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)'
                    : 'transparent',
                  fontWeight: isActive || isMenuOpen ? 600 : 400,
                  fontSize: '0.875rem',
                  px: 1.5,
                  py: 0.75,
                  minHeight: 36,
                  borderRadius: 1,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
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

      {/* 서브 메뉴 바 */}
      <Collapse in={!!showSubMenu}>
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: (theme) =>
              theme.palette.mode === 'light'
                ? '1px solid rgba(0, 0, 0, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.1)',
            py: 1,
            position: 'relative',
            minHeight: '48px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              position: 'absolute',
              left: `${menuPosition}px`,
              top: '8px',
              maxWidth: `calc(100% - ${menuPosition}px - 16px)`,
            }}
          >
            {showSubMenu && activeMenuItem.subMenu!.map((subItem) => (
              <Button
                key={subItem.path}
                onClick={() => handleSubMenuClick(subItem.path)}
                size="small"
                sx={{
                  color: pathname === subItem.path ? 'primary.main' : 'text.secondary',
                  backgroundColor: pathname === subItem.path
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)'
                    : 'transparent',
                  fontWeight: pathname === subItem.path ? 600 : 400,
                  fontSize: '0.8125rem',
                  px: 1.5,
                  py: 0.5,
                  minHeight: 32,
                  borderRadius: 1,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {subItem.text}
              </Button>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>

    {/* 제작중 토스트 메시지 - Box 밖에 배치하여 stacking context 분리 */}
    <Snackbar
      open={toastOpen}
      autoHideDuration={2000}
      onClose={() => setToastOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setToastOpen(false)}
        severity="info"
        variant="filled"
        sx={{
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#EDEDED',
          '& .MuiAlert-icon': {
            color: '#E63C2E',
          },
          '& .MuiAlert-action': {
            color: '#B3B3B3',
          },
        }}
      >
        준비중인 페이지입니다.
      </Alert>
    </Snackbar>
    </>
  );
}
