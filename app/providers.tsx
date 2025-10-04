"use client";
import { useEffect } from 'react';
import Lenis from 'lenis';
import { AuthProvider } from '@/lib/auth/authContext';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable smooth scroll to fix flickering
    // const lenis = new Lenis({
    //   lerp: 0.1,
    //   smoothWheel: true
    // });
    // function raf(time: number) {
    //   lenis.raf(time);
    //   requestAnimationFrame(raf);
    // }
    // requestAnimationFrame(raf);
    // return () => {
    //   lenis?.destroy?.();
    // };
  }, []);
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}


