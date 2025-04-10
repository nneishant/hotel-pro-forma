import React, { useState, useEffect } from 'react';
import './App.css';
import InputPanel from './components/InputPanel';
import SummaryTab from './components/SummaryTab';
import FinancialCharts from './components/FinancialCharts';
import Login from './components/Login';
import SummaryTable from './components/SummaryTable';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

function App() {
  const [inputs, setInputs] = useState({
    numberOfRooms: '',
    averageDailyRate: '',
    occupancyRate: '',
    operatingCosts: '',
    otherIncome: '0',
    payrollPercent: '50',
    utilitiesPercent: '20',
    marketingPercent: '15',
    maintenancePercent: '15',
    revenueGrowth: '5',
    expenseGrowth: '3',
    adrGrowth: '4',
    occupancyGrowth: '2'
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  // Construct properly structured data for SummaryTable
  const summaryTableData = {
    numberOfRooms: inputs.numberOfRooms,
    averageDailyRate: inputs.averageDailyRate,
    occupancyRate: inputs.occupancyRate,
    operatingCosts: inputs.operatingCosts,
    expenseBreakdown: {
      rooms: inputs.payrollPercent,
      utilities: inputs.utilitiesPercent,
      salesAndMarketing: inputs.marketingPercent,
      propertyOperations: inputs.maintenancePercent
    },
    growthRates: {
      adr: inputs.adrGrowth,
      occupancy: inputs.occupancyGrowth,
      operatingCosts: inputs.expenseGrowth
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hotel Pro Forma</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="App-main">
        <div className="calculator-container">
          <div className="top-row">
            <div className="section input-section">
              <InputPanel inputs={inputs} setInputs={setInputs} />
            </div>
            <div className="section summary-section">
              <SummaryTable data={summaryTableData} />
            </div>
          </div>
          
          <div className="section charts-section">
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </button>
                <button 
                  className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('charts')}
                >
                  Charts
                </button>
              </div>
              
              <div className="tab-content">
                <div className={`tab-panel ${activeTab === 'summary' ? 'active' : ''}`}>
                  <SummaryTab data={summaryTableData} />
                </div>
                <div className={`tab-panel ${activeTab === 'charts' ? 'active' : ''}`}>
                  <FinancialCharts data={summaryTableData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
