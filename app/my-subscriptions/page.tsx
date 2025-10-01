'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { SubscriptionTabs, SubscriptionTab } from '@/components/subscriptions/SubscriptionTabs';
import { SubscriptionFilters } from '@/components/subscriptions/SubscriptionFilters';
import { SubscriptionCard, Subscription } from '@/components/subscriptions/SubscriptionCard';
import { MessageSquare, Plus } from 'lucide-react';

export default function MySubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<SubscriptionTab>('hosted');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data
  const subscriptions: Subscription[] = [
    {
      id: '1',
      serviceName: 'Netflix Premium Plan',
      serviceLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      planName: 'Plan - A',
      planType: 'standard',
      status: 'active',
      validityDays: 30,
      currentMembers: 1,
      totalMembers: 2,
      price: 10,
      role: 'host',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2',
      serviceName: 'Amazon Prime Video',
      serviceLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
      planName: 'Premium',
      planType: 'premium',
      status: 'active',
      validityDays: 25,
      currentMembers: 2,
      totalMembers: 2,
      price: 6,
      role: 'host',
      startDate: '2024-01-05',
      endDate: '2024-02-05'
    },
    {
      id: '3',
      serviceName: 'Disney+ Hotstar',
      serviceLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
      planName: 'Super',
      planType: 'standard',
      status: 'pending',
      validityDays: 15,
      currentMembers: 1,
      totalMembers: 4,
      price: 8,
      role: 'member',
      startDate: '2024-01-10',
      endDate: '2024-02-10'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'basic', label: 'Basic' }
  ];

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Filter by tab
    if (activeTab === 'hosted' && sub.role !== 'host') return false;
    if (activeTab === 'purchased' && sub.role !== 'member') return false;
    if (activeTab === 'request' && sub.status !== 'pending') return false;

    // Filter by status
    if (selectedStatus !== 'all' && sub.status !== selectedStatus) return false;

    // Filter by type
    if (selectedType !== 'all' && sub.planType !== selectedType) return false;

    return true;
  });

  const counts = {
    purchased: subscriptions.filter(s => s.role === 'member' && s.status !== 'pending').length,
    hosted: subscriptions.filter(s => s.role === 'host').length,
    request: subscriptions.filter(s => s.status === 'pending').length
  };

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
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
              Manage all your active and hosted subscriptions
            </motion.p>
          </div>

          {/* Support Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/50 transition-all"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
          </motion.button>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <SubscriptionTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <SubscriptionFilters
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            selectedStatus={selectedStatus}
            selectedType={selectedType}
            onStatusChange={setSelectedStatus}
            onTypeChange={setSelectedType}
          />
        </motion.div>

        {/* Subscriptions Grid */}
        {filteredSubscriptions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSubscriptions.map((subscription, index) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                index={index}
                onClick={() => window.location.href = `/subscription/${subscription.id}`}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No Subscriptions Found</h3>
              <p className="text-muted mb-6">
                {activeTab === 'hosted' && "You haven't hosted any pools yet"}
                {activeTab === 'purchased' && "You haven't joined any pools yet"}
                {activeTab === 'request' && "No pending requests"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/book-slot'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Browse Pools</span>
              </motion.button>
            </GlassCard>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <GlassCard>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {subscriptions.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-muted">Active Subscriptions</div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                ₹{subscriptions.reduce((sum, s) => sum + s.price, 0)}
              </div>
              <div className="text-sm text-muted">Monthly Spending</div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {subscriptions.filter(s => s.role === 'host').length}
              </div>
              <div className="text-sm text-muted">Pools Hosted</div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <BottomNavBar />
    </main>
  );
}
