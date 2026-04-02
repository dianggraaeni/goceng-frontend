import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { ArrowRight, Star, TrendingUp, ShieldCheck, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-16 py-12">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-primary rounded-full font-heading font-bold text-sm">
            <Star size={16} className="fill-primary" />
            <span>#1 Fun Finance App</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-text">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-text/70 max-w-lg font-medium">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2">
              {t('startTracking')} <ArrowRight size={20} />
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                {t('dashboard')}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Decorative background blob */}
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
          
          {/* Main Illustration Placeholder */}
          <div className="relative z-10 w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-primary to-accent rounded-[3rem] shadow-soft-hover flex items-center justify-center p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-surface rounded-[2rem] flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden">
              {/* Cute Mascot Placeholder */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center border-4 border-primary"
              >
                <span className="text-6xl">💸</span>
              </motion.div>
              <div className="text-center">
                <h3 className="font-heading text-2xl text-accent">Hi, I'm Goceng!</h3>
                <p className="text-text/70 font-medium">Ready to save some coins?</p>
              </div>
              
              {/* Floating elements */}
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-8 left-8 bg-green-100 text-green-700 font-bold px-3 py-1 rounded-xl shadow-sm transform -rotate-12">+ Rp 50.000</motion.div>
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="absolute bottom-12 right-6 bg-red-100 text-red-700 font-bold px-3 py-1 rounded-xl shadow-sm transform rotate-12">- Rp 15.000</motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 w-full mt-12">
        {[
          { icon: <MessageCircle size={32} />, title: "WhatsApp Bot", desc: "Just chat to track expenses. No complicated forms!" },
          { icon: <TrendingUp size={32} />, title: "Level Up", desc: "Earn XP and badges as you save more money." },
          { icon: <ShieldCheck size={32} />, title: "Secure & Safe", desc: "Your financial data is encrypted and safe with us." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface p-8 rounded-3xl border-2 border-orange-100 shadow-soft text-center flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mb-2 transform -rotate-3">
              {feature.icon}
            </div>
            <h3 className="text-xl">{feature.title}</h3>
            <p className="text-text/70">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
