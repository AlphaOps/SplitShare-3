# 🔧 Backend Setup for Netlify Frontend

## Current Situation

✅ **Backend Running**: `http://localhost:4000` (on your machine)  
✅ **Frontend Deployed**: `https://splitsharee.netlify.app`  
❌ **Problem**: Frontend can't access local backend

## Quick Solution: Deploy Backend to Render

### 1. Create `.env` file locally (for testing)

Create a file named `.env` in the project root:

```bash
MONGODB_URI=mongodb://localhost:27017/splitshare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4000
NODE_ENV=development
```

### 2. Deploy to Render (15 minutes)

#### A. Sign up at Render
- Go to https://render.com
- Sign up with GitHub

#### B. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `splitshare-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev:server`
   - **Plan**: Free

#### C. Add Environment Variables in Render
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitshare
JWT_SECRET=generate-a-strong-random-string-here
PORT=4000
NODE_ENV=production
```

#### D. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Get your URL: `https://splitshare-backend.onrender.com`

### 3. Setup MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 Free cluster
4. Database Access → Add User:
   - Username: `splitshare`
   - Password: (generate strong password)
5. Network Access → Add IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   ```
   mongodb+srv://splitshare:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/splitshare
   ```

### 4. Update Netlify Environment Variables

In your Netlify dashboard:
1. Site settings → Environment variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://splitshare-backend.onrender.com
   ```
3. Redeploy site

### 5. Test the Connection

Open browser console on https://splitsharee.netlify.app and run:

```javascript
fetch('https://splitshare-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{"ok": true, "timestamp": "..."}`

## Alternative: Quick Test with ngrok

If you just want to test quickly:

```bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 4000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update Netlify env: NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```

**Note**: ngrok URLs expire when you close terminal. Only for testing!

## Files Updated

✅ `backend/server.ts` - CORS now allows your Netlify domain  
✅ `render.yaml` - Render deployment configuration  
✅ `DEPLOYMENT.md` - Full deployment guide

## Next Steps

1. ✅ Backend is running locally with updated CORS
2. ⏳ Deploy backend to Render (follow steps above)
3. ⏳ Setup MongoDB Atlas
4. ⏳ Update Netlify environment variables
5. ⏳ Test the connection

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.
