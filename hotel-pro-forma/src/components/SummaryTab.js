import React, { useState } from 'react';
import './SummaryTab.css';

const SummaryTab = ({ data }) => {
  const [activeYear, setActiveYear] = useState(5); // Default to 5-year summary
  
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
      const otherIncomePercent = Math.min(Math.max(Number(otherIncome) || 10, 0), 100); // fallback to 10%

      
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
  
  // Calculate totals for 5-year summary
  const totalRoomRevenue = allYearsMetrics.reduce((sum, metric) => sum + metric.roomRevenue, 0);
  const totalOtherRevenue = allYearsMetrics.reduce((sum, metric) => sum + metric.otherRev, 0);
  const totalRevenue = allYearsMetrics.reduce((sum, metric) => sum + metric.totalRevenue, 0);
  const totalExpenses = allYearsMetrics.reduce((sum, metric) => sum + metric.opCosts, 0);
  const totalNOI = allYearsMetrics.reduce((sum, metric) => sum + metric.netOperatingIncome, 0);
  const avgProfitMargin = totalRevenue > 0 ? (totalNOI / totalRevenue) * 100 : 0;

  // Get metrics for the selected year range
  const getMetricsForYearRange = () => {
    if (activeYear === 5) {
      return {
        roomRevenue: totalRoomRevenue,
        otherRev: totalOtherRevenue,
        totalRevenue: totalRevenue,
        opCosts: totalExpenses,
        netOperatingIncome: totalNOI,
        profitMargin: avgProfitMargin
      };
    } else {
      // Get metrics for the specific year
      const yearMetrics = allYearsMetrics.find(metric => metric.year === activeYear);
      return {
        roomRevenue: yearMetrics.roomRevenue,
        otherRev: yearMetrics.otherRev,
        totalRevenue: yearMetrics.totalRevenue,
        opCosts: yearMetrics.opCosts,
        netOperatingIncome: yearMetrics.netOperatingIncome,
        profitMargin: yearMetrics.profitMargin
      };
    }
  };

  const currentMetrics = getMetricsForYearRange();

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  return (
    <div className="summary-tab">
      <div className="summary-header">
        <h2>Financial Summary</h2>
        <div className="year-selector">
          <button 
            className={`year-button ${activeYear === 1 ? 'active' : ''}`}
            onClick={() => setActiveYear(1)}
          >
            Year 1
          </button>
          <button 
            className={`year-button ${activeYear === 2 ? 'active' : ''}`}
            onClick={() => setActiveYear(2)}
          >
            Year 2
          </button>
          <button 
            className={`year-button ${activeYear === 3 ? 'active' : ''}`}
            onClick={() => setActiveYear(3)}
          >
            Year 3
          </button>
          <button 
            className={`year-button ${activeYear === 4 ? 'active' : ''}`}
            onClick={() => setActiveYear(4)}
          >
            Year 4
          </button>
          <button 
            className={`year-button ${activeYear === 5 ? 'active' : ''}`}
            onClick={() => setActiveYear(5)}
          >
            5-Year Total
          </button>
        </div>
      </div>
      
      <div className="summary-container">
        <div className="summary-item">
          <h3>Room Revenue</h3>
          <p className="summary-value">{formatCurrency(currentMetrics.roomRevenue)}</p>
        </div>
        <div className="summary-item">
          <h3>Other Revenue</h3>
          <p className="summary-value">{formatCurrency(currentMetrics.otherRev)}</p>
        </div>
        <div className="summary-item">
          <h3>Total Revenue</h3>
          <p className="summary-value">{formatCurrency(currentMetrics.totalRevenue)}</p>
        </div>
        <div className="summary-item">
          <h3>Operating Expenses</h3>
          <p className="summary-value">{formatCurrency(currentMetrics.opCosts)}</p>
        </div>
        <div className="summary-item">
          <h3>Net Operating Income</h3>
          <p className="summary-value">{formatCurrency(currentMetrics.netOperatingIncome)}</p>
        </div>
        <div className="summary-item">
          <h3>Profit Margin</h3>
          <p className="summary-value">{formatPercentage(currentMetrics.profitMargin)}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab; 