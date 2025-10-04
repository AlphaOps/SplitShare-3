'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const ottPlatforms = ['Netflix', 'Hotstar', 'YouTube', 'Spotify', 'Zee5', 'Prime Video', 'Disney+', 'SonyLIV', 'JioCinema'];

export default function PoolsPage() {
  return (
    <ProtectedRoute>
      <PoolsContent />
    </ProtectedRoute>
  );
}

function PoolsContent() {
  const searchParams = useSearchParams();
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || '');

  useEffect(() => {
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform]);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const url = selectedPlatform 
        ? `/api/pools?platform=${selectedPlatform}`
        : '/api/pools';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPools(data.pools || []);
    } catch (error) {
      console.error('Failed to fetch pools:', error);
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  const joinPool = (poolId: string) => {
    // Redirect to checkout page for payment
    window.location.href = `/pools/${poolId}/checkout`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-secondary border-secondary/30 bg-secondary/10';
      case 'filled': return 'text-accent border-accent/30 bg-accent/10';
      case 'awaiting_verification': return 'text-muted border-white/20 bg-white/5';
      case 'active': return 'text-primary border-primary/30 bg-primary/10';
      default: return 'text-muted border-white/10 bg-white/5';
    }
  };

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Browse <span className="text-primary">Pools</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg"
          >
            Join existing pools or create your own
          </motion.p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-muted" />
            <span className="font-semibold">Filter by Platform:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPlatform('')}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedPlatform === ''
                  ? 'bg-primary text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              All
            </button>
            {ottPlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedPlatform === platform
                    ? 'bg-primary text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Create Pool CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Want to host a pool?</h3>
                <p className="text-muted">Create your own pool and invite members</p>
              </div>
              <NeonButton href="/pools/create">Create Pool</NeonButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Pools Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Loading pools...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted mb-4" />
            <p className="text-muted">No pools found. Be the first to create one!</p>
            <NeonButton href="/pools/create" className="mt-4">Create Pool</NeonButton>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool, index) => (
              <motion.div
                key={pool._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="h-full">
                  {/* Platform */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{pool.platform}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pool.status)}`}>
                      {pool.status}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary">₹{pool.pricePerMember}</div>
                    <div className="text-sm text-muted">per member</div>
                  </div>

                  {/* Members */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-muted" />
                    <span className="text-sm">
                      {pool.members.length} / {pool.maxMembers} members
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(pool.members.length / pool.maxMembers) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Verification Status */}
                  {pool.verification.verified && (
                    <div className="flex items-center gap-2 text-sm text-secondary mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified Subscription</span>
                    </div>
                  )}

                  {/* Action Button */}
                  {(pool.status === 'open' || pool.status === 'draft') && pool.members.length < pool.maxMembers && (
                    <NeonButton 
                      onClick={() => joinPool(pool._id)}
                      className="w-full"
                    >
                      Join Pool
                    </NeonButton>
                  )}
                  {pool.status === 'filled' && (
                    <div className="text-center text-muted text-sm">Pool is full</div>
                  )}
                  {pool.status === 'awaiting_verification' && (
                    <div className="text-center text-muted text-sm">Awaiting verification</div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
