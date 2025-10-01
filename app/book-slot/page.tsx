'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Play,
  Clock,
  DollarSign,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar
} from 'lucide-react';

interface Platform {
  name: string;
  tiers: {
    tier: string;
    monthly_cost: number;
    price_per_hour: number;
    max_users: number;
    quality: string;
  }[];
}

export default function SlotBookingPage() {
  return (
    <ProtectedRoute>
      <SlotBookingContent />
    </ProtectedRoute>
  );
}

function SlotBookingContent() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [duration, setDuration] = useState(2);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch('/api/pricing');
      const data = await response.json();
      setPlatforms(data.platforms || []);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    }
  };

  const calculateCost = () => {
    if (!selectedPlatform || !selectedTier) return 0;
    
    const platform = platforms.find(p => p.name === selectedPlatform);
    const tier = platform?.tiers.find(t => t.tier === selectedTier);
    
    if (!tier) return 0;
    
    return tier.price_per_hour * duration;
  };

  const calculateSavings = () => {
    if (!selectedPlatform || !selectedTier) return 0;
    
    const platform = platforms.find(p => p.name === selectedPlatform);
    const tier = platform?.tiers.find(t => t.tier === selectedTier);
    
    if (!tier) return 0;
    
    const fullPrice = tier.monthly_cost;
    const ourPrice = calculateCost();
    
    return fullPrice - ourPrice;
  };

  const handleBookSlot = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/slots/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          user_id: 'user_123',
          platform: selectedPlatform,
          tier: selectedTier,
          duration: duration * 60 // Convert to minutes
        })
      });

      const data = await response.json();
      
      if (data.slot_id || data.success) {
        setBookingSuccess(true);
        setBookingDetails(data);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const cost = calculateCost();
  const savings = calculateSavings();
  const savingsPercentage = selectedTier ? Math.round((savings / (cost + savings)) * 100) : 0;

  if (bookingSuccess) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        
        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-6" />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">Slot Booked Successfully!</h2>
              <p className="text-muted mb-8">AI is allocating your optimal time slot...</p>
              
              <div className="space-y-4 text-left bg-white/5 p-6 rounded-lg mb-8">
                <div className="flex justify-between">
                  <span className="text-muted">Platform:</span>
                  <span className="font-semibold">{selectedPlatform} {selectedTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Duration:</span>
                  <span className="font-semibold">{duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Cost:</span>
                  <span className="font-semibold text-primary">₹{cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Savings:</span>
                  <span className="font-semibold text-secondary">₹{savings.toFixed(2)} ({savingsPercentage}%)</span>
                </div>
                {bookingDetails?.allocation && (
                  <>
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <p className="text-sm text-muted mb-2">Your Allocated Time:</p>
                      <p className="font-semibold">{bookingDetails.allocation.dayName}</p>
                      <p className="text-sm">{bookingDetails.allocation.timeRange}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-4 justify-center">
                <NeonButton onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </NeonButton>
                <NeonButton 
                  variant="secondary"
                  onClick={() => {
                    setBookingSuccess(false);
                    setBookingDetails(null);
                  }}
                >
                  Book Another Slot
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    );
  }

  const ottPlatforms = [
    { 
      id: 'netflix', 
      name: 'Netflix', 
      color: '#E50914',
      icon: '🎬',
      description: 'Premium 4K streaming'
    },
    { 
      id: 'prime', 
      name: 'Prime Video', 
      color: '#00A8E1',
      icon: '📺',
      description: 'Amazon Prime Video'
    },
    { 
      id: 'disney', 
      name: 'Disney+ Hotstar', 
      color: '#0063E5',
      icon: '✨',
      description: 'Disney+ & Hotstar'
    },
    { 
      id: 'zee5', 
      name: 'ZEE5', 
      color: '#9B26AF',
      icon: '🎭',
      description: 'Indian content hub'
    },
    { 
      id: 'sonyliv', 
      name: 'SonyLIV', 
      color: '#FF6B00',
      icon: '📱',
      description: 'Sony entertainment'
    },
    { 
      id: 'jiocinema', 
      name: 'JioCinema', 
      color: '#0033A0',
      icon: '🎥',
      description: 'Free streaming'
    }
  ];

  const scrollToPlatform = (platformId: string) => {
    const element = document.getElementById(`platform-${platformId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            Book Your <span className="text-primary">Slot</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg"
          >
            Choose your platform, duration, and let AI find the perfect time for you
          </motion.p>
        </div>

        {/* OTT Platform Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Select Your Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ottPlatforms.map((platform, index) => (
              <motion.button
                key={platform.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedPlatform(platform.name);
                  scrollToPlatform(platform.id);
                }}
                className={`group relative p-6 rounded-2xl glass border-2 transition-all ${
                  selectedPlatform === platform.name
                    ? 'border-primary shadow-glow'
                    : 'border-white/10 hover:border-white/30'
                }`}
                aria-label={`Select ${platform.name}`}
              >
                {/* Platform Icon/Logo */}
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {platform.icon}
                </div>
                
                {/* Platform Name */}
                <h3 className="font-bold text-sm mb-1">{platform.name}</h3>
                <p className="text-xs text-muted">{platform.description}</p>
                
                {/* Selected Indicator */}
                {selectedPlatform === platform.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                
                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: platform.color }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard>
              <h3 className="text-2xl font-bold mb-6">Slot Details</h3>
              
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <Play className="w-4 h-4 inline mr-2" />
                  OTT Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => {
                    setSelectedPlatform(e.target.value);
                    setSelectedTier('');
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier Selection */}
              {selectedPlatform && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Quality Tier
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  >
                    <option value="">Select Tier</option>
                    {platforms
                      .find(p => p.name === selectedPlatform)
                      ?.tiers.map((tier) => (
                        <option key={tier.tier} value={tier.tier}>
                          {tier.tier} - {tier.quality} (₹{tier.price_per_hour}/hour)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Duration Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duration: {duration} hours
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted mt-2">
                  <span>1h</span>
                  <span>2h</span>
                  <span>4h</span>
                  <span>6h</span>
                  <span>8h</span>
                </div>
              </div>

              {/* Book Button */}
              <NeonButton
                onClick={handleBookSlot}
                disabled={!selectedPlatform || !selectedTier || loading}
                className="w-full"
              >
                {loading ? 'Booking...' : 'Book Slot'}
              </NeonButton>
            </GlassCard>
          </motion.div>

          {/* Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h3 className="text-2xl font-bold mb-6">Pricing Summary</h3>
              
              {selectedPlatform && selectedTier ? (
                <div className="space-y-6">
                  {/* Cost Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Base Cost</span>
                      <span className="text-xl font-bold">₹{cost.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-secondary">
                      <span>You Save</span>
                      <span className="text-xl font-bold">₹{savings.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted">Full Price</span>
                        <span className="line-through text-muted">
                          ₹{(cost + savings).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Highlight */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="w-5 h-5 text-secondary" />
                      <span className="font-semibold">Massive Savings!</span>
                    </div>
                    <p className="text-3xl font-bold text-secondary">
                      {savingsPercentage}% OFF
                    </p>
                    <p className="text-sm text-muted mt-1">
                      vs. full monthly subscription
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>AI-optimized time slot</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Auto password rotation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Zero-knowledge security</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Pay only for hours used</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted mb-4" />
                  <p className="text-muted">
                    Select a platform and tier to see pricing
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Platform-Specific Sections */}
        <div className="mt-16 space-y-12">
          {ottPlatforms.map((platform) => (
            <motion.div
              key={platform.id}
              id={`platform-${platform.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <GlassCard className="border-2" style={{ borderColor: `${platform.color}20` }}>
                {/* Platform Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="text-6xl">{platform.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2">{platform.name}</h3>
                    <p className="text-muted">{platform.description}</p>
                  </div>
                  <div 
                    className="w-16 h-16 rounded-full opacity-20"
                    style={{ backgroundColor: platform.color }}
                  />
                </div>

                {/* Available Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Basic', 'Standard', 'Premium'].map((tier) => (
                    <div
                      key={tier}
                      className="p-4 rounded-lg glass border border-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedPlatform(platform.name);
                        setSelectedTier(tier);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">{tier}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          Available
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span>{tier === 'Premium' ? '4K' : tier === 'Standard' ? 'HD' : 'SD'} Quality</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span>{tier === 'Premium' ? '4' : tier === 'Standard' ? '2' : '1'} Screens</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span>Auto Password Rotation</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{tier === 'Premium' ? '0.72' : tier === 'Standard' ? '0.45' : '0.30'}
                          </span>
                          <span className="text-muted text-sm">/hour</span>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Save up to 98% vs full price
                        </p>
                      </div>

                      <NeonButton 
                        className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlatform(platform.name);
                          setSelectedTier(tier);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Select {tier}
                      </NeonButton>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-secondary">15+</div>
                    <div className="text-xs text-muted">Active Slots</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted">Avg Savings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">2h</div>
                    <div className="text-xs text-muted">Auto Rotation</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
