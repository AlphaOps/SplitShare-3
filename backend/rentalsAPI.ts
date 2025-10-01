/**
 * Rental Plans API
 */
import { Router } from 'express';
import { getDb } from './db';
import { COLLECTIONS, RentalPlan, RENTAL_LIMITS, OTTPlatform } from './models/types';
import { ObjectId } from 'mongodb';

const router = Router();

// Create rental plan
router.post('/', async (req, res) => {
  try {
    const { platform, ownerUserId, days, price } = req.body as Partial<RentalPlan> & { platform: OTTPlatform };
    if (!platform || !ownerUserId || !days || !price) return res.status(400).json({ error: 'platform, ownerUserId, days, price required' });

    // Simple validation: price per day within min/max
    const perDay = price / days;
    if (perDay < RENTAL_LIMITS.min || perDay > RENTAL_LIMITS.max) {
      return res.status(400).json({ error: `Per-day price must be between ₹${RENTAL_LIMITS.min} and ₹${RENTAL_LIMITS.max}` });
    }

    const db = await getDb();
    const plan: RentalPlan = {
      platform,
      ownerUserId,
      days,
      price,
      status: 'active',
      bookings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.rentals).insertOne(plan as any);
    return res.json({ success: true, rentalId: result.insertedId });
  } catch (e) {
    console.error('Create rental error', e);
    return res.status(500).json({ error: 'Failed to create rental' });
  }
});

// List rentals (by platform optional)
router.get('/', async (req, res) => {
  try {
    const { platform } = req.query as { platform?: string };
    const db = await getDb();
    const q: any = {};
    if (platform) q.platform = platform;
    const rentals = await db.collection(COLLECTIONS.rentals).find(q).sort({ createdAt: -1 }).limit(100).toArray();
    return res.json({ success: true, rentals });
  } catch (e) {
    console.error('List rentals error', e);
    return res.status(500).json({ error: 'Failed to list rentals' });
  }
});

// Book a rental - instant booking
router.post('/:rentalId/book', async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { userId } = req.body as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const db = await getDb();
    const plan = await db.collection(COLLECTIONS.rentals).findOne({ _id: new ObjectId(rentalId) });
    if (!plan) return res.status(404).json({ error: 'Rental not found' });
    if (plan.status !== 'active') return res.status(400).json({ error: 'Rental not active' });

    const start = new Date();
    const end = new Date(start.getTime() + plan.days * 24 * 60 * 60 * 1000);

    // Cast update document to any to satisfy TS types for $push array
    await db.collection(COLLECTIONS.rentals).updateOne(
      { _id: new ObjectId(rentalId) },
      ({
        $push: {
          bookings: { userId, startAt: start, endAt: end, status: 'booked' }
        },
        $set: { updatedAt: new Date() }
      } as any)
    );

    return res.json({ success: true, booking: { startAt: start, endAt: end } });
  } catch (e) {
    console.error('Book rental error', e);
    return res.status(500).json({ error: 'Failed to book rental' });
  }
});

export default router;
