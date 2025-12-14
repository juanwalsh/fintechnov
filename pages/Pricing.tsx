import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import Button from '../components/ui/Button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Enterprise') {
      navigate('/contact');
    } else {
      // Pass the selected plan to the login page via state
      navigate('/login', { state: { plan: planName } });
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      desc: "Perfect for freelancers and side projects.",
      features: ["Up to $10k monthly volume", "5 Virtual Cards", "Basic Analytics", "Email Support"],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Growth",
      price: "$49",
      period: "/month",
      desc: "For scaling startups and small teams.",
      features: ["Up to $100k monthly volume", "Unlimited Virtual Cards", "Advanced Analytics", "Priority Support", "API Access"],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Full infrastructure for large organizations.",
      features: ["Unlimited volume", "Dedicated Account Manager", "Custom Integrations", "SLA Guarantee", "On-premise deployment"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 pt-20">
        <section className="py-20 px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Simple, Transparent <span className="text-primary">Pricing</span>
          </motion.h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that best fits your business needs.
          </p>
        </section>

        <section className="pb-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-primary bg-primary/5 dark:bg-[#111B2E] shadow-2xl shadow-primary/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#0C1424] shadow-xl'} flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{plan.desc}</p>
                </div>

                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check size={20} className="text-primary mr-3 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => handlePlanSelect(plan.name)} 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Pricing;