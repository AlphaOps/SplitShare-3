'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestSellerCard, BestSellerService } from '@/components/home/BestSellerCard';
import { 
  Sparkles, 
  TrendingDown, 
  Users, 
  Shield, 
  Zap, 
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Film,
  Music,
  Tv,
  Gamepad2
} from 'lucide-react';

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
  }
];

// Categories - redirect to login for non-authenticated users
const categories = [
  { id: '1', name: 'Entertainment', icon: Film, href: '/login', color: 'from-primary/20 to-primary/10' },
  { id: '2', name: 'Music', icon: Music, href: '/login', color: 'from-secondary/20 to-secondary/10' },
  { id: '3', name: 'TV Shows', icon: Tv, href: '/login', color: 'from-accent/20 to-accent/10' },
  { id: '4', name: 'Gaming', icon: Gamepad2, href: '/login', color: 'from-primary/20 to-accent/10' },
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
    href: '/login'
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
    href: '/login'
  },
];

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth spring animation for scroll (reduced on mobile)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 50 : 100,
    damping: isMobile ? 20 : 30,
    restDelta: 0.001
  });

  // 3D transforms based on scroll (lighter on mobile)
  const rotateX = useTransform(smoothProgress, [0, 1], [0, isMobile ? 180 : 360]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, isMobile ? 0.95 : 0.8, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 1]);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/home');
    }

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background with 3D effect */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{
          rotateX,
          transformPerspective: 1000,
        }}
      >
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Header with Logo */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-lg md:text-xl">
                SS
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Split<span className="text-primary">Share</span>
              </h1>
              <p className="text-[10px] md:text-xs text-muted hidden sm:block">Share Smarter, Save More</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-6">
            <a href="#trending" className="text-muted hover:text-text transition-colors text-sm">Trending</a>
            <a href="#categories" className="text-muted hover:text-text transition-colors text-sm">Categories</a>
            <a href="#bestsellers" className="text-muted hover:text-text transition-colors text-sm">Best Sellers</a>
            <a href="#features" className="text-muted hover:text-text transition-colors text-sm">Features</a>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="text-xs md:text-sm text-muted hover:text-text transition-colors">
              Sign In
            </Link>
            <NeonButton href="/signup" className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">Get Started</NeonButton>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section with 3D parallax */}
      <section id="trending" className="relative px-4 md:px-6 pt-8 pb-12">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{
            scale: isMobile ? 1 : scale,
            opacity,
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: isMobile ? 0 : -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0.4 : 0.8, type: "spring" }}
            style={{ transformStyle: isMobile ? 'flat' : 'preserve-3d' }}
          >
            <HeroCarousel items={heroItems} autoPlayInterval={4000} />
          </motion.div>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="relative px-6 py-16 text-center">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                  <Play className="w-10 h-10 text-white" fill="white" />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                SplitShare
              </h1>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Save <span className="text-primary">98%</span> on Your<br />
              Favorite <span className="text-secondary">OTT Subscriptions</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto">
              Share Netflix, Prime, Disney+, and more with others. Pay only for what you watch.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <NeonButton 
              href="/signup" 
              className="text-lg px-8 py-4 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </NeonButton>
            <NeonButton 
              href="/login" 
              variant="secondary"
              className="text-lg px-8 py-4"
            >
              Sign In
            </NeonButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-16"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted">Active Users</div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-secondary mb-2">98%</div>
              <div className="text-sm text-muted">Cost Savings</div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-accent mb-2">9+</div>
              <div className="text-sm text-muted">Platforms</div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Categories Section with 3D tilt */}
      <section id="categories" className="relative px-4 md:px-6 py-8 md:py-12">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, rotateX: isMobile ? 0 : 20 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0.4 : 0.8, type: "spring" }}
          style={{ transformStyle: isMobile ? 'flat' : 'preserve-3d', perspective: isMobile ? 'none' : 1000 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-6"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">📂 Browse by Category</h2>
            <p className="text-sm md:text-base text-muted">Find the perfect subscription for your needs</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CategoryGrid categories={categories} showViewAll={false} />
          </motion.div>
        </motion.div>
      </section>

      {/* BestSeller Section with staggered 3D cards */}
      <section id="bestsellers" className="relative px-4 md:px-6 py-8 md:py-12 bg-gradient-to-b from-transparent to-primary/5">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">⭐ Best Sellers</h2>
                <p className="text-sm md:text-base text-muted">Most popular subscription pools</p>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {bestSellers.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30, rotateX: isMobile ? 0 : -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: isMobile ? index * 0.05 : index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={isMobile ? {} : { 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50,
                  transition: { duration: 0.2 }
                }}
                whileTap={isMobile ? { scale: 0.98 } : {}}
                style={{ transformStyle: isMobile ? 'flat' : 'preserve-3d' }}
              >
                <BestSellerCard service={service} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">Why Choose <span className="text-primary">SplitShare</span>?</h3>
            <p className="text-muted text-lg">Three powerful ways to access your favorite content</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Standard Pools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="h-full border-2 border-primary/30 hover:border-primary/50 transition-all">
                <div className="p-4 rounded-2xl bg-primary/20 w-fit mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Standard Pools</h4>
                <p className="text-muted mb-6">Join or create shared account pools. Split costs with up to 4 members and save massively.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm">Host or join pools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm">Verified subscriptions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm">Save up to 98%</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>

            {/* Rental Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="h-full border-2 border-secondary/30 hover:border-secondary/50 transition-all">
                <div className="p-4 rounded-2xl bg-secondary/20 w-fit mb-6">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Rental Plans</h4>
                <p className="text-muted mb-6">Need access for a few days? Book flexible rental plans from 1 to 30 days.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Flexible duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Instant booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm">All platforms</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>

            {/* Instant Gold */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="h-full border-2 border-accent/30 hover:border-accent/50 transition-all">
                <div className="p-4 rounded-2xl bg-accent/20 w-fit mb-6">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Instant Gold</h4>
                <p className="text-muted mb-6">Get premium monthly accounts with instant credential delivery. No waiting!</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm">Instant access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm">30-day validity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm">Premium quality</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">Built for <span className="text-secondary">Smart Savers</span></h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <TrendingDown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Massive Savings</h4>
                    <p className="text-muted">Save up to 98% compared to individual subscriptions. Pay only for what you actually use.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Secure & Safe</h4>
                    <p className="text-muted">Military-grade encryption, verified subscriptions, and secure payment processing.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">AI-Powered</h4>
                    <p className="text-muted">Smart slot allocation, inactivity detection, and personalized recommendations.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Instant Access</h4>
                    <p className="text-muted">Get started in minutes. No waiting, no hassle. Start streaming right away.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="text-center py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30">
              <h3 className="text-4xl font-bold mb-4">Ready to Start Saving?</h3>
              <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
                Join 50,000+ users who are already saving thousands on OTT subscriptions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NeonButton href="/signup" className="text-lg px-8 py-4">
                  Create Free Account
                </NeonButton>
                <NeonButton href="/login" variant="secondary" className="text-lg px-8 py-4">
                  Sign In
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-muted text-sm">
          <p>© 2025 SplitShare. All rights reserved. Save smart, stream more.</p>
        </div>
      </footer>
    </main>
  );
}
