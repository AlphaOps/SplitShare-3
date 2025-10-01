'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProfileNav } from '@/components/profile/ProfileNav';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  LogOut,
  Camera,
  Shield,
  Award
} from 'lucide-react';
import clsx from 'clsx';

export default function ProfilePage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Add actual logout logic here
    window.location.href = '/login';
  };

  // Mock user data
  const user = {
    name: 'Aayush Rahul Yadav',
    email: 'aayush@splitshare.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    avatar: null,
    memberSince: 'Jan 2024',
    totalSavings: 2450,
    activeSubscriptions: 3,
    verified: true
  };

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            My <span className="text-primary">Profile</span>
          </h1>
          <p className="text-muted">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <GlassCard className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className={clsx(
                  'w-32 h-32 rounded-full mx-auto',
                  'bg-gradient-to-br from-primary/20 to-secondary/20',
                  'border-4 border-primary/30',
                  'flex items-center justify-center',
                  'shadow-glow'
                )}>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted" />
                  )}
                </div>
                
                {/* Verified Badge */}
                {user.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-glowGreen"
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Edit Button */}
                <button className="absolute top-0 right-0 p-2 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-glow">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-sm text-muted mb-4">Member since {user.memberSince}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-primary">₹{user.totalSavings}</div>
                  <div className="text-xs text-muted">Total Savings</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-secondary">{user.activeSubscriptions}</div>
                  <div className="text-xs text-muted">Active Subs</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Phone className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <MapPin className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm">{user.location}</span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
                  'font-semibold transition-all duration-300',
                  'backdrop-blur-md bg-white/5 hover:bg-white/10',
                  'border border-white/20 hover:border-primary/50'
                )}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </GlassCard>
          </motion.div>

          {/* Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard>
              <h3 className="text-xl font-bold mb-6">Account Settings</h3>
              <ProfileNav />

              {/* Logout Button - Sticky at bottom */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
                  whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
                    'font-bold text-white transition-all duration-300',
                    'bg-red-600 hover:bg-red-700',
                    'shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]',
                    'border border-red-500/30',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isLoggingOut ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </>
                  )}
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Early Adopter', icon: '🚀', unlocked: true },
                { label: 'Super Saver', icon: '💰', unlocked: true },
                { label: 'Pool Master', icon: '🏊', unlocked: false },
                { label: 'Referral King', icon: '👑', unlocked: false },
              ].map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={clsx(
                    'p-4 rounded-xl text-center',
                    'backdrop-blur-md border',
                    achievement.unlocked
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-white/5 border-white/10 opacity-50'
                  )}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-semibold">{achievement.label}</div>
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
