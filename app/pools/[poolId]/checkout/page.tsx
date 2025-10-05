'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { StripeCheckout } from '@/components/checkout/StripeCheckout';
import { motion } from 'framer-motion';
import { Users, CheckCircle, ArrowLeft, Loader } from 'lucide-react';

export default function PoolCheckoutPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = use(params);
  const router = useRouter();
  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPoolDetails();
  }, [poolId]);

  const fetchPoolDetails = async () => {
    try {
      const res = await fetch(`/api/pools/${poolId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch pool details');
      }
      
      if (!data.pool) {
        throw new Error('Pool not found');
      }
      
      setPool(data.pool);
    } catch (error) {
      console.error('Error fetching pool:', error);
      setError(error instanceof Error ? error.message : 'Failed to load pool details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[60vh]">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (error || !pool) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24">
          <GlassCard className="max-w-md mx-auto text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Pool not found'}</p>
            <NeonButton onClick={() => router.push('/pools')}>
              Back to Pools
            </NeonButton>
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            Join Pool Checkout
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pool Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-6">Pool Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted mb-1">Platform</div>
                    <div className="text-2xl font-bold">{pool.platform}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted mb-1">Price per Member</div>
                    <div className="text-3xl font-bold text-primary">₹{pool.pricePerMember}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted mb-1">Members</div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted" />
                      <span>{pool.members.length} / {pool.maxMembers}</span>
                    </div>
                  </div>

                  {pool.verification.verified && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified Subscription</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-6">Payment</h2>
                
                <div className="space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex justify-between">
                      <span className="text-muted">Pool Share</span>
                      <span>₹{pool.pricePerMember}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Platform Fee</span>
                      <span>₹{(pool.pricePerMember * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{(pool.pricePerMember * 1.1).toFixed(2)}</span>
                  </div>

                  {/* Stripe Checkout */}
                  <StripeCheckout
                    subscriptionId={pool._id}
                    subscriptionName={`${pool.platform} Pool Share`}
                    price={pool.pricePerMember * 1.1}
                    email={localStorage.getItem('userEmail') || ''}
                  />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
