import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Send, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import * as api from '../services/api';

const Pix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    await api.sendPix(Number(amount) * 100, `Pix to ${pixKey}`);
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setAmount('');
      setPixKey('');
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="glass-panel p-1 rounded-lg flex space-x-1">
          <button 
            onClick={() => setActiveTab('send')}
            className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'send' ? 'bg-finnova-500 text-finnova-navy font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Send Pix
          </button>
          <button 
             onClick={() => setActiveTab('receive')}
             className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'receive' ? 'bg-finnova-500 text-finnova-navy font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Receive (QR)
          </button>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
             <motion.div 
               key="success"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className="flex flex-col items-center justify-center h-full py-12"
             >
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 text-finnova-navy"
               >
                 <CheckCircle size={40} />
               </motion.div>
               <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
               <p className="text-gray-400">R$ {amount} sent to {pixKey}</p>
             </motion.div>
          ) : activeTab === 'send' ? (
            <motion.form 
              key="send-form"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              onSubmit={handleSend}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Send className="mr-2 text-finnova-500" /> Send Pix
              </h2>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Pix Key (Email, CPF, or Phone)</label>
                <input 
                  type="text" 
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-finnova-500 outline-none"
                  placeholder="e.g. joao@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">R$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-finnova-500 outline-none"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg" isLoading={status === 'processing'}>
                Confirm Transfer
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="receive-qr"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <QrCode className="mr-2 text-finnova-500" /> Receive Payment
              </h2>

              <div className="bg-white p-4 rounded-xl mb-6">
                {/* Simulated QR Code using SVG pattern */}
                <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect width="100" height="100" fill="white"/>
                   <path d="M10 10h30v30h-30zM60 10h30v30h-30zM10 60h30v30h-30z" stroke="black" strokeWidth="5"/>
                   <rect x="20" y="20" width="10" height="10" fill="black"/>
                   <rect x="70" y="20" width="10" height="10" fill="black"/>
                   <rect x="20" y="70" width="10" height="10" fill="black"/>
                   <path d="M50 10v10h10v-10zM10 50h10v10h-10zM50 50h30v30h-30zM70 70h10v10h-10z" fill="black"/>
                   <rect x="45" y="45" width="10" height="10" fill="black" />
                </svg>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">Scan to pay mariana.silva@finnova.com</p>
                <button className="text-finnova-500 text-sm font-bold hover:underline">Copy Pix Copy & Paste</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pix;