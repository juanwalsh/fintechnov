import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, CreditCard, Hash } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  // Generate a consistent random ID based on the transaction ID if it's just "tx_01"
  const displayId = `TSX-${transaction.id.replace('tx_', 'ABC').toUpperCase()}${Math.floor(Math.random() * 899 + 100)}`;

  return (
    <AnimatePresence>
      {transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
          >
            <div className="bg-primary/5 p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction Details</h3>
                <p className="text-sm text-gray-500">Receipt</p>
              </div>
              <button onClick={onClose} className="p-1 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 transition">
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(transaction.amount / 100))}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">{transaction.description}</p>

              <div className="w-full space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Hash size={18} className="mr-3" />
                    <span>Transaction ID</span>
                  </div>
                  <span className="font-mono font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">
                    {displayId}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar size={18} className="mr-3" />
                    <span>Date & Time</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {new Date(transaction.date).toLocaleDateString()}
                    <br/>
                    <span className="text-xs text-gray-400">{new Date(transaction.date).toLocaleTimeString()}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <CreditCard size={18} className="mr-3" />
                    <span>Payment Method</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {transaction.type}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className="text-emerald-500 font-bold uppercase text-sm tracking-wider">Completed</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-black/20 text-center">
              <p className="text-xs text-gray-400">Fintech Nova Inc. • Verified Transaction</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;