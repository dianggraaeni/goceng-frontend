import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '@/lib/api';

export const Login = () => {
  const { t } = useLanguage();

  const handleGoogleAuth = () => {
    // Langsung arahkan ke backend OAuth
    window.location.href = buildApiUrl('/auth/google');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center mb-8">
            {/* LOGO */}
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-soft transform rotate-3 mb-6 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo Goceng" 
                className="w-12 h-12 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-accent mb-2">
              {t('welcomeBack')}
            </h2>
            <p className="text-text/70">
              Masuk atau daftar secara instan dengan akun Google Anda.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full py-7 text-lg bg-white border-2 border-gray-100 hover:border-primary text-black hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm transition-all"
              onClick={handleGoogleAuth}
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="w-6 h-6" 
              />
              Lanjutkan dengan Google
            </Button>
            
            <p className="text-xs text-text/50 px-4">
              Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Goceng.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-text/70">
              Butuh bantuan? <Link to="/contact" className="text-primary font-bold">Hubungi Kami</Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
