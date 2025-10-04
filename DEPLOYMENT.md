# 🚀 Backend Deployment Guide

Your backend is currently running locally on `http://localhost:4000`, but your frontend is deployed on Netlify at `https://splitsharee.netlify.app`. To connect them, you need to deploy the backend.

## Option 1: Deploy to Render (Recommended - Free Tier)

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `splitshare-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev:server`
   - **Plan**: Free

### Step 3: Add Environment Variables
In Render dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/splitshare
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
NODE_ENV=production
```

### Step 4: Get Your Backend URL
After deployment, Render will give you a URL like:
```
https://splitshare-backend.onrender.com
```

### Step 5: Update Frontend Environment Variables
In Netlify dashboard, add/update:
```
NEXT_PUBLIC_API_URL=https://splitshare-backend.onrender.com
```

---

## Option 2: Deploy to Railway (Alternative - Free Tier)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Node.js

### Step 3: Add Environment Variables
```
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/splitshare
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
```

### Step 4: Get Your Backend URL
Railway provides a URL like:
```
https://splitshare-backend-production.up.railway.app
```

---

## Option 3: Use ngrok (Temporary - For Testing Only)

If you just want to test quickly without deploying:

### Step 1: Install ngrok
```bash
brew install ngrok
# or download from https://ngrok.com/download
```

### Step 2: Start ngrok
```bash
ngrok http 4000
```

### Step 3: Copy the URL
ngrok will give you a URL like:
```
https://abc123.ngrok.io
```

### Step 4: Update Frontend
In Netlify, set:
```
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```

**Note**: ngrok URLs expire when you close the terminal. This is only for testing!

---

## MongoDB Setup (Required for All Options)

### Option A: MongoDB Atlas (Recommended - Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/splitshare
   ```

### Option B: Local MongoDB (Development Only)
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
mongodb://localhost:27017/splitshare
```

---

## Update CORS Settings

After deploying, update `backend/server.ts` to allow your Netlify domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://splitsharee.netlify.app'
  ],
  credentials: true
}));
```

---

## Testing the Connection

### 1. Test Backend Health
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{"ok": true, "timestamp": "2025-10-02T..."}
```

### 2. Test from Frontend
Open browser console on your Netlify site and run:
```javascript
fetch('https://your-backend-url.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Quick Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set in backend
- [ ] Backend URL updated in Netlify
- [ ] CORS configured for Netlify domain
- [ ] Test `/api/health` endpoint
- [ ] Test authentication endpoints

---

## Current Status

✅ **Backend Running Locally**: `http://localhost:4000`
✅ **Frontend Deployed**: `https://splitsharee.netlify.app`
❌ **Backend Not Accessible**: Frontend can't reach local backend

**Next Step**: Deploy backend to Render or Railway following steps above.

---

## Need Help?

1. **Render Issues**: Check build logs in Render dashboard
2. **MongoDB Connection**: Verify connection string and IP whitelist
3. **CORS Errors**: Check browser console and update CORS settings
4. **Environment Variables**: Double-check all variables are set correctly

---

**Estimated Time**: 15-20 minutes for full deployment
