import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Dropdown that lets the user switch between their linked
 * messaging-platform ledgers (WhatsApp / Telegram bots).
 *
 * Only rendered when there are 2+ accounts.
 */
export const AccountSwitcher = () => {
  const { messagingAccounts, selectedAccountId, setSelectedAccountId } = useAuth();
  const { lang } = useLanguage();

  // Nothing to switch when there is 0 or 1 account
  if (messagingAccounts.length < 2) return null;

  const platformLabel = (platform: string, externalId: string) => {
    if (platform === 'TELEGRAM') return `🤖 Telegram — ${externalId}`;
    if (platform === 'WHATSAPP') return `💬 WhatsApp — ${externalId}`;
    return externalId;
  };

  return (
    <div className="relative">
      <label className="sr-only">
        {lang === 'id' ? 'Pilih Akun Chatbot' : 'Select Chatbot Account'}
      </label>
      <select
        id="account-switcher"
        value={selectedAccountId || ''}
        onChange={(e) => setSelectedAccountId(e.target.value)}
        className="appearance-none bg-surface border-2 border-orange-200 rounded-xl px-4 py-2 pr-8 text-sm font-bold text-accent focus:outline-none focus:border-primary transition-colors cursor-pointer shadow-sm hover:border-primary/60"
      >
        {messagingAccounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {platformLabel(acc.platform, acc.externalId)}
          </option>
        ))}
      </select>

      {/* Custom chevron icon */}
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
};
