import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Copy } from 'lucide-react';
import * as api from '../services/api';
import { VirtualCard } from '../types';
import Button from '../components/ui/Button';
import BiometricOverlay from '../components/ui/BiometricOverlay';
import Skeleton from '../components/ui/Skeleton';

const VirtualCardPage: React.FC = () => {
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  
  // Biometric State
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [bioAction, setBioAction] = useState<'reveal' | 'none'>('none');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getCard().then(c => {
      setCard(c);
      setIsFrozen(c.frozen);
      setLoading(false);
    });
  }, []);

  const handleFreeze = async () => {
    if (!card) return;
    const newState = !isFrozen;
    setIsFrozen(newState);
    await api.toggleCardFreeze(card.id, newState);
  };

  const handleRevealRequest = () => {
    if (isRevealed) {
      setIsFlipped(!isFlipped);
      return;
    }
    setBioAction('reveal');
    setIsBioOpen(true);
  };

  const onBioSuccess = () => {
    setIsBioOpen(false);
    if (bioAction === 'reveal') {
      setIsRevealed(true);
      setIsFlipped(true); // Flip to back to show CVV
      setTimeout(() => {
        setIsRevealed(false); // Auto-hide after 15s
        setIsFlipped(false);
      }, 15000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) {
     return (
       <div className="max-w-4xl mx-auto py-8">
         <Skeleton className="w-64 h-8 mb-8" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <Skeleton className="w-[340px] h-[210px] rounded-2xl mx-auto" />
           <div className="space-y-6">
             <Skeleton className="w-full h-32 rounded-xl" />
             <Skeleton className="w-full h-24 rounded-xl" />
           </div>
         </div>
       </div>
     );
  }

  if (!card) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <BiometricOverlay 
        isOpen={isBioOpen} 
        onClose={() => setIsBioOpen(false)} 
        onSuccess={onBioSuccess}
        prompt="Verifying identity to reveal card details"
      />

      <h2 className="text-2xl font-bold mb-8">My Virtual Card</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Card Visual */}
        <div className="flex justify-center perspective-1000">
          <motion.div
            className="relative w-[340px] h-[210px] cursor-pointer preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleRevealRequest}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden
              ${isFrozen ? 'bg-gray-700 grayscale' : 'bg-gradient-to-br from-finnova-deep to-finnova-navy border border-finnova-500/30'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-0 right-0 p-32 bg-finnova-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="flex justify-between items-start z-10">
                <span className="font-bold text-lg tracking-wider">Fintech Nova</span>
                <span className="uppercase text-xs font-mono border border-white/30 px-2 py-1 rounded">Debit</span>
              </div>
              
              <div className="z-10">
                 <div className="flex space-x-1 mb-4">
                   <div className="w-10 h-7 bg-yellow-500/80 rounded flex items-center justify-center">
                     <div className="w-6 h-4 border border-black/20 rounded-sm"></div>
                   </div>
                   <div className="text-white/50 text-2xl rotate-90">)))</div>
                 </div>
                 {/* Masked Number */}
                 <p className="font-mono text-xl tracking-widest text-shadow">
                   {isRevealed ? card.cardNumber : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                 </p>
              </div>

              <div className="flex justify-between items-end z-10">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Card Holder</p>
                  <p className="font-medium tracking-wide">{card.holderName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase text-right">Expires</p>
                  <p className="font-medium tracking-wide">{card.expiry}</p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full bg-finnova-navy rounded-2xl shadow-2xl backface-hidden flex flex-col overflow-hidden border border-white/10"
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
               <div className="w-full h-12 bg-black mt-6"></div>
               <div className="p-6">
                 <div className="bg-white/10 h-10 w-full rounded flex items-center justify-end px-4 mb-2">
                   <span className="text-black font-mono font-bold bg-white px-2 py-1">
                     {isRevealed ? card.cvv : '•••'}
                   </span>
                 </div>
                 <p className="text-xs text-gray-400 text-center mt-8">
                   This card is issued by Fintech Nova Bank. Use subject to terms and conditions.
                 </p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold">Card Settings</h3>
               {isFrozen && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">FROZEN</span>}
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                   <div className="flex items-center space-x-3">
                     <Copy size={18} className="text-finnova-500" />
                     <span>Copy Card Number</span>
                   </div>
                   <Button variant="ghost" size="sm" onClick={() => copyToClipboard(card.cardNumber)}>Copy</Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                   <div className="flex items-center space-x-3">
                     {isFrozen ? <Lock size={18} className="text-red-400" /> : <Unlock size={18} className="text-emerald-400" />}
                     <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                   </div>
                   <div 
                     className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isFrozen ? 'bg-red-500' : 'bg-emerald-500'}`}
                     onClick={handleFreeze}
                   >
                     <motion.div 
                       className="w-4 h-4 bg-white rounded-full shadow-md" 
                       layout 
                       initial={false}
                       animate={{ x: isFrozen ? 24 : 0 }}
                     />
                   </div>
                </div>
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
             <p className="text-sm text-gray-400 leading-relaxed">
               For security, full card details are hidden. Tap the card to verify via Face ID and reveal numbers for 15 seconds.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VirtualCardPage;