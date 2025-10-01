/**
 * Dynamic Pricing Calculator
 * Calculates pay-per-use pricing based on actual viewing time
 */

export interface OTTPlatformPricing {
  platform: string;
  tier: string;
  monthlyPrice: number;
  currency: 'INR' | 'USD';
  maxConcurrentUsers: number;
  features: {
    quality: 'SD' | 'HD' | '4K';
    downloads: boolean;
    ads: boolean;
  };
  lastUpdated: Date;
}

export interface UsageRecord {
  userId: string;
  slotId: string;
  platform: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  quality: 'SD' | 'HD' | '4K';
  cost: number;
}

export interface PricingBreakdown {
  baseCostPerHour: number;
  qualityMultiplier: number;
  timeMultiplier: number;
  demandMultiplier: number;
  finalCostPerHour: number;
  estimatedMonthlyCost: number;
}

/**
 * Live OTT Platform Prices (India - INR)
 * Updated: September 2025
 */
export const OTT_PRICES: OTTPlatformPricing[] = [
  {
    platform: 'Netflix',
    tier: 'Mobile',
    monthlyPrice: 149,
    currency: 'INR',
    maxConcurrentUsers: 1,
    features: { quality: 'SD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Netflix',
    tier: 'Basic',
    monthlyPrice: 199,
    currency: 'INR',
    maxConcurrentUsers: 1,
    features: { quality: 'HD', downloads: false, ads: true },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Netflix',
    tier: 'Standard',
    monthlyPrice: 499,
    currency: 'INR',
    maxConcurrentUsers: 2,
    features: { quality: 'HD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Netflix',
    tier: 'Premium',
    monthlyPrice: 649,
    currency: 'INR',
    maxConcurrentUsers: 4,
    features: { quality: '4K', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Prime Video',
    tier: 'Standard',
    monthlyPrice: 179,
    currency: 'INR',
    maxConcurrentUsers: 3,
    features: { quality: '4K', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Disney+ Hotstar',
    tier: 'Mobile',
    monthlyPrice: 149,
    currency: 'INR',
    maxConcurrentUsers: 1,
    features: { quality: 'HD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Disney+ Hotstar',
    tier: 'Super',
    monthlyPrice: 299,
    currency: 'INR',
    maxConcurrentUsers: 2,
    features: { quality: 'HD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'Disney+ Hotstar',
    tier: 'Premium',
    monthlyPrice: 499,
    currency: 'INR',
    maxConcurrentUsers: 4,
    features: { quality: '4K', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'SonyLIV',
    tier: 'Standard',
    monthlyPrice: 299,
    currency: 'INR',
    maxConcurrentUsers: 2,
    features: { quality: 'HD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  },
  {
    platform: 'ZEE5',
    tier: 'Premium',
    monthlyPrice: 299,
    currency: 'INR',
    maxConcurrentUsers: 5,
    features: { quality: 'HD', downloads: true, ads: false },
    lastUpdated: new Date('2025-09-01')
  }
];

/**
 * Dynamic Pricing Calculator
 */
export class DynamicPricingCalculator {
  /**
   * Calculate cost per hour for a platform
   */
  calculateCostPerHour(pricing: OTTPlatformPricing): number {
    // Assume 30 days per month, 24 hours per day
    const totalHoursPerMonth = 30 * 24;
    
    // Divide monthly price by total hours
    const baseCostPerHour = pricing.monthlyPrice / totalHoursPerMonth;
    
    // Divide by max concurrent users (shared cost)
    return baseCostPerHour / pricing.maxConcurrentUsers;
  }

  /**
   * Calculate actual cost for a viewing session
   */
  calculateSessionCost(
    platform: string,
    tier: string,
    durationMinutes: number,
    quality: 'SD' | 'HD' | '4K',
    timeOfDay: number // 0-23
  ): number {
    const pricing = this.getPlatformPricing(platform, tier);
    if (!pricing) return 0;

    const baseCostPerHour = this.calculateCostPerHour(pricing);
    const durationHours = durationMinutes / 60;

    // Apply multipliers
    const qualityMultiplier = this.getQualityMultiplier(quality);
    const timeMultiplier = this.getTimeMultiplier(timeOfDay);
    
    const finalCost = baseCostPerHour * durationHours * qualityMultiplier * timeMultiplier;
    
    return Math.round(finalCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get quality multiplier
   */
  private getQualityMultiplier(quality: 'SD' | 'HD' | '4K'): number {
    const multipliers = {
      'SD': 0.8,
      'HD': 1.0,
      '4K': 1.3
    };
    return multipliers[quality] || 1.0;
  }

  /**
   * Get time-based multiplier
   */
  private getTimeMultiplier(hour: number): number {
    // Peak hours (6 PM - 11 PM): 1.2x
    if (hour >= 18 && hour <= 23) return 1.2;
    
    // Standard hours (11 AM - 6 PM): 1.0x
    if (hour >= 11 && hour < 18) return 1.0;
    
    // Off-peak hours (11 PM - 11 AM): 0.8x
    return 0.8;
  }

  /**
   * Get platform pricing
   */
  private getPlatformPricing(platform: string, tier: string): OTTPlatformPricing | null {
    return OTT_PRICES.find(
      p => p.platform.toLowerCase() === platform.toLowerCase() && 
           p.tier.toLowerCase() === tier.toLowerCase()
    ) || null;
  }

  /**
   * Calculate monthly cost estimate based on usage pattern
   */
  estimateMonthlyCost(
    platform: string,
    tier: string,
    averageHoursPerDay: number,
    preferredQuality: 'SD' | 'HD' | '4K',
    peakHourPercentage: number // 0-1
  ): PricingBreakdown {
    const pricing = this.getPlatformPricing(platform, tier);
    if (!pricing) {
      return {
        baseCostPerHour: 0,
        qualityMultiplier: 1,
        timeMultiplier: 1,
        demandMultiplier: 1,
        finalCostPerHour: 0,
        estimatedMonthlyCost: 0
      };
    }

    const baseCostPerHour = this.calculateCostPerHour(pricing);
    const qualityMultiplier = this.getQualityMultiplier(preferredQuality);
    
    // Calculate weighted time multiplier
    const peakMultiplier = 1.2;
    const offPeakMultiplier = 0.9;
    const timeMultiplier = (peakMultiplier * peakHourPercentage) + 
                          (offPeakMultiplier * (1 - peakHourPercentage));

    const finalCostPerHour = baseCostPerHour * qualityMultiplier * timeMultiplier;
    const estimatedMonthlyCost = finalCostPerHour * averageHoursPerDay * 30;

    return {
      baseCostPerHour: Math.round(baseCostPerHour * 100) / 100,
      qualityMultiplier,
      timeMultiplier: Math.round(timeMultiplier * 100) / 100,
      demandMultiplier: 1.0,
      finalCostPerHour: Math.round(finalCostPerHour * 100) / 100,
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost * 100) / 100
    };
  }

  /**
   * Find cheapest option for user's needs
   */
  findCheapestOption(
    averageHoursPerDay: number,
    preferredQuality: 'SD' | 'HD' | '4K',
    peakHourPercentage: number
  ): {
    platform: string;
    tier: string;
    estimatedCost: number;
    savings: number;
  } | null {
    let cheapest: any = null;

    for (const pricing of OTT_PRICES) {
      // Skip if quality doesn't match
      if (preferredQuality === '4K' && pricing.features.quality !== '4K') continue;
      if (preferredQuality === 'HD' && pricing.features.quality === 'SD') continue;

      const estimate = this.estimateMonthlyCost(
        pricing.platform,
        pricing.tier,
        averageHoursPerDay,
        preferredQuality,
        peakHourPercentage
      );

      if (!cheapest || estimate.estimatedMonthlyCost < cheapest.estimatedCost) {
        cheapest = {
          platform: pricing.platform,
          tier: pricing.tier,
          estimatedCost: estimate.estimatedMonthlyCost,
          fullPrice: pricing.monthlyPrice,
          savings: pricing.monthlyPrice - estimate.estimatedMonthlyCost
        };
      }
    }

    return cheapest;
  }

  /**
   * Calculate total cost for a user over a period
   */
  calculateUserCost(usageRecords: UsageRecord[]): {
    totalCost: number;
    totalMinutes: number;
    averageCostPerHour: number;
    breakdown: { [platform: string]: number };
  } {
    let totalCost = 0;
    let totalMinutes = 0;
    const breakdown: { [platform: string]: number } = {};

    for (const record of usageRecords) {
      totalCost += record.cost;
      totalMinutes += record.durationMinutes;
      
      if (!breakdown[record.platform]) {
        breakdown[record.platform] = 0;
      }
      breakdown[record.platform] += record.cost;
    }

    const averageCostPerHour = totalMinutes > 0 
      ? (totalCost / (totalMinutes / 60)) 
      : 0;

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalMinutes,
      averageCostPerHour: Math.round(averageCostPerHour * 100) / 100,
      breakdown
    };
  }

  /**
   * Generate pricing comparison
   */
  comparePricing(platforms: string[]): {
    platform: string;
    tier: string;
    monthlyPrice: number;
    costPerHour: number;
    maxUsers: number;
    quality: string;
  }[] {
    return OTT_PRICES
      .filter(p => platforms.includes(p.platform))
      .map(p => ({
        platform: p.platform,
        tier: p.tier,
        monthlyPrice: p.monthlyPrice,
        costPerHour: Math.round(this.calculateCostPerHour(p) * 100) / 100,
        maxUsers: p.maxConcurrentUsers,
        quality: p.features.quality
      }))
      .sort((a, b) => a.costPerHour - b.costPerHour);
  }

  /**
   * Calculate savings compared to full subscription
   */
  calculateSavings(
    platform: string,
    tier: string,
    actualUsageHours: number
  ): {
    fullPrice: number;
    payPerUseCost: number;
    savings: number;
    savingsPercentage: number;
  } {
    const pricing = this.getPlatformPricing(platform, tier);
    if (!pricing) {
      return {
        fullPrice: 0,
        payPerUseCost: 0,
        savings: 0,
        savingsPercentage: 0
      };
    }

    const costPerHour = this.calculateCostPerHour(pricing);
    const payPerUseCost = costPerHour * actualUsageHours;
    const savings = pricing.monthlyPrice - payPerUseCost;
    const savingsPercentage = (savings / pricing.monthlyPrice) * 100;

    return {
      fullPrice: pricing.monthlyPrice,
      payPerUseCost: Math.round(payPerUseCost * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savingsPercentage: Math.round(savingsPercentage * 100) / 100
    };
  }

  /**
   * Get all available platforms
   */
  getAvailablePlatforms(): string[] {
    return [...new Set(OTT_PRICES.map(p => p.platform))];
  }

  /**
   * Get tiers for a platform
   */
  getTiersForPlatform(platform: string): string[] {
    return OTT_PRICES
      .filter(p => p.platform.toLowerCase() === platform.toLowerCase())
      .map(p => p.tier);
  }
}

// Export singleton instance
export const pricingCalculator = new DynamicPricingCalculator();
