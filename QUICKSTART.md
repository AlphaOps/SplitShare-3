# 🚀 SplitShare - Quick Start Guide

## What We Just Built

### ✅ Step 1: Pricing Page
- **Location**: `/app/pricing/page.tsx`
- **URL**: `http://localhost:3000/pricing`
- **Features**:
  - 3 pricing tiers with glassmorphism cards
  - Monthly/Yearly billing toggle
  - 3D hover animations
  - Feature comparison table
  - FAQ accordion
  - Fully responsive design

### ✅ Step 2: Backend API
- **Location**: `/backend/server.ts`
- **Port**: `4000`
- **New Endpoints**:
  - `GET /api/plans` - Fetch all pricing plans
  - `POST /api/subscriptions/subscribe` - Subscribe to a plan
  - `GET /api/subscriptions/my-subscription` - Get user's subscription
  - `POST /api/subscriptions/cancel` - Cancel subscription

### ✅ Step 3: 3D Homepage Animations
- **Hero 3D**: Animated sphere with particles and stars
- **Scroll Animations**: GSAP-powered smooth reveals
- **Framer Motion**: Entrance animations for all sections

---

## 🏃 Running the Project

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Start Frontend
```bash
npm run dev
```
Opens at: **http://localhost:3000**

### 3. Start Backend (in new terminal)
```bash
npm run dev:server
```
Runs at: **http://localhost:4000**

---

## 🎯 Test the Features

### View the Pricing Page
1. Navigate to: `http://localhost:3000/pricing`
2. Toggle between Monthly/Yearly billing
3. Hover over pricing cards to see 3D effects
4. Click FAQ items to expand/collapse
5. Scroll to see smooth animations

### Test the Homepage
1. Navigate to: `http://localhost:3000`
2. Watch the 3D hero animation load
3. Scroll down to see sections fade in
4. Notice the parallax effects

### Test Backend APIs (using curl or Postman)

**Get All Plans:**
```bash
curl http://localhost:4000/api/plans
```

**Register a User:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Subscribe to a Plan (requires auth token):**
```bash
curl -X POST http://localhost:4000/api/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"planId":"pro","billingPeriod":"month"}'
```

---

## 📱 Pages Available

| Page | URL | Status |
|------|-----|--------|
| Homepage | `/` | ✅ Enhanced with 3D |
| Pricing | `/pricing` | ✅ **NEW** |
| Dashboard | `/dashboard` | 🚧 Needs enhancement |
| About | `/about` | ❌ To be created |
| Contact | `/contact` | ❌ To be created |

---

## 🎨 Key Components

### UI Components
- `<GlassCard />` - Glassmorphism card wrapper
- `<NeonButton />` - Glowing button with variants
- `<NavBar />` - Sticky navigation with links

### 3D Components
- `<Hero3D />` - Animated 3D hero scene
- `<AnimatedSection />` - Scroll-triggered animations
- `<StaggeredCards />` - Sequential card reveals

### Sections
- `<Pricing />` - Pricing cards section
- `<HowItWorks />` - Feature explanation
- `<DashboardPreview />` - Dashboard showcase
- `<Testimonials />` - User reviews
- `<Gamification />` - Rewards system

---

## 🔧 Configuration

### Environment Variables
Create `.env.local` in the root:
```env
MONGODB_URI=mongodb://localhost:27017/splitshare
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### MongoDB Setup
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

---

## 🎯 What's Next?

### Immediate Tasks
1. **Create About Page** - Company story and team
2. **Create Contact Page** - Form with validation
3. **Enhance Dashboard** - Subscription management UI
4. **Add Payment Integration** - Stripe or PayPal
5. **Build Auth UI** - Login/Register modals

### Future Enhancements
- Email notifications for subscriptions
- User profile management
- Subscription history and invoices
- Real-time slot availability
- Mobile app (React Native)

---

## 💡 Tips

### Performance
- The 3D hero may be heavy on mobile. Consider lazy loading:
  ```tsx
  const Hero3D = dynamic(() => import('@/components/hero/Hero3D'), { ssr: false });
  ```

### Debugging
- Check browser console for errors
- Use React DevTools for component inspection
- Monitor Network tab for API calls

### Styling
- All colors are in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Custom animations use Framer Motion and GSAP

---

## 📞 Need Help?

- Check `IMPLEMENTATION_SUMMARY.md` for detailed documentation
- Review component files for inline comments
- Test API endpoints with the examples above

---

**Happy Coding! 🎉**
