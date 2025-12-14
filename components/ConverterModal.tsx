import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, ArrowRight } from 'lucide-react';
import * as api from '../services/api';
import Button from './ui/Button';

interface ConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConverterModal: React.FC<ConverterModalProps> = ({ isOpen, onClose }) => {
  const [rates, setRates] = useState<any>(null);
  const [amount, setAmount] = useState<number>(1);
  const [fromCurr, setFromCurr] = useState('usd');
  const [toCurr, setToCurr] = useState('eur');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && !rates) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    const data = await api.fetchRates();
    setRates(data);
    setLoading(false);
  };

  const getRate = (curr: string) => {
    if (!rates) return 0;
    if (curr === 'usd' && toCurr === 'eur') return 0.92;
    if (curr === 'eur' && toCurr === 'usd') return 1.09;
    if (curr === 'bitcoin') return rates.bitcoin?.[toCurr] || 0;
    if (curr === 'ethereum') return rates.ethereum?.[toCurr] || 0;
    return 1;
  };

  const result = rates ? (amount * getRate(fromCurr)).toLocaleString('en-US', { style: 'currency', currency: toCurr.toUpperCase() }) : '...';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          <div className="bg-primary/5 p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
             <h3 className="font-bold text-gray-900 dark:text-white">Currency Converter</h3>
             <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
               <X size={20} className="text-gray-500" />
             </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
               <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Amount</label>
                 <input 
                   type="number" 
                   value={amount}
                   onChange={e => setAmount(Number(e.target.value))}
                   className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2"
                 />
               </div>
               <div className="pt-5 text-gray-400">
                 <ArrowRight />
               </div>
               <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Result</label>
                 <div className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 font-bold text-primary truncate">
                   {loading ? '...' : result}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <select 
                    value={fromCurr} 
                    onChange={e => setFromCurr(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="bitcoin">BTC</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <select 
                    value={toCurr} 
                    onChange={e => setToCurr(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="eur">EUR</option>
                    <option value="usd">USD</option>
                  </select>
               </div>
            </div>

            <Button onClick={fetchData} variant="secondary" className="w-full py-2 text-sm">
               <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Update Rates
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConverterModal;