import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // Automatically log in after registration
    navigate('/dashboard', { replace: true });
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
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-soft transform -rotate-3 mb-4">
              <Wallet size={32} />
            </div>
            <h2 className="text-3xl text-accent text-center">Join GOCENG!</h2>
            <p className="text-text/70 mt-2 text-center">Start your fun financial journey today.</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                placeholder="Budi Santoso"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                placeholder="budi@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-background border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-medium transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button className="w-full mt-6" size="lg" type="submit">
              {t('register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text/70 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
