import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext'; // Import AuthContext
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown, Target, Award, Plus, Flame, Bell, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data untuk chart (bisa diupdate nanti dari API)
const mockData = [
  { name: 'Mon', balance: 4000 },
  { name: 'Tue', balance: 3000 },
  { name: 'Wed', balance: 2000 },
  { name: 'Thu', balance: 2780 },
  { name: 'Fri', balance: 1890 },
  { name: 'Sat', balance: 2390 },
  { name: 'Sun', balance: 3490 },
];

export const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth(); // Ambil data user dari Google Login
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State untuk menyimpan data finansial asli
  const [financials, setFinancials] = useState({
    totalBalance: 0,
    income: 0,
    expense: 0,
    recentTransactions: []
  });

  // Fungsi format Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Efek untuk mengambil data dari backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/v1/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setFinancials(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Gamification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {/* GANTI: Menggunakan nama dari Google User */}
          <h1 className="text-3xl text-accent">
            {t('welcomeBack')}, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-text/70 font-medium mt-1">{t('streakMsg')}</p>
        </div>
        
        <div className="flex gap-4">
          <Card className="py-3 px-5 flex items-center gap-3 bg-orange-50 border-orange-200">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-primary">
              <Flame size={20} className="fill-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-text/60 uppercase tracking-wider">{t('streak')}</p>
              <p className="font-heading font-bold text-lg text-accent">5 {t('days')}</p>
            </div>
          </Card>
          <Card className="py-3 px-5 flex items-center gap-3 bg-yellow-50 border-yellow-200">
            <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700">
              <Award size={20} className="fill-yellow-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-text/60 uppercase tracking-wider">{t('level')}</p>
              <p className="font-heading font-bold text-lg text-yellow-800">Lvl 12</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Reminder Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-orange-100 border-2 border-primary/20 rounded-2xl p-4 flex items-start md:items-center gap-4 shadow-sm"
      >
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-accent">{t('reminderTitle')}</h4>
          <p className="text-sm text-text/70">{t('reminderDesc')}</p>
        </div>
        <Button size="sm" onClick={() => setShowAddForm(true)}>{t('logNow')}</Button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-orange-600 text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Wallet size={100} />
          </div>
          <div className="relative z-10">
            <p className="font-medium text-orange-100">{t('totalBalance')}</p>
            {/* GANTI: Menggunakan saldo dari backend */}
            <h2 className="text-4xl mt-2 mb-6">{formatCurrency(financials.totalBalance || 0)}</h2>
            <div className="w-full bg-black/10 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-orange-100">{t('monthlyGoalProgress')}</p>
          </div>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-text/60">{t('income')}</p>
              {/* GANTI: Menggunakan pemasukan asli */}
              <h3 className="text-2xl text-green-600 mt-1">{formatCurrency(financials.income || 0)}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-text/60 mt-4">{t('fromLastMonthUp')}</p>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-text/60">{t('expense')}</p>
              {/* GANTI: Menggunakan pengeluaran asli */}
              <h3 className="text-2xl text-red-600 mt-1">{formatCurrency(financials.expense || 0)}</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-sm text-text/60 mt-4">{t('fromLastMonthDown')}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl">{t('monthlyReport')}</h3>
            <select className="bg-background border-2 border-orange-100 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-primary">
              <option>{t('thisWeek')}</option>
              <option>{t('thisMonth')}</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
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
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl">{t('recentTransactions')}</h3>
            <button className="text-primary font-bold text-sm hover:underline">{t('viewAll')}</button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
            {/* GANTI: Melakukan mapping dari data asli jika ada, jika tidak pakai list kosong */}
            {financials.recentTransactions.length > 0 ? (
              financials.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface border-2 border-orange-100 shadow-sm rounded-2xl flex items-center justify-center text-xl">
                      {tx.icon || '💰'}
                    </div>
                    <div>
                      <p className="font-bold text-text">{tx.title}</p>
                      <p className="text-xs text-text/50 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-text'}`}>
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text/50">Belum ada transaksi</div>
            )}
          </div>

          <Button className="w-full mt-6 gap-2" onClick={() => setShowAddForm(true)}>
            <Plus size={20} /> {t('addTransaction')}
          </Button>
        </Card>
      </div>

      {/* Add Transaction Modal */}
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