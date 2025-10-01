'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import clsx from 'clsx';

interface SubscriptionDetailsProps {
  subscription: {
    id: string;
    serviceName: string;
    serviceLogo: string;
    planName: string;
    planType: 'standard' | 'premium' | 'basic';
    status: 'active' | 'inactive' | 'pending' | 'expired';
    daysLeft: number;
    totalEarnings: number;
    billingImage?: string;
    credentials?: string;
    selectedDate?: string;
  };
  onBack?: () => void;
  onRaiseComplaint?: () => void;
  onSendToVerification?: () => void;
}

export function SubscriptionDetails({ 
  subscription, 
  onBack,
  onRaiseComplaint,
  onSendToVerification
}: SubscriptionDetailsProps) {
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    subscription.selectedDate || new Date().toISOString().split('T')[0]
  );
  const [billingImage, setBillingImage] = useState(subscription.billingImage);
  const [credentials, setCredentials] = useState(subscription.credentials);

  const planTypeColors = {
    standard: 'bg-pink-500/20 text-pink-500 border-pink-500/30',
    premium: 'bg-accent/20 text-accent border-accent/30',
    basic: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
  };

  const statusColors = {
    active: 'bg-secondary text-white',
    inactive: 'bg-muted/30 text-muted',
    pending: 'bg-accent/20 text-accent',
    expired: 'bg-red-500/20 text-red-500'
  };

  const termsText = `Terms and Conditions

If you leave a family group and join a new one, you won't be able to join another family group for 12 months.

I have read, understand, and agree to comply with the refund policy.

I confirm that, and I understand that TheSubscription is not associated or affiliated with any subscription provider.

I have read, understand, and agree to comply with (......) sharing terms and conditions.

I agree that the person sharing this subscription is either my family member, or same household member.`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{subscription.serviceName}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 pb-32 max-w-2xl">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className={clsx(
            'px-4 py-2 rounded-full text-sm font-semibold border',
            planTypeColors[subscription.planType]
          )}>
            {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)}
          </span>
          <span className={clsx(
            'px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2',
            statusColors[subscription.status]
          )}>
            {subscription.status === 'active' && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </motion.div>

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 p-3 flex items-center justify-center">
                <img
                  src={subscription.serviceLogo}
                  alt={subscription.serviceName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{subscription.planName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{subscription.daysLeft} days left</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Total Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative p-6 rounded-2xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-80" />
            
            <div className="relative z-10">
              <p className="text-white/80 text-sm mb-1">Total earnings in this pool.</p>
              <p className="text-white text-3xl font-bold">₹ {subscription.totalEarnings.toFixed(1)}</p>
            </div>
          </div>
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-muted" />
              <h3 className="font-bold text-lg">Terms & Conditions</h3>
            </div>

            <div className="space-y-3 text-sm text-muted">
              <AnimatePresence mode="wait">
                {showFullTerms ? (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="whitespace-pre-line"
                  >
                    {termsText}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {termsText.split('\n').slice(0, 6).join('\n')}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowFullTerms(!showFullTerms)}
                className="text-primary hover:text-primary/80 transition-colors font-semibold flex items-center gap-1"
              >
                {showFullTerms ? (
                  <>
                    See Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    See More <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Add Billing Image & Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className={clsx(
              'relative p-8 rounded-2xl border-2 border-dashed transition-all',
              'hover:border-primary/50 hover:bg-white/5',
              billingImage ? 'border-primary/30 bg-primary/5' : 'border-white/20'
            )}>
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="p-4 rounded-full bg-white/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    {billingImage ? 'Image Uploaded' : 'Add Billing Image & Credentials Details'}
                  </p>
                  <p className="text-sm text-muted">
                    {billingImage ? 'Click to change' : 'Click to upload'}
                  </p>
                </div>
              </div>
              {billingImage && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img src={billingImage} alt="Billing" className="w-full h-auto" />
                </div>
              )}
            </div>
          </label>
        </motion.div>

        {/* Select Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <h3 className="font-bold text-lg mb-4">Select Date</h3>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={clsx(
                  'w-full px-4 py-3 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-300',
                  'text-white'
                )}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Raise Complaints */}
          <motion.button
            onClick={onRaiseComplaint}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'flex-1 px-6 py-4 rounded-xl font-bold transition-all',
              'bg-transparent border-2 border-red-500 text-red-500',
              'hover:bg-red-500/10'
            )}
          >
            Raise Complaints
          </motion.button>

          {/* Send to Verification */}
          <motion.button
            onClick={onSendToVerification}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'flex-1 px-6 py-4 rounded-xl font-bold transition-all',
              'backdrop-blur-md bg-white/10 border border-white/20',
              'hover:bg-white/20'
            )}
          >
            Send to Verification
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
