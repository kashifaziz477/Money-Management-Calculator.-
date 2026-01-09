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
  const [user, setUser] = useState<User>({ role: 'admin', name: 'Administrator' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MonthlyRecord | null>(null);

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
      
      try {
        const result = await generateFinancialData();
        const recordsWithId = result.records.map(r => ({...r, id: Math.random().toString(36).substr(2, 9)}));
        setRecords(recordsWithId);
      } catch (err) {
        console.error("Failed to load records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    return final;
  }, [records]);

  const summary = useMemo(() => {
    const totalCollected = processedRecords.reduce((sum, r) => sum + r.amountCollected, 0);
    const totalDistributed = processedRecords.reduce((sum, r) => sum + r.amountGiven, 0);
    const uniqueContributors = new Set(processedRecords.flatMap(r => r.contributorNames)).size;
    const finalBalance = processedRecords.length > 0 ? processedRecords[processedRecords.length - 1].cumulativeBalance : 0;

    return { totalCollected, totalDistributed, uniqueContributors, finalBalance };
  }, [processedRecords]);

  const toggleRole = () => {
    setUser(prev => ({
      role: prev.role === 'admin' ? 'guest' : 'admin',
      name: prev.role === 'admin' ? 'Viewer' : 'Administrator'
    }));
  };

  const handleSaveRecord = (formData: Partial<MonthlyRecord>) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...formData } as MonthlyRecord : r));
    } else {
      const newRecord = { ...formData, id: Math.random().toString(36).substr(2, 9) } as MonthlyRecord;
      setRecords(prev => [...prev, newRecord]);
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this month\'s record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (record: MonthlyRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="relative">
            <div className="w-24 h-24 border-[6px] border-slate-50 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-vault text-blue-600 text-2xl animate-pulse"></i>
            </div>
        </div>
        <h2 className="text-slate-900 font-extrabold text-2xl mt-8 tracking-tight">Accessing Vault...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-slate-900">
      <nav className="glass sticky top-0 z-[80] border-b border-slate-100 px-6 sm:px-12 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
              <i className="fa-solid fa-vault text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none gradient-text">Ledgerly</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Community Fund Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{user.role}</span>
            </div>
            <button 
                onClick={toggleRole}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.role}&backgroundColor=b6e3f4`} alt="Avatar" />
                </div>
                <div className="text-left hidden xs:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">Switch Mode</p>
                </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 mt-16">
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-2 leading-[1.05]">
              Money Management <br/>
              <span className="gradient-text">Chart</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-4 flex items-center gap-2">
              <span className="w-8 h-[2.5px] bg-blue-600"></span>
              Live Community Analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
                className="gradient-btn px-10 py-5 rounded-[1.5rem] text-white font-extrabold flex items-center gap-3 active:scale-95 shadow-xl shadow-blue-100 text-lg"
             >
                <i className="fa-solid fa-plus-circle"></i>
                Add Record
             </button>
          </div>
        </header>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white/40 p-2 rounded-[2.5rem] border border-white/50 backdrop-blur-sm shadow-xl shadow-slate-200/40">
            <FinancialChart records={processedRecords} />
          </div>
          
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Financial Timeline</h3>
                    <p className="text-slate-400 text-sm font-semibold mt-1">Detailed history including full participant lists</p>
                </div>
            </div>
            <FinancialTable 
              records={processedRecords} 
              role={user.role}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>

        <div className="mt-24 bg-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
           
           <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-white">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 text-2xl border border-white/10 backdrop-blur-xl">
                   <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="text-3xl font-black tracking-tight mb-3">Audit-Ready Reporting</h4>
                  <p className="text-slate-400 max-w-lg text-lg leading-relaxed">
                     Every PKR collected and spent is tracked with itemized relief distributions. Your records are secured locally on this device.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                 <div className="text-right">
                    <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Status</p>
                    <p className="text-white text-2xl font-black">Secure & Local</p>
                 </div>
                 <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-3xl border border-emerald-500/30">
                    <i className="fa-solid fa-check-double"></i>
                 </div>
              </div>
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