import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { Zap, Globe, Shield, CreditCard, PieChart, Smartphone, XCircle, CheckCircle2, Clock, Headphones, Layers, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Solutions: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: "Instant Payments", desc: "Settlement in seconds, not days. Built on modern rails for the real-time economy." },
    { icon: Globe, title: "Global Banking", desc: "Multi-currency accounts in 30+ currencies. Send and receive locally around the world." },
    { icon: Shield, title: "Fraud Protection", desc: "AI-driven fraud detection that stops threats before they happen, without blocking real users." },
    { icon: CreditCard, title: "Virtual Cards", desc: "Issue unlimited virtual cards for your team. Set limits, freeze instantly, and track spending." },
    { icon: PieChart, title: "Smart Analytics", desc: "Deep insights into your cash flow. Visual reports that help you make better decisions." },
    { icon: Smartphone, title: "Mobile First", desc: "A world-class mobile experience. Manage your finances from anywhere, at any time." },
  ];

  const comparison = [
    {
      category: "Settlement Speed",
      traditional: "2-3 business days (T+2)",
      nova: "Instant (Real-time)",
      icon: Clock
    },
    {
      category: "Support",
      traditional: "9am - 5pm, weekdays only",
      nova: "24/7 Dedicated Support",
      icon: Headphones
    },
    {
      category: "Integration",
      traditional: "Legacy files (OFX/CNAB)",
      nova: "Modern RESTful API",
      icon: Layers
    },
    {
      category: "Security",
      traditional: "Reactive fraud checks",
      nova: "Proactive AI Prevention",
      icon: Lock
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              Solutions for the <span className="text-primary">Modern Economy</span>
            </motion.h1>
            <p className="text-xl text-gray-500 dark:text-gray-300 mb-8 leading-relaxed">
              Whether you're a startup or an enterprise, FintechNova provides the infrastructure to scale your financial operations.
            </p>
          </div>
        </section>

        {/* Comparison Section (New) */}
        <section className="py-16 px-6 bg-white dark:bg-[#0C1424]">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why businesses switch to Nova</h2>
               <p className="text-gray-500 dark:text-gray-400">Stop settling for legacy limitations. Upgrade to infrastructure built for today.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional Banks */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#111B2E]/50"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Clock size={20} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">Traditional Banks</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {comparison.map((item, i) => (
                      <div key={i} className="flex items-start opacity-70">
                        <XCircle className="text-red-400 mt-1 mr-4 shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.traditional}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Fintech Nova */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl border-2 border-primary/20 bg-white dark:bg-[#111B2E] shadow-xl shadow-primary/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="flex items-center space-x-3 mb-8 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fintech Nova</h3>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    {comparison.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="text-emerald-500 mt-1 mr-4 shrink-0" size={20} />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.nova}</p>
                          <p className="text-sm text-primary">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
             </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#111B2E] p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Updated CTA Section (Replaced black style with lighter/consistent style) */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-50 dark:bg-[#0C1424] -z-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
          
          <div className="max-w-5xl mx-auto bg-white dark:bg-[#111B2E] rounded-3xl p-12 border border-gray-100 dark:border-white/5 shadow-2xl text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Ready to get started?</h2>
             <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
               Join thousands of businesses that trust FintechNova to power their financial infrastructure.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => navigate('/login', { state: { plan: 'General' } })} className="bg-primary hover:bg-blue-600 px-8 py-4 h-auto text-lg shadow-xl shadow-primary/20">
                  Create Free Account
                </Button>
                <Button onClick={() => navigate('/contact')} variant="secondary" className="px-8 py-4 h-auto text-lg">
                  Contact Sales
                </Button>
             </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Solutions;