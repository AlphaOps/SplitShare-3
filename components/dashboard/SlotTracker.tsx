'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Play,
  Clock,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Pause,
  BarChart3
} from 'lucide-react';

interface MySlot {
  id: string;
  platform: string;
  tier: string;
  allocation: {
    dayOfWeek: number;
    dayName: string;
    startHour: number;
    endHour: number;
    timeRange: string;
  };
  status: 'active' | 'upcoming' | 'expired';
  nextSession: string;
  estimatedMonthlyCost: number;
  usageThisMonth: {
    hours: number;
    cost: number;
  };
}

export function SlotTracker() {
  const [mySlots, setMySlots] = useState<MySlot[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySlots();
    const interval = setInterval(fetchMySlots, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        const remaining = Math.floor(
          (new Date(activeSession.expiresAt).getTime() - Date.now()) / 1000 / 60
        );
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          setActiveSession(null);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const fetchMySlots = async () => {
    try {
      const response = await fetch('/api/slots/my-slots', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMySlots(data || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setMySlots([]);
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async (slotId: string) => {
    try {
      const response = await fetch('/api/slots/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          slotId,
          deviceInfo: {
            deviceId: 'device_' + Math.random().toString(36).substr(2, 9),
            deviceType: 'web',
            ipAddress: '103.x.x.x'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setActiveSession(data);
        // Initialize streaming
        initializeStreaming(data.proxySession);
      } else {
        alert(data.error || 'Failed to request access');
      }
    } catch (error) {
      console.error('Failed to request access:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Unable to connect to server. Please check your internet connection.');
      } else {
        alert('Failed to request access. Please try again.');
      }
    }
  };

  const initializeStreaming = async (proxyToken: string) => {
    try {
      const response = await fetch('/api/streaming/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proxyToken,
          quality: 'HD'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Streaming initialized:', data);
    } catch (error) {
      console.error('Failed to initialize streaming:', error);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      const response = await fetch('/api/slots/end-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          sessionToken: activeSession.proxySession
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session ended:', data);
      setActiveSession(null);
      fetchMySlots();
    } catch (error) {
      console.error('Failed to end session:', error);
      // Still clear the session locally even if the API call fails
      setActiveSession(null);
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
      {/* Active Session Banner */}
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20 animate-pulse">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Streaming Active</h3>
                  <p className="text-sm text-muted">
                    Time remaining: {Math.floor(timeRemaining / 60)}h {timeRemaining % 60}m
                  </p>
                </div>
              </div>
              <NeonButton onClick={endSession} variant="secondary">
                <Pause className="w-4 h-4 mr-2" />
                End Session
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* My Slots */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Slots</h2>
        
        {mySlots.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-muted mb-4">You haven't joined any slots yet</p>
            <NeonButton>Browse Available Slots</NeonButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mySlots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="hover:border-primary/50 transition-all">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{slot.platform}</h3>
                      <p className="text-sm text-muted">{slot.tier}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slot.status === 'active' 
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {slot.status}
                    </span>
                  </div>

                  {/* Allocation Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted">Allocated Time</p>
                        <p className="font-semibold">{slot.allocation.dayName}, {slot.allocation.timeRange}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-muted">Next Session</p>
                        <p className="font-semibold">
                          {new Date(slot.nextSession).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-muted">Estimated Monthly Cost</p>
                        <p className="font-semibold text-primary">₹{slot.estimatedMonthlyCost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage This Month */}
                  <div className="p-4 rounded-lg bg-white/5 mb-4">
                    <p className="text-sm text-muted mb-2">Usage This Month</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{slot.usageThisMonth.hours}h</p>
                        <p className="text-xs text-muted">Total Hours</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{slot.usageThisMonth.cost}</p>
                        <p className="text-xs text-muted">Total Cost</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <NeonButton
                    onClick={() => requestAccess(slot.id)}
                    className="w-full"
                    disabled={!!activeSession}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {activeSession ? 'Session Active' : 'Start Streaming'}
                  </NeonButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Savings</p>
              <p className="text-2xl font-bold">₹2,450</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/20">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">Hours Watched</p>
              <p className="text-2xl font-bold">45h</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/20">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted">Active Slots</p>
              <p className="text-2xl font-bold">{mySlots.length}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
