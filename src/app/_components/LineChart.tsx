'use client'

import {Line} from "react-chartjs-2";
import {CategoryScale, Chart, LinearScale, PointElement, LineElement} from 'chart.js';


export default function LineChart({
  data,
  options,
}: {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: string[];
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
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(PointElement);
  Chart.register(LineElement);


  return <Line
      options={options}
      data={data}
  />;
}
