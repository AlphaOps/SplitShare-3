/**
 * Standard Account Pools API
 */
import { Router } from 'express';
import { getDb } from './db';
import { COLLECTIONS, Pool, BASE_MIN_PRICE_INR, OTTPlatform } from './models/types';
import { ObjectId } from 'mongodb';

const router = Router();

// Create a pool (host)
router.post('/', async (req, res) => {
  try {
    const { platform, hostUserId, pricePerMember, maxMembers = 4, proofUploadUrl } = req.body as Partial<Pool> & { platform: OTTPlatform };
    if (!platform || !hostUserId || !pricePerMember) {
      return res.status(400).json({ error: 'platform, hostUserId, pricePerMember are required' });
    }
    const minPrice = BASE_MIN_PRICE_INR[platform];
    if (pricePerMember < minPrice) {
      return res.status(400).json({ error: `Price per member must be >= ₹${minPrice} for ${platform}` });
    }

    const db = await getDb();
    const pool: Pool = {
      platform,
      hostUserId,
      pricePerMember,
      maxMembers,
      members: [],
      status: proofUploadUrl ? 'awaiting_verification' : 'draft',
      proofUploadUrl,
      verification: { method: 'manual', verified: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.pools).insertOne(pool as any);
    return res.json({ success: true, poolId: result.insertedId });
  } catch (e) {
    console.error('Create pool error', e);
    return res.status(500).json({ error: 'Failed to create pool' });
  }
});

// List pools (optionally by platform)
router.get('/', async (req, res) => {
  try {
    const { platform } = req.query as { platform?: string };
    const db = await getDb();
    const q: any = {};
    if (platform) q.platform = platform;
    const pools = await db
      .collection(COLLECTIONS.pools)
      .find(q)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return res.json({ success: true, pools });
  } catch (e) {
    console.error('List pools error', e);
    return res.status(500).json({ error: 'Failed to list pools' });
  }
});

// Join a pool
router.post('/:poolId/join', async (req, res) => {
  try {
    const { poolId } = req.params;
    const { userId } = req.body as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const db = await getDb();
    const pool = await db.collection(COLLECTIONS.pools).findOne({ _id: new ObjectId(poolId) });
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    if (pool.status !== 'open' && pool.status !== 'awaiting_verification') {
      return res.status(400).json({ error: 'Pool not open for joining' });
    }
    if (pool.members.includes(userId)) {
      return res.status(400).json({ error: 'Already joined' });
    }
    if (pool.members.length >= pool.maxMembers) {
      return res.status(400).json({ error: 'Pool is already full' });
    }

    const updatedMembers = [...pool.members, userId];
    const status = updatedMembers.length >= pool.maxMembers ? 'filled' : pool.status;
    await db.collection(COLLECTIONS.pools).updateOne(
      { _id: new ObjectId(poolId) },
      { $set: { members: updatedMembers, status, updatedAt: new Date() } }
    );
    return res.json({ success: true, status });
  } catch (e) {
    console.error('Join pool error', e);
    return res.status(500).json({ error: 'Failed to join pool' });
  }
});

// Verify subscription (host)
router.post('/:poolId/verify', async (req, res) => {
  try {
    const { poolId } = req.params;
    const { hostUserId, verified, notes } = req.body as { hostUserId: string; verified: boolean; notes?: string };

    const db = await getDb();
    const pool = await db.collection(COLLECTIONS.pools).findOne({ _id: new ObjectId(poolId) });
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    if (pool.hostUserId !== hostUserId) return res.status(403).json({ error: 'Only host can verify' });

    await db.collection(COLLECTIONS.pools).updateOne(
      { _id: new ObjectId(poolId) },
      {
        $set: {
          status: verified ? 'open' : 'awaiting_verification',
          verification: { method: 'manual', verified, verifiedAt: verified ? new Date() : undefined, notes },
          updatedAt: new Date(),
        },
      }
    );
    return res.json({ success: true });
  } catch (e) {
    console.error('Verify pool error', e);
    return res.status(500).json({ error: 'Failed to verify pool' });
  }
});

export default router;
