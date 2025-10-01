'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { Check, Zap, Star, Crown } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    priceUSD: 5,
    priceINR: 399,
    period: 'month',
    description: 'Perfect for casual viewers',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    features: [
      '1 Shared Account',
      'Basic Support',
      'Cancel Anytime',
      'Standard Quality',
      'Email Notifications'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    priceUSD: 10,
    priceINR: 799,
    period: 'month',
    description: 'Best for regular streamers',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    features: [
      '3 Shared Accounts',
      'Priority Support',
      '3D Dashboard Access',
      'HD Quality',
      'Smart Recommendations',
      'Slot Swapping'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceUSD: 20,
    priceINR: 1599,
    period: 'month',
    description: 'For power users & families',
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    features: [
      'Unlimited Shared Accounts',
      'Dedicated Manager',
      'Advanced Analytics',
      '4K Quality',
      'AI-Powered Optimization',
      'Priority Slot Booking',
      'Custom Integrations'
    ],
    popular: false
  }
];

const faqs = [
  {
    question: 'How does subscription sharing work?',
    answer: 'SplitShare connects you with other users to share subscription costs. Our AI optimizes slot allocation to ensure everyone gets their preferred viewing times.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! All plans are month-to-month with no long-term commitments. Cancel anytime from your dashboard.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and cryptocurrency payments for maximum flexibility.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level encryption and never share your personal information with third parties.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Choose Your <span className="text-primary neon">Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Unlock premium streaming at a fraction of the cost. AI-powered slot management ensures you never miss your favorite shows.
          </p>

          {/* Billing & Currency Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 glass rounded-full p-2"
            >
              <button
                onClick={() => setBillingPeriod('month')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingPeriod === 'month'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-muted hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('year')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingPeriod === 'year'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-muted hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-accent text-background px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </motion.div>

            {/* Currency Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 glass rounded-full p-2"
            >
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  currency === 'INR'
                    ? 'bg-secondary text-white shadow-glowGreen'
                    : 'text-muted hover:text-white'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  currency === 'USD'
                    ? 'bg-secondary text-white shadow-glowGreen'
                    : 'text-muted hover:text-white'
                }`}
              >
                $ USD
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative px-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const basePrice = currency === 'INR' ? plan.priceINR : plan.priceUSD;
            const yearlyPrice = Math.floor(basePrice * 12 * 0.8);
            const displayPrice = billingPeriod === 'month' ? basePrice : yearlyPrice;
            const currencySymbol = currency === 'INR' ? '₹' : '$';
            
            return (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative"
                style={{ perspective: '1000px' }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-glow">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <GlassCard 
                  className={`relative h-full flex flex-col ${
                    plan.popular ? 'border-primary/50 shadow-glow' : ''
                  }`}
                  style={{
                    boxShadow: plan.popular ? `0 0 40px ${plan.glowColor}` : undefined
                  }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold">{currencySymbol}{displayPrice}</span>
                      <span className="text-muted">/{billingPeriod}</span>
                    </div>
                    {billingPeriod === 'year' && (
                      <p className="text-sm text-secondary mt-2">
                        {currencySymbol}{(yearlyPrice / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <NeonButton 
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPaymentModal(true);
                    }}
                  >
                    Get Started
                  </NeonButton>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Comparison Table */}
      <section className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Compare <span className="text-primary">Features</span>
          </h2>
          
          <GlassCard className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.name} className="text-center py-4 px-6 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Shared Accounts', values: ['1', '3', 'Unlimited'] },
                  { feature: 'Video Quality', values: ['SD', 'HD', '4K'] },
                  { feature: 'Support Level', values: ['Basic', 'Priority', 'Dedicated'] },
                  { feature: 'AI Recommendations', values: ['❌', '✅', '✅'] },
                  { feature: 'Slot Swapping', values: ['❌', '✅', '✅'] },
                  { feature: 'Analytics', values: ['❌', '❌', '✅'] },
                ].map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">{row.feature}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="text-center py-4 px-6 text-muted">
                        {value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className="cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted mt-4 pt-4 border-t border-white/10">
                      {faq.answer}
                    </p>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <GlassCard className="text-center p-12 border-primary/30 shadow-glow">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start <span className="text-primary">Saving?</span>
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of smart streamers who are cutting their subscription costs by up to 70% with SplitShare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton variant="primary" className="text-lg px-8 py-4">
                Start Free Trial
              </NeonButton>
              <NeonButton variant="secondary" className="text-lg px-8 py-4">
                Contact Sales
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        currency={currency}
        billingPeriod={billingPeriod}
      />
    </main>
  );
}
