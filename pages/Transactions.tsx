import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Filter, Search, Calendar } from 'lucide-react';
import * as api from '../services/api';
import { Transaction } from '../types';
import TransactionModal from '../components/TransactionModal';
import Skeleton from '../components/ui/Skeleton';

type FilterType = 'all' | 'income' | 'expense';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Simulate realistic loading
    setLoading(true);
    api.getTransactions().then(data => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    // Type Filter
    if (filterType === 'income' && tx.amount <= 0) return false;
    if (filterType === 'expense' && tx.amount >= 0) return false;

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!tx.description.toLowerCase().includes(q) && !tx.category.includes(q)) return false;
    }

    // Date Filter
    if (dateFrom && new Date(tx.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(tx.date) > new Date(dateTo)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <TransactionModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`md:hidden flex items-center space-x-2 px-4 py-2 rounded-lg border ${isFilterOpen ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
          {/* Search */}
          <div className="md:col-span-2 relative">
             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search merchant, category..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary"
             />
          </div>

          {/* Date Picker */}
          <div className="relative">
             <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
             <input 
               type="date"
               value={dateFrom}
               onChange={(e) => setDateFrom(e.target.value)}
               className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm text-gray-500"
             />
          </div>

          {/* Type Toggle */}
          <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
             {(['all', 'income', 'expense'] as FilterType[]).map((t) => (
               <button
                 key={t}
                 onClick={() => setFilterType(t)}
                 className={`flex-1 rounded-lg text-sm font-medium capitalize transition-all ${filterType === t ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Skeleton Loading State
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
               <div className="flex items-center space-x-4">
                 <Skeleton className="w-12 h-12 rounded-lg" />
                 <div className="space-y-2">
                   <Skeleton className="w-32 h-4" />
                   <Skeleton className="w-20 h-3" />
                 </div>
               </div>
               <Skeleton className="w-24 h-6" />
            </div>
          ))
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-full mb-4">
              <Filter size={24} className="opacity-50" />
            </div>
            <p>No transactions found matching your filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setDateFrom(''); setFilterType('all'); }} 
              className="text-primary text-sm mt-2 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedTx(tx)}
              className="glass-panel p-4 rounded-xl flex items-center justify-between bg-white dark:bg-card border border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer group shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${tx.amount > 0 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                  {tx.amount > 0 ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{tx.description}</p>
                  <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{tx.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount/100)}
                </p>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{tx.status}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;