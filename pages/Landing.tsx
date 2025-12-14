import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Globe, ShieldCheck, BarChart3, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-20">
        
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                Ready to Scale Your Operations <br className="hidden md:block"/> with <span className="text-primary">FintechNova?</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of businesses trusting FintechNova to process their payments and automate financial flows.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-blue-600 text-white text-lg px-8 py-4 h-auto shadow-xl shadow-primary/20 rounded-full">
                  Get Started
                </Button>
                {/* Secondary Button corrected for visibility on white */}
                <Button variant="secondary" onClick={() => navigate('/contact')} className="text-lg px-8 py-4 h-auto rounded-full bg-white dark:bg-transparent border-2 border-primary text-primary hover:bg-primary/5 dark:text-white dark:border-white/20 dark:hover:bg-white/10">
                  Talk to a Consultant
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* Feature Highlights Section (Chart & API) */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-[#0C1424]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-6">
                New API v2.0 Available
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                Financial Technology to <span className="text-primary">Power the Future</span> of Your Business.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Secure, scalable solutions that simplify payments, automate financial flows, and support global operations. Experience the next generation of fintech infrastructure.
              </p>
              
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')} className="px-6 h-12">Create Free Account</Button>
                <Button onClick={() => navigate('/solutions')} variant="ghost" className="px-6 h-12 text-primary hover:bg-primary/5">View Solutions</Button>
              </div>
            </motion.div>

            {/* Analytics Card Mockup */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-white dark:bg-[#111B2E] rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5 w-full mx-auto"
            >
               <div className="flex justify-between items-start mb-8">
                 <div>
                   <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                   <p className="text-xs text-gray-400">Last 7 days</p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold text-primary">R$ 142.302</p>
                   <p className="text-sm font-semibold text-emerald-500">+12.5% vs last week</p>
                 </div>
               </div>

               {/* Fake Chart Line - Responsive Fix */}
               <div className="h-40 w-full mb-8 relative flex items-end justify-between">
                  <div className="absolute inset-0 flex items-center">
                     {/* Added viewBox for proper scaling on mobile */}
                     <svg className="w-full h-full overflow-visible" viewBox="0 0 450 100" preserveAspectRatio="xMidYMid meet">
                        <path d="M0,100 C50,80 100,120 150,60 C200,20 250,50 300,40 C350,30 400,10 450,0" fill="none" stroke="#3B74FF" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                     </svg>
                     <div className="absolute left-[0%] bottom-[35%] w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-gray-800"></div>
                     <div className="absolute left-[33%] bottom-[60%] w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-gray-800"></div>
                     <div className="absolute left-[66%] bottom-[73%] w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-gray-800"></div>
                     <div className="absolute right-[0%] top-[0%] w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-gray-800 shadow-lg shadow-primary/50"></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                       <div className="bg-emerald-100 dark:bg-emerald-500/20 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                         <ArrowUpRight size={16} />
                       </div>
                       <span className="text-xs font-semibold text-gray-500">Inflow</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">R$ 84k</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                       <div className="bg-red-100 dark:bg-red-500/20 p-1.5 rounded-lg text-red-600 dark:text-red-400">
                         <ArrowDownRight size={16} />
                       </div>
                       <span className="text-xs font-semibold text-gray-500">Outflow</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">R$ 32k</p>
                 </div>
               </div>
            </motion.div>

          </div>
        </section>

        {/* NEW Trust Bar Section (Moved Here) */}
        <section className="py-12 border-t border-gray-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
             <p className="text-center text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">Trusted by Innovative Companies</p>
             <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-bold font-sans text-gray-700 dark:text-gray-300">TrustPay</span>
                <span className="text-xl font-bold font-sans text-gray-700 dark:text-gray-300">NovaBank Cloud</span>
                <span className="text-xl font-bold font-sans text-gray-700 dark:text-gray-300">FinCore Systems</span>
                <span className="text-xl font-bold font-sans text-gray-700 dark:text-gray-300">BlueGate Holdings</span>
             </div>
          </div>
        </section>

        {/* NEW Infrastructure Section */}
        <section className="py-24 px-6 bg-[#111B2E] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Next-Generation <br/> <span className="text-primary">Financial Infrastructure</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Built for developers, optimized for business. Our architecture guarantees bank-level stability and security.
              </p>
              
              <div className="space-y-4">
                {[
                  "99.997% uptime guaranteed by SLA",
                  "Real-time auditing and reconciliation",
                  "Robust RESTful API + Webhooks",
                  "End-to-end encryption (AES-256)",
                  "Proprietary AI anti-fraud system"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="text-primary" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button onClick={() => navigate('/solutions')} className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                   Explore Documentation
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Code Snippet */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-[#0C1424] rounded-xl border border-white/10 p-6 shadow-2xl font-mono text-sm overflow-x-auto relative"
            >
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <div className="text-gray-300 space-y-1">
                 <p><span className="text-purple-400">const</span> <span className="text-blue-400">transaction</span> = <span className="text-purple-400">await</span> fintech.createCharge(&#123;</p>
                 <p className="pl-4"><span className="text-red-400">amount</span>: <span className="text-yellow-400">5000</span>,</p>
                 <p className="pl-4"><span className="text-red-400">currency</span>: <span className="text-green-400">'USD'</span>,</p>
                 <p className="pl-4"><span className="text-red-400">customer</span>: &#123;</p>
                 <p className="pl-8"><span className="text-red-400">email</span>: <span className="text-green-400">'user@example.com'</span></p>
                 <p className="pl-4"> &#125;,</p>
                 <p className="pl-4"><span className="text-red-400">payment_method</span>: <span className="text-green-400">'card'</span></p>
                 <p>&#125;);</p>
                 <br/>
                 <p className="text-gray-500">// Response: 200 OK</p>
                 <p><span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(transaction.<span className="text-red-400">status</span>); <span className="text-gray-500">// 'approved'</span></p>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-[#0C1424]">
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Everything you need to grow</h2>
               <p className="text-gray-500">Powerful tools designed for modern financial teams.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: Zap, title: "Instant Payments", desc: "Real-time processing with high availability." },
                 { icon: Globe, title: "Global Gateway", desc: "Accept currencies from 150+ countries frictionlessly." },
                 { icon: ShieldCheck, title: "Integrated API", desc: "Clear documentation and integration in minutes." },
                 { icon: BarChart3, title: "Smart Management", desc: "Total control of receivables and cash flow." }
               ].map((feature, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   viewport={{ once: true }}
                   className="bg-white dark:bg-[#111B2E] p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1"
                 >
                   <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                     <feature.icon size={28} />
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                 </motion.div>
               ))}
             </div>
           </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
};

export default Landing;