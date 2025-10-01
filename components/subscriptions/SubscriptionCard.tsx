'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export interface Subscription {
  id: string;
  serviceName: string;
  serviceLogo: string;
  planName: string;
  planType: 'standard' | 'premium' | 'basic';
  status: 'active' | 'inactive' | 'pending' | 'expired';
  validityDays: number;
  currentMembers: number;
  totalMembers: number;
  price: number;
  role: 'host' | 'member';
  startDate: string;
  endDate: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  index?: number;
  onClick?: () => void;
}

export function SubscriptionCard({ 
  subscription, 
  index = 0,
  onClick 
}: SubscriptionCardProps) {
  const statusColors = {
    active: 'bg-secondary text-white',
    inactive: 'bg-muted/30 text-muted',
    pending: 'bg-accent/20 text-accent',
    expired: 'bg-red-500/20 text-red-500'
  };

  const planTypeColors = {
    standard: 'bg-pink-500/20 text-pink-500 border-pink-500/30',
    premium: 'bg-accent/20 text-accent border-accent/30',
    basic: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'relative p-5 rounded-2xl',
          'backdrop-blur-md bg-white/5 border border-white/10',
          'hover:bg-white/10 hover:border-white/20',
          'transition-all duration-300'
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center flex-shrink-0">
            <img
              src={subscription.serviceLogo}
              alt={subscription.serviceName}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg truncate">
                  {subscription.serviceName}
                </h3>
                <p className="text-sm text-muted">{subscription.planName}</p>
              </div>

              {/* More Options */}
              <button className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <MoreVertical className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Plan Type Badge */}
              <span className={clsx(
                'px-3 py-1 rounded-full text-xs font-semibold border',
                planTypeColors[subscription.planType]
              )}>
                {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)}
              </span>

              {/* Status Badge */}
              <span className={clsx(
                'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1',
                statusColors[subscription.status]
              )}>
                {subscription.status === 'active' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>

              {/* Role Badge */}
              {subscription.role === 'host' && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                  Host
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {/* Validity */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted" />
            <span className="text-muted">Validity:</span>
            <span className="font-semibold">{subscription.validityDays} Days</span>
          </div>

          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted" />
              <span className="text-muted">Members:</span>
              <span className="font-semibold">
                {subscription.currentMembers}/{subscription.totalMembers}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-[100px] ml-4">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(subscription.currentMembers / subscription.totalMembers) * 100}%` 
                  }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={clsx(
                    'h-full rounded-full',
                    subscription.currentMembers === subscription.totalMembers
                      ? 'bg-secondary'
                      : 'bg-primary'
                  )}
                />
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">₹{subscription.price}</span>
              <span className="text-sm text-muted ml-1">/month</span>
            </div>

            <motion.a
              href={`/subscription/${subscription.id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 font-semibold text-sm transition-colors inline-block text-center"
            >
              View Details
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
