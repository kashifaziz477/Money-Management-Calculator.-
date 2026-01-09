import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { MonthlyRecord } from '../types';

interface FinancialChartProps {
  records: MonthlyRecord[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ records }) => {
  const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
      {/* Trend Chart */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-800 font-black text-lg tracking-tight">Cumulative Growth</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Net Total</span>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={records} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Cumulative"]}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px' }}
                itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeBalance" 
                stroke="#2563eb" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCumulative)" 
                name="Net Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-800 font-black text-lg tracking-tight">Monthly Flow</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">In vs Out</span>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={records} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Bar dataKey="amountCollected" fill="#10b981" radius={[10, 10, 0, 0]} name="Inflow" barSize={14} />
              <Bar dataKey="amountGiven" fill="#f43f5e" radius={[10, 10, 0, 0]} name="Relief" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;