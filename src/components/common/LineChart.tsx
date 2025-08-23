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


export default function LineChart({
  data,
  options,
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
  options: {
    responsive: boolean;
    plugins: {
      legend: { position: "top" };
      title: { display: boolean; text: string };
    };
  };
}) {

  return <Line
      height={250}
      options={options}
      data={data}
  />;
}
