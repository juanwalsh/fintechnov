import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowLeftRight, 
  Zap, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Settings,
  Globe
} from 'lucide-react';
import { useAuth } from '../App';
import Toast from './ui/Toast';
import LogoutModal from './LogoutModal';
import GlobalAiAssistant from './GlobalAiAssistant';
import ConverterModal from './ConverterModal';
import NotificationsModal from './NotificationsModal';

const SidebarItem = ({ to, icon: Icon, label, onClick, isAction }: { to?: string, icon: any, label: string, onClick?: () => void, isAction?: boolean }) => {
  const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 cursor-pointer w-full text-left";
  
  if (isAction) {
     return (
       <button onClick={onClick} className={`${baseClasses} text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5`}>
         <Icon size={20} />
         <span className="font-medium">{label}</span>
       </button>
     );
  }

  return (
    <NavLink 
      to={to!} 
      onClick={onClick}
      end={to === '/dashboard'}
      className={({ isActive }) => `
        ${baseClasses}
        ${isActive 
          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
          : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}
      `}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Modals
  const [welcomeToast, setWelcomeToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const state = location.state as { welcome?: boolean; type?: 'login' | 'signup'; plan?: string } | null;
    if (state?.welcome && user?.name) {
      let msg = state.plan ? "Thanks for starting a plan with us!" : (state.type === 'signup' ? `Welcome to Nova, ${user.name}` : `Welcome back to Nova, ${user.name}`);
      setWelcomeToast({ visible: true, message: msg });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, user, navigate]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLogoutConfirm = () => { logout(); setIsLogoutOpen(false); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground overflow-hidden transition-colors duration-300">
      
      <Toast 
        message={welcomeToast.message}
        subMessage="Dashboard loaded successfully"
        isVisible={welcomeToast.visible} 
        onClose={() => setWelcomeToast(prev => ({ ...prev, visible: false }))} 
        position="bottom-right"
        type="success"
      />

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={handleLogoutConfirm} />
      <ConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} />
      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      
      <GlobalAiAssistant />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-border z-20 bg-white/50 dark:bg-[#111B2E]/50">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Fintech<span className="text-primary">Nova</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/dashboard/transactions" icon={ArrowLeftRight} label="Transactions" />
          <SidebarItem to="/dashboard/card" icon={CreditCard} label="Virtual Card" />
          <SidebarItem isAction icon={Zap} label="Converter" onClick={() => setIsConverterOpen(true)} />
          <SidebarItem isAction icon={Bell} label="Notifications" onClick={() => setIsNotifOpen(true)} />
          <div className="my-4 border-t border-border"></div>
          <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-border">
           <div className="flex items-center space-x-3 mb-4 px-2">
             {user?.avatarUrl ? (
               <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border-2 border-primary/20 flex items-center justify-center font-bold text-sm">
                 {getInitials(user?.name || '')}
               </div>
             )}
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium truncate text-foreground">{user?.name}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
           </div>
           <button 
             onClick={() => setIsLogoutOpen(true)}
             className="flex items-center space-x-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 w-full px-2 py-2 rounded-md hover:bg-red-500/10 transition"
           >
             <LogOut size={18} />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-panel p-4 flex justify-between items-center bg-background/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center">
              <Globe className="text-white" size={20} />
            </div>
          <span className="text-lg font-bold">Fintech<span className="text-primary">Nova</span></span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-foreground">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-background pt-20 px-4"
          >
             <nav className="flex flex-col space-y-2">
                <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={toggleMenu} />
                <SidebarItem to="/dashboard/transactions" icon={ArrowLeftRight} label="Transactions" onClick={toggleMenu} />
                <SidebarItem to="/dashboard/card" icon={CreditCard} label="Virtual Card" onClick={toggleMenu} />
                <SidebarItem isAction icon={Zap} label="Converter" onClick={() => { setIsConverterOpen(true); toggleMenu(); }} />
                <SidebarItem isAction icon={Bell} label="Notifications" onClick={() => { setIsNotifOpen(true); toggleMenu(); }} />
                <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" onClick={toggleMenu} />
                <button 
                  onClick={() => setIsLogoutOpen(true)}
                  className="flex items-center space-x-3 text-red-500 mt-8 p-4 border rounded-lg border-red-500/20"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
             </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 bg-background">
        <motion.div
           key={location.pathname}
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -15 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="p-4 md:p-8 max-w-7xl mx-auto min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;