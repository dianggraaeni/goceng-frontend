import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Image as ImageIcon, Paperclip, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export const Chat = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate message delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newUserMsg.id ? { ...msg, status: 'delivered' } : msg));
    }, 500);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newUserMsg.id ? { ...msg, status: 'read' } : msg));
    }, 1000);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oke, dicatat! Pengeluaran Rp 25.000. Sisa saldo kamu sekarang Rp 2.425.000. Hemat-hemat ya! 💸",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-2 border-orange-100 bg-[#E5DDD5] relative shadow-soft-hover">
        {/* Chat Header */}
        <div className="bg-surface p-4 border-b-2 border-orange-100 flex items-center gap-4 z-10 shadow-sm">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-sm relative">
            <Bot size={24} />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-accent">Goceng Bot</h2>
            <p className="text-xs text-text/60 font-medium">
              {isTyping ? <span className="text-primary italic">typing...</span> : 'Online'}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-50">
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
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-[10px] text-text/50 font-medium">{msg.time}</p>
                    {msg.sender === 'user' && (
                      <span className="text-text/40">
                        {msg.status === 'sent' && <Check size={12} />}
                        {msg.status === 'delivered' && <CheckCheck size={12} />}
                        {msg.status === 'read' && <CheckCheck size={12} className="text-blue-500" />}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm relative">
                  <div className="absolute top-0 -left-2 w-4 h-4 bg-white [clip-path:polygon(100%_0,100%_100%,0_0)]"></div>
                  <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-text/40 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-text/40 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-text/40 rounded-full"></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="bg-surface/80 backdrop-blur-sm px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-orange-100">
          {[t('quickReply1'), t('quickReply2'), t('quickReply3')].map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply)}
              className="whitespace-nowrap px-4 py-2 bg-orange-50 border border-orange-200 text-primary rounded-full text-sm font-bold hover:bg-orange-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="bg-surface p-4 z-10">
          <form onSubmit={onSubmit} className="flex items-center gap-2">
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
