import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0C1424]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Fintech<span className="text-primary">Nova</span></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          {navItems.map(item => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`hover:text-primary transition-colors ${location.pathname === item.path ? 'text-primary font-semibold' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-primary transition-colors">
            Log In
          </button>
          <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-700 dark:text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu with Smooth Transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#0C1424] border-b border-gray-100 dark:border-white/5 shadow-xl"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navItems.map(item => (
                <button 
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsOpen(false); }}
                  className={`text-left font-medium text-lg py-2 border-b border-gray-100 dark:border-white/5 ${location.pathname === item.path ? 'text-primary' : 'text-gray-900 dark:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 flex flex-col gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  className="w-full justify-center border-gray-200 dark:border-white/10"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => { navigate('/login'); setIsOpen(false); }} 
                  className="w-full justify-center bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicHeader;