'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { motion } from 'framer-motion';
import { Zap, Clock, Shield, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export default function InstantPage() {
  return (
    <ProtectedRoute>
      <InstantContent />
    </ProtectedRoute>
  );
}

function InstantContent() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instant');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const bookPlan = async (planId: string) => {
    try {
      const userId = localStorage.getItem('userId') || 'user_' + Date.now();
      const res = await fetch(`/api/instant/${planId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        alert(data.error || 'Failed to book plan');
      }
    } catch (error) {
      console.error('Book plan error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Unable to connect to server. Please check your internet connection.');
      } else {
        alert('Failed to book plan. Please try again.');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (bookingResult) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="text-center py-12 border-2 border-accent">
              <CheckCircle className="w-20 h-20 mx-auto text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-4">Instant Access Granted!</h2>
              <p className="text-muted mb-8">
                Your credentials for {bookingResult.plan.platform}
              </p>

              <div className="space-y-4 text-left bg-white/5 p-6 rounded-lg mb-8">
                <div>
                  <label className="text-xs text-muted block mb-1">Username</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bookingResult.credential.username}
                      readOnly
                      className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(bookingResult.credential.username)}
                      className="p-2 rounded hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">Password</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bookingResult.credential.password}
                      readOnly
                      className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(bookingResult.credential.password)}
                      className="p-2 rounded hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-muted">
                    Valid until: {new Date(bookingResult.credential.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <NeonButton href="/dashboard">Go to Dashboard</NeonButton>
                <NeonButton onClick={() => setBookingResult(null)} variant="secondary">
                  Book Another
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-4">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Instant Gold Plans</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Get <span className="text-accent">Instant</span> Access
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Premium monthly subscriptions with immediate credential delivery
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted mb-4" />
            <p className="text-muted">No instant plans available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full border-2 border-accent/30 hover:border-accent/50 transition-all">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                      {plan.platform === 'Netflix' ? '🎬' : 
                       plan.platform === 'Prime Video' ? '📺' : 
                       plan.platform === 'Disney+' ? '✨' : '🎥'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.platform}</h3>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-accent mb-2">₹{plan.priceMonthly}</div>
                    <div className="text-sm text-muted">per month</div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted mb-6">
                    <Clock className="w-4 h-4" />
                    <span>{plan.stock} slots available</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>⚡ Instant access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>🔐 Secure credentials</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>📅 30-day validity</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>💯 Premium quality</span>
                    </div>
                  </div>

                  <NeonButton 
                    onClick={() => bookPlan(plan._id)}
                    className="w-full bg-accent"
                    disabled={plan.stock <= 0}
                  >
                    {plan.stock > 0 ? 'Get Instant Access' : 'Out of Stock'}
                  </NeonButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <GlassCard className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Instant Gold?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto text-accent mb-4" />
                <h4 className="font-bold mb-2">Instant Delivery</h4>
                <p className="text-sm text-muted">Get credentials immediately after payment</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto text-accent mb-4" />
                <h4 className="font-bold mb-2">Secure & Private</h4>
                <p className="text-sm text-muted">Your own private account credentials</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto text-accent mb-4" />
                <h4 className="font-bold mb-2">30-Day Access</h4>
                <p className="text-sm text-muted">Full month of premium streaming</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
