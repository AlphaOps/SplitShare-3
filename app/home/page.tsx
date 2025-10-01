'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavBar } from '@/components/layout/NavBar';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestSellerCard, BestSellerService } from '@/components/home/BestSellerCard';
import { motion } from 'framer-motion';
import { Users, Calendar, Zap, TrendingDown, Shield, Clock, Film, Music, Tv, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

// Hero carousel data - Latest trending series with 4K high-quality backdrop images
const heroItems = [
  {
    id: '1',
    title: 'Wednesday',
    image: 'https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    description: 'Season 2 - The supernatural mystery continues'
  },
  {
    id: '2',
    title: 'Stranger Things',
    image: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    description: 'Season 5 - The epic final chapter'
  },
  {
    id: '3',
    title: 'The Last of Us',
    image: 'https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    description: 'HBO\'s masterpiece - Post-apocalyptic survival'
  },
  {
    id: '4',
    title: 'The Badass of Bollywood',
    image: 'https://image.tmdb.org/t/p/w1280/2YJH4NvgNUjxhYJjyqQHJqGKMVo.jpg',
    description: 'Netflix India - Red Chillies Entertainment series'
  },
  {
    id: '5',
    title: 'The Summer I Turned Pretty',
    image: 'https://image.tmdb.org/t/p/w1280/zjD7OE2sx11UrPdOHh8CBB6Zkcq.jpg',
    description: 'Prime Video - Belly, Conrad & Jeremiah love triangle'
  },
  {
    id: '6',
    title: 'Squid Game',
    image: 'https://image.tmdb.org/t/p/w1280/qw3J9cNeLioOLoR68WX7z79aCdK.jpg',
    description: 'Season 2 - The games continue'
  },
  {
    id: '7',
    title: 'Breaking Bad',
    image: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    description: 'The greatest TV series of all time'
  },
  {
    id: '8',
    title: 'Money Heist',
    image: 'https://image.tmdb.org/t/p/w1280/xGexTKCJJVSKHa3NvNMzgt79OzI.jpg',
    description: 'La Casa de Papel - The legendary heist'
  },
  {
    id: '9',
    title: 'The Crown',
    image: 'https://image.tmdb.org/t/p/w1280/2OOQEqjARiL8nVjWOm3YZfEb9Tz.jpg',
    description: 'Netflix royal drama - Final season'
  }
];

// Categories
const categories = [
  { id: '1', name: 'Entertainment', icon: Film, href: '/pools?category=entertainment', color: 'from-primary/20 to-primary/10' },
  { id: '2', name: 'Music', icon: Music, href: '/pools?category=music', color: 'from-secondary/20 to-secondary/10' },
  { id: '3', name: 'TV Shows', icon: Tv, href: '/pools?category=tv', color: 'from-accent/20 to-accent/10' },
  { id: '4', name: 'Gaming', icon: Gamepad2, href: '/pools?category=gaming', color: 'from-primary/20 to-accent/10' },
];

// Bestseller services with real OTT logos
const bestSellers: BestSellerService[] = [
  {
    id: '1',
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    rating: 4.8,
    reviewCount: 1250,
    poolCount: 45,
    price: 49,
    originalPrice: 649,
    savings: 92,
    category: 'Entertainment',
    href: '/pools?platform=Netflix'
  },
  {
    id: '2',
    name: 'Spotify',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    rating: 4.7,
    reviewCount: 980,
    poolCount: 38,
    price: 29,
    originalPrice: 119,
    savings: 76,
    category: 'Music',
    href: '/pools?platform=Spotify'
  },
  {
    id: '4',
    name: 'Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    rating: 4.6,
    reviewCount: 890,
    poolCount: 41,
    price: 35,
    originalPrice: 299,
    savings: 88,
    category: 'Entertainment',
    href: '/pools?platform=Prime Video'
  },
  {
    id: '5',
    name: 'Disney+ Hotstar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
    rating: 4.5,
    reviewCount: 750,
    poolCount: 35,
    price: 25,
    originalPrice: 299,
    savings: 92,
    category: 'Entertainment',
    href: '/pools?platform=Disney+Hotstar'
  },
  {
    id: '6',
    name: 'YouTube Premium',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    rating: 4.4,
    reviewCount: 650,
    poolCount: 28,
    price: 22,
    originalPrice: 129,
    savings: 83,
    category: 'Entertainment',
    href: '/pools?platform=YouTube'
  }
];

const ottPlatforms = [
  { name: 'Netflix', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', color: '#E50914' },
  { name: 'Disney+ Hotstar', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg', color: '#0063E5' },
  { name: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg', color: '#FF0000' },
  { name: 'Spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', color: '#1DB954' },
  { name: 'ZEE5', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Zee5-official-logo.svg', color: '#9B26AF' },
  { name: 'Prime Video', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg', color: '#00A8E1' },
  { name: 'SonyLIV', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/99/SonyLIV_Logo.svg', color: '#FF6B00' }
];

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="relative min-h-screen bg-background">
        <NavBar />

        {/* Hero Carousel Section */}
        <section className="relative px-6 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <HeroCarousel items={heroItems} autoPlayInterval={4000} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <CategoryGrid categories={categories} showViewAll={true} />
          </div>
        </section>

        {/* BestSeller Section */}
        <section className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">BestSeller</h2>
              <Link href="/pools" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                View All
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((service, index) => (
                <BestSellerCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="relative px-6 py-16 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-3xl" />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            OTT Subscription Sharing <br />
            <span className="text-primary">Made Easy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted mb-8 max-w-3xl mx-auto"
          >
            Standard Pools • Flexible Rentals • Instant Gold Access
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <NeonButton href="/pools">Browse Pools</NeonButton>
            <NeonButton href="/pools/create" variant="secondary">Create Pool</NeonButton>
            <NeonButton href="/rentals">Rental Plans</NeonButton>
            <NeonButton href="/instant" variant="secondary">Instant Gold</NeonButton>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div>
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted">Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">50K+</div>
              <div className="text-sm text-muted">Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">9</div>
              <div className="text-sm text-muted">Platforms</div>
            </div>
          </motion.div>
        </section>

        {/* 1. Standard Account Pools */}
        <section className="px-6 py-24 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-4">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Standard Account Pools</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Join a Pool & Share OTT Accounts</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Pool hosts buy subscriptions and share with up to 4 members. Pay only your share!
              </p>
            </motion.div>

            {/* OTT Platform Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12">
              {ottPlatforms.map((platform, i) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Link href={`/pools?platform=${platform.name}`}>
                    <div className="glass rounded-2xl p-6 text-center cursor-pointer border-2 border-white/10 hover:border-primary/50 transition-all">
                      <div className="h-12 mb-2 flex items-center justify-center">
                        {platform.icon.startsWith('http') ? (
                          <img 
                            src={platform.icon} 
                            alt={platform.name}
                            className="h-full w-auto object-contain"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <span className="text-4xl">{platform.icon}</span>
                        )}
                      </div>
                      <div className="text-xs font-medium">{platform.name}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Host or Join</h3>
                    <p className="text-sm text-muted">Create a pool as host or join existing pools as a member</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Verified Subscriptions</h3>
                    <p className="text-sm text-muted">Hosts verify purchases before members get access</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <TrendingDown className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Save Up to 98%</h3>
                    <p className="text-sm text-muted">Split costs with others and save massively</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="text-center mt-8">
              <NeonButton href="/pools">Browse All Pools</NeonButton>
            </div>
          </div>
        </section>

        {/* 2. Rental Plans */}
        <section className="px-6 py-24 bg-gradient-to-b from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-4">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Rental Plans</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Flexible Short-Term Access</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Need OTT for a few days? Book rental plans with flexible pricing
              </p>
            </motion.div>

            {/* Rental Duration Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { days: 1, price: '₹10', popular: false },
                { days: 4, price: '₹35', popular: false },
                { days: 8, price: '₹65', popular: true },
                { days: 30, price: '₹199', popular: false }
              ].map((plan, i) => (
                <motion.div
                  key={plan.days}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className={plan.popular ? 'border-2 border-secondary' : ''}>
                    {plan.popular && (
                      <div className="text-xs font-bold text-secondary mb-2">MOST POPULAR</div>
                    )}
                    <div className="text-3xl font-bold mb-2">{plan.days} Day{plan.days > 1 ? 's' : ''}</div>
                    <div className="text-2xl font-bold text-primary mb-4">{plan.price}</div>
                    <ul className="space-y-2 text-sm text-muted mb-4">
                      <li>✓ Instant booking</li>
                      <li>✓ All platforms</li>
                      <li>✓ Flexible pricing</li>
                    </ul>
                    <NeonButton href="/rentals" className="w-full">Book Now</NeonButton>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* OTT Grid for Rentals */}
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
              {ottPlatforms.map((platform, i) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={`/rentals?platform=${platform.name}`}>
                    <div className="glass rounded-xl p-4 text-center cursor-pointer hover:border-secondary/50 border-2 border-white/10 transition-all">
                      <div className="h-10 flex items-center justify-center">
                        {platform.icon.startsWith('http') ? (
                          <img 
                            src={platform.icon} 
                            alt={platform.name}
                            className="h-full w-auto object-contain"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <span className="text-3xl">{platform.icon}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Instant Gold Plans */}
        <section className="px-6 py-24 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-4">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Instant Gold Plans</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Get Instant Monthly Access</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Premium accounts with instant credential delivery. No waiting!
              </p>
            </motion.div>

            {/* Instant Plan Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { platform: 'Netflix', icon: '🎬', price: 49, stock: 10 },
                { platform: 'Prime Video', icon: '📺', price: 29, stock: 15 },
                { platform: 'Disney+', icon: '✨', price: 39, stock: 8 }
              ].map((plan, i) => (
                <motion.div
                  key={plan.platform}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="border-2 border-accent/30">
                    <div className="text-5xl mb-4">{plan.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{plan.platform}</h3>
                    <div className="text-3xl font-bold text-accent mb-4">₹{plan.price}/mo</div>
                    <div className="flex items-center gap-2 text-sm text-muted mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{plan.stock} slots available</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted mb-6">
                      <li>⚡ Instant access</li>
                      <li>🔐 Secure credentials</li>
                      <li>📅 30-day validity</li>
                      <li>💯 Premium quality</li>
                    </ul>
                    <NeonButton href="/instant" className="w-full">Get Instant Access</NeonButton>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <NeonButton href="/instant" variant="secondary">View All Instant Plans</NeonButton>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="container mx-auto max-w-4xl">
            <GlassCard className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
              <p className="text-muted mb-8 max-w-2xl mx-auto">
                Join thousands of users saving up to 98% on OTT subscriptions
              </p>
              <div className="flex gap-4 justify-center">
                <NeonButton href="/dashboard">Go to Dashboard</NeonButton>
                <NeonButton href="/pools" variant="secondary">Browse Pools</NeonButton>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
