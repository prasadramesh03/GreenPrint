// frontend/src/components/__tests__/CarbonChart.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CarbonChart from '../CarbonChart';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Mocked Chart</div>
}));

describe('CarbonChart Component', () => {
  const mockData = [
    { date: '2025-03-01', totalScore: 120 },
    { date: '2025-03-05', totalScore: 110 },
    { date: '2025-03-10', totalScore: 100 }
  ];

  test('renders the chart component', () => {
    render(<CarbonChart data={mockData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});