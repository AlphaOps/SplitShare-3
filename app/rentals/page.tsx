'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function RentalsPage() {
  return (
    <ProtectedRoute>
      <RentalsContent />
    </ProtectedRoute>
  );
}

function RentalsContent() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  useEffect(() => {
    fetchRentals();
  }, [selectedPlatform]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const url = selectedPlatform 
        ? `/api/rentals?platform=${selectedPlatform}`
        : '/api/rentals';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRentals(data.rentals || []);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const bookRental = async (rentalId: string) => {
    try {
      const userId = localStorage.getItem('userId') || 'user_' + Date.now();
      const res = await fetch(`/api/rentals/${rentalId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        alert(`Rental booked! Access until ${new Date(data.booking.endAt).toLocaleString()}`);
        fetchRentals();
      } else {
        alert(data.error || 'Failed to book rental');
      }
    } catch (error) {
      console.error('Book rental error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Unable to connect to server. Please check your internet connection.');
      } else {
        alert('Failed to book rental. Please try again.');
      }
    }
  };

  const platforms = ['Netflix', 'Hotstar', 'YouTube', 'Spotify', 'Zee5', 'Prime Video', 'Disney+', 'SonyLIV', 'JioCinema'];

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Rental <span className="text-secondary">Plans</span>
          </h1>
          <p className="text-muted text-lg">
            Flexible short-term access to OTT platforms
          </p>
        </motion.div>

        {/* Platform Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPlatform('')}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedPlatform === '' ? 'bg-secondary text-white' : 'glass hover:bg-white/10'
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedPlatform === platform ? 'bg-secondary text-white' : 'glass hover:bg-white/10'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Rentals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Loading rentals...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted mb-4" />
            <p className="text-muted">No rentals available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental, index) => (
              <motion.div
                key={rental._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="h-full border-2 border-secondary/30">
                  <h3 className="text-2xl font-bold mb-4">{rental.platform}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="text-lg font-semibold">{rental.days} Days</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-secondary">₹{rental.price}</div>
                    <div className="text-sm text-muted">₹{(rental.price / rental.days).toFixed(2)} per day</div>
                  </div>

                  <div className="space-y-2 text-sm text-muted mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Instant booking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Flexible access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span>Auto-expiry</span>
                    </div>
                  </div>

                  {rental.status === 'active' && (
                    <NeonButton 
                      onClick={() => bookRental(rental._id)}
                      variant="secondary"
                      className="w-full"
                    >
                      Book Now
                    </NeonButton>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/30">
            <h3 className="text-2xl font-bold mb-4">How Rentals Work</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">1️⃣</div>
                <h4 className="font-bold mb-2">Choose Duration</h4>
                <p className="text-sm text-muted">Select from 1 to 30 days based on your needs</p>
              </div>
              <div>
                <div className="text-4xl mb-2">2️⃣</div>
                <h4 className="font-bold mb-2">Instant Booking</h4>
                <p className="text-sm text-muted">Get immediate access after booking</p>
              </div>
              <div>
                <div className="text-4xl mb-2">3️⃣</div>
                <h4 className="font-bold mb-2">Auto Expiry</h4>
                <p className="text-sm text-muted">Access automatically expires after duration</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
