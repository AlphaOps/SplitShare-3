'use client';

import { useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { NeonButton } from '@/components/ui/NeonButton';
import { Hero3D } from '@/components/hero/Hero3D';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturesShowcase } from '@/components/sections/FeaturesShowcase';
import { DashboardPreview } from '@/components/sections/DashboardPreview';
import { Comparison } from '@/components/sections/Comparison';
import { Pricing } from '@/components/sections/Pricing';
import { Testimonials } from '@/components/sections/Testimonials';
import { Gamification } from '@/components/sections/Gamification';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { useScrollAnimation } from '@/components/animations/ScrollAnimations';
import { motion } from 'framer-motion';

export default function HomePage() {
  useScrollAnimation();

  return (
    <main className="relative overflow-hidden">
      <NavBar />
      
      {/* Hero Section with 3D Background */}
      <section className="hero-section relative flex min-h-[90vh] items-center justify-center px-6 py-28">
        <Hero3D />
        <div className="hero-parallax absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl"
          >
            Split<span className="text-primary neon">Share</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted"
          >
            AI-powered OTT subscription sharing with automatic password rotation, zero-knowledge security, and 98% savings.
          </motion.p>

          {/* Pricing Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-3xl"
          >
            <div className="glass rounded-2xl p-8 border border-primary/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">₹10</div>
                  <div className="text-sm text-muted">for 30 hours/month</div>
                  <div className="text-xs text-muted mt-1">Netflix Premium 4K</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-secondary mb-2">98%</div>
                  <div className="text-sm text-muted">savings vs full price</div>
                  <div className="text-xs text-muted mt-1">₹639 saved monthly</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-accent mb-2">2h</div>
                  <div className="text-sm text-muted">auto password rotation</div>
                  <div className="text-xs text-muted mt-1">Zero-knowledge security</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <NeonButton href="/book-slot">Book Your Slot</NeonButton>
            <NeonButton href="/#how" variant="secondary" className="bg-secondary">See How It Works</NeonButton>
          </motion.div>
        </div>
      </section>

      {/* Additional sections with scroll animations */}
      <div className="fade-in-section">
        <HowItWorks />
      </div>
      <div className="fade-in-section">
        <FeaturesShowcase />
      </div>
      <div className="fade-in-section">
        <DashboardPreview />
      </div>
      <div className="fade-in-section">
        <Comparison />
      </div>
      <div className="fade-in-section">
        <Pricing />
      </div>
      <div className="fade-in-section">
        <Testimonials />
      </div>
      <div className="fade-in-section">
        <Gamification />
      </div>
      <div className="fade-in-section">
        <FinalCTA />
      </div>
    </main>
  );
}