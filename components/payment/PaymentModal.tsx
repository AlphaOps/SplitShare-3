'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Wallet, Globe, CheckCircle, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    priceINR: number;
    priceUSD: number;
  } | null;
  currency: 'INR' | 'USD';
  billingPeriod: 'month' | 'year';
}

const paymentMethods = {
  INR: [
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '📱',
      description: 'UPI Payment',
      color: 'from-purple-600 to-purple-800'
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: 'G',
      description: 'UPI Payment',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: '💰',
      description: 'Wallet Payment',
      color: 'from-cyan-600 to-blue-800'
    }
  ],
  USD: [
    {
      id: 'stripe',
      name: 'Credit Card',
      icon: '💳',
      description: 'Powered by Stripe',
      color: 'from-indigo-600 to-purple-700'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'P',
      description: 'Fast & Secure',
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: '₿',
      description: 'BTC, ETH, USDT',
      color: 'from-orange-500 to-yellow-600'
    }
  ]
};

export function PaymentModal({ isOpen, onClose, plan, currency, billingPeriod }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!plan) return null;

  const price = currency === 'INR' ? plan.priceINR : plan.priceUSD;
  const yearlyPrice = Math.floor(price * 12 * 0.8);
  const finalPrice = billingPeriod === 'month' ? price : yearlyPrice;
  const currencySymbol = currency === 'INR' ? '₹' : '$';
  const methods = paymentMethods[currency];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setSelectedMethod(null);
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard className="relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Success State */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <CheckCircle className="w-24 h-24 mx-auto text-secondary mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
                    <p className="text-muted">
                      Welcome to {plan.name} plan. Redirecting to dashboard...
                    </p>
                  </motion.div>
                )}

                {/* Payment Form */}
                {!success && (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-2">Complete Your Purchase</h2>
                      <p className="text-muted">Choose your preferred payment method</p>
                    </div>

                    {/* Plan Summary */}
                    <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{plan.name} Plan</h3>
                          <p className="text-sm text-muted capitalize">{billingPeriod}ly Billing</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">
                            {currencySymbol}{finalPrice}
                          </div>
                          <p className="text-sm text-muted">/{billingPeriod}</p>
                        </div>
                      </div>
                      {billingPeriod === 'year' && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-sm text-secondary">
                            💰 You're saving {currencySymbol}{(price * 12 - yearlyPrice)} with annual billing!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {methods.map((method) => (
                          <motion.button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              selectedMethod === method.id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                                {method.icon}
                              </div>
                              <div className="flex-grow">
                                <div className="font-semibold">{method.name}</div>
                                <div className="text-sm text-muted">{method.description}</div>
                              </div>
                              {selectedMethod === method.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Details */}
                    {selectedMethod && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                      >
                        <GlassCard className="bg-white/5">
                          <h4 className="font-semibold mb-4">Payment Details</h4>
                          
                          {/* Card Payment Form */}
                          {(selectedMethod === 'card' || selectedMethod === 'stripe') && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">CVV</label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* UPI Payment */}
                          {(selectedMethod === 'phonepe' || selectedMethod === 'gpay') && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">UPI ID</label>
                                <input
                                  type="text"
                                  placeholder="yourname@upi"
                                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                                <p className="text-sm text-secondary">
                                  ✓ You'll receive a payment request on your {methods.find(m => m.id === selectedMethod)?.name} app
                                </p>
                              </div>
                            </div>
                          )}

                          {/* PayPal */}
                          {selectedMethod === 'paypal' && (
                            <div className="text-center py-6">
                              <p className="text-muted mb-4">You'll be redirected to PayPal to complete your payment</p>
                              <div className="inline-flex items-center gap-2 text-sm text-secondary">
                                <Globe className="w-4 h-4" />
                                Secure payment via PayPal
                              </div>
                            </div>
                          )}

                          {/* Crypto */}
                          {selectedMethod === 'crypto' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                                <select className="w-full px-4 py-3 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50">
                                  <option>Bitcoin (BTC)</option>
                                  <option>Ethereum (ETH)</option>
                                  <option>Tether (USDT)</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </GlassCard>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <NeonButton
                        onClick={handlePayment}
                        disabled={!selectedMethod || processing}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay {currencySymbol}{finalPrice}
                          </>
                        )}
                      </NeonButton>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secured by 256-bit SSL encryption
                      </p>
                    </div>
                  </>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
