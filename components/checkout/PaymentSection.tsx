'use client';

import { motion } from 'framer-motion';
import { Copy, Share2, Download, HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import clsx from 'clsx';

interface PaymentSectionProps {
  qrCode: string;
  bankDetails: {
    name: string;
    accountType: string;
    upiId: string;
    icon: string;
  };
  onCopyUPI: () => void;
  onShare: () => void;
  onDownload?: () => void;
}

export function PaymentSection({
  qrCode,
  bankDetails,
  onCopyUPI,
  onShare,
  onDownload
}: PaymentSectionProps) {
  return (
    <GlassCard className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />

      <div className="relative z-10 p-8">
        {/* Help Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-all"
        >
          <HelpCircle className="w-6 h-6 text-muted" />
        </motion.button>

        {/* Bank Icon and Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 border-2 border-blue-500/30"
          >
            <span className="text-5xl">{bankDetails.icon}</span>
          </motion.div>
          
          <h3 className="text-xl font-bold mb-1">{bankDetails.name}</h3>
          <p className="text-sm text-green-500 font-semibold">{bankDetails.accountType}</p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
          className="h-1 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6"
        />

        {/* QR Code with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(59,130,246,0.3)',
                '0 0 50px rgba(34,211,238,0.4)',
                '0 0 30px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl blur-xl"
          />

          {/* QR Code Container */}
          <div className="relative p-6 rounded-3xl bg-white mx-auto inline-block">
            {qrCode && (
              <img 
                src={qrCode} 
                alt="Payment QR Code" 
                className="w-72 h-72 mx-auto"
              />
            )}
            
            {/* Center Logo Overlay */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl border-4 border-white"
            >
              <span className="text-2xl">₹</span>
            </motion.div>
          </div>
        </motion.div>

        {/* UPI ID Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex-1 text-center">
              <p className="text-xs text-muted mb-1">UPI ID</p>
              <p className="text-lg font-mono font-bold tracking-wide">{bankDetails.upiId}</p>
            </div>
            <motion.button
              onClick={onCopyUPI}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20"
            >
              <Copy className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {/* Download Button */}
          {onDownload && (
            <motion.button
              onClick={onDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 transition-all font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </motion.button>
          )}

          {/* Share Button */}
          <motion.button
            onClick={onShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 transition-all font-semibold"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </motion.button>
        </motion.div>

        {/* Supported Apps Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 border-t border-white/10"
        >
          <p className="text-xs text-muted text-center mb-3">Supported on all UPI apps</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((app, index) => (
              <motion.div
                key={app}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="px-3 py-1 rounded-lg bg-white/5 text-xs font-semibold text-muted"
              >
                {app}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 mt-4 text-xs text-muted"
          >
            <span>Powered by</span>
            <span className="font-bold text-white">UPI</span>
          </motion.div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
