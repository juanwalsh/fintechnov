import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, CheckCircle, Info, CheckCheck } from 'lucide-react';
import Toast from './ui/Toast';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Security Alert', msg: 'New login attempt from Chrome on Windows.', type: 'warning', time: '2 min ago' },
    { id: 2, title: 'Payment Received', msg: 'You received $500.00 from John Doe.', type: 'success', time: '1 hour ago' },
    { id: 3, title: 'Goal Reached', msg: 'You hit 50% of your "Japan Trip" savings goal!', type: 'info', time: '5 hours ago' },
    { id: 4, title: 'System Update', msg: 'Fintech Nova will undergo maintenance at 2 AM.', type: 'info', time: '1 day ago' },
  ]);

  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleMarkAllRead = () => {
    setNotifications([]);
    setToast({ visible: true, message: 'All notifications marked as read' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        
        {/* Internal Toast for this modal context */}
        <Toast 
          isVisible={toast.visible} 
          message={toast.message} 
          type="success"
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          position="top-right"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 max-h-[80vh] flex flex-col"
        >
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/20">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
               <Bell className="mr-2 text-primary" size={20} /> Notifications
             </h3>
             <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition">
               <X size={20} className="text-gray-500" />
             </button>
          </div>

          <div className="overflow-y-auto p-4 space-y-3 min-h-[300px]">
             {notifications.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                   <Bell size={32} />
                 </div>
                 <h4 className="text-gray-900 dark:text-white font-medium mb-1">No new notifications</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up! Check back later.</p>
               </div>
             ) : (
               notifications.map((n) => (
                 <motion.div 
                   key={n.id} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, height: 0 }}
                   className="flex items-start p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-colors"
                 >
                    <div className={`mt-1 mr-3 shrink-0 ${
                      n.type === 'warning' ? 'text-orange-500' : 
                      n.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
                    }`}>
                      {n.type === 'warning' ? <AlertTriangle size={18} /> : 
                       n.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{n.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.msg}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{n.time}</p>
                    </div>
                 </motion.div>
               ))
             )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-white/5 text-center bg-gray-50/50 dark:bg-black/10">
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-primary font-bold hover:text-blue-600 flex items-center justify-center w-full py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <CheckCheck size={14} className="mr-1.5" /> Mark all as read
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationsModal;