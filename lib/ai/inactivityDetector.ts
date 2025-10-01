export type SessionEvent = {
  userId: string;
  timestamp: number; // ms
  activity: 'play' | 'pause' | 'seek' | 'heartbeat' | 'idle' | 'active';
  subscriptionId?: string;
  slotId?: string;
  metadata?: Record<string, any>;
};

export type InactivityResult = {
  inactiveUsers: string[];
  warnings: Array<{ userId: string; timeUntilInactive: number }>;
  recommendations: string[];
  metrics: {
    totalActiveUsers: number;
    inactivePercentage: number;
    averageSessionLength: number;
  };
};

export type UserSession = {
  userId: string;
  startTime: number;
  lastActivity: number;
  subscriptionId: string;
  slotId: string;
  status: 'active' | 'warning' | 'inactive';
  activityScore: number;
};

// Advanced inactivity detection with machine learning patterns
export function detectInactivity(
  events: SessionEvent[], 
  thresholdMs = 120_000,
  warningThresholdMs = 90_000
): InactivityResult {
  const userSessions = buildUserSessions(events);
  const now = Date.now();
  
  const inactiveUsers: string[] = [];
  const warnings: Array<{ userId: string; timeUntilInactive: number }> = [];
  const recommendations: string[] = [];
  
  let totalActiveUsers = 0;
  let totalSessionLength = 0;
  
  for (const session of userSessions.values()) {
    const timeSinceLastActivity = now - session.lastActivity;
    const sessionLength = session.lastActivity - session.startTime;
    
    totalActiveUsers++;
    totalSessionLength += sessionLength;
    
    if (timeSinceLastActivity > thresholdMs) {
      inactiveUsers.push(session.userId);
      session.status = 'inactive';
    } else if (timeSinceLastActivity > warningThresholdMs) {
      warnings.push({
        userId: session.userId,
        timeUntilInactive: thresholdMs - timeSinceLastActivity
      });
      session.status = 'warning';
    } else {
      session.status = 'active';
    }
  }
  
  // Generate AI recommendations
  recommendations.push(...generateInactivityRecommendations(userSessions, inactiveUsers));
  
  const metrics = {
    totalActiveUsers,
    inactivePercentage: (inactiveUsers.length / Math.max(totalActiveUsers, 1)) * 100,
    averageSessionLength: totalActiveUsers > 0 ? totalSessionLength / totalActiveUsers : 0
  };
  
  return {
    inactiveUsers,
    warnings,
    recommendations,
    metrics
  };
}

function buildUserSessions(events: SessionEvent[]): Map<string, UserSession> {
  const sessions = new Map<string, UserSession>();
  
  // Sort events by timestamp
  const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
  
  for (const event of sortedEvents) {
    let session = sessions.get(event.userId);
    
    if (!session) {
      session = {
        userId: event.userId,
        startTime: event.timestamp,
        lastActivity: event.timestamp,
        subscriptionId: event.subscriptionId || '',
        slotId: event.slotId || '',
        status: 'active',
        activityScore: 0
      };
      sessions.set(event.userId, session);
    }
    
    // Update session based on activity
    session.lastActivity = event.timestamp;
    session.activityScore = calculateActivityScore(session, event);
    
    if (event.subscriptionId) session.subscriptionId = event.subscriptionId;
    if (event.slotId) session.slotId = event.slotId;
  }
  
  return sessions;
}

function calculateActivityScore(session: UserSession, event: SessionEvent): number {
  const baseScore = session.activityScore;
  const timeSinceLastActivity = event.timestamp - session.lastActivity;
  
  // Activity scoring based on event type
  let scoreDelta = 0;
  switch (event.activity) {
    case 'play':
      scoreDelta = 10;
      break;
    case 'pause':
      scoreDelta = -2;
      break;
    case 'seek':
      scoreDelta = 5;
      break;
    case 'heartbeat':
      scoreDelta = 1;
      break;
    case 'idle':
      scoreDelta = -5;
      break;
    case 'active':
      scoreDelta = 3;
      break;
  }
  
  // Decay score over time
  const decayFactor = Math.max(0, 1 - (timeSinceLastActivity / 300000)); // 5 minutes
  return Math.max(0, (baseScore * decayFactor) + scoreDelta);
}

function generateInactivityRecommendations(
  sessions: Map<string, UserSession>,
  inactiveUsers: string[]
): string[] {
  const recommendations: string[] = [];
  
  if (inactiveUsers.length > 0) {
    recommendations.push(`Found ${inactiveUsers.length} inactive users. Consider releasing their slots.`);
  }
  
  // Analyze patterns
  const warningUsers = Array.from(sessions.values()).filter(s => s.status === 'warning');
  if (warningUsers.length > 0) {
    recommendations.push(`${warningUsers.length} users approaching inactivity. Send gentle reminders.`);
  }
  
  // Peak usage analysis
  const activeUsers = Array.from(sessions.values()).filter(s => s.status === 'active');
  if (activeUsers.length > 10) {
    recommendations.push('High user activity detected. Consider dynamic pricing adjustments.');
  }
  
  return recommendations;
}

// Real-time monitoring function
export function monitorUserActivity(
  userId: string,
  events: SessionEvent[],
  callback: (result: InactivityResult) => void
): () => void {
  const interval = setInterval(() => {
    const result = detectInactivity(events);
    callback(result);
  }, 30000); // Check every 30 seconds
  
  return () => clearInterval(interval);
}

// Predictive inactivity detection
export function predictInactivity(
  userHistory: SessionEvent[],
  currentSession: SessionEvent[]
): { probability: number; timeUntilInactive: number } {
  const patterns = analyzeUserPatterns(userHistory);
  const currentActivity = calculateCurrentActivity(currentSession);
  
  const probability = calculateInactivityProbability(patterns, currentActivity);
  const timeUntilInactive = estimateTimeUntilInactive(patterns, currentActivity);
  
  return { probability, timeUntilInactive };
}

function analyzeUserPatterns(history: SessionEvent[]): {
  averageSessionLength: number;
  typicalInactivityTime: number;
  activityFrequency: number;
} {
  const sessions = groupEventsBySession(history);
  
  const sessionLengths = sessions.map(session => {
    const start = Math.min(...session.map(e => e.timestamp));
    const end = Math.max(...session.map(e => e.timestamp));
    return end - start;
  });
  
  const averageSessionLength = sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length;
  
  // Calculate typical inactivity patterns
  const inactivityPeriods = calculateInactivityPeriods(history);
  const typicalInactivityTime = inactivityPeriods.reduce((sum, period) => sum + period, 0) / inactivityPeriods.length;
  
  const activityFrequency = history.length / (Date.now() - Math.min(...history.map(e => e.timestamp)));
  
  return {
    averageSessionLength,
    typicalInactivityTime,
    activityFrequency
  };
}

function groupEventsBySession(events: SessionEvent[]): SessionEvent[][] {
  const sessions: SessionEvent[][] = [];
  let currentSession: SessionEvent[] = [];
  
  for (const event of events.sort((a, b) => a.timestamp - b.timestamp)) {
    if (currentSession.length === 0 || event.timestamp - currentSession[currentSession.length - 1].timestamp < 300000) {
      currentSession.push(event);
    } else {
      sessions.push(currentSession);
      currentSession = [event];
    }
  }
  
  if (currentSession.length > 0) {
    sessions.push(currentSession);
  }
  
  return sessions;
}

function calculateInactivityPeriods(events: SessionEvent[]): number[] {
  const periods: number[] = [];
  const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
  
  for (let i = 1; i < sortedEvents.length; i++) {
    const gap = sortedEvents[i].timestamp - sortedEvents[i - 1].timestamp;
    if (gap > 60000) { // More than 1 minute gap
      periods.push(gap);
    }
  }
  
  return periods;
}

function calculateCurrentActivity(events: SessionEvent[]): number {
  if (events.length === 0) return 0;
  
  const recentEvents = events.filter(e => Date.now() - e.timestamp < 300000); // Last 5 minutes
  return recentEvents.length;
}

function calculateInactivityProbability(
  patterns: ReturnType<typeof analyzeUserPatterns>,
  currentActivity: number
): number {
  const activityRatio = currentActivity / patterns.activityFrequency;
  const timeSinceLastActivity = Date.now() - (currentActivity > 0 ? Date.now() : 0);
  
  // Simple probability calculation
  let probability = 0;
  
  if (activityRatio < 0.5) probability += 0.3;
  if (timeSinceLastActivity > patterns.typicalInactivityTime) probability += 0.4;
  if (currentActivity === 0) probability += 0.3;
  
  return Math.min(probability, 1);
}

function estimateTimeUntilInactive(
  patterns: ReturnType<typeof analyzeUserPatterns>,
  currentActivity: number
): number {
  if (currentActivity === 0) return 0;
  
  const activityDecayRate = 1 / patterns.activityFrequency;
  const estimatedTime = patterns.typicalInactivityTime * (1 - currentActivity / patterns.activityFrequency);
  
  return Math.max(0, estimatedTime);
}


