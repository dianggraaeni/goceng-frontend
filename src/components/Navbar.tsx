import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';
import { Wallet, Globe, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('/');

  const isHomePage = location.pathname === '/';

  // --- LOGIKA PERBAIKAN: SCROLL KE SECTION DARI HALAMAN LAIN ---
  useEffect(() => {
    // Jika ada hash di URL (misal: #features) dan kita berada di home
    if (isHomePage && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Berikan sedikit delay agar browser selesai render komponen Landing
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.pathname, location.hash, isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setActiveSection(location.pathname);
        return;
      }

      const sections = ['features', 'faq', 'blog', 'contact'];
      let current = '/';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = `#${section}`;
          }
        }
      }

      if (window.scrollY < 50) {
        current = '/';
      }

      if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 100) {
        current = '#contact';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: t('dashboard') },
    { path: '/chat', label: t('chat') },
    { path: '/report', label: t('report') },
  ] : [
    { path: '/', label: t('home') },
    { path: isHomePage ? '#features' : '/#features', label: t('features') },
    { path: isHomePage ? '#faq' : '/#faq', label: t('faqNav') },
    { path: isHomePage ? '#blog' : '/#blog', label: t('news') },
    { path: isHomePage ? '#contact' : '/#contact', label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
            <img src="/logo.png" alt="Goceng Logo" className="w-10 h-10 object-contain" />
            <span className="font-heading font-bold text-2xl text-accent tracking-tight">GOCENG</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.path;
                const isAnchorOnHome = link.path.startsWith('#') && isHomePage;

                return isAnchorOnHome ? (
                  <a
                    key={link.path}
                    href={link.path}
                    className={`font-heading font-semibold text-sm transition-colors ${
                      isActive ? 'text-primary' : 'text-text/70 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (!link.path.includes('#')) window.scrollTo(0, 0);
                    }}
                    className={`font-heading font-semibold text-sm transition-colors ${
                      isActive ? 'text-primary' : 'text-text/70 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
              
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                  <LogOut size={16} /> {t('logout')}
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">{t('login')}</Button>
                </Link>
              )}
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
              {navLinks.map((link) => {
                const isActive = activeSection === link.path;
                const isAnchorOnHome = link.path.startsWith('#') && isHomePage;

                return isAnchorOnHome ? (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block font-heading font-semibold text-lg py-2 ${
                      isActive ? 'text-primary' : 'text-text/70'
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (!link.path.includes('#')) window.scrollTo(0, 0);
                      setIsOpen(false);
                    }}
                    className={`block font-heading font-semibold text-lg py-2 ${
                      isActive ? 'text-primary' : 'text-text/70'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4">
                {isAuthenticated ? (
                  <Button className="w-full gap-2" onClick={() => { logout(); setIsOpen(false); }}>
                    <LogOut size={16} /> {t('logout')}
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">{t('login')}</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};