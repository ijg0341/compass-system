import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '@/src/stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isSubmitting, error, clearError } = useAuthStore();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login({ user_id: userId, password });
    if (success) {
      navigate('/main', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* 로그인 카드 */}
      <Box
        sx={{
          width: 420,
          p: 5,
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* 로고 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src="/images/compass-logo-white.png"
            alt="Compass Logo"
            style={{ height: 48, width: 'auto' }}
          />
        </Box>

        {/* 타이틀 */}
        <Typography
          variant="h6"
          textAlign="center"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          통합 관리 시스템
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            mb: 4,
            color: 'text.secondary',
          }}
        >
          계정 정보를 입력해주세요
        </Typography>

        {/* 에러 메시지 */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(239, 83, 80, 0.1)',
              border: '1px solid rgba(239, 83, 80, 0.3)',
              '& .MuiAlert-icon': {
                color: 'error.main',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* 로그인 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            sx={{ mb: 2 }}
            required
            autoFocus
            disabled={isSubmitting}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            placeholder="아이디를 입력하세요"
          />
          <TextField
            fullWidth
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
            disabled={isSubmitting}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            placeholder="비밀번호를 입력하세요"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '0.9375rem',
            }}
            disabled={isSubmitting || !userId || !password}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>
        </Box>

        {/* 푸터 */}
        <Typography
          variant="caption"
          textAlign="center"
          sx={{
            display: 'block',
            mt: 4,
            color: 'text.disabled',
          }}
        >
          COMPASS 1998
        </Typography>
      </Box>
    </Box>
  );
}
