// frontend/src/components/CarbonChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const CarbonChart = ({ data }) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: data.map(entry => entry.totalScore),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Carbon Footprint (kg CO2)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Your Carbon Footprint Over Time'
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CarbonChart;