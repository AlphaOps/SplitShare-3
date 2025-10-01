# 🚀 SplitShare Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/splitshare.git
cd splitshare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/splitshare
JWT_SECRET=your-super-secret-jwt-key
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the Application

**Development Mode:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

**Production Mode:**
```bash
npm run build
npm start
```

## 📂 Project Structure

```
splitshare/
├── app/                    # Next.js pages & routes
│   ├── landing/           # Landing page
│   ├── login/             # Authentication
│   ├── home/              # Dashboard
│   ├── pools/             # Pool management
│   └── api/               # API routes
├── backend/               # Express server
│   ├── server.ts          # Main server file
│   └── routes/            # API endpoints
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── home/              # Home components
│   ├── ui/                # UI components
│   └── layout/            # Layout components
├── lib/                   # Utilities & helpers
│   ├── auth/              # Auth context
│   └── utils/             # Helper functions
└── public/                # Static assets
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Database will be created automatically on first run

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)
- `BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL

## 🌐 Deployment

### Vercel (Recommended for Frontend)
```bash
npm install -g vercel
vercel
```

### Backend Deployment
Deploy the backend to:
- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **Heroku** - Popular choice
- **DigitalOcean** - Full control

## 📱 Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run dev:server   # Start Express backend
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 4000
lsof -ti:4000 | xargs kill
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Open an [Issue](https://github.com/YOUR-USERNAME/splitshare/issues)
- Read [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Happy Coding! 🎉**
