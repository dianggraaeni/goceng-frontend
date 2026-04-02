import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/Button';
import { Wallet, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/dashboard', label: t('dashboard') },
    { path: '/chat', label: t('chat') },
    { path: '/report', label: t('report') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-soft transform rotate-3">
              <Wallet size={24} />
            </div>
            <span className="font-heading font-bold text-2xl text-accent tracking-tight">GOCENG</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-heading font-semibold text-sm transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-text/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 text-sm font-bold text-text/70 hover:text-primary transition-colors"
                aria-label="Toggle Language"
              >
                <Globe size={18} />
                <span className="uppercase">{lang}</span>
              </button>
              <Link to="/login">
                <Button variant="outline" size="sm">{t('login')}</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm font-bold text-text/70"
            >
              <Globe size={18} />
              <span className="uppercase">{lang}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b-2 border-orange-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block font-heading font-semibold text-lg py-2 ${
                    location.pathname === link.path ? 'text-primary' : 'text-text/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">{t('login')}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
