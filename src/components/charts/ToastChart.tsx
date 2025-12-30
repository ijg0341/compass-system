/**
 * Toast UI Chart 래퍼 컴포넌트
 * @toast-ui/chart를 React에서 사용하기 위한 래퍼
 */
import { useEffect, useRef, useState } from 'react';
import Chart from '@toast-ui/chart';
import '@toast-ui/chart/dist/toastui-chart.min.css';

// 차트 타입 정의
type ChartType =
  | 'bar'
  | 'column'
  | 'line'
  | 'area'
  | 'pie'
  | 'radialBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartOptions = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartInstance = any;

// 다크모드 테마 설정
const darkTheme = {
  chart: {
    backgroundColor: 'transparent',
  },
  title: {
    color: '#EDEDED',
  },
  xAxis: {
    title: { color: '#B3B3B3' },
    label: { color: '#B3B3B3' },
    color: 'rgba(255, 255, 255, 0.1)',
  },
  yAxis: {
    title: { color: '#B3B3B3' },
    label: { color: '#B3B3B3' },
    color: 'rgba(255, 255, 255, 0.1)',
  },
  legend: {
    label: { color: '#B3B3B3' },
  },
  plot: {
    vertical: { lineColor: 'rgba(255, 255, 255, 0.1)' },
    horizontal: { lineColor: 'rgba(255, 255, 255, 0.1)' },
  },
  series: {
    colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'],
    dataLabels: { color: '#EDEDED' },
  },
  tooltip: {
    background: 'rgba(26, 26, 26, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    body: { color: '#EDEDED' },
    header: { color: '#EDEDED' },
  },
  exportMenu: {
    button: { backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)' },
    panel: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255, 255, 255, 0.1)' },
  },
};

interface ToastChartProps {
  type: ChartType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  options?: ChartOptions;
  width?: number | string;
  height?: number | string;
}

export default function ToastChart({
  type,
  data,
  options = {},
  width = '100%',
  height = 400,
}: ToastChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 기존 차트 정리
    if (chartRef.current) {
      try {
        chartRef.current.destroy();
      } catch {
        // ignore destroy errors
      }
      chartRef.current = null;
    }

    // 컨테이너 초기화
    el.innerHTML = '';

    const chartOptions = {
      ...options,
      chart: {
        width: typeof width === 'number' ? width : el.clientWidth || 400,
        height: typeof height === 'number' ? height : 400,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...((options as Record<string, any>).chart || {}),
      },
      theme: darkTheme,
    };

    // 약간의 딜레이 후 차트 생성 (DOM 렌더링 대기)
    const timer = setTimeout(() => {
      if (!el || !el.isConnected) return;

      try {
        switch (type) {
          case 'bar':
            chartRef.current = Chart.barChart({ el, data, options: chartOptions });
            break;
          case 'column':
            chartRef.current = Chart.columnChart({ el, data, options: chartOptions });
            break;
          case 'line':
            chartRef.current = Chart.lineChart({ el, data, options: chartOptions });
            break;
          case 'area':
            chartRef.current = Chart.areaChart({ el, data, options: chartOptions });
            break;
          case 'pie':
            chartRef.current = Chart.pieChart({ el, data, options: chartOptions });
            break;
          case 'radialBar':
            chartRef.current = Chart.radialBarChart({ el, data, options: chartOptions });
            break;
        }
      } catch (e) {
        console.warn('Chart creation error:', e);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch {
          // ignore
        }
        chartRef.current = null;
      }
    };
  }, [type, data, options, width, height, chartKey]);

  // 데이터 변경 시 차트 재생성
  useEffect(() => {
    setChartKey((k) => k + 1);
  }, [JSON.stringify(data)]);

  return (
    <div
      ref={containerRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// =============================================================================
// 편의용 컴포넌트들
// =============================================================================

interface BaseChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  options?: ChartOptions;
  width?: number | string;
  height?: number | string;
}

export function BarChart(props: BaseChartProps) {
  return <ToastChart type="bar" {...props} />;
}

export function ColumnChart(props: BaseChartProps) {
  return <ToastChart type="column" {...props} />;
}

export function LineChart(props: BaseChartProps) {
  return <ToastChart type="line" {...props} />;
}

export function AreaChart(props: BaseChartProps) {
  return <ToastChart type="area" {...props} />;
}

export function PieChart(props: BaseChartProps) {
  return <ToastChart type="pie" {...props} />;
}


export function RadialBarChart(props: BaseChartProps) {
  return <ToastChart type="radialBar" {...props} />;
}
