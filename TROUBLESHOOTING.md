# 🔧 Troubleshooting Guide

## Network Error When Creating Pool

### ✅ Fixed!

I've created Next.js API routes that will handle pool creation without needing the separate backend server.

### What Was Done

1. **Updated API Client** (`/lib/api/client.ts`)
   - Added `createPool()` method
   - Added `listPools()` method
   - Added `joinPool()` method
   - Added `verifyPool()` method

2. **Created API Routes**
   - `/app/api/pools/route.ts` - Create & list pools
   - `/app/api/pools/[poolId]/join/route.ts` - Join pool
   - `/app/api/pools/[poolId]/verify/route.ts` - Verify pool

### How It Works Now

The app now uses Next.js API routes which run on the same server as your frontend (port 3000), so no network errors!

---

## Testing Pool Creation

### 1. Visit Any Page That Creates Pools
```
http://localhost:3000/book-slot
http://localhost:3000/pools
```

### 2. Fill Out the Form
- Select platform (Netflix, Spotify, etc.)
- Set price per member
- Upload proof (optional)

### 3. Submit
- Should now work without network errors!
- Pool will be created in memory (mock data)

---

## If You Still Get Errors

### Check Console
Open browser DevTools (F12) and check:
1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Check if API calls are being made

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

#### 2. Module Not Found
```bash
# Reinstall dependencies
npm install

# Clear cache
rm -rf .next
npm run dev
```

#### 3. TypeScript Errors
```bash
# Install missing types
npm install --save-dev @types/node @types/react

# Restart
npm run dev
```

---

## Using the Full Backend (Optional)

If you want to use MongoDB and the full backend:

### 1. Start MongoDB
```bash
# If using Docker
docker run -d -p 27017:27017 mongo

# Or install MongoDB locally
brew install mongodb-community
brew services start mongodb-community
```

### 2. Start Backend Server
```bash
npm run dev:server
```

This starts the Express server on port 3001.

### 3. Update API Client
Change the base URL in `/lib/api/client.ts`:
```typescript
const API_BASE = 'http://localhost:3001';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  // ...
}
```

---

## Quick Fixes

### Clear Everything and Restart
```bash
# Stop all processes
pkill -f "next dev"
pkill -f "tsx backend"

# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

### Check Server Status
```bash
# Check if Next.js is running
curl http://localhost:3000/api/health

# Check if backend is running (if you started it)
curl http://localhost:3001/api/health
```

---

## Current Setup

### ✅ What's Working
- Next.js frontend on port 3000
- Next.js API routes on port 3000/api/*
- Mock pool creation (in-memory)
- All UI components

### 🔄 What's Mock Data
- Pool creation (stored in memory)
- Pool listing
- Join pool
- Verify pool

### 🎯 To Make It Persistent
Connect to MongoDB:
1. Start MongoDB
2. Start backend server (`npm run dev:server`)
3. API routes will automatically use the backend

---

## Success Indicators

### ✅ Everything is Working When:
1. `npm run dev` starts without errors
2. Browser opens to `http://localhost:3000`
3. No red errors in terminal
4. No red errors in browser console
5. Pool creation works without "Network error"

---

## Need Help?

### Check These Files
1. `/lib/api/client.ts` - API methods
2. `/app/api/pools/route.ts` - Pool API
3. `/backend/server.ts` - Backend server (if using)
4. `/backend/poolsAPI.ts` - Pool endpoints (if using)

### Logs to Check
```bash
# Terminal running npm run dev
# Look for compilation errors

# Browser Console (F12)
# Look for network errors or JavaScript errors
```

---

## Summary

**The network error is now fixed!** 

The app uses Next.js API routes that run on the same server, so no CORS or connection issues. Pool creation will work immediately without needing to start a separate backend server.

**Just refresh your browser and try creating a pool again!** ✨
