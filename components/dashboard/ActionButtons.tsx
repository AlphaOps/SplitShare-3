'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ActionButtonsProps {
  onRaiseComplaint: () => void;
  onSendToVerification: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ActionButtons({
  onRaiseComplaint,
  onSendToVerification,
  isLoading = false,
  disabled = false,
  className
}: ActionButtonsProps) {
  return (
    <div className={clsx('flex flex-col sm:flex-row gap-3', className)}>
      {/* Raise Complaint Button */}
      <motion.button
        onClick={onRaiseComplaint}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={clsx(
          'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
          'font-semibold text-white transition-all duration-300',
          'bg-red-600 hover:bg-red-700',
          'shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]',
          'border border-red-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>Raise Complaint</span>
          </>
        )}
      </motion.button>

      {/* Send to Verification Button */}
      <motion.button
        onClick={onSendToVerification}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={clsx(
          'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
          'font-semibold transition-all duration-300',
          'backdrop-blur-md bg-white/5 hover:bg-white/10',
          'border border-white/20 hover:border-white/30',
          'shadow-lg hover:shadow-xl',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send to Verification</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
