import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import { Notifications, AccountCircle, Business } from '@mui/icons-material';
import { useMenuStore } from '@/src/stores/menuStore';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { useProjectUrlSync } from '@/src/hooks/useProjectUrlSync';

export default function HeaderBar() {
  const { isCompact, setIsCompact } = useMenuStore();
  const { projects, projectUuid, projectName } = useCurrentProject();
  const { switchProject } = useProjectUrlSync();

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    switchProject(event.target.value);
  };

  const hasMultipleProjects = projects.length > 1;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ height: 64, minHeight: 64 }}>
        {/* 로고 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, height: 40 }}>
          <img
            src="/images/compass-logo-white.png"
            alt="Compass Logo"
            style={{ height: '36px', width: 'auto' }}
          />
        </Box>

        {/* 프로젝트 선택 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Business fontSize="small" sx={{ color: 'text.secondary' }} />
          {hasMultipleProjects ? (
            <Select
              value={projectUuid}
              onChange={handleProjectChange}
              size="small"
              variant="standard"
              sx={{
                minWidth: 180,
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                },
                '&:before, &:after': {
                  display: 'none',
                },
              }}
            >
              {projects.map((p) => (
                <MenuItem key={p.uuid} value={p.uuid}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {projectName || '프로젝트 없음'}
            </Typography>
          )}
        </Box>

        {/* 우측 컨트롤 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 메뉴 축소 스위치 */}
          <FormControlLabel
            control={
              <Switch
                checked={isCompact}
                onChange={(e) => setIsCompact(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                메뉴 축소
              </Typography>
            }
            sx={{ mr: 1 }}
          />

          {/* 알림 */}
          <Tooltip title="알림">
            <IconButton color="inherit" size="small">
              <Badge badgeContent={3} color="error">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* 사용자 정보 */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
              관리자님
            </Typography>
            <IconButton color="inherit" size="small">
              <AccountCircle fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
