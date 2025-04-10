import React, { useState } from 'react';
import './SummaryTable.css';

const SummaryTable = ({ data }) => {
  const [activeYear, setActiveYear] = useState(1);
  
  const calculateMetrics = (year) => {
    // Default values for missing or invalid data
    const defaultGrowthRates = {
      adr: 0,
      occupancy: 0,
      operatingCosts: 0
    };

    const defaultExpenseBreakdown = {
      rooms: 25,
      fAndB: 25,
      adminAndGeneral: 15,
      salesAndMarketing: 10,
      propertyOperations: 15,
      utilities: 10
    };

    // Safely extract data with fallbacks
    const {
      numberOfRooms = '',
      averageDailyRate = '',
      occupancyRate = '',
      operatingCosts = '',
      growthRates = defaultGrowthRates,
      expenseBreakdown = defaultExpenseBreakdown
    } = data || {};

    // Validate and convert inputs to numbers with fallbacks
    const rooms = Math.max(Number(numberOfRooms) || 0, 1);
    const baseAdr = Math.max(Number(averageDailyRate) || 0, 0);
    const baseOccupancy = Math.min(Math.max(Number(occupancyRate) || 0, 0), 100);
    const opCostsPercent = Math.min(Math.max(Number(operatingCosts) || 0, 0), 100);
    
    // Safely access growth rates with fallbacks
    const adrGrowth = Math.min(Math.max(Number(growthRates.adr) || 0, 0), 10);
    const occupancyGrowth = Math.min(Math.max(Number(growthRates.occupancy) || 0, 0), 10);
    const expenseGrowth = Math.min(Math.max(Number(growthRates.operatingCosts) || 0, 0), 10);

    // Calculate year-specific values with growth
    const yearIndex = year - 1;
    const adr = baseAdr * Math.pow(1 + adrGrowth / 100, yearIndex);
    const occupancy = Math.min(baseOccupancy * Math.pow(1 + occupancyGrowth / 100, yearIndex), 100);
    
    // Calculate metrics
    const roomRevenue = rooms * adr * (occupancy / 100) * 365;
    const otherRev = roomRevenue * 0.1; // Assuming 10% other revenue
    const totalRevenue = roomRevenue + otherRev;
    const opCosts = totalRevenue * (opCostsPercent / 100) * Math.pow(1 + expenseGrowth / 100, yearIndex);
    const netOperatingIncome = totalRevenue - opCosts;
    const profitMargin = totalRevenue > 0 ? (netOperatingIncome / totalRevenue) * 100 : 0;
    const revPAR = totalRevenue / (rooms * 365);
    const occupiedRooms = Math.round(rooms * (occupancy / 100) * 365);

    // Safely access expense breakdown with fallbacks
    const payroll = opCosts * ((expenseBreakdown.rooms || 0) / 100);
    const utilities = opCosts * ((expenseBreakdown.utilities || 0) / 100);
    const marketing = opCosts * ((expenseBreakdown.salesAndMarketing || 0) / 100);
    const maintenance = opCosts * ((expenseBreakdown.propertyOperations || 0) / 100);

    // Calculate year-over-year changes
    const prevYearIndex = Math.max(0, yearIndex - 1);
    const prevAdr = baseAdr * Math.pow(1 + adrGrowth / 100, prevYearIndex);
    const prevOccupancy = Math.min(baseOccupancy * Math.pow(1 + occupancyGrowth / 100, prevYearIndex), 100);
    const prevRoomRevenue = rooms * prevAdr * (prevOccupancy / 100) * 365;
    const otherIncomePercent = Math.max(Number(data.otherIncome) || 0, 0);
    const prevOtherRev = prevRoomRevenue * (otherIncomePercent / 100);
    const prevTotalRevenue = prevRoomRevenue + prevOtherRev;
    const prevOpCosts = prevTotalRevenue * (opCostsPercent / 100) * Math.pow(1 + expenseGrowth / 100, prevYearIndex);
    const prevNetOperatingIncome = prevTotalRevenue - prevOpCosts;
    const prevRevPAR = prevTotalRevenue / (rooms * 365);
    const prevOccupiedRooms = Math.round(rooms * (prevOccupancy / 100) * 365);

    // Calculate previous year expenses breakdown
    const prevPayroll = prevOpCosts * ((expenseBreakdown.rooms || 0) / 100);
    const prevUtilities = prevOpCosts * ((expenseBreakdown.utilities || 0) / 100);
    const prevMarketing = prevOpCosts * ((expenseBreakdown.salesAndMarketing || 0) / 100);
    const prevMaintenance = prevOpCosts * ((expenseBreakdown.propertyOperations || 0) / 100);

    // Calculate growth rates
    const adrGrowthRate = year > 1 ? ((adr - prevAdr) / prevAdr) * 100 : 0;
    const occupancyGrowthRate = year > 1 ? ((occupancy - prevOccupancy) / prevOccupancy) * 100 : 0;
    const revenueGrowthRate = year > 1 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
    const noiGrowthRate = year > 1 ? ((netOperatingIncome - prevNetOperatingIncome) / prevNetOperatingIncome) * 100 : 0;
    const revPARGrowthRate = year > 1 ? ((revPAR - prevRevPAR) / prevRevPAR) * 100 : 0;
    const occupiedRoomsGrowthRate = year > 1 ? ((occupiedRooms - prevOccupiedRooms) / prevOccupiedRooms) * 100 : 0;
    
    // Calculate expenses growth rates
    const payrollGrowthRate = year > 1 ? ((payroll - prevPayroll) / prevPayroll) * 100 : 0;
    const utilitiesGrowthRate = year > 1 ? ((utilities - prevUtilities) / prevUtilities) * 100 : 0;
    const marketingGrowthRate = year > 1 ? ((marketing - prevMarketing) / prevMarketing) * 100 : 0;
    const maintenanceGrowthRate = year > 1 ? ((maintenance - prevMaintenance) / prevMaintenance) * 100 : 0;

    // Format numbers with proper decimal places
    const formatNumber = (num) => {
      if (isNaN(num)) return '0.00';
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const formatPercent = (num) => {
      if (isNaN(num)) return '0.0';
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
    };

    const formatGrowth = (num) => {
      if (isNaN(num)) return '0.0%';
      const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
      return `${formatted}%`;
    };

    const formatWholeNumber = (num) => {
      if (isNaN(num)) return '0';
      return num.toLocaleString('en-US', {
        maximumFractionDigits: 0
      });
    };

    return {
      adr: formatNumber(adr),
      occupancy: formatPercent(occupancy),
      roomRevenue: formatNumber(roomRevenue),
      otherRevenue: formatNumber(otherRev),
      totalRevenue: formatNumber(totalRevenue),
      operatingCosts: formatNumber(opCosts),
      netOperatingIncome: formatNumber(netOperatingIncome),
      profitMargin: formatPercent(profitMargin),
      revPAR: formatNumber(revPAR),
      occupiedRooms: formatWholeNumber(occupiedRooms),
      adrGrowth: formatGrowth(adrGrowthRate),
      occupancyGrowth: formatGrowth(occupancyGrowthRate),
      revenueGrowth: formatGrowth(revenueGrowthRate),
      noiGrowth: formatGrowth(noiGrowthRate),
      revPARGrowth: formatGrowth(revPARGrowthRate),
      occupiedRoomsGrowth: formatGrowth(occupiedRoomsGrowthRate),
      // Expenses breakdown
      payroll: formatNumber(payroll),
      utilities: formatNumber(utilities),
      marketing: formatNumber(marketing),
      maintenance: formatNumber(maintenance),
      payrollGrowth: formatGrowth(payrollGrowthRate),
      utilitiesGrowth: formatGrowth(utilitiesGrowthRate),
      marketingGrowth: formatGrowth(marketingGrowthRate),
      maintenanceGrowth: formatGrowth(maintenanceGrowthRate)
    };
  };

  const metrics = calculateMetrics(activeYear);

  return (
    <div className="summary-table">
      <h2>Financial Summary - Year {activeYear}</h2>
      
      <div className="year-tabs">
        {[1, 2, 3, 4, 5].map(year => (
          <button 
            key={year}
            className={`year-tab ${activeYear === year ? 'active' : ''}`}
            onClick={() => setActiveYear(year)}
          >
            Year {year}
          </button>
        ))}
      </div>
      
      <div className="metrics-container">
        <div className="metrics-section">
          <h3>Key Performance Indicators</h3>
          <table>
            <tbody>
              <tr>
                <td>Average Daily Rate (ADR)</td>
                <td>${metrics.adr}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.adrGrowth}</td>}
              </tr>
              <tr>
                <td>Occupancy Rate</td>
                <td>{metrics.occupancy}%</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.occupancyGrowth}</td>}
              </tr>
              <tr>
                <td>Revenue Per Available Room (RevPAR)</td>
                <td>${metrics.revPAR}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.revPARGrowth}</td>}
              </tr>
              <tr>
                <td>Occupied Rooms</td>
                <td>{metrics.occupiedRooms}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.occupiedRoomsGrowth}</td>}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="metrics-section">
          <h3>Revenue Breakdown</h3>
          <table>
            <tbody>
              <tr>
                <td>Room Revenue</td>
                <td>${metrics.roomRevenue}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.revenueGrowth}</td>}
              </tr>
              <tr>
                <td>Other Revenue</td>
                <td>${metrics.otherRevenue}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.revenueGrowth}</td>}
              </tr>
              <tr>
                <td>Total Revenue</td>
                <td>${metrics.totalRevenue}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.revenueGrowth}</td>}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="metrics-section">
          <h3>Profitability</h3>
          <table>
            <tbody>
              <tr>
                <td>Operating Costs</td>
                <td>${metrics.operatingCosts}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.revenueGrowth}</td>}
              </tr>
              <tr>
                <td>Net Operating Income</td>
                <td>${metrics.netOperatingIncome}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.noiGrowth}</td>}
              </tr>
              <tr>
                <td>Profit Margin</td>
                <td>{metrics.profitMargin}%</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.noiGrowth}</td>}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="metrics-section">
          <h3>Expenses Breakdown</h3>
          <table>
            <tbody>
              <tr>
                <td>Payroll</td>
                <td>${metrics.payroll}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.payrollGrowth}</td>}
              </tr>
              <tr>
                <td>Utilities</td>
                <td>${metrics.utilities}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.utilitiesGrowth}</td>}
              </tr>
              <tr>
                <td>Marketing</td>
                <td>${metrics.marketing}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.marketingGrowth}</td>}
              </tr>
              <tr>
                <td>Maintenance</td>
                <td>${metrics.maintenance}</td>
                {activeYear > 1 && <td className="growth-cell">{metrics.maintenanceGrowth}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryTable; 