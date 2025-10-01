'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { SlotTracker } from '@/components/dashboard/SlotTracker';
import { SlotBooking } from '@/components/slots/SlotBooking';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Member } from '@/components/dashboard/MembersList';
import {
  Play,
  Clock,
  DollarSign,
  TrendingDown,
  Users,
  RefreshCw,
  Shield,
  Activity,
  Award,
  Gift,
  BarChart3,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';

export default function EnhancedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'browse' | 'analytics' | 'manage'>('overview');

  // Mock data for DashboardCard
  const mockSubscription = {
    id: '1',
    name: 'Netflix Premium',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    plan: '4K Ultra HD • 4 Screens',
    price: 10,
    originalPrice: 649,
    savings: 98.5
  };

  const mockMembers: Member[] = [
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
    }
  ];

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
            Welcome back, <span className="text-primary">Aayush</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted"
          >
            Manage your slots, track savings, and explore new features
          </motion.p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-xs text-secondary">+98% vs full price</p>
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
                  <p className="text-xs text-accent">This month</p>
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
                  <p className="text-xs text-primary">Netflix, Prime, Disney+</p>
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
                  <RefreshCw className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Auto Rotations</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-secondary">100% success rate</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'slots', label: 'My Slots', icon: Calendar },
              { id: 'manage', label: 'Manage Pool', icon: Users },
              { id: 'browse', label: 'Browse Slots', icon: Play },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-glow'
                      : 'glass text-muted hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* New Features Highlight */}
              <GlassCard className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">🎉 New: Auto Password Rotation</h3>
                    <p className="text-muted mb-4">
                      Your OTT passwords now automatically rotate every 2 hours for maximum security. 
                      12 successful rotations this month with 100% success rate!
                    </p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4 text-secondary" />
                        <span>Every 2 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-accent" />
                        <span>AES-256-GCM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-primary" />
                        <span>Zero downtime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Pricing Breakdown */}
              <GlassCard>
                <h3 className="text-xl font-bold mb-4">💰 Your Savings Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-semibold">Netflix Premium 4K</p>
                      <p className="text-sm text-muted">30 hours watched</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹10</p>
                      <p className="text-xs text-muted line-through">₹649</p>
                      <p className="text-xs text-secondary">98.5% saved</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-semibold">Prime Video</p>
                      <p className="text-sm text-muted">15 hours watched</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹6</p>
                      <p className="text-xs text-muted line-through">₹179</p>
                      <p className="text-xs text-secondary">96.6% saved</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div>
                      <p className="font-semibold text-primary">Total This Month</p>
                      <p className="text-sm text-muted">45 hours total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">₹16</p>
                      <p className="text-xs text-muted line-through">₹828</p>
                      <p className="text-sm text-secondary font-bold">₹812 saved (98%)</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Referral Section */}
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Gift className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">🎁 Invite Friends, Earn ₹50</h3>
                    <p className="text-muted mb-4">
                      Share your referral code and earn ₹50 credit for each friend who joins. They get ₹25 too!
                    </p>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-lg bg-white/5 font-mono text-lg">
                        SPLIT2025ABC
                      </div>
                      <NeonButton>Copy Code</NeonButton>
                    </div>
                    <p className="text-sm text-muted mt-2">3 friends invited • ₹150 earned</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'slots' && <SlotTracker />}
          {activeTab === 'manage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DashboardCard
                subscription={mockSubscription}
                members={mockMembers}
              />
            </motion.div>
          )}
          {activeTab === 'browse' && <SlotBooking />}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-xl font-bold mb-4">📊 Usage Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">45h</div>
                    <div className="text-sm text-muted">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">₹0.36</div>
                    <div className="text-sm text-muted">Avg Cost/Hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">3</div>
                    <div className="text-sm text-muted">Platforms</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold mb-4">🔥 Usage Heatmap</h3>
                <p className="text-muted mb-4">Your viewing patterns over the last 7 days</p>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-muted mb-2">{day}</div>
                      <div className="space-y-1">
                        {Array.from({ length: 24 }).map((_, hour) => {
                          const usage = Math.random();
                          return (
                            <div
                              key={hour}
                              className={`h-2 rounded ${
                                usage > 0.7
                                  ? 'bg-primary'
                                  : usage > 0.4
                                  ? 'bg-secondary'
                                  : 'bg-white/10'
                              }`}
                              title={`${hour}:00 - ${usage > 0.5 ? 'Active' : 'Inactive'}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span>High usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-secondary" />
                    <span>Medium usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <span>Low usage</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      <BottomNavBar />
    </main>
  );
}
