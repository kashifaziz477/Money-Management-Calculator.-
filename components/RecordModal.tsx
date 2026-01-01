
import React, { useState, useEffect } from 'react';
import { MonthlyRecord } from '../types';

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
  const [given, setGiven] = useState(0);

  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month);
      setContributors(initialData.contributorNames.join(', '));
      setCollected(initialData.amountCollected);
      setGiven(initialData.amountGiven);
    } else {
      setMonth('January');
      setContributors('');
      setCollected(0);
      setGiven(0);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      month,
      contributorNames: contributors.split(',').map(s => s.trim()).filter(s => s !== ''),
      amountCollected: Number(collected),
      amountGiven: Number(given),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Record' : 'Add New Record'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Collected (PKR)</label>
              <input 
                type="number"
                value={collected}
                onChange={(e) => setCollected(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Given (PKR)</label>
              <input 
                type="number"
                value={given}
                onChange={(e) => setGiven(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
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
              {initialData ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;
