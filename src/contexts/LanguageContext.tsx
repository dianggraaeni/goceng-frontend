import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

// Perbaikan 1: Gunakan Record untuk typing yang lebih ketat pada objek translations
const translations = {
  // Navbar
  home: { id: 'Beranda', en: 'Home' },
  features: { id: 'Fitur', en: 'Features' },
  faqNav: { id: 'FAQ', en: 'FAQ' },
  news: { id: 'Berita', en: 'News' },
  contact: { id: 'Kontak', en: 'Contact' },
  dashboard: { id: 'Dasbor', en: 'Dashboard' },
  chat: { id: 'Chatbot', en: 'Chatbot' },
  report: { id: 'Laporan', en: 'Report' },
  login: { id: 'Masuk', en: 'Login' },
  logout: { id: 'Keluar', en: 'Logout' },
  register: { id: 'Daftar', en: 'Register' },
  
  // Landing Hero
  heroTitle: { id: 'Lacak Keuanganmu dengan Seru!', en: 'Track Your Finances with Fun!' },
  heroSubtitle: { id: 'GOCENG bikin atur uang jadi gampang, seru, dan berhadiah! Yuk mulai sekarang.', en: 'GOCENG makes managing money easy, fun, and rewarding! Let\'s start now.' },
  startTracking: { id: 'Mulai via WhatsApp', en: 'Start via WhatsApp' },
  tryDemo: { id: 'Coba Demo', en: 'Try Demo' },
  
  // Features
  feat1Title: { id: 'Tracking via WhatsApp', en: 'WhatsApp Bot Tracking' },
  feat1Desc: { id: 'Cukup chat untuk catat pengeluaran. Tanpa form ribet!', en: 'Just chat to track expenses. No complicated forms!' },
  feat2Title: { id: 'Insight Keuangan Pintar', en: 'Smart Financial Insights' },
  feat2Desc: { id: 'Dapatkan tips personal untuk hemat lebih banyak.', en: 'Get personalized tips to save more.' },
  feat3Title: { id: 'Laporan Otomatis', en: 'Auto Reports' },
  feat3Desc: { id: 'Grafik cantik yang mudah dipahami setiap bulan.', en: 'Beautiful charts that are easy to understand every month.' },
  feat4Title: { id: 'Sistem Aman', en: 'Secure System' },
  feat4Desc: { id: 'Data keuanganmu dienkripsi dan aman bersama kami.', en: 'Your financial data is encrypted and safe with us.' },

  // Detailed Features
  featDetail1Title: { id: 'Catat Transaksi Berbagai Cara', en: 'Track Transactions Multiple Ways' },
  featDetail1Desc: { id: 'Pilih sesukamu: catat manual di aplikasi atau tinggal chat Goceng di WhatsApp. Sama-sama gampang dan praktis. Goceng siap catat otomatis!', en: 'Choose your way: log manually in the app or just chat Goceng on WhatsApp. Both are easy and practical. Goceng records automatically!' },
  featDetail2Title: { id: 'Goceng AI – Asisten Finansial Pintar', en: 'Goceng AI – Smart Financial Assistant' },
  featDetail2Desc: { id: 'Kelola keuangan lebih cepat dengan Goceng AI! Dari atur budget bulanan, minta rekomendasi hemat, sampai curhat soal keuangan.', en: 'Manage finances faster with Goceng AI! From setting monthly budgets, asking for saving tips, to venting about finances.' },
  featDetail3Title: { id: 'Scan Struk & Bukti Transfer', en: 'Scan Receipts & Transfers' },
  featDetail3Desc: { id: 'Males ngetik? Tinggal foto struk belanja atau upload e-statement, Goceng otomatis baca nominal dan kategorinya buat laporanmu.', en: 'Too lazy to type? Just snap a receipt or upload an e-statement, Goceng automatically reads the amount and category for your report.' },
  featDetail4Title: { id: 'Pantau Keuangan Real-Time', en: 'Monitor Finances Real-Time' },
  featDetail4Desc: { id: 'Dapatkan grafik interaktif yang update otomatis setiap kamu jajan. Pantau sisa budget dan kategori pengeluaranmu biar nggak boncos!', en: 'Get interactive charts that update automatically every time you spend. Monitor your remaining budget and expense categories so you don\'t go broke!' },
  tryNow: { id: 'Coba Sekarang', en: 'Try Now' },

  // How It Works
  howItWorks: { id: 'Cara Kerjanya', en: 'How It Works' },
  step1: { id: 'Chat di WhatsApp', en: 'Chat on WhatsApp' },
  step2: { id: 'Input Pemasukan/Pengeluaran', en: 'Input Income/Expense' },
  step3: { id: 'Dapatkan Insight', en: 'Get Insights' },
  step4: { id: 'Lacak Progres', en: 'Track Progress' },

  // Dashboard Preview
  dashboardPreview: { id: 'Intip Dasbor GOCENG', en: 'Sneak Peek at GOCENG Dashboard' },

  // Testimonials
  testimonials: { id: 'Apa Kata Mereka?', en: 'What They Say' },
  
  // FAQ
  faq: { id: 'Pertanyaan Sering Diajukan', en: 'Frequently Asked Questions' },
  faq1Q: { id: 'Apakah data saya aman?', en: 'Is my data safe?' },
  faq1A: { id: 'Tentu! Kami menggunakan enkripsi tingkat bank untuk melindungi datamu.', en: 'Absolutely! We use bank-level encryption to protect your data.' },
  faq2Q: { id: 'Bagaimana cara kerja integrasi WhatsApp?', en: 'How does WhatsApp integration work?' },
  faq2A: { id: 'Kamu cukup mengirim pesan seperti "Makan siang 25rb" ke nomor bot kami, dan sistem akan otomatis mencatatnya.', en: 'You just send a message like "Lunch 25k" to our bot number, and the system will automatically record it.' },
  faq3Q: { id: 'Apakah ini gratis?', en: 'Is it free?' },
  faq3A: { id: 'Ya, fitur dasar GOCENG 100% gratis selamanya!', en: 'Yes, GOCENG basic features are 100% free forever!' },

  // Blog
  blog: { id: 'Tips & Berita', en: 'Tips & News' },
  readMore: { id: 'Baca Selengkapnya', en: 'Read More' },

  // Contact
  contactUs: { id: 'Hubungi Kami', en: 'Contact Us' },
  contactDesc: { id: 'Mari perbaiki kebiasaan keuanganmu bersama-sama!', en: 'Let\'s improve your financial habits together!' },
  send: { id: 'Kirim Pesan', en: 'Send Message' },

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
  quickReply1: { id: 'Catat Pengeluaran', en: 'Log Expense' },
  quickReply2: { id: 'Cek Saldo', en: 'Check Balance' },
  quickReply3: { id: 'Laporan Bulan Ini', en: 'This Month Report' },
  
  // Gamification
  goodJob: { id: 'Kerja Bagus!', en: 'Good Job!' },
  keepItUp: { id: 'Pertahankan!', en: 'Keep it up!' },
  badgeSaver: { id: 'Si Paling Hemat', en: 'Super Saver' },
  
  // Report
  monthlyReport: { id: 'Laporan Bulanan', en: 'Monthly Report' },
  expenseByCategory: { id: 'Pengeluaran per Kategori', en: 'Expense by Category' },
} as const; // Memastikan value bersifat read-only dan literal

// Perbaikan 2: Buat type khusus untuk key agar autocomplete jalan
type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKey) => string; // Harus me-return string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('id');

  const toggleLang = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  // Perbaikan 3: Pastikan return value selalu string dengan template literal `${}` atau String()
  const t = (key: TranslationKey): string => {
    const translation = translations[key];
    if (!translation) return String(key);
    return translation[lang];
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