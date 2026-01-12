import React, { useState, useEffect } from 'react';
import { MonthlyRecord, Distribution } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<MonthlyRecord>) => void;
  initialData?: MonthlyRecord | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [month, setMonth] = useState('January');
  const [contributors, setContributors] = useState('');
  const [collected, setCollected] = useState(0);
  const [distributions, setDistributions] = useState<Distribution[]>([]);

  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month);
      setContributors(initialData.contributorNames.join(', '));
      setCollected(initialData.amountCollected);
      setDistributions(initialData.distributions || []);
    } else {
      setMonth('January');
      setContributors('');
      setCollected(0);
      setDistributions([{ recipient: '', amount: 0 }]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddDistribution = () => {
    setDistributions([...distributions, { recipient: '', amount: 0 }]);
  };

  const handleRemoveDistribution = (index: number) => {
    setDistributions(distributions.filter((_, i) => i !== index));
  };

  const handleUpdateDistribution = (index: number, field: keyof Distribution, value: string | number) => {
    const newDistributions = [...distributions];
    newDistributions[index] = { ...newDistributions[index], [field]: value };
    setDistributions(newDistributions);
  };

  const totalGiven = distributions.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      month,
      contributorNames: contributors.split(',').map(s => s.trim()).filter(s => s !== ''),
      amountCollected: Number(collected),
      amountGiven: totalGiven,
      distributions: distributions.filter(d => d.recipient.trim() !== '')
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-2xl my-auto overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-12 duration-500 border border-white dark:border-slate-800 transition-colors duration-300">
        <div className="p-10 pb-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
               <i className="fa-solid fa-file-invoice-dollar"></i> Data Entry
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Refine Record' : 'Log Monthly Stats'}
            </h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full flex items-center justify-center transition-all hover:rotate-90">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Timeline</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all appearance-none cursor-pointer"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Gross Inflow (PKR)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={collected}
                  onChange={(e) => setCollected(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-black text-emerald-600 dark:text-emerald-400 text-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 outline-none transition-all pl-16"
                  required
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600/50 font-bold">Rs.</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Contributors</label>
            <input 
              type="text"
              value={contributors}
              onChange={(e) => setContributors(e.target.value)}
              placeholder="Names separated by comma..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
              required
            />
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div>
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Outflow & Distributions</label>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-1 uppercase">Track every rupee sent</p>
              </div>
              <button 
                type="button"
                onClick={handleAddDistribution}
                className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-[11px] font-bold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10"
              >
                <i className="fa-solid fa-plus-circle text-blue-400 dark:text-blue-600 group-hover:text-white transition-colors"></i>
                Add Recipient
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-3 custom-scrollbar p-1">
              {distributions.map((dist, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center p-1 group/item">
                  <input 
                    type="text"
                    placeholder="E.g. Relief Fund"
                    value={dist.recipient}
                    onChange={(e) => handleUpdateDistribution(idx, 'recipient', e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/10 outline-none transition-all w-full"
                  />
                  <div className="relative">
                    <input 
                        type="number"
                        placeholder="Amount"
                        value={dist.amount}
                        onChange={(e) => handleUpdateDistribution(idx, 'amount', Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-5 py-3.5 pl-10 text-sm font-black text-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-900/10 outline-none transition-all w-32"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 font-bold text-[10px]">Rs.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveDistribution(idx)}
                    className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Calculated Monthly Outflow</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Rs. {totalGiven.toLocaleString()}</span>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-10 py-5 rounded-2xl font-black text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-1 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 dark:hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95"
            >
              {initialData ? 'Sync Changes' : 'Confirm Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;