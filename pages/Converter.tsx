import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import * as api from '../services/api';
import Button from '../components/ui/Button';

const Converter: React.FC = () => {
  const [rates, setRates] = useState<any>(null);
  const [amount, setAmount] = useState<number>(1);
  const [fromCurr, setFromCurr] = useState('usd');
  const [toCurr, setToCurr] = useState('eur');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await api.fetchRates();
    setRates(data);
    setLoading(false);
  };

  const getRate = (curr: string) => {
    if (!rates) return 0;
    
    // Demo Logic: Simulate USD <-> EUR
    if (curr === 'usd' && toCurr === 'eur') return 0.92;
    if (curr === 'eur' && toCurr === 'usd') return 1.09;
    
    // Crypto logic
    if (curr === 'bitcoin') return rates.bitcoin?.[toCurr] || 0;
    if (curr === 'ethereum') return rates.ethereum?.[toCurr] || 0;

    return 1;
  };

  const result = rates ? (amount * getRate(fromCurr)).toLocaleString('en-US', { style: 'currency', currency: toCurr.toUpperCase() }) : '...';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Currency Converter</h2>

      <div className="glass-panel p-8 rounded-2xl bg-card border border-border">
        <div className="flex flex-col space-y-6">
          
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
               <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Amount</label>
               <input 
                 type="number" 
                 value={amount}
                 onChange={e => setAmount(Number(e.target.value))}
                 className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground text-xl focus:ring-2 focus:ring-primary outline-none"
               />
            </div>
            <div>
               <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">From</label>
               <select 
                 value={fromCurr}
                 onChange={e => setFromCurr(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none"
               >
                 <option value="usd">USD - US Dollar</option>
                 <option value="eur">EUR - Euro</option>
                 <option value="bitcoin">BTC - Bitcoin</option>
                 <option value="ethereum">ETH - Ethereum</option>
               </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-white/10 p-2 rounded-full">
              <ArrowRight className="text-gray-400 rotate-90 md:rotate-0" />
            </div>
          </div>

          <div>
             <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">To</label>
             <select 
               value={toCurr}
               onChange={e => setToCurr(e.target.value)}
               className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none"
             >
               <option value="eur">EUR - Euro</option>
               <option value="usd">USD - US Dollar</option>
             </select>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl text-center mt-6">
             <p className="text-sm text-primary font-bold uppercase tracking-wider mb-1">Converted Amount</p>
             <p className="text-4xl font-bold text-foreground">
               {loading ? <span className="animate-pulse">Loading...</span> : result}
             </p>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-gray-500 hover:text-primary">
               <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Rates
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Converter;