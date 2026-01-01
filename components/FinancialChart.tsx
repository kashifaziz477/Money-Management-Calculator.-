
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { MonthlyRecord } from '../types';

interface FinancialChartProps {
  records: MonthlyRecord[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ records }) => {
  const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold mb-6">Cumulative Fund Growth (PKR)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={records} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10}} 
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Cumulative Balance"]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeBalance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCumulative)" 
                name="Cumulative Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold mb-6">Inflow vs. Outflow (PKR)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={records} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10}}
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="amountCollected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="amountGiven" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Distributed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
