/**
 * AI-Driven Time Allocation Engine
 * Intelligently allocates viewing slots based on user patterns and availability
 */

export interface UserPattern {
  userId: string;
  preferredTimes: number[]; // Hours of day (0-23)
  averageSessionDuration: number; // minutes
  weekdayPreference: number[]; // 0-6 (Sun-Sat)
  genrePreferences: string[];
  historicalUsage: {
    date: Date;
    duration: number;
    timeSlot: number;
  }[];
}

export interface OTTSlot {
  id: string;
  platform: 'netflix' | 'prime' | 'disney' | 'hotstar' | 'sonyliv';
  tier: 'basic' | 'standard' | 'premium' | '4k';
  maxConcurrentUsers: number;
  currentUsers: string[];
  credentials: {
    email: string;
    passwordHash: string; // Never store plain text
    encryptedPassword: string; // Encrypted for access
  };
  pricePerMonth: number;
  currency: 'INR' | 'USD';
  allocatedSlots: TimeSlotAllocation[];
}

export interface TimeSlotAllocation {
  userId: string;
  dayOfWeek: number; // 0-6
  startHour: number; // 0-23
  endHour: number; // 0-23
  priority: 'high' | 'medium' | 'low';
  flexible: boolean; // Can be moved if needed
}

export interface SlotRecommendation {
  userId: string;
  slotId: string;
  recommendedTimes: {
    day: number;
    startHour: number;
    endHour: number;
    confidence: number; // 0-1
  }[];
  estimatedCostPerMonth: number;
  conflictProbability: number;
}

/**
 * AI Time Allocation Engine
 */
export class TimeAllocationEngine {
  /**
   * Analyze user viewing patterns using ML
   */
  analyzeUserPattern(userId: string, historicalData: any[]): UserPattern {
    const pattern: UserPattern = {
      userId,
      preferredTimes: this.extractPreferredTimes(historicalData),
      averageSessionDuration: this.calculateAverageSessionDuration(historicalData),
      weekdayPreference: this.extractWeekdayPreference(historicalData),
      genrePreferences: this.extractGenrePreferences(historicalData),
      historicalUsage: historicalData.map(d => ({
        date: new Date(d.timestamp),
        duration: d.duration,
        timeSlot: new Date(d.timestamp).getHours()
      }))
    };

    return pattern;
  }

  /**
   * Extract preferred viewing times (peak hours)
   */
  private extractPreferredTimes(data: any[]): number[] {
    const hourCounts = new Array(24).fill(0);
    
    data.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts[hour] += session.duration;
    });

    // Return top 5 hours
    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.hour);
  }

  /**
   * Calculate average session duration
   */
  private calculateAverageSessionDuration(data: any[]): number {
    if (data.length === 0) return 120; // Default 2 hours
    const total = data.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(total / data.length);
  }

  /**
   * Extract weekday preferences
   */
  private extractWeekdayPreference(data: any[]): number[] {
    const dayCounts = new Array(7).fill(0);
    
    data.forEach(session => {
      const day = new Date(session.timestamp).getDay();
      dayCounts[day] += session.duration;
    });

    return dayCounts
      .map((count, day) => ({ day, count }))
      .sort((a, b) => b.count - a.count)
      .map(item => item.day);
  }

  /**
   * Extract genre preferences
   */
  private extractGenrePreferences(data: any[]): string[] {
    const genreCounts: { [key: string]: number } = {};
    
    data.forEach(session => {
      if (session.genre) {
        genreCounts[session.genre] = (genreCounts[session.genre] || 0) + 1;
      }
    });

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(item => item[0]);
  }

  /**
   * Allocate optimal time slots for users
   * Uses conflict-free scheduling algorithm
   */
  allocateTimeSlots(
    slot: OTTSlot,
    userPatterns: UserPattern[]
  ): TimeSlotAllocation[] {
    const allocations: TimeSlotAllocation[] = [];
    const schedule: { [key: string]: number } = {}; // day-hour -> user count

    // Sort users by flexibility (less flexible first)
    const sortedUsers = this.prioritizeUsers(userPatterns);

    for (const user of sortedUsers) {
      const allocation = this.findBestSlot(user, schedule, slot.maxConcurrentUsers);
      
      if (allocation) {
        allocations.push(allocation);
        this.updateSchedule(schedule, allocation);
      }
    }

    return allocations;
  }

  /**
   * Prioritize users based on flexibility and preferences
   */
  private prioritizeUsers(patterns: UserPattern[]): UserPattern[] {
    return patterns.sort((a, b) => {
      // Users with fewer preferred times get priority
      return a.preferredTimes.length - b.preferredTimes.length;
    });
  }

  /**
   * Find best available slot for a user
   */
  private findBestSlot(
    user: UserPattern,
    schedule: { [key: string]: number },
    maxConcurrent: number
  ): TimeSlotAllocation | null {
    const sessionDuration = Math.ceil(user.averageSessionDuration / 60); // Convert to hours

    // Try each preferred day
    for (const day of user.weekdayPreference) {
      // Try each preferred time
      for (const hour of user.preferredTimes) {
        const key = `${day}-${hour}`;
        const currentCount = schedule[key] || 0;

        // Check if slot is available
        if (currentCount < maxConcurrent) {
          // Check if subsequent hours are also available
          let canAllocate = true;
          for (let h = hour; h < hour + sessionDuration && h < 24; h++) {
            const checkKey = `${day}-${h}`;
            if ((schedule[checkKey] || 0) >= maxConcurrent) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            return {
              userId: user.userId,
              dayOfWeek: day,
              startHour: hour,
              endHour: Math.min(hour + sessionDuration, 23),
              priority: this.calculatePriority(user),
              flexible: user.preferredTimes.length > 3
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Calculate user priority based on usage patterns
   */
  private calculatePriority(user: UserPattern): 'high' | 'medium' | 'low' {
    const totalUsage = user.historicalUsage.reduce((sum, u) => sum + u.duration, 0);
    
    if (totalUsage > 1000) return 'high'; // Heavy user
    if (totalUsage > 500) return 'medium';
    return 'low';
  }

  /**
   * Update schedule with new allocation
   */
  private updateSchedule(
    schedule: { [key: string]: number },
    allocation: TimeSlotAllocation
  ): void {
    for (let hour = allocation.startHour; hour <= allocation.endHour; hour++) {
      const key = `${allocation.dayOfWeek}-${hour}`;
      schedule[key] = (schedule[key] || 0) + 1;
    }
  }

  /**
   * Detect and resolve conflicts
   */
  detectConflicts(allocations: TimeSlotAllocation[]): {
    hasConflicts: boolean;
    conflicts: { time: string; users: string[] }[];
  } {
    const timeMap: { [key: string]: string[] } = {};

    allocations.forEach(allocation => {
      for (let hour = allocation.startHour; hour <= allocation.endHour; hour++) {
        const key = `${allocation.dayOfWeek}-${hour}`;
        if (!timeMap[key]) timeMap[key] = [];
        timeMap[key].push(allocation.userId);
      }
    });

    const conflicts = Object.entries(timeMap)
      .filter(([_, users]) => users.length > 4) // Assuming max 4 concurrent
      .map(([time, users]) => ({ time, users }));

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  /**
   * Optimize allocations to minimize conflicts
   */
  optimizeAllocations(
    allocations: TimeSlotAllocation[],
    maxConcurrent: number
  ): TimeSlotAllocation[] {
    const optimized = [...allocations];
    let improved = true;

    while (improved) {
      improved = false;
      const conflicts = this.detectConflicts(optimized);

      if (conflicts.hasConflicts) {
        // Try to move flexible allocations
        for (const conflict of conflicts.conflicts) {
          const flexibleUsers = optimized.filter(
            a => conflict.users.includes(a.userId) && a.flexible
          );

          if (flexibleUsers.length > 0) {
            // Move the lowest priority flexible user
            const toMove = flexibleUsers.sort((a, b) => {
              const priorityOrder = { low: 0, medium: 1, high: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })[0];

            // Find alternative slot
            const alternative = this.findAlternativeSlot(toMove, optimized, maxConcurrent);
            if (alternative) {
              const index = optimized.findIndex(a => a.userId === toMove.userId);
              optimized[index] = alternative;
              improved = true;
              break;
            }
          }
        }
      }
    }

    return optimized;
  }

  /**
   * Find alternative slot for a user
   */
  private findAlternativeSlot(
    allocation: TimeSlotAllocation,
    existing: TimeSlotAllocation[],
    maxConcurrent: number
  ): TimeSlotAllocation | null {
    const schedule: { [key: string]: number } = {};
    
    // Build schedule from existing allocations
    existing.forEach(a => {
      if (a.userId !== allocation.userId) {
        for (let hour = a.startHour; hour <= a.endHour; hour++) {
          const key = `${a.dayOfWeek}-${hour}`;
          schedule[key] = (schedule[key] || 0) + 1;
        }
      }
    });

    // Try nearby times
    const duration = allocation.endHour - allocation.startHour;
    const daysToTry = [allocation.dayOfWeek, (allocation.dayOfWeek + 1) % 7, (allocation.dayOfWeek + 6) % 7];
    const hoursToTry = [
      allocation.startHour,
      allocation.startHour + 1,
      allocation.startHour - 1,
      allocation.startHour + 2,
      allocation.startHour - 2
    ].filter(h => h >= 0 && h < 24);

    for (const day of daysToTry) {
      for (const hour of hoursToTry) {
        let canAllocate = true;
        for (let h = hour; h <= hour + duration && h < 24; h++) {
          const key = `${day}-${h}`;
          if ((schedule[key] || 0) >= maxConcurrent) {
            canAllocate = false;
            break;
          }
        }

        if (canAllocate) {
          return {
            ...allocation,
            dayOfWeek: day,
            startHour: hour,
            endHour: Math.min(hour + duration, 23)
          };
        }
      }
    }

    return null;
  }

  /**
   * Generate recommendations for users
   */
  generateRecommendations(
    userId: string,
    pattern: UserPattern,
    availableSlots: OTTSlot[]
  ): SlotRecommendation[] {
    const recommendations: SlotRecommendation[] = [];

    for (const slot of availableSlots) {
      if (slot.currentUsers.length >= slot.maxConcurrentUsers) continue;

      const recommendation = this.calculateRecommendation(userId, pattern, slot);
      recommendations.push(recommendation);
    }

    // Sort by estimated cost (lowest first)
    return recommendations.sort((a, b) => a.estimatedCostPerMonth - b.estimatedCostPerMonth);
  }

  /**
   * Calculate recommendation for a specific slot
   */
  private calculateRecommendation(
    userId: string,
    pattern: UserPattern,
    slot: OTTSlot
  ): SlotRecommendation {
    const totalMonthlyMinutes = pattern.historicalUsage.reduce((sum, u) => sum + u.duration, 0);
    const totalMonthlyHours = totalMonthlyMinutes / 60;
    const costPerHour = slot.pricePerMonth / (30 * 24); // Assuming 30 days
    const estimatedCost = totalMonthlyHours * costPerHour;

    // Calculate conflict probability
    const conflictProb = this.calculateConflictProbability(pattern, slot);

    return {
      userId,
      slotId: slot.id,
      recommendedTimes: pattern.preferredTimes.map(hour => ({
        day: pattern.weekdayPreference[0],
        startHour: hour,
        endHour: hour + Math.ceil(pattern.averageSessionDuration / 60),
        confidence: 0.8 - (conflictProb * 0.5)
      })),
      estimatedCostPerMonth: Math.round(estimatedCost),
      conflictProbability: conflictProb
    };
  }

  /**
   * Calculate probability of conflicts
   */
  private calculateConflictProbability(pattern: UserPattern, slot: OTTSlot): number {
    const utilizationRate = slot.currentUsers.length / slot.maxConcurrentUsers;
    const peakHourOverlap = this.calculatePeakHourOverlap(pattern, slot);
    
    return (utilizationRate * 0.6) + (peakHourOverlap * 0.4);
  }

  /**
   * Calculate overlap with existing users' peak hours
   */
  private calculatePeakHourOverlap(pattern: UserPattern, slot: OTTSlot): number {
    // Simplified - in production, analyze all users' patterns
    const peakHours = [19, 20, 21, 22]; // 7 PM - 10 PM
    const userPeakHours = pattern.preferredTimes;
    
    const overlap = userPeakHours.filter(h => peakHours.includes(h)).length;
    return overlap / userPeakHours.length;
  }
}

// Export singleton instance
export const timeAllocationEngine = new TimeAllocationEngine();
