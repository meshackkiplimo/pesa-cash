'use client';
import { useState } from 'react';
import ChartComponent from '@/components/Chart';

export default function TestChartPage() {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Example',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chart Test</h1>
          <div className="space-x-4">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg ${
                chartType === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Bar Chart
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-[400px]">
            <ChartComponent type={chartType} data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}