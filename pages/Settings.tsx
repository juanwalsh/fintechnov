import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../App';
import { Moon, Sun, Monitor, User, Shield, Bell, Check, Save, ToggleLeft, ToggleRight, Camera } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast, { ToastProps } from '../components/ui/Toast';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  
  // Settings States
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState<{ visible: boolean; message: string; sub: string; type: 'success' | 'info' | 'warning' }>({
    visible: false,
    message: '',
    sub: '',
    type: 'success'
  });

  // Profile State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, sub: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ visible: true, message, sub, type });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: formData.name, email: formData.email });
    showToast("Information saved successfully", "Your profile details have been updated.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateUser({ avatarUrl: imageUrl });
      showToast("Photo Updated", "Your profile picture has been changed.", "success");
    }
  };

  const toggle2FA = () => {
    const newState = !twoFactor;
    setTwoFactor(newState);
    if (newState) {
      showToast("2FA Enabled", "Two-factor authentication is now active.", "success");
    } else {
      showToast("2FA Disabled", "You removed two-factor authentication.", "warning");
    }
  };

  const toggleNotifications = () => {
    const newState = !notifications;
    setNotifications(newState);
    if (newState) {
      showToast("Notifications On", "You turned on login notifications.", "info");
    } else {
      showToast("Notifications Off", "You disabled login notifications.", "warning");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <Toast 
        isVisible={toast.visible} 
        message={toast.message} 
        subMessage={toast.sub}
        type={toast.type}
        position="bottom-right"
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account settings.</p>
      </div>

      {/* Theme Section */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass-panel p-6 rounded-xl bg-card border border-border"
      >
        <h3 className="text-lg font-semibold mb-4 text-foreground">Appearance</h3>
        <div className="grid grid-cols-3 gap-4">
           <button 
             onClick={() => setTheme('light')}
             className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'}`}
           >
             <Sun size={24} className="mb-2" />
             <span className="text-sm font-medium">Light</span>
           </button>
           <button 
             onClick={() => setTheme('dark')}
             className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'}`}
           >
             <Moon size={24} className="mb-2" />
             <span className="text-sm font-medium">Dark</span>
           </button>
           <button 
             onClick={() => setTheme('system')}
             className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'}`}
           >
             <Monitor size={24} className="mb-2" />
             <span className="text-sm font-medium">System</span>
           </button>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="glass-panel p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center space-x-6 mb-8">
           <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             {user?.avatarUrl ? (
               <img 
                 src={user.avatarUrl} 
                 alt="User" 
                 className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-white/10 object-cover"
               />
             ) : (
               <div className="w-24 h-24 rounded-full bg-primary/10 text-primary border-4 border-gray-100 dark:border-white/10 flex items-center justify-center text-2xl font-bold">
                 {getInitials(user?.name || '')}
               </div>
             )}
             <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white" />
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
             />
           </div>
           <div>
             <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
             <p className="text-sm text-gray-500">Update your personal details.</p>
           </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
               <input 
                 type="text" 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
               <input 
                 type="email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none"
               />
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">New Password</label>
             <input 
               type="password" 
               placeholder="Leave blank to keep current"
               className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none"
             />
           </div>

           <div className="flex justify-end pt-2">
             <Button type="submit" size="sm" className="flex items-center">
                <Save size={16} className="mr-2" /> Save Profile
             </Button>
           </div>
        </form>
      </motion.div>

      {/* Security Section */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="glass-panel p-6 rounded-xl bg-card border border-border"
      >
         <div className="flex items-center space-x-4 mb-6">
           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
             <Shield size={24} />
           </div>
           <div>
             <h3 className="text-lg font-semibold text-foreground">Security</h3>
             <p className="text-sm text-gray-500">Manage your account security.</p>
           </div>
        </div>
        
        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Secure your account with 2FA.</p>
              </div>
              <button 
                onClick={toggle2FA}
                className={`transition-colors duration-200 ${twoFactor ? 'text-primary' : 'text-gray-400'}`}
              >
                {twoFactor ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
           </div>
           
           <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <div>
                <p className="font-medium text-foreground">Login Notifications</p>
                <p className="text-xs text-gray-500">Get alerted for new device logins.</p>
              </div>
              <button 
                onClick={toggleNotifications}
                className={`transition-colors duration-200 ${notifications ? 'text-primary' : 'text-gray-400'}`}
              >
                {notifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;