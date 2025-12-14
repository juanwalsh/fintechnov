import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface WelcomeToastProps {
  name: string;
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeToast: React.FC<WelcomeToastProps> = ({ name, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-6 right-6 z-[100] flex items-center space-x-3 bg-white dark:bg-[#111B2E] text-gray-800 dark:text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10"
        >
          <div className="flex flex-col">
            <span className="font-bold text-lg">Welcome to Nova, {name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Dashboard loaded successfully</span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 10 }}
            className="text-success"
          >
            <CheckCircle2 size={32} className="animate-bounce-gentle" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeToast;