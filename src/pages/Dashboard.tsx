import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Bell,
  Building2,
  CreditCard,
  Flame,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '@/lib/api';

type CashFlowWeek = {
  week: number;
  income: number;
  expense: number;
};

type DashboardAccount = {
  id: string;
  name: string;
  type: 'BANK' | 'E_WALLET' | 'CASH' | 'CREDIT_CARD' | 'INVESTMENT';
  currentBalance: number;
  color?: string | null;
  icon?: string | null;
};

type RecentTransaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  icon: string | null;
  accountName: string;
};

type DashboardPreset = {
  id: string;
  label: string;
  labelEn: string;
  accountCount: number;
};

type DashboardSummary = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  previousMonthlyIncome: number;
  previousMonthlyExpense: number;
  cashFlowByWeek: CashFlowWeek[];
  accounts: DashboardAccount[];
  accountFilters: {
    selectedScope: string;
    presets: DashboardPreset[];
  };
  recentTransactions: RecentTransaction[];
  gamification: {
    currentStreak: number;
    level: number;
    hasLoggedToday: boolean;
    totalTransactions: number;
    streakState: 'safe' | 'at-risk' | 'reset';
    petMood: 'happy' | 'hungry' | 'sleepy';
    petStageKey: 'egg' | 'baby' | 'teen' | 'adult' | 'legendary';
    nextEvolutionAt: number | null;
    daysToNextEvolution: number;
  };
};

type Category = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
};

type TransactionFormState = {
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  categoryId: string;
  accountId: string;
  transactionDate: string;
  description: string;
};

type ScopeOption = {
  value: string;
  label: string;
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
  accounts: [],
  accountFilters: {
    selectedScope: 'all',
    presets: [],
  },
  recentTransactions: [],
  gamification: {
    currentStreak: 0,
    level: 1,
    hasLoggedToday: false,
    totalTransactions: 0,
    streakState: 'reset',
    petMood: 'sleepy',
    petStageKey: 'egg',
    nextEvolutionAt: 1,
    daysToNextEvolution: 1,
  },
};

const PET_STAGE_ASSETS = {
  egg: '/mascot_2.png',
  baby: '/mascot.png',
  teen: '/mascot_2.png',
  adult: '/mascot.png',
  legendary: '/jempol.png',
} as const;

const formatInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_FORM_STATE: TransactionFormState = {
  type: 'EXPENSE',
  amount: '',
  categoryId: '',
  accountId: '',
  transactionDate: formatInputDate(new Date()),
  description: '',
};

export const Dashboard = () => {
  const { t, lang } = useLanguage();
  const { user, selectedAccountId: activeAccountId } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [financials, setFinancials] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedScope, setSelectedScope] = useState('all');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formState, setFormState] = useState<TransactionFormState>(DEFAULT_FORM_STATE);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!activeAccountId) {
        setCategories([]);
        return;
      }
      try {
        const response = await apiFetch('/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        setCategories(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
      }
    };

    fetchCategories();
  }, [activeAccountId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!activeAccountId) {
        setFinancials(EMPTY_SUMMARY);
        setLoadingSummary(false);
        return;
      }
      
      setLoadingSummary(true);

      try {
        const query = selectedScope === 'all'
          ? '/dashboard/summary'
          : `/dashboard/summary?scope=${encodeURIComponent(selectedScope)}`;
        const response = await apiFetch(query);

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
          accounts: Array.isArray(result.accounts) ? result.accounts : [],
          accountFilters: {
            selectedScope: result.accountFilters?.selectedScope || 'all',
            presets: Array.isArray(result.accountFilters?.presets) ? result.accountFilters.presets : [],
          },
          recentTransactions: Array.isArray(result.recentTransactions) ? result.recentTransactions : [],
          gamification: {
            currentStreak: result.gamification?.currentStreak || 0,
            level: result.gamification?.level || 1,
            hasLoggedToday: Boolean(result.gamification?.hasLoggedToday),
            totalTransactions: result.gamification?.totalTransactions || 0,
            streakState: result.gamification?.streakState || 'reset',
            petMood: result.gamification?.petMood || 'sleepy',
            petStageKey: result.gamification?.petStageKey || 'egg',
            nextEvolutionAt: result.gamification?.nextEvolutionAt ?? null,
            daysToNextEvolution: result.gamification?.daysToNextEvolution || 0,
          },
        });

        if ((result.accountFilters?.selectedScope || 'all') !== selectedScope) {
          setSelectedScope(result.accountFilters?.selectedScope || 'all');
        }
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchDashboardData();
  }, [selectedScope, activeAccountId]);

  useEffect(() => {
    if (!formState.accountId && financials.accounts.length > 0) {
      const preferredAccount =
        financials.accounts.find((account) => account.type !== 'CREDIT_CARD') || financials.accounts[0];

      setFormState((prev) => ({
        ...prev,
        accountId: preferredAccount.id,
      }));
    }
  }, [financials.accounts, formState.accountId]);

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

  const accountOptions: ScopeOption[] = financials.accounts.map((account) => ({
    value: `account:${account.id}`,
    label: account.name,
  }));

  const directAccountOptions = financials.accounts.filter((account) => account.type !== 'CREDIT_CARD');
  const creditCardOptions = financials.accounts.filter((account) => account.type === 'CREDIT_CARD');
  const presetOptions: ScopeOption[] = financials.accountFilters.presets.map((preset) => ({
    value: `preset:${preset.id}`,
    label: lang === 'id' ? preset.label : preset.labelEn,
  }));

  const allScopeOptions: ScopeOption[] = [
    {
      value: 'all',
      label: lang === 'id' ? 'Semua Akun' : 'All Accounts',
    },
    ...accountOptions,
    ...presetOptions,
  ];

  const selectedScopeLabel = allScopeOptions.find((option) => option.value === selectedScope)?.label
    || (lang === 'id' ? 'Semua Akun' : 'All Accounts');

  const petStageContent = {
    egg: {
      title: lang === 'id' ? 'Tahap Telur' : 'Egg Stage',
      description: lang === 'id'
        ? 'Pet masih menunggu nutrisi pertama. Catat transaksi hari ini untuk mulai menetas.'
        : 'Your pet is waiting for its first nutrition. Log a transaction today to hatch it.',
    },
    baby: {
      title: lang === 'id' ? 'Tahap Bayi' : 'Baby Stage',
      description: lang === 'id'
        ? 'Pet mulai tumbuh. Semakin rutin kamu mencatat, semakin cepat dia berkembang.'
        : 'Your pet has started growing. The more consistent you log, the faster it evolves.',
    },
    teen: {
      title: lang === 'id' ? 'Tahap Remaja' : 'Teen Stage',
      description: lang === 'id'
        ? 'Streak 14 hari tercapai. Pet sudah terlihat lebih aktif dan kuat.'
        : 'You hit the 14-day streak. Your pet now looks more active and stronger.',
    },
    adult: {
      title: lang === 'id' ? 'Tahap Dewasa' : 'Adult Stage',
      description: lang === 'id'
        ? 'Pet dewasa hadir setelah 30 hari. Saatnya jaga konsistensi untuk aksesori spesial.'
        : 'Your adult pet appears after 30 days. Keep the streak alive for special accessories.',
    },
    legendary: {
      title: lang === 'id' ? 'Tahap Legendaris' : 'Legendary Stage',
      description: lang === 'id'
        ? '100+ hari streak. Pet legendarismu siap tampil dengan perlengkapan penuh.'
        : '100+ streak days. Your legendary pet is ready with its full accessories.',
    },
  }[financials.gamification.petStageKey];

  const streakMessage = financials.gamification.currentStreak > 0
    ? (
      lang === 'id'
        ? `Pet kamu sudah hidup ${financials.gamification.currentStreak} hari berturut-turut.`
        : `Your pet has stayed alive for ${financials.gamification.currentStreak} straight days.`
    )
    : (
      lang === 'id'
        ? 'Belum ada streak. Mulai beri nutrisi dengan mencatat transaksi pertama hari ini.'
        : 'No streak yet. Feed your pet by logging your first transaction today.'
    );

  const reminderTitle = financials.gamification.hasLoggedToday
    ? (lang === 'id' ? 'Pet hari ini sudah diberi nutrisi' : 'Your pet has been fed today')
    : financials.gamification.currentStreak > 0
      ? (lang === 'id' ? 'Pet mulai kelaparan hari ini' : 'Your pet is getting hungry today')
      : (lang === 'id' ? 'Mulai streak pertamamu hari ini' : 'Start your first streak today');

  const reminderDescription = financials.gamification.hasLoggedToday
    ? (
      lang === 'id'
        ? 'Bagus. Besok catat lagi supaya streak tetap lanjut dan pet terus bertumbuh.'
        : 'Nice work. Log again tomorrow to keep the streak going and your pet growing.'
    )
    : financials.gamification.currentStreak > 0
      ? (
        lang === 'id'
          ? 'Belum ada transaksi hari ini. Kalau sampai 23:59 belum tercatat, streak akan kembali ke 0.'
          : 'No transaction has been logged today. If it stays empty until 23:59, your streak resets to 0.'
      )
      : (
        lang === 'id'
          ? 'Belum ada transaksi. Catat pemasukan atau pengeluaran pertamamu untuk menetasakan pet.'
          : 'No transactions yet. Log your first income or expense to hatch the pet.'
      );

  const balanceSummaryText = hasAnyActivity
    ? (
      lang === 'id'
        ? `Ringkasan bulan berjalan untuk ${selectedScopeLabel}`
        : `Current month summary for ${selectedScopeLabel}`
    )
    : (lang === 'id' ? 'Data akan muncul setelah ada transaksi' : 'Data will appear after your first transaction');

  const filteredCategories = categories.filter((category) => category.type === formState.type);

  const handleTypeChange = (type: 'INCOME' | 'EXPENSE') => {
    setFormState((prev) => ({
      ...prev,
      type,
      categoryId: '',
    }));
  };

  const handleSubmitTransaction = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    if (!formState.accountId || !formState.amount || !formState.transactionDate) {
      setSubmitError(
        lang === 'id'
          ? 'Akun, jumlah, dan tanggal wajib diisi.'
          : 'Account, amount, and date are required.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch('/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: formState.accountId,
          categoryId: formState.categoryId || null,
          type: formState.type,
          amount: Number(formState.amount),
          description: formState.description || null,
          transactionDate: formState.transactionDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      setShowAddForm(false);
      setFormState((prev) => ({
        ...DEFAULT_FORM_STATE,
        accountId: prev.accountId,
        transactionDate: formatInputDate(new Date()),
      }));
      setSelectedScope((prev) => prev);
      const query = selectedScope === 'all'
        ? '/dashboard/summary'
        : `/dashboard/summary?scope=${encodeURIComponent(selectedScope)}`;
      const dashboardResponse = await apiFetch(query);

      if (dashboardResponse.ok) {
        const result = await dashboardResponse.json();
        setFinancials({
          totalBalance: result.totalBalance || 0,
          monthlyIncome: result.monthlyIncome || 0,
          monthlyExpense: result.monthlyExpense || 0,
          previousMonthlyIncome: result.previousMonthlyIncome || 0,
          previousMonthlyExpense: result.previousMonthlyExpense || 0,
          cashFlowByWeek: Array.isArray(result.cashFlowByWeek) && result.cashFlowByWeek.length > 0
            ? result.cashFlowByWeek
            : createEmptyWeeks(),
          accounts: Array.isArray(result.accounts) ? result.accounts : [],
          accountFilters: {
            selectedScope: result.accountFilters?.selectedScope || 'all',
            presets: Array.isArray(result.accountFilters?.presets) ? result.accountFilters.presets : [],
          },
          recentTransactions: Array.isArray(result.recentTransactions) ? result.recentTransactions : [],
          gamification: {
            currentStreak: result.gamification?.currentStreak || 0,
            level: result.gamification?.level || 1,
            hasLoggedToday: Boolean(result.gamification?.hasLoggedToday),
            totalTransactions: result.gamification?.totalTransactions || 0,
            streakState: result.gamification?.streakState || 'reset',
            petMood: result.gamification?.petMood || 'sleepy',
            petStageKey: result.gamification?.petStageKey || 'egg',
            nextEvolutionAt: result.gamification?.nextEvolutionAt ?? null,
            daysToNextEvolution: result.gamification?.daysToNextEvolution || 0,
          },
        });
      }
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
      setSubmitError(
        lang === 'id'
          ? 'Transaksi belum berhasil disimpan. Coba lagi.'
          : 'The transaction could not be saved. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-xl">{t('monthlyReport')}</h3>
              <p className="text-sm text-text/60 mt-1">
                {lang === 'id'
                  ? 'Pilih akun atau preset mutasi untuk melihat arus kas yang lebih spesifik.'
                  : 'Choose an account or statement preset to see more specific cashflow.'}
              </p>
            </div>

            <select
              className="min-w-[240px] bg-background border-2 border-orange-100 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-primary"
              value={selectedScope}
              onChange={(event) => setSelectedScope(event.target.value)}
            >
              <option value="all">{lang === 'id' ? 'Semua Akun' : 'All Accounts'}</option>
              {directAccountOptions.length > 0 && (
                <optgroup label={lang === 'id' ? 'Akun Bank' : 'Accounts'}>
                  {directAccountOptions.map((account) => (
                    <option key={account.id} value={`account:${account.id}`}>
                      {account.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {creditCardOptions.length > 0 && (
                <optgroup label={lang === 'id' ? 'Kartu Kredit' : 'Credit Cards'}>
                  {creditCardOptions.map((account) => (
                    <option key={account.id} value={`account:${account.id}`}>
                      {account.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {presetOptions.length > 0 && (
                <optgroup label={lang === 'id' ? 'Cek Keuangan' : 'Financial Checks'}>
                  {presetOptions.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="h-[300px] w-full">
            {loadingSummary ? (
              <div className="h-full flex items-center justify-center text-text/50">
                {lang === 'id' ? 'Memuat dashboard...' : 'Loading dashboard...'}
              </div>
            ) : hasCashFlowData ? (
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
                {lang === 'id'
                  ? `Belum ada data transaksi untuk ${selectedScopeLabel}.`
                  : `No transaction data for ${selectedScopeLabel} yet.`}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white border-orange-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-[0.18em]">
                  {lang === 'id' ? 'Pet Streak' : 'Streak Pet'}
                </p>
                <h3 className="text-2xl text-accent mt-2">{petStageContent.title}</h3>
                <p className="text-sm text-text/70 mt-2">{petStageContent.description}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-primary border border-orange-200">
                {financials.gamification.petMood === 'happy'
                  ? (lang === 'id' ? 'Kenyang' : 'Fed')
                  : financials.gamification.petMood === 'hungry'
                    ? (lang === 'id' ? 'Lapar' : 'Hungry')
                    : (lang === 'id' ? 'Tidur' : 'Sleeping')}
              </span>
            </div>

            <div className="mt-5 rounded-[28px] bg-white/80 border border-orange-100 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-text/60">{lang === 'id' ? 'Tahap Saat Ini' : 'Current Stage'}</p>
                  <p className="text-xl font-heading text-accent">{financials.gamification.currentStreak} {t('days')}</p>
                </div>
                <div className="w-28 h-28 rounded-[24px] bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={PET_STAGE_ASSETS[financials.gamification.petStageKey]}
                    alt="Goceng Mascot"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text/60">
                    {lang === 'id' ? 'Total transaksi tercatat' : 'Total logged transactions'}
                  </span>
                  <span className="font-bold text-accent">{financials.gamification.totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text/60">
                    {lang === 'id' ? 'Evolusi berikutnya' : 'Next evolution'}
                  </span>
                  <span className="font-bold text-accent">
                    {financials.gamification.nextEvolutionAt
                      ? `${financials.gamification.nextEvolutionAt} ${t('days')}`
                      : (lang === 'id' ? 'Maksimal' : 'Maxed')}
                  </span>
                </div>
                <div className="w-full bg-orange-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: financials.gamification.nextEvolutionAt
                        ? `${Math.min((financials.gamification.currentStreak / financials.gamification.nextEvolutionAt) * 100, 100)}%`
                        : '100%',
                    }}
                  ></div>
                </div>
                <p className="text-sm text-text/70">
                  {financials.gamification.nextEvolutionAt
                    ? (
                      lang === 'id'
                        ? `${financials.gamification.daysToNextEvolution} hari lagi menuju evolusi berikutnya.`
                        : `${financials.gamification.daysToNextEvolution} more days until the next evolution.`
                    )
                    : (
                      lang === 'id'
                        ? 'Pet kamu sudah mencapai bentuk tertinggi.'
                        : 'Your pet has reached its highest form.'
                    )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl">{t('recentTransactions')}</h3>
              <button className="text-primary font-bold text-sm hover:underline">{t('viewAll')}</button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[340px]">
              {financials.recentTransactions.length > 0 ? (
                financials.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-2xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-surface border-2 border-orange-100 shadow-sm rounded-2xl flex items-center justify-center text-xl shrink-0">
                        {tx.icon || 'Rp'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text truncate">{tx.title}</p>
                        <p className="text-xs text-text/50 font-medium truncate">
                          {tx.date} • {tx.accountName}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold shrink-0 ${tx.type === 'income' ? 'text-green-600' : 'text-text'}`}>
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

                <form className="space-y-4" onSubmit={handleSubmitTransaction}>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('INCOME')}
                      className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-colors ${
                        formState.type === 'INCOME'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-orange-200 bg-surface text-text/70 hover:bg-orange-50'
                      }`}
                    >
                      <TrendingUp size={18} /> {t('income')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange('EXPENSE')}
                      className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-colors ${
                        formState.type === 'EXPENSE'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-orange-200 bg-surface text-text/70 hover:bg-orange-50'
                      }`}
                    >
                      <TrendingDown size={18} /> {t('expense')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">
                      {lang === 'id' ? 'Sumber Dana / Akun' : 'Funding Account'}
                    </label>
                    <div className="relative">
                      <select
                        value={formState.accountId}
                        onChange={(event) => setFormState((prev) => ({ ...prev, accountId: event.target.value }))}
                        className="w-full appearance-none bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                      >
                        {directAccountOptions.length > 0 && (
                          <optgroup label={lang === 'id' ? 'Akun Bank' : 'Accounts'}>
                            {directAccountOptions.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {creditCardOptions.length > 0 && (
                          <optgroup label={lang === 'id' ? 'Kartu Kredit' : 'Credit Cards'}>
                            {creditCardOptions.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text/40">
                        {financials.accounts.find((account) => account.id === formState.accountId)?.type === 'CREDIT_CARD'
                          ? <CreditCard size={18} />
                          : <Building2 size={18} />}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('amount')}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text/50">Rp</span>
                      <input
                        type="number"
                        value={formState.amount}
                        onChange={(event) => setFormState((prev) => ({ ...prev, amount: event.target.value }))}
                        className="w-full bg-background border-2 border-orange-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('category')}</label>
                    <select
                      value={formState.categoryId}
                      onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                    >
                      <option value="">{lang === 'id' ? 'Pilih kategori' : 'Select category'}</option>
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">
                      {lang === 'id' ? 'Catatan' : 'Description'}
                    </label>
                    <input
                      type="text"
                      value={formState.description}
                      onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                      placeholder={lang === 'id' ? 'Contoh: makan siang, gaji freelance' : 'Example: lunch, freelance income'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">{t('date')}</label>
                    <input
                      type="date"
                      value={formState.transactionDate}
                      onChange={(event) => setFormState((prev) => ({ ...prev, transactionDate: event.target.value }))}
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <Button className="w-full mt-6" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? (lang === 'id' ? 'Menyimpan...' : 'Saving...')
                      : t('save')}
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
