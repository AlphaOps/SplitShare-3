'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Shield,
  Zap,
  Brain,
  Lock,
  TrendingDown,
  Clock,
  Users,
  RefreshCw,
  DollarSign,
  Activity,
  Award,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: RefreshCw,
    title: 'Auto Password Rotation',
    description: 'Passwords automatically change after each slot for maximum security',
    color: 'from-primary to-primary/50',
    highlight: 'Every 2 hours'
  },
  {
    icon: Brain,
    title: 'AI Time Allocation',
    description: 'Smart AI allocates optimal viewing slots based on your patterns',
    color: 'from-secondary to-secondary/50',
    highlight: 'Zero conflicts'
  },
  {
    icon: DollarSign,
    title: 'Pay-Per-Use',
    description: 'Only pay for hours you actually watch, not the full month',
    color: 'from-accent to-accent/50',
    highlight: '₹0.72/hour'
  },
  {
    icon: Shield,
    title: 'Zero-Knowledge Security',
    description: 'Military-grade AES-256-GCM encryption, you never see others passwords',
    color: 'from-primary to-primary/50',
    highlight: 'Bank-level'
  },
  {
    icon: TrendingDown,
    title: '98% Savings',
    description: 'Save up to ₹639/month on Netflix Premium compared to full price',
    color: 'from-secondary to-secondary/50',
    highlight: 'Guaranteed'
  },
  {
    icon: Clock,
    title: 'Temporary Tokens',
    description: 'Access via 2-hour tokens that auto-expire, no permanent credentials',
    color: 'from-accent to-accent/50',
    highlight: 'Auto-expire'
  },
  {
    icon: Users,
    title: 'Slot Auctions',
    description: 'Bid on premium time slots (8 PM - 10 PM) for best viewing times',
    color: 'from-primary to-primary/50',
    highlight: 'Fair bidding'
  },
  {
    icon: Activity,
    title: 'Usage Heatmap',
    description: 'Visual 7×24 heatmap shows peak hours and best times to book',
    color: 'from-secondary to-secondary/50',
    highlight: 'Live data'
  },
  {
    icon: Award,
    title: 'Referral Rewards',
    description: 'Invite friends and earn ₹50 credit per referral, they get ₹25',
    color: 'from-accent to-accent/50',
    highlight: 'Unlimited'
  },
  {
    icon: Lock,
    title: 'Parental Controls',
    description: 'PIN-protected content filtering, time limits, and genre blocking',
    color: 'from-primary to-primary/50',
    highlight: 'Kid-safe'
  },
  {
    icon: Zap,
    title: 'Real-Time Streaming',
    description: 'Stream via secure proxy with heartbeat monitoring every 30 seconds',
    color: 'from-secondary to-secondary/50',
    highlight: 'No buffering'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get notified 5 minutes before your slot with new credentials',
    color: 'from-accent to-accent/50',
    highlight: 'Multi-channel'
  }
];

export function FeaturesShowcase() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Revolutionary <span className="text-primary">Features</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            Industry-first features that make SplitShare the most secure and affordable OTT sharing platform
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="h-full hover:border-primary/50 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-sm text-muted">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">58+</div>
                <div className="text-sm text-muted">API Endpoints</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">70+</div>
                <div className="text-sm text-muted">Features</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
                <div className="text-sm text-muted">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted">Users Ready</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
