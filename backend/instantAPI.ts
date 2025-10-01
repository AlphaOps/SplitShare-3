/**
 * Instant Gold Plans API
 */
import { Router } from 'express';
import { getDb } from './db';
import { COLLECTIONS, InstantGoldPlan, OTTPlatform } from './models/types';
import { ObjectId } from 'mongodb';

const router = Router();

// Seed or ensure some instant plans exist (optional helper)
async function ensureDefaultPlans() {
  const db = await getDb();
  const count = await db.collection(COLLECTIONS.instant).countDocuments();
  if (count === 0) {
    const defaults: InstantGoldPlan[] = [
      { platform: 'Netflix', priceMonthly: 49, stock: 10, active: true, createdAt: new Date(), updatedAt: new Date() },
      { platform: 'Prime Video', priceMonthly: 29, stock: 15, active: true, createdAt: new Date(), updatedAt: new Date() },
      { platform: 'Disney+', priceMonthly: 39, stock: 8, active: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    await db.collection(COLLECTIONS.instant).insertMany(defaults as any);
  }
}

// List instant plans
router.get('/', async (_req, res) => {
  try {
    await ensureDefaultPlans();
    const db = await getDb();
    const plans = await db
      .collection(COLLECTIONS.instant)
      .find({ active: true, stock: { $gt: 0 } })
      .sort({ platform: 1 })
      .toArray();
    res.json({ success: true, plans });
  } catch (e) {
    console.error('List instant plans error', e);
    res.status(500).json({ error: 'Failed to list instant plans' });
  }
});

// Book an instant plan (decrement stock and return credential placeholder)
router.post('/:planId/book', async (req, res) => {
  try {
    const { planId } = req.params;
    const { userId } = req.body as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const db = await getDb();
    const plan = await db.collection(COLLECTIONS.instant).findOne({ _id: new ObjectId(planId) });
    if (!plan || !plan.active) return res.status(404).json({ error: 'Plan not available' });
    if (plan.stock <= 0) return res.status(400).json({ error: 'Out of stock' });

    // Atomically decrement stock
    const update = await db.collection(COLLECTIONS.instant).findOneAndUpdate(
      { _id: new ObjectId(planId), stock: { $gt: 0 } },
      { $inc: { stock: -1 }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!update || !update.value) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    // Issue credentials (placeholder - integrate with credential vault/password rotation)
    const credential = {
      username: `user+${Date.now()}@splitshare.com`,
      password: Math.random().toString(36).slice(2, 10),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    // Record transaction (simplified)
    await db.collection(COLLECTIONS.transactions).insertOne({
      userId,
      kind: 'instant',
      refId: planId,
      amount: plan.priceMonthly,
      currency: 'INR',
      status: 'paid',
      gateway: 'mock',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ success: true, credential, plan: { platform: plan.platform, priceMonthly: plan.priceMonthly } });
  } catch (e) {
    console.error('Book instant plan error', e);
    res.status(500).json({ error: 'Failed to book instant plan' });
  }
});

export default router;
