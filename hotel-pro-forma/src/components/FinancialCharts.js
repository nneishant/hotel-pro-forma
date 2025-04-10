import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import DownloadButton from './DownloadButton';
import './FinancialCharts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FinancialCharts = ({ data }) => {
  // Calculate metrics for all 5 years
  const calculateAllYearsMetrics = () => {
    const years = [1, 2, 3, 4, 5];
    const metrics = years.map(year => {
      const {
        numberOfRooms,
        averageDailyRate,
        occupancyRate,
        operatingCosts,
        otherIncome,
        growthRates = {},
        expenseBreakdown = {}
      } = data;

      // Convert string inputs to numbers with fallbacks
      const rooms = Math.max(Number(numberOfRooms) || 0, 1);
      const baseAdr = Math.max(Number(averageDailyRate) || 0, 0);
      const baseOccupancy = Math.min(Math.max(Number(occupancyRate) || 0, 0), 100);
      const opCostsPercent = Math.min(Math.max(Number(operatingCosts) || 0, 0), 100);
      const otherIncomePercent = Math.min(Math.max(Number(otherIncome) || 0, 0), 100);
      
      // Safely access growth rates with fallbacks
      const adrGrowth = Math.min(Math.max(Number(growthRates.adr) || 0, 0), 10);
      const occupancyGrowth = Math.min(Math.max(Number(growthRates.occupancy) || 0, 0), 10);
      const expenseGrowth = Math.min(Math.max(Number(growthRates.operatingCosts) || 0, 0), 10);

      // Calculate year-specific values with growth
      const yearIndex = year - 1;
      const adr = baseAdr * Math.pow(1 + adrGrowth / 100, yearIndex);
      const occupancy = Math.min(baseOccupancy * Math.pow(1 + occupancyGrowth / 100, yearIndex), 100);
      
      // Calculate metrics
      const roomRevenue = rooms * 365 * (occupancy / 100) * adr;
      const otherRev = roomRevenue * (otherIncomePercent / 100);
      const totalRevenue = roomRevenue + otherRev;
      
      // Calculate operating costs with expense growth
      const adjustedOpCostsPercent = opCostsPercent * Math.pow(1 + expenseGrowth / 100, yearIndex);
      const opCosts = totalRevenue * (adjustedOpCostsPercent / 100);
      
      // Calculate net operating income and profit margin
      const netOperatingIncome = totalRevenue - opCosts;
      const profitMargin = totalRevenue > 0 ? (netOperatingIncome / totalRevenue) * 100 : 0;

      return {
        year,
        roomRevenue,
        otherRev,
        totalRevenue,
        opCosts,
        netOperatingIncome,
        profitMargin
      };
    });

    return metrics;
  };

  const allYearsMetrics = calculateAllYearsMetrics();
  
  // Prepare data for charts
  const years = allYearsMetrics.map(metric => `Year ${metric.year}`);
  const revenueValues = allYearsMetrics.map(metric => metric.totalRevenue);
  const noiValues = allYearsMetrics.map(metric => metric.netOperatingIncome);
  const profitMarginValues = allYearsMetrics.map(metric => metric.profitMargin);

  // Find min and max values for proper scaling
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);
  const minNOI = Math.min(...noiValues);
  const maxNOI = Math.max(...noiValues);
  const minProfitMargin = Math.min(...profitMarginValues);
  const maxProfitMargin = Math.max(...profitMarginValues);

  // Revenue chart options
  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Revenue Over 5 Years'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        min: Math.max(0, minRevenue * 0.9),
        max: maxRevenue * 1.1
      }
    }
  };

  // NOI chart options
  const noiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Net Operating Income Over 5 Years'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        min: Math.min(0, minNOI * 1.1),
        max: maxNOI * 1.1
      }
    }
  };

  // Profit Margin chart options
  const profitMarginOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Profit Margin Over 5 Years'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toFixed(1) + '%';
          }
        },
        min: Math.max(0, minProfitMargin * 0.9),
        max: maxProfitMargin * 1.1
      }
    }
  };

  const revenueChartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueValues,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const noiChartData = {
    labels: years,
    datasets: [
      {
        label: 'Net Operating Income',
        data: noiValues,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const profitMarginChartData = {
    labels: years,
    datasets: [
      {
        label: 'Profit Margin',
        data: profitMarginValues,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="financial-charts">
      <div className="charts-header">
        <h2>Financial Trends</h2>
        <DownloadButton data={allYearsMetrics} />
      </div>
      <div className="charts-container">
        <div className="chart-wrapper">
          <Bar data={revenueChartData} options={revenueOptions} />
        </div>
        <div className="chart-wrapper">
          <Bar data={noiChartData} options={noiOptions} />
        </div>
        <div className="chart-wrapper">
          <Line data={profitMarginChartData} options={profitMarginOptions} />
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts; 