import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Plus, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Plane, Laptop, Target, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../App';
import * as api from '../services/api';
import { Transaction } from '../types';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import TransactionModal from '../components/TransactionModal';
import { AddFundsModal, SendMoneyModal } from '../components/ActionModals';
import Skeleton from '../components/ui/Skeleton';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    const txs = await api.getTransactions();
    setTransactions(txs.slice(0, 5));
    processChartData(txs);
    processCategoryData(txs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []); // Initial load

  // Refresh data when modals close (to show new funds/transactions)
  const handleModalClose = () => {
    setIsAddFundsOpen(false);
    setIsSendMoneyOpen(false);
    loadData(); 
  };

  const processChartData = (txs: Transaction[]) => {
    // Generate last 7 days keys
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' })); // e.g., "Mon"
    }

    // Initialize map with 0
    const dataMap = new Map(days.map(d => [d, 0]));

    txs.forEach(tx => {
      // Only expense transactions for "Spending Activity"
      if (tx.amount < 0) {
         const d = new Date(tx.date).toLocaleDateString('en-US', { weekday: 'short' });
         if (dataMap.has(d)) {
           dataMap.set(d, dataMap.get(d)! + Math.abs(tx.amount / 100));
         }
      }
    });

    const finalData = Array.from(dataMap.entries()).map(([day, amount]) => ({ day, amount }));
    setChartData(finalData);
  };

  const processCategoryData = (txs: Transaction[]) => {
    const catMap = new Map<string, number>();
    
    txs.forEach(tx => {
      if (tx.amount < 0 && tx.category) {
        catMap.set(tx.category, (catMap.get(tx.category) || 0) + Math.abs(tx.amount / 100));
      }
    });

    // Colors for categories
    const colors: Record<string, string> = {
      food: '#00C48C',
      tech: '#3B74FF',
      travel: '#35E3FF',
      bills: '#FFD36E',
      shopping: '#FF6E6E',
      others: '#9CA3AF'
    };

    const data = Array.from(catMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value),
      color: colors[name] || '#9CA3AF'
    })).sort((a, b) => b.value - a.value).slice(0, 4); // Top 4

    setCategoryData(data);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 100);
  };

  const savingsGoals = [
    { id: 1, name: 'Trip to Japan', current: 3200, target: 5000, icon: Plane, color: 'text-purple-500', bg: 'bg-purple-500' },
    { id: 2, name: 'New MacBook', current: 1500, target: 2500, icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 3, name: 'Emergency', current: 8500, target: 12000, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <TransactionModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      <AddFundsModal isOpen={isAddFundsOpen} onClose={handleModalClose} />
      <SendMoneyModal isOpen={isSendMoneyOpen} onClose={handleModalClose} />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, {user?.name.split(' ')[0]}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Here's your financial summary for today.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsAddFundsOpen(true)}
            className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10"
          >
            <Plus size={16} className="mr-2"/> Add Funds
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsSendMoneyOpen(true)}
          >
            Send Money
          </Button>
        </div>
      </header>

      {/* Row 1: Balance & Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card (1 Col) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 glass-panel p-6 rounded-xl bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-transparent border border-primary/20 shadow-lg shadow-primary/5 flex flex-col justify-between min-h-[180px]"
        >
          {loading ? (
             <div className="space-y-4">
               <Skeleton className="w-24 h-4" />
               <Skeleton className="w-48 h-10" />
               <Skeleton className="w-20 h-6 rounded-full" />
             </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Balance</span>
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {formatCurrency(user?.balance || 0)}
                </div>
              </div>
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
                <ArrowUpRight size={14} className="mr-1" />
                Live Updated
              </div>
            </>
          )}
        </motion.div>

        {/* Savings Goals (2 Cols) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 glass-panel p-6 rounded-xl bg-white dark:bg-card border border-gray-100 dark:border-border min-h-[180px]"
        >
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
              <button className="text-sm text-primary hover:text-blue-600 font-medium">View All</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savingsGoals.map((goal, index) => (
                <div key={goal.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                   <div className="flex justify-between items-start mb-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-white/10 ${goal.color}`}>
                         <goal.icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-white dark:bg-black/20 px-2 py-1 rounded-full">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </span>
                   </div>
                   <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{goal.name}</p>
                   <p className="text-xs text-gray-500 mb-3">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                   
                   <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                       transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                       className={`h-full rounded-full ${goal.bg}`}
                     />
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart (2 Cols) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 glass-panel p-6 rounded-xl bg-white dark:bg-card border border-gray-100 dark:border-border"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Activity</h3>
            <select className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs px-2 py-1 outline-none text-gray-700 dark:text-gray-300">
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            {chartData.every(d => d.amount === 0) ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No spending data available for this week.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B74FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B74FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111B2E', border: 'none', borderRadius: '8px', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                    cursor={{ stroke: '#3B74FF', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B74FF" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Donut Chart (1 Col) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-1 glass-panel p-6 rounded-xl bg-white dark:bg-card border border-gray-100 dark:border-border flex flex-col"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expenses by Category</h3>
          <div className="flex-1 min-h-[200px] relative">
            {categoryData.length === 0 ? (
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm text-center px-4">
                 Make some payments to see category breakdown.
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                      data={categoryData} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                  >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip 
                      contentStyle={{ backgroundColor: '#111B2E', border: 'none', borderRadius: '8px', color: 'white' }}
                      itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Text Overlay */}
            {categoryData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-xs text-gray-400 font-medium uppercase">Total</span>
                 <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${categoryData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                 </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/transactions')} className="text-gray-500 hover:text-primary flex items-center">
             View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="glass-panel rounded-xl overflow-hidden bg-white dark:bg-card border border-gray-100 dark:border-border shadow-sm">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-32 h-4 mb-2" />
                      <Skeleton className="w-20 h-3" />
                    </div>
                 </div>
                 <Skeleton className="w-20 h-5" />
               </div>
             ))
          ) : (
            transactions.map((tx, i) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.05) }}
                onClick={() => setSelectedTx(tx)}
                className="p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center justify-between last:border-0 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${tx.amount > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                    {tx.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{tx.description}</p>
                    <p className="text-sm text-gray-500 capitalize">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;