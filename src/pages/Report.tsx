import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { buildApiUrl } from '@/lib/api';

type ReportData = {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  };
  byCategory: Array<{
    name: string;
    total: number;
    percentage: number;
  }>;
  weeklyOverview: Array<{
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    income: number;
    expense: number;
  }>;
};

const CHART_COLORS = ['#F97316', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'];

export const Report = () => {
  const { t, lang } = useLanguage();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => (
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount)
  );

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          buildApiUrl(`/reports/data?month=${selectedMonth}&year=${selectedYear}`),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const result = await response.json();
        setReport(result);
      } catch (error) {
        console.error('Gagal mengambil laporan:', error);
        setReport({
          summary: {
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
          },
          byCategory: [],
          weeklyOverview: [
            { day: 'MON', income: 0, expense: 0 },
            { day: 'TUE', income: 0, expense: 0 },
            { day: 'WED', income: 0, expense: 0 },
            { day: 'THU', income: 0, expense: 0 },
            { day: 'FRI', income: 0, expense: 0 },
            { day: 'SAT', income: 0, expense: 0 },
            { day: 'SUN', income: 0, expense: 0 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedMonth, selectedYear]);

  const monthOptions = Array.from({ length: 6 }, (_, index) => {
    const optionDate = new Date(today.getFullYear(), today.getMonth() - index, 1);
    return {
      month: optionDate.getMonth() + 1,
      year: optionDate.getFullYear(),
      label: optionDate.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  const dayLabelMap = {
    MON: lang === 'id' ? 'Sen' : 'Mon',
    TUE: lang === 'id' ? 'Sel' : 'Tue',
    WED: lang === 'id' ? 'Rab' : 'Wed',
    THU: lang === 'id' ? 'Kam' : 'Thu',
    FRI: lang === 'id' ? 'Jum' : 'Fri',
    SAT: lang === 'id' ? 'Sab' : 'Sat',
    SUN: lang === 'id' ? 'Min' : 'Sun',
  };

  const expenseData = (report?.byCategory || []).map((item, index) => ({
    name: item.name,
    value: item.total,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const weeklyData = (report?.weeklyOverview || []).map((item) => ({
    name: dayLabelMap[item.day],
    income: item.income,
    expense: item.expense,
  }));

  const hasExpenseData = expenseData.length > 0;
  const hasWeeklyData = weeklyData.some((item) => item.income > 0 || item.expense > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-accent">{t('reportTitle')}</h1>
        <select
          className="bg-surface border-2 border-orange-100 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-primary shadow-sm"
          value={`${selectedYear}-${selectedMonth}`}
          onChange={(event) => {
            const [year, month] = event.target.value.split('-').map(Number);
            setSelectedYear(year);
            setSelectedMonth(month);
          }}
        >
          {monthOptions.map((option) => (
            <option
              key={`${option.year}-${option.month}`}
              value={`${option.year}-${option.month}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="font-bold text-green-900 text-sm uppercase tracking-wide">
              {lang === 'id' ? 'Total Pemasukan' : 'Total Income'}
            </p>
            <p className="font-heading font-bold text-2xl text-green-950">
              {formatCurrency(report?.summary.totalIncome || 0)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="font-bold text-red-900 text-sm uppercase tracking-wide">
              {lang === 'id' ? 'Total Pengeluaran' : 'Total Expense'}
            </p>
            <p className="font-heading font-bold text-2xl text-red-950">
              {formatCurrency(report?.summary.totalExpense || 0)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <Wallet size={28} />
          </div>
          <div>
            <p className="font-bold text-blue-900 text-sm uppercase tracking-wide">
              {lang === 'id' ? 'Saldo Bersih' : 'Net Balance'}
            </p>
            <p className="font-heading font-bold text-2xl text-blue-950">
              {formatCurrency(report?.summary.netBalance || 0)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl mb-6">{t('expenseByCategory')}</h3>
          <div className="h-[300px] flex items-center justify-center">
            {loading ? (
              <div className="text-text/50">
                {lang === 'id' ? 'Memuat laporan...' : 'Loading report...'}
              </div>
            ) : hasExpenseData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-text/50 px-6">
                {lang === 'id' ? 'Belum ada pengeluaran pada periode ini.' : 'No expense data for this period.'}
              </div>
            )}
          </div>

          {hasExpenseData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-text/80 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm text-text/60">{item.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-xl mb-6">{t('weeklyOverview')}</h3>
          <div className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text/50">
                {lang === 'id' ? 'Memuat laporan...' : 'Loading report...'}
              </div>
            ) : hasWeeklyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                  <RechartsTooltip
                    cursor={{ fill: '#f9f9f9' }}
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-text/50 px-6">
                {lang === 'id' ? 'Belum ada transaksi pada periode ini.' : 'No transactions for this period yet.'}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
