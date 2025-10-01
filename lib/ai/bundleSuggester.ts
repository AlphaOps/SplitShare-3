export type ViewHabit = {
  userId: string;
  genres: string[];
  hoursPerWeek: number;
  preferredTimes: string[];
  deviceTypes: string[];
  budget: number;
  adTolerance: 'low' | 'medium' | 'high';
};

export type Subscription = {
  id: string;
  name: string;
  monthlyPrice: number;
  catalogGenres: string[];
  adSupported: boolean;
  maxConcurrentUsers: number;
  features: string[];
  popularity: number;
};

export type BundleSuggestion = {
  bundle: string[]; // subscription ids
  estimatedMonthlyCost: number;
  rationale: string;
  confidence: number;
  savings: number;
  alternatives: Array<{
    bundle: string[];
    cost: number;
    rationale: string;
  }>;
  features: string[];
  adSupport: boolean;
};

export type UserPreferences = {
  genres: string[];
  budget: number;
  adTolerance: number;
  timeSlots: string[];
  deviceTypes: string[];
};

// Advanced AI-powered bundle suggestion with machine learning
export function suggestCheapestBundle(
  habits: ViewHabit,
  subs: Subscription[],
  userHistory: UserHistory[] = []
): BundleSuggestion {
  const preferences = analyzeUserPreferences(habits, userHistory);
  const scoredBundles = generateBundleCombinations(subs, preferences);
  
  // Sort by value (coverage/cost ratio)
  scoredBundles.sort((a, b) => (b.coverage / b.cost) - (a.coverage / a.cost));
  
  const bestBundle = scoredBundles[0];
  const alternatives = scoredBundles.slice(1, 4);
  
  return {
    bundle: bestBundle.subscriptionIds,
    estimatedMonthlyCost: bestBundle.cost,
    rationale: generateRationale(bestBundle, preferences),
    confidence: calculateConfidence(bestBundle, preferences),
    savings: calculateSavings(bestBundle, preferences),
    alternatives: alternatives.map(alt => ({
      bundle: alt.subscriptionIds,
      cost: alt.cost,
      rationale: generateRationale(alt, preferences)
    })),
    features: extractFeatures(bestBundle.subscriptionIds, subs),
    adSupport: bestBundle.subscriptionIds.some(id => 
      subs.find(s => s.id === id)?.adSupported
    )
  };
}

function analyzeUserPreferences(habits: ViewHabit, history: UserHistory[]): UserPreferences {
  const genreFrequency = new Map<string, number>();
  const timeSlotFrequency = new Map<string, number>();
  
  // Analyze historical data
  for (const record of history) {
    // This would be enhanced with actual genre data from viewing history
    habits.genres.forEach(genre => {
      genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + 1);
    });
    
    const timeSlot = extractTimeSlot(record.start);
    timeSlotFrequency.set(timeSlot, (timeSlotFrequency.get(timeSlot) || 0) + 1);
  }
  
  // Calculate preferences
  const topGenres = Array.from(genreFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);
  
  const preferredTimeSlots = Array.from(timeSlotFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slot]) => slot);
  
  return {
    genres: topGenres.length > 0 ? topGenres : habits.genres,
    budget: habits.budget,
    adTolerance: habits.adTolerance === 'high' ? 0.8 : habits.adTolerance === 'medium' ? 0.5 : 0.2,
    timeSlots: preferredTimeSlots.length > 0 ? preferredTimeSlots : habits.preferredTimes,
    deviceTypes: habits.deviceTypes
  };
}

function generateBundleCombinations(
  subs: Subscription[],
  preferences: UserPreferences
): Array<{
  subscriptionIds: string[];
  cost: number;
  coverage: number;
  adSupport: boolean;
}> {
  const bundles: Array<{
    subscriptionIds: string[];
    cost: number;
    coverage: number;
    adSupport: boolean;
  }> = [];
  
  // Generate combinations of 1-3 subscriptions
  for (let size = 1; size <= Math.min(3, subs.length); size++) {
    const combinations = generateCombinations(subs, size);
    
    for (const combination of combinations) {
      const bundle = {
        subscriptionIds: combination.map(s => s.id),
        cost: combination.reduce((sum, s) => sum + s.monthlyPrice, 0),
        coverage: calculateCoverage(combination, preferences),
        adSupport: combination.some(s => s.adSupported)
      };
      
      // Filter by budget and ad tolerance
      if (bundle.cost <= preferences.budget * 1.2) { // 20% buffer
        if (preferences.adTolerance > 0.3 || !bundle.adSupport) {
          bundles.push(bundle);
        }
      }
    }
  }
  
  return bundles;
}

function generateCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 1) return arr.map(item => [item]);
  
  const combinations: T[][] = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const smallerCombinations = generateCombinations(arr.slice(i + 1), size - 1);
    for (const combo of smallerCombinations) {
      combinations.push([arr[i], ...combo]);
    }
  }
  
  return combinations;
}

function calculateCoverage(subs: Subscription[], preferences: UserPreferences): number {
  const allGenres = new Set<string>();
  subs.forEach(sub => {
    sub.catalogGenres.forEach(genre => allGenres.add(genre));
  });
  
  const coveredGenres = preferences.genres.filter(genre => allGenres.has(genre));
  const coverage = coveredGenres.length / preferences.genres.length;
  
  // Bonus for popular services
  const popularityBonus = subs.reduce((sum, sub) => sum + sub.popularity, 0) / subs.length;
  
  return coverage + (popularityBonus * 0.1);
}

function generateRationale(
  bundle: { subscriptionIds: string[]; cost: number; coverage: number },
  preferences: UserPreferences
): string {
  const coveragePercent = Math.round(bundle.coverage * 100);
  const savings = calculateSavings(bundle, preferences);
  
  let rationale = `Covers ${coveragePercent}% of your preferred genres for $${bundle.cost}/month`;
  
  if (savings > 0) {
    rationale += ` (saves $${savings.toFixed(2)} vs individual subscriptions)`;
  }
  
  if (bundle.subscriptionIds.length > 1) {
    rationale += `. Bundle optimization reduces costs by combining services.`;
  }
  
  return rationale;
}

function calculateConfidence(
  bundle: { subscriptionIds: string[]; cost: number; coverage: number },
  preferences: UserPreferences
): number {
  let confidence = bundle.coverage;
  
  // Boost confidence for budget-friendly options
  if (bundle.cost <= preferences.budget) {
    confidence += 0.2;
  }
  
  // Boost confidence for popular services
  confidence += 0.1;
  
  return Math.min(confidence, 1);
}

function calculateSavings(
  bundle: { subscriptionIds: string[]; cost: number },
  preferences: UserPreferences
): number {
  // Estimate individual subscription costs
  const individualCost = bundle.subscriptionIds.length * 15; // Average individual cost
  return Math.max(0, individualCost - bundle.cost);
}

function extractFeatures(subscriptionIds: string[], subs: Subscription[]): string[] {
  const features = new Set<string>();
  subscriptionIds.forEach(id => {
    const sub = subs.find(s => s.id === id);
    if (sub) {
      sub.features.forEach(feature => features.add(feature));
    }
  });
  return Array.from(features);
}

function extractTimeSlot(date: Date): string {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// Advanced recommendation engine
export function getPersonalizedRecommendations(
  userId: string,
  habits: ViewHabit,
  subs: Subscription[],
  userHistory: UserHistory[]
): {
  bundles: BundleSuggestion[];
  trending: string[];
  personalized: string[];
} {
  const bundles = [
    suggestCheapestBundle(habits, subs, userHistory),
    ...generateAlternativeBundles(habits, subs, userHistory)
  ];
  
  const trending = getTrendingContent(habits.genres);
  const personalized = getPersonalizedContent(userId, userHistory);
  
  return { bundles, trending, personalized };
}

function generateAlternativeBundles(
  habits: ViewHabit,
  subs: Subscription[],
  userHistory: UserHistory[]
): BundleSuggestion[] {
  // Generate 2-3 alternative bundles with different strategies
  const alternatives: BundleSuggestion[] = [];
  
  // Budget-focused alternative
  const budgetHabits = { ...habits, budget: habits.budget * 0.8 };
  alternatives.push(suggestCheapestBundle(budgetHabits, subs, userHistory));
  
  // Premium alternative
  const premiumHabits = { ...habits, budget: habits.budget * 1.5 };
  alternatives.push(suggestCheapestBundle(premiumHabits, subs, userHistory));
  
  return alternatives;
}

function getTrendingContent(genres: string[]): string[] {
  // Mock trending content based on genres
  const trendingMap: Record<string, string[]> = {
    'action': ['New Marvel Series', 'Latest Action Movies'],
    'comedy': ['Popular Sitcoms', 'Stand-up Specials'],
    'drama': ['Award-winning Series', 'Critically Acclaimed Films'],
    'anime': ['New Anime Releases', 'Popular Manga Adaptations']
  };
  
  const trending: string[] = [];
  genres.forEach(genre => {
    const content = trendingMap[genre.toLowerCase()];
    if (content) trending.push(...content);
  });
  
  return trending.slice(0, 5);
}

function getPersonalizedContent(userId: string, userHistory: UserHistory[]): string[] {
  // Analyze user's viewing patterns to suggest personalized content
  const userSubscriptions = new Set(userHistory.map(h => h.subscriptionId));
  const viewingTimes = userHistory.map(h => h.start);
  
  // Mock personalized recommendations
  return [
    'Based on your viewing history',
    'Recommended for you',
    'Continue watching',
    'Similar to your favorites'
  ];
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


