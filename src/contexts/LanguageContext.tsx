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
  featSectionTitle: { id: 'Fitur Unggulan GOCENG', en: 'GOCENG Key Features' },
  featSectionDesc: { id: 'Kelola keuangan jadi lebih mudah, pintar, dan menyenangkan.', en: 'Manage finances easier, smarter, and more fun.' },
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
  automatic: { id: 'Otomatis', en: 'Automatic' },
  food: { id: 'Makanan', en: 'Food' },
  remainingBudget: { id: 'Sisa Budget', en: 'Remaining Budget' },
  analytics: { id: 'Analitik', en: 'Analytics' },
  chatGoceng: { id: 'Chat Goceng', en: 'Goceng Chat' },
  chatExample1: { id: 'Makan siang 45rb pake gopay', en: 'Lunch 45k using gopay' },
  chatExample2: { id: 'Sip! Udah dicatat ya', en: 'Got it! Recorded' },
  manualRecord: { id: 'Catat Manual', en: 'Manual Record' },
  categoryFood: { id: 'Kategori: Makanan', en: 'Category: Food' },
  aiFeature1: { id: 'Atur budget bulan ini', en: 'Set this month budget' },
  aiFeature2: { id: 'Rekomendasi hemat', en: 'Saving tips' },
  aiFeature3: { id: 'Tanya konsultan', en: 'Ask consultant' },
  new: { id: 'Baru!', en: 'New!' },
  flexible: { id: 'Fleksibel', en: 'Flexible' },

  // Why Choose Goceng
  whyChooseGoceng: { id: 'Kenapa Pilih GOCENG?', en: 'Why Choose GOCENG?' },
  whyChooseGocengDesc: { id: 'Kelola uang nggak harus membosankan. Kami membuatnya simpel, pintar, dan seru.', en: 'Managing money doesn\'t have to be boring. We make it simple, smart, and fun.' },

  // How It Works
  howItWorks: { id: 'Cara Kerjanya', en: 'How It Works' },
  step1: { id: 'Chat di WhatsApp', en: 'Chat on WhatsApp' },
  step2: { id: 'Input Pemasukan/Pengeluaran', en: 'Input Income/Expense' },
  step3: { id: 'Dapatkan Insight', en: 'Get Insights' },
  step4: { id: 'Lacak Progres', en: 'Track Progress' },

  // Dashboard Preview
  dashboardPreview: { id: 'Intip Dasbor GOCENG', en: 'Sneak Peek at GOCENG Dashboard' },
  dashboardPreviewDesc: { id: 'Dasbor gamifikasi yang cantik menantimu.', en: 'A beautiful, gamified dashboard waiting for you.' },
  levelUp: { id: 'Naik Level!', en: 'Level Up!' },
  saverLevel: { id: 'Si Hemat Lvl 5', en: 'Saver Lvl 5' },

  // Testimonials
  testimonials: { id: 'Apa Kata Mereka?', en: 'What They Say' },
  testi1Name: { id: 'Budi S.', en: 'Budi S.' },
  testi1Role: { id: 'Mahasiswa', en: 'Student' },
  testi1Text: { id: 'Goceng ngebantu banget buat ngelacak pengeluaran kosan. Bot WA-nya juara!', en: 'Goceng really helps track my dorm expenses. The WA bot is a champion!' },
  testi2Name: { id: 'Siti A.', en: 'Siti A.' },
  testi2Role: { id: 'Freelancer', en: 'Freelancer' },
  testi2Text: { id: 'Laporannya bikin aku sadar ternyata sering banget jajan boba. Sekarang bisa lebih hemat.', en: 'The report made me realize I buy boba too often. Now I can save more.' },
  testi3Name: { id: 'Andi M.', en: 'Andi M.' },
  testi3Role: { id: 'Karyawan', en: 'Employee' },
  testi3Text: { id: 'Fitur gamifikasinya bikin nagih buat nabung. Nggak kerasa udah level 10 aja.', en: 'The gamification feature makes saving addictive. Didn\'t realize I\'m already level 10.' },
  
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
  blogDesc: { id: 'Tingkatkan pengetahuan finansialmu.', en: 'Level up your financial knowledge.' },
  viewAll: { id: 'Lihat Semua', en: 'View All' },
  readMore: { id: 'Baca Selengkapnya', en: 'Read More' },
  blog1Title: { id: '5 Cara Hemat Anak Kos', en: '5 Saving Tips for Students' },
  blog1Tag: { id: 'Tips', en: 'Tips' },
  blog2Title: { id: 'Kenapa Harus Punya Dana Darurat?', en: 'Why You Need an Emergency Fund?' },
  blog2Tag: { id: 'Edukasi', en: 'Education' },
  blog3Title: { id: 'Fitur Baru: Gamifikasi GOCENG', en: 'New Feature: GOCENG Gamification' },
  blog3Tag: { id: 'Update', en: 'Update' },

  // Contact
  contactUs: { id: 'Hubungi Kami', en: 'Contact Us' },
  contactDesc: { id: 'Mari perbaiki kebiasaan keuanganmu bersama-sama!', en: 'Let\'s improve your financial habits together!' },
  contactDesc2: { id: 'Bergabunglah bersama kami dalam membuat keuangan lebih mudah diakses dan menyenangkan bagi semua orang.', en: 'Join us in making finance more accessible and fun for everyone.' },
  yourName: { id: 'Nama Anda', en: 'Your Name' },
  yourEmail: { id: 'Email Anda', en: 'Your Email' },
  yourMessage: { id: 'Pesan Anda', en: 'Your Message' },
  send: { id: 'Kirim Pesan', en: 'Send Message' },

  // Auth
  joinGoceng: { id: 'Gabung GOCENG!', en: 'Join GOCENG!' },
  joinDesc: { id: 'Mulai perjalanan finansial serumu hari ini.', en: 'Start your fun financial journey today.' },
  name: { id: 'Nama', en: 'Name' },
  email: { id: 'Email', en: 'Email' },
  password: { id: 'Kata Sandi', en: 'Password' },
  alreadyHaveAccount: { id: 'Sudah punya akun?', en: 'Already have an account?' },
  welcomeBack: { id: 'Selamat Datang Kembali!', en: 'Welcome Back!' },
  readyToLevelUp: { id: 'Siap menaikkan level keuanganmu?', en: 'Ready to level up your finances?' },
  dontHaveAccount: { id: 'Belum punya akun?', en: 'Don\'t have an account?' },

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
  welcomeUser: { id: 'Selamat datang kembali, Budi! 👋', en: 'Welcome back, Budi! 👋' },
  streakMsg: { id: 'Kamu sedang dalam 5 hari streak menabung!', en: 'You\'re on a 5-day saving streak!' },
  streak: { id: 'Streak', en: 'Streak' },
  days: { id: 'Hari', en: 'Days' },
  reminderTitle: { id: 'Jangan lupa catat pengeluaran hari ini!', en: 'Don\'t forget to log today\'s expenses!' },
  reminderDesc: { id: 'Kamu belum mencatat makan siangmu. Yuk catat sekarang biar streak-nya nggak putus!', en: 'You haven\'t logged your lunch. Log it now so you don\'t lose your streak!' },
  logNow: { id: 'Catat', en: 'Log Now' },
  monthlyGoalProgress: { id: '70% menuju target bulananmu', en: '70% to your monthly goal' },
  fromLastMonthUp: { id: '+12% dari bulan lalu', en: '+12% from last month' },
  fromLastMonthDown: { id: '-5% dari bulan lalu', en: '-5% from last month' },
  thisWeek: { id: 'Minggu Ini', en: 'This Week' },
  thisMonth: { id: 'Bulan Ini', en: 'This Month' },
  catFood: { id: 'Makan & Minum', en: 'Food & Drinks' },
  catTransport: { id: 'Transportasi', en: 'Transportation' },
  catShopping: { id: 'Belanja', en: 'Shopping' },
  catEntertainment: { id: 'Hiburan', en: 'Entertainment' },
  catOther: { id: 'Lainnya', en: 'Others' },
  
  // Chat
  chatPlaceholder: { id: 'Ketik pesanmu di sini...', en: 'Type your message here...' },
  chatWelcome: { id: 'Halo! Aku Goceng, asisten keuanganmu. Ada yang bisa kubantu hari ini?', en: 'Hello! I am Goceng, your financial assistant. How can I help you today?' },
  quickReply1: { id: 'Catat Pengeluaran', en: 'Log Expense' },
  quickReply2: { id: 'Cek Saldo', en: 'Check Balance' },
  quickReply3: { id: 'Laporan Bulan Ini', en: 'This Month Report' },
  typing: { id: 'mengetik...', en: 'typing...' },
  online: { id: 'Online', en: 'Online' },
  botResponse: { id: 'Oke, dicatat! Pengeluaran Rp 25.000. Sisa saldo kamu sekarang Rp 2.425.000. Hemat-hemat ya! 💸', en: 'Okay, recorded! Expense Rp 25.000. Your remaining balance is Rp 2.425.000. Be frugal! 💸' },
  
  // Gamification
  goodJob: { id: 'Kerja Bagus!', en: 'Good Job!' },
  keepItUp: { id: 'Pertahankan!', en: 'Keep it up!' },
  badgeSaver: { id: 'Si Paling Hemat', en: 'Super Saver' },
  
  // Report
  monthlyReport: { id: 'Laporan Bulanan', en: 'Monthly Report' },
  expenseByCategory: { id: 'Pengeluaran per Kategori', en: 'Expense by Category' },
  reportTitle: { id: 'Laporan Keuangan 📊', en: 'Financial Report 📊' },
  savingsGoal: { id: 'Target Tabungan', en: 'Savings Goal' },
  badgesEarned: { id: 'Lencana Didapat', en: 'Badges Earned' },
  weeklyOverview: { id: 'Ringkasan Mingguan', en: 'Weekly Overview' },
  march2026: { id: 'Maret 2026', en: 'March 2026' },
  february2026: { id: 'Februari 2026', en: 'February 2026' },
  mon: { id: 'Sen', en: 'Mon' },
  tue: { id: 'Sel', en: 'Tue' },
  wed: { id: 'Rab', en: 'Wed' },
  thu: { id: 'Kam', en: 'Thu' },
  fri: { id: 'Jum', en: 'Fri' },
  sat: { id: 'Sab', en: 'Sat' },
  sun: { id: 'Min', en: 'Sun' },
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

const t = (key: keyof typeof translations): string => {
  if (!translations[key]) return String(key);
  return String(translations[key][lang]);
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
