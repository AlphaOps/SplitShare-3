'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Wallet,
  FileText,
  Check,
  Clock,
  Copy,
  Share2,
  Upload,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PaymentSection } from './PaymentSection';
import clsx from 'clsx';
import QRCode from 'qrcode';

interface CheckoutFlowProps {
  subscription: {
    id: string;
    name: string;
    logo: string;
    planType: string;
    members: number;
    price: number;
    platformFee: number;
  };
  walletBalance: number;
  onBack?: () => void;
  onComplete?: () => void;
}

type CheckoutStep = 'details' | 'payment' | 'verification';

export function CheckoutFlow({
  subscription,
  walletBalance,
  onBack,
  onComplete
}: CheckoutFlowProps) {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [showDetails, setShowDetails] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);

  const grandTotal = subscription.price + subscription.platformFee;
  
  // Bank account details
  const bankDetails = {
    name: 'State Bank of India - 7353',
    accountType: 'Primary account for receiving money',
    upiId: '9209248049@ybl',
    icon: '🏦'
  };

  // Generate QR Code
  useEffect(() => {
    if (step === 'payment') {
      const upiString = `upi://pay?pa=${bankDetails.upiId}&pn=SplitShare&am=${grandTotal}&cu=INR`;
      QRCode.toDataURL(upiString, {
        width: 350,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCode);
    }
  }, [step, grandTotal]);

  // Countdown timer
  useEffect(() => {
    if (step === 'payment' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(bankDetails.upiId);
    // Show toast notification
    alert('UPI ID copied to clipboard!');
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Payment QR Code',
        text: `Pay ₹${grandTotal} to SplitShare`
      });
    }
  };

  const handleSendRequest = () => {
    if (!paymentScreenshot) {
      alert('Please upload payment screenshot');
      return;
    }
    setStep('verification');
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  const terms = [
    'If you leave a family group and join a new one, you won\'t be able to join another family group for 12 months.',
    'I have read, understand, and agree to comply with the refund policy.',
    'I confirm that, and I understand that TheSubscription is not associated or affiliated with any subscription provider.',
    'I have read, understand, and agree to comply with Spotify sharing terms and conditions.',
    'I agree that the person sharing this subscription is either my family member, or same household member.'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with 3D Effect */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-background via-background/95 to-background border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Checkout
              </h1>
            </div>
            {step === 'payment' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30"
              >
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-mono font-bold text-accent">{formatTime(countdown)}</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-6 pb-32 max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              {/* Subscription Card with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.1 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <GlassCard className="relative overflow-hidden group">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      background: [
                        'linear-gradient(135deg, rgba(229,9,20,0.2) 0%, rgba(29,185,84,0.2) 50%, rgba(255,215,0,0.2) 100%)',
                        'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(229,9,20,0.2) 50%, rgba(29,185,84,0.2) 100%)',
                        'linear-gradient(135deg, rgba(29,185,84,0.2) 0%, rgba(255,215,0,0.2) 50%, rgba(229,9,20,0.2) 100%)'
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />

                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 rounded-2xl bg-white/10 p-3 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl"
                      >
                        <img
                          src={subscription.logo}
                          alt={subscription.name}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{subscription.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-500 border border-pink-500/30">
                            {subscription.planType}
                          </span>
                          <span className="text-sm text-muted">
                            {subscription.members} Members
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => setShowDetails(!showDetails)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                    >
                      <span className="text-primary font-semibold">Show Details</span>
                      <motion.div
                        animate={{ rotate: showDetails ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-primary" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm"
                        >
                          <div className="flex justify-between">
                            <span className="text-muted">Plan Duration</span>
                            <span className="font-semibold">30 Days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">Access Type</span>
                            <span className="font-semibold">Shared Pool</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">Screen Quality</span>
                            <span className="font-semibold">4K Ultra HD</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Wallet Balance with 3D Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                      >
                        <Wallet className="w-6 h-6 text-purple-400" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-muted mb-1">Wallet Balance</p>
                        <p className="text-3xl font-bold">₹{walletBalance.toFixed(2)}</p>
                      </div>
                    </div>
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-accent checked:bg-accent"
                      />
                      <span className="text-accent font-semibold">Use Available Wallet balance</span>
                    </motion.label>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Billing Details with Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-white/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Billing Details</h3>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                    >
                      <span className="text-muted">Subscription Price</span>
                      <span className="text-xl font-bold">₹{subscription.price.toFixed(2)}</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                    >
                      <span className="text-muted">Platform Fee</span>
                      <span className="text-xl font-bold">₹{subscription.platformFee}</span>
                    </motion.div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="relative p-4 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted mb-1">Grand Total</p>
                          <p className="text-xs text-muted">Your total payable amount</p>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-3xl font-bold text-primary"
                        >
                          ₹{grandTotal.toFixed(2)}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Terms & Conditions with Enhanced UI */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <motion.button
                    onClick={() => setShowTerms(!showTerms)}
                    whileHover={{ scale: 1.01 }}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold">Terms & Conditions</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: showTerms ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showTerms && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 mb-6"
                      >
                        {terms.map((term, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-3 text-sm text-muted"
                          >
                            <span className="text-primary">•</span>
                            <span>{term}</span>
                          </motion.div>
                        ))}
                        <motion.button
                          onClick={() => setShowTerms(false)}
                          className="text-primary hover:text-primary/80 transition-colors font-semibold text-sm"
                        >
                          See Less
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <motion.div
                      animate={{ scale: termsAccepted ? [1, 1.2, 1] : 1 }}
                      className={clsx(
                        'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        termsAccepted
                          ? 'bg-primary border-primary'
                          : 'border-white/30'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="hidden"
                      />
                      {termsAccepted && <Check className="w-4 h-4 text-white" />}
                    </motion.div>
                    <span className="text-sm">
                      I have read agreement and agree with the{' '}
                      <span className="text-primary font-semibold">Terms & Conditions</span>
                    </span>
                  </motion.label>
                </GlassCard>
              </motion.div>

              {/* Enhanced Pay Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-bold"
                >
                  ₹{grandTotal.toFixed(2)}
                </motion.div>

                <motion.button
                  onClick={() => termsAccepted && setStep('payment')}
                  disabled={!termsAccepted}
                  whileHover={{ scale: termsAccepted ? 1.05 : 1 }}
                  whileTap={{ scale: termsAccepted ? 0.95 : 1 }}
                  className={clsx(
                    'flex-1 px-8 py-4 rounded-2xl font-bold text-lg transition-all relative overflow-hidden',
                    termsAccepted
                      ? 'bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-gradient text-white shadow-2xl shadow-primary/50'
                      : 'bg-white/10 text-muted cursor-not-allowed'
                  )}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    animate={termsAccepted ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Pay & Join</span>
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {/* Payment Section - PhonePe Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-semibold mb-6 text-center"
                >
                  Scan the QR for Payment and send the pool request
                </motion.p>

                <PaymentSection
                  qrCode={qrCode}
                  bankDetails={bankDetails}
                  onCopyUPI={handleCopyUPI}
                  onShare={handleShareQR}
                  onDownload={() => {
                    const link = document.createElement('a');
                    link.download = 'payment-qr.png';
                    link.href = qrCode;
                    link.click();
                  }}
                />
              </motion.div>

              {/* Upload Screenshot Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-2">Attach the Payment Screenshot</h3>
                  <p className="text-sm text-muted mb-4">
                    ( Payment Screenshot will be verified by admin )
                  </p>

                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'relative p-12 rounded-2xl border-2 border-dashed transition-all',
                        paymentScreenshot
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                      )}
                    >
                      {paymentScreenshot ? (
                        <div className="space-y-4">
                          <img
                            src={paymentScreenshot}
                            alt="Payment Screenshot"
                            className="w-full h-48 object-contain rounded-lg"
                          />
                          <p className="text-center text-primary font-semibold">
                            Screenshot Uploaded • Click to change
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-4 rounded-full bg-primary/20"
                          >
                            <Upload className="w-8 h-8 text-primary" />
                          </motion.div>
                          <p className="font-semibold">Click to Upload</p>
                          <p className="text-sm text-muted">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </motion.div>
                  </label>
                </GlassCard>
              </motion.div>

              {/* Send Request Button */}
              <motion.button
                onClick={handleSendRequest}
                disabled={!paymentScreenshot}
                whileHover={{ scale: paymentScreenshot ? 1.02 : 1 }}
                whileTap={{ scale: paymentScreenshot ? 0.98 : 1 }}
                className={clsx(
                  'w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all',
                  paymentScreenshot
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-2xl shadow-primary/50'
                    : 'bg-white/10 text-muted cursor-not-allowed'
                )}
              >
                Send Pool Request
              </motion.button>
            </motion.div>
          )}

          {step === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
              <p className="text-muted">Your payment is being verified by admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
