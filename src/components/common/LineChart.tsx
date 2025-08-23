'use client'

import {Line} from "react-chartjs-2";
import {Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend} from 'chart.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Cars-inspired chart options with racing theme
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'center' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 25,
        font: {
          size: 16,
          family: 'Inter, system-ui, sans-serif',
          weight: '600',
        },
        color: '#dc2626',
        generateLabels: function(chart: any) {
          const original = Chart.defaults.plugins.legend.labels.generateLabels;
          const labels = original.call(this, chart);
          
          labels.forEach((label: any) => {
            // Add racing flag emoji to legend
            label.text = `🏎️ ${label.text}`;
          });
          
          return labels;
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(220, 38, 38, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#facc15',
      borderWidth: 2,
      cornerRadius: 12,
      displayColors: true,
      usePointStyle: true,
      padding: 16,
      titleFont: {
        size: 14,
        weight: '600',
      },
      bodyFont: {
        size: 13,
        weight: '500',
      },
      callbacks: {
        title: function(context: any) {
          return `🏁 ${context[0].label}`;
        },
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.y} poäng 🏆`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: 'rgba(249, 115, 22, 0.2)',
        drawBorder: false,
      },
      ticks: {
        color: '#dc2626',
        font: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
          weight: '600',
        },
      },
      title: {
        display: true,
        text: '📅 Datum',
        color: '#dc2626',
        font: {
          size: 14,
          weight: '700',
        },
      },
    },
    y: {
      grid: {
        display: true,
        color: 'rgba(249, 115, 22, 0.2)',
        drawBorder: false,
      },
      ticks: {
        color: '#dc2626',
        font: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
          weight: '600',
        },
        callback: function(value: any) {
          return value + ' pts';
        },
      },
      title: {
        display: true,
        text: '🏆 Totala Poäng',
        color: '#dc2626',
        font: {
          size: 14,
          weight: '700',
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 4,
      borderCapStyle: 'round' as const,
      borderJoinStyle: 'round' as const,
    },
    point: {
      radius: 6,
      hoverRadius: 10,
      borderWidth: 3,
      hoverBorderWidth: 4,
      backgroundColor: '#ffffff',
      borderColor: '#dc2626',
      hoverBorderColor: '#facc15',
      hoverBackgroundColor: '#facc15',
    },
  },
};


export default function LineChart({
  data,
  options,
  height = 300,
}: {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  options?: Partial<typeof defaultOptions>;
  height?: number;
}) {
  // Merge custom options with defaults
  const chartOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options?.plugins,
    },
  };

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <Line
        options={chartOptions}
        data={data}
      />
    </div>
  );
}
