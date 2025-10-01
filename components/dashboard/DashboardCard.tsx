'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, TrendingDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TimeSlotSelector, TimeSlot } from './TimeSlotSelector';
import { MembersList, Member } from './MembersList';
import { WarningBanner } from './WarningBanner';
import { ActionButtons } from './ActionButtons';
import clsx from 'clsx';

interface Subscription {
  id: string;
  name: string;
  logo: string;
  plan: string;
  price: number;
  originalPrice: number;
  savings: number;
}

interface DashboardCardProps {
  subscription: Subscription;
  members: Member[];
  className?: string;
}

export function DashboardCard({ subscription, members, className }: DashboardCardProps) {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(['morning', 'evening']);
  const [showWarning, setShowWarning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRaiseComplaint = () => {
    console.log('Raising complaint...');
    // Add complaint logic here
  };

  const handleSendToVerification = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Sent to verification');
  };

  return (
    <GlassCard className={clsx('space-y-6', className)}>
      {/* Subscription Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-6 border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center">
            <img 
              src={subscription.logo} 
              alt={subscription.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{subscription.name}</h2>
            <p className="text-sm text-muted">{subscription.plan}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-3xl font-bold text-primary">₹{subscription.price}</span>
            <span className="text-sm text-muted">/month</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <span className="line-through">₹{subscription.originalPrice}</span>
            <TrendingDown className="w-3 h-3 text-secondary" />
            <span className="text-secondary font-semibold">{subscription.savings}% saved</span>
          </div>
        </div>
      </motion.div>

      {/* Warning Banner */}
      {showWarning && (
        <WarningBanner
          message="Please add billing image and credential details first"
          type="warning"
          onDismiss={() => setShowWarning(false)}
        />
      )}

      {/* Date Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={clsx(
              'w-full px-4 py-3 rounded-xl',
              'backdrop-blur-md bg-white/5 border border-white/10',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-all duration-300',
              'text-white'
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Clock className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className={clsx(
              'w-full px-4 py-3 rounded-xl',
              'backdrop-blur-md bg-white/5 border border-white/10',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-all duration-300',
              'text-white'
            )}
          />
        </div>
      </motion.div>

      {/* Time Slots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TimeSlotSelector
          selectedSlots={selectedSlots}
          onSlotsChange={setSelectedSlots}
        />
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MembersList members={members} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ActionButtons
          onRaiseComplaint={handleRaiseComplaint}
          onSendToVerification={handleSendToVerification}
          isLoading={isLoading}
        />
      </motion.div>
    </GlassCard>
  );
}
