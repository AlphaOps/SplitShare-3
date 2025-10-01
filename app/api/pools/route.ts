import { NextResponse } from 'next/server';

// Mock data store (in-memory for development)
let pools: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  
  let filteredPools = pools;
  if (platform) {
    filteredPools = pools.filter(p => p.platform === platform);
  }
  
  return NextResponse.json({ success: true, pools: filteredPools });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, hostUserId, pricePerMember, maxMembers = 4, proofUploadUrl } = body;
    
    if (!platform || !hostUserId || !pricePerMember) {
      return NextResponse.json(
        { error: 'platform, hostUserId, pricePerMember are required' },
        { status: 400 }
      );
    }
    
    const pool = {
      _id: `pool_${Date.now()}`,
      platform,
      hostUserId,
      pricePerMember,
      maxMembers,
      members: [],
      status: proofUploadUrl ? 'awaiting_verification' : 'draft',
      proofUploadUrl,
      verification: { method: 'manual', verified: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    pools.push(pool);
    
    return NextResponse.json({ success: true, poolId: pool._id });
  } catch (error) {
    console.error('Create pool error:', error);
    return NextResponse.json(
      { error: 'Failed to create pool' },
      { status: 500 }
    );
  }
}
