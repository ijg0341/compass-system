/**
 * 통계 > 현장관리 대시보드 (CP-SA-05-011)
 */
import { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { LineChart } from '@/src/components/charts/ToastChart';
import { useDashboard } from '@/src/hooks/useStats';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';

// 반원 게이지 카드 컴포넌트 (CSS 기반)
function GaugeCard({
  title,
  value,
  total,
  color = '#3b82f6',
}: {
  title: string;
  value: number;
  total: number;
  color?: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const rotation = (percentage / 100) * 180;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: 100, height: 60, mx: 'auto', mb: 1 }}>
        {/* 배경 반원 */}
        <Box
          sx={{
            position: 'absolute',
            width: 100,
            height: 50,
            borderRadius: '50px 50px 0 0',
            bgcolor: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* 채워지는 부분 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 100,
              height: 100,
              transformOrigin: 'center bottom',
              transform: `translateX(-50%) rotate(${rotation - 180}deg)`,
              background: `conic-gradient(${color} 0deg, ${color} 180deg, transparent 180deg)`,
              borderRadius: '50%',
            }}
          />
        </Box>
        {/* 내부 원 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 70,
            height: 35,
            borderRadius: '35px 35px 0 0',
            bgcolor: 'rgba(255,255,255,0.05)',
          }}
        />
        {/* 텍스트 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ color: 'white', fontSize: '0.75rem' }}>
            {value}/{total}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.65rem' }}>
            {percentage}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: 'grey.400' }}>
        {title}
      </Typography>
    </Box>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  title,
  value,
  subValue,
  color = 'primary.main',
}: {
  title: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ color, mb: 0.5 }}
      >
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary">
          {subValue}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function StatsDashboard() {
  const { projectUuid } = useCurrentProject();
  const { data, isLoading, error } = useDashboard(projectUuid || '');

  // 그래프 데이터 생성
  const dailyChartData = useMemo(() => {
    if (!data?.daily_graph) return null;
    return {
      categories: data.daily_graph.map((item) => item.period),
      series: [
        { name: '접수', data: data.daily_graph.map((item) => item.received) },
        { name: '처리', data: data.daily_graph.map((item) => item.completed) },
      ],
    };
  }, [data]);

  const monthlyChartData = useMemo(() => {
    if (!data?.monthly_graph) return null;
    return {
      categories: data.monthly_graph.map((item) => item.period),
      series: [
        { name: '접수', data: data.monthly_graph.map((item) => item.received) },
        { name: '처리', data: data.monthly_graph.map((item) => item.completed) },
      ],
    };
  }, [data]);

  const yearlyChartData = useMemo(() => {
    if (!data?.yearly_graph) return null;
    return {
      categories: data.yearly_graph.map((item) => item.period),
      series: [
        { name: '접수', data: data.yearly_graph.map((item) => item.received) },
        { name: '처리', data: data.yearly_graph.map((item) => item.completed) },
      ],
    };
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        데이터를 불러오는데 실패했습니다.
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        데이터가 없습니다.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#1a1a2e',
        borderRadius: 2,
        p: 3,
        color: 'white',
        minHeight: '80vh',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 좌측: 입주 현황 게이지 */}
        <Box sx={{ flex: { md: 3 }, minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              height: '100%',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: 'grey.400', mb: 2 }}
            >
              현장명 및 세대수
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <GaugeCard
                title="입주증"
                value={data.summary?.certificate || 0}
                total={data.summary?.total_households || 0}
                color="#ef4444"
              />
              <GaugeCard
                title="검침"
                value={data.summary?.meter || 0}
                total={data.summary?.total_households || 0}
                color="#22c55e"
              />
              <GaugeCard
                title="키분출"
                value={data.summary?.key || 0}
                total={data.summary?.total_households || 0}
                color="#3b82f6"
              />
            </Box>
          </Paper>
        </Box>

        {/* 중앙: 메인 통계 */}
        <Box sx={{ flex: { md: 6 }, minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <StatCard
                  title="입주률"
                  value={`${data.summary?.occupied_rate?.toFixed(0) || 0}%`}
                  subValue={`${data.summary?.occupied || 0}/${data.summary?.total_households || 0}`}
                  color="#ef4444"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StatCard
                  title="접수건수"
                  value={data.summary?.as_received?.toLocaleString() || 0}
                  subValue={`${((data.summary?.as_received || 0) / (data.summary?.total_households || 1) * 100).toFixed(0)}%`}
                  color="#f59e0b"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StatCard
                  title="처리건수"
                  value={data.summary?.as_completed?.toLocaleString() || 0}
                  subValue={`${data.summary?.as_completion_rate?.toFixed(0) || 0}%`}
                  color="#3b82f6"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StatCard
                  title="미처리 건수"
                  value={data.summary?.as_pending?.toLocaleString() || 0}
                  subValue={`${(100 - (data.summary?.as_completion_rate || 0)).toFixed(0)}%`}
                  color="#ef4444"
                />
              </Box>
            </Box>
          </Paper>

          {/* 도넛 차트 (가운데) - CSS 기반 */}
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 280,
            }}
          >
            {(() => {
              const received = data.summary?.as_received || 0;
              const completed = data.summary?.as_completed || 0;
              const pending = data.summary?.as_pending || 0;
              const total = received + completed + pending || 1;
              const receivedDeg = (received / total) * 360;
              const completedDeg = (completed / total) * 360;
              const pendingDeg = (pending / total) * 360;

              return (
                <Box sx={{ position: 'relative', width: 180, height: 180 }}>
                  {/* 도넛 차트 */}
                  <Box
                    sx={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: `conic-gradient(
                        #ef4444 0deg ${receivedDeg}deg,
                        #7c3aed ${receivedDeg}deg ${receivedDeg + completedDeg}deg,
                        #3b82f6 ${receivedDeg + completedDeg}deg ${receivedDeg + completedDeg + pendingDeg}deg
                      )`,
                    }}
                  />
                  {/* 내부 원 (도넛 효과) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: 'rgba(26, 26, 46, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                      {data.summary?.as_completion_rate?.toFixed(0) || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.400' }}>
                      처리율
                    </Typography>
                  </Box>
                </Box>
              );
            })()}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#ef4444', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'grey.400' }}>접수</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#7c3aed', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'grey.400' }}>처리</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#3b82f6', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'grey.400' }}>미처리</Typography>
              </Box>
            </Box>
          </Paper>

          {/* 방문 통계 */}
          <Paper
            sx={{
              p: 2,
              mt: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {data.summary?.today_visit || 0}
              </Typography>
              <Typography variant="caption" color="grey.400">
                일일 방문계
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {data.summary?.total_visit || 0}
              </Typography>
              <Typography variant="caption" color="grey.400">
                누계 방문계
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* 우측: 그래프 목록 */}
        <Box sx={{ flex: { md: 3 }, minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              height: '100%',
            }}
          >
            {/* 년간 그래프 */}
            <Card sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" color="grey.400">
                  년간 별 접수/처리 그래프
                </Typography>
                {yearlyChartData && (
                  <LineChart
                    data={yearlyChartData}
                    options={{
                      chart: { title: '' },
                      legend: { visible: false },
                      exportMenu: { visible: false },
                      xAxis: {
                        label: { interval: 0, margin: 5 },
                        tick: { interval: 0 },
                        title: '',
                      },
                      yAxis: {
                        label: { visible: false },
                        tick: { visible: false },
                        title: '',
                      },
                      series: { spline: true, dataLabels: { visible: false } },
                      plot: { visible: false },
                    }}
                    height={70}
                  />
                )}
              </CardContent>
            </Card>

            {/* 월간 그래프 */}
            <Card sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" color="grey.400">
                  월간 별 접수/처리 그래프
                </Typography>
                {monthlyChartData && (
                  <LineChart
                    data={monthlyChartData}
                    options={{
                      chart: { title: '' },
                      legend: { visible: false },
                      exportMenu: { visible: false },
                      xAxis: {
                        label: { interval: 0, margin: 5 },
                        tick: { interval: 0 },
                        title: '',
                      },
                      yAxis: {
                        label: { visible: false },
                        tick: { visible: false },
                        title: '',
                      },
                      series: { spline: true, dataLabels: { visible: false } },
                      plot: { visible: false },
                    }}
                    height={70}
                  />
                )}
              </CardContent>
            </Card>

            {/* 일간 그래프 */}
            <Card sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" color="grey.400">
                  일간 별 접수/처리 그래프
                </Typography>
                {dailyChartData && (
                  <LineChart
                    data={dailyChartData}
                    options={{
                      chart: { title: '' },
                      legend: { visible: false },
                      exportMenu: { visible: false },
                      xAxis: {
                        label: { interval: 2, margin: 5 },
                        tick: { interval: 2 },
                        title: '',
                      },
                      yAxis: {
                        label: { visible: false },
                        tick: { visible: false },
                        title: '',
                      },
                      series: { spline: true, dataLabels: { visible: false } },
                      plot: { visible: false },
                    }}
                    height={70}
                  />
                )}
              </CardContent>
            </Card>

            {/* 베스트/최저 협력사 */}
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" color="grey.400">
                  베스트 협력사 / 최저 협력사
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {data.best_partners?.slice(0, 2).map((partner, idx) => (
                    <ListItem key={partner.partner_id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${idx + 1}`}
                              size="small"
                              color="success"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="white">
                              {partner.partner_company}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="grey.400">
                            {partner.rate?.toFixed(0)}%
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 0.5, borderColor: 'grey.700' }} />
                  {data.worst_partners?.slice(0, 2).map((partner, idx) => (
                    <ListItem key={partner.partner_id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${idx + 1}`}
                              size="small"
                              color="error"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="white">
                              {partner.partner_company}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="grey.400">
                            {partner.rate?.toFixed(0)}%
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
