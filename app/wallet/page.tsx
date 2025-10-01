'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { IndianPayment } from '@/components/payment/IndianPayment';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  CreditCard
} from 'lucide-react';
import clsx from 'clsx';

export default function WalletPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState(500);

  const balance = 1250;
  const transactions = [
    {
      id: '1',
      type: 'credit',
      amount: 500,
      description: 'Added to wallet',
      date: 'Today, 2:30 PM',
      status: 'completed'
    },
    {
      id: '2',
      type: 'debit',
      amount: 10,
      description: 'Netflix Premium - Morning Slot',
      date: 'Today, 10:00 AM',
      status: 'completed'
    },
    {
      id: '3',
      type: 'credit',
      amount: 50,
      description: 'Referral bonus from Rahul',
      date: 'Yesterday, 6:45 PM',
      status: 'completed'
    },
    {
      id: '4',
      type: 'debit',
      amount: 6,
      description: 'Prime Video - Evening Slot',
      date: 'Yesterday, 3:20 PM',
      status: 'completed'
    },
    {
      id: '5',
      type: 'credit',
      amount: 25,
      description: 'Cashback on subscription',
      date: '2 days ago',
      status: 'completed'
    }
  ];

  const quickAmounts = [100, 500, 1000, 2000];

  if (showAddMoney) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24">
          <IndianPayment
            amount={addAmount}
            subscriptionName="Add Money to Wallet"
            onSuccess={() => {
              setShowAddMoney(false);
              alert(`₹${addAmount} added to your wallet!`);
            }}
            onCancel={() => setShowAddMoney(false)}
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
            My <span className="text-primary">Wallet</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted"
          >
            Manage your balance and transactions
          </motion.p>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 opacity-50" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-muted" />
                <span className="text-sm text-muted">Available Balance</span>
              </div>
              
              <div className="text-5xl font-bold mb-6">
                ₹{balance.toLocaleString('en-IN')}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddMoney(true)}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
                    'font-semibold text-white',
                    'bg-primary hover:bg-primary/90',
                    'shadow-glow transition-all'
                  )}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Money</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
                    'font-semibold',
                    'backdrop-blur-md bg-white/5 hover:bg-white/10',
                    'border border-white/20',
                    'transition-all'
                  )}
                >
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Send</span>
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Add Amounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold mb-4">Quick Add</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((amount, index) => (
              <motion.button
                key={amount}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAddAmount(amount);
                  setShowAddMoney(true);
                }}
                className={clsx(
                  'p-4 rounded-xl font-semibold',
                  'backdrop-blur-md bg-white/5 hover:bg-white/10',
                  'border border-white/10 hover:border-primary/50',
                  'transition-all'
                )}
              >
                ₹{amount}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/20">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Total Added</p>
                  <p className="text-2xl font-bold text-secondary">₹3,500</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Total Spent</p>
                  <p className="text-2xl font-bold text-primary">₹2,250</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/20">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Rewards Earned</p>
                  <p className="text-2xl font-bold text-accent">₹125</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard>
            <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className={clsx(
                    'flex items-center justify-between p-4 rounded-xl',
                    'backdrop-blur-md bg-white/5 border border-white/10',
                    'hover:bg-white/10 transition-all'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      'p-2 rounded-lg',
                      transaction.type === 'credit' ? 'bg-secondary/20' : 'bg-primary/20'
                    )}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className={clsx('w-5 h-5 text-secondary')} />
                      ) : (
                        <ArrowUpRight className={clsx('w-5 h-5 text-primary')} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{transaction.description}</p>
                      <p className="text-sm text-muted">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={clsx(
                    'text-right',
                    transaction.type === 'credit' ? 'text-secondary' : 'text-primary'
                  )}>
                    <p className="text-lg font-bold">
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-muted capitalize">{transaction.status}</p>
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
