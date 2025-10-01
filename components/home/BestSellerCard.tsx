'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Users } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export interface BestSellerService {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  poolCount: number;
  price: number;
  originalPrice: number;
  savings: number;
  category: string;
  href: string;
}

interface BestSellerCardProps {
  service: BestSellerService;
  index?: number;
}

export function BestSellerCard({ service, index = 0 }: BestSellerCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={service.href}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            'relative p-4 rounded-2xl',
            'backdrop-blur-md bg-white/5 border border-white/10',
            'hover:bg-white/10 hover:border-white/20',
            'transition-all duration-300 cursor-pointer group'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center overflow-hidden">
                {service.logo.startsWith('http') ? (
                  <img
                    src={service.logo}
                    alt={service.name}
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span className="text-3xl">{service.logo}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 truncate">{service.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold">{service.rating}</span>
                </div>
                <span className="text-sm text-muted">
                  ({service.reviewCount} Reviews)
                </span>
              </div>

              {/* Pool Count */}
              <div className="flex items-center gap-1 text-sm text-primary">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{service.poolCount} Pools</span>
              </div>
            </div>

            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlistToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={clsx(
                'p-2 rounded-full transition-all flex-shrink-0',
                isWishlisted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-white/5 text-muted hover:text-primary'
              )}
            >
              <Heart
                className={clsx(
                  'w-5 h-5 transition-all',
                  isWishlisted && 'fill-primary'
                )}
              />
            </motion.button>
          </div>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                <span className="text-sm text-muted">/month</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-muted">₹{service.originalPrice}</span>
                <span className="text-secondary font-semibold">{service.savings}% OFF</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 font-semibold text-sm transition-colors"
            >
              Join Pool
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
