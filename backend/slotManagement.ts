/**
 * Slot Management API Endpoints
 * Handles OTT slot creation, joining, allocation, and access control
 */

import { Router } from 'express';
import { timeAllocationEngine } from '../lib/ai/timeAllocationEngine';
import { credentialVault, proxyAuthenticator } from '../lib/security/credentialVault';
import { pricingCalculator } from '../lib/pricing/dynamicPricingCalculator';

const router = Router();

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify JWT token
  // In production: jwt.verify(token, process.env.JWT_SECRET)
  req.user = { userId: 'user123' }; // Placeholder
  next();
}

/**
 * GET /api/slots/available
 * Get all available OTT slots
 */
router.get('/available', async (req, res) => {
  try {
    // Fetch available slots from database
    const slots = [
      {
        id: 'slot_netflix_premium_1',
        platform: 'Netflix',
        tier: 'Premium',
        maxConcurrentUsers: 4,
        currentUsers: 2,
        availableSpots: 2,
        pricePerMonth: 649,
        currency: 'INR',
        features: {
          quality: '4K',
          downloads: true,
          ads: false
        },
        estimatedCostPerHour: 0.72,
        estimatedMonthlyCost: 43
      },
      {
        id: 'slot_prime_standard_1',
        platform: 'Prime Video',
        tier: 'Standard',
        maxConcurrentUsers: 3,
        currentUsers: 1,
        availableSpots: 2,
        pricePerMonth: 179,
        currency: 'INR',
        features: {
          quality: '4K',
          downloads: true,
          ads: false
        },
        estimatedCostPerHour: 0.41,
        estimatedMonthlyCost: 25
      },
      {
        id: 'slot_disney_premium_1',
        platform: 'Disney+ Hotstar',
        tier: 'Premium',
        maxConcurrentUsers: 4,
        currentUsers: 3,
        availableSpots: 1,
        pricePerMonth: 499,
        currency: 'INR',
        features: {
          quality: '4K',
          downloads: true,
          ads: false
        },
        estimatedCostPerHour: 0.58,
        estimatedMonthlyCost: 35
      }
    ];

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

/**
 * POST /api/slots/join
 * User joins an OTT slot
 */
router.post('/join', authenticateToken, async (req: any, res) => {
  try {
    const { slotId, acceptTerms } = req.body;
    const userId = req.user.userId;

    if (!slotId || !acceptTerms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch slot details
    // const slot = await db.slots.findById(slotId);
    
    // Check if slot is full
    // if (slot.currentUsers.length >= slot.maxConcurrentUsers) {
    //   return res.status(400).json({ error: 'Slot is full' });
    // }

    // Fetch user's viewing history for AI analysis
    const historicalData = [
      { timestamp: '2025-09-29T20:00:00Z', duration: 120, genre: 'Action' },
      { timestamp: '2025-09-28T21:00:00Z', duration: 90, genre: 'Thriller' },
      { timestamp: '2025-09-27T19:30:00Z', duration: 150, genre: 'Sci-Fi' }
    ];

    // AI analyzes user pattern
    const userPattern = timeAllocationEngine.analyzeUserPattern(userId, historicalData);

    // Get all users in the slot
    // const allUsers = await db.users.find({ slotId });
    const allUserPatterns = [userPattern]; // In production, include all slot users

    // AI allocates optimal time slot
    const mockSlot = {
      id: slotId,
      platform: 'netflix',
      tier: 'premium',
      maxConcurrentUsers: 4,
      currentUsers: ['user1', 'user2'],
      credentials: {
        email: 'shared@example.com',
        passwordHash: 'hashed',
        encryptedPassword: 'encrypted'
      },
      pricePerMonth: 649,
      currency: 'INR' as const,
      allocatedSlots: []
    };

    const allocations = timeAllocationEngine.allocateTimeSlots(mockSlot, allUserPatterns);
    const userAllocation = allocations.find(a => a.userId === userId);

    if (!userAllocation) {
      return res.status(400).json({ error: 'Could not allocate time slot' });
    }

    // Save allocation to database
    // await db.allocations.insert({
    //   userId,
    //   slotId,
    //   ...userAllocation,
    //   status: 'active',
    //   createdAt: new Date()
    // });

    // Add user to slot
    // await db.slots.update(slotId, {
    //   $push: { currentUsers: userId }
    // });

    res.json({
      success: true,
      message: 'Successfully joined slot',
      allocation: {
        dayOfWeek: userAllocation.dayOfWeek,
        startHour: userAllocation.startHour,
        endHour: userAllocation.endHour,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][userAllocation.dayOfWeek],
        timeRange: `${userAllocation.startHour}:00 - ${userAllocation.endHour}:00`
      }
    });
  } catch (error) {
    console.error('Join slot error:', error);
    res.status(500).json({ error: 'Failed to join slot' });
  }
});

/**
 * GET /api/slots/my-slots
 * Get user's joined slots and allocations
 */
router.get('/my-slots', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user's slots from database
    const mySlots = [
      {
        id: 'slot_netflix_premium_1',
        platform: 'Netflix',
        tier: 'Premium',
        allocation: {
          dayOfWeek: 5,
          dayName: 'Friday',
          startHour: 20,
          endHour: 22,
          timeRange: '20:00 - 22:00'
        },
        status: 'active',
        nextSession: '2025-10-04T20:00:00Z',
        estimatedMonthlyCost: 43,
        usageThisMonth: {
          hours: 12,
          cost: 17.28
        }
      }
    ];

    res.json(mySlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

/**
 * POST /api/slots/request-access
 * Request temporary access to OTT platform
 */
router.post('/request-access', authenticateToken, async (req: any, res) => {
  try {
    const { slotId, deviceInfo } = req.body;
    const userId = req.user.userId;

    if (!slotId || !deviceInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Request access through proxy authenticator
    const access = await proxyAuthenticator.requestAccess(
      userId,
      slotId,
      deviceInfo
    );

    if (!access.success) {
      return res.status(403).json({ error: access.error });
    }

    // Start usage tracking
    const startTime = new Date();
    // await db.usageRecords.insert({
    //   userId,
    //   slotId,
    //   startTime,
    //   sessionToken: access.proxySession,
    //   status: 'active'
    // });

    res.json({
      success: true,
      proxySession: access.proxySession,
      expiresAt: access.expiresAt,
      message: 'Access granted. Session will expire in 2 hours.',
      instructions: 'Use this session token to stream content. Do not share this token.'
    });
  } catch (error) {
    console.error('Access request error:', error);
    res.status(500).json({ error: 'Failed to request access' });
  }
});

/**
 * POST /api/slots/end-session
 * End streaming session and calculate cost
 */
router.post('/end-session', authenticateToken, async (req: any, res) => {
  try {
    const { sessionToken } = req.body;
    const userId = req.user.userId;

    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token required' });
    }

    // Fetch session details
    // const session = await db.usageRecords.findOne({ sessionToken, userId });
    
    const endTime = new Date();
    const startTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago (mock)
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    // Calculate cost
    const cost = pricingCalculator.calculateSessionCost(
      'Netflix',
      'Premium',
      durationMinutes,
      '4K',
      endTime.getHours()
    );

    // Update usage record
    // await db.usageRecords.update(
    //   { sessionToken },
    //   {
    //     endTime,
    //     durationMinutes,
    //     cost,
    //     status: 'completed'
    //   }
    // );

    // Revoke access
    await proxyAuthenticator.revokeAccess(sessionToken);

    res.json({
      success: true,
      session: {
        duration: `${Math.floor(durationMinutes / 60)}h ${Math.floor(durationMinutes % 60)}m`,
        cost: `₹${cost.toFixed(2)}`,
        startTime,
        endTime
      }
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

/**
 * GET /api/slots/usage-history
 * Get user's viewing history and costs
 */
router.get('/usage-history', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    // Fetch usage records
    const usageRecords = [
      {
        id: 'usage_1',
        slotId: 'slot_netflix_premium_1',
        platform: 'Netflix',
        startTime: '2025-09-29T20:00:00Z',
        endTime: '2025-09-29T22:00:00Z',
        durationMinutes: 120,
        quality: '4K',
        cost: 1.44
      },
      {
        id: 'usage_2',
        slotId: 'slot_netflix_premium_1',
        platform: 'Netflix',
        startTime: '2025-09-22T20:00:00Z',
        endTime: '2025-09-22T21:30:00Z',
        durationMinutes: 90,
        quality: '4K',
        cost: 1.08
      }
    ];

    // Calculate totals
    const summary = pricingCalculator.calculateUserCost(usageRecords);

    // Calculate savings
    const savings = pricingCalculator.calculateSavings('Netflix', 'Premium', summary.totalMinutes / 60);

    res.json({
      usageRecords,
      summary: {
        ...summary,
        savings: {
          fullPrice: savings.fullPrice,
          actualCost: savings.payPerUseCost,
          saved: savings.savings,
          savingsPercentage: savings.savingsPercentage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage history' });
  }
});

/**
 * GET /api/slots/recommendations
 * Get AI-powered slot recommendations
 */
router.get('/recommendations', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user's viewing history
    const historicalData = [
      { timestamp: '2025-09-29T20:00:00Z', duration: 120, genre: 'Action' },
      { timestamp: '2025-09-28T21:00:00Z', duration: 90, genre: 'Thriller' }
    ];

    // Analyze pattern
    const pattern = timeAllocationEngine.analyzeUserPattern(userId, historicalData);

    // Get available slots
    const availableSlots = [
      {
        id: 'slot_netflix_premium_1',
        platform: 'netflix',
        tier: 'premium',
        maxConcurrentUsers: 4,
        currentUsers: ['user1', 'user2'],
        credentials: { email: '', passwordHash: '', encryptedPassword: '' },
        pricePerMonth: 649,
        currency: 'INR' as const,
        allocatedSlots: []
      }
    ];

    // Generate recommendations
    const recommendations = timeAllocationEngine.generateRecommendations(
      userId,
      pattern,
      availableSlots
    );

    res.json({
      recommendations: recommendations.map(rec => ({
        slotId: rec.slotId,
        estimatedCost: `₹${rec.estimatedCostPerMonth}/month`,
        conflictProbability: `${(rec.conflictProbability * 100).toFixed(0)}%`,
        recommendedTimes: rec.recommendedTimes.map(t => ({
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][t.day],
          time: `${t.startHour}:00 - ${t.endHour}:00`,
          confidence: `${(t.confidence * 100).toFixed(0)}%`
        }))
      })),
      userPattern: {
        preferredTimes: pattern.preferredTimes.map(h => `${h}:00`),
        averageSessionDuration: `${pattern.averageSessionDuration} minutes`,
        preferredDays: pattern.weekdayPreference.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

/**
 * POST /api/slots/invite
 * Invite friend to join slot
 */
router.post('/invite', authenticateToken, async (req: any, res) => {
  try {
    const { slotId, friendEmail } = req.body;
    const userId = req.user.userId;

    if (!slotId || !friendEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if slot has available spots
    // const slot = await db.slots.findById(slotId);
    // if (slot.currentUsers.length >= slot.maxConcurrentUsers) {
    //   return res.status(400).json({ error: 'Slot is full' });
    // }

    // Create invitation
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // await db.invitations.insert({
    //   code: inviteCode,
    //   slotId,
    //   invitedBy: userId,
    //   invitedEmail: friendEmail,
    //   status: 'pending',
    //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    //   createdAt: new Date()
    // });

    // Send invitation email
    // await sendInvitationEmail(friendEmail, inviteCode, slot);

    res.json({
      success: true,
      inviteCode,
      message: `Invitation sent to ${friendEmail}`,
      inviteLink: `https://splitshare.com/invite/${inviteCode}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

/**
 * GET /api/slots/pricing-comparison
 * Compare pricing across platforms
 */
router.get('/pricing-comparison', async (req, res) => {
  try {
    const { platforms } = req.query;
    const platformList = platforms ? (platforms as string).split(',') : ['Netflix', 'Prime Video', 'Disney+ Hotstar'];

    const comparison = pricingCalculator.comparePricing(platformList);

    res.json({
      comparison,
      note: 'Prices shown are per-hour costs when shared among maximum concurrent users'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare pricing' });
  }
});

export default router;
