
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Financial Records</h2>
        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${role === 'admin' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
            {role === 'admin' ? 'Admin Mode' : 'View Only'}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Month</th>
              <th className="px-6 py-4">Contributors</th>
              <th className="px-6 py-4">Collected (Rs.)</th>
              <th className="px-6 py-4">Given (Rs.)</th>
              <th className="px-6 py-4">Monthly Balance</th>
              <th className="px-6 py-4">Cumulative Total</th>
              {role === 'admin' && <th className="px-6 py-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 7 : 6} className="px-6 py-20 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg mb-1">No data found</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Your ledger is currently empty. Start by adding your first monthly record using the button above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group/row">
                  <td className="px-6 py-4 font-bold text-slate-700">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="max-w-[180px] truncate" title={row.contributorNames.join(', ')}>
                      {row.contributorNames.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">Rs. {row.amountCollected.toLocaleString()}</td>
                  <td className="px-6 py-4 relative group">
                    <div className="flex flex-col">
                       <span className="font-bold text-rose-500">Rs. {row.amountGiven.toLocaleString()}</span>
                       {row.distributions && row.distributions.length > 0 && (
                         <span className="text-[10px] text-slate-400 font-medium">
                           {row.distributions.length} recipients
                         </span>
                       )}
                    </div>
                    {/* Hover detail box */}
                    {row.distributions && row.distributions.length > 0 && (
                      <div className="absolute left-6 top-full mt-1 hidden group-hover:block z-[60] bg-slate-800 text-white text-[11px] p-3 rounded-xl shadow-xl w-48 border border-slate-700">
                         <div className="font-bold mb-2 border-b border-slate-700 pb-1 uppercase tracking-tighter">Recipients</div>
                         <div className="space-y-1.5">
                            {row.distributions.map((d, i) => (
                              <div key={i} className="flex justify-between items-center gap-2">
                                <span className="truncate max-w-[100px]">{d.recipient}</span>
                                <span className="font-mono text-slate-400">Rs.{d.amount.toLocaleString()}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </td>
                  <td className={`px-6 py-4 font-semibold ${row.remainingBalance >= 0 ? 'text-slate-700' : 'text-rose-600'}`}>
                    Rs. {row.remainingBalance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                      Rs. {row.cumulativeBalance.toLocaleString()}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(row)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(row.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can"></i>
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
