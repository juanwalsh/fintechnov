require('dotenv').config();
// Ou se estiver usando import: import 'dotenv/config';

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Acessando a chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { analyzeFinances } from '../services/geminiService';
import { useAuth } from '../App';
import { MOCK_TRANSACTIONS } from '../mocks/data';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AiAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name.split(' ')[0]}! I'm Nova, your financial assistant. I can analyze your spending, suggest savings, or answer questions about your finances. How can I help today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare context
    const context = JSON.stringify({
      balance: user?.balance,
      transactions: MOCK_TRANSACTIONS.slice(0, 10)
    });

    const aiResponseText = await analyzeFinances(userMsg.text, context);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText || "I'm having trouble thinking right now.",
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 glass-panel rounded-t-2xl p-6 overflow-y-auto space-y-6 bg-white/50 dark:bg-transparent">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mx-2 ${msg.sender === 'user' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {msg.sender === 'user' ? <UserIcon size={16} className="text-white" /> : <Bot size={16} className="text-gray-600 dark:text-gray-300" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
              }`}>
                 <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                 <span className={`text-xs mt-2 block ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                   {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 p-4 rounded-xl rounded-tl-none ml-12">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="glass-panel border-t border-gray-100 dark:border-white/10 rounded-b-2xl p-4 flex gap-4 bg-white dark:bg-[#111B2E]">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ask Nova about your spending..."
          className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="bg-primary hover:bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;