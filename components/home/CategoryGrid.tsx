'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon | string;
  href: string;
  color?: string;
}

interface CategoryGridProps {
  categories: Category[];
  showViewAll?: boolean;
  className?: string;
}

export function CategoryGrid({ 
  categories, 
  showViewAll = true,
  className 
}: CategoryGridProps) {
  return (
    <div className={clsx('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        {showViewAll && (
          <Link 
            href="/categories" 
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            View All
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const Icon = typeof category.icon === 'string' ? null : category.icon;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={category.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    'relative p-6 rounded-2xl',
                    'backdrop-blur-md bg-white/5 border border-white/10',
                    'hover:bg-white/10 hover:border-white/20',
                    'transition-all duration-300',
                    'flex flex-col items-center justify-center gap-3',
                    'aspect-square cursor-pointer group'
                  )}
                >
                  {/* Icon */}
                  <div className={clsx(
                    'p-4 rounded-xl',
                    'bg-gradient-to-br',
                    category.color || 'from-primary/20 to-secondary/20',
                    'group-hover:scale-110 transition-transform'
                  )}>
                    {Icon ? (
                      <Icon className="w-8 h-8" />
                    ) : (
                      <span className="text-3xl">{category.icon}</span>
                    )}
                  </div>

                  {/* Name */}
                  <span className="font-semibold text-center text-sm">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
