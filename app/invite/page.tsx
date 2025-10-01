'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Gift,
  Mail,
  Copy,
  CheckCircle,
  Users,
  TrendingUp,
  Share2,
  MessageCircle,
  Send
} from 'lucide-react';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [referralCode, setReferralCode] = useState('SPLIT2025ABC');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferred: 3,
    totalEarned: 150,
    pendingInvites: 2
  });

  const handleSendInvite = async () => {
    if (!email) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          user_id: 'user_123',
          friend_email: email
        })
      });

      const data = await response.json();
      
      if (data.status === 'sent' || data.success) {
        setInviteSent(true);
        setEmail('');
        setTimeout(() => setInviteSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Join SplitShare and save 98% on OTT subscriptions! Use my code ${referralCode} to get ₹25 bonus. https://splitshare.com/join?ref=${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Join SplitShare - Get ₹25 Bonus!';
    const body = `Hey!\n\nI'm using SplitShare to save 98% on Netflix, Prime Video, and more!\n\nUse my referral code ${referralCode} when you sign up to get ₹25 bonus credit.\n\nJoin here: https://splitshare.com/join?ref=${referralCode}\n\nYou'll love it!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Invite <span className="text-primary">Friends</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg"
          >
            Share the savings! Earn ₹50 for each friend who joins
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Friends Referred</p>
                    <p className="text-2xl font-bold">{stats.totalReferred}</p>
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
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Total Earned</p>
                    <p className="text-2xl font-bold">₹{stats.totalEarned}</p>
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
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Pending Invites</p>
                    <p className="text-2xl font-bold">{stats.pendingInvites}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Referral Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Your Referral Code</h3>
                  <p className="text-muted mb-4">
                    Share this code with friends. They get ₹25, you get ₹50!
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10 font-mono text-2xl text-center">
                      {referralCode}
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="px-6 py-4 rounded-lg glass hover:bg-white/10 transition-all"
                    >
                      {copied ? (
                        <CheckCircle className="w-6 h-6 text-secondary" />
                      ) : (
                        <Copy className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Send Invite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Send Invite via Email</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <NeonButton
                  onClick={handleSendInvite}
                  disabled={!email || loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Sending...' : 'Send Invite'}
                </NeonButton>
              </div>
              
              {inviteSent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Invite sent successfully!</span>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Share Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Share via Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center justify-center gap-3 p-4 rounded-lg glass hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-secondary" />
                  <span>Share on WhatsApp</span>
                </button>
                
                <button
                  onClick={shareViaEmail}
                  className="flex items-center justify-center gap-3 p-4 rounded-lg glass hover:bg-white/10 transition-all"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Share via Email</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">How Referrals Work</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Share your code</p>
                    <p className="text-sm text-muted">
                      Send your unique referral code to friends via email, WhatsApp, or social media
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Friend signs up</p>
                    <p className="text-sm text-muted">
                      When they create an account using your code, they get ₹25 bonus credit
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">You earn rewards</p>
                    <p className="text-sm text-muted">
                      You get ₹50 credit added to your account instantly. No limits on referrals!
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
