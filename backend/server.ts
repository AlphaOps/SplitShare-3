import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoClient, Db } from 'mongodb';
import { optimizeSlots, type AvailabilityRequest, type TimeSlot, type UserHistory } from '../lib/ai/slotOptimizer';
import { detectInactivity, type SessionEvent, monitorUserActivity } from '../lib/ai/inactivityDetector';
import { suggestCheapestBundle, getPersonalizedRecommendations, type ViewHabit, type Subscription } from '../lib/ai/bundleSuggester';
import slotManagementRouter from './slotManagement';
import streamingProxyRouter from './streamingProxy';
import advancedFeaturesRouter from './advancedFeatures';
import passwordRotationRouter from './passwordRotationAPI';
import otpAuthRouter from './otpAuth';
import poolsRouter from './poolsAPI';
import rentalsRouter from './rentalsAPI';
import instantRouter from './instantAPI';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://splitsharee.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

// Mount all routers
app.use('/api/slots', slotManagementRouter);
app.use('/api/slots', passwordRotationRouter); // Password rotation endpoints
app.use('/api/streaming', streamingProxyRouter);
app.use('/api/credentials', passwordRotationRouter); // Credential management
app.use('/api/automation', passwordRotationRouter); // Automation scripts
app.use('/api/rotation', passwordRotationRouter); // Rotation status
app.use('/api/auth', otpAuthRouter); // OTP authentication
app.use('/api/pools', poolsRouter); // Standard Account Pools
app.use('/api/rentals', rentalsRouter); // Rental Plans
app.use('/api/instant', instantRouter); // Instant Gold Plans
app.use('/api', advancedFeaturesRouter); // Auction, referral, analytics, parental, suggestions

// Database connection
let db: Db;
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/splitshare');
    await client.connect();
    db = client.db('splitshare');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware for authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Collections
const getCollection = (name: string) => db.collection(name);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const users = getCollection('users');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
      name,
      credits: 100,
      badges: [],
      createdAt: new Date(),
      preferences: {
        genres: [],
        budget: 50,
        adTolerance: 'medium'
      }
    };

    const result = await users.insertOne(user);
    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ token, user: { id: result.insertedId, email, name, credits: user.credits } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = getCollection('users');
    const user = await users.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email, name: user.name, credits: user.credits } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// User management
app.get('/api/users/profile', authenticateToken, async (req: any, res) => {
  try {
    const users = getCollection('users');
    const user = await users.findOne({ _id: req.user.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      badges: user.badges,
      preferences: user.preferences,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req: any, res) => {
  try {
    const { name, preferences } = req.body;
    const users = getCollection('users');
    
    await users.updateOne(
      { _id: req.user.userId },
      { $set: { name, preferences, updatedAt: new Date() } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Slot management
app.get('/api/slots', authenticateToken, async (req: any, res) => {
  try {
    const slots = getCollection('slots');
    const userSlots = await slots.find({ userId: req.user.userId }).toArray();
    res.json(userSlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

app.post('/api/slots', authenticateToken, async (req: any, res) => {
  try {
    const { start, end, subscriptionId, isAdSupported } = req.body;
    
    if (!start || !end || !subscriptionId) {
      return res.status(400).json({ error: 'Start time, end time, and subscription ID are required' });
    }

    const slots = getCollection('slots');
    const slot = {
      userId: req.user.userId,
      start: new Date(start),
      end: new Date(end),
      subscriptionId,
      isAdSupported: isAdSupported || false,
      status: 'booked',
      createdAt: new Date(),
      price: calculateSlotPrice(start, end, subscriptionId)
    };

    const result = await slots.insertOne(slot);
    res.status(201).json({ id: result.insertedId, ...slot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

app.put('/api/slots/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { start, end, status } = req.body;
    
    const slots = getCollection('slots');
    const updateData: any = { updatedAt: new Date() };
    
    if (start) updateData.start = new Date(start);
    if (end) updateData.end = new Date(end);
    if (status) updateData.status = status;
    
    const result = await slots.updateOne(
      { _id: id, userId: req.user.userId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

app.delete('/api/slots/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const slots = getCollection('slots');
    
    const result = await slots.deleteOne({ _id: id, userId: req.user.userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// AI endpoints
app.post('/api/ai/optimize', authenticateToken, async (req: any, res) => {
  try {
    const { availabilities, existingSlots } = req.body;
    const userHistory = getCollection('userHistory');
    const history = await userHistory.find({ userId: req.user.userId }).toArray() as unknown as UserHistory[];
    
    const plan = optimizeSlots(availabilities || [], existingSlots || [], history);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Optimization failed' });
  }
});

app.post('/api/ai/inactivity', authenticateToken, async (req: any, res) => {
  try {
    const { events, thresholdMs } = req.body;
    const result = detectInactivity(events || [], thresholdMs);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Inactivity detection failed' });
  }
});

app.post('/api/ai/bundle', authenticateToken, async (req: any, res) => {
  try {
    const { habits, subs } = req.body;
    const userHistory = getCollection('userHistory');
    const history = await userHistory.find({ userId: req.user.userId }).toArray() as unknown as UserHistory[];
    
    const suggestion = suggestCheapestBundle(habits, subs || [], history);
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: 'Bundle suggestion failed' });
  }
});

app.get('/api/ai/recommendations', authenticateToken, async (req: any, res) => {
  try {
    const users = getCollection('users');
    const user = await users.findOne({ _id: req.user.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userHistory = getCollection('userHistory');
    const history = await userHistory.find({ userId: req.user.userId }).toArray() as unknown as UserHistory[];
    
    const subscriptions = getCollection('subscriptions');
    const subs = await subscriptions.find({}).toArray() as unknown as Subscription[];
    
    const habits: ViewHabit = {
      userId: req.user.userId,
      genres: user.preferences.genres,
      hoursPerWeek: 20,
      preferredTimes: ['evening', 'weekend'],
      deviceTypes: ['mobile', 'tv'],
      budget: user.preferences.budget,
      adTolerance: user.preferences.adTolerance
    };
    
    const recommendations = getPersonalizedRecommendations(req.user.userId, habits, subs, history);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Gamification endpoints
app.get('/api/gamification/leaderboard', async (req, res) => {
  try {
    const users = getCollection('users');
    const leaderboard = await users
      .find({})
      .sort({ credits: -1 })
      .limit(10)
      .project({ name: 1, credits: 1, badges: 1 })
      .toArray();
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/gamification/earn-credits', authenticateToken, async (req: any, res) => {
  try {
    const { amount, reason } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    const users = getCollection('users');
    const result = await users.updateOne(
      { _id: req.user.userId },
      { 
        $inc: { credits: amount },
        $push: { 
          creditHistory: {
            amount,
            reason,
            timestamp: new Date()
          }
        } as any
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, creditsEarned: amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to earn credits' });
  }
});

// Real-time monitoring
app.post('/api/monitoring/activity', authenticateToken, async (req: any, res) => {
  try {
    const { activity, subscriptionId, slotId, metadata } = req.body;
    
    const activityLog = getCollection('activityLog');
    await activityLog.insertOne({
      userId: req.user.userId,
      activity,
      subscriptionId,
      slotId,
      metadata,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// Subscription Plans endpoints
app.get('/api/plans', async (_req, res) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 5,
        yearlyPrice: 48,
        description: 'Perfect for casual viewers',
        features: [
          '1 Shared Account',
          'Basic Support',
          'Cancel Anytime',
          'Standard Quality',
          'Email Notifications'
        ],
        maxAccounts: 1,
        videoQuality: 'SD',
        supportLevel: 'basic',
        aiRecommendations: false,
        slotSwapping: false,
        analytics: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 10,
        yearlyPrice: 96,
        description: 'Best for regular streamers',
        features: [
          '3 Shared Accounts',
          'Priority Support',
          '3D Dashboard Access',
          'HD Quality',
          'Smart Recommendations',
          'Slot Swapping'
        ],
        maxAccounts: 3,
        videoQuality: 'HD',
        supportLevel: 'priority',
        aiRecommendations: true,
        slotSwapping: true,
        analytics: false,
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 20,
        yearlyPrice: 192,
        description: 'For power users & families',
        features: [
          'Unlimited Shared Accounts',
          'Dedicated Manager',
          'Advanced Analytics',
          '4K Quality',
          'AI-Powered Optimization',
          'Priority Slot Booking',
          'Custom Integrations'
        ],
        maxAccounts: -1, // unlimited
        videoQuality: '4K',
        supportLevel: 'dedicated',
        aiRecommendations: true,
        slotSwapping: true,
        analytics: true
      }
    ];
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plans = getCollection('plans');
    const plan = await plans.findOne({ id });
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// User subscription management
app.post('/api/subscriptions/subscribe', authenticateToken, async (req: any, res) => {
  try {
    const { planId, billingPeriod } = req.body;
    
    if (!planId || !billingPeriod) {
      return res.status(400).json({ error: 'Plan ID and billing period are required' });
    }

    const users = getCollection('users');
    const subscriptions = getCollection('subscriptions');
    
    // Check if user already has an active subscription
    const existingSubscription = await subscriptions.findOne({
      userId: req.user.userId,
      status: 'active'
    });
    
    if (existingSubscription) {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }

    // Create new subscription
    const subscription = {
      userId: req.user.userId,
      planId,
      billingPeriod,
      status: 'active',
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + (billingPeriod === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };

    const result = await subscriptions.insertOne(subscription);
    
    // Update user's subscription status
    await users.updateOne(
      { _id: req.user.userId },
      { $set: { subscriptionId: result.insertedId, subscriptionPlan: planId } }
    );
    
    res.status(201).json({ id: result.insertedId, ...subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

app.get('/api/subscriptions/my-subscription', authenticateToken, async (req: any, res) => {
  try {
    const subscriptions = getCollection('subscriptions');
    const subscription = await subscriptions.findOne({
      userId: req.user.userId,
      status: 'active'
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

app.post('/api/subscriptions/cancel', authenticateToken, async (req: any, res) => {
  try {
    const subscriptions = getCollection('subscriptions');
    const users = getCollection('users');
    
    const result = await subscriptions.updateOne(
      { userId: req.user.userId, status: 'active' },
      { 
        $set: { 
          status: 'cancelled',
          cancelledAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    // Update user record
    await users.updateOne(
      { _id: req.user.userId },
      { $unset: { subscriptionId: '', subscriptionPlan: '' } }
    );
    
    res.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Payment Gateway endpoints
app.post('/api/payments/create-order', authenticateToken, async (req: any, res) => {
  try {
    const { planId, billingPeriod, currency, paymentMethod } = req.body;
    
    if (!planId || !billingPeriod || !currency || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get plan details
    const plans = [
      { id: 'basic', priceINR: 399, priceUSD: 5 },
      { id: 'pro', priceINR: 799, priceUSD: 10 },
      { id: 'enterprise', priceINR: 1599, priceUSD: 20 }
    ];
    
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const basePrice = currency === 'INR' ? plan.priceINR : plan.priceUSD;
    const amount = billingPeriod === 'year' ? Math.floor(basePrice * 12 * 0.8) : basePrice;

    // Create payment order
    const order = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      planId,
      amount,
      currency,
      billingPeriod,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    };

    const orders = getCollection('orders');
    const result = await orders.insertOne(order);

    res.status(201).json({
      orderId: order.orderId,
      amount,
      currency,
      paymentMethod,
      // In production, return gateway-specific data (Stripe client_secret, PhonePe payment URL, etc.)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

app.post('/api/payments/verify', authenticateToken, async (req: any, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const orders = getCollection('orders');
    const order = await orders.findOne({ orderId, userId: req.user.userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // In production, verify payment with respective gateway
    // For Stripe: verify payment_intent
    // For PhonePe: verify callback signature
    // For PayPal: verify transaction ID

    // Update order status
    await orders.updateOne(
      { orderId },
      { 
        $set: { 
          status: 'completed',
          paymentId,
          signature,
          completedAt: new Date()
        } 
      }
    );

    // Create subscription
    const subscriptions = getCollection('subscriptions');
    const subscription = {
      userId: req.user.userId,
      planId: order.planId,
      billingPeriod: order.billingPeriod,
      status: 'active',
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + (order.billingPeriod === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
      orderId,
      createdAt: new Date()
    };

    await subscriptions.insertOne(subscription);

    // Update user
    const users = getCollection('users');
    await users.updateOne(
      { _id: req.user.userId },
      { $set: { subscriptionPlan: order.planId, subscriptionStatus: 'active' } }
    );

    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

app.get('/api/payments/history', authenticateToken, async (req: any, res) => {
  try {
    const orders = getCollection('orders');
    const paymentHistory = await orders
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    res.json(paymentHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Webhook endpoints for payment gateways
app.post('/api/webhooks/stripe', async (req, res) => {
  // Handle Stripe webhooks
  // Verify signature and process events
  res.json({ received: true });
});

app.post('/api/webhooks/phonepe', async (req, res) => {
  // Handle PhonePe callbacks
  // Verify signature and update order status
  res.json({ received: true });
});

app.post('/api/webhooks/paypal', async (req, res) => {
  // Handle PayPal IPN
  // Verify and process payment notifications
  res.json({ received: true });
});

// Utility functions
function calculateSlotPrice(start: string, end: string, subscriptionId: string): number {
  const duration = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
  const basePrice = 5; // Base price per hour
  const demandMultiplier = getDemandMultiplier(subscriptionId);
  return basePrice * duration * demandMultiplier;
}

function getDemandMultiplier(subscriptionId: string): number {
  const demandMap: Record<string, number> = {
    'netflix': 1.2,
    'disney': 1.1,
    'prime': 0.9,
    'crunchyroll': 0.8
  };
  return demandMap[subscriptionId] || 1.0;
}

// Initialize database and start server
const port = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 SplitShare Backend running on http://localhost:${port}`);
    console.log(`📊 Database: MongoDB`);
    console.log(`🔐 Authentication: JWT`);
    console.log(`🤖 AI Features: Enabled`);
  });
});


