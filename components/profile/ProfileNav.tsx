'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  MessageSquare, 
  HelpCircle, 
  Lock, 
  FileText, 
  Star,
  Info,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/profile/wishlist', color: 'text-pink-500' },
  { id: 'kyc', label: 'KYC Details', icon: Shield, href: '/profile/kyc', color: 'text-blue-500' },
  { id: 'complaints', label: 'My Complaints', icon: MessageSquare, href: '/profile/complaints', color: 'text-orange-500' },
  { id: 'support', label: 'Support', icon: HelpCircle, href: '/profile/support', color: 'text-secondary' },
  { id: 'privacy', label: 'Privacy Policy', icon: Lock, href: '/profile/privacy', color: 'text-purple-500' },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText, href: '/profile/terms', color: 'text-cyan-500' },
  { id: 'review', label: 'My Review', icon: Star, href: '/profile/review', color: 'text-accent' },
  { id: 'about', label: 'About Us', icon: Info, href: '/about', color: 'text-primary' },
];

interface ProfileNavProps {
  className?: string;
}

export function ProfileNav({ className }: ProfileNavProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {navItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'flex items-center justify-between p-4 rounded-xl',
                  'backdrop-blur-md bg-white/5 border border-white/10',
                  'hover:bg-white/10 hover:border-white/20',
                  'transition-all duration-300 cursor-pointer group'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    'p-2.5 rounded-lg bg-white/5 group-hover:bg-white/10',
                    'transition-colors duration-300'
                  )}>
                    <Icon className={clsx('w-5 h-5', item.color)} />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
