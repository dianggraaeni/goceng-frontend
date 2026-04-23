import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown, Award, Plus, Flame, Bell, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { buildApiUrl } from '@/lib/api';

type CashFlowWeek = {
  week: number;
  income: number;
  expense: number;
};

type RecentTransaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  icon: string | null;
};

type DashboardSummary = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  previousMonthlyIncome: number;
  previousMonthlyExpense: number;
  cashFlowByWeek: CashFlowWeek[];
  recentTransactions: RecentTransaction[];
  gamification: {
    currentStreak: number;
    level: number;
    hasLoggedToday: boolean;
    totalTransactions: number;
  };
};

const createEmptyWeeks = (): CashFlowWeek[] => (
  [1, 2, 3, 4].map((week) => ({ week, income: 0, expense: 0 }))
);

const EMPTY_SUMMARY: DashboardSummary = {
  totalBalance: 0,
  monthlyIncome: 0,
  monthlyExpense: 0,
  previousMonthlyIncome: 0,
  previousMonthlyExpense: 0,
  cashFlowByWeek: createEmptyWeeks(),
  recentTransactions: [],
  gamification: {
    currentStreak: 0,
    level: 1,
    hasLoggedToday: false,
    totalTransactions: 0,
  },
};

export const Dashboard = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [financials, setFinancials] = useState<DashboardSummary>(EMPTY_SUMMARY);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(buildApiUrl('/dashboard/summary'), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard summary');
        }

        const result = await response.json();
        setFinancials({
          totalBalance: result.totalBalance || 0,
          monthlyIncome: result.monthlyIncome || 0,
          monthlyExpense: result.monthlyExpense || 0,
          previousMonthlyIncome: result.previousMonthlyIncome || 0,
          previousMonthlyExpense: result.previousMonthlyExpense || 0,
          cashFlowByWeek: Array.isArray(result.cashFlowByWeek) && result.cashFlowByWeek.length > 0
            ? result.cashFlowByWeek
            : createEmptyWeeks(),
          recentTransactions: Array.isArray(result.recentTransactions) ? result.recentTransactions : [],
          gamification: {
            currentStreak: result.gamification?.currentStreak || 0,
            level: result.gamification?.level || 1,
            hasLoggedToday: Boolean(result.gamification?.hasLoggedToday),
            totalTransactions: result.gamification?.totalTransactions || 0,
          },
        });
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const hasAnyActivity = (
    financials.totalBalance > 0 ||
    financials.monthlyIncome > 0 ||
    financials.monthlyExpense > 0 ||
    financials.recentTransactions.length > 0
  );

  const hasCashFlowData = financials.cashFlowByWeek.some(
    (item) => item.income > 0 || item.expense > 0
  );

  const chartData = financials.cashFlowByWeek.map((item) => ({
    name: `W${item.week}`,
    balance: item.income - item.expense,
  }));

  const comparisonText = (current: number, previous: number) => {
    if (current === 0 && previous === 0) {
      return lang === 'id' ? 'Belum ada data pembanding bulan lalu' : 'No comparison data from last month';
    }

    if (previous === 0) {
      return lang === 'id' ? 'Baru mulai tercatat bulan ini' : 'First activity recorded this month';
    }

    const change = ((current - previous) / previous) * 100;
    const rounded = Math.round(change);
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}% ${lang === 'id' ? 'dari bulan lalu' : 'vs last month'}`;
  };

  const streakMessage = financials.gamification.currentStreak > 0
    ? (
      lang === 'id'
        ? `Kamu sedang dalam ${financials.gamification.currentStreak} hari streak mencatat transaksi!`
        : `You are on a ${financials.gamification.currentStreak}-day transaction streak!`
    )
    : (
      lang === 'id'
        ? 'Belum ada streak. Catat transaksi pertamamu hari ini.'
        : 'No streak yet. Log your first transaction today.'
    );

  const reminderTitle = financials.gamification.hasLoggedToday
    ? (lang === 'id' ? 'Transaksi hari ini sudah tercatat' : 'Today\'s transaction is already logged')
    : t('reminderTitle');

  const reminderDescription = financials.gamification.hasLoggedToday
    ? (
      lang === 'id'
        ? 'Bagus. Lanjutkan besok untuk menjaga streak kamu tetap hidup.'
        : 'Nice work. Keep going tomorrow to maintain your streak.'
    )
    : financials.gamification.currentStreak > 0
      ? t('reminderDesc')
      : (
        lang === 'id'
          ? 'Belum ada transaksi. Catat transaksi pertamamu untuk memulai streak.'
          : 'No transactions yet. Log your first one to start a streak.'
      );

  const balanceSummaryText = hasAnyActivity
    ? (lang === 'id' ? 'Ringkasan bulan berjalan' : 'Current month summary')
    : (lang === 'id' ? 'Data akan muncul setelah ada transaksi' : 'Data will appear after your first transaction');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl text-accent">
            {t('welcomeBack')}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-text/70 font-medium mt-1">{streakMessage}</p>
        </div>

        <div className="flex gap-4">
          <Card className="py-3 px-5 flex items-center gap-3 bg-orange-50 border-orange-200">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-primary">
              <Flame size={20} className="fill-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-text/60 uppercase tracking-wider">{t('streak')}</p>
              <p className="font-heading font-bold text-lg text-accent">
                {financials.gamification.currentStreak} {t('days')}
              </p>
            </div>
          </Card>

          <Card className="py-3 px-5 flex items-center gap-3 bg-yellow-50 border-yellow-200">
            <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700">
              <Award size={20} className="fill-yellow-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-text/60 uppercase tracking-wider">{t('level')}</p>
              <p className="font-heading font-bold text-lg text-yellow-800">
                Lvl {financials.gamification.level}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-orange-100 border-2 border-primary/20 rounded-2xl p-4 flex items-start md:items-center gap-4 shadow-sm"
      >
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-accent">{reminderTitle}</h4>
          <p className="text-sm text-text/70">{reminderDescription}</p>
        </div>
        <Button size="sm" onClick={() => setShowAddForm(true)}>{t('logNow')}</Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-orange-600 text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Wallet size={100} />
          </div>
          <div className="relative z-10">
            <p className="font-medium text-orange-100">{t('totalBalance')}</p>
            <h2 className="text-4xl mt-2 mb-6">{formatCurrency(financials.totalBalance)}</h2>
            <div className="w-full bg-black/10 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: hasAnyActivity ? '100%' : '0%' }}
              ></div>
            </div>
            <p className="text-sm text-orange-100">{balanceSummaryText}</p>
          </div>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-text/60">{t('income')}</p>
              <h3 className="text-2xl text-green-600 mt-1">{formatCurrency(financials.monthlyIncome)}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-text/60 mt-4">
            {comparisonText(financials.monthlyIncome, financials.previousMonthlyIncome)}
          </p>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-text/60">{t('expense')}</p>
              <h3 className="text-2xl text-red-600 mt-1">{formatCurrency(financials.monthlyExpense)}</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-sm text-text/60 mt-4">
            {comparisonText(financials.monthlyExpense, financials.previousMonthlyExpense)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl">{t('monthlyReport')}</h3>
            <select className="bg-background border-2 border-orange-100 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-primary">
              <option>{t('thisMonth')}</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            {hasCashFlowData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#F97316', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-text/50 px-6">
                {lang === 'id' ? 'Belum ada data transaksi bulan ini.' : 'No transaction data for this month yet.'}
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl">{t('recentTransactions')}</h3>
            <button className="text-primary font-bold text-sm hover:underline">{t('viewAll')}</button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
            {financials.recentTransactions.length > 0 ? (
              financials.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface border-2 border-orange-100 shadow-sm rounded-2xl flex items-center justify-center text-xl">
                      {tx.icon || 'Rp'}
                    </div>
                    <div>
                      <p className="font-bold text-text">{tx.title}</p>
                      <p className="text-xs text-text/50 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-text'}`}>
                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                    {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text/50">
                {lang === 'id' ? 'Belum ada transaksi' : 'No transactions yet'}
              </div>
            )}
          </div>

          <Button className="w-full mt-6 gap-2" onClick={() => setShowAddForm(true)}>
            <Plus size={20} /> {t('addTransaction')}
          </Button>
        </Card>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="relative">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-4 right-4 p-2 text-text/50 hover:text-text bg-orange-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl text-accent mb-6">{t('addTransaction')}</h2>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddForm(false); }}>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button type="button" className="py-3 px-4 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 font-bold flex items-center justify-center gap-2 transition-colors">
                      <TrendingUp size={18} /> {t('income')}
                    </button>
                    <button type="button" className="py-3 px-4 rounded-xl border-2 border-orange-200 bg-surface text-text/70 font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
                      <TrendingDown size={18} /> {t('expense')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('amount')}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text/50">Rp</span>
                      <input
                        type="number"
                        className="w-full bg-background border-2 border-orange-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('category')}</label>
                    <select className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors">
                      <option>{t('catFood')}</option>
                      <option>{t('catTransport')}</option>
                      <option>{t('catShopping')}</option>
                      <option>{t('catEntertainment')}</option>
                      <option>{t('catOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('date')}</label>
                    <input
                      type="date"
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                    />
                  </div>

                  <Button className="w-full mt-6" size="lg" type="submit">
                    {t('save')}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
