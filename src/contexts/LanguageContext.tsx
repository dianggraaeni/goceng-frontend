import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

const translations: Translations = {
  // Navbar
  home: { id: 'Beranda', en: 'Home' },
  dashboard: { id: 'Dasbor', en: 'Dashboard' },
  chat: { id: 'Chatbot', en: 'Chatbot' },
  report: { id: 'Laporan', en: 'Report' },
  login: { id: 'Masuk', en: 'Login' },
  register: { id: 'Daftar', en: 'Register' },
  
  // Landing
  heroTitle: { id: 'Lacak Keuanganmu dengan Seru!', en: 'Track Your Finances with Fun!' },
  heroSubtitle: { id: 'GOCENG bikin atur uang jadi gampang, seru, dan berhadiah! Yuk mulai sekarang.', en: 'GOCENG makes managing money easy, fun, and rewarding! Let\'s start now.' },
  startTracking: { id: 'Mulai via WhatsApp', en: 'Start via WhatsApp' },
  
  // Dashboard
  totalBalance: { id: 'Total Saldo', en: 'Total Balance' },
  income: { id: 'Pemasukan', en: 'Income' },
  expense: { id: 'Pengeluaran', en: 'Expense' },
  healthScore: { id: 'Skor Kesehatan', en: 'Health Score' },
  level: { id: 'Level', en: 'Level' },
  recentTransactions: { id: 'Transaksi Terakhir', en: 'Recent Transactions' },
  addTransaction: { id: 'Tambah Transaksi', en: 'Add Transaction' },
  save: { id: 'Simpan', en: 'Save' },
  amount: { id: 'Jumlah', en: 'Amount' },
  category: { id: 'Kategori', en: 'Category' },
  date: { id: 'Tanggal', en: 'Date' },
  
  // Chat
  chatPlaceholder: { id: 'Ketik pesanmu di sini...', en: 'Type your message here...' },
  chatWelcome: { id: 'Halo! Aku Goceng, asisten keuanganmu. Ada yang bisa kubantu hari ini?', en: 'Hello! I am Goceng, your financial assistant. How can I help you today?' },
  
  // Gamification
  goodJob: { id: 'Kerja Bagus!', en: 'Good Job!' },
  keepItUp: { id: 'Pertahankan!', en: 'Keep it up!' },
  badgeSaver: { id: 'Si Paling Hemat', en: 'Super Saver' },
  
  // Report
  monthlyReport: { id: 'Laporan Bulanan', en: 'Monthly Report' },
  expenseByCategory: { id: 'Pengeluaran per Kategori', en: 'Expense by Category' },
};

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('id');

  const toggleLang = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key: keyof typeof translations) => {
    if (!translations[key]) return key;
    return translations[key][lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
