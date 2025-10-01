'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset, Check } from 'lucide-react';
import clsx from 'clsx';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

interface TimeSlotSelectorProps {
  selectedSlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
  disabled?: boolean;
}

const slots = [
  { id: 'morning' as TimeSlot, label: 'Morning', time: '6AM - 12PM', icon: Sunrise, color: 'from-orange-500 to-yellow-500' },
  { id: 'afternoon' as TimeSlot, label: 'Afternoon', time: '12PM - 6PM', icon: Sun, color: 'from-yellow-500 to-orange-400' },
  { id: 'evening' as TimeSlot, label: 'Evening', time: '6PM - 12AM', icon: Sunset, color: 'from-purple-500 to-pink-500' },
];

export function TimeSlotSelector({ selectedSlots, onSlotsChange, disabled = false }: TimeSlotSelectorProps) {
  const toggleSlot = (slotId: TimeSlot) => {
    if (disabled) return;
    
    if (selectedSlots.includes(slotId)) {
      onSlotsChange(selectedSlots.filter(s => s !== slotId));
    } else {
      onSlotsChange([...selectedSlots, slotId]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted mb-3">Select Time Slots</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slots.map((slot, index) => {
          const Icon = slot.icon;
          const isSelected = selectedSlots.includes(slot.id);
          
          return (
            <motion.button
              key={slot.id}
              onClick={() => toggleSlot(slot.id)}
              disabled={disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className={clsx(
                'relative p-4 rounded-xl border-2 transition-all duration-300',
                'backdrop-blur-md bg-white/5',
                isSelected
                  ? 'border-primary shadow-glow bg-primary/10'
                  : 'border-white/10 hover:border-white/30',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Gradient Background */}
              {isSelected && (
                <motion.div
                  layoutId="slot-selected"
                  className={clsx(
                    'absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br',
                    slot.color
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative flex items-center gap-3">
                <div className={clsx(
                  'p-2 rounded-lg',
                  isSelected ? 'bg-primary/20' : 'bg-white/10'
                )}>
                  <Icon className={clsx(
                    'w-5 h-5',
                    isSelected ? 'text-primary' : 'text-muted'
                  )} />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{slot.label}</div>
                  <div className="text-xs text-muted">{slot.time}</div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
