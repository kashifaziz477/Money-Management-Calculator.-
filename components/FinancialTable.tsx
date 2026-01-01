
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
        <h2 className="text-lg font-bold text-slate-800">Annual Financial Records</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">
            {role === 'admin' ? 'Admin Mode' : 'View Only'}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider">
            Fiscal Year 2024
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
                <td colSpan={role === 'admin' ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                  No records found. Click "Add Record" to begin.
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="max-w-[180px] truncate" title={row.contributorNames.join(', ')}>
                      {row.contributorNames.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-600">Rs. {row.amountCollected.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-rose-500">Rs. {row.amountGiven.toLocaleString()}</td>
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
                      <div className="flex justify-center gap-2">
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
