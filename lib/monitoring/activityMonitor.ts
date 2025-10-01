/**
 * Activity Monitoring System
 * Detects suspicious activities and potential security threats
 */

export interface UserSession {
  sessionId: string;
  userId: string;
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface SuspiciousActivity {
  id: string;
  userId: string;
  activityType: 
    | 'multiple_locations' 
    | 'rapid_logins' 
    | 'unusual_hours'
    | 'impossible_travel'
    | 'multiple_devices'
    | 'failed_2fa'
    | 'password_change'
    | 'unusual_payment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: any;
  resolved: boolean;
  action: 'none' | 'alert' | 'lock' | 'verify';
}

export interface ViewingActivity {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series' | 'live';
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  quality: 'SD' | 'HD' | '4K';
  deviceType: string;
  location: string;
  ipAddress: string;
}

/**
 * Activity Monitor Class
 */
export class ActivityMonitor {
  private sessions: Map<string, UserSession[]> = new Map();
  private activities: SuspiciousActivity[] = [];

  /**
   * Track new session
   */
  trackSession(session: UserSession): void {
    const userSessions = this.sessions.get(session.userId) || [];
    userSessions.push(session);
    this.sessions.set(session.userId, userSessions);

    // Check for suspicious patterns
    this.checkMultipleSessions(session.userId);
    this.checkImpossibleTravel(session);
  }

  /**
   * Check for multiple concurrent sessions
   */
  private checkMultipleSessions(userId: string): void {
    const sessions = this.getActiveSessions(userId);
    
    if (sessions.length > 3) {
      this.logSuspiciousActivity({
        id: this.generateId(),
        userId,
        activityType: 'multiple_devices',
        severity: 'medium',
        timestamp: new Date(),
        details: {
          sessionCount: sessions.length,
          devices: sessions.map(s => s.deviceType),
          locations: sessions.map(s => s.location.city)
        },
        resolved: false,
        action: 'alert'
      });
    }
  }

  /**
   * Check for impossible travel
   * (e.g., login from Mumbai, then Delhi within 1 hour)
   */
  private checkImpossibleTravel(newSession: UserSession): void {
    const recentSessions = this.getRecentSessions(newSession.userId, 60); // Last hour
    
    for (const session of recentSessions) {
      if (session.sessionId === newSession.sessionId) continue;
      
      const distance = this.calculateDistance(
        session.location.latitude || 0,
        session.location.longitude || 0,
        newSession.location.latitude || 0,
        newSession.location.longitude || 0
      );
      
      const timeDiff = (newSession.createdAt.getTime() - session.createdAt.getTime()) / (1000 * 60); // minutes
      const speed = distance / (timeDiff / 60); // km/h
      
      // If speed > 800 km/h (faster than commercial flight), flag as suspicious
      if (speed > 800) {
        this.logSuspiciousActivity({
          id: this.generateId(),
          userId: newSession.userId,
          activityType: 'impossible_travel',
          severity: 'high',
          timestamp: new Date(),
          details: {
            fromLocation: session.location.city,
            toLocation: newSession.location.city,
            distance: `${distance.toFixed(0)} km`,
            timeDiff: `${timeDiff.toFixed(0)} minutes`,
            speed: `${speed.toFixed(0)} km/h`
          },
          resolved: false,
          action: 'verify'
        });
      }
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check for unusual viewing hours
   */
  checkUnusualHours(activity: ViewingActivity): void {
    const hour = activity.startTime.getHours();
    
    // Flag viewing between 2 AM - 6 AM as unusual
    if (hour >= 2 && hour < 6) {
      this.logSuspiciousActivity({
        id: this.generateId(),
        userId: activity.userId,
        activityType: 'unusual_hours',
        severity: 'low',
        timestamp: new Date(),
        details: {
          time: activity.startTime.toISOString(),
          content: activity.contentId
        },
        resolved: false,
        action: 'none'
      });
    }
  }

  /**
   * Check for rapid login attempts
   */
  checkRapidLogins(userId: string, attempts: number, timeWindow: number): void {
    if (attempts > 5) {
      this.logSuspiciousActivity({
        id: this.generateId(),
        userId,
        activityType: 'rapid_logins',
        severity: 'high',
        timestamp: new Date(),
        details: {
          attempts,
          timeWindow: `${timeWindow} minutes`
        },
        resolved: false,
        action: 'lock'
      });
    }
  }

  /**
   * Get active sessions for a user
   */
  getActiveSessions(userId: string): UserSession[] {
    const sessions = this.sessions.get(userId) || [];
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    return sessions.filter(s => 
      s.isActive && s.lastActivity > thirtyMinutesAgo
    );
  }

  /**
   * Get recent sessions within time window
   */
  private getRecentSessions(userId: string, minutes: number): UserSession[] {
    const sessions = this.sessions.get(userId) || [];
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    
    return sessions.filter(s => s.createdAt > cutoff);
  }

  /**
   * Log suspicious activity
   */
  private logSuspiciousActivity(activity: SuspiciousActivity): void {
    this.activities.push(activity);
    
    // In production, send to monitoring service
    console.warn('Suspicious Activity Detected:', activity);
    
    // Send alert based on severity
    if (activity.severity === 'high' || activity.severity === 'critical') {
      this.sendSecurityAlert(activity);
    }
  }

  /**
   * Send security alert
   */
  private sendSecurityAlert(activity: SuspiciousActivity): void {
    // In production, send email/SMS/push notification
    console.log(`SECURITY ALERT: ${activity.activityType} for user ${activity.userId}`);
  }

  /**
   * Get all suspicious activities for a user
   */
  getSuspiciousActivities(userId: string): SuspiciousActivity[] {
    return this.activities.filter(a => a.userId === userId);
  }

  /**
   * Get unresolved suspicious activities
   */
  getUnresolvedActivities(): SuspiciousActivity[] {
    return this.activities.filter(a => !a.resolved);
  }

  /**
   * Resolve suspicious activity
   */
  resolveActivity(activityId: string): void {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.resolved = true;
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Terminate session
   */
  terminateSession(sessionId: string): void {
    for (const [userId, sessions] of this.sessions.entries()) {
      const session = sessions.find(s => s.sessionId === sessionId);
      if (session) {
        session.isActive = false;
        console.log(`Session ${sessionId} terminated for user ${userId}`);
      }
    }
  }

  /**
   * Terminate all sessions for a user
   */
  terminateAllSessions(userId: string): void {
    const sessions = this.sessions.get(userId) || [];
    sessions.forEach(s => s.isActive = false);
    console.log(`All sessions terminated for user ${userId}`);
  }

  /**
   * Get session statistics
   */
  getSessionStats(userId: string): {
    total: number;
    active: number;
    devices: string[];
    locations: string[];
  } {
    const sessions = this.sessions.get(userId) || [];
    const activeSessions = this.getActiveSessions(userId);
    
    return {
      total: sessions.length,
      active: activeSessions.length,
      devices: [...new Set(sessions.map(s => s.deviceType))],
      locations: [...new Set(sessions.map(s => s.location.city))]
    };
  }
}

// Export singleton instance
export const activityMonitor = new ActivityMonitor();

/**
 * Middleware to track user activity
 */
export function trackUserActivity(
  userId: string,
  deviceInfo: any,
  ipAddress: string,
  location: any
): UserSession {
  const session: UserSession = {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    deviceId: deviceInfo.deviceId || 'unknown',
    deviceType: deviceInfo.deviceType || 'desktop',
    browser: deviceInfo.browser || 'unknown',
    ipAddress,
    location: {
      country: location.country || 'Unknown',
      city: location.city || 'Unknown',
      latitude: location.latitude,
      longitude: location.longitude
    },
    createdAt: new Date(),
    lastActivity: new Date(),
    isActive: true
  };

  activityMonitor.trackSession(session);
  return session;
}

/**
 * Update session activity
 */
export function updateSessionActivity(sessionId: string): void {
  // Update lastActivity timestamp
  // In production, this would update the database
  console.log(`Session ${sessionId} activity updated`);
}
