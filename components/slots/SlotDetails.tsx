'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Play,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  RefreshCw,
  Shield,
  Activity
} from 'lucide-react';

interface SlotDetailsProps {
  slot: {
    id: string;
    platform: string;
    tier: string;
    start_time: string;
    end_time: string;
    status: 'active' | 'upcoming' | 'expired';
    credentials?: {
      username: string;
      password: string;
    };
  };
  onStartSlot?: (slotId: string) => void;
  onEndSlot?: (slotId: string) => void;
}

export function SlotDetails({ slot, onStartSlot, onEndSlot }: SlotDetailsProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<'username' | 'password' | null>(null);

  useEffect(() => {
    if (slot.status === 'active') {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(slot.end_time);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Expired');
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [slot.status, slot.end_time]);

  const copyToClipboard = (text: string, type: 'username' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = () => {
    switch (slot.status) {
      case 'active':
        return 'text-secondary border-secondary/30 bg-secondary/10';
      case 'upcoming':
        return 'text-accent border-accent/30 bg-accent/10';
      case 'expired':
        return 'text-muted border-white/10 bg-white/5';
      default:
        return 'text-muted border-white/10 bg-white/5';
    }
  };

  const getStatusIcon = () => {
    switch (slot.status) {
      case 'active':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <GlassCard className="hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">{slot.platform}</h3>
          <p className="text-sm text-muted">{slot.tier}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()} flex items-center gap-2`}>
          {getStatusIcon()}
          {slot.status}
        </span>
      </div>

      {/* Time Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted">Start Time</p>
            <p className="font-semibold">
              {new Date(slot.start_time).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-secondary" />
          <div>
            <p className="text-sm text-muted">End Time</p>
            <p className="font-semibold">
              {new Date(slot.end_time).toLocaleString()}
            </p>
          </div>
        </div>

        {slot.status === 'active' && timeRemaining && (
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-accent animate-pulse" />
            <div>
              <p className="text-sm text-muted">Time Remaining</p>
              <p className="font-semibold text-accent text-lg">{timeRemaining}</p>
            </div>
          </div>
        )}
      </div>

      {/* Credentials (Only for Active Slots) */}
      {slot.status === 'active' && slot.credentials && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Your Credentials</h4>
              <RefreshCw className="w-4 h-4 text-secondary ml-auto" />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="text-xs text-muted block mb-1">Username</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={slot.credentials.username}
                  readOnly
                  className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(slot.credentials!.username, 'username')}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  {copied === 'username' ? (
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-muted block mb-1">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={slot.credentials.password}
                  readOnly
                  className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm font-mono"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(slot.credentials!.password, 'password')}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  {copied === 'password' ? (
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted mt-3 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Password will auto-rotate when slot ends
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {slot.status === 'upcoming' && onStartSlot && (
          <NeonButton onClick={() => onStartSlot(slot.id)} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Start Slot
          </NeonButton>
        )}

        {slot.status === 'active' && onEndSlot && (
          <NeonButton
            onClick={() => onEndSlot(slot.id)}
            variant="secondary"
            className="flex-1"
          >
            End Slot
          </NeonButton>
        )}

        {slot.status === 'expired' && (
          <div className="flex-1 text-center py-2 text-muted text-sm">
            Slot has ended
          </div>
        )}
      </div>

      {/* Security Note */}
      {slot.status === 'active' && (
        <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-xs text-muted flex items-center gap-2">
            <Shield className="w-3 h-3 text-accent" />
            These credentials are temporary and will be rotated automatically for security
          </p>
        </div>
      )}
    </GlassCard>
  );
}
