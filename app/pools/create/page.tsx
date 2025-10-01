'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { motion } from 'framer-motion';
import { Upload, DollarSign, Users, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const ottPlatforms = ['Netflix', 'Hotstar', 'YouTube', 'Spotify', 'Zee5', 'Prime Video', 'Disney+', 'SonyLIV', 'JioCinema'];

const basePrices: Record<string, number> = {
  'Netflix': 0.5,
  'Hotstar': 0.3,
  'YouTube': 0.2,
  'Spotify': 0.2,
  'Zee5': 0.2,
  'Prime Video': 0.3,
  'Disney+': 0.3,
  'SonyLIV': 0.2,
  'JioCinema': 0.1
};

export default function CreatePoolPage() {
  return (
    <ProtectedRoute>
      <CreatePoolContent />
    </ProtectedRoute>
  );
}

function CreatePoolContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    platform: '',
    pricePerMember: '',
    maxMembers: 4,
    proofUploadUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const minPrice = basePrices[formData.platform] || 0.2;
    if (parseFloat(formData.pricePerMember) < minPrice) {
      setError(`Price must be at least ₹${minPrice} for ${formData.platform}`);
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('userId') || 'user_' + Date.now();
      localStorage.setItem('userId', userId);

      const res = await fetch('/api/pools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: formData.platform,
          hostUserId: userId,
          pricePerMember: parseFloat(formData.pricePerMember),
          maxMembers: formData.maxMembers,
          proofUploadUrl: formData.proofUploadUrl || undefined
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/pools');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create pool');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <GlassCard className="text-center py-12">
              <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-6" />
              <h2 className="text-3xl font-bold mb-4">Pool Created!</h2>
              <p className="text-muted mb-8">
                Your pool has been created successfully. Redirecting...
              </p>
              <Loader className="w-6 h-6 mx-auto animate-spin text-primary" />
            </GlassCard>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Create a <span className="text-primary">Pool</span>
          </h1>
          <p className="text-muted text-lg">
            Host a pool and share your OTT subscription with others
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  OTT Platform *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select Platform</option>
                  {ottPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Per Member */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Price Per Member (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={formData.platform ? basePrices[formData.platform] : 0.1}
                  value={formData.pricePerMember}
                  onChange={(e) => setFormData({ ...formData, pricePerMember: e.target.value })}
                  placeholder="Enter price"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  required
                />
                {formData.platform && (
                  <p className="text-xs text-muted mt-2">
                    Minimum: ₹{basePrices[formData.platform]} for {formData.platform}
                  </p>
                )}
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maximum Members
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Proof Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Subscription Proof (Optional)
                </label>
                <input
                  type="url"
                  value={formData.proofUploadUrl}
                  onChange={(e) => setFormData({ ...formData, proofUploadUrl: e.target.value })}
                  placeholder="https://example.com/receipt.jpg"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                />
                <p className="text-xs text-muted mt-2">
                  Upload receipt or proof of subscription purchase (image URL)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-500">{error}</span>
                </motion.div>
              )}

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>1. Create your pool with pricing</li>
                  <li>2. Upload subscription proof (optional)</li>
                  <li>3. Members join your pool</li>
                  <li>4. Verify subscription to activate</li>
                  <li>5. Share credentials with members</li>
                </ul>
              </div>

              {/* Submit Button */}
              <NeonButton
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin inline" />
                    Creating Pool...
                  </>
                ) : (
                  'Create Pool'
                )}
              </NeonButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
