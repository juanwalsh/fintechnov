import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white dark:bg-[#111B2E] rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-white/10"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Out</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to leave Fintech Nova?</p>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
            >
              Yes, Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutModal;