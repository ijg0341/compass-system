import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Typography variant="h4" fontWeight={600} color="text.primary">
        관리자 로그인에 성공하였습니다.
      </Typography>
    </Box>
  );
}
