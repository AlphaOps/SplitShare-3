/**
 * Streaming Proxy Server
 * Handles secure streaming without exposing credentials
 */

import { Router } from 'express';
import { proxyAuthenticator } from '../lib/security/credentialVault';
import { pricingCalculator } from '../lib/pricing/dynamicPricingCalculator';

const router = Router();

interface StreamingSession {
  sessionId: string;
  userId: string;
  slotId: string;
  platform: string;
  proxyToken: string;
  startTime: Date;
  expiresAt: Date;
  quality: 'SD' | 'HD' | '4K';
  deviceInfo: any;
  streamUrl?: string;
  isActive: boolean;
}

// In-memory session store (use Redis in production)
const activeSessions = new Map<string, StreamingSession>();

/**
 * POST /api/streaming/initialize
 * Initialize streaming session with temporary token
 */
router.post('/initialize', async (req, res) => {
  try {
    const { proxyToken, quality } = req.body;

    if (!proxyToken) {
      return res.status(400).json({ error: 'Proxy token required' });
    }

    // Verify proxy token
    const access = await proxyAuthenticator.verifyAccess(proxyToken);
    if (!access) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if session already exists
    const existingSession = Array.from(activeSessions.values()).find(
      s => s.userId === access.userId && s.slotId === access.credentialId
    );

    if (existingSession) {
      return res.json({
        success: true,
        sessionId: existingSession.sessionId,
        streamUrl: existingSession.streamUrl,
        expiresAt: existingSession.expiresAt,
        message: 'Existing session resumed'
      });
    }

    // Create new streaming session
    const sessionId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: StreamingSession = {
      sessionId,
      userId: access.userId,
      slotId: access.credentialId,
      platform: 'Netflix', // Get from slot details
      proxyToken,
      startTime: new Date(),
      expiresAt: access.expiresAt,
      quality: quality || 'HD',
      deviceInfo: { ipAddress: access.ipAddress, deviceId: access.deviceId },
      streamUrl: `https://proxy.splitshare.com/stream/${sessionId}`,
      isActive: true
    };

    activeSessions.set(sessionId, session);

    // In production: Initialize actual OTT platform connection
    // const ottCredentials = await getDecryptedCredentials(access.credentialId);
    // const streamConnection = await ottPlatform.connect(ottCredentials);

    res.json({
      success: true,
      sessionId,
      streamUrl: session.streamUrl,
      expiresAt: session.expiresAt,
      quality: session.quality,
      message: 'Streaming session initialized'
    });
  } catch (error) {
    console.error('Initialize streaming error:', error);
    res.status(500).json({ error: 'Failed to initialize streaming' });
  }
});

/**
 * GET /api/streaming/session/:sessionId
 * Get streaming session details
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      session.isActive = false;
      activeSessions.delete(sessionId);
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      sessionId: session.sessionId,
      platform: session.platform,
      quality: session.quality,
      startTime: session.startTime,
      expiresAt: session.expiresAt,
      timeRemaining: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000 / 60), // minutes
      isActive: session.isActive
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session details' });
  }
});

/**
 * POST /api/streaming/heartbeat
 * Keep session alive and track viewing
 */
router.post('/heartbeat', async (req, res) => {
  try {
    const { sessionId, currentTime, bufferHealth } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      session.isActive = false;
      activeSessions.delete(sessionId);
      return res.status(401).json({ error: 'Session expired', action: 'terminate' });
    }

    // Update session activity
    // In production: Log to database for analytics
    // await db.sessionActivity.insert({
    //   sessionId,
    //   timestamp: new Date(),
    //   currentTime,
    //   bufferHealth
    // });

    res.json({
      success: true,
      timeRemaining: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000 / 60),
      action: 'continue'
    });
  } catch (error) {
    res.status(500).json({ error: 'Heartbeat failed' });
  }
});

/**
 * POST /api/streaming/terminate
 * Terminate streaming session and calculate cost
 */
router.post('/terminate', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const endTime = new Date();
    const durationMinutes = (endTime.getTime() - session.startTime.getTime()) / (1000 * 60);

    // Calculate cost
    const cost = pricingCalculator.calculateSessionCost(
      session.platform,
      'Premium',
      durationMinutes,
      session.quality,
      endTime.getHours()
    );

    // Save usage record
    const usageRecord = {
      userId: session.userId,
      slotId: session.slotId,
      platform: session.platform,
      startTime: session.startTime,
      endTime,
      durationMinutes,
      quality: session.quality,
      cost
    };

    // In production: Save to database
    // await db.usageRecords.insert(usageRecord);

    // Remove session
    activeSessions.delete(sessionId);

    // Revoke proxy token
    await proxyAuthenticator.revokeAccess(session.proxyToken);

    res.json({
      success: true,
      usage: {
        duration: `${Math.floor(durationMinutes / 60)}h ${Math.floor(durationMinutes % 60)}m`,
        cost: `₹${cost.toFixed(2)}`,
        quality: session.quality
      },
      message: 'Session terminated successfully'
    });
  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

/**
 * GET /api/streaming/active-sessions
 * Get all active streaming sessions (admin)
 */
router.get('/active-sessions', async (req, res) => {
  try {
    const sessions = Array.from(activeSessions.values()).map(s => ({
      sessionId: s.sessionId,
      userId: s.userId,
      platform: s.platform,
      quality: s.quality,
      startTime: s.startTime,
      expiresAt: s.expiresAt,
      isActive: s.isActive
    }));

    res.json({
      totalSessions: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get active sessions' });
  }
});

/**
 * POST /api/streaming/quality-change
 * Change streaming quality mid-session
 */
router.post('/quality-change', async (req, res) => {
  try {
    const { sessionId, newQuality } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const oldQuality = session.quality;
    session.quality = newQuality;

    res.json({
      success: true,
      oldQuality,
      newQuality,
      message: 'Quality changed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change quality' });
  }
});

/**
 * Cleanup expired sessions (run as cron job)
 */
export async function cleanupExpiredSessions() {
  const now = new Date();
  let cleanedCount = 0;

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      // Calculate final cost
      const durationMinutes = (now.getTime() - session.startTime.getTime()) / (1000 * 60);
      const cost = pricingCalculator.calculateSessionCost(
        session.platform,
        'Premium',
        durationMinutes,
        session.quality,
        now.getHours()
      );

      // Save usage record
      // await db.usageRecords.insert({ ... });

      // Revoke token
      await proxyAuthenticator.revokeAccess(session.proxyToken);

      // Remove session
      activeSessions.delete(sessionId);
      cleanedCount++;
    }
  }

  console.log(`Cleaned up ${cleanedCount} expired sessions`);
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

export default router;
