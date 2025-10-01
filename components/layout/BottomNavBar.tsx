'use client';

import { motion } from 'framer-motion';
import { Home, Droplets, Calendar, Wallet, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'pools', label: 'Pools', icon: Droplets, href: '/pools' },
  { id: 'subs', label: 'My Subs', icon: Calendar, href: '/my-subscriptions' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/wallet' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Spacer for fixed bottom nav */}
      <div className="h-20 md:h-0" />
      
      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={clsx(
          'fixed bottom-0 left-0 right-0 z-50',
          'backdrop-blur-xl bg-background/80 border-t border-white/10',
          'md:hidden' // Hide on desktop
        )}
      >
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
                           (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link key={item.id} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 py-2"
                >
                  <div className={clsx(
                    'relative p-2 rounded-xl transition-all duration-300',
                    isActive ? 'bg-primary/20' : 'bg-transparent'
                  )}>
                    <Icon className={clsx(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-primary' : 'text-muted'
                    )} />
                    
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-primary/20 shadow-glow"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  
                  <span className={clsx(
                    'text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted'
                  )}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
