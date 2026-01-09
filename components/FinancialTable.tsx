import React from 'react';
import { MonthlyRecord, Role } from '../types';

interface FinancialTableProps {
  records: MonthlyRecord[];
  role: Role;
  onEdit: (record: MonthlyRecord) => void;
  onDelete: (id: string) => void;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ records, role, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th className="px-8 py-7">Timeline</th>
              <th className="px-8 py-7">Participants (Full Names)</th>
              <th className="px-8 py-7">Collections</th>
              <th className="px-8 py-7">Distributions</th>
              <th className="px-8 py-7">Balance</th>
              {role === 'admin' && <th className="px-8 py-7 text-center">Settings</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6 text-3xl">
                      <i className="fa-solid fa-inbox"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Vault is empty</h3>
                    <p className="text-slate-400 max-w-xs mt-2 text-sm">Add records to see participant details.</p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-all group/row">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                        <span className="font-extrabold text-slate-900 text-lg tracking-tight">{row.month}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-wrap gap-2 max-w-[300px]">
                        {row.contributorNames.map((name, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors whitespace-nowrap">
                            {name}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col">
                        <span className="font-black text-emerald-600">Rs. {row.amountCollected.toLocaleString()}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Inflow</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 relative group">
                    <div className="flex flex-col cursor-pointer">
                       <span className="font-black text-rose-500 flex items-center gap-2">
                         Rs. {row.amountGiven.toLocaleString()}
                         <i className="fa-solid fa-circle-info text-[10px] opacity-20 group-hover:opacity-100 transition-opacity"></i>
                       </span>
                       {row.distributions && row.distributions.length > 0 && (
                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                           {row.distributions.length} Relief Recipients
                         </span>
                       )}
                    </div>
                    {/* Hover detail toolip */}
                    {row.distributions && row.distributions.length > 0 && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 hidden group-hover:block z-[90] glass text-slate-800 text-xs p-6 rounded-3xl shadow-2xl w-72 border border-slate-100 animate-in fade-in zoom-in duration-200">
                         <div className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 flex justify-between">
                            <span>Detailed Breakdown</span>
                            <i className="fa-solid fa-heart-pulse text-rose-400"></i>
                         </div>
                         <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {row.distributions.map((d, i) => (
                              <div key={i} className="flex justify-between items-center gap-3 bg-slate-50/50 p-2 rounded-xl">
                                <span className="font-bold truncate max-w-[120px] text-slate-700">{d.recipient}</span>
                                <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-lg text-[10px] shadow-sm">Rs.{d.amount.toLocaleString()}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-7">
                    <div className="inline-flex flex-col">
                        <span className={`font-black text-lg ${row.remainingBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                           Rs. {row.cumulativeBalance.toLocaleString()}
                        </span>
                        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1 ${row.remainingBalance >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                           {row.remainingBalance >= 0 ? <i className="fa-solid fa-arrow-up text-[8px]"></i> : <i className="fa-solid fa-arrow-down text-[8px]"></i>}
                           {row.remainingBalance.toLocaleString()} Net
                        </div>
                    </div>
                  </td>
                  {role === 'admin' && (
                    <td className="px-8 py-7 text-center">
                      <div className="flex justify-center gap-3 opacity-0 group-hover/row:opacity-100 transition-all transform group-hover/row:translate-x-0 translate-x-4">
                        <button 
                          onClick={() => onEdit(row)}
                          className="w-11 h-11 flex items-center justify-center bg-white border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen-nib text-sm"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(row.id)}
                          className="w-11 h-11 flex items-center justify-center bg-white border border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialTable;