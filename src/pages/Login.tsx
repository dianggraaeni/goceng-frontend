import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to backend OAuth route which forwards to Google Consent Screen
    window.location.href = "http://localhost:3001/v1/auth/google";
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="flex flex-col items-center mb-8">

            {/* LOGO DIGANTI DI SINI */}
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft transform rotate-3 mb-4 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>

            <h2 className="text-3xl text-accent text-center">{t('welcomeBack')}</h2>
            <p className="text-text/70 mt-2 text-center">{t('readyToLevelUp')}</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-1">
                {t('email')}
              </label>
              <input 
                type="email" 
                className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                placeholder="budi@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-1">
                {t('password')}
              </label>
              <input 
                type="password" 
                className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button className="w-full mt-6 bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2" size="lg" type="button" onClick={handleLogin}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              {t('login')} with Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text/70 font-medium">
              {t('dontHaveAccount')}{' '}
              <Link 
                to="/register" 
                className="text-primary font-bold hover:underline"
              >
                {t('register')}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};