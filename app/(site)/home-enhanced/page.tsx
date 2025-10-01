'use client';

import { NavBar } from '@/components/layout/NavBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid, Category } from '@/components/home/CategoryGrid';
import { BestSellerCard, BestSellerService } from '@/components/home/BestSellerCard';
import { motion } from 'framer-motion';
import { 
  Tv, 
  Music, 
  Gamepad2, 
  BookOpen, 
  Dumbbell,
  ShoppingBag,
  Bell
} from 'lucide-react';

export default function HomeEnhancedPage() {
  // Hero Carousel Data
  const carouselItems = [
    {
      id: '1',
      title: 'Wednesday Season 2',
      image: 'https://images.unsplash.com/photo-1574267432644-f610f5ef2bf4?w=1200&h=600&fit=crop',
      description: 'Stream the latest season on Netflix Premium',
      link: '/pools/netflix'
    },
    {
      id: '2',
      title: 'Stranger Things',
      image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=600&fit=crop',
      description: 'Join a pool and save 98% on your subscription',
      link: '/pools/netflix'
    },
    {
      id: '3',
      title: 'The Last of Us',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
      description: 'Available on HBO Max - Join now',
      link: '/pools/hbo'
    }
  ];

  // Categories Data
  const categories: Category[] = [
    { id: '1', name: 'Entertainment', icon: Tv, href: '/categories/entertainment', color: 'from-red-500 to-pink-500' },
    { id: '2', name: 'Music', icon: Music, href: '/categories/music', color: 'from-green-500 to-teal-500' },
    { id: '3', name: 'Gaming', icon: Gamepad2, href: '/categories/gaming', color: 'from-purple-500 to-indigo-500' },
    { id: '4', name: 'Education', icon: BookOpen, href: '/categories/education', color: 'from-blue-500 to-cyan-500' },
    { id: '5', name: 'Fitness', icon: Dumbbell, href: '/categories/fitness', color: 'from-orange-500 to-red-500' },
    { id: '6', name: 'Shopping', icon: ShoppingBag, href: '/categories/shopping', color: 'from-yellow-500 to-orange-500' },
  ];

  // Best Seller Services
  const bestSellers: BestSellerService[] = [
    {
      id: '1',
      name: 'Crunchyroll',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png',
      rating: 4.5,
      reviewCount: 1250,
      poolCount: 45,
      price: 5,
      originalPrice: 99,
      savings: 95,
      category: 'Entertainment',
      href: '/pools/crunchyroll'
    },
    {
      id: '2',
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      rating: 4.8,
      reviewCount: 2340,
      poolCount: 89,
      price: 4,
      originalPrice: 119,
      savings: 96,
      category: 'Music',
      href: '/pools/spotify'
    },
    {
      id: '3',
      name: 'Netflix Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      rating: 4.9,
      reviewCount: 5670,
      poolCount: 156,
      price: 10,
      originalPrice: 649,
      savings: 98,
      category: 'Entertainment',
      href: '/pools/netflix'
    },
    {
      id: '4',
      name: 'Amazon Prime',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
      rating: 4.7,
      reviewCount: 3450,
      poolCount: 123,
      price: 6,
      originalPrice: 179,
      savings: 96,
      category: 'Entertainment',
      href: '/pools/prime'
    },
    {
      id: '5',
      name: 'Disney+ Hotstar',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
      rating: 4.6,
      reviewCount: 2890,
      poolCount: 98,
      price: 8,
      originalPrice: 299,
      savings: 97,
      category: 'Entertainment',
      href: '/pools/hotstar'
    },
    {
      id: '6',
      name: 'YouTube Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      rating: 4.4,
      reviewCount: 1890,
      poolCount: 67,
      price: 7,
      originalPrice: 129,
      savings: 94,
      category: 'Entertainment',
      href: '/pools/youtube'
    }
  ];

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24 pb-32">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-1">
              Hello <span className="text-primary">Ninad</span>
            </h1>
            <p className="text-muted">Welcome back to SplitShare</p>
          </motion.div>

          {/* Notification Bell */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-3 rounded-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </motion.button>
        </div>

        {/* Hero Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <HeroCarousel items={carouselItems} />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <CategoryGrid categories={categories} />
        </motion.div>

        {/* Best Seller Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">BestSeller</h2>
            <a 
              href="/pools" 
              className="text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((service, index) => (
              <BestSellerCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Trending Pools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🔥 Trending Pools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestSellers.slice(0, 4).map((service, index) => (
              <BestSellerCard
                key={`trending-${service.id}`}
                service={service}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'My Pools', icon: '🏊', href: '/my-subscriptions', color: 'from-blue-500 to-cyan-500' },
            { label: 'Wallet', icon: '💰', href: '/wallet', color: 'from-green-500 to-teal-500' },
            { label: 'Referrals', icon: '🎁', href: '/referrals', color: 'from-purple-500 to-pink-500' },
            { label: 'Support', icon: '💬', href: '/support', color: 'from-orange-500 to-red-500' }
          ].map((action, index) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center group"
            >
              <div className={`text-4xl mb-3 bg-gradient-to-br ${action.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block`}>
                {action.icon}
              </div>
              <div className="font-semibold">{action.label}</div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      <BottomNavBar />
    </main>
  );
}
