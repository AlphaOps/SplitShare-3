'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Award, 
  Users, 
  Activity,
  DollarSign,
  Zap,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  Target,
  Play,
  Pause,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: 'Aayush Yadav',
  email: 'aayush@splitshare.com',
  credits: 1250,
  badges: ['Early Adopter', 'Power User', 'Sharer Pro'],
  subscriptionPlan: 'pro',
  subscriptionStatus: 'active'
};

const mockSubscription = {
  planName: 'Pro',
  price: 799,
  currency: 'INR',
  billingPeriod: 'month',
  nextBillingDate: '2025-10-30',
  status: 'active',
  sharedAccounts: 3,
  maxAccounts: 3
};

const mockPaymentHistory = [
  { id: '1', date: '2025-09-30', amount: 799, status: 'completed', method: 'PhonePe' },
  { id: '2', date: '2025-08-30', amount: 799, status: 'completed', method: 'GPay' },
  { id: '3', date: '2025-07-30', amount: 799, status: 'completed', method: 'Card' }
];

const mockSlots = [
  { id: '1', service: 'Netflix', time: '8:00 PM - 10:00 PM', status: 'active', savings: 150 },
  { id: '2', service: 'Disney+', time: '6:00 PM - 8:00 PM', status: 'active', savings: 120 },
  { id: '3', service: 'Prime Video', time: '10:00 PM - 12:00 AM', status: 'upcoming', savings: 100 }
];

const mockAnalytics = {
  totalSavings: 2450,
  savingsGrowth: 12.5,
  activeSlots: 3,
  slotsGrowth: 8.3,
  creditsEarned: 1250,
  creditsGrowth: 15.2,
  sharingScore: 94
};

export default function EnhancedDashboard() {
  const [user] = useState(mockUser);
  const [subscription] = useState(mockSubscription);
  const [paymentHistory] = useState(mockPaymentHistory);
  const [slots] = useState(mockSlots);
  const [analytics] = useState(mockAnalytics);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'analytics' | 'payments'>('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">
                Welcome back, <span className="text-primary">{user.name}</span>!
              </h1>
              <p className="text-muted">Here's what's happening with your subscriptions</p>
            </div>
            <div className="flex items-center gap-4">
              <GlassCard className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted">Credits</p>
                    <p className="text-2xl font-bold text-accent">{user.credits}</p>
                  </div>
                </div>
              </GlassCard>
              <NeonButton variant="primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </NeonButton>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2 glass rounded-full p-2 inline-flex">
            {(['overview', 'analytics', 'payments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                  selectedTab === tab
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={itemVariants}>
                <GlassCard className="hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      {analytics.savingsGrowth}%
                    </div>
                  </div>
                  <h3 className="text-sm text-muted mb-1">Total Savings</h3>
                  <p className="text-3xl font-bold">₹{analytics.totalSavings}</p>
                </GlassCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <GlassCard className="hover:border-secondary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10">
                      <Activity className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      {analytics.slotsGrowth}%
                    </div>
                  </div>
                  <h3 className="text-sm text-muted mb-1">Active Slots</h3>
                  <p className="text-3xl font-bold">{analytics.activeSlots}</p>
                </GlassCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <GlassCard className="hover:border-accent/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      {analytics.creditsGrowth}%
                    </div>
                  </div>
                  <h3 className="text-sm text-muted mb-1">Credits Earned</h3>
                  <p className="text-3xl font-bold">{analytics.creditsEarned}</p>
                </GlassCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <GlassCard className="hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-sm text-muted">Score</div>
                  </div>
                  <h3 className="text-sm text-muted mb-1">Sharing Score</h3>
                  <p className="text-3xl font-bold">{analytics.sharingScore}/100</p>
                </GlassCard>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Subscription */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <GlassCard>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Current Subscription</h2>
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-muted mb-2">Plan</p>
                      <p className="text-xl font-bold">{subscription.planName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-2">Price</p>
                      <p className="text-xl font-bold">₹{subscription.price}/{subscription.billingPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-2">Next Billing</p>
                      <p className="text-xl font-bold">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-2">Shared Accounts</p>
                      <p className="text-xl font-bold">{subscription.sharedAccounts}/{subscription.maxAccounts}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <NeonButton variant="primary" className="flex-1">
                      Upgrade Plan
                    </NeonButton>
                    <NeonButton variant="secondary" className="flex-1">
                      Manage Subscription
                    </NeonButton>
                  </div>
                </GlassCard>

                {/* Active Slots */}
                <GlassCard className="mt-6">
                  <h2 className="text-2xl font-bold mb-6">Active Slots</h2>
                  <div className="space-y-4">
                    {slots.map((slot, index) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                            <Play className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{slot.service}</p>
                            <p className="text-sm text-muted flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {slot.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary">₹{slot.savings} saved</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            slot.status === 'active' 
                              ? 'bg-secondary/20 text-secondary' 
                              : 'bg-accent/20 text-accent'
                          }`}>
                            {slot.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <NeonButton className="w-full mt-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New Slot
                  </NeonButton>
                </GlassCard>
              </motion.div>

              {/* Sidebar */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Badges */}
                <GlassCard>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Your Badges
                  </h3>
                  <div className="space-y-3">
                    {user.badges.map((badge, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/10 to-transparent"
                      >
                        <div className="p-2 rounded-lg bg-accent/20">
                          <Award className="w-4 h-4 text-accent" />
                        </div>
                        <span className="font-medium">{badge}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Quick Actions */}
                <GlassCard>
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <span>Earn Credits</span>
                    </button>
                    <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-3">
                      <Users className="w-5 h-5 text-secondary" />
                      <span>Invite Friends</span>
                    </button>
                    <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <span>Payment Methods</span>
                    </button>
                  </div>
                </GlassCard>

                {/* Progress */}
                <GlassCard>
                  <h3 className="text-xl font-bold mb-4">Monthly Goal</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Savings Target</span>
                        <span className="font-semibold">₹2,450 / ₹3,000</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-muted">Savings Over Time Chart</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 mx-auto mb-4 text-secondary" />
                    <p className="text-muted">Usage Distribution</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Payments Tab */}
        {selectedTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6">Payment History</h2>
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-secondary/20">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">{new Date(payment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{payment.amount}</p>
                      <span className="text-xs text-secondary">{payment.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </main>
  );
}
