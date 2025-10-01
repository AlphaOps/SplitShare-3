# 🎬 SplitShare - OTT Subscription Sharing Platform

<div align="center">

![SplitShare](https://img.shields.io/badge/SplitShare-v1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.10-green)
![License](https://img.shields.io/badge/license-MIT-green)

**Share Smarter, Save More** 💰

A modern platform for sharing OTT subscriptions with friends and family. Save up to 92% on Netflix, Spotify, Disney+ Hotstar, Prime Video, and more!

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🎬 SplitShare 🚀

**AI-powered OTT subscription sharing platform with smart slot booking, dynamic pricing, and futuristic neon-glass UI.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.10-green)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

## ✨ Features

### 🎯 Core Features
- **Standard Pools** - Join subscription pools with multiple users
- **Flexible Rentals** - Rent subscriptions for custom durations
- **Instant Gold** - Get immediate access to premium accounts
- **Smart Matching** - AI-powered pool recommendations
- **Real-time Notifications** - Stay updated on pool activities
- **Secure Payments** - Integrated payment gateway
- **Password Rotation** - Automated credential management
- **Slot Booking** - Reserve your spot in advance

### 🎨 UI/UX
- **3D Animations** - Smooth scroll effects and transitions
- **Mobile Responsive** - Optimized for all devices
- **Dark Mode** - Eye-friendly interface
- **Glass Morphism** - Modern design aesthetics
- **Hero Carousel** - Trending series showcase

### 🔐 Security
- **JWT Authentication** - Secure user sessions
- **OTP Verification** - Email-based verification
- **Encrypted Storage** - Protected user data
- **Rate Limiting** - API abuse prevention

## 📸 Demo

### Landing Page
Beautiful hero carousel with trending series, categories, and best sellers.

### Dashboard
Track your subscriptions, pools, and savings in one place.

### Pool Management
Create, join, and manage subscription pools effortlessly.

## Features

### 🤖 **Advanced AI Features**
- **Smart Slot Optimizer**: ML-powered slot allocation with conflict detection and user prioritization
- **Inactivity Detector**: Real-time monitoring with predictive analytics to release unused slots
- **Bundle Suggester**: AI recommendations for cheapest subscription combinations based on viewing habits
- **Ad-Supported Swaps**: Earn credits by watching ads for free time slots
- **Personalized Recommendations**: Content suggestions based on viewing history and preferences

### 🎮 **Gamification System**
- **Credits System**: Earn credits through various activities (sharing, ads, referrals)
- **Badge System**: Unlock achievements for milestones and consistent usage
- **Leaderboard**: Compete with other users for top sharer status
- **Progress Tracking**: Visual progress indicators and streak counters

### 📊 **Live Dashboard**
- **Real-time Slot Management**: Book, modify, and cancel time slots instantly
- **AI Insights Panel**: Live recommendations and optimization suggestions
- **Activity Monitoring**: Track viewing patterns and slot utilization
- **Financial Overview**: Savings tracking and spending analytics

### 🎨 **Futuristic UI/UX**
- **3D Hero Section**: Interactive React Three Fiber animations with neon effects
- **Glassmorphism Design**: Modern glass-card components with backdrop blur
- **Smooth Animations**: GSAP scroll-triggered animations and micro-interactions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Dark Neon Theme**: Custom color palette with glowing effects

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.6
- **Styling**: TailwindCSS with custom theme
- **3D Graphics**: React Three Fiber + Drei
- **Animations**: GSAP + ScrollTrigger, CSS animations
- **State Management**: Zustand
- **Smooth Scrolling**: Lenis

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with real-time collections
- **Authentication**: JWT with bcrypt password hashing
- **AI Logic**: Custom algorithms for optimization and recommendations

### **Deployment**
- **Platform**: Vercel
- **Database**: MongoDB Atlas (production)
- **Environment**: Environment variable configuration
- **CI/CD**: Automatic deployment on push

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SplitShare.git
cd SplitShare
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/splitshare
# or for production: mongodb+srv://username:password@cluster.mongodb.net/splitshare

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Backend
BACKEND_URL=http://localhost:4000
```

4. **Start development servers**
```bash
# Terminal 1: Backend server
npm run dev:server

# Terminal 2: Frontend development
npm run dev
```

5. **Open your browser**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

```
SplitShare/
├── app/                          # Next.js App Router
│   ├── dashboard/               # User dashboard
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── backend/                     # Express.js backend
│   └── server.ts               # API routes and database logic
├── components/                  # React components
│   ├── hero/                   # 3D hero section
│   ├── layout/                 # Navigation components
│   ├── sections/               # Landing page sections
│   └── ui/                     # Reusable UI components
├── lib/                        # Utilities and business logic
│   ├── ai/                     # AI algorithms
│   │   ├── slotOptimizer.ts    # Slot allocation logic
│   │   ├── inactivityDetector.ts # User activity monitoring
│   │   └── bundleSuggester.ts  # Bundle recommendations
│   ├── api/                    # API client utilities
│   └── state/                  # Zustand stores
├── public/                     # Static assets
├── vercel.json                 # Vercel deployment config
└── package.json               # Dependencies and scripts
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### **Slot Management**
- `GET /api/slots` - List user slots
- `POST /api/slots` - Create new slot
- `PUT /api/slots/:id` - Update slot
- `DELETE /api/slots/:id` - Delete slot

### **AI Features**
- `POST /api/ai/optimize` - Optimize slot allocation
- `POST /api/ai/inactivity` - Detect inactive users
- `POST /api/ai/bundle` - Get bundle suggestions
- `GET /api/ai/recommendations` - Personalized recommendations

### **Gamification**
- `GET /api/gamification/leaderboard` - Get leaderboard
- `POST /api/gamification/earn-credits` - Earn credits

### **Monitoring**
- `POST /api/monitoring/activity` - Log user activity
- `GET /api/health` - Health check

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect Next.js

2. **Set Environment Variables**
   In Vercel dashboard, add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitshare
   JWT_SECRET=your-production-jwt-secret
   BACKEND_URL=https://your-backend.vercel.app
   ```

3. **Deploy**
   - Push to main branch
   - Vercel automatically builds and deploys

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Database Setup**

1. **Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

2. **MongoDB Atlas (Recommended for production)**
- Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
- Create cluster
- Get connection string
- Add to environment variables

## 🎯 Usage

### **For Users**
1. **Sign Up**: Create account with email and password
2. **Set Preferences**: Configure viewing habits and budget
3. **Book Slots**: Reserve time slots for your favorite shows
4. **Earn Credits**: Share slots, watch ads, refer friends
5. **Track Progress**: Monitor savings and achievements

### **For Developers**
1. **AI Customization**: Modify algorithms in `lib/ai/`
2. **UI Components**: Add new components in `components/`
3. **API Extensions**: Add endpoints in `backend/server.ts`
4. **Database Schema**: Update MongoDB collections as needed

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start frontend development server
npm run dev:server    # Start backend server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

### **Code Structure**
- **Components**: Reusable UI components with TypeScript
- **AI Logic**: Modular algorithms for easy customization
- **API Routes**: RESTful endpoints with authentication
- **State Management**: Zustand for client-side state
- **Database**: MongoDB with optimized queries

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**
- Use TypeScript for all new code
- Follow existing code style
- Add tests for new features
- Update documentation
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **React Three Fiber** for 3D capabilities
- **TailwindCSS** for utility-first styling
- **GSAP** for smooth animations
- **MongoDB** for database solutions

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/SplitShare/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/SplitShare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SplitShare/discussions)

---

**Built with ❤️ by the SplitShare Team**

*Revolutionizing OTT subscription sharing with AI-powered smart slot management*