'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { IndianPayment } from '@/components/payment/IndianPayment';
import { Member } from '@/components/dashboard/MembersList';
import {
  Play,
  Clock,
  TrendingDown,
  Users,
  Plus,
  CreditCard
} from 'lucide-react';

export default function EnhancedDashboardPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // Mock data
  const subscriptions = [
    {
      id: '1',
      name: 'Netflix Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      plan: '4K Ultra HD • 4 Screens',
      price: 10,
      originalPrice: 649,
      savings: 98.5
    },
    {
      id: '2',
      name: 'Amazon Prime',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
      plan: 'Premium • 2 Screens',
      price: 6,
      originalPrice: 179,
      savings: 96.6
    },
    {
      id: '3',
      name: 'Disney+ Hotstar',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
      plan: 'Super • 2 Screens',
      price: 8,
      originalPrice: 299,
      savings: 97.3
    }
  ];

  const members: Member[] = [
    {
      id: '1',
      name: 'Aayush Yadav',
      email: 'aayush@splitshare.com',
      role: 'host',
      joinedAt: 'Jan 15, 2024',
      status: 'active'
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      role: 'member',
      joinedAt: 'Jan 20, 2024',
      status: 'active'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'member',
      joinedAt: 'Jan 22, 2024',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Amit Singh',
      email: 'amit@example.com',
      role: 'member',
      joinedAt: 'Jan 25, 2024',
      status: 'active'
    }
  ];

  const handleSubscribe = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    alert('Payment successful! Your subscription is now active.');
  };

  if (showPayment && selectedSubscription) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24">
          <IndianPayment
            amount={selectedSubscription.price}
            subscriptionName={selectedSubscription.name}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24 pb-32">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-2"
          >
            My <span className="text-primary">Subscriptions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted"
          >
            Manage your active subscriptions and time slots
          </motion.p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Total Savings</p>
                  <p className="text-2xl font-bold">₹2,450</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/20">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Hours Watched</p>
                  <p className="text-2xl font-bold">45h</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/20">
                  <Play className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Active Slots</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Pool Members</p>
                  <p className="text-2xl font-bold">{members.length}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Active Subscriptions */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Subscriptions</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/book-slot'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Add New</span>
            </motion.button>
          </div>

          {subscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <DashboardCard
                subscription={subscription}
                members={members}
              />
            </motion.div>
          ))}
        </div>

        {/* Available Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard>
            <h3 className="text-xl font-bold mb-6">Available Subscriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Spotify Premium', price: 5, icon: '🎵' },
                { name: 'YouTube Premium', price: 7, icon: '📺' },
                { name: 'Apple TV+', price: 6, icon: '🍎' }
              ].map((sub, index) => (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => handleSubscribe({ ...sub, originalPrice: sub.price * 100, savings: 95 })}
                >
                  <div className="text-4xl mb-3">{sub.icon}</div>
                  <h4 className="font-semibold mb-1">{sub.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">₹{sub.price}/mo</span>
                    <CreditCard className="w-4 h-4 text-muted" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <BottomNavBar />
    </main>
  );
}
