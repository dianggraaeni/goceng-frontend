import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, TrendingUp, ShieldCheck, MessageCircle, ChevronDown, CheckCircle2, PieChart, Zap, Mail, Wallet, Instagram, Linkedin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-24 py-12 overflow-hidden">
      {/* 1. Hero Section (Upgrade) */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-300/20 rounded-full blur-[80px] -z-10"></div>

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/80 backdrop-blur-sm text-primary rounded-full font-heading font-bold text-sm border border-orange-200"
            >
              <Star size={16} className="fill-primary" />
              <span>#1 Fun Finance App</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-accent">
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-text/70 max-w-lg font-medium leading-relaxed">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="gap-2 text-lg px-8">
                {t('startTracking')} <ArrowRight size={20} />
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8 bg-white/50 backdrop-blur-sm">
                  {t('tryDemo')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            {/* Main Mascot Image */}
            <motion.img 
              src="/mascot.png" 
              alt="Goceng Mascot" 
              className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl"
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            
            {/* Floating Money Indicators */}
            <motion.div 
              animate={{ y: [20, -100], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} 
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} 
              className="absolute top-1/4 left-0 z-20 bg-green-100/90 backdrop-blur-sm text-green-700 font-bold px-4 py-2 rounded-2xl shadow-sm border border-green-200"
            >
              + Rp 50.000
            </motion.div>
            <motion.div 
              animate={{ y: [20, -100], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} 
              transition={{ repeat: Infinity, duration: 3.5, delay: 2 }} 
              className="absolute bottom-1/4 right-0 z-20 bg-red-100/90 backdrop-blur-sm text-red-700 font-bold px-4 py-2 rounded-2xl shadow-sm border border-red-200"
            >
              - Rp 15.000
            </motion.div>
            
            {/* Decorative floating elements behind */}
            <motion.div animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-3xl -z-10 opacity-50 blur-sm"></motion.div>
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute bottom-10 left-10 w-24 h-24 bg-primary rounded-full -z-10 opacity-30 blur-md"></motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="py-24 bg-orange-50/30 relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-accent mb-4">Fitur Unggulan GOCENG</h2>
            <p className="text-text/70 max-w-2xl mx-auto text-lg">Kelola keuangan jadi lebih mudah, pintar, dan menyenangkan.</p>
          </div>

          {/* Detailed Features Breakdown */}
          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="inline-block px-4 py-1.5 bg-orange-100 text-primary font-bold rounded-full text-sm">Fleksibel</div>
                <h3 className="text-3xl md:text-4xl font-bold text-accent">{t('featDetail1Title')}</h3>
                <p className="text-lg text-text/70 font-medium leading-relaxed">{t('featDetail1Desc')}</p>
                <Button className="gap-2">{t('tryNow')} <ArrowRight size={18} /></Button>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[400px] bg-gradient-to-br from-orange-100 to-red-50 rounded-[2rem] border-2 border-orange-200 overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute top-10 left-10 glass p-4 rounded-2xl shadow-soft animate-float">
                  <p className="text-sm font-bold text-text/70 mb-2">Chat Goceng</p>
                  <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tl-none text-sm">Makan siang 45rb pake gopay</div>
                  <div className="bg-white text-text px-4 py-2 rounded-2xl rounded-tr-none text-sm mt-2 border border-orange-100">Sip! Udah dicatat ya 🍔</div>
                </div>
                <div className="absolute bottom-10 right-10 bg-white p-4 rounded-2xl shadow-soft border-2 border-orange-100 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">📝</div>
                    <p className="font-bold text-sm">Catat Manual</p>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">Rp 45.000</div>
                  <div className="text-xs text-text/50">Kategori: Makanan</div>
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1 relative h-[400px] bg-gradient-to-br from-yellow-100 to-orange-50 rounded-[2rem] border-2 border-yellow-200 overflow-hidden flex items-center justify-center shadow-inner">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-soft border-4 border-yellow-200 z-10 animate-bounce-slow">🤖</div>
                <div className="absolute top-1/4 right-10 bg-white px-4 py-2 rounded-full shadow-sm border border-yellow-100 text-sm font-bold text-text/70 animate-float">Atur budget bulan ini ✨</div>
                <div className="absolute bottom-1/3 left-10 bg-white px-4 py-2 rounded-full shadow-sm border border-yellow-100 text-sm font-bold text-text/70 animate-float" style={{ animationDelay: '0.5s' }}>Minta rekomendasi hemat 💡</div>
                <div className="absolute bottom-16 right-20 bg-white px-4 py-2 rounded-full shadow-sm border border-yellow-100 text-sm font-bold text-text/70 animate-float" style={{ animationDelay: '1.5s' }}>Tanya konsultan 💬</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2 space-y-6">
                <div className="inline-block px-4 py-1.5 bg-red-100 text-red-600 font-bold rounded-full text-sm">Baru!</div>
                <h3 className="text-3xl md:text-4xl font-bold text-accent">{t('featDetail2Title')}</h3>
                <p className="text-lg text-text/70 font-medium leading-relaxed">{t('featDetail2Desc')}</p>
                <Button className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500">{t('tryNow')} <ArrowRight size={18} /></Button>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">Otomatis</div>
                <h3 className="text-3xl md:text-4xl font-bold text-accent">{t('featDetail3Title')}</h3>
                <p className="text-lg text-text/70 font-medium leading-relaxed">{t('featDetail3Desc')}</p>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600">{t('tryNow')} <ArrowRight size={18} /></Button>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border-2 border-blue-100 overflow-hidden flex items-center justify-center shadow-inner">
                <div className="w-48 h-64 bg-white rounded-xl shadow-soft border border-gray-200 p-4 relative overflow-hidden">
                  <div className="w-full h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-3/4 h-3 bg-gray-100 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-100 rounded mb-6"></div>
                  <div className="flex justify-between mb-2"><div className="w-1/3 h-3 bg-gray-100 rounded"></div><div className="w-1/4 h-3 bg-gray-200 rounded"></div></div>
                  <div className="flex justify-between mb-2"><div className="w-1/3 h-3 bg-gray-100 rounded"></div><div className="w-1/4 h-3 bg-gray-200 rounded"></div></div>
                  <div className="flex justify-between mt-6 pt-4 border-t border-dashed"><div className="w-1/3 h-4 bg-gray-200 rounded"></div><div className="w-1/3 h-4 bg-primary/40 rounded"></div></div>
                  
                  {/* Scanning line animation */}
                  <motion.div 
                    animate={{ y: [0, 200, 0] }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  ></motion.div>
                </div>
              </motion.div>
            </div>

            {/* Feature 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1 relative h-[400px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border-2 border-green-100 overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute top-12 left-12 bg-white p-4 rounded-2xl shadow-soft border border-green-100 animate-float">
                  <PieChart size={48} className="text-green-500 mb-2" />
                  <p className="text-xs font-bold text-text/50">Makanan</p>
                  <p className="font-bold text-accent">45%</p>
                </div>
                <div className="absolute bottom-12 right-12 bg-white p-4 rounded-2xl shadow-soft border border-green-100 animate-float" style={{ animationDelay: '1s' }}>
                  <TrendingUp size={48} className="text-primary mb-2" />
                  <p className="text-xs font-bold text-text/50">Sisa Budget</p>
                  <p className="font-bold text-accent">Rp 1.2M</p>
                </div>
                <div className="w-32 h-32 rounded-full border-8 border-green-400 border-t-primary border-r-yellow-400 transform rotate-45"></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2 space-y-6">
                <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm">Analitik</div>
                <h3 className="text-3xl md:text-4xl font-bold text-accent">{t('featDetail4Title')}</h3>
                <p className="text-lg text-text/70 font-medium leading-relaxed">{t('featDetail4Desc')}</p>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600">{t('tryNow')} <ArrowRight size={18} /></Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose GOCENG */}
      <section className="py-24 bg-gradient-to-br from-orange-100/80 to-red-50/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-accent mb-4">Why Choose GOCENG?</h2>
            <p className="text-text/70 max-w-2xl mx-auto text-lg">Managing money doesn't have to be boring. We make it simple, smart, and fun.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MessageCircle size={32} />, title: t('feat1Title'), desc: t('feat1Desc'), color: "text-green-600", bg: "bg-green-100" },
              { icon: <Zap size={32} />, title: t('feat2Title'), desc: t('feat2Desc'), color: "text-yellow-600", bg: "bg-yellow-100" },
              { icon: <PieChart size={32} />, title: t('feat3Title'), desc: t('feat3Desc'), color: "text-purple-600", bg: "bg-purple-100" },
              { icon: <ShieldCheck size={32} />, title: t('feat4Title'), desc: t('feat4Desc'), color: "text-blue-600", bg: "bg-blue-100" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-[2rem] text-center flex flex-col items-center gap-4 relative overflow-hidden group bg-white/60 hover:bg-white/80 transition-colors"
              >
                <div className={`w-20 h-20 ${feature.bg} ${feature.color} rounded-3xl flex items-center justify-center mb-2 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-accent">{feature.title}</h3>
                <p className="text-text/70 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dashboard Preview (NEW) */}
      <section className="py-16 px-8 lg:px-12 bg-white rounded-[3rem] border border-orange-100 relative overflow-hidden shadow-sm">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-accent mb-4">{t('dashboardPreview')}</h2>
          <p className="text-text/70 max-w-2xl mx-auto text-lg">A beautiful, gamified dashboard waiting for you.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Decorative background for mockup */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-red-200 rounded-[3rem] transform rotate-2 scale-105 opacity-50 blur-sm"></div>
          
          {/* Mockup Container */}
          <div className="relative bg-surface rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden">
            {/* Mockup Header */}
            <div className="h-12 bg-gray-100 border-b flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Mockup Content */}
            <div className="p-8 bg-background grid grid-cols-3 gap-6">
              <div className="col-span-3 flex justify-between items-center mb-4">
                <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="w-24 h-10 bg-orange-100 rounded-xl animate-pulse"></div>
                  <div className="w-24 h-10 bg-yellow-100 rounded-xl animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-1 h-32 bg-primary/80 rounded-2xl animate-pulse"></div>
              <div className="col-span-1 h-32 bg-white rounded-2xl shadow-sm animate-pulse"></div>
              <div className="col-span-1 h-32 bg-white rounded-2xl shadow-sm animate-pulse"></div>
              <div className="col-span-2 h-64 bg-white rounded-2xl shadow-sm animate-pulse"></div>
              <div className="col-span-1 h-64 bg-white rounded-2xl shadow-sm animate-pulse"></div>
            </div>
          </div>

          {/* Floating UI Elements over Mockup */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -left-8 top-1/4 glass p-4 rounded-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><TrendingUp size={20}/></div>
            <div>
              <p className="text-xs text-text/50 font-bold">Income</p>
              <p className="font-bold text-green-600">+Rp 500k</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10] }} 
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -right-8 bottom-1/4 glass p-4 rounded-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Star size={20}/></div>
            <div>
              <p className="text-xs text-text/50 font-bold">Level Up!</p>
              <p className="font-bold text-yellow-600">Saver Lvl 5</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. Testimonials (NEW) */}
      <section className="py-16 px-8 lg:px-12 bg-yellow-100/60 rounded-[3rem] border border-yellow-200 relative overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-accent mb-4">{t('testimonials')}</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Siti A.", role: "Mahasiswa", text: "GOCENG bikin aku rajin nabung. UI-nya lucu banget kayak main game!", rating: 5 },
            { name: "Budi P.", role: "Freelancer", text: "Catat pengeluaran via WA itu life-changer. Nggak perlu buka app ribet.", rating: 5 },
            { name: "Rina M.", role: "Karyawan", text: "Laporannya gampang dibaca. Skor kesehatanku sekarang A+!", rating: 4 }
          ].map((review, idx) => (
            <Card key={idx} hoverable className="flex flex-col gap-4 relative">
              <div className="absolute -top-4 -right-4 text-6xl opacity-10">💬</div>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-text/80 font-medium italic">"{review.text}"</p>
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-orange-100">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center font-bold text-primary">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-bold text-accent">{review.name}</p>
                  <p className="text-xs text-text/50">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section (NEW) */}
      <section id="faq" className="py-16 px-8 lg:px-12 bg-orange-50/50 rounded-[3rem] shadow-sm border border-orange-100 relative overflow-hidden max-w-4xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-accent mb-4">{t('faq')}</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { q: t('faq1Q'), a: t('faq1A') },
            { q: t('faq2Q'), a: t('faq2A') },
            { q: t('faq3Q'), a: t('faq3A') }
          ].map((faq, idx) => (
            <motion.div 
              key={idx}
              className="bg-surface border-2 border-orange-100 rounded-2xl overflow-hidden"
              initial={false}
            >
              <button 
                className="w-full px-6 py-4 flex justify-between items-center font-bold text-left text-accent hover:bg-orange-50 transition-colors"
                onClick={() => toggleFaq(idx)}
              >
                {faq.q}
                <motion.div animate={{ rotate: activeFaq === idx ? 180 : 0 }}>
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4 text-text/70 font-medium"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Blog / News Section (NEW) */}
      <section id="blog" className="py-16 px-8 lg:px-12 bg-red-50/60 rounded-[3rem] border border-red-100 relative overflow-hidden scroll-mt-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl text-accent mb-2">{t('blog')}</h2>
            <p className="text-text/70 text-lg">Level up your financial knowledge.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex">View All</Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "5 Cara Hemat Anak Kos", img: "bg-orange-200", tag: "Tips" },
            { title: "Kenapa Harus Punya Dana Darurat?", img: "bg-red-200", tag: "Edukasi" },
            { title: "Fitur Baru: Gamifikasi GOCENG", img: "bg-yellow-200", tag: "Update" }
          ].map((post, idx) => (
            <Card key={idx} hoverable className="p-0 overflow-hidden flex flex-col">
              <div className={`h-48 ${post.img} relative`}>
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                  {post.tag}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-accent mb-4">{post.title}</h3>
                <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  {t('readMore')} <ArrowRight size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. Contact Section (NEW) */}
      <section id="contact" className="py-16 px-8 lg:px-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-[3rem] border border-orange-200 relative overflow-hidden scroll-mt-24">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10"></div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
          {/* Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Goceng Logo" className="w-10 h-10 object-contain" />
              <span className="font-heading font-bold text-2xl text-accent tracking-tight">GOCENG</span>
            </div>
            
            <p className="text-lg text-text/70 font-medium max-w-md leading-relaxed">
              {t('contactDesc')} Bergabunglah bersama kami dalam membuat keuangan lebih mudah diakses dan menyenangkan bagi semua orang.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-soft-hover border-2 border-orange-100 bg-white/80 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-primary mb-6">{t('contactUs')}</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Nama Anda" 
                    className="w-full bg-orange-50/50 border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Anda" 
                    className="w-full bg-orange-50/50 border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Pesan Anda" 
                    rows={4}
                    className="w-full bg-orange-50/50 border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors resize-none"
                  ></textarea>
                </div>
                <Button className="w-full mt-2 gap-2" size="lg" type="submit">
                  {t('send')} <Send size={18} />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
