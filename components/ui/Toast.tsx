import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  subMessage?: string;
  type?: 'success' | 'info' | 'warning';
  position?: 'top-right' | 'bottom-right';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  subMessage, 
  type = 'success', 
  position = 'bottom-right', 
  isVisible, 
  onClose 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Don't render until client-side hydration is complete to access document.body
  if (!mounted) return null;

  // Responsive Positioning Logic
  // Mobile: Increased top spacing (top-24 = 96px) to clear notches and headers.
  // Desktop: Increased top spacing to top-28 for better aesthetics.
  const mobileClasses = position === 'top-right' ? 'top-24' : 'bottom-8';
  const desktopClasses = position === 'top-right' ? 'md:top-28 md:bottom-auto' : 'md:bottom-10 md:top-auto';
  
  const bgColor = type === 'success' ? 'bg-white dark:bg-[#111B2E]' : 'bg-white dark:bg-[#111B2E]';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-blue-500';

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed z-[9999] left-4 right-4 md:left-auto md:right-6 ${mobileClasses} ${desktopClasses} flex items-center space-x-3 ${bgColor} text-gray-800 dark:text-white px-4 py-4 md:px-6 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 md:min-w-[300px]`}
        >
          <div className={`${iconColor} shrink-0`}>
            {type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <span className="font-bold text-sm md:text-base truncate">{message}</span>
            {subMessage && <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{subMessage}</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 ml-2">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;