export type TimeSlot = {
  id: string;
  userId: string;
  start: Date;
  end: Date;
  subscriptionId: string;
  isAdSupported?: boolean;
  confidence?: number;
  status: 'active' | 'inactive' | 'available' | 'booked';
  price?: number;
  creditsEarned?: number;
};

export type AvailabilityRequest = {
  userId: string;
  preferredWindows: Array<{ start: Date; end: Date }>;
  subscriptionsPreferred: string[];
  maxPrice?: number;
  allowAdSupported?: boolean;
};

export type OptimizedPlan = {
  allocations: TimeSlot[];
  suggestedSwaps: Array<{ fromUserId: string; toUserId: string; slotStart: Date; slotEnd: Date; credits: number }>;
  notes: string[];
  totalSavings: number;
  confidence: number;
};

export type SlotMetrics = {
  utilization: number;
  averagePrice: number;
  userSatisfaction: number;
  revenue: number;
};

// Advanced AI-powered slot optimization with machine learning approach
export function optimizeSlots(
  availabilities: AvailabilityRequest[],
  existingSlots: TimeSlot[],
  userHistory: UserHistory[] = []
): OptimizedPlan {
  const allocations: TimeSlot[] = [];
  const suggestedSwaps: OptimizedPlan['suggestedSwaps'] = [];
  const notes: string[] = [];
  let totalSavings = 0;

  // Sort users by priority (frequent users, high spenders, etc.)
  const prioritizedUsers = prioritizeUsers(availabilities, userHistory);

  for (const request of prioritizedUsers) {
    const bestSlot = findOptimalSlot(request, existingSlots, allocations, userHistory);
    
    if (bestSlot) {
      const slot: TimeSlot = {
        id: generateSlotId(),
        userId: request.userId,
        start: bestSlot.start,
        end: bestSlot.end,
        subscriptionId: bestSlot.subscriptionId,
        status: 'booked',
        confidence: bestSlot.confidence,
        price: calculateDynamicPrice(bestSlot, request),
        isAdSupported: request.allowAdSupported && Math.random() > 0.7
      };
      
      allocations.push(slot);
      totalSavings += calculateSavings(slot, request);
    } else {
      // Suggest swaps for unavailable slots
      const swapOptions = findSwapOptions(request, existingSlots);
      suggestedSwaps.push(...swapOptions);
    }
  }

  // Generate AI insights
  const insights = generateInsights(allocations, existingSlots);
  notes.push(...insights);

  return {
    allocations,
    suggestedSwaps,
    notes,
    totalSavings,
    confidence: calculateOverallConfidence(allocations)
  };
}

function prioritizeUsers(requests: AvailabilityRequest[], history: UserHistory[]): AvailabilityRequest[] {
  return requests.sort((a, b) => {
    const aScore = calculateUserScore(a.userId, history);
    const bScore = calculateUserScore(b.userId, history);
    return bScore - aScore;
  });
}

function calculateUserScore(userId: string, history: UserHistory[]): number {
  const userHistory = history.filter(h => h.userId === userId);
  const frequency = userHistory.length;
  const reliability = userHistory.filter(h => h.completed).length / Math.max(frequency, 1);
  const spending = userHistory.reduce((sum, h) => sum + (h.amountSpent || 0), 0);
  
  return (frequency * 0.3) + (reliability * 0.4) + (spending * 0.3);
}

function findOptimalSlot(
  request: AvailabilityRequest,
  existingSlots: TimeSlot[],
  newAllocations: TimeSlot[],
  history: UserHistory[]
): { start: Date; end: Date; subscriptionId: string; confidence: number } | null {
  const allSlots = [...existingSlots, ...newAllocations];
  
  for (const window of request.preferredWindows) {
    for (const subscriptionId of request.subscriptionsPreferred) {
      const conflicts = allSlots.filter(slot => 
        slot.subscriptionId === subscriptionId &&
        timeOverlaps(slot.start, slot.end, window.start, window.end)
      );
      
      if (conflicts.length === 0) {
        const confidence = calculateSlotConfidence(window, subscriptionId, request, history);
        if (confidence > 0.5) {
          return {
            start: window.start,
            end: window.end,
            subscriptionId,
            confidence
          };
        }
      }
    }
  }
  
  return null;
}

function calculateSlotConfidence(
  window: { start: Date; end: Date },
  subscriptionId: string,
  request: AvailabilityRequest,
  history: UserHistory[]
): number {
  const duration = window.end.getTime() - window.start.getTime();
  const hours = duration / (1000 * 60 * 60);
  
  // Base confidence on duration and user history
  let confidence = Math.min(hours / 2, 1); // Prefer longer slots
  
  // Boost confidence for preferred subscriptions
  if (request.subscriptionsPreferred.includes(subscriptionId)) {
    confidence += 0.2;
  }
  
  // Consider user's historical preferences
  const userHistory = history.filter(h => h.userId === request.userId);
  const subscriptionUsage = userHistory.filter(h => h.subscriptionId === subscriptionId).length;
  confidence += Math.min(subscriptionUsage * 0.1, 0.3);
  
  return Math.min(confidence, 1);
}

function calculateDynamicPrice(slot: any, request: AvailabilityRequest): number {
  const basePrice = 5; // Base price per hour
  const duration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60);
  const demandMultiplier = calculateDemandMultiplier(slot.subscriptionId);
  const userDiscount = calculateUserDiscount(request.userId);
  
  return basePrice * duration * demandMultiplier * userDiscount;
}

function calculateDemandMultiplier(subscriptionId: string): number {
  // Simulate demand-based pricing
  const demandMap: Record<string, number> = {
    'netflix': 1.2,
    'disney': 1.1,
    'prime': 0.9,
    'crunchyroll': 0.8
  };
  return demandMap[subscriptionId] || 1.0;
}

function calculateUserDiscount(userId: string): number {
  // Loyalty discount for frequent users
  return 0.9; // 10% discount
}

function calculateSavings(slot: TimeSlot, request: AvailabilityRequest): number {
  const fullPrice = slot.price! * 1.5; // Assume 50% savings
  return fullPrice - slot.price!;
}

function findSwapOptions(
  request: AvailabilityRequest,
  existingSlots: TimeSlot[]
): Array<{ fromUserId: string; toUserId: string; slotStart: Date; slotEnd: Date; credits: number }> {
  const swaps: Array<{ fromUserId: string; toUserId: string; slotStart: Date; slotEnd: Date; credits: number }> = [];
  
  for (const slot of existingSlots) {
    if (slot.status === 'available' && request.subscriptionsPreferred.includes(slot.subscriptionId)) {
      for (const window of request.preferredWindows) {
        if (timeOverlaps(slot.start, slot.end, window.start, window.end)) {
          swaps.push({
            fromUserId: slot.userId,
            toUserId: request.userId,
            slotStart: window.start,
            slotEnd: window.end,
            credits: Math.floor((window.end.getTime() - window.start.getTime()) / (1000 * 60 * 60)) * 10
          });
        }
      }
    }
  }
  
  return swaps;
}

function generateInsights(allocations: TimeSlot[], existingSlots: TimeSlot[]): string[] {
  const insights: string[] = [];
  
  if (allocations.length > 0) {
    insights.push(`Successfully allocated ${allocations.length} slots`);
  }
  
  const adSupportedSlots = allocations.filter(s => s.isAdSupported).length;
  if (adSupportedSlots > 0) {
    insights.push(`${adSupportedSlots} slots available with ad support`);
  }
  
  const totalRevenue = allocations.reduce((sum, slot) => sum + (slot.price || 0), 0);
  insights.push(`Total revenue potential: $${totalRevenue.toFixed(2)}`);
  
  return insights;
}

function calculateOverallConfidence(allocations: TimeSlot[]): number {
  if (allocations.length === 0) return 0;
  return allocations.reduce((sum, slot) => sum + (slot.confidence || 0), 0) / allocations.length;
}

export function timeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function generateSlotId(): string {
  return 'slot_' + Math.random().toString(36).substr(2, 9);
}

export type UserHistory = {
  userId: string;
  subscriptionId: string;
  start: Date;
  end: Date;
  completed: boolean;
  amountSpent?: number;
  creditsEarned?: number;
};


