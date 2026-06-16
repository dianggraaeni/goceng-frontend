import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  CreditCard,
  Edit3,
  Plus,
  Trash2,
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
  accountId: string;
  categoryId: string | null;
  description: string;
  rawDate: string;
  rawType: 'INCOME' | 'EXPENSE' | 'TRANSFER';
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

type AccountFormState = {
  name: string;
  type: 'BANK' | 'E_WALLET' | 'CASH' | 'CREDIT_CARD' | 'INVESTMENT';
  initialBalance: string;
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
};

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

const DEFAULT_ACCOUNT_FORM_STATE: AccountFormState = {
  name: '',
  type: 'BANK',
  initialBalance: '',
};

export const Dashboard = () => {
  const { t, lang } = useLanguage();
  const { user, selectedAccountId: activeAccountId } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [financials, setFinancials] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedScope, setSelectedScope] = useState('all');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formState, setFormState] = useState<TransactionFormState>(DEFAULT_FORM_STATE);
  const [accountFormState, setAccountFormState] = useState<AccountFormState>(DEFAULT_ACCOUNT_FORM_STATE);
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);
  const [accountSubmitError, setAccountSubmitError] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const fetchDashboardData = async (scope: string) => {
    try {
      setLoadingSummary(true);
      const query = scope === 'all'
        ? '/dashboard/summary'
        : `/dashboard/summary?scope=${encodeURIComponent(scope)}`;

      const response = await apiFetch(query);
      if (response.ok) {
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
        });

        if ((result.accountFilters?.selectedScope || 'all') !== scope) {
          setSelectedScope(result.accountFilters?.selectedScope || 'all');
        }
      }
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const refreshDashboard = () => fetchDashboardData(selectedScope);

  useEffect(() => {
    if (activeAccountId) {
      fetchDashboardData(selectedScope);
    }
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
      const isEditing = editingTransactionId !== null;
      const endpoint = isEditing ? `/transactions/${editingTransactionId}` : '/transactions';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await apiFetch(endpoint, {
        method,
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
      setEditingTransactionId(null);
      setFormState((prev) => ({
        ...DEFAULT_FORM_STATE,
        accountId: prev.accountId,
        transactionDate: formatInputDate(new Date()),
      }));
      
      await fetchDashboardData(selectedScope);
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

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountFormState.name || !accountFormState.type || accountFormState.initialBalance === '') {
      setAccountSubmitError(lang === 'id' ? 'Mohon isi semua field' : 'Please fill all fields');
      return;
    }

    setAccountSubmitError('');
    setIsSubmittingAccount(true);

    try {
      const response = await apiFetch('/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: accountFormState.name,
          type: accountFormState.type,
          initialBalance: Number(accountFormState.initialBalance),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      setShowAddAccountForm(false);
      setAccountFormState(DEFAULT_ACCOUNT_FORM_STATE);
      
      await fetchDashboardData(selectedScope);
    } catch (error) {
      console.error('Gagal membuat akun:', error);
      setAccountSubmitError(
        lang === 'id'
          ? 'Gagal membuat akun. Coba lagi.'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const handleEditTransaction = (tx: RecentTransaction) => {
    setEditingTransactionId(tx.id);
    setFormState({
      type: tx.rawType === 'TRANSFER' ? 'EXPENSE' : tx.rawType,
      amount: tx.amount.toString(),
      categoryId: tx.categoryId || '',
      accountId: tx.accountId,
      transactionDate: tx.rawDate,
      description: tx.description,
    });
    setShowAddForm(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm(lang === 'id' ? 'Yakin ingin menghapus transaksi ini?' : 'Are you sure you want to delete this transaction?')) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await apiFetch(`/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchDashboardData(selectedScope);
      }
    } catch (error) {
      console.error('Failed to delete transaction', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl text-accent">
            {t('welcomeBack')}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-text/70 font-medium mt-1">
            {lang === 'id' ? 'Kelola keuanganmu dengan mudah dari sini.' : 'Manage your finances easily from here.'}
          </p>
        </div>
      </div>

      {!activeAccountId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-orange-100 rounded-[2rem] p-8 md:p-12 text-center shadow-sm max-w-3xl mx-auto mt-12"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-accent mb-4">Tautkan Akun Chatbot-mu</h2>
          <p className="text-lg text-text/70 mb-8 max-w-xl mx-auto">
            Untuk mulai mencatat keuangan dan melihat laporan di sini, kamu perlu menghubungkan Goceng dengan chatbot Telegram atau WhatsApp kami.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://t.me/Goceng_ChatBot" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-all shadow-sm group">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M21.93 2.92C22.09 2.5 21.98 2.03 21.65 1.74C21.32 1.45 20.84 1.41 20.47 1.63L2.47 12.63C2.12 12.84 1.93 13.25 1.99 13.66C2.05 14.07 2.37 14.4 2.78 14.48L7.49 15.43L10.02 21.14C10.21 21.56 10.63 21.84 11.09 21.84C11.14 21.84 11.19 21.84 11.24 21.83C11.75 21.75 12.16 21.37 12.28 20.87L13.56 16.64L18.42 20.57C18.67 20.78 18.99 20.87 19.31 20.83C19.62 20.78 19.91 20.6 20.08 20.33L21.93 2.92ZM13.84 14.89L11.51 16.78L10.01 13.38L18.17 6.4L7.86 13.91L4.01 13.14L19.46 3.7L13.84 14.89Z" fill="#2AABEE"/>
              </svg>
              <div className="text-left">
                <p className="text-xs font-bold text-blue-600/70 uppercase">Tautkan via</p>
                <p className="font-bold text-blue-700 text-lg">Telegram Bot</p>
              </div>
            </a>
            
            <a href="https://wa.me/62895622767316" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl transition-all shadow-sm group">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19L7.6 18.82L4.43 19.65L5.28 16.55L5.09 16.24C4.3 14.94 3.87 13.44 3.87 11.91C3.87 7.4 7.54 3.73 12.05 3.73C14.24 3.73 16.3 4.58 17.85 6.14C19.4 7.69 20.25 9.75 20.25 11.93C20.25 16.44 16.58 20.15 12.04 20.15ZM16.53 14.01C16.28 13.88 15.06 13.28 14.84 13.2C14.62 13.11 14.45 13.07 14.29 13.32C14.13 13.57 13.66 14.11 13.52 14.28C13.37 14.45 13.23 14.47 12.98 14.34C12.73 14.22 11.93 13.96 10.98 13.11C10.24 12.45 9.74 11.62 9.6 11.37C9.45 11.12 9.58 10.99 9.71 10.87C9.82 10.76 9.96 10.58 10.09 10.43C10.21 10.28 10.25 10.18 10.33 10.01C10.41 9.84 10.37 9.69 10.31 9.57C10.25 9.44 9.75 8.22 9.54 7.72C9.34 7.23 9.13 7.3 8.98 7.3C8.84 7.3 8.67 7.3 8.51 7.3C8.35 7.3 8.08 7.36 7.85 7.61C7.62 7.86 6.98 8.46 6.98 9.69C6.98 10.92 7.89 12.1 8.01 12.27C8.13 12.44 9.77 15 12.3 16.09C12.9 16.35 13.37 16.5 13.75 16.62C14.35 16.81 14.89 16.78 15.31 16.72C15.79 16.65 16.8 16.12 17.01 15.53C17.22 14.94 17.22 14.44 17.16 14.33C17.09 14.22 16.93 14.16 16.68 14.03" fill="#25D366"/>
              </svg>
              <div className="text-left">
                <p className="text-xs font-bold text-green-600/70 uppercase">Tautkan via</p>
                <p className="font-bold text-green-700 text-lg">WhatsApp Bot</p>
              </div>
            </a>
          </div>
          
          <p className="mt-8 text-sm text-text/50 font-medium">Setelah menautkan, data akan muncul secara otomatis di sini.</p>
        </motion.div>
      ) : (
        <>
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
          <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl">{t('recentTransactions')}</h3>
              <button className="text-primary font-bold text-sm hover:underline">{t('viewAll')}</button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[340px]">
              {financials.recentTransactions.length > 0 ? (
                financials.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 hover:bg-orange-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-surface border-2 border-orange-100 shadow-sm rounded-2xl flex items-center justify-center text-xl shrink-0">
                        {tx.icon || 'Rp'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-text truncate">{tx.title}</p>
                        <p className="text-xs text-text/50 font-medium truncate">
                          {tx.date} • {tx.accountName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                      <p className={`font-bold shrink-0 ${tx.type === 'income' ? 'text-green-600' : 'text-text'}`}>
                        {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                        {formatCurrency(tx.amount)}
                      </p>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditTransaction(tx); }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                          title={lang === 'id' ? 'Edit' : 'Edit'}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTransaction(tx.id); }}
                          disabled={deletingId === tx.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50"
                          title={lang === 'id' ? 'Hapus' : 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text/50">
                  {lang === 'id' ? 'Belum ada transaksi' : 'No transactions yet'}
                </div>
              )}
            </div>

            <Button className="w-full mt-6 gap-2" onClick={() => {
              setEditingTransactionId(null);
              setFormState(DEFAULT_FORM_STATE);
              setShowAddForm(true);
            }}>
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

                <h2 className="text-2xl text-accent mb-6">
                  {editingTransactionId 
                    ? (lang === 'id' ? 'Edit Transaksi' : 'Edit Transaction') 
                    : t('addTransaction')}
                </h2>

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
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-bold text-text/80">
                        {lang === 'id' ? 'Sumber Dana / Akun' : 'Funding Account'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddAccountForm(true)}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> {lang === 'id' ? 'Buat Akun' : 'Add Account'}
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={formState.accountId}
                        onChange={(event) => setFormState((prev) => ({ ...prev, accountId: event.target.value }))}
                        className="w-full appearance-none bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                        disabled={financials.accounts.length === 0}
                      >
                        <option value="" disabled>
                          {financials.accounts.length === 0 
                            ? (lang === 'id' ? 'Belum ada akun, buat di chatbot' : 'No accounts, create in chatbot')
                            : (lang === 'id' ? 'Pilih sumber dana' : 'Select account')}
                        </option>
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

      <AnimatePresence>
        {showAddAccountForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="relative border border-orange-100 shadow-2xl">
                <button
                  onClick={() => setShowAddAccountForm(false)}
                  className="absolute right-4 top-4 p-2 text-text/50 hover:text-text hover:bg-orange-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold mb-6">
                  {lang === 'id' ? 'Tambah Sumber Dana' : 'Add Funding Account'}
                </h3>

                <form className="space-y-4" onSubmit={handleAddAccount}>
                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">
                      {lang === 'id' ? 'Nama Akun' : 'Account Name'}
                    </label>
                    <input
                      type="text"
                      value={accountFormState.name}
                      onChange={(event) => setAccountFormState((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                      placeholder={lang === 'id' ? 'Contoh: BCA Pribadi, Gopay' : 'Example: Personal BCA, Gopay'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">
                      {lang === 'id' ? 'Jenis Akun' : 'Account Type'}
                    </label>
                    <select
                      value={accountFormState.type}
                      onChange={(event) => setAccountFormState((prev) => ({ ...prev, type: event.target.value as any }))}
                      className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                    >
                      <option value="BANK">{lang === 'id' ? 'Rekening Bank' : 'Bank Account'}</option>
                      <option value="E_WALLET">{lang === 'id' ? 'Dompet Digital / E-Wallet' : 'E-Wallet'}</option>
                      <option value="CASH">{lang === 'id' ? 'Uang Tunai' : 'Cash'}</option>
                      <option value="CREDIT_CARD">{lang === 'id' ? 'Kartu Kredit' : 'Credit Card'}</option>
                      <option value="INVESTMENT">{lang === 'id' ? 'Investasi' : 'Investment'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text/80 mb-1">
                      {lang === 'id' ? 'Saldo Awal' : 'Initial Balance'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text/50">Rp</span>
                      <input
                        type="number"
                        value={accountFormState.initialBalance}
                        onChange={(event) => setAccountFormState((prev) => ({ ...prev, initialBalance: event.target.value }))}
                        className="w-full bg-background border-2 border-orange-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {accountSubmitError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {accountSubmitError}
                    </div>
                  )}

                  <Button className="w-full mt-6" size="lg" type="submit" disabled={isSubmittingAccount}>
                    {isSubmittingAccount
                      ? (lang === 'id' ? 'Menyimpan...' : 'Saving...')
                      : (lang === 'id' ? 'Simpan Akun' : 'Save Account')}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};
