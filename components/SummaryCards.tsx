import React from 'react';
import { FundSummary } from '../types';

interface SummaryCardsProps {
  summary: FundSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      label: 'Collected',
      value: `Rs. ${summary.totalCollected.toLocaleString()}`,
      icon: 'fa-hand-holding-dollar',
      gradient: 'from-emerald-400/10 via-emerald-400/5 to-transparent',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      accent: 'emerald',
      borderColor: 'border-emerald-100/50'
    },
    {
      label: 'Distributed',
      value: `Rs. ${summary.totalDistributed.toLocaleString()}`,
      icon: 'fa-heart-circle-check',
      gradient: 'from-rose-400/10 via-rose-400/5 to-transparent',
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
      accent: 'rose',
      borderColor: 'border-rose-100/50'
    },
    {
      label: 'Balance',
      value: `Rs. ${summary.finalBalance.toLocaleString()}`,
      icon: 'fa-vault',
      gradient: 'from-blue-400/10 via-blue-400/5 to-transparent',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      accent: 'blue',
      borderColor: 'border-blue-100/50'
    },
    {
      label: 'Friends',
      value: summary.uniqueContributors.toString(),
      icon: 'fa-user-group',
      gradient: 'from-amber-400/10 via-amber-400/5 to-transparent',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      accent: 'amber',
      borderColor: 'border-amber-100/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {cards.map((card, idx) => (
        <div key={idx} className={`card-hover bg-white relative p-8 rounded-[2.5rem] border ${card.borderColor} shadow-xl shadow-slate-100/30 overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <i className={`fa-solid ${card.icon}`}></i>
            </div>
            
            <div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 text-8xl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 rotate-12 group-hover:rotate-0">
             <i className={`fa-solid ${card.icon}`}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;