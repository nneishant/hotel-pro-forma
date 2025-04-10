import React, { useState, useEffect } from 'react';
import './InputPanel.css';
import { FaHotel, FaMoneyBillWave, FaChartLine, FaUsers, FaPercent, FaExclamationTriangle } from 'react-icons/fa';

const InputPanel = ({ inputs, setInputs }) => {
  const [expenseError, setExpenseError] = useState('');

  useEffect(() => {
    const total = Object.entries(inputs)
      .filter(([key]) => key.endsWith('Percent'))
      .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);

    if (total !== 100) {
      setExpenseError(`Total must equal 100% (current: ${total}%)`);
    } else {
      setExpenseError('');
    }
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetExpenseBreakdown = () => {
    const defaultValues = {
      payrollPercent: '50',
      utilitiesPercent: '20',
      marketingPercent: '15',
      maintenancePercent: '15'
    };
    setInputs(prev => ({
      ...prev,
      ...defaultValues
    }));
  };

  return (
    <div className="input-panel">
      <div className="input-grid">
        <div className="input-card">
          <div className="input-icon">
            <FaHotel />
          </div>
          <div className="input-content">
            <label>Number of Rooms</label>
            <input
              type="number"
              name="numberOfRooms"
              value={inputs.numberOfRooms}
              onChange={handleChange}
              placeholder="Enter number of rooms"
            />
          </div>
        </div>

        <div className="input-card">
          <div className="input-icon">
            <FaMoneyBillWave />
          </div>
          <div className="input-content">
            <label>Average Daily Rate ($)</label>
            <input
              type="number"
              name="averageDailyRate"
              value={inputs.averageDailyRate}
              onChange={handleChange}
              placeholder="Enter ADR"
            />
          </div>
        </div>

        <div className="input-card">
          <div className="input-icon">
            <FaUsers />
          </div>
          <div className="input-content">
            <label>Occupancy Rate (%)</label>
            <input
              type="number"
              name="occupancyRate"
              value={inputs.occupancyRate}
              onChange={handleChange}
              placeholder="Enter occupancy rate"
            />
          </div>
        </div>

        <div className="input-card">
          <div className="input-icon">
            <FaPercent />
          </div>
          <div className="input-content">
            <label>Operating Costs (%)</label>
            <input
              type="number"
              name="operatingCosts"
              value={inputs.operatingCosts}
              onChange={handleChange}
              placeholder="Enter operating costs"
            />
          </div>
        </div>

        <div className="input-card">
          <div className="input-icon">
            <FaMoneyBillWave />
          </div>
          <div className="input-content">
            <label>Other Revenue (%)</label>
            <input
              type="number"
              name="otherIncome"
              value={inputs.otherIncome}
              onChange={handleChange}
              placeholder="Enter other revenue percentage"
            />
          </div>
        </div>
      </div>

      <div className="expense-breakdown-section">
        <h3>Expense Breakdown</h3>
        <div className="expense-breakdown-grid">
          <div className="expense-card">
            <div className="expense-icon">
              <FaUsers />
            </div>
            <div className="expense-content">
              <label>Payroll (%)</label>
              <input
                type="number"
                name="payrollPercent"
                value={inputs.payrollPercent}
                onChange={handleChange}
                placeholder="50"
              />
            </div>
          </div>

          <div className="expense-card">
            <div className="expense-icon">
              <FaMoneyBillWave />
            </div>
            <div className="expense-content">
              <label>Utilities (%)</label>
              <input
                type="number"
                name="utilitiesPercent"
                value={inputs.utilitiesPercent}
                onChange={handleChange}
                placeholder="20"
              />
            </div>
          </div>

          <div className="expense-card">
            <div className="expense-icon">
              <FaChartLine />
            </div>
            <div className="expense-content">
              <label>Marketing (%)</label>
              <input
                type="number"
                name="marketingPercent"
                value={inputs.marketingPercent}
                onChange={handleChange}
                placeholder="15"
              />
            </div>
          </div>

          <div className="expense-card">
            <div className="expense-icon">
              <FaHotel />
            </div>
            <div className="expense-content">
              <label>Maintenance (%)</label>
              <input
                type="number"
                name="maintenancePercent"
                value={inputs.maintenancePercent}
                onChange={handleChange}
                placeholder="15"
              />
            </div>
          </div>
        </div>

        <div className="expense-total">
          <span>Total: {Object.entries(inputs)
            .filter(([key]) => key.endsWith('Percent'))
            .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0)}%</span>
          {expenseError && <span className="expense-error">{expenseError}</span>}
          <button className="reset-button" onClick={resetExpenseBreakdown}>
            Reset to Default
          </button>
        </div>
      </div>

      <div className="growth-section">
        <h3>Growth Rates</h3>
        <div className="growth-grid">
          <div className="growth-card">
            <div className="growth-icon">
              <FaChartLine />
            </div>
            <div className="growth-content">
              <label>Revenue Growth (%)</label>
              <div className="growth-value">{inputs.revenueGrowth}%</div>
              <input
                type="range"
                name="revenueGrowth"
                min="0"
                max="20"
                value={inputs.revenueGrowth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="growth-card">
            <div className="growth-icon">
              <FaMoneyBillWave />
            </div>
            <div className="growth-content">
              <label>Expense Growth (%)</label>
              <div className="growth-value">{inputs.expenseGrowth}%</div>
              <input
                type="range"
                name="expenseGrowth"
                min="0"
                max="20"
                value={inputs.expenseGrowth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="growth-card">
            <div className="growth-icon">
              <FaMoneyBillWave />
            </div>
            <div className="growth-content">
              <label>ADR Growth (%)</label>
              <div className="growth-value">{inputs.adrGrowth}%</div>
              <input
                type="range"
                name="adrGrowth"
                min="0"
                max="20"
                value={inputs.adrGrowth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="growth-card">
            <div className="growth-icon">
              <FaUsers />
            </div>
            <div className="growth-content">
              <label>Occupancy Growth (%)</label>
              <div className="growth-value">{inputs.occupancyGrowth}%</div>
              <input
                type="range"
                name="occupancyGrowth"
                min="0"
                max="20"
                value={inputs.occupancyGrowth}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel; 