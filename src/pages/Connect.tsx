import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TelegramIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.93 2.92C22.09 2.5 21.98 2.03 21.65 1.74C21.32 1.45 20.84 1.41 20.47 1.63L2.47 12.63C2.12 12.84 1.93 13.25 1.99 13.66C2.05 14.07 2.37 14.4 2.78 14.48L7.49 15.43L10.02 21.14C10.21 21.56 10.63 21.84 11.09 21.84C11.14 21.84 11.19 21.84 11.24 21.83C11.75 21.75 12.16 21.37 12.28 20.87L13.56 16.64L18.42 20.57C18.67 20.78 18.99 20.87 19.31 20.83C19.62 20.78 19.91 20.6 20.08 20.33L21.93 2.92ZM13.84 14.89L11.51 16.78L10.01 13.38L18.17 6.4L7.86 13.91L4.01 13.14L19.46 3.7L13.84 14.89Z" fill="#2AABEE"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19L7.6 18.82L4.43 19.65L5.28 16.55L5.09 16.24C4.3 14.94 3.87 13.44 3.87 11.91C3.87 7.4 7.54 3.73 12.05 3.73C14.24 3.73 16.3 4.58 17.85 6.14C19.4 7.69 20.25 9.75 20.25 11.93C20.25 16.44 16.58 20.15 12.04 20.15ZM16.53 14.01C16.28 13.88 15.06 13.28 14.84 13.2C14.62 13.11 14.45 13.07 14.29 13.32C14.13 13.57 13.66 14.11 13.52 14.28C13.37 14.45 13.23 14.47 12.98 14.34C12.73 14.22 11.93 13.96 10.98 13.11C10.24 12.45 9.74 11.62 9.6 11.37C9.45 11.12 9.58 10.99 9.71 10.87C9.82 10.76 9.96 10.58 10.09 10.43C10.21 10.28 10.25 10.18 10.33 10.01C10.41 9.84 10.37 9.69 10.31 9.57C10.25 9.44 9.75 8.22 9.54 7.72C9.34 7.23 9.13 7.3 8.98 7.3C8.84 7.3 8.67 7.3 8.51 7.3C8.35 7.3 8.08 7.36 7.85 7.61C7.62 7.86 6.98 8.46 6.98 9.69C6.98 10.92 7.89 12.1 8.01 12.27C8.13 12.44 9.77 15 12.3 16.09C12.9 16.35 13.37 16.5 13.75 16.62C14.35 16.81 14.89 16.78 15.31 16.72C15.79 16.65 16.8 16.12 17.01 15.53C17.22 14.94 17.22 14.44 17.16 14.33C17.09 14.22 16.93 14.16 16.68 14.03" fill="#25D366"/>
  </svg>
);

const RippleRings = () => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 2, opacity: [0, 0.5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-48 h-48 rounded-full border-[1.5px] border-orange-200/50"
    />
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
      transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-48 h-48 rounded-full border-[1.5px] border-orange-200/30"
    />
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 3, opacity: [0, 0.1, 0] }}
      transition={{ duration: 3, delay: 2, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-48 h-48 rounded-full border-[1px] border-orange-200/10"
    />
  </div>
);

export const Connect = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative bg-orange-50/30 overflow-hidden py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-[100px] -z-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-300/10 rounded-full blur-[80px] -z-20"></div>

      {/* Back Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-100 shadow-sm">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center mt-12 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-12 md:mt-0"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-accent tracking-tight mb-4">
            Pilih platform untuk mulai
          </h1>
          <p className="text-lg text-text/60 font-medium">
            Goceng terintegrasi penuh dengan dua aplikasi perpesanan populer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-32 w-full max-w-4xl px-4 md:px-0">
          
          {/* WhatsApp Card */}
          <motion.a 
            href="https://wa.me/62895622767316"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative flex items-center justify-center mb-8">
              <RippleRings />
              <div className="w-48 h-48 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center border border-orange-50 group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] group-hover:scale-105 transition-all duration-300 relative z-10">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <WhatsAppIcon />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-accent mb-2">WhatsApp API</h3>
            <p className="text-center text-text/60 font-medium max-w-[250px]">
              Cocok untuk pemakaian harian yang stabil dan cepat.
            </p>
          </motion.a>

          {/* Telegram Card */}
          <motion.a 
            href="https://t.me/Goceng_ChatBot"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative flex items-center justify-center mb-8">
              <RippleRings />
              <div className="w-48 h-48 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center border border-orange-50 group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] group-hover:scale-105 transition-all duration-300 relative z-10">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <TelegramIcon />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-accent mb-2">Telegram API</h3>
            <p className="text-center text-text/60 font-medium max-w-[250px]">
              Setup instan tanpa verifikasi dan bebas hambatan.
            </p>
          </motion.a>

        </div>
      </div>
    </div>
  );
};
