import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Award, Target, Zap } from 'lucide-react';

const expenseData = [
  { name: 'Makanan', value: 400, color: '#F97316' },
  { name: 'Transport', value: 300, color: '#3B82F6' },
  { name: 'Hiburan', value: 300, color: '#8B5CF6' },
  { name: 'Belanja', value: 200, color: '#EC4899' },
];

const weeklyData = [
  { name: 'Sen', expense: 120, income: 0 },
  { name: 'Sel', expense: 80, income: 0 },
  { name: 'Rab', expense: 150, income: 500 },
  { name: 'Kam', expense: 90, income: 0 },
  { name: 'Jum', expense: 200, income: 0 },
  { name: 'Sab', expense: 300, income: 0 },
  { name: 'Min', expense: 250, income: 0 },
];

export const Report = () => {
  const { t } = useLanguage();

  const translatedExpenseData = expenseData.map(item => {
    let translatedName = item.name;
    if (item.name === 'Makanan') translatedName = t('catFood');
    if (item.name === 'Transport') translatedName = t('catTransport');
    if (item.name === 'Hiburan') translatedName = t('catEntertainment');
    if (item.name === 'Belanja') translatedName = t('catShopping');
    return { ...item, name: translatedName };
  });

  const translatedWeeklyData = weeklyData.map(item => {
    let translatedName = item.name;
    if (item.name === 'Sen') translatedName = t('mon');
    if (item.name === 'Sel') translatedName = t('tue');
    if (item.name === 'Rab') translatedName = t('wed');
    if (item.name === 'Kam') translatedName = t('thu');
    if (item.name === 'Jum') translatedName = t('fri');
    if (item.name === 'Sab') translatedName = t('sat');
    if (item.name === 'Min') translatedName = t('sun');
    return { ...item, name: translatedName };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-accent">{t('reportTitle')}</h1>
        <select className="bg-surface border-2 border-orange-100 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-primary shadow-sm">
          <option>{t('march2026')}</option>
          <option>{t('february2026')}</option>
        </select>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-sm transform -rotate-6">
            <Target size={28} />
          </div>
          <div>
            <p className="font-bold text-blue-900 text-sm uppercase tracking-wide">{t('savingsGoal')}</p>
            <p className="font-heading font-bold text-2xl text-blue-950">85%</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-sm transform rotate-3">
            <Award size={28} />
          </div>
          <div>
            <p className="font-bold text-purple-900 text-sm uppercase tracking-wide">{t('badgesEarned')}</p>
            <p className="font-heading font-bold text-2xl text-purple-950">12</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-sm transform -rotate-3">
            <Zap size={28} />
          </div>
          <div>
            <p className="font-bold text-green-900 text-sm uppercase tracking-wide">{t('healthScore')}</p>
            <p className="font-heading font-bold text-2xl text-green-950">A+</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-xl mb-6">{t('expenseByCategory')}</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={translatedExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {translatedExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {translatedExpenseData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium text-text/80">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bar Chart */}
        <Card>
          <h3 className="text-xl mb-6">{t('weeklyOverview')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={translatedWeeklyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                <RechartsTooltip
                  cursor={{ fill: '#f9f9f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
