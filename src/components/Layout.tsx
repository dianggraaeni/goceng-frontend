import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      {/* Floating Telegram Button */}
      <motion.a
        href="https://t.me/Goceng_ChatBot"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#2AABEE] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-50 border-4 border-white"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Send size={28} />
      </motion.a>
    </div>
  );
};
