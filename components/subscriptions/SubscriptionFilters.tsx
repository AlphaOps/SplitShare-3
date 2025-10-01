'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface FilterOption {
  value: string;
  label: string;
}

interface SubscriptionFiltersProps {
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
  selectedStatus: string;
  selectedType: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function SubscriptionFilters({
  statusOptions,
  typeOptions,
  selectedStatus,
  selectedType,
  onStatusChange,
  onTypeChange
}: SubscriptionFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<'status' | 'type' | null>(null);

  const FilterDropdown = ({
    label,
    options,
    selected,
    onChange,
    type
  }: {
    label: string;
    options: FilterOption[];
    selected: string;
    onChange: (value: string) => void;
    type: 'status' | 'type';
  }) => {
    const isOpen = openDropdown === type;
    const selectedOption = options.find(opt => opt.value === selected);

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : type)}
          className={clsx(
            'flex items-center justify-between gap-3 px-4 py-3 rounded-xl',
            'backdrop-blur-md bg-white/5 border border-white/10',
            'hover:bg-white/10 hover:border-white/20',
            'transition-all min-w-[160px]',
            isOpen && 'border-primary/50 bg-white/10'
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted">{label}</span>
            <span className="font-semibold">{selectedOption?.label || 'All'}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenDropdown(null)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  'absolute top-full left-0 right-0 mt-2 z-20',
                  'backdrop-blur-xl bg-background/95 border border-white/10',
                  'rounded-xl shadow-2xl overflow-hidden'
                )}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpenDropdown(null);
                    }}
                    className={clsx(
                      'w-full px-4 py-3 text-left transition-colors',
                      'hover:bg-white/10',
                      selected === option.value
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-white'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      <FilterDropdown
        label="Pool Status"
        options={statusOptions}
        selected={selectedStatus}
        onChange={onStatusChange}
        type="status"
      />
      <FilterDropdown
        label="Pool Type"
        options={typeOptions}
        selected={selectedType}
        onChange={onTypeChange}
        type="type"
      />
    </div>
  );
}
