
import React, { useState, useEffect, useMemo } from 'react';
import { FinancialData, MonthlyRecord, User, Role } from './types';
import { generateFinancialData } from './services/geminiService';
import SummaryCards from './components/SummaryCards';
import FinancialTable from './components/FinancialTable';
import FinancialChart from './components/FinancialChart';
import RecordModal from './components/RecordModal';

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const STORAGE_KEY = 'community_fund_data';

const App: React.FC = () => {
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>({ role: 'guest', name: 'Viewer' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MonthlyRecord | null>(null);

  // Load from local storage or generate initial data
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setRecords(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse local storage", e);
        }
      }
      
      // Fallback to Gemini if nothing in storage
      try {
        const result = await generateFinancialData();
        // Add random IDs to Gemini results
        const recordsWithId = result.records.map(r => ({...r, id: Math.random().toString(36).substr(2, 9)}));
        setRecords(recordsWithId);
      } catch (err) {
        console.error("Failed to load records:", err);
        setError("Unable to generate financial data. Please ensure your API key is configured correctly.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Recalculate balances whenever records change
  const processedRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => 
      MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
    );

    let cumulative = 0;
    const final = sorted.map(r => {
      const remaining = r.amountCollected - r.amountGiven;
      cumulative += remaining;
      return {
        ...r,
        remainingBalance: remaining,
        cumulativeBalance: cumulative
      };
    });

    // Auto-save to "Google Sheets" (simulated via local storage)
    if (final.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    }

    return final;
  }, [records]);

  const summary = useMemo(() => {
    const totalCollected = processedRecords.reduce((sum, r) => sum + r.amountCollected, 0);
    const totalDistributed = processedRecords.reduce((sum, r) => sum + r.amountGiven, 0);
    const uniqueContributors = new Set(processedRecords.flatMap(r => r.contributorNames)).size;
    const finalBalance = processedRecords.length > 0 ? processedRecords[processedRecords.length - 1].cumulativeBalance : 0;

    return {
      totalCollected,
      totalDistributed,
      uniqueContributors,
      finalBalance
    };
  }, [processedRecords]);

  const toggleRole = () => {
    setUser(prev => ({
      role: prev.role === 'admin' ? 'guest' : 'admin',
      name: prev.role === 'admin' ? 'Viewer' : 'Administrator'
    }));
  };

  const handleSaveRecord = (formData: Partial<MonthlyRecord>) => {
    if (editingRecord) {
      // Update
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...formData } : r));
    } else {
      // Add
      const newRecord = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as MonthlyRecord;
      setRecords(prev => [...prev, newRecord]);
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (record: MonthlyRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const resetData = async () => {
    if (window.confirm('Reset all data and fetch fresh example records?')) {
      setLoading(true);
      localStorage.removeItem(STORAGE_KEY);
      try {
        const result = await generateFinancialData();
        const recordsWithId = result.records.map(r => ({...r, id: Math.random().toString(36).substr(2, 9)}));
        setRecords(recordsWithId);
      } catch (err) {
        setError("Reset failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-slate-800 font-bold text-2xl mb-2">Syncing with Fund Database</h2>
        <p className="text-slate-500 animate-pulse text-lg max-w-sm">Calculating 12-month balances and verifying contributor records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                <i className="fa-solid fa-vault text-2xl"></i>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">CommunityFund</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">PKR Ledger System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{user.role} Access</span>
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-slate-200"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <button 
                    onClick={toggleRole}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest block transition-colors"
                  >
                    Switch to {user.role === 'admin' ? 'Guest' : 'Admin'}
                  </button>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm overflow-hidden group cursor-pointer" onClick={toggleRole}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.role}`} alt="Avatar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-sm uppercase tracking-widest">
              <span className="w-8 h-[2px] bg-blue-600"></span>
              2024 Financial Overview
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fund Transparency Portal</h2>
            <p className="text-slate-500 max-w-2xl text-lg font-medium">
              Real-time tracking of humanitarian aid distribution and community contributions across Pakistan.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={resetData}
              className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all text-sm shadow-sm"
            >
              <i className="fa-solid fa-cloud-arrow-down"></i>
              Cloud Reset
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
                className="bg-blue-600 px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-200 active:scale-95"
              >
                <i className="fa-solid fa-plus-circle"></i>
                Add New Record
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Cards */}
        <SummaryCards summary={summary} />

        {/* Analytics Charts */}
        <FinancialChart records={processedRecords} />

        {/* Data Table */}
        <FinancialTable 
          records={processedRecords} 
          role={user.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Simulated Google Sheets Sync Status */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800 text-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200">
          <div className="flex items-center gap-6">
            <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
              <i className="fa-solid fa-square-check text-3xl"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1">Connected to Google Sheets</h4>
              <p className="text-slate-400 text-sm max-w-sm">
                Last synced: {new Date().toLocaleTimeString()} • Encrypted transmission active.
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto flex gap-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                  +{summary.uniqueContributors}
                </div>
             </div>
             <div className="h-10 w-[1px] bg-slate-700 hidden md:block"></div>
             <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Contributors
             </p>
          </div>
        </div>
      </main>

      <RecordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveRecord}
        initialData={editingRecord}
      />
    </div>
  );
};

export default App;
