import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldAlert, Wallet, Send, Building2, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../App';
import * as api from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to format string with dots for thousands and comma for decimal (e.g. "3000.5" -> "3.000,50")
// Input logic handles dynamic typing
const formatCurrencyValue = (value: string) => {
  if (!value) return '';

  // 1. Clean: remove everything that isn't a digit or a comma
  // We strip dots because we re-add them dynamically
  let raw = value.replace(/\./g, '').replace(/[^0-9,]/g, '');

  // 2. Handle multiple commas: keep only the first one
  const parts = raw.split(',');
  if (parts.length > 2) {
    raw = parts[0] + ',' + parts.slice(1).join('');
  }

  // 3. Split Integer and Decimal
  const [integer, decimal] = raw.split(',');

  // 4. Add dots to integer (Groups of 3)
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // 5. Reconstruct
  if (raw.includes(',')) {
      // Limit decimal to 2 digits
      return `${formattedInteger},${decimal ? decimal.substring(0, 2) : ''}`;
  }
  return formattedInteger;
};

// Parse back to number for logic (e.g. "3.000,50" -> 3000.50)
const parseCurrencyValue = (value: string) => {
  if (!value) return 0;
  // Remove dots, replace comma with dot to make it JS float compatible
  const clean = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

// Helper for display in error messages
const formatDisplay = (val: number) => {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const AddFundsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits, dots (will be stripped), and comma
    if (/^[\d.,]*$/.test(val)) {
       setAmount(formatCurrencyValue(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    const numericValue = parseCurrencyValue(amount);
    const valueInCents = Math.round(numericValue * 100);
    
    // Call Persistent API
    const updatedUser = await api.addFunds(valueInCents, "Chase Bank •••• 4242");
    updateUser(updatedUser); // Sync local state
    
    setStep('success');
  };

  const handleClose = () => {
    setAmount('');
    setStep('input');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          {step === 'success' ? (
            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Funds Added!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                ${formatDisplay(parseCurrencyValue(amount))} has been deposited to your account.
              </p>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </div>
          ) : (
            <>
              <div className="bg-primary/5 p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                  <Wallet className="mr-2 text-primary" size={20} /> Add Funds
                </h3>
                <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deposit Amount (USD)</label>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                    autoFocus
                    className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-white/10 py-2 focus:border-primary outline-none text-gray-900 dark:text-white placeholder-gray-300"
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                   <div className="flex items-center p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                      <Building2 className="text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Chase Bank •••• 4242</p>
                        <p className="text-xs text-gray-500">Checking Account</p>
                      </div>
                      <span className="text-xs text-primary font-medium cursor-pointer">Change</span>
                   </div>
                </div>

                <Button type="submit" className="w-full py-3" isLoading={step === 'processing'}>
                  Confirm Deposit
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const SendMoneyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [step, setStep] = useState<'input' | 'security' | 'processing' | 'success'>('input');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentBalance = (user?.balance || 0) / 100;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[\d.,]*$/.test(val)) {
       setAmount(formatCurrencyValue(val));
       setError(null); // Clear error when user types
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseCurrencyValue(amount);
    
    // Strict Balance Check
    if (val > currentBalance) {
      setError(`You don't have enough funds. You are trying to send $${formatDisplay(val)} and you have $${formatDisplay(currentBalance)}.`);
      return;
    }

    if (val > 30000) {
      setStep('security');
    } else {
      processTransaction();
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify password here.
    processTransaction();
  };

  const processTransaction = async () => {
    setStep('processing');
    
    const val = Math.round(parseCurrencyValue(amount) * 100);
    
    // Call Persistent API
    const updatedUser = await api.sendMoney(val, recipient, "Money Transfer");
    updateUser(updatedUser); // Sync local state
    
    setStep('success');
  };

  const handleClose = () => {
    setAmount('');
    setRecipient('');
    setPassword('');
    setError(null);
    setStep('input');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
           {step === 'success' ? (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transfer Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  ${formatDisplay(parseCurrencyValue(amount))} sent to {recipient}.
                </p>
                <Button onClick={handleClose} className="w-full">OK</Button>
              </div>
           ) : step === 'security' ? (
              <div className="p-6">
                 <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 mb-4">
                       <ShieldAlert size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security Check</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      This transaction is above $30.000,00. Please confirm your identity to proceed.
                    </p>
                 </div>
                 <form onSubmit={handleSecuritySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Password</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button type="submit" className="w-full py-3" variant="primary">Confirm & Send</Button>
                    <Button type="button" onClick={() => setStep('input')} className="w-full" variant="ghost">Cancel</Button>
                 </form>
              </div>
           ) : (
             <>
               <div className="bg-primary/5 p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                 <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                   <Send className="mr-2 text-primary" size={20} /> Send Money
                 </h3>
                 <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
               </div>
               
               {/* Error Alert */}
               <AnimatePresence>
                 {error && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 px-6 py-3 flex items-start space-x-3 overflow-hidden"
                   >
                     <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
                     <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-tight">{error}</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               <form onSubmit={handleInitialSubmit} className="p-6 space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipient (Email or Account)</label>
                   <input 
                     type="text" 
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                     required
                     className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                     placeholder="recipient@example.com"
                   />
                 </div>

                 <div>
                    <div className="flex justify-between mb-2">
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (USD)</label>
                       <span className="text-xs text-gray-500">Max: ${formatDisplay(currentBalance)}</span>
                    </div>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={amount}
                      onChange={handleAmountChange}
                      required
                      className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-white/10 py-2 focus:border-primary outline-none text-gray-900 dark:text-white placeholder-gray-300"
                      placeholder="0,00"
                    />
                 </div>

                 <Button type="submit" className="w-full py-3" isLoading={step === 'processing'}>
                   Next
                 </Button>
               </form>
             </>
           )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};