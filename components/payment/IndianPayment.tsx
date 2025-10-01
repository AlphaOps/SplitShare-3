'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Check,
  ArrowLeft,
  Loader2,
  Shield
} from 'lucide-react';
import clsx from 'clsx';

type PaymentMethod = 'phonepe' | 'gpay' | 'upi' | 'card';

interface IndianPaymentProps {
  amount: number;
  subscriptionName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IndianPayment({ 
  amount, 
  subscriptionName, 
  onSuccess, 
  onCancel 
}: IndianPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const paymentMethods = [
    {
      id: 'phonepe' as PaymentMethod,
      name: 'PhonePe',
      icon: '📱',
      color: 'from-purple-600 to-purple-800',
      description: 'Pay using PhonePe app'
    },
    {
      id: 'gpay' as PaymentMethod,
      name: 'Google Pay',
      icon: '🔵',
      color: 'from-blue-600 to-blue-800',
      description: 'Pay using Google Pay'
    },
    {
      id: 'upi' as PaymentMethod,
      name: 'UPI',
      icon: '🏦',
      color: 'from-green-600 to-green-800',
      description: 'Pay using any UPI app'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Debit/Credit Card',
      icon: '💳',
      color: 'from-orange-600 to-red-600',
      description: 'Pay using card (INR only)'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    onSuccess?.();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'phonepe':
      case 'gpay':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto mb-6 rounded-2xl bg-white p-4">
                <QrCode className="w-full h-full text-black" />
              </div>
              <p className="text-muted mb-2">Scan QR code with {selectedMethod === 'phonepe' ? 'PhonePe' : 'Google Pay'}</p>
              <p className="text-2xl font-bold text-primary">₹{amount}</p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
                'font-bold text-white transition-all duration-300',
                'bg-primary hover:bg-primary/90',
                'shadow-glow',
                'disabled:opacity-50'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>I've Completed Payment</span>
                </>
              )}
            </button>
          </motion.div>
        );

      case 'upi':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-muted mb-2">
                Enter UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className={clsx(
                  'w-full px-4 py-3 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-300',
                  'text-white placeholder-muted'
                )}
              />
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-blue-400">
                💡 You'll receive a payment request on your UPI app
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={!upiId || isProcessing}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
                'font-bold text-white transition-all duration-300',
                'bg-primary hover:bg-primary/90',
                'shadow-glow',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{amount}</span>
                </>
              )}
            </button>
          </motion.div>
        );

      case 'card':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-muted mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={clsx(
                  'w-full px-4 py-3 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-300',
                  'text-white placeholder-muted'
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                placeholder="JOHN DOE"
                className={clsx(
                  'w-full px-4 py-3 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-300',
                  'text-white placeholder-muted'
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-muted mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={clsx(
                    'w-full px-4 py-3 rounded-xl',
                    'backdrop-blur-md bg-white/5 border border-white/10',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'transition-all duration-300',
                    'text-white placeholder-muted'
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  placeholder="123"
                  maxLength={3}
                  className={clsx(
                    'w-full px-4 py-3 rounded-xl',
                    'backdrop-blur-md bg-white/5 border border-white/10',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'transition-all duration-300',
                    'text-white placeholder-muted'
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <Shield className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-400">
                Your payment is secured with 256-bit encryption
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv || isProcessing}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
                'font-bold text-white transition-all duration-300',
                'bg-primary hover:bg-primary/90',
                'shadow-glow',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{amount}</span>
                </>
              )}
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        {selectedMethod && (
          <button
            onClick={() => setSelectedMethod(null)}
            className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to payment methods</span>
          </button>
        )}
        <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
        <p className="text-muted">
          {subscriptionName} • <span className="text-primary font-bold">₹{amount}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedMethod ? (
          <motion.div
            key="methods"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {paymentMethods.map((method, index) => (
              <motion.button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'w-full flex items-center gap-4 p-4 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'hover:bg-white/10 hover:border-white/20',
                  'transition-all duration-300'
                )}
              >
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  'bg-gradient-to-br',
                  method.color
                )}>
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{method.name}</div>
                  <div className="text-sm text-muted">{method.description}</div>
                </div>
                <div className="text-muted">→</div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderPaymentForm()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-4 px-6 py-3 rounded-xl text-muted hover:text-white transition-colors"
        >
          Cancel
        </button>
      )}
    </GlassCard>
  );
}
