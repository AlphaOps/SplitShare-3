'use client';

import Link from 'next/link';
import { NeonButton } from '@/components/ui/NeonButton';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { useAuth } from '@/lib/auth/authContext';
import { LogOut, User } from 'lucide-react';

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={isAuthenticated ? "/home" : "/"} className="text-lg font-semibold">
          Split<span className="text-primary">Share</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <nav className="hidden gap-6 md:flex">
              <Link href="/home" className="text-muted hover:text-text transition-colors">Home</Link>
              <Link href="/pools" className="text-muted hover:text-text transition-colors">Pools</Link>
              <Link href="/rentals" className="text-muted hover:text-text transition-colors">Rentals</Link>
              <Link href="/instant" className="text-muted hover:text-text transition-colors">Instant</Link>
              <Link href="/book-slot" className="text-muted hover:text-text transition-colors">Book Slot</Link>
              <Link href="/dashboard" className="text-muted hover:text-text transition-colors">Dashboard</Link>
            </nav>
            <div className="flex items-center gap-4">
              <NotificationSystem />
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <nav className="hidden gap-6 md:flex">
              <Link href="/landing#features" className="text-muted hover:text-text transition-colors">Features</Link>
              <Link href="/landing#benefits" className="text-muted hover:text-text transition-colors">Benefits</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-muted hover:text-text transition-colors">
                Sign In
              </Link>
              <NeonButton href="/signup">Sign Up</NeonButton>
            </div>
          </>
        )}
      </div>
    </header>
  );
}


