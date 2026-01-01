
import React from 'react';
import { FundSummary } from '../types';

interface SummaryCardsProps {
  summary: FundSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      label: 'Total Collected',
      value: `Rs. ${summary.totalCollected.toLocaleString()}`,
      icon: 'fa-hand-holding-dollar',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Total Distributed',
      value: `Rs. ${summary.totalDistributed.toLocaleString()}`,
      icon: 'fa-heart',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      label: 'Final Balance',
      value: `Rs. ${summary.finalBalance.toLocaleString()}`,
      icon: 'fa-piggy-bank',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Contributors',
      value: summary.uniqueContributors,
      icon: 'fa-users',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
            <i className={`fa-solid ${card.icon}`}></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
