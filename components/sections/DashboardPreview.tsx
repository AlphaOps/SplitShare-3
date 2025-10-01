"use client";
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%'
        }
      });

      // Animate button
      gsap.from(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%'
        }
      });

      // Animate cards with stagger
      gsap.from('.dash-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%'
        }
      });

      // Add hover animations
      gsap.set('.dash-card', { transformOrigin: 'center center' });
      
      const cards = document.querySelectorAll('.dash-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="dashboard" className="px-6 py-24" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 ref={titleRef} className="text-3xl font-bold">Dashboard Preview</h2>
          <div ref={buttonRef}>
            <NeonButton className="animate-glow">Open App</NeonButton>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard className="dash-card">
            <h3 className="mb-2 text-xl font-semibold">Active Slots</h3>
            <p className="text-muted">Netflix 12:00–14:00, Disney+ 18:00–19:00</p>
          </GlassCard>
          <GlassCard className="dash-card">
            <h3 className="mb-2 text-xl font-semibold">Available Subscriptions</h3>
            <p className="text-muted">Netflix, Disney+, Crunchyroll, Prime</p>
          </GlassCard>
          <GlassCard className="dash-card">
            <h3 className="mb-2 text-xl font-semibold">AI Predictions</h3>
            <p className="text-muted">Best bundle: Netflix + Crunchyroll ($10)</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}


