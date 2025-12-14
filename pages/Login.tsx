import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import Button from '../components/ui/Button';
import { Globe, ArrowLeft, Mail, Lock, User, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  
  // Ref to track if we are in the process of logging in manually
  const isJustLoggedIn = useRef(false);

  // Extract plan from navigation state if it exists
  const selectedPlan = location.state?.plan;
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated and NOT just logged in (e.g. user manually visited /login)
  useEffect(() => {
    if (isAuthenticated && !isJustLoggedIn.current) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    isJustLoggedIn.current = true; // Mark as manual login flow
    
    // Simulate API call delay and login
    await login(email, name);
    
    setIsLoading(false);
    
    // Navigate with welcome flag, type, and plan info
    navigate('/dashboard', { 
      state: { 
        welcome: true,
        type: isLogin ? 'login' : 'signup',
        plan: selectedPlan 
      } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050C19] relative overflow-hidden p-4">
      {/* Polished Background: Grid + Blobs */}
      <div className="absolute inset-0 w-full h-full">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] opacity-40 animate-pulse-slow" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[128px] opacity-40 animate-pulse-slow" />
      </div>
      
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-primary transition-all font-medium z-20 group"
      >
        <div className="bg-white dark:bg-[#111B2E] p-2 rounded-full shadow-sm group-hover:shadow-md border border-gray-200 dark:border-white/10 mr-2 transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </div> 
        Back to Home
      </button>

      <motion.div 
        layout
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-[#111B2E] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 z-10 relative overflow-hidden"
      >
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-2xl rotate-3 flex items-center justify-center mb-5 shadow-lg shadow-primary/30"
            >
              <Globe className="text-white -rotate-3" size={28} />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm max-w-xs mx-auto">
              {isLogin ? 'Securely access your financial dashboard' : 'Join the next generation of fintech infrastructure'}
            </p>
          </div>

          {/* Plan Specific Message */}
          <AnimatePresence>
            {selectedPlan && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3 rounded-xl flex items-start gap-3 overflow-hidden"
              >
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  To {selectedPlan === 'Starter' ? 'start for free' : 'get started'} with the <strong>{selectedPlan} Plan</strong>, please create an account or log in.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex bg-gray-100 dark:bg-[#0C1424] p-1 rounded-xl mb-8 relative">
             <motion.div 
                layoutId="activeTab"
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#1E293B] rounded-lg shadow-sm border border-gray-200 dark:border-white/5`}
                initial={false}
                animate={{ x: isLogin ? 4 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
             />
             <button 
               onClick={() => setIsLogin(true)} 
               className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors z-10 ${isLogin ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
             >
               Log In
             </button>
             <button 
               onClick={() => setIsLogin(false)} 
               className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors z-10 ${!isLogin ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
             >
               Sign Up
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                       Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0C1424] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0C1424] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0C1424] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 text-lg transition-all transform hover:scale-[1.01]" isLoading={isLoading}>
                {isLogin ? 'Log In' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:text-blue-600 font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;