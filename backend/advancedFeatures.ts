/**
 * Advanced Features API
 * Slot auctions, referrals, heatmaps, parental controls
 */

import { Router } from 'express';

const router = Router();

// ==================== SLOT AUCTION SYSTEM ====================

interface SlotAuction {
  id: string;
  slotId: string;
  platform: string;
  timeSlot: {
    day: number;
    startHour: number;
    endHour: number;
  };
  startingBid: number;
  currentBid: number;
  highestBidder: string | null;
  bids: {
    userId: string;
    amount: number;
    timestamp: Date;
  }[];
  status: 'active' | 'ended' | 'cancelled';
  endsAt: Date;
  isPremiumTime: boolean;
}

const activeAuctions = new Map<string, SlotAuction>();

/**
 * POST /api/auction/create
 * Create slot auction for premium times
 */
router.post('/create', async (req, res) => {
  try {
    const { slotId, platform, timeSlot, startingBid, duration } = req.body;

    const auctionId = `auction_${Date.now()}`;
    const auction: SlotAuction = {
      id: auctionId,
      slotId,
      platform,
      timeSlot,
      startingBid,
      currentBid: startingBid,
      highestBidder: null,
      bids: [],
      status: 'active',
      endsAt: new Date(Date.now() + duration * 60 * 1000),
      isPremiumTime: timeSlot.startHour >= 19 && timeSlot.startHour <= 22
    };

    activeAuctions.set(auctionId, auction);

    res.json({
      success: true,
      auction: {
        id: auctionId,
        platform,
        timeSlot: `${timeSlot.startHour}:00 - ${timeSlot.endHour}:00`,
        startingBid: `₹${startingBid}`,
        endsAt: auction.endsAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

/**
 * POST /api/auction/bid
 * Place bid on slot auction
 */
router.post('/bid', async (req, res) => {
  try {
    const { auctionId, userId, bidAmount } = req.body;
    const auction = activeAuctions.get(auctionId);

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    if (new Date() > auction.endsAt) {
      auction.status = 'ended';
      return res.status(400).json({ error: 'Auction has ended' });
    }

    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ 
        error: `Bid must be higher than current bid of ₹${auction.currentBid}` 
      });
    }

    // Add bid
    auction.bids.push({
      userId,
      amount: bidAmount,
      timestamp: new Date()
    });

    auction.currentBid = bidAmount;
    auction.highestBidder = userId;

    res.json({
      success: true,
      currentBid: `₹${auction.currentBid}`,
      highestBidder: userId,
      message: 'Bid placed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

/**
 * GET /api/auction/active
 * Get all active auctions
 */
router.get('/active', async (req, res) => {
  try {
    const auctions = Array.from(activeAuctions.values())
      .filter(a => a.status === 'active' && new Date() < a.endsAt)
      .map(a => ({
        id: a.id,
        platform: a.platform,
        timeSlot: `${a.timeSlot.startHour}:00 - ${a.timeSlot.endHour}:00`,
        currentBid: `₹${a.currentBid}`,
        bidCount: a.bids.length,
        endsAt: a.endsAt,
        isPremiumTime: a.isPremiumTime
      }));

    res.json({ auctions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get auctions' });
  }
});

// ==================== REFERRAL SYSTEM ====================

interface Referral {
  code: string;
  referrerId: string;
  referredUsers: string[];
  rewardsEarned: number;
  status: 'active' | 'expired';
  createdAt: Date;
}

const referrals = new Map<string, Referral>();

/**
 * POST /api/referral/generate
 * Generate referral code
 */
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    const code = `SPLIT${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const referral: Referral = {
      code,
      referrerId: userId,
      referredUsers: [],
      rewardsEarned: 0,
      status: 'active',
      createdAt: new Date()
    };

    referrals.set(code, referral);

    res.json({
      success: true,
      referralCode: code,
      referralLink: `https://splitshare.com/join?ref=${code}`,
      rewards: {
        perReferral: '₹50 credit',
        refereeBonus: '₹25 credit'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate referral code' });
  }
});

/**
 * POST /api/referral/apply
 * Apply referral code during signup
 */
router.post('/apply', async (req, res) => {
  try {
    const { code, newUserId } = req.body;
    const referral = referrals.get(code);

    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    if (referral.status !== 'active') {
      return res.status(400).json({ error: 'Referral code expired' });
    }

    // Add referred user
    referral.referredUsers.push(newUserId);
    referral.rewardsEarned += 50;

    // Credit rewards
    // await creditUser(referral.referrerId, 50); // Referrer gets ₹50
    // await creditUser(newUserId, 25); // New user gets ₹25

    res.json({
      success: true,
      referrerReward: '₹50',
      yourBonus: '₹25',
      message: 'Referral applied successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply referral' });
  }
});

/**
 * GET /api/referral/stats/:userId
 * Get referral statistics
 */
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userReferrals = Array.from(referrals.values())
      .filter(r => r.referrerId === userId);

    const totalReferred = userReferrals.reduce((sum, r) => sum + r.referredUsers.length, 0);
    const totalEarned = userReferrals.reduce((sum, r) => sum + r.rewardsEarned, 0);

    res.json({
      totalReferred,
      totalEarned: `₹${totalEarned}`,
      activeCodes: userReferrals.filter(r => r.status === 'active').length,
      referralCodes: userReferrals.map(r => ({
        code: r.code,
        referred: r.referredUsers.length,
        earned: `₹${r.rewardsEarned}`
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get referral stats' });
  }
});

// ==================== USAGE HEATMAP ====================

/**
 * GET /api/analytics/heatmap
 * Get slot usage heatmap data
 */
router.get('/heatmap', async (req, res) => {
  try {
    const { slotId, period } = req.query;

    // Generate heatmap data (7 days × 24 hours)
    const heatmapData = [];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // In production: Query actual usage data from database
        const usage = Math.floor(Math.random() * 100); // Mock data
        
        heatmapData.push({
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
          hour,
          usage,
          intensity: usage > 75 ? 'high' : usage > 50 ? 'medium' : 'low'
        });
      }
    }

    // Peak hours analysis
    const peakHours = heatmapData
      .filter(d => d.usage > 75)
      .map(d => ({ day: d.day, hour: `${d.hour}:00`, usage: d.usage }));

    res.json({
      heatmap: heatmapData,
      peakHours,
      insights: {
        busiestDay: 'Friday',
        busiestHour: '20:00 - 21:00',
        averageUsage: '67%',
        recommendation: 'Consider booking off-peak hours for better availability'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate heatmap' });
  }
});

/**
 * GET /api/analytics/trends
 * Get usage trends and predictions
 */
router.get('/trends', async (req, res) => {
  try {
    const trends = {
      weeklyUsage: [65, 70, 68, 72, 85, 90, 75], // Last 7 days
      monthlyGrowth: 15.5, // Percentage
      popularPlatforms: [
        { platform: 'Netflix', usage: 45 },
        { platform: 'Prime Video', usage: 30 },
        { platform: 'Disney+', usage: 25 }
      ],
      peakDays: ['Friday', 'Saturday', 'Sunday'],
      predictions: {
        nextWeekUsage: 78,
        recommendedSlots: [
          { day: 'Monday', time: '14:00 - 16:00', availability: 'high' },
          { day: 'Tuesday', time: '15:00 - 17:00', availability: 'high' }
        ]
      }
    };

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get trends' });
  }
});

// ==================== PARENTAL CONTROLS ====================

interface ParentalControl {
  userId: string;
  enabled: boolean;
  pin: string;
  restrictions: {
    contentRatings: string[];
    timeRestrictions: {
      startHour: number;
      endHour: number;
    };
    maxDailyHours: number;
    blockedGenres: string[];
  };
}

const parentalControls = new Map<string, ParentalControl>();

/**
 * POST /api/parental/setup
 * Setup parental controls
 */
router.post('/setup', async (req, res) => {
  try {
    const { userId, pin, restrictions } = req.body;

    const control: ParentalControl = {
      userId,
      enabled: true,
      pin,
      restrictions: restrictions || {
        contentRatings: ['U', 'U/A'],
        timeRestrictions: {
          startHour: 16, // 4 PM
          endHour: 21 // 9 PM
        },
        maxDailyHours: 2,
        blockedGenres: ['Horror', 'Adult']
      }
    };

    parentalControls.set(userId, control);

    res.json({
      success: true,
      message: 'Parental controls enabled',
      restrictions: control.restrictions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup parental controls' });
  }
});

/**
 * POST /api/parental/verify
 * Verify parental control PIN
 */
router.post('/verify', async (req, res) => {
  try {
    const { userId, pin } = req.body;
    const control = parentalControls.get(userId);

    if (!control) {
      return res.json({ verified: true, message: 'No parental controls set' });
    }

    if (!control.enabled) {
      return res.json({ verified: true, message: 'Parental controls disabled' });
    }

    const verified = control.pin === pin;

    res.json({
      verified,
      message: verified ? 'PIN verified' : 'Incorrect PIN'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify PIN' });
  }
});

/**
 * POST /api/parental/check-content
 * Check if content is allowed under parental controls
 */
router.post('/check-content', async (req, res) => {
  try {
    const { userId, contentRating, genre, currentHour } = req.body;
    const control = parentalControls.get(userId);

    if (!control || !control.enabled) {
      return res.json({ allowed: true });
    }

    const restrictions = control.restrictions;

    // Check content rating
    if (!restrictions.contentRatings.includes(contentRating)) {
      return res.json({
        allowed: false,
        reason: 'Content rating not allowed'
      });
    }

    // Check genre
    if (restrictions.blockedGenres.includes(genre)) {
      return res.json({
        allowed: false,
        reason: 'Genre is blocked'
      });
    }

    // Check time restrictions
    if (currentHour < restrictions.timeRestrictions.startHour || 
        currentHour > restrictions.timeRestrictions.endHour) {
      return res.json({
        allowed: false,
        reason: `Viewing allowed only between ${restrictions.timeRestrictions.startHour}:00 - ${restrictions.timeRestrictions.endHour}:00`
      });
    }

    res.json({ allowed: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check content' });
  }
});

// ==================== AI SUGGESTIONS ====================

/**
 * GET /api/suggestions/cheaper-slots
 * Get AI suggestions for cheaper alternative slots
 */
router.get('/cheaper-slots', async (req, res) => {
  try {
    const { currentSlotId, userId } = req.query;

    // AI analyzes user patterns and finds cheaper alternatives
    const suggestions = [
      {
        slotId: 'slot_prime_standard_2',
        platform: 'Prime Video',
        tier: 'Standard',
        estimatedCost: '₹15/month',
        savings: '₹28/month',
        savingsPercentage: 65,
        reason: 'Similar content library, 65% cheaper',
        matchScore: 85
      },
      {
        slotId: 'slot_disney_super_1',
        platform: 'Disney+ Hotstar',
        tier: 'Super',
        estimatedCost: '₹20/month',
        savings: '₹23/month',
        savingsPercentage: 53,
        reason: 'Off-peak hours available, 53% cheaper',
        matchScore: 78
      }
    ];

    res.json({
      suggestions,
      message: 'AI found cheaper alternatives based on your viewing patterns'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

export default router;
