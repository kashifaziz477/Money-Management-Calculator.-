
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Record' : 'Add New Record'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Month</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Total Collected (PKR)</label>
              <input 
                type="number"
                value={collected}
                onChange={(e) => setCollected(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contributors (comma separated)</label>
            <input 
              type="text"
              value={contributors}
              onChange={(e) => setContributors(e.target.value)}
              placeholder="e.g. Ali, Fatima, Omar"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-800">Distributions (Giving Money)</label>
              <button 
                type="button"
                onClick={handleAddDistribution}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                Add Recipient
              </button>
            </div>
            
            <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {distributions.map((dist, idx) => (
                <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-left-2">
                  <div className="flex-1">
                    <input 
                      type="text"
                      placeholder="Recipient Name"
                      value={dist.recipient}
                      onChange={(e) => handleUpdateDistribution(idx, 'recipient', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number"
                      placeholder="Amount"
                      value={dist.amount}
                      onChange={(e) => handleUpdateDistribution(idx, 'amount', Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none font-semibold"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveDistribution(idx)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
              {distributions.length === 0 && (
                <p className="text-center py-4 text-slate-400 text-sm italic">No distributions recorded for this month.</p>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Distributed</span>
              <span className="text-lg font-black text-rose-600">Rs. {totalGiven.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              {initialData ? 'Update Monthly Record' : 'Save Monthly Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;
