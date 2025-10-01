'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface WarningBannerProps {
  message: string;
  type?: 'warning' | 'error' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function WarningBanner({ 
  message, 
  type = 'warning', 
  dismissible = true,
  onDismiss,
  className 
}: WarningBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const colors = {
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-500',
      icon: 'text-yellow-500',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-500',
      icon: 'text-red-500',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
      icon: 'text-blue-500',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    }
  };

  const style = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx(
        'relative p-4 rounded-xl border backdrop-blur-md',
        style.bg,
        style.border,
        style.glow,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={clsx('p-2 rounded-lg bg-white/5 flex-shrink-0')}>
          <AlertTriangle className={clsx('w-5 h-5', style.icon)} />
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className={clsx('text-sm font-medium', style.text)}>
            {message}
          </p>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={clsx(
              'p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0',
              style.text
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
