import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, CheckCircle2, Lock } from 'lucide-react';

interface BiometricOverlayProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  prompt?: string;
}

const BiometricOverlay: React.FC<BiometricOverlayProps> = ({ isOpen, onSuccess, onClose, prompt = "Verifying Identity" }) => {
  const [state, setState] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setState('scanning');
      const timer = setTimeout(() => {
        setState('success');
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white"
        >
          <div className="relative w-32 h-32 mb-8">
             {/* Scanning Animation */}
             {state === 'scanning' && (
               <>
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 border-2 border-primary/50 rounded-2xl"
                 />
                 <motion.div 
                   className="absolute w-full h-1 bg-primary shadow-[0_0_15px_rgba(59,116,255,0.8)]"
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <ScanFace size={64} className="text-gray-400 opacity-50" />
                 </div>
               </>
             )}
             
             {/* Success State */}
             {state === 'success' && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="absolute inset-0 flex items-center justify-center text-emerald-500"
               >
                 <CheckCircle2 size={80} strokeWidth={1.5} />
               </motion.div>
             )}
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">
              {state === 'scanning' ? 'Face ID' : 'Verified'}
            </h3>
            <p className="text-gray-400 text-sm">{prompt}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiometricOverlay;