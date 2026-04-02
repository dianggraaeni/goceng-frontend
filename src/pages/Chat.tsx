import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Image as ImageIcon, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

export const Chat = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatWelcome'),
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oke, dicatat! Pengeluaran Rp 25.000 untuk Makan Siang. Sisa saldo kamu sekarang Rp 2.425.000. Hemat-hemat ya! 💸",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-2 border-orange-100 bg-[#E5DDD5] relative">
        {/* Chat Header */}
        <div className="bg-surface p-4 border-b-2 border-orange-100 flex items-center gap-4 z-10">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-accent">Goceng Bot</h2>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm relative ${
                  msg.sender === 'user' 
                    ? 'bg-[#D9FDD3] rounded-tr-none text-text' 
                    : 'bg-white rounded-tl-none text-text'
                }`}>
                  {/* Tail for speech bubble */}
                  <div className={`absolute top-0 w-4 h-4 ${
                    msg.sender === 'user'
                      ? '-right-2 bg-[#D9FDD3] [clip-path:polygon(0_0,0%_100%,100%_0)]'
                      : '-left-2 bg-white [clip-path:polygon(100%_0,100%_100%,0_0)]'
                  }`}></div>
                  
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] text-text/50 text-right mt-1 font-medium">{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-surface p-4 border-t-2 border-orange-100 z-10">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button type="button" className="p-3 text-text/50 hover:text-primary transition-colors rounded-full hover:bg-orange-50">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="flex-1 bg-background border-2 border-orange-100 rounded-full px-6 py-3 focus:outline-none focus:border-primary font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-soft hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
