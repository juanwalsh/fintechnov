import React from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicFooter = () => {
  const navigate = useNavigate();

  const handleNav = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-[#0F172A] dark:bg-[#020617] text-gray-400 pt-20 pb-10 border-t border-gray-800 dark:border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 dark:border-white/10 pb-12">
        <div className="space-y-4">
           <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <Globe className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-white">FintechNova</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Revolutionizing global financial infrastructure with cutting-edge technology and unmatched security.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/solutions" onClick={handleNav('/solutions')} className="hover:text-primary transition-colors">Solutions</a></li>
            <li><a href="/pricing" onClick={handleNav('/pricing')} className="hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="/dashboard" onClick={handleNav('/dashboard')} className="hover:text-primary transition-colors">Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" onClick={handleNav('/')} className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="/contact" onClick={handleNav('/contact')} className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 text-center text-xs text-gray-500">
        <p>&copy; 2025 FintechNova Inc. All rights reserved. </p>
      </div>
    </footer>
  );
};

export default PublicFooter;