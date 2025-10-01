'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export type SubscriptionTab = 'purchased' | 'hosted' | 'request';

interface SubscriptionTabsProps {
  activeTab: SubscriptionTab;
  onTabChange: (tab: SubscriptionTab) => void;
  counts?: {
    purchased: number;
    hosted: number;
    request: number;
  };
}

export function SubscriptionTabs({ 
  activeTab, 
  onTabChange,
  counts 
}: SubscriptionTabsProps) {
  const tabs: { id: SubscriptionTab; label: string }[] = [
    { id: 'purchased', label: 'Purchased' },
    { id: 'hosted', label: 'Hosted' },
    { id: 'request', label: 'Request' }
  ];

  return (
    <div className="relative">
      <div className="flex gap-1 p-1 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              activeTab === tab.id
                ? 'text-white'
                : 'text-muted hover:text-white'
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-lg shadow-glow"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {tab.label}
              {counts && counts[tab.id] > 0 && (
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  activeTab === tab.id
                    ? 'bg-white/20'
                    : 'bg-white/10'
                )}>
                  {counts[tab.id]}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
