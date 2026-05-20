import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.93 2.92C22.09 2.5 21.98 2.03 21.65 1.74C21.32 1.45 20.84 1.41 20.47 1.63L2.47 12.63C2.12 12.84 1.93 13.25 1.99 13.66C2.05 14.07 2.37 14.4 2.78 14.48L7.49 15.43L10.02 21.14C10.21 21.56 10.63 21.84 11.09 21.84C11.14 21.84 11.19 21.84 11.24 21.83C11.75 21.75 12.16 21.37 12.28 20.87L13.56 16.64L18.42 20.57C18.67 20.78 18.99 20.87 19.31 20.83C19.62 20.78 19.91 20.6 20.08 20.33L21.93 2.92ZM13.84 14.89L11.51 16.78L10.01 13.38L18.17 6.4L7.86 13.91L4.01 13.14L19.46 3.7L13.84 14.89Z" fill="#2AABEE"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19L7.6 18.82L4.43 19.65L5.28 16.55L5.09 16.24C4.3 14.94 3.87 13.44 3.87 11.91C3.87 7.4 7.54 3.73 12.05 3.73C14.24 3.73 16.3 4.58 17.85 6.14C19.4 7.69 20.25 9.75 20.25 11.93C20.25 16.44 16.58 20.15 12.04 20.15ZM16.53 14.01C16.28 13.88 15.06 13.28 14.84 13.2C14.62 13.11 14.45 13.07 14.29 13.32C14.13 13.57 13.66 14.11 13.52 14.28C13.37 14.45 13.23 14.47 12.98 14.34C12.73 14.22 11.93 13.96 10.98 13.11C10.24 12.45 9.74 11.62 9.6 11.37C9.45 11.12 9.58 10.99 9.71 10.87C9.82 10.76 9.96 10.58 10.09 10.43C10.21 10.28 10.25 10.18 10.33 10.01C10.41 9.84 10.37 9.69 10.31 9.57C10.25 9.44 9.75 8.22 9.54 7.72C9.34 7.23 9.13 7.3 8.98 7.3C8.84 7.3 8.67 7.3 8.51 7.3C8.35 7.3 8.08 7.36 7.85 7.61C7.62 7.86 6.98 8.46 6.98 9.69C6.98 10.92 7.89 12.1 8.01 12.27C8.13 12.44 9.77 15 12.3 16.09C12.9 16.35 13.37 16.5 13.75 16.62C14.35 16.81 14.89 16.78 15.31 16.72C15.79 16.65 16.8 16.12 17.01 15.53C17.22 14.94 17.22 14.44 17.16 14.33C17.09 14.22 16.93 14.16 16.68 14.03" fill="#25D366"/>
  </svg>
);

export const AccountSwitcher = () => {
  const { messagingAccounts, selectedAccountId, setSelectedAccountId } = useAuth();
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Do not render if there are no accounts connected
  if (messagingAccounts.length === 0) return null;

  const selectedAccount = messagingAccounts.find((a) => a.id === selectedAccountId) || messagingAccounts[0];

  const getPlatformIcon = (platform: string) => {
    if (platform === 'TELEGRAM') return <TelegramIcon />;
    if (platform === 'WHATSAPP') return <WhatsAppIcon />;
    return null;
  };

  const getPlatformName = (platform: string) => {
    if (platform === 'TELEGRAM') return 'Telegram';
    if (platform === 'WHATSAPP') return 'WhatsApp';
    return platform;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[200px] bg-white border-2 border-orange-200 rounded-xl px-4 py-2 text-sm font-bold text-accent focus:outline-none focus:border-primary transition-all shadow-sm hover:border-primary/60"
      >
        <div className="flex items-center gap-2 truncate">
          {getPlatformIcon(selectedAccount.platform)}
          <span className="truncate">
            {getPlatformName(selectedAccount.platform)} — <span className="text-text/70">{selectedAccount.externalId}</span>
          </span>
        </div>
        <ChevronDown size={16} className={`ml-2 text-text/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1"
          >
            {messagingAccounts.map((acc) => {
              const isSelected = acc.id === selectedAccountId;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    isSelected ? 'bg-orange-50 font-bold text-primary' : 'hover:bg-gray-50 text-accent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={isSelected ? 'scale-110 transition-transform' : 'opacity-80'}>
                      {getPlatformIcon(acc.platform)}
                    </div>
                    <span className="truncate">
                      {getPlatformName(acc.platform)} <br/>
                      <span className={`text-xs font-normal ${isSelected ? 'text-primary/70' : 'text-text/50'}`}>
                        {acc.externalId}
                      </span>
                    </span>
                  </div>
                  {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

