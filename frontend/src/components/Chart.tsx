'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components with no SSR
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

interface BaseChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
    }>;
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      legend?: {
        position?: 'top' | 'bottom' | 'left' | 'right';
      };
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

interface LineChartProps extends BaseChartProps {
  type: 'line';
}

interface BarChartProps extends BaseChartProps {
  type: 'bar';
}

type ChartComponentProps = LineChartProps | BarChartProps;

export default function ChartComponent({ type, data, options = {} }: ChartComponentProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Chart.js
    const initChart = async () => {
      await import('chart.js/auto');
      setIsInitialized(true);
    };
    initChart();
  }, []);

  if (!isInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const chartOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {type === 'line' ? (
        <Line data={data} options={chartOptions} />
      ) : (
        <Bar data={data} options={chartOptions} />
      )}
    </div>
  );
}