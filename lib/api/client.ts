export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

export const backend = {
  // Slots
  listSlots: () => api<any[]>('/api/slots'),
  createSlot: (data: any) => api<{ ok: boolean }>('/api/slots', { method: 'POST', body: JSON.stringify(data) }),
  
  // AI
  optimize: (payload: any) => api('/api/ai/optimize', { method: 'POST', body: JSON.stringify(payload) }),
  inactivity: (payload: any) => api('/api/ai/inactivity', { method: 'POST', body: JSON.stringify(payload) }),
  bundle: (payload: any) => api('/api/ai/bundle', { method: 'POST', body: JSON.stringify(payload) }),
  
  // Plans & Subscriptions
  getPlans: () => api<any[]>('/api/plans'),
  getPlan: (id: string) => api<any>(`/api/plans/${id}`),
  subscribe: (data: { planId: string; billingPeriod: 'month' | 'year' }) => 
    api<any>('/api/subscriptions/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  getMySubscription: () => api<any>('/api/subscriptions/my-subscription'),
  cancelSubscription: () => api<any>('/api/subscriptions/cancel', { method: 'POST' }),
  
  // Auth
  register: (data: { email: string; password: string; name: string }) =>
    api<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    api<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => api<any>('/api/users/profile'),
  
  // Pools
  createPool: (data: any) => api<any>('/api/pools', { method: 'POST', body: JSON.stringify(data) }),
  listPools: (platform?: string) => api<any[]>(`/api/pools${platform ? `?platform=${platform}` : ''}`),
  joinPool: (poolId: string, userId: string) => 
    api<any>(`/api/pools/${poolId}/join`, { method: 'POST', body: JSON.stringify({ userId }) }),
  verifyPool: (poolId: string, data: any) =>
    api<any>(`/api/pools/${poolId}/verify`, { method: 'POST', body: JSON.stringify(data) })
};


