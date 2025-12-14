import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import Button from '../components/ui/Button';
import { Mail, MapPin, Phone, Check, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 pt-20">
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Get in touch with <span className="text-primary">our team</span>
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
                Have questions about our pricing, features, or enterprise solutions? We're here to help you scale.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chat to support</h3>
                    <p className="text-gray-500">We're here to help.</p>
                    <a href="mailto:support@fintechnova.com" className="text-primary font-medium hover:underline">support@fintechnova.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Visit us</h3>
                    <p className="text-gray-500">Visit our office HQ.</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">One World Trade Center,<br/>Suite 8500, New York, NY 10007</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Call us</h3>
                    <p className="text-gray-500">Mon-Fri from 8am to 5pm.</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">+1 (212) 555-0199</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
               layout
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white dark:bg-[#111B2E] p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 relative z-10"
                  >
                     <motion.div 
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                       className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10"
                     >
                       <Check size={48} strokeWidth={3} />
                     </motion.div>
                     <motion.h3 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.2 }}
                       className="text-3xl font-bold mb-3 text-gray-900 dark:text-white"
                     >
                       Message Received!
                     </motion.h3>
                     <motion.p 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.3 }}
                       className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed"
                     >
                       Thank you for reaching out. Our team is already looking into your request and will contact you shortly.
                     </motion.p>
                     
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.4 }}
                       className="mt-8"
                     >
                       <Button onClick={() => setSent(false)} variant="secondary" className="px-8 border-gray-200 dark:border-white/10">
                         Send another message
                       </Button>
                     </motion.div>

                     {/* Background decorative ring */}
                     <motion.div 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1.5, opacity: 0.1 }}
                       transition={{ duration: 1 }}
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-500 rounded-full -z-10"
                     />
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First name</label>
                          <input type="text" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="First name" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last name</label>
                          <input type="text" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Last name" required />
                        </div>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                       <input type="email" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="you@company.com" required />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                       <textarea rows={4} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none transition-all" placeholder="Tell us how we can help..." required></textarea>
                     </div>

                     <Button type="submit" className="w-full py-4 text-lg shadow-lg shadow-primary/20">Send Message</Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contact;