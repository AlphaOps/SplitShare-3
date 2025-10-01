'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Play,
  Clock,
  Users,
  DollarSign,
  TrendingDown,
  Zap,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Slot {
  id: string;
  platform: string;
  tier: string;
  maxConcurrentUsers: number;
  currentUsers: number;
  availableSpots: number;
  pricePerMonth: number;
  estimatedCostPerHour: number;
  estimatedMonthlyCost: number;
  features: {
    quality: string;
    downloads: boolean;
    ads: boolean;
  };
}

export function SlotBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch('/api/slots/available');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSlots(data || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSlot = async (slot: Slot) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  const confirmJoin = async () => {
    if (!selectedSlot) return;

    try {
      const response = await fetch('/api/slots/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          acceptTerms: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAllocation(data.allocation);
        setTimeout(() => {
          setShowConfirmation(false);
          setAllocation(null);
          fetchAvailableSlots();
        }, 3000);
      } else {
        alert(data.error || 'Failed to join slot');
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Failed to join slot:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Unable to connect to server. Please check your internet connection.');
      } else {
        alert('Failed to join slot. Please try again.');
      }
      setShowConfirmation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">
          Available <span className="text-primary">Slots</span>
        </h2>
        <p className="text-muted">Join a shared slot and save up to 98% on subscriptions</p>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="h-full hover:border-primary/50 transition-all">
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{slot.platform}</h3>
                  <p className="text-sm text-muted">{slot.tier}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Play className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>{slot.features.quality} Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>{slot.availableSpots} spots available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>₹{slot.estimatedCostPerHour}/hour</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 p-4 rounded-lg bg-white/5">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    ₹{slot.estimatedMonthlyCost}
                  </span>
                  <span className="text-muted">/month</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <TrendingDown className="w-4 h-4" />
                  <span>
                    Save ₹{slot.pricePerMonth - slot.estimatedMonthlyCost} 
                    ({Math.round(((slot.pricePerMonth - slot.estimatedMonthlyCost) / slot.pricePerMonth) * 100)}%)
                  </span>
                </div>
              </div>

              {/* CTA */}
              <NeonButton
                onClick={() => handleJoinSlot(slot)}
                className="w-full"
                disabled={slot.availableSpots === 0}
              >
                {slot.availableSpots === 0 ? 'Slot Full' : 'Join Slot'}
              </NeonButton>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedSlot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmation(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md"
              >
                <GlassCard>
                  {allocation ? (
                    // Success State
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4">Slot Joined!</h3>
                      <div className="space-y-2 text-left bg-white/5 p-4 rounded-lg">
                        <p><strong>Day:</strong> {allocation.dayName}</p>
                        <p><strong>Time:</strong> {allocation.timeRange}</p>
                        <p className="text-sm text-muted mt-4">
                          AI has allocated this time slot based on your viewing patterns
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Confirmation State
                    <>
                      <h3 className="text-2xl font-bold mb-4">Confirm Slot Booking</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted">Platform:</span>
                          <span className="font-semibold">{selectedSlot.platform} {selectedSlot.tier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Estimated Cost:</span>
                          <span className="font-semibold text-primary">₹{selectedSlot.estimatedMonthlyCost}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Savings:</span>
                          <span className="font-semibold text-secondary">
                            ₹{selectedSlot.pricePerMonth - selectedSlot.estimatedMonthlyCost}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 mb-6">
                        <p className="text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          AI will allocate your optimal time slot based on your viewing patterns
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                        <NeonButton
                          onClick={confirmJoin}
                          className="flex-1"
                        >
                          Confirm
                        </NeonButton>
                      </div>
                    </>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
