// frontend/src/components/ComparisonChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ComparisonChart = ({ userData, averageData }) => {
  const categories = Object.keys(userData).filter(key => key !== 'total' && key !== 'date');
  
  const chartData = {
    labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        label: 'Your Footprint',
        data: categories.map(cat => userData[cat]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Community Average',
        data: categories.map(cat => averageData[cat]),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
      }
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Your Footprint vs Community Average'
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ComparisonChart;